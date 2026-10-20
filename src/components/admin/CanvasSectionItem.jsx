import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Code,
  Edit3,
  Copy,
  Check,
  Sparkles,
  Sliders,
  FileText,
  Download,
  PlusCircle,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import CustomCodeRenderer from './CustomCodeRenderer';
import ResponsiveIframe from './ResponsiveIframe';
import InlineSectionLiveEditor from './InlineSectionLiveEditor';
import { getSectionSourceCode } from '../../data/sectionsRawCode';
import { generateBlockCssRules } from '../../utils/sectionBlockManager';
import { switchSectionColorTheme, detectSectionTheme } from '../../utils/sectionColorTransform';
import ButtonCTA from '../common/ButtonCTA';
import TextWithImage from '../common/TextWithImage';

/**
 * SectionStyledWrapper: Applies scoped text alignment (left/center/right),
 * headline size, body text size, overall font scale,
 * column layout flip (image left/right), and block reordering dynamically.
 */
function SectionStyledWrapper({
  instanceId,
  styleSettings = {},
  layoutSettings = {},
  isCustomSection = false,
  children,
}) {
  const {
    textAlign = 'default',
    centerContainer = false,
    titleSize = 'default',
    bodySize = 'default',
    fontScale = 100,
  } = styleSettings;

  const safeId = String(instanceId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const wrapperId = `sec-wrap-${safeId}`;

  let css = '';

  // 1. TEXT ALIGNMENT
  if (textAlign === 'center') {
    css += `
      #${wrapperId} {
        text-align: center !important;
      }
      #${wrapperId} h1,
      #${wrapperId} h2,
      #${wrapperId} h3,
      #${wrapperId} h4,
      #${wrapperId} h5,
      #${wrapperId} h6,
      #${wrapperId} p,
      #${wrapperId} .section-header,
      #${wrapperId} header,
      #${wrapperId} [class*="text-left"],
      #${wrapperId} [class*="lg:text-left"],
      #${wrapperId} [class*="md:text-left"],
      #${wrapperId} [class*="sm:text-left"] {
        text-align: center !important;
      }
      #${wrapperId} [class*="justify-start"],
      #${wrapperId} [class*="lg:justify-start"],
      #${wrapperId} [class*="md:justify-start"],
      #${wrapperId} [class*="sm:justify-start"] {
        justify-content: center !important;
      }
      #${wrapperId} [class*="items-start"],
      #${wrapperId} [class*="lg:items-start"],
      #${wrapperId} [class*="md:items-start"],
      #${wrapperId} [class*="sm:items-start"] {
        align-items: center !important;
      }
      #${wrapperId} [class*="lg:mx-0"],
      #${wrapperId} [class*="md:mx-0"],
      #${wrapperId} [class*="mx-0"] {
        margin-left: auto !important;
        margin-right: auto !important;
      }
      #${wrapperId} .inline-flex,
      #${wrapperId} [class*="inline-flex"] {
        margin-left: auto !important;
        margin-right: auto !important;
      }
      #${wrapperId} ul:not([class*="grid"]),
      #${wrapperId} ol:not([class*="grid"]) {
        display: inline-block;
        text-align: left;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    `;

    if (centerContainer) {
      css += `
        #${wrapperId} [class*="lg:col-span-"],
        #${wrapperId} [class*="max-w-2xl"],
        #${wrapperId} [class*="max-w-3xl"],
        #${wrapperId} [class*="max-w-xl"],
        #${wrapperId} [class*="max-w-lg"] {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `;
    }
  } else if (textAlign === 'left') {
    css += `
      #${wrapperId} {
        text-align: left !important;
      }
      #${wrapperId} h1,
      #${wrapperId} h2,
      #${wrapperId} h3,
      #${wrapperId} h4,
      #${wrapperId} h5,
      #${wrapperId} h6,
      #${wrapperId} p,
      #${wrapperId} [class*="text-center"],
      #${wrapperId} [class*="lg:text-center"],
      #${wrapperId} [class*="md:text-center"],
      #${wrapperId} [class*="sm:text-center"] {
        text-align: left !important;
      }
      #${wrapperId} [class*="justify-center"],
      #${wrapperId} [class*="lg:justify-center"],
      #${wrapperId} [class*="md:justify-center"] {
        justify-content: flex-start !important;
      }
      #${wrapperId} [class*="items-center"],
      #${wrapperId} [class*="lg:items-center"],
      #${wrapperId} [class*="md:items-center"] {
        align-items: flex-start !important;
      }
      #${wrapperId} [class*="mx-auto"],
      #${wrapperId} [class*="lg:mx-auto"],
      #${wrapperId} [class*="md:mx-auto"] {
        margin-left: 0 !important;
      }
    `;
  } else if (textAlign === 'right') {
    css += `
      #${wrapperId} {
        text-align: right !important;
      }
      #${wrapperId} h1,
      #${wrapperId} h2,
      #${wrapperId} h3,
      #${wrapperId} h4,
      #${wrapperId} h5,
      #${wrapperId} h6,
      #${wrapperId} p,
      #${wrapperId} [class*="text-center"],
      #${wrapperId} [class*="text-left"],
      #${wrapperId} [class*="lg:text-center"],
      #${wrapperId} [class*="lg:text-left"] {
        text-align: right !important;
      }
      #${wrapperId} [class*="justify-center"],
      #${wrapperId} [class*="justify-start"],
      #${wrapperId} [class*="lg:justify-center"],
      #${wrapperId} [class*="lg:justify-start"] {
        justify-content: flex-end !important;
      }
      #${wrapperId} [class*="items-center"],
      #${wrapperId} [class*="items-start"],
      #${wrapperId} [class*="lg:items-center"],
      #${wrapperId} [class*="lg:items-start"] {
        align-items: flex-end !important;
      }
      #${wrapperId} [class*="mx-auto"] {
        margin-left: auto !important;
        margin-right: 0 !important;
      }
    `;
  }

  // 2. HEADLINE SIZE
  if (titleSize && titleSize !== 'default') {
    const px = Number(titleSize);
    if (!isNaN(px) && px > 0) {
      css += `
        #${wrapperId} h1,
        #${wrapperId} h2,
        #${wrapperId} [class*="font-heading"],
        #${wrapperId} [class*="text-2xl"],
        #${wrapperId} [class*="text-3xl"],
        #${wrapperId} [class*="text-4xl"],
        #${wrapperId} [class*="text-5xl"],
        #${wrapperId} [class*="text-6xl"] {
          font-size: ${px}px !important;
          line-height: 1.18 !important;
        }
      `;
    }
  }

  // 3. BODY SIZE
  if (bodySize && bodySize !== 'default') {
    const px = Number(bodySize);
    if (!isNaN(px) && px > 0) {
      css += `
        #${wrapperId} p,
        #${wrapperId} [class*="text-slate-600"],
        #${wrapperId} [class*="text-slate-500"],
        #${wrapperId} [class*="text-slate-700"],
        #${wrapperId} [class*="text-sm"],
        #${wrapperId} [class*="text-base"],
        #${wrapperId} [class*="text-lg"] {
          font-size: ${px}px !important;
          line-height: 1.6 !important;
        }
      `;
    }
  }

  // 4. OVERALL FONT SCALE
  if (fontScale && fontScale !== 100) {
    const scale = Number(fontScale);
    if (!isNaN(scale) && scale >= 50 && scale <= 200) {
      css += `
        #${wrapperId} {
          font-size: ${scale}%;
        }
      `;
    }
  }

  // 5. BLOCK REORDERING & COLUMN FLIP CSS
  const blockCss = generateBlockCssRules(wrapperId, layoutSettings);
  if (blockCss) {
    css += blockCss;
  }

  const extraBlocks = layoutSettings?.extraBlocks || [];

  return (
    <div id={wrapperId} className="w-full relative transition-all duration-150">
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {children}
      {!isCustomSection && extraBlocks.length > 0 && (
        <div className="extra-blocks-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-3 justify-center border-t border-slate-100/80 bg-slate-50/50">
          {extraBlocks.map((b) => {
            if (b.type === 'split-text-image' || b.type === 'text-with-image') {
              return (
                <div key={b.id} data-block-id={b.id} className="w-full">
                  <TextWithImage
                    eyebrow={b.props?.eyebrow}
                    title={b.props?.title}
                    highlight={b.props?.highlight}
                    desc={b.props?.desc}
                    bullets={b.props?.bullets}
                    buttonText={b.props?.buttonText}
                    buttonVariant={b.props?.buttonVariant}
                    targetSection={b.props?.targetSection}
                    imagePosition={b.props?.imagePosition || 'right'}
                    imageSrc={b.props?.imageSrc}
                    imageAlt={b.props?.imageAlt}
                    imageBadge={b.props?.imageBadge}
                  />
                </div>
              );
            }
            if (b.type === 'heading') {
              return (
                <div key={b.id} data-block-id={b.id} className="text-center py-2 w-full max-w-3xl mx-auto">
                  {b.props?.eyebrow && (
                    <span className="mb-1 inline-block text-[11px] font-extrabold tracking-[0.14em] text-accent uppercase">
                      {b.props?.eyebrow}
                    </span>
                  )}
                  <h2 className="text-[26px] font-bold leading-[1.25] tracking-[-0.6px] text-primary sm:text-[30px] md:text-[34px]">
                    {b.props?.title || 'Tiêu Đề Khối'}{' '}
                    {b.props?.highlight && (
                      <span className="text-secondary">{b.props?.highlight}</span>
                    )}
                  </h2>
                  {b.props?.desc && (
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                      {b.props?.desc}
                    </p>
                  )}
                </div>
              );
            }
            if (b.type === 'button') {
              return (
                <div key={b.id} data-block-id={b.id} className="inline-block">
                  <ButtonCTA
                    text={b.props?.text || 'Nút Mới'}
                    variant={b.props?.variant || 'secondary'}
                    targetSection={b.props?.targetSection || 'tu-van'}
                  />
                </div>
              );
            }
            if (b.type === 'badge') {
              return (
                <div key={b.id} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 text-primary text-xs font-bold border border-secondary/30">
                  <span>{b.props?.text || 'Huy Hiệu Mới'}</span>
                </div>
              );
            }
            if (b.type === 'text') {
              return (
                <p key={b.id} className="text-xs sm:text-sm text-slate-600 font-medium py-1">
                  {b.props?.text}
                </p>
              );
            }
            if (b.type === 'stat') {
              return (
                <div key={b.id} className="p-3 rounded-xl bg-white shadow-sm border border-slate-200 inline-block text-center">
                  <div className="font-heading font-black text-2xl text-primary">{b.props?.number}</div>
                  <div className="text-xs text-slate-500">{b.props?.label}</div>
                </div>
              );
            }
            if (b.type === 'highlight') {
              return (
                <div key={b.id} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{b.props?.text}</span>
                </div>
              );
            }
            if (b.type === 'image') {
              return (
                <img key={b.id} src={b.props?.src} alt={b.props?.alt} className="rounded-2xl shadow-md max-w-full my-2 max-h-48" />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default function CanvasSectionItem({
  item,
  index,
  total,
  viewport = 'desktop',
  showToolbar = true,
  isSelected = false,
  onSelect,
  onCustomizeButton,
  onSwitchSectionColor,
  onUpdateSectionData,
  onUpdateSectionLiveCode,
  onUpdateSectionStyles,
  onUpdateSectionLayout,
  onMoveUp,
  onMoveDown,
  onDelete,
  onViewCode,
  onEditCode,
  onEditContent,
  activeTheme,
  activeFont,
  activeRadius = 16,
}) {
  const { sectionDef, customData, isCustom, customCode } = item;
  const isCustomSection = isCustom || sectionDef?.isCustom;
  const Component = sectionDef?.component;
  const [copied, setCopied] = useState(false);

  const [inlineEditorMode, setInlineEditorMode] = useState(null); // null | 'wireframe' | 'code' | 'export'
  const isInlineEditorOpen = Boolean(inlineEditorMode);

  // Nhận diện tông màu hiện tại của section (Primary hay Secondary)
  const currentColorTheme =
    item.colorTheme ||
    item.styleSettings?.colorTheme ||
    detectSectionTheme(item.customCode || getSectionSourceCode(item));

  // Chuyển đổi màu sắc trực tiếp trên Section không cần vào code
  const handleSwitchColorTheme = (targetTheme) => {
    if (onSwitchSectionColor) {
      onSwitchSectionColor(item.instanceId, targetTheme);
    } else {
      const code = item.customCode || getSectionSourceCode(item);
      const newCode = switchSectionColorTheme(code, targetTheme);
      onUpdateSectionLiveCode && onUpdateSectionLiveCode(item.instanceId, newCode);
      onUpdateSectionStyles &&
        onUpdateSectionStyles({
          instanceId: item.instanceId,
          styleSettings: {
            ...(item.styleSettings || {}),
            colorTheme: targetTheme,
          },
        });
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    const codeToCopy =
      customCode ||
      getSectionSourceCode(item);
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSectionCode = (e) => {
    e.stopPropagation();
    const code = item.customCode || getSectionSourceCode(item);
    const cleanName = (item.name || sectionDef?.name || 'Section')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_');
    const fileName = `${cleanName}.jsx`;

    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const sectionId =
    item.sectionDef?.id ||
    item.instanceId ||
    (item.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div
      id={sectionId}
      data-section-id={sectionId}
      onClick={() => onSelect && onSelect(item.instanceId)}
      className={`relative group/canvas-item rounded-3xl transition-all duration-200 scroll-mt-20 ${
        isSelected
          ? 'ring-4 ring-blue-500/40 border-2 border-blue-500 shadow-xl'
          : 'border-2 border-transparent hover:border-blue-500/40'
      }`}
    >

      {/* Section Toolbar (Clean, single-line, non-overlapping on mobile) */}
      {showToolbar && (
        <div
          className={`flex items-center justify-between gap-1.5 transition-all ${isMobile
              ? 'relative z-20 mb-2 mt-1 mx-0.5 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/90 shadow-md'
              : isTablet
                ? 'relative z-20 mb-2.5 mt-1.5 mx-1.5 px-3 py-1.5 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/90 shadow-lg'
                : 'relative z-20 mb-2 mt-1 mx-2 sm:mx-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-xl opacity-90 group-hover/canvas-item:opacity-100 transition-opacity'
            }`}
        >
          {/* Left: Section Info */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow-sm">
              #{index + 1}
            </span>
            <span
              className="font-heading font-extrabold text-xs text-white truncate min-w-0"
              title={item.name || sectionDef?.name || 'Section Tùy Biến'}
            >
              {item.name || sectionDef?.name || 'Section Tùy Biến'}
            </span>

            {/* Source/Type Badges (Only on desktop to save mobile space) */}
            {!isMobile && !isTablet && (
              isCustomSection ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono font-bold shrink-0">
                  <Code className="w-3 h-3" />
                  <span>Custom Code</span>
                </span>
              ) : sectionDef?.source ? (
                <span className="hidden lg:inline-block text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-mono truncate max-w-[160px] shrink-0">
                  {sectionDef.source}
                </span>
              ) : null
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0 flex-wrap sm:flex-nowrap justify-end">

            {/* 1. Sửa & Xóa Trực Tiếp (WordPress Gutenberg Wireframe Mode) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineEditorMode((prev) => (prev === 'wireframe' ? null : 'wireframe'));
                onSelect && onSelect(item.instanceId);
              }}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
              } ${
                inlineEditorMode === 'wireframe'
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-amber-500/30'
                  : 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border-amber-500/40'
              }`}
              title="Chỉnh sửa text và xóa phần tử trực tiếp trên màn hình (WordPress Gutenberg style)"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              {!isMobile && !isTablet && <span>Sửa & Xóa Text (WordPress)</span>}
              {isTablet && <span>Sửa Text</span>}
            </button>

            {/* 1.0 Chuyển Đổi Màu Primary / Secondary Trực Tiếp Ở Section */}
            <div
              className="flex items-center rounded-lg border border-slate-700 bg-slate-900/90 p-0.5 shrink-0 shadow-sm gap-0.5"
              title="Chuyển đổi màu sắc của Section giữa Primary (Đỏ/Hàn Quốc) và Secondary (Xanh/Đài Loan) trực tiếp không cần sửa code"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchColorTheme('primary');
                }}
                className={`rounded px-2 py-1 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                  currentColorTheme === 'primary'
                    ? 'bg-red-600 text-white font-extrabold shadow-sm shadow-red-500/40 ring-1 ring-red-400'
                    : 'text-slate-400 hover:text-red-300 hover:bg-slate-800'
                }`}
                title="Áp dụng màu Primary (Đỏ / Hàn Quốc / Chính) cho section này trực tiếp"
              >
                <span className={`w-2 h-2 rounded-full ${currentColorTheme === 'primary' ? 'bg-white' : 'bg-red-500'}`} />
                {!isMobile && <span>Primary</span>}
                {isMobile && <span>🔴</span>}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwitchColorTheme('secondary');
                }}
                className={`rounded px-2 py-1 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                  currentColorTheme === 'secondary'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-sm shadow-emerald-500/40 ring-1 ring-emerald-400'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                }`}
                title="Áp dụng màu Secondary (Xanh Lá / Đài Loan / Visa) cho section này trực tiếp"
              >
                <span className={`w-2 h-2 rounded-full ${currentColorTheme === 'secondary' ? 'bg-white' : 'bg-emerald-400'}`} />
                {!isMobile && <span>Secondary</span>}
                {isMobile && <span>🟢</span>}
              </button>
            </div>

            {/* 1.1 Chỉnh Sửa Hình Ảnh Trực Tiếp */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineEditorMode((prev) => (prev === 'images' ? null : 'images'));
                onSelect && onSelect(item.instanceId);
              }}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
              } ${
                inlineEditorMode === 'images'
                  ? 'bg-emerald-600 text-white font-extrabold border-emerald-400 shadow-emerald-500/30'
                  : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/40'
              }`}
              title="Xem và thay đổi toàn bộ hình ảnh trong section này trực tiếp"
            >
              <ImageIcon className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
              {!isMobile && !isTablet && <span>🖼️ Thay Ảnh Trực Tiếp</span>}
              {isTablet && <span>Ảnh</span>}
            </button>

            {/* 1.2 Tự Động Đổi Thẻ <div> ➔ <a> Khi Nhập Href */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineEditorMode((prev) => (prev === 'links' ? null : 'links'));
                onSelect && onSelect(item.instanceId);
              }}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
              } ${
                inlineEditorMode === 'links'
                  ? 'bg-cyan-600 text-white font-extrabold border-cyan-400 shadow-cyan-500/30'
                  : 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border-cyan-500/40'
              }`}
              title="Gắn link Href và tự động chuyển đổi thẻ <div> thành <a> không cần vào code"
            >
              <LinkIcon className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
              {!isMobile && !isTablet && <span>🔗 Đổi &lt;div&gt; ➔ &lt;a&gt;</span>}
              {isTablet && <span>Link</span>}
            </button>

            {/* 2. Chỉnh Sửa Code Trực Tiếp (Live JSX Editor) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineEditorMode((prev) => (prev === 'code' ? null : 'code'));
                onSelect && onSelect(item.instanceId);
              }}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
              } ${
                inlineEditorMode === 'code'
                  ? 'bg-cyan-600 text-white font-extrabold border-cyan-400 shadow-cyan-500/30'
                  : 'bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border-cyan-500/40'
              }`}
              title="Chỉnh sửa code JSX trực tiếp trên màn hình với Live Preview tức thì"
            >
              <Code className="w-3.5 h-3.5 shrink-0" />
              {!isMobile && !isTablet && <span>Code Trực Tiếp</span>}
              {isTablet && <span>Code</span>}
            </button>

            {/* 3. Xuất File Code .jsx 1-Click */}
            <button
              onClick={handleDownloadSectionCode}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2 py-1.5'
              } bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/40 active:scale-95 shadow-sm`}
              title="Tải ngay file mã nguồn .jsx của section này về máy"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              {!isMobile && !isTablet && <span>Xuất .jsx</span>}
            </button>

            {/* 4. Tùy Chỉnh Căn Lề, Cỡ Chữ & Nút (Inspector Button) */}
            {onCustomizeButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomizeButton(item);
                }}
                className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                  isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
                } ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 font-extrabold shadow-blue-500/30'
                    : 'bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border-blue-500/40'
                }`}
                title="Tùy chỉnh căn lề (text center), cỡ chữ & nút CTA cho section này"
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                {!isMobile && !isTablet && <span>Tùy Chỉnh (Chữ & Nút)</span>}
                {isTablet && <span>Tùy Chỉnh</span>}
              </button>
            )}

            {/* Quick Add Component into THIS Section */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineEditorMode('wireframe');
              }}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ${
                isMobile ? 'p-1.5' : 'px-2.5 py-1.5'
              } bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/40`}
              title="Thêm khối con (nút bấm, tiêu đề, badge,...) vào section này"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {!isMobile && !isTablet && <span>+ Thêm Khối Vào Section</span>}
              {isTablet && <span>+ Khối</span>}
            </button>

            {/* Quick Copy Code Button */}
            <button
              onClick={handleCopy}
              className={`rounded-lg border text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${isMobile ? 'p-1.5' : 'px-2 py-1.5'
                } ${copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                }`}
              title={copied ? 'Đã sao chép source code!' : 'Sao chép source code của section này'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 shrink-0" />
              )}
              {!isMobile && !isTablet && <span>{copied ? 'Đã Copy!' : 'Copy'}</span>}
            </button>

            {/* Move Up */}
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${index === 0
                  ? 'text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
                  : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              title="Di chuyển lên trên"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Move Down */}
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${index === total - 1
                  ? 'text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
                  : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              title="Di chuyển xuống dưới"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* View Code in Modal */}
            <button
              onClick={() => onViewCode(item)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors shrink-0"
              title="Xem mã JSX chi tiết"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(index)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-colors shrink-0"
              title="Xóa section này khỏi trang"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Inline Section Live Editor (WordPress Wireframe / Live JSX Code / Export) */}
      <InlineSectionLiveEditor
        item={item}
        isOpen={isInlineEditorOpen}
        initialTab={inlineEditorMode}
        onClose={() => setInlineEditorMode(null)}
        onUpdateCode={(instanceId, newCode) =>
          onUpdateSectionLiveCode && onUpdateSectionLiveCode(instanceId, newCode)
        }
        onUpdateData={(instanceId, updatedData, updatedCode, deletedFields) =>
          onUpdateSectionData &&
          onUpdateSectionData(instanceId, updatedData, updatedCode, deletedFields)
        }
        onUpdateStyles={(instanceId, styleSettings) =>
          onUpdateSectionStyles && onUpdateSectionStyles({ instanceId, styleSettings })
        }
        onUpdateLayout={(instanceId, layoutSettings, updatedCode) =>
          onUpdateSectionLayout && onUpdateSectionLayout({ instanceId, layoutSettings, updatedCode })
        }
        activeTheme={activeTheme}
        activeFont={activeFont}
        activeRadius={activeRadius}
      />

      {/* Render the actual component or Custom Code */}
      <div
        onDoubleClick={() => setInlineEditorMode('wireframe')}
        title="Nhấp đúp chuột để mở Soạn Thảo & Xóa Text (WordPress)"
        className={`overflow-hidden rounded-2xl bg-white shadow-sm mt-2 transition-all ${
          inlineEditorMode === 'wireframe'
            ? 'ring-2 ring-amber-500/50'
            : inlineEditorMode === 'code'
              ? 'ring-2 ring-cyan-500/50'
              : ''
        }`}
      >
        {/* Wireframe Mode Active Banner */}
        {inlineEditorMode === 'wireframe' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chế độ WordPress: Sửa câu chữ hoặc bấm nút thùng rác 🗑️ để xóa bớt phần tử ở bảng trên.</span>
            </span>
            <span className="font-mono text-[10px] text-amber-400/80">Bấm 'Xuất .jsx' để tải code</span>
          </div>
        )}

        {viewport !== 'desktop' ? (
          <ResponsiveIframe
            viewport={viewport}
            activeTheme={activeTheme}
            activeFont={activeFont}
            activeRadius={activeRadius}
            minHeight={0}
          >
            <SectionStyledWrapper
              instanceId={item.instanceId}
              styleSettings={item.styleSettings}
              layoutSettings={item.layoutSettings}
              isCustomSection={isCustomSection}
            >
              {isCustomSection ? (
                <CustomCodeRenderer
                  code={customCode || sectionDef?.customCode}
                  activeTheme={activeTheme}
                  activeFont={activeFont}
                  activeRadius={activeRadius}
                />
              ) : Component ? (
                <Component data={customData || sectionDef.defaultData} />
              ) : null}
            </SectionStyledWrapper>
          </ResponsiveIframe>
        ) : (
          <SectionStyledWrapper
            instanceId={item.instanceId}
            styleSettings={item.styleSettings}
            layoutSettings={item.layoutSettings}
            isCustomSection={isCustomSection}
          >
            {isCustomSection ? (
              <CustomCodeRenderer
                code={customCode || sectionDef?.customCode}
                activeTheme={activeTheme}
                activeFont={activeFont}
                activeRadius={activeRadius}
              />
            ) : Component ? (
              <Component data={customData || sectionDef.defaultData} />
            ) : (
              <div className="p-8 text-center text-slate-400">Không tìm thấy component hiển thị.</div>
            )}
          </SectionStyledWrapper>
        )}
      </div>

    </div>
  );
}
