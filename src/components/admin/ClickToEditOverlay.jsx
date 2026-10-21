import React, { useState, useEffect, useRef } from 'react';
import {
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Edit2,
  Palette,
  Type,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Box,
  Layers,
} from 'lucide-react';
import { replaceImageInCode } from '../../utils/sectionElementTransform';

// Preset color options for quick 1-click styling
const COLOR_PRESETS = [
  { name: 'Đỏ Hàn Quốc', hex: '#FE0000' },
  { name: 'Đỏ Đậm', hex: '#DC2626' },
  { name: 'Xanh Đài Loan', hex: '#008542' },
  { name: 'Xanh Lá', hex: '#16A34A' },
  { name: 'Xanh Dương', hex: '#2563EB' },
  { name: 'Xanh Navy', hex: '#1E3A8A' },
  { name: 'Vàng Amber', hex: '#D97706' },
  { name: 'Tím Sang Trọng', hex: '#7C3AED' },
  { name: 'Đen Đậm', hex: '#0F172A' },
  { name: 'Xám Đậm', hex: '#334155' },
  { name: 'Trắng', hex: '#FFFFFF' },
];

// Preset background colors for card / container blocks
const BG_COLOR_PRESETS = [
  { name: 'Trong suốt', hex: 'transparent' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Xám Nhạt', hex: '#F8FAFC' },
  { name: 'Xám Slate', hex: '#F1F5F9' },
  { name: 'Đỏ Hàn Quốc', hex: '#FE0000' },
  { name: 'Đỏ Nhạt (Badge)', hex: '#FEE2E2' },
  { name: 'Xanh Đài Loan', hex: '#008542' },
  { name: 'Xanh Lá Nhạt', hex: '#DCFCE7' },
  { name: 'Xanh Dương', hex: '#2563EB' },
  { name: 'Xanh Dương Nhạt', hex: '#DBEAFE' },
  { name: 'Vàng Nhạt', hex: '#FEF3C7' },
  { name: 'Đen Slate', hex: '#0F172A' },
];

// Preset font size options
const SIZE_PRESETS = [
  { label: '12px', val: '12px' },
  { label: '14px', val: '14px' },
  { label: '16px', val: '16px' },
  { label: '18px', val: '18px' },
  { label: '22px', val: '22px' },
  { label: '28px', val: '28px' },
  { label: '36px', val: '36px' },
  { label: '48px', val: '48px' },
];

// Preset spacing options for padding & margin
const SPACING_PRESETS = [
  { label: '0px', val: '0px' },
  { label: '4px', val: '4px' },
  { label: '8px', val: '8px' },
  { label: '12px', val: '12px' },
  { label: '16px', val: '16px' },
  { label: '20px', val: '20px' },
  { label: '24px', val: '24px' },
  { label: '32px', val: '32px' },
  { label: '40px', val: '40px' },
  { label: '48px', val: '48px' },
  { label: '64px', val: '64px' },
];

/**
 * ClickToEditOverlay:
 * Allows user to click directly on elements in the rendered section:
 * - Click heading/paragraph/button/span -> contentEditable in place + popover to change text, font, color
 * - Click card / container block (div, card, article, li, section) -> change background color, padding, margin (all or 4 sides)
 * - Click <img> -> popover to change image URL or upload image
 * - Hover highlights elements in WordPress Gutenberg style
 */
export default function ClickToEditOverlay({
  containerRef,
  sectionCode,
  sectionInstanceId,
  onUpdateSectionCode,
  isActive = true,
}) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);
  const [editHref, setEditHref] = useState('');
  const [editImgSrc, setEditImgSrc] = useState('');
  const [editText, setEditText] = useState('');
  const [editColor, setEditColor] = useState('#FE0000');
  const [editBgColor, setEditBgColor] = useState('transparent');
  const [editPadding, setEditPadding] = useState('0px');
  const [editPaddingTop, setEditPaddingTop] = useState('0px');
  const [editPaddingBottom, setEditPaddingBottom] = useState('0px');
  const [editPaddingLeft, setEditPaddingLeft] = useState('0px');
  const [editPaddingRight, setEditPaddingRight] = useState('0px');
  const [editMargin, setEditMargin] = useState('0px');
  const [editMarginTop, setEditMarginTop] = useState('0px');
  const [editMarginBottom, setEditMarginBottom] = useState('0px');
  const [editMarginLeft, setEditMarginLeft] = useState('0px');
  const [editMarginRight, setEditMarginRight] = useState('0px');
  const [isDetailedSpacing, setIsDetailedSpacing] = useState(false);
  const [editFontSize, setEditFontSize] = useState('16px');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [hoverRect, setHoverRect] = useState(null);
  const [hoverTag, setHoverTag] = useState('');
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleDocClick = (e) => {
      if (popoverRef.current && popoverRef.current.contains(e.target)) return;
      if (containerRef.current && containerRef.current.contains(e.target)) return;
      setSelectedElement(null);
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [containerRef]);

  // Attach mouseover & click listener to containerRef
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || target === container || container.contains(target) === false) return;
      if (popoverRef.current && popoverRef.current.contains(target)) return;

      const tag = target.tagName.toLowerCase();
      // Allow text elements, images, buttons, and container blocks (div, card, li, article, section)
      const isCandidate = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'a', 'button', 'img', 'li', 'strong', 'em', 'b',
        'div', 'article', 'section',
      ].includes(tag) || target.classList.contains('font-heading');

      if (isCandidate) {
        const rect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setHoverRect({
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          width: rect.width,
          height: rect.height,
        });
        const isContainer = ['div', 'article', 'section', 'li'].includes(tag);
        setHoverTag(isContainer ? `${tag} (Khối)` : tag);
      }
    };

    const handleMouseLeave = () => {
      setHoverRect(null);
      setHoverTag('');
    };

    const handleClick = (e) => {
      const target = e.target;
      if (!target || target === container) return;
      if (popoverRef.current && popoverRef.current.contains(target)) return;

      const tag = target.tagName.toLowerCase();
      const isImg = tag === 'img';
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag);
      const isText = ['p', 'span', 'a', 'button', 'li', 'strong', 'em', 'b'].includes(tag) || isHeading;
      const isContainer = ['div', 'article', 'section'].includes(tag);

      if (!isImg && !isText && !isContainer) return;

      e.preventDefault();
      e.stopPropagation();

      const containerRect = container.getBoundingClientRect();
      const rect = target.getBoundingClientRect();

      const anchorParent = target.closest('a');
      const hrefVal = anchorParent ? anchorParent.getAttribute('href') || '' : target.getAttribute('href') || '';
      const computed = window.getComputedStyle(target);

      // Extract direct text node content if available
      let directText = '';
      for (const node of target.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          directText = node.textContent.trim();
          break;
        }
      }
      if (!directText) {
        directText = (target.innerText || target.textContent || '').trim();
      }

      // Check classes of the element for unique matching in code
      const classNameStr = (target.getAttribute('class') || '').trim();

      const elemInfo = {
        target,
        anchorParent,
        tagName: tag,
        isImage: isImg,
        isText,
        isHeading,
        isContainer,
        isLink: Boolean(anchorParent) || tag === 'a',
        src: isImg ? target.getAttribute('src') || '' : '',
        alt: isImg ? target.getAttribute('alt') || '' : '',
        text: directText,
        className: classNameStr,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        paddingRight: computed.paddingRight,
        margin: computed.margin,
        marginTop: computed.marginTop,
        marginBottom: computed.marginBottom,
        marginLeft: computed.marginLeft,
        marginRight: computed.marginRight,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        rect,
      };

      setSelectedElement(elemInfo);
      setEditHref(hrefVal);
      setEditImgSrc(isImg ? target.getAttribute('src') || '' : '');
      setEditText(directText);
      setEditColor(computed.color || '#0F172A');
      setEditBgColor(computed.backgroundColor || 'transparent');
      setEditPadding(computed.padding || '0px');
      setEditPaddingTop(computed.paddingTop || '0px');
      setEditPaddingBottom(computed.paddingBottom || '0px');
      setEditPaddingLeft(computed.paddingLeft || '0px');
      setEditPaddingRight(computed.paddingRight || '0px');
      setEditMargin(computed.margin || '0px');
      setEditMarginTop(computed.marginTop || '0px');
      setEditMarginBottom(computed.marginBottom || '0px');
      setEditMarginLeft(computed.marginLeft || '0px');
      setEditMarginRight(computed.marginRight || '0px');
      setEditFontSize(computed.fontSize || '16px');
      setTextAlign(computed.textAlign || 'left');
      setIsBold(Number(computed.fontWeight) >= 600 || computed.fontWeight === 'bold');
      setIsItalic(computed.fontStyle === 'italic');

      // Position popover
      const popTop = Math.max(8, rect.top - containerRect.top - 120);
      const popLeft = Math.min(
        Math.max(8, rect.left - containerRect.left),
        containerRect.width - 380
      );
      setPopoverPos({ top: popTop, left: popLeft });

      // If text, enable direct inline typing
      if (isText && !isImg && !isContainer) {
        target.contentEditable = 'true';
        target.focus();

        const handleBlur = () => {
          target.contentEditable = 'false';
          const newText = target.innerText.trim();
          if (newText && newText !== elemInfo.text) {
            handleSaveDirectText(elemInfo.text, newText);
          }
          target.removeEventListener('blur', handleBlur);
        };
        target.addEventListener('blur', handleBlur);
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
    };
  }, [containerRef, isActive, sectionCode]);

  // Save modified text into section JSX code
  const handleSaveDirectText = (oldText, newText) => {
    if (!sectionCode || !onUpdateSectionCode || !oldText || !newText || oldText === newText) return;
    const cleanOld = oldText.trim();
    const cleanNew = newText.trim();
    if (!cleanOld || !cleanNew) return;
    if (sectionCode.includes(cleanOld)) {
      const updated = sectionCode.replace(cleanOld, cleanNew);
      onUpdateSectionCode(sectionInstanceId, updated);
      if (selectedElement) {
        selectedElement.text = cleanNew;
      }
    }
  };

  // Safe style merger to prevent corrupting JSX syntax
  const mergeStyleProps = (currentStyleInner, newProps) => {
    const styleMap = {};
    if (currentStyleInner && currentStyleInner.trim()) {
      const pairRegex = /([a-zA-Z0-9_-]+)\s*:\s*(['"`][^'"`]*['"`]|[^,}]+)/g;
      let m;
      while ((m = pairRegex.exec(currentStyleInner)) !== null) {
        const key = m[1].trim();
        const rawVal = m[2].trim();
        styleMap[key] = rawVal;
      }
    }

    Object.entries(newProps).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') {
        delete styleMap[k];
      } else {
        styleMap[k] = `'${v}'`;
      }
    });

    const entries = Object.entries(styleMap).map(([k, v]) => `${k}: ${v}`);
    return entries.join(', ');
  };

  // Helper to inject or update a style property in the matched JSX tag
  const injectStyleInCode = (stylePropName, stylePropValue) => {
    if (!selectedElement || !sectionCode || !onUpdateSectionCode) return;

    let match = null;
    let opening = '';
    let closingChevron = '>';
    let textPart = '';

    // Strategy 1: Match by direct inner text
    const rawText = (selectedElement.text || '').trim();
    if (rawText) {
      const needle = rawText.length > 25 ? rawText.substring(0, 25) : rawText;
      const escapedNeedle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tagPattern = new RegExp(`(<(?:h[1-6]|p|span|button|a|div|article|section|li)\\b[^>]*)(>)([\\s\\S]*?${escapedNeedle})`, 'i');
      match = sectionCode.match(tagPattern);
      if (match) {
        opening = match[1];
        closingChevron = match[2];
        textPart = match[3];
      }
    }

    // Strategy 2: For container blocks with classes
    if (!match && selectedElement.className) {
      const classTokens = selectedElement.className.split(/\s+/).filter((c) => c.length > 3).slice(0, 3);
      if (classTokens.length > 0) {
        const classNeedle = classTokens.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*?');
        const classPattern = new RegExp(`(<(?:div|article|section|li)\\b[^>]*?className=["'][^"']*?${classNeedle}[^"']*?["'][^>]*)(>)`, 'i');
        match = sectionCode.match(classPattern);
        if (match) {
          opening = match[1];
          closingChevron = match[2];
          textPart = '';
        }
      }
    }

    if (!match) return;

    // Check if style={{ ... }} already exists in this opening tag
    const styleAttrMatch = opening.match(/style=\{\{([\s\S]*?)\}\}/i);
    if (styleAttrMatch) {
      const currentInner = styleAttrMatch[1];
      const newInner = mergeStyleProps(currentInner, { [stylePropName]: stylePropValue });
      opening = opening.replace(styleAttrMatch[0], `style={{ ${newInner} }}`);
    } else {
      opening = `${opening} style={{ ${stylePropName}: '${stylePropValue}' }}`;
    }

    const updated = sectionCode.replace(match[0], `${opening}${closingChevron}${textPart}`);
    onUpdateSectionCode(sectionInstanceId, updated);
  };

  // Change Color directly
  const handleApplyColor = (colorHex) => {
    setEditColor(colorHex);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.color = colorHex;
    injectStyleInCode('color', colorHex);
  };

  // Change Background Color directly
  const handleApplyBgColor = (bgHex) => {
    setEditBgColor(bgHex);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.backgroundColor = bgHex;
    injectStyleInCode('backgroundColor', bgHex);
  };

  // Change Padding directly (all sides)
  const handleApplyPadding = (paddingVal) => {
    setEditPadding(paddingVal);
    setEditPaddingTop(paddingVal);
    setEditPaddingBottom(paddingVal);
    setEditPaddingLeft(paddingVal);
    setEditPaddingRight(paddingVal);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.padding = paddingVal;
    injectStyleInCode('padding', paddingVal);
  };

  // Change Padding specific side (Top, Bottom, Left, Right)
  const handleApplyPaddingSide = (side, val) => {
    if (side === 'Top') setEditPaddingTop(val);
    if (side === 'Bottom') setEditPaddingBottom(val);
    if (side === 'Left') setEditPaddingLeft(val);
    if (side === 'Right') setEditPaddingRight(val);

    const propName = `padding${side}`;
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style[propName] = val;
    injectStyleInCode(propName, val);
  };

  // Change Margin directly (all sides)
  const handleApplyMargin = (marginVal) => {
    setEditMargin(marginVal);
    setEditMarginTop(marginVal);
    setEditMarginBottom(marginVal);
    setEditMarginLeft(marginVal);
    setEditMarginRight(marginVal);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.margin = marginVal;
    injectStyleInCode('margin', marginVal);
  };

  // Change Margin specific side (Top, Bottom, Left, Right)
  const handleApplyMarginSide = (side, val) => {
    if (side === 'Top') setEditMarginTop(val);
    if (side === 'Bottom') setEditMarginBottom(val);
    if (side === 'Left') setEditMarginLeft(val);
    if (side === 'Right') setEditMarginRight(val);

    const propName = `margin${side}`;
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style[propName] = val;
    injectStyleInCode(propName, val);
  };

  // Change Font Size directly
  const handleApplyFontSize = (sizeStr) => {
    setEditFontSize(sizeStr);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.fontSize = sizeStr;
    injectStyleInCode('fontSize', sizeStr);
  };

  // Toggle Bold
  const handleToggleBold = () => {
    const nextBold = !isBold;
    setIsBold(nextBold);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.fontWeight = nextBold ? 'bold' : 'normal';
    injectStyleInCode('fontWeight', nextBold ? 'bold' : 'normal');
  };

  // Change Text Alignment (left | center | right)
  const handleApplyTextAlign = (alignMode) => {
    setTextAlign(alignMode);
    if (!selectedElement || !selectedElement.target) return;
    selectedElement.target.style.textAlign = alignMode;
    injectStyleInCode('textAlign', alignMode);
  };

  // Save modified Image URL / Upload
  const handleSaveImage = (newSrc) => {
    if (!selectedElement || !selectedElement.src || !newSrc || !onUpdateSectionCode) return;
    const oldSrc = selectedElement.src;
    const updated = replaceImageInCode(sectionCode, oldSrc, newSrc.trim());
    if (updated !== sectionCode) {
      onUpdateSectionCode(sectionInstanceId, updated);
    }
    if (selectedElement.target) {
      selectedElement.target.src = newSrc.trim();
    }
    setSelectedElement(null);
  };

  // Convert element to <a> or change its href
  const handleApplyHref = () => {
    if (!selectedElement || !sectionCode || !onUpdateSectionCode) return;
    const hrefVal = editHref.trim();
    const oldText = selectedElement.text.trim();
    if (!hrefVal) return;

    if (selectedElement.anchorParent || selectedElement.tagName === 'a') {
      const currentAnchor = selectedElement.anchorParent || selectedElement.target;
      const oldHref = currentAnchor.getAttribute('href') || '';
      if (oldHref) {
        const regex = new RegExp(`href=["']${oldHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        const updated = sectionCode.replace(regex, `href="${hrefVal}"`);
        onUpdateSectionCode(sectionInstanceId, updated);
      }
    } else {
      if (oldText && hrefVal) {
        const escapedText = oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const tagPattern = new RegExp(`(<(h[1-6]|p|span|button|div)\\b[^>]*>)([\\s\\S]*?${escapedText}[\\s\\S]*?)(<\\/\\2>)`, 'i');
        const match = sectionCode.match(tagPattern);
        if (match) {
          const fullMatch = match[0];
          const replacement = `<a href="${hrefVal}" className="inline-block hover:opacity-90 transition cursor-pointer">${fullMatch}</a>`;
          const updated = sectionCode.replace(fullMatch, replacement);
          onUpdateSectionCode(sectionInstanceId, updated);
        }
      }
    }
    setSelectedElement(null);
  };

  return (
    <>
      {/* WordPress-style element hover bounding outline */}
      {hoverRect && !selectedElement && (
        <div
          className="absolute pointer-events-none z-30 transition-all duration-75 border-2 border-blue-500 rounded bg-blue-500/10 shadow-sm"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        >
          <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[9px] uppercase shadow">
            {hoverTag} • Click sửa chữ & màu
          </span>
        </div>
      )}

      {/* WordPress-style Floating Quick Toolbar / Popover */}
      {selectedElement && popoverPos && (
        <div
          ref={popoverRef}
          className="absolute z-50 bg-slate-900 border border-slate-700/90 rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5 min-w-[360px] max-w-[420px] animate-scaleUp text-xs text-white max-h-[85vh] overflow-y-auto"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
          }}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="font-bold text-[11px] text-amber-300 flex items-center gap-1.5 uppercase font-mono">
              {selectedElement.isImage ? (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Sửa Ảnh Trực Tiếp (&lt;img&gt;)</span>
                </>
              ) : selectedElement.isContainer ? (
                <>
                  <Box className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chỉnh Khối / Thẻ Card (&lt;{selectedElement.tagName.toUpperCase()}&gt;)</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chỉnh Phần Tử (&lt;{selectedElement.tagName.toUpperCase()}&gt;)</span>
                </>
              )}
            </span>
            <button
              onClick={() => setSelectedElement(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body for Image Editing */}
          {selectedElement.isImage ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editImgSrc}
                  onChange={(e) => setEditImgSrc(e.target.value)}
                  placeholder="Dán link ảnh https://..."
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                />
                <button
                  onClick={() => handleSaveImage(editImgSrc)}
                  className="px-2.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Check className="w-3 h-3" />
                  <span>Lưu</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="cursor-pointer px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition">
                  <Upload className="w-3 h-3 text-pink-400" />
                  <span>Tải ảnh từ máy tính</span>
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
                        if (base64) {
                          setEditImgSrc(base64);
                          handleSaveImage(base64);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <span className="text-[10px] text-slate-400 italic">Đổi ảnh tức thì</span>
              </div>
            </div>
          ) : (
            /* Body for Content, Font, Colors, Background & Spacing */
            <div className="space-y-2.5">

              {/* 1. Quick Color Palette: Text Color & Background Color */}
              <div className="space-y-2">
                {/* Text Color (only if text element) */}
                {selectedElement.isText && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Palette className="w-3 h-3 text-amber-400" />
                        <span>Màu Chữ:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={editColor.startsWith('#') ? editColor : '#FE0000'}
                          onChange={(e) => handleApplyColor(e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border border-slate-700 bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{editColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleApplyColor(c.hex)}
                          className="w-4 h-4 rounded-full border border-slate-700 hover:scale-125 transition shrink-0 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Color (for container / card or text block) */}
                <div className={`space-y-1 ${selectedElement.isText ? 'pt-1.5 border-t border-slate-800/80' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <Box className="w-3 h-3 text-emerald-400" />
                      <span>Màu Nền Khối (Background):</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={editBgColor.startsWith('#') ? editBgColor : '#FFFFFF'}
                        onChange={(e) => handleApplyBgColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border border-slate-700 bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-slate-400 truncate max-w-[70px]">{editBgColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {BG_COLOR_PRESETS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleApplyBgColor(c.hex)}
                        className={`w-4 h-4 rounded-full border hover:scale-125 transition shrink-0 shadow-sm ${c.hex === 'transparent' ? 'border-dashed border-slate-400 bg-slate-800' : 'border-slate-700'
                          }`}
                        style={{ backgroundColor: c.hex === 'transparent' ? undefined : c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Spacing: Padding & Margin (Quick all or Detailed 4 sides) */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-cyan-400" />
                    <span>Khoảng Cách Khối (Padding & Margin):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDetailedSpacing(!isDetailedSpacing)}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
                  >
                    {isDetailedSpacing ? 'Thu gọn' : 'Chi tiết 4 phía'}
                  </button>
                </div>

                {!isDetailedSpacing ? (
                  /* Quick all-around Spacing */
                  <div className="grid grid-cols-2 gap-2">
                    {/* Padding all */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                        <span>Padding (Trong):</span>
                      </span>
                      <select
                        value={editPadding}
                        onChange={(e) => handleApplyPadding(e.target.value)}
                        className="w-full px-1.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-mono text-cyan-200"
                      >
                        {SPACING_PRESETS.map((s) => (
                          <option key={`p-${s.val}`} value={s.val}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Margin all */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                        <span>Margin (Ngoài):</span>
                      </span>
                      <select
                        value={editMargin}
                        onChange={(e) => handleApplyMargin(e.target.value)}
                        className="w-full px-1.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-mono text-indigo-200"
                      >
                        {SPACING_PRESETS.map((s) => (
                          <option key={`m-${s.val}`} value={s.val}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Detailed Top / Bottom / Left / Right Spacing */
                  <div className="space-y-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                    {/* Padding 4 sides */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400">Padding (Cách lề bên trong):</span>
                      <div className="grid grid-cols-4 gap-1">
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Top</span>
                          <select
                            value={editPaddingTop}
                            onChange={(e) => handleApplyPaddingSide('Top', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`pt-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Bottom</span>
                          <select
                            value={editPaddingBottom}
                            onChange={(e) => handleApplyPaddingSide('Bottom', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`pb-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Left</span>
                          <select
                            value={editPaddingLeft}
                            onChange={(e) => handleApplyPaddingSide('Left', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`pl-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Right</span>
                          <select
                            value={editPaddingRight}
                            onChange={(e) => handleApplyPaddingSide('Right', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`pr-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Margin 4 sides */}
                    <div className="space-y-1 pt-1.5 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-indigo-400">Margin (Cách lề bên ngoài):</span>
                      <div className="grid grid-cols-4 gap-1">
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Top</span>
                          <select
                            value={editMarginTop}
                            onChange={(e) => handleApplyMarginSide('Top', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`mt-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Bottom</span>
                          <select
                            value={editMarginBottom}
                            onChange={(e) => handleApplyMarginSide('Bottom', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`mb-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Left</span>
                          <select
                            value={editMarginLeft}
                            onChange={(e) => handleApplyMarginSide('Left', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`ml-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block text-center">Right</span>
                          <select
                            value={editMarginRight}
                            onChange={(e) => handleApplyMarginSide('Right', e.target.value)}
                            className="w-full px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-indigo-300"
                          >
                            {SPACING_PRESETS.map((s) => (
                              <option key={`mr-${s.val}`} value={s.val}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Font Size, Bold & Text Align Controls (only for text elements) */}
              {selectedElement.isText && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-bold text-slate-300">Cỡ chữ:</span>
                    <select
                      value={editFontSize}
                      onChange={(e) => handleApplyFontSize(e.target.value)}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[11px] font-bold text-cyan-300"
                    >
                      {SIZE_PRESETS.map((s) => (
                        <option key={s.val} value={s.val}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Bold button */}
                    <button
                      type="button"
                      onClick={handleToggleBold}
                      className={`p-1 rounded border text-[10px] font-bold transition ${isBold ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      title="Chữ đậm (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>

                    {/* Text Align: Left */}
                    <button
                      type="button"
                      onClick={() => handleApplyTextAlign('left')}
                      className={`p-1 rounded border text-[10px] font-bold transition ${textAlign === 'left' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      title="Căn lề trái (text-left)"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Text Align: Center */}
                    <button
                      type="button"
                      onClick={() => handleApplyTextAlign('center')}
                      className={`p-1 rounded border text-[10px] font-bold transition ${textAlign === 'center' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      title="Căn lề giữa (text-center)"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>

                    {/* Text Align: Right */}
                    <button
                      type="button"
                      onClick={() => handleApplyTextAlign('right')}
                      className={`p-1 rounded border text-[10px] font-bold transition ${textAlign === 'right' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      title="Căn lề phải (text-right)"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Direct Content Input (only for text elements) */}
              {selectedElement.isText && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <label className="block text-[10px] font-bold text-slate-300">
                    Nội dung (hoặc gõ trực tiếp trên màn hình):
                  </label>
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => {
                      const nextVal = e.target.value;
                      setEditText(nextVal);
                      if (selectedElement.target) {
                        selectedElement.target.innerText = nextVal;
                      }
                    }}
                    onBlur={() => {
                      if (editText.trim() && editText.trim() !== selectedElement.text) {
                        handleSaveDirectText(selectedElement.text, editText.trim());
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                    placeholder="Nhập nội dung văn bản..."
                  />
                </div>
              )}

              {/* 5. Link & Href */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <label className="block text-[10px] font-bold text-blue-300 flex items-center justify-between">
                  <span>Gắn Liên Kết (href):</span>
                  <span className="text-[9px] text-slate-400">Chuyển thẻ thành &lt;a&gt;</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center flex-1 rounded-xl bg-slate-950 border border-slate-700 px-2 py-1 focus-within:ring-1 focus-within:ring-blue-500">
                    <LinkIcon className="w-3 h-3 text-blue-400 mr-1.5 shrink-0" />
                    <input
                      type="text"
                      value={editHref}
                      onChange={(e) => setEditHref(e.target.value)}
                      placeholder="VD: #tu-van hoặc https://..."
                      className="w-full bg-transparent text-[11px] text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={handleApplyHref}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 shrink-0"
                  >
                    <Check className="w-3 h-3" />
                    <span>Gắn Link</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
}
