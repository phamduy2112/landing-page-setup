/**
 * Utility to generate full code and single section code
 * with dynamic colors and fonts for exported landing pages.
 */

export function formatFontFamilyForTailwind(fontFamilyStr) {
  if (!fontFamilyStr) return "'Plus Jakarta Sans', 'sans-serif'";
  const items = String(fontFamilyStr)
    .split(',')
    .map((item) => {
      const clean = item.replace(/["']/g, '').trim();
      return clean ? `'${clean}'` : null;
    })
    .filter(Boolean);
  return items.length > 0 ? items.join(', ') : "'Plus Jakarta Sans', 'sans-serif'";
}

export function formatFontFamilyForCss(fontFamilyStr) {
  if (!fontFamilyStr) return "'Plus Jakarta Sans', sans-serif";
  const items = String(fontFamilyStr)
    .split(',')
    .map((item) => {
      const clean = item.replace(/["']/g, '').trim();
      return clean.includes(' ') ? `'${clean}'` : clean;
    })
    .filter(Boolean);
  return items.length > 0 ? items.join(', ') : "'Plus Jakarta Sans', sans-serif";
}

export function generateTailwindConfig(theme, font, radius = 16) {
  const fontList = formatFontFamilyForTailwind(font?.fontFamily);
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${theme.primary}',
          dark: '${theme.primaryDark || '#00264A'}',
          light: '${theme.primaryLight || '#1B528A'}',
          50: '#F0F5FA',
          100: '#D9E6F2',
        },
        secondary: {
          DEFAULT: '${theme.secondary}',
          hover: '${theme.secondaryHover || '#F2B938'}',
          dark: '${theme.secondaryDark || '#D49B1E'}',
        },
        accent: {
          DEFAULT: '${theme.accent || '#FF6B4A'}',
        },
      },
      fontFamily: {
        heading: [${fontList}],
        body: [${fontList}],
      },
      borderRadius: {
        'none': '0px',
        'sm': 'var(--radius-sm, 4px)',
        'DEFAULT': 'var(--radius-md, 8px)',
        'md': 'var(--radius-md, 8px)',
        'lg': 'var(--radius-lg, 12px)',
        'xl': 'var(--radius-xl, 16px)',
        '2xl': 'var(--radius-2xl, 24px)',
        '3xl': 'var(--radius-3xl, 32px)',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
`;
}

export function generateIndexCss(theme, font, radius = 16) {
  const r = Number(radius) || 16;
  const fontCss = formatFontFamilyForCss(font?.fontFamily);
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');

:root {
  --color-primary: ${theme.primary};
  --color-primary-dark: ${theme.primaryDark || '#00264A'};
  --color-primary-light: ${theme.primaryLight || '#1B528A'};
  --color-secondary: ${theme.secondary};
  --color-secondary-hover: ${theme.secondaryHover || '#F2B938'};
  --color-secondary-dark: ${theme.secondaryDark || '#D49B1E'};
  --color-accent: ${theme.accent || '#FF6B4A'};
  --font-heading: ${fontCss};
  --font-body: ${fontCss};

  --radius-base: ${r}px;
  --radius-sm: ${Math.max(0, Math.round(r * 0.5))}px;
  --radius-md: ${Math.max(0, Math.round(r * 0.75))}px;
  --radius-lg: ${r}px;
  --radius-xl: ${Math.round(r * 1.25)}px;
  --radius-2xl: ${Math.round(r * 1.5)}px;
  --radius-3xl: ${Math.round(r * 2)}px;
}

body {
  font-family: var(--font-body);
  background-color: #ffffff;
  color: #0f172a;
  overflow-x: hidden;
}
`;
}

export function generateAppJsx(canvasSections = []) {
  const imports = [];
  const customComponentDefs = [];
  const componentsJsx = [];

  canvasSections.forEach((s, idx) => {
    const isCustom = s.isCustom || s.sectionDef?.isCustom;
    if (isCustom) {
      const compName = `CustomSection_${idx + 1}`;
      const codeSnippet = (s.customCode || s.sectionDef?.customCode || '<div>Custom Section</div>').trim();

      // If user pasted a full React component with function or export default
      if (codeSnippet.includes('export default') || /function\s+\w+/.test(codeSnippet)) {
        const codeLines = codeSnippet.split('\n');
        const extractedImports = [];
        const nonImportLines = [];

        codeLines.forEach((line) => {
          if (/^\s*import\s+/.test(line)) {
            extractedImports.push(line);
          } else {
            nonImportLines.push(line);
          }
        });

        if (extractedImports.length > 0) {
          imports.push(...extractedImports);
        }

        let cleanedDef = nonImportLines.join('\n');
        cleanedDef = cleanedDef.replace(/export\s+default\s+function\s*([A-Za-z0-9_]*)/, `function ${compName}`);
        cleanedDef = cleanedDef.replace(/export\s+default\s+/, `const ${compName} = `);

        customComponentDefs.push(`// --- Section Tùy Biến: ${s.sectionDef?.name || compName} ---\n${cleanedDef}`);
      } else {
        customComponentDefs.push(`// --- Section Tùy Biến: ${s.sectionDef?.name || `Section #${idx + 1}`} ---
function ${compName}() {
  return (
    <div className="w-full">
${codeSnippet.split('\n').map((line) => '      ' + line).join('\n')}
    </div>
  );
}`);
      }

      const styleSettings = s.styleSettings || {};
      const { textAlign, fontScale } = styleSettings;
      let hasCustomStyles = (textAlign && textAlign !== 'default') || (fontScale && fontScale !== 100);

      if (hasCustomStyles) {
        const alignClass = textAlign === 'center' ? ' text-center' : textAlign === 'right' ? ' text-right' : textAlign === 'left' ? ' text-left' : '';
        const stylesArr = [];
        if (textAlign && textAlign !== 'default') stylesArr.push(`textAlign: '${textAlign}'`);
        if (fontScale && fontScale !== 100) stylesArr.push(`fontSize: '${fontScale}%'`);
        const styleAttr = stylesArr.length > 0 ? ` style={{ ${stylesArr.join(', ')} }}` : '';

        componentsJsx.push(`      {/* ${s.sectionDef?.name || compName} */}
      <div className="w-full${alignClass}"${styleAttr}>
        <${compName} />
      </div>`);
      } else {
        componentsJsx.push(`      {/* ${s.sectionDef?.name || compName} */}
      <${compName} />`);
      }
    } else {
      const baseName = (s.sectionDef?.fileName || `Section_${idx}`).replace('.jsx', '');
      const compName = `${baseName}_${idx}`;
      imports.push(`import ${compName} from './components/sections/${baseName}';`);

      const styleSettings = s.styleSettings || {};
      const { textAlign, fontScale } = styleSettings;
      let hasCustomStyles = (textAlign && textAlign !== 'default') || (fontScale && fontScale !== 100);

      if (hasCustomStyles) {
        const alignClass = textAlign === 'center' ? ' text-center' : textAlign === 'right' ? ' text-right' : textAlign === 'left' ? ' text-left' : '';
        const stylesArr = [];
        if (textAlign && textAlign !== 'default') stylesArr.push(`textAlign: '${textAlign}'`);
        if (fontScale && fontScale !== 100) stylesArr.push(`fontSize: '${fontScale}%'`);
        const styleAttr = stylesArr.length > 0 ? ` style={{ ${stylesArr.join(', ')} }}` : '';

        componentsJsx.push(`      {/* ${s.sectionDef?.name || compName} */}
      <div className="w-full${alignClass}"${styleAttr}>
        <${compName} />
      </div>`);
      } else {
        componentsJsx.push(`      {/* ${s.sectionDef?.name || compName} */}
      <${compName} />`);
      }
    }
  });

  const uniqueImports = Array.from(new Set(imports));

  return `import React from 'react';
${uniqueImports.join('\n')}

${customComponentDefs.length > 0 ? customComponentDefs.join('\n\n') + '\n\n' : ''}export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-primary selection:text-white">
${componentsJsx.join('\n')}
    </div>
  );
}
`;
}

export function generateCustomSectionStandaloneCode(sec, theme, font, radius = 16) {
  if (!sec) return '';
  const rawCode = (sec.customCode || sec.sectionDef?.customCode || '').trim();
  const name = sec.name || sec.sectionDef?.name || 'CustomSection';
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '') || 'CustomSection';

  // If already a complete component, output as is with metadata comment
  if (rawCode.includes('export default') || /function\s+\w+/.test(rawCode)) {
    return `// ========================================================
// SECTION: ${name}
// Thiết lập theme: Primary (${theme.primary}), Secondary (${theme.secondary}), Radius (${radius}px)
// Phông chữ: ${font.name}
// ========================================================

${rawCode}
`;
  }

  return `// ========================================================
// SECTION: ${name}
// Thiết lập theme: Primary (${theme.primary}), Secondary (${theme.secondary}), Radius (${radius}px)
// Phông chữ: ${font.name}
// ========================================================

import React from 'react';

export default function ${cleanName}() {
  return (
    <div className="w-full">
${rawCode.split('\n').map((line) => '      ' + line).join('\n')}
    </div>
  );
}
`;
}

export function downloadFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
