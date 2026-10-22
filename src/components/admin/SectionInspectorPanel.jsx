import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
  Edit3,
  Trash2,
  ChevronUp,
  FileCode,
  X,
  GraduationCap,
  Globe,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Type,
  Heading,
  Maximize2,
  RotateCcw,
  Columns,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
} from 'lucide-react';
import ButtonCTA from '../common/ButtonCTA';
import {
  BLOCK_META_MAP,
  ADDABLE_BLOCK_TEMPLATES,
  reorderArray,
  generateUpdatedSectionJsx,
} from '../../utils/sectionBlockManager';
import { detectSectionTheme } from '../../utils/sectionColorTransform';
import { getSectionSourceCode } from '../../data/sectionsRawCode';
import {
  extractSectionImages,
  replaceImageInCode,
  scanLinkableContainers,
  convertDivToAnchorWithHref,
} from '../../utils/sectionElementTransform';

export default function SectionInspectorPanel({
  isOpen = true,
  onClose,
  sections = [],
  selectedSectionId,
  onSelectSection,
  onSwitchSectionColor,
  onUpdateSectionStyles,
  onUpdateSectionLayout,
  onUpdateSectionButton,
  onSaveButtonComponent,
  onEditSectionContent,
  onEditSectionCode,
  onUpdateSectionCode,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  activeTheme,
  activeFont,
  activeRadius = 16,
}) {
  if (!isOpen) return null;

  // Find currently inspected section
  const currentSection =
    sections.find(
      (s) =>
        s.instanceId === selectedSectionId ||
        s.sectionDef?.id === selectedSectionId
    ) || sections[0];

  const currentIndex = sections.findIndex(
    (s) => s.instanceId === currentSection?.instanceId
  );

  // Section Layout & Sub-component States (Column Flip, Reordering, Add/Delete Blocks)
  const [columnFlip, setColumnFlip] = useState('default');
  const [extraBlocks, setExtraBlocks] = useState([]);
  const [deletedBlocks, setDeletedBlocks] = useState([]);
  const [blocksOrder, setBlocksOrder] = useState([]);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);

  // Section Typography & Alignment states (WordPress-style)
  const [textAlign, setTextAlign] = useState('default'); // 'default' | 'left' | 'center' | 'right'
  const [centerContainer, setCenterContainer] = useState(false);
  const [titleSize, setTitleSize] = useState('default'); // 'default' | number (px)
  const [bodySize, setBodySize] = useState('default');   // 'default' | number (px)
  const [fontScale, setFontScale] = useState(100);       // number (%)

  // Button customization states (WordPress-style)
  const [buttonText, setButtonText] = useState('Đăng Ký Tư Vấn Ngay');
  const [buttonTarget, setButtonTarget] = useState('tu-van');
  const [buttonVariant, setButtonVariant] = useState('primary'); // 'primary' | 'secondary' | 'outline' | 'glow'
  const [buttonSize, setButtonSize] = useState('md'); // 'sm' | 'md' | 'lg'
  const [buttonIcon, setButtonIcon] = useState(true);

  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Synchronize values when currentSection changes
  useEffect(() => {
    if (currentSection) {
      // 1. Sync layout & sub-components
      const curLayout = currentSection.layoutSettings || {};
      setColumnFlip(curLayout.columnFlip || 'default');
      setExtraBlocks(curLayout.extraBlocks || []);
      setDeletedBlocks(curLayout.deletedBlocks || currentSection.deletedFields || []);

      const curKeys = Object.keys(currentSection.customData || currentSection.sectionDef?.defaultData || {}).filter(
        (k) => typeof (currentSection.customData || currentSection.sectionDef?.defaultData || {})[k] === 'string'
      );
      const extraIds = (curLayout.extraBlocks || []).map((b) => b.id);
      if (curLayout.blocksOrder && curLayout.blocksOrder.length > 0) {
        const merged = [...curLayout.blocksOrder];
        curKeys.forEach((k) => { if (!merged.includes(k)) merged.push(k); });
        extraIds.forEach((id) => { if (!merged.includes(id)) merged.push(id); });
        setBlocksOrder(merged);
      } else {
        setBlocksOrder([...curKeys, ...extraIds]);
      }
      // 1. Sync typography & alignment
      if (currentSection.styleSettings) {
        setTextAlign(currentSection.styleSettings.textAlign || 'default');
        setCenterContainer(Boolean(currentSection.styleSettings.centerContainer));
        setTitleSize(currentSection.styleSettings.titleSize || 'default');
        setBodySize(currentSection.styleSettings.bodySize || 'default');
        setFontScale(
          currentSection.styleSettings.fontScale !== undefined
            ? currentSection.styleSettings.fontScale
            : 100
        );
      } else {
        setTextAlign('default');
        setCenterContainer(false);
        setTitleSize('default');
        setBodySize('default');
        setFontScale(100);
      }

      // 2. Sync CTA button
      if (currentSection.buttonSettings) {
        setButtonText(currentSection.buttonSettings.text || 'Đăng Ký Tư Vấn Ngay');
        setButtonTarget(currentSection.buttonSettings.targetSection || 'tu-van');
        setButtonVariant(currentSection.buttonSettings.variant || 'primary');
        setButtonSize(currentSection.buttonSettings.size || 'md');
        setButtonIcon(
          currentSection.buttonSettings.icon !== undefined
            ? currentSection.buttonSettings.icon
            : true
        );
      } else if (currentSection.customData) {
        const text =
          currentSection.customData.ctaPrimary ||
          currentSection.customData.ctaText ||
          currentSection.customData.buttonText ||
          'Đăng Ký Tư Vấn Ngay';
        setButtonText(text);
        setButtonTarget(currentSection.customData.targetSection || 'tu-van');
        setButtonVariant('primary');
        setButtonSize('md');
        setButtonIcon(true);
      } else if (currentSection.customCode) {
        const textMatch = currentSection.customCode.match(
          /<ButtonCTA[^>]*text=["']([^"']+)["']/i
        );
        const targetMatch = currentSection.customCode.match(
          /<ButtonCTA[^>]*targetSection=["']([^"']+)["']/i
        );
        const variantMatch = currentSection.customCode.match(
          /<ButtonCTA[^>]*variant=["']([^"']+)["']/i
        );
        if (textMatch) setButtonText(textMatch[1]);
        if (targetMatch) setButtonTarget(targetMatch[1]);
        if (variantMatch) setButtonVariant(variantMatch[1]);
      }
    }
  }, [currentSection?.instanceId, currentSection?.styleSettings, currentSection?.layoutSettings]);

  if (!currentSection) {
    return (
      <aside className="w-80 sm:w-92 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] shrink-0 z-30 select-none p-6 text-center text-slate-400 text-xs justify-center sticky top-16">
        <p>Chưa có section nào trên canvas để tùy chỉnh.</p>
      </aside>
    );
  }

  // Available target sections for the dropdown
  const targetOptions = [
    { id: 'tu-van', name: 'Form Đăng Ký Tư Vấn (#tu-van)' },
    { id: 'courses', name: 'Kho Khóa Học Online (#courses)' },
    { id: 'schedule', name: 'Lịch Khai Giảng (#schedule)' },
    { id: 'roadmap', name: 'Lộ Trình Đào Tạo (#roadmap)' },
    { id: 'teachers', name: 'Đội Ngũ Giảng Viên (#teachers)' },
    { id: 'why', name: 'Tại Sao Chọn Chúng Tôi (#why)' },
    { id: 'faq', name: 'Câu Hỏi Thường Gặp (#faq)' },
    { id: 'top', name: 'Đầu Trang (#top)' },
  ];

  // Handle Apply to Section
  const handleApplyToSection = () => {
    if (onUpdateSectionButton) {
      onUpdateSectionButton({
        instanceId: currentSection.instanceId,
        buttonSettings: {
          text: buttonText.trim(),
          targetSection: buttonTarget.trim().replace(/^#/, ''),
          variant: buttonVariant,
          size: buttonSize,
          icon: buttonIcon,
        },
      });
      showNotification('Đã áp dụng nút bấm vào Section trên trang!');
    }
  };

  // Handle Save as Component Button into library
  const handleSaveAsComponentButton = () => {
    const compName = `Button: ${buttonText.trim()} (${buttonVariant.toUpperCase()})`;
    const codeSnippet = `<ButtonCTA text="${buttonText.trim()}" targetSection="${buttonTarget.trim().replace(/^#/, '')}" variant="${buttonVariant}" size="${buttonSize}" />`;

    if (onSaveButtonComponent) {
      onSaveButtonComponent({
        name: compName,
        category: 'buttons',
        customCode: `export default function CustomCTAButton() {\n  return (\n    ${codeSnippet}\n  );\n}`,
        codeSnippet,
      });
      showNotification('Đã lưu thành công vào Thư viện Component (cột bên trái)!');
    }
  };

  // Handle Download File Code (.jsx)
  const handleDownloadButtonCode = () => {
    const cleanFileName = `ButtonCTA_${buttonText.replace(/[^a-zA-Z0-9]/g, '_') || 'Custom'}.jsx`;
    const fullCode = `import React from 'react';
import ButtonCTA from './button-cta';

/**
 * Component ButtonCTA tùy biến theo Section "${currentSection.name || currentSection.sectionDef?.name}"
 * Tự động đồng bộ màu chủ đạo: ${activeTheme?.primary || '#1B528A'}, bo góc: ${activeRadius}px
 */
export default function CustomButtonCTA() {
  return (
    <ButtonCTA
      text="${buttonText.trim()}"
      targetSection="${buttonTarget.trim().replace(/^#/, '')}"
      variant="${buttonVariant}"
      size="${buttonSize}"
      icon={${buttonIcon}}
    />
  );
}
`;
    const blob = new Blob([fullCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanFileName;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Đã tải xuống file ${cleanFileName}!`);
  };

  // Handle Copy JSX Code
  const handleCopyJSX = () => {
    const snippet = `<ButtonCTA text="${buttonText.trim()}" targetSection="${buttonTarget.trim().replace(/^#/, '')}" variant="${buttonVariant}" size="${buttonSize}" />`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showNotification('Đã copy mã JSX vào bộ nhớ tạm!');
  };

  const showNotification = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 4. Handle Live Image Replacement in Section
  const handleUpdateImage = (oldSrc, newSrc) => {
    if (!newSrc || newSrc.trim() === '' || oldSrc === newSrc) return;
    const rawCode = currentSection.customCode || getSectionSourceCode(currentSection);
    if (!rawCode || !onUpdateSectionCode) return;
    const updated = replaceImageInCode(rawCode, oldSrc, newSrc.trim());
    if (updated !== rawCode) {
      onUpdateSectionCode(currentSection.instanceId, updated);
      showNotification('Đã thay đổi ảnh trực tiếp trong Section!');
    }
  };

  // 5. Handle Live Tag Conversion: div <-> a & href
  const handleConvertContainerTag = (rawOpening, newTag, currentHref) => {
    const rawCode = currentSection.customCode || getSectionSourceCode(currentSection);
    if (!rawCode || !onUpdateSectionCode) return;
    const targetHref = newTag === 'a' ? (currentHref || '#tu-van') : '';
    const updated = convertDivToAnchorWithHref(rawCode, rawOpening, targetHref);
    if (updated !== rawCode) {
      onUpdateSectionCode(currentSection.instanceId, updated);
      showNotification(
        newTag === 'a'
          ? 'Đã chuyển thành thẻ <a> có liên kết href!'
          : 'Đã chuyển về thẻ <div> thường!'
      );
    }
  };

  const handleUpdateHref = (rawOpening, newHref) => {
    const rawCode = currentSection.customCode || getSectionSourceCode(currentSection);
    if (!rawCode || !onUpdateSectionCode) return;
    const updated = convertDivToAnchorWithHref(rawCode, rawOpening, newHref);
    if (updated !== rawCode) {
      onUpdateSectionCode(currentSection.instanceId, updated);
      showNotification('Đã cập nhật đường dẫn href!');
    }
  };

  // Handle Layout Changes (Column Flip, Reordering, Extra Blocks, Deleting)
  const handleApplyLayout = (nextFlip, nextOrder, nextDeleted, nextExtra) => {
    const nextSettings = {
      ...(currentSection.layoutSettings || {}),
      columnFlip: nextFlip !== undefined ? nextFlip : columnFlip,
      blocksOrder: nextOrder !== undefined ? nextOrder : blocksOrder,
      deletedBlocks: nextDeleted !== undefined ? nextDeleted : deletedBlocks,
      extraBlocks: nextExtra !== undefined ? nextExtra : extraBlocks,
    };
    const updatedCode = generateUpdatedSectionJsx(currentSection, nextSettings);
    if (onUpdateSectionLayout && currentSection) {
      onUpdateSectionLayout({
        instanceId: currentSection.instanceId,
        layoutSettings: nextSettings,
        updatedCode,
      });
      showNotification('Đã lưu vị trí & đồng bộ vào mã nguồn JSX!');
    }
  };

  const handleSetColumnFlip = (newFlip) => {
    setColumnFlip(newFlip);
    handleApplyLayout(newFlip, blocksOrder, deletedBlocks, extraBlocks);
  };

  const handleMoveBlock = (orderIndex, direction) => {
    const targetIdx = orderIndex + direction;
    if (targetIdx < 0 || targetIdx >= blocksOrder.length) return;
    const newOrder = reorderArray(blocksOrder, orderIndex, targetIdx);
    setBlocksOrder(newOrder);
    handleApplyLayout(columnFlip, newOrder, deletedBlocks, extraBlocks);
  };

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
    handleApplyLayout(columnFlip, nextOrder, nextDeleted, nextExtra);
  };

  const handleRestoreBlock = (blockKey) => {
    const nextDeleted = deletedBlocks.filter((k) => k !== blockKey);
    setDeletedBlocks(nextDeleted);
    handleApplyLayout(columnFlip, blocksOrder, nextDeleted, extraBlocks);
  };

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
    handleApplyLayout(columnFlip, nextOrder, deletedBlocks, nextExtra);
  };

  // Handle Apply Typography & Alignment styles
  const handleApplyStyles = (overrides = {}) => {
    const nextStyles = {
      textAlign: overrides.textAlign !== undefined ? overrides.textAlign : textAlign,
      centerContainer: overrides.centerContainer !== undefined ? overrides.centerContainer : centerContainer,
      titleSize: overrides.titleSize !== undefined ? overrides.titleSize : titleSize,
      bodySize: overrides.bodySize !== undefined ? overrides.bodySize : bodySize,
      fontScale: overrides.fontScale !== undefined ? overrides.fontScale : fontScale,
    };

    if (onUpdateSectionStyles && currentSection) {
      onUpdateSectionStyles({
        instanceId: currentSection.instanceId,
        styleSettings: nextStyles,
      });
      if (overrides.notify) {
        showNotification(
          nextStyles.textAlign === 'center'
            ? 'Đã căn giữa (Center) và cập nhật cỡ chữ cho Section!'
            : 'Đã lưu căn lề & cỡ chữ cho Section!'
        );
      }
    }
  };

  // Handle Reset Typography & Alignment to defaults
  const handleResetStyles = () => {
    setTextAlign('default');
    setCenterContainer(false);
    setTitleSize('default');
    setBodySize('default');
    setFontScale(100);

    if (onUpdateSectionStyles && currentSection) {
      onUpdateSectionStyles({
        instanceId: currentSection.instanceId,
        styleSettings: {
          textAlign: 'default',
          centerContainer: false,
          titleSize: 'default',
          bodySize: 'default',
          fontScale: 100,
        },
      });
      showNotification('Đã khôi phục căn lề & cỡ chữ mặc định ban đầu!');
    }
  };

  const isEducation = ['courses', 'schedule', 'roadmap', 'teachers', 'needs'].includes(
    currentSection.category || currentSection.sectionDef?.category
  );

  return (
    <aside className="w-80 sm:w-92 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] shrink-0 z-30 select-none overflow-hidden sticky top-16 shadow-2xl">

      {/* Top Header: Title & Close / Collapse Button */}
      <div className="p-3.5 px-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Sliders className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-1.5 leading-none">
              <span>Tùy Chỉnh Section</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Thay ảnh, đổi thẻ, căn lề & nút bấm
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Thu gọn bảng tùy chỉnh bên phải"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toast Notification Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0 shadow-md">
          <Check className="w-4 h-4 shrink-0" />
          <span className="truncate">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Scrollable Inspector Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5 scrollbar-thin">

        {/* 1. Quick Section Selector Dropdown */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Đang Chọn Section (#{currentIndex + 1} / {sections.length})
          </label>
          <div className="relative">
            <select
              value={currentSection.instanceId}
              onChange={(e) => {
                const targetId = e.target.value;
                if (onSelectSection) onSelectSection(targetId);
                // Smooth scroll to canvas section
                const el =
                  document.getElementById(targetId) ||
                  document.querySelector(`[data-section-id*="${targetId}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="w-full px-3 py-2 pr-8 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            >
              {sections.map((sec, idx) => (
                <option key={sec.instanceId} value={sec.instanceId}>
                  #{idx + 1} - {sec.name || sec.sectionDef?.name || 'Section'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1">
            <span className="text-slate-400 truncate max-w-[170px]">
              Nguồn: <strong className="text-slate-300">{currentSection.sectionDef?.source || 'Tùy Biến'}</strong>
            </span>
            {isEducation ? (
              <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                <GraduationCap className="w-3 h-3" />
                <span>Giáo Dục</span>
              </span>
            ) : (
              <span className="text-blue-400 font-bold flex items-center gap-1 shrink-0">
                <Globe className="w-3 h-3" />
                <span>Phổ Thông</span>
              </span>
            )}
          </div>
        </div>

        {/* 1.5. Thay Ảnh Trực Tiếp */}
        {(() => {
          const currentCode = currentSection.customCode || getSectionSourceCode(currentSection);
          const images = extractSectionImages(currentCode, currentSection.customData, extraBlocks);
          return (
            <div className="space-y-3 p-4 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-600/30 text-pink-400 border border-pink-500/40 flex items-center justify-center font-bold text-xs">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-white">
                      Hình Ảnh Section
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Thay link ảnh hoặc tải ảnh từ máy tính
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-pink-300 font-mono text-[10px] font-bold">
                  {images.length} ảnh
                </span>
              </div>

              {images.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic p-2 bg-slate-950/40 rounded-xl text-center">
                  Section này không có thẻ hình ảnh &lt;img&gt; nào.
                </p>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <div
                      key={`${img.src}-${idx}`}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-amber-400 font-mono">
                          #{idx + 1} {img.alt ? `(${img.alt.slice(0, 25)})` : ''}
                        </span>
                        <label className="cursor-pointer px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition">
                          <Upload className="w-3 h-3 text-pink-400" />
                          <span>Tải ảnh lên</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const base64 = evt.target?.result;
                                if (base64) handleUpdateImage(img.src, base64);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={img.src}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          defaultValue={img.src}
                          placeholder="Dán link ảnh https://..."
                          onBlur={(e) => {
                            if (e.target.value !== img.src) {
                              handleUpdateImage(img.src, e.target.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            }
                          }}
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono truncate"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}


        {/* 1.7. Bố Cục Cột & Khối Con */}
        <div className="space-y-3 p-4 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                <Columns className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>Bố Cục Cột & Khối Con</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Đổi chỗ hình trái/phải & di chuyển khối con
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddBlockModalOpen(true)}
              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3 h-3 text-emerald-200" />
              <span>+ Thêm Khối</span>
            </button>
          </div>

          {/* Bố cục cột: 3 tùy chọn */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vị Trí Cột (Column Flip):
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => handleSetColumnFlip('default')}
                className={`py-1.5 px-1 rounded-xl font-bold border transition text-center ${
                  columnFlip === 'default'
                    ? 'bg-blue-600 text-white border-blue-400 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Chữ Trái - Hình Phải (Gốc)"
              >
                Chữ Trái
              </button>
              <button
                type="button"
                onClick={() => handleSetColumnFlip('image-left')}
                className={`py-1.5 px-1 rounded-xl font-bold border transition text-center ${
                  columnFlip === 'image-left'
                    ? 'bg-amber-600 text-white border-amber-400 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Đổi chỗ: Hình Trái - Chữ Phải"
              >
                ⇄ Hình Trái ⭐
              </button>
              <button
                type="button"
                onClick={() => handleSetColumnFlip('stacked-center')}
                className={`py-1.5 px-1 rounded-xl font-bold border transition text-center ${
                  columnFlip === 'stacked-center'
                    ? 'bg-purple-600 text-white border-purple-400 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Xếp Dọc Căn Giữa"
              >
                Xếp Dọc
              </button>
            </div>
          </div>

          {/* Danh Sách Khối Con Đổi Vị Trí Nhanh */}
          <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vị Trí Khối Con (Di chuyển ⬆ ⬇ / Xóa 🗑️):
            </span>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {blocksOrder
                .filter((k) => !deletedBlocks.includes(k))
                .map((blockKey, idx, arr) => {
                  const isExtra = extraBlocks.some((b) => b.id === blockKey);
                  const extraBlock = isExtra ? extraBlocks.find((b) => b.id === blockKey) : null;
                  const meta = BLOCK_META_MAP[blockKey] || {};
                  const label = isExtra
                    ? extraBlock?.title || `Khối mới (${extraBlock?.type})`
                    : meta.label || blockKey;

                  return (
                    <div
                      key={blockKey}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between gap-1.5 text-xs text-white"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-4 h-4 rounded bg-slate-800 text-amber-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-200 truncate max-w-[130px]" title={label}>
                          {label}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, -1)}
                          disabled={idx === 0}
                          className={`p-1 rounded border text-[10px] transition ${
                            idx === 0
                              ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'text-slate-300 hover:text-white hover:bg-blue-600 border-slate-700'
                          }`}
                          title="Lên trên"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(idx, 1)}
                          disabled={idx === arr.length - 1}
                          className={`p-1 rounded border text-[10px] transition ${
                            idx === arr.length - 1
                              ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'text-slate-300 hover:text-white hover:bg-blue-600 border-slate-700'
                          }`}
                          title="Xuống dưới"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(blockKey)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700 transition"
                          title="Ẩn/Xóa khối này"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {deletedBlocks.length > 0 && (
              <div className="pt-1.5 flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-slate-400">Đã ẩn:</span>
                {deletedBlocks.map((delKey) => (
                  <button
                    key={delKey}
                    type="button"
                    onClick={() => handleRestoreBlock(delKey)}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 hover:text-white hover:bg-emerald-600 text-[9px] font-bold transition flex items-center gap-0.5"
                    title="Bấm để khôi phục lại"
                  >
                    <span>+{BLOCK_META_MAP[delKey]?.tag || delKey}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Typography & Alignment Customizer (Text Center & Font-Size) */}
        <div className="space-y-4 p-4 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-md">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                <Type className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>Căn Lề & Cỡ Chữ</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                    Trực Tiếp
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Căn giữa (Center) & cỡ chữ không cần sửa code
                </p>
              </div>
            </div>
            {textAlign === 'center' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                Giữa ⭐
              </span>
            )}
          </div>

          {/* Field 1: Căn lề văn bản (Text Align) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span>Căn Lề Văn Bản (Text Align)</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {textAlign === 'center'
                  ? 'Căn Giữa (Center)'
                  : textAlign === 'left'
                  ? 'Căn Trái (Left)'
                  : textAlign === 'right'
                  ? 'Căn Phải (Right)'
                  : 'Mặc Định'}
              </span>
            </label>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setTextAlign('default');
                  handleApplyStyles({ textAlign: 'default', notify: true });
                }}
                className={`py-2 px-1 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                  textAlign === 'default'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Theo thiết kế gốc của section"
              >
                <span className="text-[10px]">Tự Động</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTextAlign('left');
                  handleApplyStyles({ textAlign: 'left', notify: true });
                }}
                className={`py-2 px-1 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                  textAlign === 'left'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Căn lề trái"
              >
                <AlignLeft className="w-4 h-4" />
                <span className="text-[10px]">Trái</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTextAlign('center');
                  handleApplyStyles({ textAlign: 'center', notify: true });
                }}
                className={`py-2 px-1 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                  textAlign === 'center'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:border-emerald-500/50'
                }`}
                title="Căn giữa toàn bộ chữ & tiêu đề (Text Center)"
              >
                <AlignCenter className="w-4 h-4 text-emerald-300" />
                <span className="text-[10px] text-emerald-300 font-extrabold">Giữa ⭐</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTextAlign('right');
                  handleApplyStyles({ textAlign: 'right', notify: true });
                }}
                className={`py-2 px-1 rounded-xl font-bold border transition flex flex-col items-center justify-center gap-1 ${
                  textAlign === 'right'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Căn lề phải"
              >
                <AlignRight className="w-4 h-4" />
                <span className="text-[10px]">Phải</span>
              </button>
            </div>

            {/* Center Container Toggle */}
            {textAlign === 'center' && (
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 cursor-pointer hover:bg-slate-950 transition">
                <input
                  type="checkbox"
                  checked={centerContainer}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setCenterContainer(val);
                    handleApplyStyles({ centerContainer: val, notify: false });
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
                />
                <span>Căn giữa cả khung nội dung & nút bấm (Center Container)</span>
              </label>
            )}
          </div>

          {/* Field 2: Cỡ chữ tiêu đề chính (Headline Size) */}
          <div className="space-y-2 pt-2 border-t border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5 text-amber-400" />
                <span>Cỡ Chữ Tiêu Đề (Headline)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-1.5 py-0.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition">
                  <input
                    type="number"
                    min="12"
                    max="120"
                    value={titleSize === 'default' ? '' : titleSize}
                    placeholder="Gốc"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 'default' : Math.max(10, Math.min(150, Number(e.target.value)));
                      setTitleSize(val);
                      handleApplyStyles({ titleSize: val, notify: false });
                    }}
                    className="w-12 bg-transparent text-xs text-amber-300 font-mono font-bold text-right focus:outline-none placeholder-slate-500"
                    title="Nhập số px chính xác cho cỡ chữ tiêu đề"
                  />
                  <span className="ml-1 text-[10px] text-slate-400 font-mono font-bold select-none">px</span>
                </div>
              </div>
            </div>

            {/* Quick Presets for Heading */}
            <div className="grid grid-cols-5 gap-1 text-[10px]">
              {[
                { label: 'Gốc', val: 'default' },
                { label: '26px', val: 26 },
                { label: '34px', val: 34 },
                { label: '44px', val: 44 },
                { label: '56px', val: 56 },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => {
                    setTitleSize(opt.val);
                    handleApplyStyles({ titleSize: opt.val, notify: false });
                  }}
                  className={`py-1 rounded-lg font-bold border transition ${
                    titleSize === opt.val
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Range Slider for Headline */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[9px] text-slate-500 font-mono">16px</span>
              <input
                type="range"
                min="16"
                max="96"
                step="1"
                value={titleSize === 'default' ? 40 : Math.max(16, Math.min(96, Number(titleSize)))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTitleSize(val);
                  handleApplyStyles({ titleSize: val, notify: false });
                }}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[9px] text-slate-500 font-mono">96px</span>
            </div>
          </div>

          {/* Field 3: Cỡ chữ đoạn văn & mô tả (Body Size) */}
          <div className="space-y-2 pt-2 border-t border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cỡ Chữ Mô Tả (Body)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-1.5 py-0.5 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition">
                  <input
                    type="number"
                    min="8"
                    max="60"
                    value={bodySize === 'default' ? '' : bodySize}
                    placeholder="Gốc"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 'default' : Math.max(8, Math.min(80, Number(e.target.value)));
                      setBodySize(val);
                      handleApplyStyles({ bodySize: val, notify: false });
                    }}
                    className="w-12 bg-transparent text-xs text-cyan-300 font-mono font-bold text-right focus:outline-none placeholder-slate-500"
                    title="Nhập số px chính xác cho cỡ chữ nội dung"
                  />
                  <span className="ml-1 text-[10px] text-slate-400 font-mono font-bold select-none">px</span>
                </div>
              </div>
            </div>

            {/* Quick Presets for Body */}
            <div className="grid grid-cols-5 gap-1 text-[10px]">
              {[
                { label: 'Gốc', val: 'default' },
                { label: '14px', val: 14 },
                { label: '16px', val: 16 },
                { label: '18px', val: 18 },
                { label: '20px', val: 20 },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => {
                    setBodySize(opt.val);
                    handleApplyStyles({ bodySize: opt.val, notify: false });
                  }}
                  className={`py-1 rounded-lg font-bold border transition ${
                    bodySize === opt.val
                      ? 'bg-cyan-600 text-white border-cyan-400 font-black'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Range Slider for Body */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[9px] text-slate-500 font-mono">10px</span>
              <input
                type="range"
                min="10"
                max="32"
                step="1"
                value={bodySize === 'default' ? 16 : Math.max(10, Math.min(32, Number(bodySize)))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBodySize(val);
                  handleApplyStyles({ bodySize: val, notify: false });
                }}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[9px] text-slate-500 font-mono">32px</span>
            </div>
          </div>

          {/* Field 4: Tỷ lệ cỡ chữ toàn Section (Font Scale) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Tỷ Lệ Chữ Toàn Section (Zoom)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700 px-1.5 py-0.5 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition">
                  <input
                    type="number"
                    min="50"
                    max="200"
                    value={fontScale}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 100 : Math.max(50, Math.min(200, Number(e.target.value)));
                      setFontScale(val);
                      handleApplyStyles({ fontScale: val, notify: false });
                    }}
                    className="w-12 bg-transparent text-xs text-purple-300 font-mono font-bold text-right focus:outline-none placeholder-slate-500"
                    title="Nhập tỷ lệ % phóng to / thu nhỏ toàn section"
                  />
                  <span className="ml-1 text-[10px] text-slate-400 font-mono font-bold select-none">%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-500 font-mono">70%</span>
              <input
                type="range"
                min="70"
                max="160"
                step="2"
                value={Math.max(70, Math.min(160, Number(fontScale) || 100))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFontScale(val);
                  handleApplyStyles({ fontScale: val, notify: false });
                }}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-[9px] text-slate-500 font-mono">160%</span>
            </div>
          </div>

          {/* Actions: Save / Apply & Reset */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700/80">
            <button
              type="button"
              onClick={() => handleApplyStyles({ notify: true })}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu Căn Lề & Chữ</span>
            </button>

            <button
              type="button"
              onClick={handleResetStyles}
              className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
              title="Khôi phục lại căn lề và cỡ chữ mặc định ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục</span>
            </button>
          </div>
        </div>

        {/* 3. WordPress-style Button CTA Customizer */}
        <div className="space-y-4 p-4 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-md">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                🔘
              </span>
              <div>
                <h4 className="font-heading font-black text-xs sm:text-sm text-white">
                  Tùy Chỉnh Nút Bấm (Button CTA)
                </h4>
                <p className="text-[10px] text-slate-400">
                  Tùy chỉnh nút như WordPress & xuất file code
                </p>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Xem Trước Nút Bấm Thực Tế:
            </span>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-center min-h-[75px] shadow-inner overflow-hidden">
              <ButtonCTA
                text={buttonText}
                targetSection={buttonTarget}
                variant={buttonVariant}
                size={buttonSize}
                icon={buttonIcon}
              />
            </div>
          </div>

          {/* Field: Button Text */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-300">
              Văn Bản Trên Nút (Text) *
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="VD: Đăng ký tư vấn ngay"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          {/* Field: Target Section / Link */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span>Đích Đến Khi Click (Cuộn Mượt)</span>
              <span className="text-[10px] text-amber-400 font-mono">#{buttonTarget}</span>
            </label>
            <select
              value={buttonTarget}
              onChange={(e) => setButtonTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            >
              {targetOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Field: Variant (Màu Sắc / Style) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300">
              Kiểu Dáng Nút (Variant)
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setButtonVariant('primary')}
                className={`py-2 px-2 rounded-xl font-bold border transition flex items-center justify-center gap-1.5 text-xs ${buttonVariant === 'primary'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>Primary Xanh</span>
              </button>

              <button
                type="button"
                onClick={() => setButtonVariant('secondary')}
                className={`py-2 px-2 rounded-xl font-bold border transition flex items-center justify-center gap-1.5 text-xs ${buttonVariant === 'secondary'
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Vàng Gold ⭐</span>
              </button>

              <button
                type="button"
                onClick={() => setButtonVariant('outline')}
                className={`py-2 px-2 rounded-xl font-bold border transition flex items-center justify-center gap-1.5 text-xs ${buttonVariant === 'outline'
                  ? 'bg-slate-800 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-slate-400" />
                <span>Viền Trong</span>
              </button>

              <button
                type="button"
                onClick={() => setButtonVariant('glow')}
                className={`py-2 px-2 rounded-xl font-bold border transition flex items-center justify-center gap-1.5 text-xs ${buttonVariant === 'glow'
                  ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white border-purple-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Glow VIP</span>
              </button>
            </div>
          </div>

          {/* Field: Size & Icon Toggle */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                Kích Thước (Size)
              </label>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                {['sm', 'md', 'lg'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setButtonSize(sz)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold uppercase transition ${buttonSize === sz
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                Mũi Tên →
              </label>
              <button
                type="button"
                onClick={() => setButtonIcon((prev) => !prev)}
                className={`w-full py-1.5 px-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${buttonIcon
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
              >
                <span>{buttonIcon ? '✓ Có Mũi Tên' : 'Không Mũi Tên'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Apply, Save Component, Export Code */}
          <div className="space-y-2 pt-2 border-t border-slate-700/80">

            {/* 1. Apply changes to current canvas section */}
            <button
              onClick={handleApplyToSection}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Cập Nhật Vào Section Này</span>
            </button>

            {/* 2. Save as Component Button into library */}
            <button
              onClick={handleSaveAsComponentButton}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition active:scale-95 flex items-center justify-center gap-2"
              title="Lưu nút bấm này vào tab Khối Con & Button ở cột bên trái"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Lưu Thành Component Button</span>
            </button>

            {/* 3. Export Code & Copy JSX buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleDownloadButtonCode}
                className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                title="Tải file code .jsx của component nút này về máy"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất File .jsx</span>
              </button>

              <button
                onClick={handleCopyJSX}
                className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                title="Copy mã gọi JSX vào clipboard"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{copiedCode ? 'Đã Copy!' : 'Copy Mã JSX'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* 3. Section Level Quick Actions */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Thao Tác Section Này
          </label>

          <div className="grid grid-cols-2 gap-2">
            {onEditSectionContent && (
              <button
                onClick={() => onEditSectionContent(currentSection)}
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa Nội Dung</span>
              </button>
            )}

            {onEditSectionCode && (
              <button
                onClick={() => onEditSectionCode(currentSection)}
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Sửa Mã JSX</span>
              </button>
            )}
          </div>

          {/* Move & Delete */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => onMoveUp && onMoveUp(currentIndex)}
              disabled={currentIndex === 0}
              className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${currentIndex === 0
                ? 'text-slate-600 border-slate-800/80 cursor-not-allowed opacity-40'
                : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700'
                }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Lên</span>
            </button>

            <button
              onClick={() => onMoveDown && onMoveDown(currentIndex)}
              disabled={currentIndex === sections.length - 1}
              className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 ${currentIndex === sections.length - 1
                ? 'text-slate-600 border-slate-800/80 cursor-not-allowed opacity-40'
                : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700'
                }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Xuống</span>
            </button>

            {onDeleteSection && (
              <button
                onClick={() => onDeleteSection(currentIndex)}
                className="p-1.5 px-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                title="Xóa section này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Ghim cố định khi cuộn canvas</span>
        </span>
        <span className="font-mono text-slate-500">#{currentIndex + 1} Selected</span>
      </div>

      {/* Modal: Thêm Khối Con Nhanh */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-white">
                    Thêm Khối Con Mới
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Bổ sung component vào Section và cập nhật code JSX
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {ADDABLE_BLOCK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.type}
                  type="button"
                  onClick={() => handleAddExtraBlock(tmpl)}
                  className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500 text-left transition group active:scale-95 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-blue-300">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {tmpl.description}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddBlockModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}
