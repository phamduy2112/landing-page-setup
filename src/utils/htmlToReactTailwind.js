/**
 * htmlToReactTailwind.js
 * Engine chuyển đổi HTML/CSS thuần sang React JSX + Tailwind CSS (chạy 100% offline trên trình duyệt)
 */

import { normalizeColorsToPrimary } from './sectionColorTransform';

// Bảng từ điển chuyển đổi các thuộc tính CSS phổ biến sang class Tailwind CSS tương ứng
const CSS_TO_TAILWIND_MAP = {
  // Display
  'display: block': 'block',
  'display: inline-block': 'inline-block',
  'display: inline': 'inline',
  'display: flex': 'flex',
  'display: inline-flex': 'inline-flex',
  'display: grid': 'grid',
  'display: none': 'hidden',

  // Flexbox & Grid
  'flex-direction: row': 'flex-row',
  'flex-direction: column': 'flex-col',
  'flex-direction: row-reverse': 'flex-row-reverse',
  'flex-direction: column-reverse': 'flex-col-reverse',
  'flex-wrap: wrap': 'flex-wrap',
  'flex-wrap: nowrap': 'flex-nowrap',
  'align-items: center': 'items-center',
  'align-items: flex-start': 'items-start',
  'align-items: flex-end': 'items-end',
  'align-items: stretch': 'items-stretch',
  'justify-content: center': 'justify-center',
  'justify-content: space-between': 'justify-between',
  'justify-content: space-around': 'justify-around',
  'justify-content: space-evenly': 'justify-evenly',
  'justify-content: flex-start': 'justify-start',
  'justify-content: flex-end': 'justify-end',

  // Text align & Decoration
  'text-align: center': 'text-center',
  'text-align: left': 'text-left',
  'text-align: right': 'text-right',
  'text-align: justify': 'text-justify',
  'text-decoration: underline': 'underline',
  'text-decoration: none': 'no-underline',
  'text-transform: uppercase': 'uppercase',
  'text-transform: lowercase': 'lowercase',
  'text-transform: capitalize': 'capitalize',

  // Font weight
  'font-weight: 400': 'font-normal',
  'font-weight: normal': 'font-normal',
  'font-weight: 500': 'font-medium',
  'font-weight: 600': 'font-semibold',
  'font-weight: 700': 'font-bold',
  'font-weight: bold': 'font-bold',
  'font-weight: 800': 'font-extrabold',
  'font-weight: 900': 'font-black',

  // Position & Overflow
  'position: relative': 'relative',
  'position: absolute': 'absolute',
  'position: fixed': 'fixed',
  'position: sticky': 'sticky',
  'overflow: hidden': 'overflow-hidden',
  'overflow: auto': 'overflow-auto',
  'overflow-x: auto': 'overflow-x-auto',
  'overflow-x: hidden': 'overflow-x-hidden',
  'overflow-y: auto': 'overflow-y-auto',

  // Width & Height common
  'width: 100%': 'w-full',
  'height: 100%': 'h-full',
  'width: auto': 'w-auto',
  'height: auto': 'h-auto',
  'min-width: 0': 'min-w-0',
  'max-width: 100%': 'max-w-full',
  'cursor: pointer': 'cursor-pointer',

  // Box-sizing
  'box-sizing: border-box': 'box-border',

  // Common Border Radius
  'border-radius: 9999px': 'rounded-full',
  'border-radius: 50%': 'rounded-full',
  'border-radius: 0': 'rounded-none',
  'border-radius: 4px': 'rounded',
  'border-radius: 6px': 'rounded-md',
  'border-radius: 8px': 'rounded-lg',
  'border-radius: 12px': 'rounded-xl',
  'border-radius: 16px': 'rounded-2xl',
  'border-radius: 24px': 'rounded-3xl',

  // Common margins
  'margin: 0 auto': 'mx-auto',
  'margin-left: auto': 'ml-auto',
  'margin-right: auto': 'mr-auto',

  // Common colors
  'background-color: transparent': 'bg-transparent',
  'background-color: white': 'bg-white',
  'background-color: #ffffff': 'bg-white',
  'background-color: #fff': 'bg-white',
  'background-color: black': 'bg-black',
  'background-color: #000000': 'bg-black',
  'color: white': 'text-white',
  'color: #ffffff': 'text-white',
  'color: #fff': 'text-white',
  'color: black': 'text-black',
  'color: #000': 'text-black',
};

