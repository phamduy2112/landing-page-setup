import React, { useMemo, useState, Component } from 'react';
import * as LucideIcons from 'lucide-react';

// Comprehensive React Icons Suites
import * as ReactIconsFa from 'react-icons/fa';
import * as ReactIconsFa6 from 'react-icons/fa6';
import * as ReactIconsMd from 'react-icons/md';
import * as ReactIconsIo5 from 'react-icons/io5';
import * as ReactIconsIo from 'react-icons/io';
import * as ReactIconsBi from 'react-icons/bi';
import * as ReactIconsBs from 'react-icons/bs';
import * as ReactIconsFi from 'react-icons/fi';
import * as ReactIconsHi2 from 'react-icons/hi2';
import * as ReactIconsHi from 'react-icons/hi';
import * as ReactIconsAi from 'react-icons/ai';
import * as ReactIconsRi from 'react-icons/ri';
import * as ReactIconsTb from 'react-icons/tb';
import * as ReactIconsGr from 'react-icons/gr';
import * as ReactIconsSi from 'react-icons/si';
import * as ReactIconsPi from 'react-icons/pi';
import * as ReactIconsTi from 'react-icons/ti';
import * as ReactIconsGi from 'react-icons/gi';
import * as ReactIconsGo from 'react-icons/go';
import * as ReactIconsLu from 'react-icons/lu';

import { AlertCircle, Code, Sparkles, RefreshCw } from 'lucide-react';
import { transform } from 'sucrase';
import { autoConvertDivsWithHrefInJsx } from '../../utils/sectionElementTransform';

/**
 * Universal Fallback Icon for missing or unresolvable icon exports
 */
const FallbackIcon = ({ className = 'w-5 h-5', size = 20, ...props }) => {
  const s = size ? (typeof size === 'number' ? `${size}px` : size) : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
      style={s ? { width: s, height: s } : undefined}
      width={size}
      height={size}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
};
FallbackIcon.__esModule = true;
FallbackIcon.default = FallbackIcon;

/**
 * Fallback Component for unresolvable relative imports (like generic links or buttons)
 */
