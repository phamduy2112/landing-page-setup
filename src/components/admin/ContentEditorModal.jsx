import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Image as ImageIcon,
  Type,
  Upload,
  Link as LinkIcon,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
  FileText,
  Tag,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import CustomCodeRenderer from './CustomCodeRenderer';
import ResponsiveIframe from './ResponsiveIframe';

/**
 * Scan custom code and extract all image URLs
 */
function extractImagesFromCode(code) {
  if (!code || typeof code !== 'string') return [];
  const images = [];
  const seen = new Set();

  // Pattern 1: src="..." or src='...'
  const srcRegex = /src\s*=\s*(?:["']([^"']+)["']|\{\s*["']([^"']+)["']\s*\})/g;
  let match;
  while ((match = srcRegex.exec(code)) !== null) {
    const src = match[1] || match[2];
    if (src && !seen.has(src) && !src.startsWith('data:image/svg')) {
      seen.add(src);
      images.push({
        id: `img-${images.length}`,
        originalSrc: src,
        currentSrc: src,
        label: src.toLowerCase().includes('logo') ? 'Logo Thương Hiệu' : `Hình Ảnh #${images.length + 1}`,
      });
    }
  }

  // Pattern 2: (img|image|avatar|banner|thumbnail)\s*:\s*["']([^"']+)["']
  const propRegex = /(?:img|image|avatar|banner|thumbnail|poster)\s*:\s*["']([^"']+)["']/g;
  while ((match = propRegex.exec(code)) !== null) {
    const src = match[1];
    if (src && !seen.has(src) && (src.includes('/') || src.includes('.'))) {
      seen.add(src);
      images.push({
        id: `img-${images.length}`,
        originalSrc: src,
        currentSrc: src,
        label: `Ảnh Minh Họa #${images.length + 1}`,
      });
    }
  }

  return images;
}

/**
 * Scan custom code and extract readable text fields (verbatim substrings)
 */