// Chuyển một cặp property: value dạng động sang Tailwind class
function dynamicRuleToTailwind(prop, value) {
  const p = prop.trim().toLowerCase();
  const v = value.trim().toLowerCase().replace(/!important/, '').trim();

  // Spacing helper: convert px sang Tailwind scale hoặc arbitrary value
  const toSpacing = (val) => {
    if (val === '0' || val === '0px') return '0';
    if (val === '4px') return '1';
    if (val === '8px') return '2';
    if (val === '12px') return '3';
    if (val === '16px') return '4';
    if (val === '20px') return '5';
    if (val === '24px') return '6';
    if (val === '32px') return '8';
    if (val === '40px') return '10';
    if (val === '48px') return '12';
    if (val === '64px') return '16';
    if (val === '80px') return '20';
    return `[${val.replace(/\s+/g, '_')}]`;
  };

  switch (p) {
    case 'padding': {
      const parts = v.split(/\s+/);
      if (parts.length === 1) return `p-${toSpacing(parts[0])}`;
      if (parts.length === 2) return `py-${toSpacing(parts[0])} px-${toSpacing(parts[1])}`;
      if (parts.length === 4) return `pt-${toSpacing(parts[0])} pr-${toSpacing(parts[1])} pb-${toSpacing(parts[2])} pl-${toSpacing(parts[3])}`;
      return `p-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'padding-top': return `pt-${toSpacing(v)}`;
    case 'padding-bottom': return `pb-${toSpacing(v)}`;
    case 'padding-left': return `pl-${toSpacing(v)}`;
    case 'padding-right': return `pr-${toSpacing(v)}`;

    case 'margin': {
      if (v === '0 auto' || v === 'auto') return 'mx-auto';
      const parts = v.split(/\s+/);
      if (parts.length === 1) return `m-${toSpacing(parts[0])}`;
      if (parts.length === 2) return `my-${toSpacing(parts[0])} mx-${toSpacing(parts[1])}`;
      return `m-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'margin-top': return `mt-${toSpacing(v)}`;
    case 'margin-bottom': return `mb-${toSpacing(v)}`;
    case 'margin-left': return v === 'auto' ? 'ml-auto' : `ml-${toSpacing(v)}`;
    case 'margin-right': return v === 'auto' ? 'mr-auto' : `mr-${toSpacing(v)}`;

    case 'gap': return `gap-${toSpacing(v)}`;
    case 'row-gap': return `gap-y-${toSpacing(v)}`;
    case 'column-gap': return `gap-x-${toSpacing(v)}`;

    case 'width': {
      if (v === '100%') return 'w-full';
      if (v === 'auto') return 'w-auto';
      if (v === '100vw') return 'w-screen';
      return `w-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'max-width': {
      if (v === '1200px') return 'max-w-[1200px]';
      if (v === '100%') return 'max-w-full';
      if (v === '800px') return 'max-w-3xl';
      if (v === '1024px') return 'max-w-5xl';
      if (v === '1280px') return 'max-w-7xl';
      return `max-w-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'min-width': return `min-w-[${v.replace(/\s+/g, '_')}]`;

    case 'height': {
      if (v === '100%') return 'h-full';
      if (v === 'auto') return 'h-auto';
      if (v === '100vh') return 'h-screen';
      return `h-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'max-height': return `max-h-[${v.replace(/\s+/g, '_')}]`;
    case 'min-height': return `min-h-[${v.replace(/\s+/g, '_')}]`;

    case 'font-size': {
      if (v === '12px' || v === '0.75rem') return 'text-xs';
      if (v === '14px' || v === '0.875rem') return 'text-sm';
      if (v === '16px' || v === '1rem') return 'text-base';
      if (v === '18px' || v === '1.125rem') return 'text-lg';
      if (v === '20px' || v === '1.25rem') return 'text-xl';
      if (v === '24px' || v === '1.5rem') return 'text-2xl';
      if (v === '30px' || v === '1.875rem') return 'text-3xl';
      if (v === '36px' || v === '2.25rem') return 'text-4xl';
      return `text-[${v}]`;
    }

    case 'border-radius': {
      if (v === '9999px' || v === '50%') return 'rounded-full';
      return `rounded-[${v.replace(/\s+/g, '_')}]`;
    }

    case 'color': {
      if (
        v.startsWith('var(--color-primary') ||
        v === '#fe0000' ||
        v === '#ed1c24' ||
        v === '#dc2626' ||
        v === '#ef4444' ||
        v === 'red'
      ) {
        return 'text-primary';
      }
      if (
        v.startsWith('var(--color-secondary') ||
        v === '#2bc412' ||
        v === '#229e0e' ||
        v === '#16a34a' ||
        v === '#0d8626' ||
        v === 'green'
      ) {
        return 'text-secondary';
      }
      if (v.startsWith('var(--color-dark') || v === '#0f172a') return 'text-slate-900';
      if (v.startsWith('var(--color-text-muted') || v === '#64748b') return 'text-slate-500';
      return `text-[${v}]`;
    }

    case 'background-color':
    case 'background': {
      if (
        v.startsWith('var(--color-primary') ||
        v === '#fe0000' ||
        v === '#ed1c24' ||
        v === '#dc2626' ||
        v === '#ef4444'
      ) {
        return 'bg-primary';
      }
      if (
        v.startsWith('var(--color-secondary') ||
        v === '#2bc412' ||
        v === '#229e0e' ||
        v === '#16a34a' ||
        v === '#0d8626'
      ) {
        return 'bg-secondary';
      }
      if (v === '#ffffff' || v === 'white' || v === '#fff') return 'bg-white';
      if (v === '#f8fafc' || v.startsWith('var(--color-bg-surface')) return 'bg-slate-50';
      if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient')) {
        return null; // Giữ lại inline style vì gradient phức tạp
      }
      return `bg-[${v}]`;
    }

    case 'border': {
      if (v === 'none' || v === '0') return 'border-0';
      if (v.includes('solid')) return 'border';
      return `border-[${v.replace(/\s+/g, '_')}]`;
    }
    case 'border-color': return `border-[${v}]`;

    case 'opacity': return `opacity-[${v}]`;
    case 'z-index': return `z-[${v}]`;
    case 'object-fit': return `object-${v}`;

    default:
      return null;
  }
}

/**
 * Trích xuất CSS selectors và styles từ thẻ <style>
 */
export function extractCssRules(cssText) {
  const rules = {};
  if (!cssText) return rules;

  // Loại bỏ comments
  const cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Tách từng rule: selector { property: value; ... }
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;
  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    const rawSelectors = match[1].trim();
    const declarations = match[2].trim();

    // Tách các property
    const styleObj = {};
    declarations.split(';').forEach((decl) => {
      const colonIdx = decl.indexOf(':');
      if (colonIdx > -1) {
        const prop = decl.substring(0, colonIdx).trim().toLowerCase();
        const val = decl.substring(colonIdx + 1).trim();
        if (prop && val) {
          styleObj[prop] = val;
        }
      }
    });

    // Gom selector
    rawSelectors.split(',').forEach((sel) => {
      const s = sel.trim();
      if (s) {
        rules[s] = { ...(rules[s] || {}), ...styleObj };
      }
    });
  }

  return rules;
}

/**
 * Chuyển đổi inline style hoặc CSS declarations sang chuỗi class Tailwind
 */
export function styleDeclarationsToTailwind(styleObj) {
  const tailwindClasses = [];
  const remainingInlineStyles = {};

  for (const [prop, val] of Object.entries(styleObj)) {
    const directKey = `${prop.toLowerCase()}: ${val.toLowerCase().replace(/!important/, '').trim()}`;
    if (CSS_TO_TAILWIND_MAP[directKey]) {
      tailwindClasses.push(CSS_TO_TAILWIND_MAP[directKey]);
    } else {
      const dynamicCls = dynamicRuleToTailwind(prop, val);
      if (dynamicCls) {
        tailwindClasses.push(dynamicCls);
      } else {
        // Thuộc tính CSS phức tạp không chuyển được, giữ lại inline style
        remainingInlineStyles[prop] = val;
      }
    }
  }

  return {
    classes: tailwindClasses.join(' '),
    remainingStyles: remainingInlineStyles,
  };
}

/**
 * Chuyển inline style string 'color: red; margin: 10px' thành React style object
 */
export function parseInlineStyleToReact(styleString) {
  if (!styleString || typeof styleString !== 'string') return null;
  const styleObj = {};
  styleString.split(';').forEach((statement) => {
    const colonIdx = statement.indexOf(':');
    if (colonIdx > -1) {
      const rawProp = statement.substring(0, colonIdx).trim();
      const val = statement.substring(colonIdx + 1).trim();
      if (rawProp && val) {
        // CamelCase property name
        const camelProp = rawProp.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
        styleObj[camelProp] = val;
      }
    }
  });
  return Object.keys(styleObj).length > 0 ? styleObj : null;
}

/**
 * Hàm chính chuyển đổi toàn bộ mã HTML + CSS + JS sang React JSX + Tailwind Component
 */
export function convertHtmlCssJsToReactTailwind({
  html = '',
  css = '',
  js = '',
  componentName = 'ConvertedSection',
}) {
  let combinedCss = css || '';
  let cleanHtml = html || '';

  // 1. Tách thẻ <style> bên trong HTML nếu có
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleTagRegex.exec(cleanHtml)) !== null) {
    combinedCss += '\n' + styleMatch[1];
  }
  cleanHtml = cleanHtml.replace(styleTagRegex, '');

  // 2. Tách thẻ <script> bên trong HTML nếu có
  let inlineJs = js || '';
  const scriptTagRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptTagRegex.exec(cleanHtml)) !== null) {
    // Bỏ qua thẻ script tailwind cdn hoặc external
    if (!scriptMatch[0].includes('src=')) {
      inlineJs += '\n' + scriptMatch[1];
    }
  }
  cleanHtml = cleanHtml.replace(scriptTagRegex, '');

  // 3. Phân tích bảng luật CSS
  const cssRules = extractCssRules(combinedCss);

  // 4. Sử dụng DOMParser để duyệt cây DOM
  const parser = new DOMParser();
  // Bọc vào div để parse trọn vẹn fragment
  const doc = parser.parseFromString(`<div>${cleanHtml}</div>`, 'text/html');
  const rootDiv = doc.body.firstElementChild;

  if (!rootDiv) {
    return {
      success: false,
      error: 'Không thể phân tích cấu trúc HTML được cung cấp.',
    };
  }

  // Danh sách thẻ tự đóng trong JSX
  const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  // Bộ chuyển đổi tên thuộc tính HTML sang React JSX
  const ATTR_NAME_MAP = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    minlength: 'minLength',
    autocomplete: 'autoComplete',
    autofocus: 'autoFocus',
    srcset: 'srcSet',
    crossorigin: 'crossOrigin',
    viewbox: 'viewBox',
    fillrule: 'fillRule',
    cliprule: 'clipRule',
    strokewidth: 'strokeWidth',
    strokelinecap: 'strokeLinecap',
    strokelinejoin: 'strokeLinejoin',
  };

  /**
   * Đệ quy duyệt Node để xuất ra JSX String
   */
  function domNodeToJsx(node, depth = 2) {
    const indent = '  '.repeat(depth);

    // Xử lý Text Node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) {
        return '';
      }
      // Escape ký tự JSX nếu cần
      return text;
    }

    // Xử lý Comment Node
    if (node.nodeType === Node.COMMENT_NODE) {
      const comment = node.textContent.trim();
      return `${indent}{/* ${comment} */}\n`;
    }

    // Chỉ xử lý Element Node
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tagName = node.tagName.toLowerCase();

    // 1. Thu thập classes
    let existingClasses = (node.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
    const inlineStyleAttr = node.getAttribute('style') || '';

    // 2. Tra cứu CSS rules từ class / tag
    let mappedTailwindClasses = [];
    let preservedInlineStyles = {};

    // Áp dụng CSS rules từ selector class .className
    existingClasses.forEach((cls) => {
      const classSelector = `.${cls}`;
      if (cssRules[classSelector]) {
        const { classes, remainingStyles } = styleDeclarationsToTailwind(cssRules[classSelector]);
        if (classes) mappedTailwindClasses.push(classes);
        Object.assign(preservedInlineStyles, remainingStyles);
      }
    });

    // Áp dụng CSS rules từ selector tag
    if (cssRules[tagName]) {
      const { classes, remainingStyles } = styleDeclarationsToTailwind(cssRules[tagName]);
      if (classes) mappedTailwindClasses.push(classes);
      Object.assign(preservedInlineStyles, remainingStyles);
    }

    // Áp dụng inline style của chính node
    if (inlineStyleAttr) {
      const inlineObj = {};
      inlineStyleAttr.split(';').forEach((item) => {
        const idx = item.indexOf(':');
        if (idx > -1) {
          const k = item.substring(0, idx).trim();
          const v = item.substring(idx + 1).trim();
          if (k && v) inlineObj[k] = v;
        }
      });
      const { classes, remainingStyles } = styleDeclarationsToTailwind(inlineObj);
      if (classes) mappedTailwindClasses.push(classes);
      Object.assign(preservedInlineStyles, remainingStyles);
    }

    // Hợp nhất class ban đầu + class Tailwind chuyển đổi được
    const allFinalClasses = Array.from(new Set([...existingClasses, ...mappedTailwindClasses.join(' ').split(/\s+/)]))
      .filter(Boolean)
      .join(' ');

    // 3. Thu thập thuộc tính JSX
    const attrs = [];

    if (allFinalClasses) {
      attrs.push(`className="${allFinalClasses}"`);
    }

    // Giữ lại các inline style phức tạp (nếu có)
    const remainingStyleKeys = Object.keys(preservedInlineStyles);
    if (remainingStyleKeys.length > 0) {
      const styleEntries = remainingStyleKeys
        .map((k) => {
          const camelKey = k.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
          return `${camelKey}: '${preservedInlineStyles[k]}'`;
        })
        .join(', ');
      attrs.push(`style={{ ${styleEntries} }}`);
    }

    // Duyệt qua các thuộc tính gốc
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      const name = attr.name.toLowerCase();

      // Đã xử lý class và style ở trên
      if (name === 'class' || name === 'style') continue;

      // Xử lý sự kiện inline (onclick, onsubmit, ...)
      if (name.startsWith('on')) {
        const eventName = 'on' + name.slice(2, 3).toUpperCase() + name.slice(3);
        attrs.push(`${eventName}={(e) => { /* ${attr.value} */ }}`);
        continue;
      }

      const jsxName = ATTR_NAME_MAP[name] || attr.name;
      const val = attr.value;

      if (val === '') {
        attrs.push(`${jsxName}`);
      } else {
        attrs.push(`${jsxName}="${val.replace(/"/g, '&quot;')}"`);
      }
    }

    const attrsString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

    // Nếu là Void element (tự đóng)
    if (VOID_ELEMENTS.has(tagName)) {
      return `${indent}<${tagName}${attrsString} />\n`;
    }

    // Duyệt con
    const childrenJsx = [];
    node.childNodes.forEach((child) => {
      const childRes = domNodeToJsx(child, depth + 1);
      if (childRes) childrenJsx.push(childRes);
    });

    if (childrenJsx.length === 0) {
      return `${indent}<${tagName}${attrsString}></${tagName}>\n`;
    }

    // Nếu chỉ có 1 text node ngắn thì gom lại cùng 1 dòng
    if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE && node.firstChild.textContent.trim().length < 50) {
      return `${indent}<${tagName}${attrsString}>${node.firstChild.textContent.trim()}</${tagName}>\n`;
    }

    return `${indent}<${tagName}${attrsString}>\n${childrenJsx.join('')}${indent}</${tagName}>\n`;
  }

  // Duyệt cây bắt đầu từ các node con của rootDiv
  const jsxResultBlocks = [];
  rootDiv.childNodes.forEach((child) => {
    const res = domNodeToJsx(child, 2);
    if (res && res.trim()) {
      jsxResultBlocks.push(res);
    }
  });

  const fullInnerJsx = jsxResultBlocks.join('').trim() || '<div>{/* Nội dung trống */}</div>';

  // Định dạng component React hoàn chỉnh
  const cleanCompName = componentName.replace(/[^a-zA-Z0-9_]/g, '') || 'ConvertedSection';

  const outputCode = `import React, { useState } from 'react';

export default function ${cleanCompName}() {
  // Bạn có thể thêm state cho interactive components tại đây nếu cần
  const [activeTab, setActiveTab] = useState(0);

  return (
    ${fullInnerJsx}
  );
}`;

  const normalizedOutputCode = normalizeColorsToPrimary(outputCode);

  return {
    success: true,
    code: normalizedOutputCode,
    detectedClassesCount: Object.keys(cssRules).length,
    inlineJsDetected: Boolean(inlineJs && inlineJs.trim()),
    inlineJsText: inlineJs.trim(),
  };
}
