import React, { useState, useEffect } from 'react';
import {
  Code,
  FileText,
  Download,
  Copy,
  Check,
  Trash2,
  Plus,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  Sliders,
  X,
  Layers,
  ArrowRight,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Type,
  Heading,
  ArrowUp,
  ArrowDown,
  Columns,
  PlusCircle,
  Image as ImageIcon,
  ShieldCheck,
  BarChart2,
  Maximize2,
  Link as LinkIcon,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { getSectionSourceCode } from '../../data/sectionsRawCode';
import {
  BLOCK_META_MAP,
  ADDABLE_BLOCK_TEMPLATES,
  reorderArray,
  generateUpdatedSectionJsx,
} from '../../utils/sectionBlockManager';
import {
  PRESET_IMAGE_SUGGESTIONS,
  extractSectionImages,
  replaceImageInCode,
  scanLinkableContainers,
  convertDivToAnchorWithHref,
} from '../../utils/sectionElementTransform';
import {
  normalizeColorsToPrimary,
  switchSectionColorTheme,
} from '../../utils/sectionColorTransform';

/**
 * InlineSectionLiveEditor:
 * WordPress Gutenberg-style inline wireframe visual block editor,
 * live on-screen JSX code editor, sub-component position reordering,
 * column layout flip (Image Left <-> Right), component adder/remover,
 * and instant 1-click section code exporter.
 */
export default function InlineSectionLiveEditor({
  item,
  isOpen = false,
  initialTab = 'wireframe',
  onClose,
  onUpdateCode,
  onUpdateData,
  onUpdateStyles,
  onUpdateLayout,
  activeTheme,
  activeFont,
  activeRadius = 16,
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab || 'wireframe');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Initial code retrieval
  const defaultSourceCode = getSectionSourceCode(item);
  const [liveCode, setLiveCode] = useState(item.customCode || defaultSourceCode);

  // Sync when item changes
  useEffect(() => {
    if (item.customCode) {
      setLiveCode(item.customCode);
    } else {
      setLiveCode(getSectionSourceCode(item));
    }
  }, [item.instanceId, item.customCode]);

  // Extract editable text fields from item.customData or defaults
  const customData = item.customData || item.sectionDef?.defaultData || {};

  // Layout Settings State (Column Flip, Blocks Order, Deleted Blocks, Extra Blocks)
  const initialLayout = item.layoutSettings || {};
  const [columnFlip, setColumnFlip] = useState(initialLayout.columnFlip || 'default');
  const [extraBlocks, setExtraBlocks] = useState(initialLayout.extraBlocks || []);
  const [deletedBlocks, setDeletedBlocks] = useState(() => {
    return initialLayout.deletedBlocks || item.deletedFields || [];
  });

  const baseKeys = Object.keys(customData).filter(
    (k) => typeof customData[k] === 'string'
  );

  const [blocksOrder, setBlocksOrder] = useState(() => {
    if (initialLayout.blocksOrder && initialLayout.blocksOrder.length > 0) {
      return initialLayout.blocksOrder;
    }
    const extraIds = (initialLayout.extraBlocks || []).map((b) => b.id);
    return [...baseKeys, ...extraIds];
  });

  // Sync when item layout changes
  useEffect(() => {
    const curLayout = item.layoutSettings || {};
    setColumnFlip(curLayout.columnFlip || 'default');
    setExtraBlocks(curLayout.extraBlocks || []);
    setDeletedBlocks(curLayout.deletedBlocks || item.deletedFields || []);

    const curKeys = Object.keys(item.customData || item.sectionDef?.defaultData || {}).filter(
      (k) => typeof (item.customData || item.sectionDef?.defaultData || {})[k] === 'string'
    );
    const extraIds = (curLayout.extraBlocks || []).map((b) => b.id);

    if (curLayout.blocksOrder && curLayout.blocksOrder.length > 0) {
      // Merge in any missing keys
      const merged = [...curLayout.blocksOrder];
      curKeys.forEach((k) => {
        if (!merged.includes(k)) merged.push(k);
      });
      extraIds.forEach((id) => {
        if (!merged.includes(id)) merged.push(id);
      });
      setBlocksOrder(merged);
    } else {
      setBlocksOrder([...curKeys, ...extraIds]);
    }
  }, [item.instanceId, item.layoutSettings]);

  // Apply layout change & auto update JSX code
  const handleApplyLayoutChange = (nextFlip, nextOrder, nextDeleted, nextExtra) => {
    const newLayoutSettings = {
      ...(item.layoutSettings || {}),
      columnFlip: nextFlip !== undefined ? nextFlip : columnFlip,
      blocksOrder: nextOrder !== undefined ? nextOrder : blocksOrder,
      deletedBlocks: nextDeleted !== undefined ? nextDeleted : deletedBlocks,
      extraBlocks: nextExtra !== undefined ? nextExtra : extraBlocks,
    };

    // Auto-generate updated JSX code
    const updatedJsx = generateUpdatedSectionJsx(item, newLayoutSettings);
    setLiveCode(updatedJsx);

    if (onUpdateLayout) {
      onUpdateLayout(item.instanceId, newLayoutSettings, updatedJsx);
    }
  };

  // 1. Column Flip Handler
  const handleSetColumnFlip = (newFlip) => {
    setColumnFlip(newFlip);
    handleApplyLayoutChange(newFlip, blocksOrder, deletedBlocks, extraBlocks);
  };

  // 2. Reorder Block (Move Up / Down)
  const handleMoveBlock = (orderIndex, direction) => {
    const targetIndex = orderIndex + direction;
    if (targetIndex < 0 || targetIndex >= blocksOrder.length) return;
    const newOrder = reorderArray(blocksOrder, orderIndex, targetIndex);
    setBlocksOrder(newOrder);
    handleApplyLayoutChange(columnFlip, newOrder, deletedBlocks, extraBlocks);
  };

  // 3. Delete / Hide Block
  const handleDeleteBlock = (blockKey) => {
    const isExtra = extraBlocks.some((b) => b.id === blockKey);
    let nextExtra = extraBlocks;
    let nextOrder = blocksOrder;
    let nextDeleted = deletedBlocks;

    if (isExtra) {
      nextExtra = extraBlocks.filter((b) => b.id !== blockKey);
      nextOrder = blocksOrder.filter((k) => k !== blockKey);
      setExtraBlocks(nextExtra);
      setBlocksOrder(nextOrder);
    } else {
      if (!deletedBlocks.includes(blockKey)) {
        nextDeleted = [...deletedBlocks, blockKey];
        setDeletedBlocks(nextDeleted);
      }
    }

    handleApplyLayoutChange(columnFlip, nextOrder, nextDeleted, nextExtra);
  };

  // 4. Restore Deleted Block
  const handleRestoreBlock = (blockKey) => {
    const nextDeleted = deletedBlocks.filter((k) => k !== blockKey);
    setDeletedBlocks(nextDeleted);
    handleApplyLayoutChange(columnFlip, blocksOrder, nextDeleted, extraBlocks);
  };

  // 5. Add Extra Block
  const handleAddExtraBlock = (template) => {
    const newBlock = {
      id: `extra-${template.type}-${Date.now().toString(36)}`,
      type: template.type,
      title: template.title,
      props: { ...template.defaultProps },
    };
    const nextExtra = [...extraBlocks, newBlock];
    const nextOrder = [...blocksOrder, newBlock.id];
    setExtraBlocks(nextExtra);
    setBlocksOrder(nextOrder);
    setIsAddBlockModalOpen(false);
    handleApplyLayoutChange(columnFlip, nextOrder, deletedBlocks, nextExtra);
  };

  // 6. Update Extra Block Props
  const handleUpdateExtraBlockProp = (blockId, propKey, propValue) => {
    const nextExtra = extraBlocks.map((b) => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        props: {
          ...b.props,
          [propKey]: propValue,
        },
      };
    });
    setExtraBlocks(nextExtra);
    handleApplyLayoutChange(columnFlip, blocksOrder, deletedBlocks, nextExtra);
  };

  // Handle direct text change in wireframe mode
  const handleFieldChange = (key, value) => {
    const updatedData = {
      ...customData,
      [key]: value,
    };

    let updatedCode = liveCode;
    if (customData[key] && updatedCode.includes(customData[key])) {
      updatedCode = updatedCode.replaceAll(customData[key], value);
      setLiveCode(updatedCode);
    }

    if (onUpdateData) {
      onUpdateData(item.instanceId, updatedData, updatedCode);
    }
  };

  // Apply Live Code edits to canvas
  const handleApplyCode = () => {
    if (onUpdateCode) {
      onUpdateCode(item.instanceId, liveCode);
    }
  };

  // Reset to original code
  const handleResetOriginalCode = () => {
    const original = getSectionSourceCode(item);
    setLiveCode(original);
    setColumnFlip('default');
    setDeletedBlocks([]);
    setExtraBlocks([]);
    const defaultKeys = Object.keys(item.sectionDef?.defaultData || {});
    setBlocksOrder(defaultKeys);

    if (onUpdateCode) {
      onUpdateCode(item.instanceId, original);
    }
    if (onUpdateLayout) {
      onUpdateLayout(item.instanceId, {
        columnFlip: 'default',
        blocksOrder: defaultKeys,
        deletedBlocks: [],
        extraBlocks: [],
      }, original);
    }
  };

  // Copy JSX Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(liveCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1-Click Download standalone JSX file
  const handleDownloadJsx = () => {
    const cleanName = (item.name || item.sectionDef?.name || 'Section')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_');
    const fileName = `${cleanName}.jsx`;

    const blob = new Blob([liveCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // 7. Extract all Section Images for direct editing
  const sectionImages = React.useMemo(() => {
    return extractSectionImages(liveCode, customData, extraBlocks);
  }, [liveCode, customData, extraBlocks]);

  // 8. Scan all linkable containers / cards / divs for Href & Div->A conversion
  const linkableContainers = React.useMemo(() => {
    return scanLinkableContainers(liveCode);
  }, [liveCode]);

  // Handler: Thay đổi ảnh trực tiếp (Image replacement)
  const handleReplaceImage = (oldSrc, newSrc, newAlt = null) => {
    if (!oldSrc || !newSrc) return;
    const updated = replaceImageInCode(liveCode, oldSrc, newSrc, newAlt);
    setLiveCode(updated);
    if (onUpdateCode) {
      onUpdateCode(item.instanceId, updated);
    }
  };

  // Handler: Đổi file ảnh local từ máy (Upload file)
  const handleUploadLocalImage = (e, oldSrc) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        handleReplaceImage(oldSrc, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler: Tự động đổi <div> thành <a> khi nhập Href (và ngược lại khi xóa Href)
  const handleUpdateContainerHref = (rawOpeningTag, newHref) => {
    const updated = convertDivToAnchorWithHref(liveCode, rawOpeningTag, newHref);
    setLiveCode(updated);
    if (onUpdateCode) {
      onUpdateCode(item.instanceId, updated);
    }
  };

  // Active blocks that are NOT deleted
  const activeOrderKeys = blocksOrder.filter((k) => !deletedBlocks.includes(k));

  return (
    <div className="mt-3 bg-slate-900 border-2 border-blue-500/60 rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
      
      {/* Top Editor Bar: Tabs & Quick Export */}
      <div className="bg-slate-950/90 border-b border-slate-800 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Editor Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('wireframe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wireframe'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>1. Bố Cục & Chữ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'images'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span>2. Chỉnh Ảnh ({sectionImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'links'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-300" />
            <span>3. Đổi &lt;div&gt; ➔ &lt;a&gt; ({linkableContainers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-300" />
            <span>4. Code JSX</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-purple-200" />
            <span>5. Xuất File</span>
          </button>
        </div>

        {/* Right: Quick Download & Close Drawer Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadJsx}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition active:scale-95 shadow-sm"
            title="Tải ngay file .jsx của section này"
          >
            {downloadSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadSuccess ? 'Đã Tải Xong!' : 'Tải File .jsx'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Đóng bảng chỉnh sửa trực tiếp"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* TAB 1: WIREFRAME VISUAL EDIT (WORDPRESS GUTENBERG STYLE) */}
      {activeTab === 'wireframe' && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <span>Bố Cục Cột, Đổi Vị Trí & Khối Con</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                  Gutenberg Wireframe
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chuyển vị trí cột (Hình trái/phải), di chuyển khối con lên ⬆ / xuống ⬇, xóa 🗑️ hoặc thêm mới (+). Code JSX cập nhật tự động.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span>+ Thêm Khối Con</span>
              </button>

              <button
                type="button"
                onClick={handleResetOriginalCode}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                title="Khôi phục toàn bộ bố cục & text gốc của section"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Phục Hồi Gốc</span>
              </button>
            </div>
          </div>

          {/* 1. Bố Cục Cột (Column Flip: Hình Trái ⇄ Hình Phải) */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                <Columns className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-xs font-extrabold text-white block">
                  Bố Cục Cột (Column Layout)
                </span>
                <span className="text-[10px] text-slate-400">
                  Đổi chỗ hình ảnh và nội dung lập tức (0ms)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => handleSetColumnFlip('default')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  columnFlip === 'default'
                    ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Bố cục mặc định theo mẫu"
              >
                Chữ Trái - Hình Phải (Gốc)
              </button>

              <button
                type="button"
                onClick={() => handleSetColumnFlip('image-left')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  columnFlip === 'image-left'
                    ? 'bg-amber-600 text-white shadow-sm font-extrabold ring-1 ring-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Đổi chỗ: Hình sang cột Trái, Chữ sang cột Phải"
              >
                ⇄ Hình Trái - Chữ Phải ⭐
              </button>

              <button
                type="button"
                onClick={() => handleSetColumnFlip('stacked-center')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  columnFlip === 'stacked-center'
                    ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Xếp dọc 1 cột căn giữa toàn bộ"
              >
                Xếp Dọc Căn Giữa
              </button>
            </div>
          </div>

          {/* 2. Căn Lề & Cỡ Chữ Bar */}
          <div className="p-2.5 px-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <AlignCenter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Căn Lề:</span>
              </span>
              <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => onUpdateStyles && onUpdateStyles(item.instanceId, { ...(item.styleSettings || {}), textAlign: 'left' })}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    item.styleSettings?.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Căn trái"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Trái</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyles && onUpdateStyles(item.instanceId, { ...(item.styleSettings || {}), textAlign: 'center' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    item.styleSettings?.textAlign === 'center'
                      ? 'bg-emerald-600 text-white ring-1 ring-emerald-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Căn giữa toàn bộ chữ & tiêu đề (Text Center)"
                >
                  <AlignCenter className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="font-extrabold text-emerald-300">Giữa ⭐</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyles && onUpdateStyles(item.instanceId, { ...(item.styleSettings || {}), textAlign: 'right' })}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    item.styleSettings?.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Căn phải"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>Phải</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cỡ Chữ:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-700">
                  {[
                    { label: 'Gốc', val: 'default' },
                    { label: '26px', val: 26 },
                    { label: '34px', val: 34 },
                    { label: '44px', val: 44 },
                  ].map((sz) => (
                    <button
                      key={String(sz.val)}
                      type="button"
                      onClick={() => onUpdateStyles && onUpdateStyles(item.instanceId, { ...(item.styleSettings || {}), titleSize: sz.val })}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                        (item.styleSettings?.titleSize || 'default') === sz.val
                          ? 'bg-cyan-600 text-white font-extrabold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-1.5 py-0.5 focus-within:border-cyan-400 transition">
                  <input
                    type="number"
                    min="12"
                    max="120"
                    value={item.styleSettings?.titleSize === 'default' || !item.styleSettings?.titleSize ? '' : item.styleSettings?.titleSize}
                    placeholder="Gốc"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 'default' : Math.max(10, Math.min(150, Number(e.target.value)));
                      onUpdateStyles && onUpdateStyles(item.instanceId, { ...(item.styleSettings || {}), titleSize: val });
                    }}
                    className="w-11 bg-transparent text-xs text-cyan-300 font-mono font-bold text-right focus:outline-none placeholder-slate-500"
                    title="Nhập số px chính xác cho cỡ chữ"
                  />
                  <span className="ml-1 text-[10px] text-slate-400 font-mono font-bold">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Section Images Strip (Chỉnh ảnh trực tiếp ngay trên tab này) */}
          {sectionImages.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hình Ảnh Section ({sectionImages.length} ảnh) — Chỉnh Trực Tiếp:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Mở tab quản lý ảnh đầy đủ</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                {sectionImages.map((imgItem, idx) => (
                  <div
                    key={imgItem.id || idx}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-2.5"
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                      <img
                        src={imgItem.src}
                        alt="Ảnh"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-300 font-bold block truncate" title={imgItem.label}>
                        {imgItem.label}
                      </span>
                      <input
                        type="text"
                        value={imgItem.src}
                        onChange={(e) => handleReplaceImage(imgItem.src, e.target.value)}
                        placeholder="Nhập link ảnh mới..."
                        className="w-full mt-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Danh Sách Các Khối Con Có Thể Đổi Vị Trí & Xóa */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Danh Sách Khối Con (Di chuyển ⬆ ⬇ / Sửa chữ / Xóa 🗑️)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeOrderKeys.length} khối đang hiển thị
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto p-1 pr-2 scrollbar-thin">
              {activeOrderKeys.map((blockKey, idx) => {
                const isExtra = extraBlocks.some((b) => b.id === blockKey);
                const extraBlock = isExtra ? extraBlocks.find((b) => b.id === blockKey) : null;
                const meta = BLOCK_META_MAP[blockKey] || {};

                // Default text fields
                const textVal = customData[blockKey];

                const label = isExtra
                  ? extraBlock?.title || `Khối Bổ Sung (${extraBlock?.type})`
                  : meta.label || `Khối: ${blockKey}`;

                return (
                  <div
                    key={blockKey}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-blue-500/60 shadow-sm transition-all"
                  >
                    {/* Block Card Header: Order buttons + Title + Delete */}
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/60 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-amber-400 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white truncate" title={label}>
                          {label}
                        </span>
                        {isExtra && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold shrink-0">
                            Mới
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Up, Down, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, -1)}
                          disabled={idx === 0}
                          className={`p-1 rounded-lg border text-xs transition ${
                            idx === 0
                              ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-blue-600 border-slate-700'
                          }`}
                          title="Di chuyển khối này lên trước"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, 1)}
                          disabled={idx === activeOrderKeys.length - 1}
                          className={`p-1 rounded-lg border text-xs transition ${
                            idx === activeOrderKeys.length - 1
                              ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-blue-600 border-slate-700'
                          }`}
                          title="Di chuyển khối này xuống dưới"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(blockKey)}
                          className="p-1 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700 hover:border-rose-500 text-xs transition"
                          title="Xóa/ẩn khối này khỏi section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Card Content: Live Editable */}
                    {isExtra ? (
                      <div className="space-y-2">
                        {(extraBlock.type === 'split-text-image' || extraBlock.type === 'text-with-image') && (
                          <div className="space-y-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
                            {/* Vị trí cột: Text Trái - Ảnh Phải vs Ảnh Trái - Text Phải */}
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                              <span className="text-[11px] font-bold text-slate-300">Bố cục hiển thị:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentPos = extraBlock.props?.imagePosition || 'right';
                                  handleUpdateExtraBlockProp(blockKey, 'imagePosition', currentPos === 'right' ? 'left' : 'right');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                                title="Bấm để đảo vị trí Text và Hình"
                              >
                                <span>{extraBlock.props?.imagePosition === 'left' ? '👈 Ảnh Trái - Text Phải' : '👉 Text Trái - Ảnh Phải'}</span>
                              </button>
                            </div>

                            {/* Eyebrow */}
                            <input
                              type="text"
                              value={extraBlock.props?.eyebrow || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'eyebrow', e.target.value)}
                              placeholder="Eyebrow (ví dụ: PHƯƠNG PHÁP ĐỘC QUYỀN)..."
                              className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-amber-400 font-bold"
                            />

                            {/* Title & Highlight */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                value={extraBlock.props?.title || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'title', e.target.value)}
                                placeholder="Tiêu đề chính..."
                                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                              />
                              <input
                                type="text"
                                value={extraBlock.props?.highlight || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'highlight', e.target.value)}
                                placeholder="Từ nhấn mạnh (vàng)..."
                                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold"
                              />
                            </div>

                            {/* Mô tả */}
                            <textarea
                              rows={2}
                              value={extraBlock.props?.desc || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'desc', e.target.value)}
                              placeholder="Đoạn văn bản mô tả chi tiết..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 placeholder-slate-500"
                            />

                            {/* Checklist Bullets */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400">Các gạch đầu dòng (mỗi dòng 1 ý):</span>
                              <textarea
                                rows={2}
                                value={Array.isArray(extraBlock.props?.bullets) ? extraBlock.props.bullets.join('\n') : (extraBlock.props?.bullets || '')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\n').filter((l) => l.trim() !== '');
                                  handleUpdateExtraBlockProp(blockKey, 'bullets', lines);
                                }}
                                placeholder="Gạch đầu dòng 1&#10;Gạch đầu dòng 2&#10;Gạch đầu dòng 3"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-emerald-300 placeholder-slate-500 font-mono"
                              />
                            </div>

                            {/* CTA Nút bấm */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                value={extraBlock.props?.buttonText || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'buttonText', e.target.value)}
                                placeholder="Text nút bấm..."
                                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                              />
                              <select
                                value={extraBlock.props?.buttonVariant || 'secondary'}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'buttonVariant', e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-white"
                              >
                                <option value="primary">Nút Xanh Đậm (Primary)</option>
                                <option value="secondary">Nút Vàng Nổi (Secondary)</option>
                                <option value="outline">Viền Trong Suốt</option>
                              </select>
                            </div>

                            {/* URL Hình ảnh & Chú thích */}
                            <div className="space-y-1 pt-1">
                              <input
                                type="text"
                                value={extraBlock.props?.imageSrc || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'imageSrc', e.target.value)}
                                placeholder="URL Hình ảnh (https://...)"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-white font-mono"
                              />
                              <input
                                type="text"
                                value={extraBlock.props?.imageBadge || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'imageBadge', e.target.value)}
                                placeholder="Huy hiệu góc ảnh (Cam kết 100%)..."
                                className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-slate-300"
                              />
                            </div>
                          </div>
                        )}

                        {extraBlock.type === 'heading' && (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={extraBlock.props?.eyebrow || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'eyebrow', e.target.value)}
                              placeholder="Eyebrow (Nhãn nhỏ trên)..."
                              className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-400 font-bold"
                            />
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                value={extraBlock.props?.title || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'title', e.target.value)}
                                placeholder="Tiêu đề chính..."
                                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                              />
                              <input
                                type="text"
                                value={extraBlock.props?.highlight || ''}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'highlight', e.target.value)}
                                placeholder="Từ nhấn mạnh (vàng)..."
                                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={extraBlock.props?.desc || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'desc', e.target.value)}
                              placeholder="Đoạn văn mô tả..."
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300"
                            />
                          </div>
                        )}

                        {extraBlock.type === 'button' && (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={extraBlock.props?.text || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'text', e.target.value)}
                              placeholder="Nội dung nút bấm..."
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2">
                              <select
                                value={extraBlock.props?.variant || 'secondary'}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'variant', e.target.value)}
                                className="w-1/2 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white"
                              >
                                <option value="primary">Màu Chính (Primary)</option>
                                <option value="secondary">Màu Nổi (Secondary)</option>
                                <option value="outline">Viền Trong Suốt</option>
                              </select>
                              <select
                                value={extraBlock.props?.targetSection || 'tu-van'}
                                onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'targetSection', e.target.value)}
                                className="w-1/2 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white"
                              >
                                <option value="tu-van">Tới #tu-van</option>
                                <option value="courses">Tới #courses</option>
                                <option value="schedule">Tới #schedule</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {extraBlock.type === 'badge' && (
                          <input
                            type="text"
                            value={extraBlock.props?.text || ''}
                            onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'text', e.target.value)}
                            placeholder="Nội dung huy hiệu..."
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}

                        {extraBlock.type === 'text' && (
                          <textarea
                            rows={2}
                            value={extraBlock.props?.text || ''}
                            onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'text', e.target.value)}
                            placeholder="Nội dung ghi chú..."
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}

                        {extraBlock.type === 'stat' && (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={extraBlock.props?.number || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'number', e.target.value)}
                              placeholder="Số: 15.000+"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none font-bold"
                            />
                            <input
                              type="text"
                              value={extraBlock.props?.label || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'label', e.target.value)}
                              placeholder="Nhãn: Học viên tốt nghiệp"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                          </div>
                        )}

                        {extraBlock.type === 'highlight' && (
                          <input
                            type="text"
                            value={extraBlock.props?.text || ''}
                            onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'text', e.target.value)}
                            placeholder="Nội dung cam kết có tích xanh..."
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}

                        {extraBlock.type === 'image' && (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={extraBlock.props?.src || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'src', e.target.value)}
                              placeholder="URL Hình ảnh (https://...)"
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                            />
                            <input
                              type="text"
                              value={extraBlock.props?.alt || ''}
                              onChange={(e) => handleUpdateExtraBlockProp(blockKey, 'alt', e.target.value)}
                              placeholder="Mô tả alt..."
                              className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {typeof textVal === 'string' && textVal.length > 60 ? (
                          <textarea
                            rows={2}
                            value={textVal}
                            onChange={(e) => handleFieldChange(blockKey, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                            placeholder={`Nhập ${label}...`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={textVal || ''}
                            onChange={(e) => handleFieldChange(blockKey, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                            placeholder={`Nhập ${label}...`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Khối Đã Ẩn / Xóa (Nếu có) */}
          {deletedBlocks.length > 0 && (
            <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Các Khối Đã Ẩn ({deletedBlocks.length}) - Bấm Khôi Phục để hiển thị lại:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {deletedBlocks.map((delKey) => {
                  const meta = BLOCK_META_MAP[delKey];
                  const label = meta?.label || delKey;
                  return (
                    <div
                      key={delKey}
                      className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-rose-800/50 flex items-center gap-2 text-xs text-slate-300"
                    >
                      <span className="line-through text-slate-500 truncate max-w-[140px]">{label}</span>
                      <button
                        type="button"
                        onClick={() => handleRestoreBlock(delKey)}
                        className="px-2 py-0.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-bold transition flex items-center gap-1 border border-emerald-500/40"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Khôi Phục</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Tip Banner */}
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Mọi vị trí thay đổi (⬆/⬇), thêm component con (+) hoặc xóa (🗑️) đều lập tức đồng bộ thẳng vào mã nguồn JSX React.
              </span>
            </span>
            <button
              type="button"
              onClick={handleDownloadJsx}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 shrink-0 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất File .jsx Ngay</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: DIRECT IMAGE EDITOR (CHỈNH HÌNH ẢNH TRỰC TIẾP) */}
      {activeTab === 'images' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Quản Lý & Chỉnh Sửa Hình Ảnh Trực Tiếp</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  {sectionImages.length} Ảnh Đang Dùng
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Thay đổi link ảnh, chọn ảnh mẫu hoặc tải ảnh từ máy tính. Màn hình bên trên cập nhật tức thì (0ms) mà không cần chạm vào code.
              </p>
            </div>
          </div>

          {sectionImages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
              <p>Section này hiện không có thẻ ảnh <code>&lt;img&gt;</code> mặc định nào.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('wireframe');
                  setIsAddBlockModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                + Thêm Khối Ảnh hoặc Text Trái - Hình Phải
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {sectionImages.map((imgItem, idx) => (
                <div
                  key={imgItem.id || idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                    {/* Thumbnail Preview */}
                    <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-700 shrink-0 group">
                      <img
                        src={imgItem.src}
                        alt={imgItem.alt || 'Ảnh'}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] text-emerald-300 font-mono font-bold">
                        Ảnh #{idx + 1}
                      </span>
                    </div>

                    {/* Image Controls */}
                    <div className="flex-1 min-w-0 space-y-2 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate" title={imgItem.label}>
                          {imgItem.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {imgItem.type === 'tag' ? 'Thẻ <img> JSX' : 'Dữ Liệu Khối'}
                        </span>
                      </div>

                      {/* URL Input */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 focus-within:border-emerald-500 transition">
                          <input
                            type="text"
                            value={imgItem.src}
                            onChange={(e) => handleReplaceImage(imgItem.src, e.target.value)}
                            placeholder="Nhập link ảnh (https://... hoặc ./img/...)"
                            className="w-full bg-transparent text-xs text-emerald-300 font-mono placeholder-slate-500 focus:outline-none"
                          />
                        </div>

                        {/* Local File Upload Button */}
                        <label className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shrink-0 active:scale-95">
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span className="hidden sm:inline">Chọn Từ Máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUploadLocalImage(e, imgItem.src)}
                          />
                        </label>
                      </div>

                      {/* Alt SEO input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={imgItem.alt || ''}
                          onChange={(e) => handleReplaceImage(imgItem.src, imgItem.src, e.target.value)}
                          placeholder="Mô tả alt hình ảnh (SEO)..."
                          className="w-full px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
                        />
                      </div>

                      {/* Quick 1-Click Presets */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">Gợi ý 1-chạm:</span>
                        {PRESET_IMAGE_SUGGESTIONS.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleReplaceImage(imgItem.src, preset.src, preset.alt)}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-emerald-950/60 text-slate-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-600/50 text-[10px] font-bold transition active:scale-95 flex items-center gap-1"
                            title={preset.alt}
                          >
                            <span>⚡</span>
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIV TO ANCHOR CONVERTER (TỰ ĐỔI THẺ DIV THÀNH A KHI NHẬP HREF) */}
      {activeTab === 'links' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                <span>Tự Động Chuyển Thẻ &lt;div&gt; ➔ &lt;a&gt; Khi Nhập Href</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                  Không Cần Vào Code
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Nhập đường dẫn (ví dụ <code>#tu-van</code>, <code>#courses</code>, <code>https://...</code>, <code>tel:...</code>). Thẻ <code>&lt;div&gt;</code> sẽ tự động biến thành <code>&lt;a href="..."&gt;</code> để có thể click được. Khi xóa trắng link, thẻ sẽ tự chuyển về lại <code>&lt;div&gt;</code>.
              </p>
            </div>
          </div>

          {linkableContainers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2 bg-slate-950/60 rounded-2xl border border-slate-800">
              <LinkIcon className="w-10 h-10 text-slate-600 mx-auto" />
              <p>Chưa tìm thấy khối thẻ <code>&lt;div&gt;</code> hoặc <code>&lt;a&gt;</code> phù hợp để gắn link trong đoạn code này.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {linkableContainers.map((itemNode, idx) => {
                const isAnchor = itemNode.currentTag.startsWith('a');
                return (
                  <div
                    key={itemNode.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2.5 shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white truncate" title={itemNode.textPreview}>
                          {itemNode.textPreview}
                        </span>
                      </div>

                      {/* Tag indicator */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                          isAnchor
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {isAnchor ? '<a> Đã là Thẻ Link (Clickable)' : '<div> Đang là Thẻ Khối'}
                      </span>
                    </div>

                    {/* Href Input and Action */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 focus-within:border-cyan-400 transition">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={itemNode.href || ''}
                            onChange={(e) => handleUpdateContainerHref(itemNode.rawOpening, e.target.value)}
                            placeholder="Nhập Href (Ví dụ: #tu-van, #courses, https://..., tel:...)"
                            className="w-full bg-transparent text-xs text-cyan-300 font-mono placeholder-slate-500 focus:outline-none"
                          />
                        </div>

                        {/* Reset back to <div> if currently <a> */}
                        {isAnchor && (
                          <button
                            type="button"
                            onClick={() => handleUpdateContainerHref(itemNode.rawOpening, '')}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold transition shrink-0 active:scale-95"
                            title="Xóa href và chuyển lại về thẻ <div>"
                          >
                            Xóa Link (Về &lt;div&gt;)
                          </button>
                        )}
                      </div>

                      {/* Quick Anchor Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-500">Gợi ý đích đến:</span>
                        {[
                          { label: 'Tới Form Tư Vấn', href: '#tu-van' },
                          { label: 'Tới Khóa Học', href: '#courses' },
                          { label: 'Tới Lịch Khai Giảng', href: '#schedule' },
                          { label: 'Hotline Gọi Ngay', href: 'tel:0988123456' },
                          { label: 'Nhắn Zalo', href: 'https://zalo.me/0988123456' },
                        ].map((qLink, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => handleUpdateContainerHref(itemNode.rawOpening, qLink.href)}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-600/50 text-[10px] font-bold transition active:scale-95"
                          >
                            <span>+ {qLink.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LIVE JSX CODE EDITOR */}
      {activeTab === 'code' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <span>Chỉnh Sửa Code Trực Tiếp (Live JSX)</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                  Real-time Render
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bạn có thể sửa trực tiếp HTML, Tailwind CSS class hoặc cú pháp JSX. Màn hình bên trên cập nhật tức thì.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetOriginalCode}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                title="Khôi phục lại mã nguồn nguyên bản"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Code Gốc</span>
              </button>

              <button
                type="button"
                onClick={handleApplyCode}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition shadow-md shadow-blue-500/25 flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Cập Nhật Vào Màn Hình</span>
              </button>
            </div>
          </div>

          {/* Quick Color Converter in Live Code Tab */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chuyển màu code:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const updated = normalizeColorsToPrimary(liveCode);
                  setLiveCode(updated);
                  if (onUpdateCode) onUpdateCode(item.instanceId, updated);
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition flex items-center gap-1"
                title="Tự động nhận diện và chuyển các màu cứng trong code sang Primary (Đỏ/Hàn Quốc)"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Chuyển Sang Primary</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = switchSectionColorTheme(liveCode, 'secondary');
                  setLiveCode(updated);
                  if (onUpdateCode) onUpdateCode(item.instanceId, updated);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                title="Chuyển toàn bộ màu trong code sang Secondary (Xanh/Đài Loan)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Chuyển Sang Secondary</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              Khi dán code từ bên ngoài vào, màu sẽ tự động nhận diện
            </span>
          </div>

          {/* Live Code Area */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950 font-mono text-xs">
            <textarea
              value={liveCode}
              onChange={(e) => {
                setLiveCode(e.target.value);
                if (onUpdateCode) {
                  onUpdateCode(item.instanceId, e.target.value);
                }
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData?.getData('text');
                if (pastedText && pastedText.trim()) {
                  const normalized = normalizeColorsToPrimary(pastedText);
                  if (normalized !== pastedText) {
                    e.preventDefault();
                    const textarea = e.target;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const currentVal = textarea.value;
                    const newVal = currentVal.substring(0, start) + normalized + currentVal.substring(end);
                    setLiveCode(newVal);
                    if (onUpdateCode) onUpdateCode(item.instanceId, newVal);
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + normalized.length;
                    }, 0);
                  }
                }
              }}
              rows={14}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-blue-600 selection:text-white"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Hỗ trợ JSX chuẩn, TailwindCSS và toàn bộ icon của Lucide React.</span>
            <span className="font-mono text-slate-500">{liveCode.split('\n').length} dòng mã</span>
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT SECTION CODE */}
      {activeTab === 'export' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <span>Xuất File Code Section Hoàn Chỉnh</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  Sẵn Sàng Production
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mã nguồn đã đồng bộ toàn bộ bố cục, vị trí cột, component con bạn vừa kéo đổi và tùy biến.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                <span>{copied ? 'Đã Copy Xong!' : 'Copy Mã JSX'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJsx}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải File .jsx Ngay</span>
              </button>
            </div>
          </div>

          {/* Code Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 p-4 max-h-[340px] overflow-y-auto scrollbar-thin">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">
              {liveCode}
            </pre>
          </div>
        </div>
      )}

      {/* POPUP MODAL: THÊM KHỐI CON MỚI */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-white">
                    Thêm Khối Con Vào Section
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Chọn loại component bạn muốn bổ sung vào section này
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {ADDABLE_BLOCK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.type}
                  type="button"
                  onClick={() => handleAddExtraBlock(tmpl)}
                  className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500 text-left transition group active:scale-95 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-white group-hover:text-blue-300">
                      {tmpl.title}
                    </span>
                    <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