function extractTextsFromCode(code) {
  if (!code || typeof code !== 'string') return [];
  const texts = [];
  const seen = new Set();

  // 1. Props with string values: title="...", eyebrow="...", highlight="...", subtitle="...", text="..."
  const propRegex = /(?:title|eyebrow|highlight|subtitle|badgeText|ctaPrimary|ctaSecondary|desc|text|heading)\s*=\s*(?:["']([^"']+)["']|\{\s*["']([^"']+)["']\s*\})/g;
  let match;
  while ((match = propRegex.exec(code)) !== null) {
    const val = match[1] || match[2];
    if (val && val.trim().length > 1 && !seen.has(val)) {
      seen.add(val);
      texts.push({
        id: `prop-${texts.length}`,
        originalText: val,
        currentText: val,
        label: `Tiêu Đề / Nhãn: "${val.length > 28 ? val.slice(0, 28) + '...' : val}"`,
      });
    }
  }

  // 2. Headings with direct text: <h[1-6][^>]*>([^<]+)<\/h[1-6]>
  const directHRegex = /<h([1-6])[^>]*>([^<{]+)<\/h\1>/g;
  while ((match = directHRegex.exec(code)) !== null) {
    const val = match[2].trim();
    if (val && val.length > 1 && !seen.has(val)) {
      seen.add(val);
      texts.push({
        id: `h-${texts.length}`,
        originalText: val,
        currentText: val,
        label: `Tiêu Đề H${match[1]}: "${val.length > 28 ? val.slice(0, 28) + '...' : val}"`,
      });
    }
  }

  // 3. Headings with nested tags: extract verbatim text chunks
  const hWithTagsRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g;
  while ((match = hWithTagsRegex.exec(code)) !== null) {
    const inner = match[2];
    const textPieces = inner.split(/<[^>]+>/).map((s) => s.trim()).filter((s) => s.length > 2 && !s.includes('{') && !s.includes('}'));
    for (const piece of textPieces) {
      if (!seen.has(piece)) {
        seen.add(piece);
        texts.push({
          id: `h-piece-${texts.length}`,
          originalText: piece,
          currentText: piece,
          label: `Đoạn Tiêu Đề H${match[1]}: "${piece}"`,
        });
      }
    }
  }

  // 4. Object properties in data arrays: title: "...", desc: "...", cta: "..."
  const objRegex = /(?:title|desc|subtitle|cta|label|name)\s*:\s*["']([^"']+)["']/g;
  while ((match = objRegex.exec(code)) !== null) {
    const val = match[1].trim();
    if (val && val.length > 1 && !seen.has(val)) {
      seen.add(val);
      texts.push({
        id: `obj-${texts.length}`,
        originalText: val,
        currentText: val,
        label: `Mục Dữ Liệu: "${val.length > 28 ? val.slice(0, 28) + '...' : val}"`,
      });
    }
  }

  // 5. Paragraphs with direct text: <p[^>]*>([^<]+)<\/p>
  const directPRegex = /<p[^>]*>([^<{]+)<\/p>/g;
  while ((match = directPRegex.exec(code)) !== null) {
    const val = match[1].trim();
    if (val && val.length > 2 && !seen.has(val)) {
      seen.add(val);
      texts.push({
        id: `p-${texts.length}`,
        originalText: val,
        currentText: val,
        label: `Đoạn Văn Mô Tả: "${val.length > 30 ? val.slice(0, 30) + '...' : val}"`,
      });
    }
  }

  return texts;
}

export default function ContentEditorModal({
  isOpen,
  onClose,
  item,
  onSave,
  activeTheme,
  activeFont,
  activeRadius = 16,
}) {
  if (!isOpen || !item) return null;

  const isCustom = item.isCustom || item.sectionDef?.isCustom;
  const initialCode = item.customCode || item.sectionDef?.customCode || '';
  const initialData = item.customData || item.sectionDef?.defaultData || {};

  const [activeTab, setActiveTab] = useState('texts'); // 'texts' | 'images'
  const [previewViewport, setPreviewViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [sectionTitle, setSectionTitle] = useState(
    item.name || item.sectionDef?.name || 'Section Tùy Biến'
  );
  const [workingData, setWorkingData] = useState({ ...initialData });

  // Extracted elements for custom code sections
  const [imagesList, setImagesList] = useState([]);
  const [textsList, setTextsList] = useState([]);

  // Sync state when item changes
  useEffect(() => {
    setSectionTitle(item.name || item.sectionDef?.name || 'Section Tùy Biến');
    if (isCustom) {
      const code = item.customCode || item.sectionDef?.customCode || '';
      setImagesList(extractImagesFromCode(code));
      setTextsList(extractTextsFromCode(code));
    } else {
      setWorkingData({ ...(item.customData || item.sectionDef?.defaultData || {}) });
    }
  }, [item, isCustom]);

  // Compute final code dynamically from initialCode + all replacements
  const computedCode = useMemo(() => {
    if (!isCustom) return '';
    let res = initialCode;

    // 1. Apply image replacements
    for (const img of imagesList) {
      if (img.originalSrc && img.currentSrc && img.originalSrc !== img.currentSrc) {
        res = res.replaceAll(img.originalSrc, img.currentSrc);
      }
    }

    // 2. Apply text replacements
    for (const t of textsList) {
      if (t.originalText && t.currentText && t.originalText !== t.currentText) {
        res = res.replaceAll(t.originalText, t.currentText);
      }
    }

    return res;
  }, [initialCode, imagesList, textsList, isCustom]);

  // Handle image upload from computer (FileReader)
  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result;
      if (typeof base64Url === 'string') {
        if (isCustom) {
          setImagesList((prev) =>
            prev.map((img) => (img.id === id ? { ...img, currentSrc: base64Url } : img))
          );
        } else {
          setWorkingData((prev) => ({
            ...prev,
            [id]: base64Url,
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle manual image URL change
  const handleImageUrlChange = (id, newSrc) => {
    if (isCustom) {
      setImagesList((prev) =>
        prev.map((img) => (img.id === id ? { ...img, currentSrc: newSrc } : img))
      );
    } else {
      setWorkingData((prev) => ({
        ...prev,
        [id]: newSrc,
      }));
    }
  };

  // Handle text edit
  const handleTextChange = (id, newText) => {
    if (isCustom) {
      setTextsList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, currentText: newText } : t))
      );
    } else {
      setWorkingData((prev) => ({
        ...prev,
        [id]: newText,
      }));
    }
  };

  // Save changes back to canvas
  const handleSave = () => {
    const finalName = sectionTitle.trim() || item.name || item.sectionDef?.name || 'Section';
    if (isCustom) {
      onSave({
        instanceId: item.instanceId,
        name: finalName,
        customCode: computedCode,
        isCustom: true,
      });
    } else {
      onSave({
        instanceId: item.instanceId,
        name: finalName,
        customData: workingData,
        isCustom: false,
      });
    }
    onClose();
  };

  const Component = item.sectionDef?.component;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[94vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-white">
                  Chỉnh Sửa Nội Dung & Hình Ảnh
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30 font-mono">
                  {isCustom ? 'Custom JSX' : 'Preset Section'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sửa trực quan tiêu đề, văn bản, thay thế hình ảnh hoặc tải ảnh mới từ máy tính
              </p>
            </div>
          </div>

          {/* Section Name / Title Input */}
          <div className="flex-1 max-w-xs sm:max-w-sm hidden md:block">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Tên Section Trên Thanh Công Cụ</span>
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="VD: Hero Khóa Học Mới"
              className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
            />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('texts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'texts'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              <Type className="w-4 h-4 text-amber-900" />
              <span>✍️ Tiêu Đề & Nội Dung Chữ {isCustom ? `(${textsList.length})` : ''}</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'images'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-black'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>🖼️ Hình Ảnh {isCustom ? `(${imagesList.length})` : ''}</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            💡 Xem trước cập nhật trực tiếp theo thời gian thực ở cột bên phải
          </span>
        </div>

        {/* Modal Main Split: Controls on Left, Live Preview on Right */}
        <div className="flex-1 grid lg:grid-cols-12 min-h-0 bg-slate-950">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 p-4 sm:p-6 overflow-y-auto space-y-6 border-r border-slate-800">
            
            {/* Mobile Section Name Input */}
            <div className="md:hidden pb-3 border-b border-slate-800">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mb-1">
                Tên Section Trên Thanh Công Cụ
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="VD: Hero Khóa Học Mới"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-bold"
              />
            </div>

            {/* TAB: TEXTS */}
            {activeTab === 'texts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-amber-400" />
                    <span>Nội Dung Văn Bản Trong Section</span>
                  </h4>
                </div>

                {isCustom ? (
                  textsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-2">
                      <FileText className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
                      <p className="text-xs">Không tự động tìm thấy các chuỗi văn bản cố định trong section này.</p>
                      <p className="text-[11px] text-slate-500">Bạn có thể bấm "Sửa Code" để chỉnh sửa trực tiếp nội dung JSX.</p>
                    </div>
                  ) : (
                    textsList.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400/90 truncate max-w-[280px]">
                            {t.label}
                          </label>
                        </div>
                        {t.currentText.length > 50 ? (
                          <textarea
                            rows={3}
                            value={t.currentText}
                            onChange={(e) => handleTextChange(t.id, e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={t.currentText}
                            onChange={(e) => handleTextChange(t.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                          />
                        )}
                      </div>
                    ))
                  )
                ) : (
                  /* Standard preset section text keys */
                  Object.entries(workingData).map(([key, val]) => {
                    if (typeof val !== 'string' || key.toLowerCase().includes('image') || val.length > 500) {
                      return null;
                    }
                    const fieldLabel =
                      key === 'title'
                        ? 'Tiêu Đề Chính (Title)'
                        : key === 'subtitle'
                        ? 'Tiêu Đề Phụ (Subtitle)'
                        : key === 'badgeText'
                        ? 'Huy Hiệu / Badge'
                        : key === 'ctaPrimary'
                        ? 'Nút Hành Động Chính'
                        : key === 'ctaSecondary'
                        ? 'Nút Hành Động Phụ'
                        : key;

                    return (
                      <div key={key} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                          {fieldLabel}
                        </label>
                        {val.length > 50 ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: IMAGES */}
            {activeTab === 'images' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Danh Sách Hình Ảnh Trong Section</span>
                  </h4>
                </div>

                {isCustom ? (
                  imagesList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-2">
                      <ImageIcon className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
                      <p className="text-xs">Không tìm thấy thẻ &lt;img&gt; hoặc đường dẫn ảnh trong mã nguồn của section này.</p>
                      <p className="text-[11px] text-slate-500">Bạn có thể dùng nút "Sửa Code" để thêm thẻ ảnh &lt;img src="..." /&gt;.</p>
                    </div>
                  ) : (
                    imagesList.map((img) => (
                      <div
                        key={img.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-white">
                            {img.label}
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                            Đang dùng
                          </span>
                        </div>

                        {/* Image Preview Thumbnail */}
                        <div className="relative h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group/img">
                          <img
                            src={img.currentSrc}
                            alt="Preview"
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.src =
                                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                            }}
                          />
                        </div>

                        {/* Action: Upload File */}
                        <div className="flex items-center gap-2">
                          <label className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-amber-300" />
                            <span>Tải Ảnh Từ Máy Tính</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(img.id, e.target.files?.[0])}
                            />
                          </label>
                        </div>

                        {/* Action: Or Paste URL */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Hoặc Link URL Ảnh / Đường dẫn:
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={img.currentSrc}
                              onChange={(e) => handleImageUrlChange(img.id, e.target.value)}
                              placeholder="/assets/LOGO2.png hoặc https://..."
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* Standard preset section images */
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="font-heading font-bold text-xs text-white">Ảnh Minh Họa Section</span>
                    <div className="relative h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                      <img
                        src={workingData.heroImage || workingData.image || '/assets/LOGO2.png'}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <label className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tải Ảnh Mới Từ Máy Tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('heroImage', e.target.files?.[0])}
                      />
                    </label>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Hoặc nhập Link URL ảnh:
                      </label>
                      <input
                        type="text"
                        value={workingData.heroImage || workingData.image || ''}
                        onChange={(e) => handleImageUrlChange('heroImage', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Live Preview Pane */}
          <div className="lg:col-span-7 bg-slate-900 p-4 sm:p-6 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Xem Trước Trực Tiếp (Live Preview)</span>
              </span>

              {/* Viewport Device Buttons */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    previewViewport === 'desktop'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Laptop (100%)"
                >
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">Laptop</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('tablet')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    previewViewport === 'tablet'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3 h-3" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    previewViewport === 'mobile'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile (390px)"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>390px</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center items-start overflow-y-auto">
              <div
                className={`transition-all duration-300 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-700/60 bg-white ${
                  previewViewport === 'mobile'
                    ? 'max-w-[390px]'
                    : previewViewport === 'tablet'
                    ? 'max-w-[768px]'
                    : 'w-full'
                }`}
              >
                <ResponsiveIframe
                  viewport={previewViewport}
                  activeTheme={activeTheme}
                  activeFont={activeFont}
                  activeRadius={activeRadius}
                  minHeight={80}
                >
                  {isCustom ? (
                    <CustomCodeRenderer
                      code={computedCode}
                      activeTheme={activeTheme}
                      activeFont={activeFont}
                      activeRadius={activeRadius}
                    />
                  ) : Component ? (
                    <Component data={workingData} />
                  ) : (
                    <div className="p-8 text-center text-slate-400">Không có preview.</div>
                  )}
                </ResponsiveIframe>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Thay đổi sẽ được lưu vào bộ nhớ và hiển thị trực tiếp lên Canvas khi bấm lưu.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition"
            >
              Hủy
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thay Đổi Vào Trang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
