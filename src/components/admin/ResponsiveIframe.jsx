import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { applyThemeToDom } from '../../utils/colorSystem';

/**
 * ResponsiveIframe: An isolated iframe environment that provides true
 * viewport widths (e.g. 390px, 768px, 100%) so that CSS media queries
 * like `@media (min-width: 768px)` and Tailwind `md:`, `sm:`, `lg:` classes
 * trigger 100% accurately matching real mobile and tablet devices.
 */
export default function ResponsiveIframe({
  children,
  viewport = 'desktop', // 'desktop' | 'tablet' | 'mobile'
  activeTheme = {},
  activeFont = {},
  activeRadius = 16,
  className = '',
  minHeight = 0,
}) {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);
  const [iframeHeight, setIframeHeight] = useState(minHeight || 80);

  // Target width constraints
  const targetMaxWidth =
    viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%';

  // 1. Initialize iframe document once
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Build the initial HTML inside the iframe
    doc.open();
    doc.write(`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    try {
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                DEFAULT: 'rgb(var(--color-primary-rgb, 0 58 112) / <alpha-value>)',
                dark: 'rgb(var(--color-primary-dark-rgb, 0 38 74) / <alpha-value>)',
                light: 'rgb(var(--color-primary-light-rgb, 27 82 138) / <alpha-value>)',
                50: 'var(--color-primary-50, rgb(0 58 112 / 0.05))',
                100: 'var(--color-primary-100, rgb(0 58 112 / 0.1))',
              },
              secondary: {
                DEFAULT: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
                hover: 'rgb(var(--color-secondary-hover-rgb, 242 185 56) / <alpha-value>)',
                dark: 'rgb(var(--color-secondary-dark-rgb, 212 155 30) / <alpha-value>)',
                50: 'var(--color-secondary-50, rgb(255 200 77 / 0.08))',
              },
              accent: {
                DEFAULT: 'rgb(var(--color-accent-rgb, 255 200 77) / <alpha-value>)',
                hover: 'rgb(var(--color-secondary-hover-rgb, 242 185 56) / <alpha-value>)',
                dark: 'rgb(var(--color-accent-dark-rgb, 212 155 30) / <alpha-value>)',
              },
              surface: 'var(--color-surface, #FFFFFF)',
              'surface-muted': 'var(--color-surface-muted, #F4F7FC)',
              'text-muted': 'var(--color-text-muted, #5D7186)',
              highlight: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
              navy: 'rgb(var(--color-primary-rgb, 0 58 112) / <alpha-value>)',
              gold: 'rgb(var(--color-secondary-rgb, 255 200 77) / <alpha-value>)',
            },
            fontFamily: {
              heading: ['var(--font-heading, "Be Vietnam Pro")', 'sans-serif'],
              body: ['var(--font-body, "Be Vietnam Pro")', 'sans-serif'],
            },
            borderRadius: {
              none: '0px',
              sm: 'var(--radius-sm, 4px)',
              DEFAULT: 'var(--radius-md, 8px)',
              md: 'var(--radius-md, 8px)',
              lg: 'var(--radius-lg, 12px)',
              xl: 'var(--radius-xl, 16px)',
              '2xl': 'var(--radius-2xl, 24px)',
              '3xl': 'var(--radius-3xl, 32px)',
              full: '9999px',
            },
          },
        },
      };
    } catch(e) {}
  </script>
  <style>
    *, ::before, ::after { box-sizing: border-box; }
    html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: auto !important;
      min-height: 0 !important;
      overflow: hidden;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: auto !important;
      min-height: 0 !important;
      background-color: transparent;
      overflow: hidden;
      font-family: inherit;
    }
    #responsive-root {
      width: 100%;
      height: auto !important;
      min-height: 0 !important;
      display: flow-root;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div id="responsive-root" style="width: 100%; height: auto;"></div>
</body>
</html>`);
    doc.close();

    // Copy stylesheet links and styles from the host document
    const copyParentStyles = () => {
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((styleEl) => {
        const id = styleEl.getAttribute('href') || (styleEl.textContent && styleEl.textContent.slice(0, 40));
        if (id && !doc.head.querySelector(`[data-inherited="${CSS.escape(id)}"]`)) {
          const clone = styleEl.cloneNode(true);
          clone.setAttribute('data-inherited', id);
          doc.head.appendChild(clone);
        }
      });
    };

    copyParentStyles();

    // Wait slightly for DOM to settle then mount
    const root = doc.getElementById('responsive-root');
    setMountNode(root);
  }, []);

  // 2. Inject CSS variables for theme, font, and radius
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !doc.documentElement) return;

    const r = Number(activeRadius) || 16;
    applyThemeToDom(doc.documentElement, activeTheme, activeFont, r);

    if (doc?.body && activeFont?.fontFamily) {
      doc.body.style.fontFamily = activeFont.fontFamily;
    }
  }, [activeTheme, activeFont, activeRadius, mountNode]);

  // 3. Auto-adjust iframe height strictly to fit contents without runaway expansion
  useEffect(() => {
    if (!mountNode || !iframeRef.current) return;

    let rafId = null;
    let prevHeight = 0;

    const measureAndSetHeight = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!mountNode || !iframeRef.current) return;

        // 1. Direct children boundary measurement
        let childrenMaxBottom = 0;
        if (mountNode.children && mountNode.children.length > 0) {
          for (let i = 0; i < mountNode.children.length; i++) {
            const child = mountNode.children[i];
            const bottom = child.offsetTop + child.offsetHeight;
            if (bottom > childrenMaxBottom) {
              childrenMaxBottom = bottom;
            }
          }
        }

        // 2. Exact bounding box of mountNode
        const rectH = mountNode.getBoundingClientRect().height;
        const scrollH = mountNode.scrollHeight;
        const offsetH = mountNode.offsetHeight;

        const contentH = Math.ceil(Math.max(childrenMaxBottom, rectH, offsetH, scrollH));
        const finalTargetH = Math.max(contentH, minHeight || 0);

        if (finalTargetH > 0 && Math.abs(finalTargetH - prevHeight) >= 2) {
          prevHeight = finalTargetH;
          setIframeHeight(finalTargetH);
        }
      });
    };

    // ResizeObserver on mountNode & all direct children
    const resizeObserver = new ResizeObserver(() => {
      measureAndSetHeight();
    });
    resizeObserver.observe(mountNode);
    Array.from(mountNode.children).forEach((child) => {
      resizeObserver.observe(child);
    });

    // MutationObserver to catch DOM changes (mobile menu toggles, image loads)
    const mutationObserver = new MutationObserver(() => {
      Array.from(mountNode.children).forEach((child) => {
        try { resizeObserver.observe(child); } catch (e) {}
      });
      measureAndSetHeight();
    });
    mutationObserver.observe(mountNode, { childList: true, subtree: true, attributes: true });

    // Multi-stage measurements for fonts, Tailwind script, images
    measureAndSetHeight();
    const t1 = setTimeout(measureAndSetHeight, 50);
    const t2 = setTimeout(measureAndSetHeight, 200);
    const t3 = setTimeout(measureAndSetHeight, 600);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [mountNode, children, viewport, minHeight]);

  return (
    <div className={`responsive-iframe-wrapper flex justify-center w-full transition-all duration-300 ${className}`}>
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          maxWidth: targetMaxWidth,
          height: `${iframeHeight}px`,
          border: 'none',
          backgroundColor: '#FFFFFF',
          display: 'block',
          overflow: 'hidden',
          transition: 'height 0.15s ease-out',
        }}
        title="Responsive Viewport Preview"
        className="rounded-2xl shadow-sm overflow-hidden"
      >
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    </div>
  );
}