const FallbackProxyComponent = ({ children, className = '', href = '#', text, ...props }) => {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center font-bold transition ${className}`}
      {...props}
    >
      {children || text || null}
    </a>
  );
};
FallbackProxyComponent.__esModule = true;
FallbackProxyComponent.default = FallbackProxyComponent;

import ButtonCTA from '../common/ButtonCTA';
import TextWithImage from '../common/TextWithImage';

const ButtonCTAComponent = ButtonCTA;
const TextWithImageComponent = TextWithImage;

/**
 * SectionHeading Component matching tan-sanh-ngu-landing
 */
const SectionHeadingComponent = ({
  eyebrow,
  title,
  highlight,
  desc,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`mb-4 px-5 md:px-0 ${className}`} {...props}>
      {eyebrow && (
        <span className="mb-2 inline-block text-[11px] font-extrabold tracking-[0.14em] text-accent md:text-[12px]">
          {eyebrow}
        </span>
      )}
      {(title || highlight) && (
        <h2 className="text-[26px] font-bold leading-[1.25] tracking-[-0.6px] text-primary sm:text-[30px] capitalize md:text-[34px]">
          {title} {highlight && <span className="text-secondary">{highlight}</span>}
        </h2>
      )}
      {desc && (
        <p className="mx-auto mt-3 max-w-[720px] text-[14px] leading-[1.65] text-text-muted">
          {desc}
        </p>
      )}
      {children}
    </div>
  );
};
SectionHeadingComponent.__esModule = true;
SectionHeadingComponent.default = SectionHeadingComponent;

/**
 * Fallback Swiper & SwiperSlide for slider components
 */
const SwiperFallback = ({ children, className = '', ...props }) => (
  <div className={`overflow-x-auto flex gap-4 py-3 scrollbar-none ${className}`} {...props}>
    {children}
  </div>
);
SwiperFallback.__esModule = true;
SwiperFallback.default = SwiperFallback;

const SwiperSlideFallback = ({ children, className = '', ...props }) => (
  <div className={`shrink-0 w-full sm:w-[320px] md:w-[360px] ${className}`} {...props}>
    {children}
  </div>
);
SwiperSlideFallback.__esModule = true;
SwiperSlideFallback.default = SwiperSlideFallback;

/**
 * Generate a generic fallback component function
 */
function makeGenericFallbackComponent(name = 'Component') {
  const Comp = ({ children, className = '', text, ...props }) => (
    <div className={`my-2 p-2 rounded border border-dashed border-primary/20 ${className}`} {...props}>
      {children || text || null}
    </div>
  );
  Comp.__esModule = true;
  Comp.default = Comp;
  return Comp;
}

/**
 * Wrap a module in an ESModule-compatible proxy so that:
 * - obj.__esModule is true (Sucrase _interopRequireDefault will NOT re-wrap it)
 * - obj.default is the component function
 * - Named exports are accessible
 * - Any unknown named component access returns a safe component instead of undefined
 */
function createModuleExport(defaultComp, named = {}) {
  const target = typeof defaultComp === 'function' ? defaultComp : () => null;
  target.__esModule = true;
  target.default = target;
  Object.assign(target, named);

  return new Proxy(target, {
    get(t, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return target;
      if (prop in t) return t[prop];
      if (typeof prop === 'string' && /^[A-Z]/.test(prop)) {
        return makeGenericFallbackComponent(prop);
      }
      return undefined;
    },
  });
}

/**
 * Wrap an icon module so:
 * - Any existing icon from react-icons/lucide is returned directly
 * - Any missing icon renders FallbackIcon instead of crashing or returning undefined
 */
function createIconModuleExport(iconGroup = {}) {
  return new Proxy(iconGroup, {
    get(target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return target.default || target;
      if (typeof prop === 'string') {
        if (prop in target && target[prop]) {
          const comp = target[prop];
          if (typeof comp === 'function') {
            comp.__esModule = true;
            comp.default = comp;
          }
          return comp;
        }
        if (/^[A-Z]/.test(prop)) {
          return FallbackIcon;
        }
      }
      return target[prop];
    },
  });
}

/**
 * Compile and instantiate a real React Component from JSX/TSX/ES6/HTML code
 */
function compileReactComponent(rawCode) {
  if (!rawCode || typeof rawCode !== 'string' || !rawCode.trim()) {
    return null;
  }

  let code = rawCode.trim();

  // Strip directive lines like "use client";
  code = code.replace(/^(?:'use client'|"use client");?\s*/g, '');

  // Auto-convert any <div ... href="..." ...> to <a ... href="..." ...>
  code = autoConvertDivsWithHrefInJsx(code);

  // Auto-convert inline string styles like style="color: red; font-size: 14px" to style={{...}}
  code = convertInlineStylesInJsx(code);

  // 1. Detect if code has functions, classes, or export default
  const hasFunction = /function\s+\w+/.test(code);
  const hasArrowFunction = /(?:const|let|var)\s+\w+\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/.test(code);
  const hasExport = /export\s+default/.test(code);

  if (!hasFunction && !hasArrowFunction && !hasExport) {
    // Pure JSX snippet (e.g. `<header className="...">...</header>`)
    code = `import React, { useState, useEffect } from 'react';
export default function CustomSectionSnippet() {
  return (
    <>
      ${code}
    </>
  );
}`;
  } else if (!hasExport) {
    // Has a function/component, but no export default
    const fnMatch = code.match(/function\s+([A-Za-z0-9_]+)/);
    if (fnMatch) {
      code += `\nexport default ${fnMatch[1]};`;
    } else {
      const constMatch = code.match(/(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=/);
      if (constMatch) {
        code += `\nexport default ${constMatch[1]};`;
      }
    }
  }

  // 2. Transform JSX, TSX & imports via Sucrase
  const compiled = transform(code, {
    transforms: ['jsx', 'imports', 'typescript'],
    jsxRuntime: 'classic',
    production: true,
  });

  // 3. Mock require and exports environment
  const exports = { __esModule: true };
  const moduleObj = { exports };

  const customRequire = (moduleName) => {
    if (!moduleName || typeof moduleName !== 'string') {
      return createModuleExport(FallbackProxyComponent);
    }
    const cleanName = moduleName.toLowerCase().replace(/^[./\\]+/, '');

    // React
    if (moduleName === 'react' || cleanName === 'react') {
      const reactMod = {
        ...React,
        default: React,
        __esModule: true,
      };
      return new Proxy(reactMod, {
        get(t, prop) {
          if (prop === '__esModule') return true;
          if (prop === 'default') return React;
          return t[prop] || React[prop];
        },
      });
    }

    // Lucide Icons
    if (moduleName === 'lucide-react' || cleanName.includes('lucide')) {
      return createIconModuleExport(LucideIcons);
    }

    // React Icons Suites
    if (cleanName.includes('react-icons/fa6')) return createIconModuleExport(ReactIconsFa6);
    if (cleanName.includes('react-icons/fa')) return createIconModuleExport(ReactIconsFa);
    if (cleanName.includes('react-icons/md')) return createIconModuleExport(ReactIconsMd);
    if (cleanName.includes('react-icons/io5')) return createIconModuleExport(ReactIconsIo5);
    if (cleanName.includes('react-icons/io')) return createIconModuleExport(ReactIconsIo);
    if (cleanName.includes('react-icons/bi')) return createIconModuleExport(ReactIconsBi);
    if (cleanName.includes('react-icons/bs')) return createIconModuleExport(ReactIconsBs);
    if (cleanName.includes('react-icons/fi')) return createIconModuleExport(ReactIconsFi);
    if (cleanName.includes('react-icons/hi2')) return createIconModuleExport(ReactIconsHi2);
    if (cleanName.includes('react-icons/hi')) return createIconModuleExport(ReactIconsHi);
    if (cleanName.includes('react-icons/ai')) return createIconModuleExport(ReactIconsAi);
    if (cleanName.includes('react-icons/ri')) return createIconModuleExport(ReactIconsRi);
    if (cleanName.includes('react-icons/tb')) return createIconModuleExport(ReactIconsTb);
    if (cleanName.includes('react-icons/gr')) return createIconModuleExport(ReactIconsGr);
    if (cleanName.includes('react-icons/si')) return createIconModuleExport(ReactIconsSi);
    if (cleanName.includes('react-icons/pi')) return createIconModuleExport(ReactIconsPi);
    if (cleanName.includes('react-icons/ti')) return createIconModuleExport(ReactIconsTi);
    if (cleanName.includes('react-icons/gi')) return createIconModuleExport(ReactIconsGi);
    if (cleanName.includes('react-icons/go')) return createIconModuleExport(ReactIconsGo);
    if (cleanName.includes('react-icons/lu')) return createIconModuleExport(ReactIconsLu);

    // Fallback for any other react-icons sub-path
    if (cleanName.includes('react-icons')) {
      const combined = {
        ...ReactIconsFa6,
        ...ReactIconsFa,
        ...ReactIconsMd,
        ...ReactIconsHi2,
        ...ReactIconsIo5,
        ...ReactIconsBi,
        ...ReactIconsBs,
        ...ReactIconsFi,
        ...ReactIconsAi,
        ...ReactIconsRi,
        ...ReactIconsTb,
        ...ReactIconsGr,
      };
      return createIconModuleExport(combined);
    }

    // Swiper
    if (cleanName.includes('swiper/react') || cleanName === 'swiper') {
      return createModuleExport(SwiperFallback, {
        Swiper: SwiperFallback,
        SwiperSlide: SwiperSlideFallback,
      });
    }
    if (cleanName.includes('swiper/modules')) {
      return {
        __esModule: true,
        default: {},
        Autoplay: {},
        Navigation: {},
        Pagination: {},
      };
    }

    // ButtonCTA or Button
    if (cleanName.includes('button') || cleanName.includes('cta')) {
      return createModuleExport(ButtonCTAComponent, {
        ButtonCTA: ButtonCTAComponent,
        Button: ButtonCTAComponent,
      });
    }

    // SectionHeading
    if (cleanName.includes('section-heading') || cleanName.includes('sectionheading')) {
      return createModuleExport(SectionHeadingComponent, { SectionHeading: SectionHeadingComponent });
    }

    // TextWithImage
    if (cleanName.includes('textwithimage') || cleanName.includes('text-with-image') || cleanName.includes('splittextmedia') || cleanName.includes('split-text')) {
      return createModuleExport(TextWithImageComponent, { TextWithImage: TextWithImageComponent });
    }

    // Any other relative component
    return createModuleExport(FallbackProxyComponent);
  };

  const iconKeys = Object.keys(LucideIcons);
  const iconVals = Object.values(LucideIcons);

  // 4. Instantiate component with React hooks, exports, and top icons in scope
  const runner = new Function(
    'React',
    'useState',
    'useEffect',
    'useMemo',
    'useRef',
    'useCallback',
    'useContext',
    'useReducer',
    'require',
    'exports',
    'module',
    'ButtonCTA',
    'Button',
    'SectionHeading',
    'TextWithImage',
    'FaBrain',
    'FaMagic',
    'FaComments',
    'FaBookOpen',
    'FaUsers',
    'FaVideo',
    'MdKeyboardArrowRight',
    ...iconKeys,
    compiled.code
  );

  runner(
    React,
    React.useState,
    React.useEffect,
    React.useMemo,
    React.useRef,
    React.useCallback,
    React.useContext,
    React.useReducer,
    customRequire,
    exports,
    moduleObj,
    ButtonCTAComponent,
    ButtonCTAComponent,
    SectionHeadingComponent,
    TextWithImageComponent,
    ReactIconsFa.FaBrain || FallbackIcon,
    ReactIconsFa.FaMagic || FallbackIcon,
    ReactIconsFa.FaComments || FallbackIcon,
    ReactIconsFa6.FaBookOpen || FallbackIcon,
    ReactIconsFa6.FaUsers || FallbackIcon,
    ReactIconsFa6.FaVideo || FallbackIcon,
    ReactIconsMd.MdKeyboardArrowRight || FallbackIcon,
    ...iconVals
  );

  const ResultComponent = exports.default || moduleObj.exports?.default || Object.values(exports).find((v) => typeof v === 'function');
  if (!ResultComponent || typeof ResultComponent !== 'function') {
    throw new Error('Không thể khởi tạo React Component từ mã nguồn. Hãy chắc chắn có một hàm React được export default.');
  }

  return ResultComponent;
}

/**
 * Helper to parse inline style string "color: red; font-size: 14px" into a React style object
 */
function parseStyleString(styleStr) {
  if (!styleStr || typeof styleStr !== 'string') return undefined;
  const styleObj = {};
  const rules = styleStr.split(';');
  for (const rule of rules) {
    const trimmed = rule.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const key = trimmed.slice(0, colonIndex).trim();
    const val = trimmed.slice(colonIndex + 1).trim();
    if (!key || !val) continue;

    // Preserve CSS custom variables as-is, convert other keys to camelCase
    let propName = key;
    if (!key.startsWith('--')) {
      propName = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    }
    styleObj[propName] = val;
  }
  return Object.keys(styleObj).length > 0 ? styleObj : undefined;
}

/**
 * Pre-processes code string to convert inline JSX string style='...' or style="..." into style={{...}}
 */
function convertInlineStylesInJsx(codeStr) {
  if (!codeStr || typeof codeStr !== 'string') return codeStr;
  return codeStr.replace(/\bstyle\s*=\s*(["'])([\s\S]*?)\1/g, (match, quote, styleContent) => {
    // If it's empty
    if (!styleContent.trim()) return 'style={{}}';
    const parsed = parseStyleString(styleContent);
    if (!parsed) return match;
    try {
      return `style={${JSON.stringify(parsed)}}`;
    } catch {
      return match;
    }
  });
}

/**
 * Fallback DOM Parser for simple HTML snippets if React compilation isn't applicable
 */
function cleanDomCode(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim();
  str = str.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  str = str.replace(/export\s+default\s+[^;]+;?/g, '');
  str = str.replace(/className\s*=\s*(['"][^'"]*['"])/g, 'class=$1');
  str = str.replace(/htmlFor\s*=\s*/g, 'for=');
  str = str.replace(/<([A-Z][A-Za-z0-9_]*)([^>]*?)\s*\/>/g, '<$1$2></$1>');
  return str.trim();
}

function domNodeToReact(node, key) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType === Node.COMMENT_NODE) return null;

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    const iconMatchKey = Object.keys(LucideIcons).find((k) => k.toLowerCase() === tagName);
    if (iconMatchKey && LucideIcons[iconMatchKey]) {
      const IconComponent = LucideIcons[iconMatchKey];
      const props = { key };
      Array.from(node.attributes || []).forEach((attr) => {
        const name = attr.name === 'class' ? 'className' : attr.name;
        if (name === 'style') {
          const parsedStyle = parseStyleString(attr.value);
          if (parsedStyle) props.style = parsedStyle;
        } else {
          props[name] = attr.value;
        }
      });
      return <IconComponent {...props} />;
    }

    const props = { key };
    Array.from(node.attributes || []).forEach((attr) => {
      let attrName = attr.name;
      if (attrName === 'class') attrName = 'className';
      if (attrName === 'for') attrName = 'htmlFor';
      if (attrName.startsWith('on')) return;
      if (attrName === 'style') {
        const parsedStyle = parseStyleString(attr.value);
        if (parsedStyle) props.style = parsedStyle;
      } else {
        props[attrName] = attr.value;
      }
    });

    const voidTags = ['img', 'input', 'br', 'hr', 'source', 'meta', 'link'];
    if (voidTags.includes(tagName)) {
      return React.createElement(tagName, props);
    }

    const children = Array.from(node.childNodes || [])
      .map((child, idx) => domNodeToReact(child, `${key}-${idx}`))
      .filter((c) => c !== null && c !== undefined);

    return React.createElement(tagName, props, ...children);
  }
  return null;
}

/**
 * Error Boundary to catch any runtime rendering errors inside custom components
 */
class ComponentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Custom Component Runtime Error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Lỗi khi chạy Component React:</span>
          </div>
          <p className="text-xs font-mono bg-white p-3 rounded-xl border border-rose-200 text-rose-800">
            {this.state.error?.message || 'Lỗi không xác định'}
          </p>
          <p className="text-xs text-rose-600">
            Hãy kiểm tra lại các biến, mảng hoặc hook trong hàm component.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CustomCodeRenderer({
  code = '',
  activeTheme = {},
  activeFont = {},
  activeRadius = 16,
  className = '',
}) {
  const r = Number(activeRadius) || 16;

  // CSS variables injected into this container to guarantee instant theming
  const dynamicStyles = {
    '--color-primary': activeTheme.primary || '#003A70',
    '--color-primary-dark': activeTheme.primaryDark || '#00264A',
    '--color-primary-light': activeTheme.primaryLight || '#1B528A',
    '--color-primary-50': '#EEF4FA',
    '--color-primary-100': '#D7E5F3',
    '--color-secondary': activeTheme.secondary || '#FFC84D',
    '--color-secondary-hover': activeTheme.secondaryHover || '#F2B938',
    '--color-secondary-dark': activeTheme.secondaryDark || '#D49B1E',
    '--color-secondary-50': '#FFF9EB',
    '--color-accent': activeTheme.accent || activeTheme.secondary || '#FFC84D',
    '--color-accent-dark': activeTheme.accentDark || '#E05333',
    '--color-surface': '#FFFFFF',
    '--color-surface-muted': '#F4F7FC',
    '--color-text-muted': '#5D7186',
    '--font-heading': activeFont.fontFamily || '"Be Vietnam Pro", sans-serif',
    '--font-body': activeFont.fontFamily || '"Be Vietnam Pro", sans-serif',
    '--radius-base': `${r}px`,
    '--radius-sm': `${Math.max(0, Math.round(r * 0.5))}px`,
    '--radius-md': `${Math.max(0, Math.round(r * 0.75))}px`,
    '--radius-lg': `${r}px`,
    '--radius-xl': `${Math.round(r * 1.25)}px`,
    '--radius-2xl': `${Math.round(r * 1.5)}px`,
    '--radius-3xl': `${Math.round(r * 2)}px`,
    fontFamily: activeFont.fontFamily || 'inherit',
  };

  const { CompiledComponent, domFallback, error } = useMemo(() => {
    if (!code || !code.trim()) {
      return { CompiledComponent: null, domFallback: null, error: null };
    }

    // Step 1: Try full React compilation (handles useState, loops, imports, function components)
    try {
      const Comp = compileReactComponent(code);
      return { CompiledComponent: Comp, domFallback: null, error: null };
    } catch (reactErr) {
      console.warn('React compilation notice (trying DOM fallback):', reactErr);

      // Step 2: Try DOM-based fallback if it was pure HTML
      try {
        const cleaned = cleanDomCode(code);
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleaned, 'text/html');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
          throw new Error(reactErr.message || parseError.textContent);
        }
        const childNodes = Array.from(doc.body.childNodes);
        if (childNodes.length > 0) {
          const elements = childNodes.map((n, idx) => domNodeToReact(n, `fallback-${idx}`));
          return { CompiledComponent: null, domFallback: elements, error: null };
        }
      } catch (domErr) {
        // Return original React error which is usually more informative
      }

      return {
        CompiledComponent: null,
        domFallback: null,
        error: reactErr.message || 'Lỗi cú pháp mã nguồn React/JSX',
      };
    }
  }, [code]);

  if (!code || !code.trim()) {
    return (
      <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">Chưa có mã nguồn để hiển thị. Vui lòng nhập code JSX/HTML.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>Lỗi trong mã nguồn React/JSX:</span>
        </div>
        <p className="text-xs font-mono bg-white p-3 rounded-xl border border-rose-200 text-rose-800">
          {error}
        </p>
        <p className="text-xs text-rose-600">
          Gợi ý: Kiểm tra lại các thẻ đóng mở (ví dụ: &lt;div&gt;...&lt;/div&gt;), hoặc cú pháp hàm component.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`custom-code-root w-full transition-all duration-200 ${className}`}
      style={dynamicStyles}
    >
      <ComponentErrorBoundary resetKey={code}>
        {CompiledComponent ? <CompiledComponent /> : domFallback}
      </ComponentErrorBoundary>
    </div>
  );
}
