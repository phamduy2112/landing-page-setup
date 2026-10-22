import JSZip from 'jszip';

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

export function buildTailwindConfig(theme = {}, font = {}, radius = 16) {
  const primary = theme.primary || '#003B73';
  const primaryDark = theme.primaryDark || '#00264A';
  const primaryLight = theme.primaryLight || '#1B528A';
  const secondary = theme.secondary || '#E5A93C';
  const secondaryHover = theme.secondaryHover || '#F2B938';
  const secondaryDark = theme.secondaryDark || '#D49B1E';
  const accent = theme.accent || '#FF6B4A';
  const fontList = formatFontFamilyForTailwind(font?.fontFamily);

  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${primary}',
          dark: '${primaryDark}',
          light: '${primaryLight}',
          50: '#F0F5FA',
          100: '#D9E6F2',
        },
        secondary: {
          DEFAULT: '${secondary}',
          hover: '${secondaryHover}',
          dark: '${secondaryDark}',
        },
        accent: {
          DEFAULT: '${accent}',
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

export function buildIndexCss(theme = {}, font = {}, radius = 16) {
  const r = Number(radius) || 16;
  const primary = theme.primary || '#003B73';
  const primaryDark = theme.primaryDark || '#00264A';
  const primaryLight = theme.primaryLight || '#1B528A';
  const secondary = theme.secondary || '#E5A93C';
  const secondaryHover = theme.secondaryHover || '#F2B938';
  const secondaryDark = theme.secondaryDark || '#D49B1E';
  const accent = theme.accent || '#FF6B4A';
  const fontCss = formatFontFamilyForCss(font?.fontFamily);

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap');

:root {
  --color-primary: ${primary};
  --color-primary-dark: ${primaryDark};
  --color-primary-light: ${primaryLight};
  --color-secondary: ${secondary};
  --color-secondary-hover: ${secondaryHover};
  --color-secondary-dark: ${secondaryDark};
  --color-accent: ${accent};
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

export const BUTTON_CTA_SOURCE = `import React from 'react';

/**
 * ButtonCTA - Component Nút Kêu Gọi Hành Động dùng chung cho toàn bộ landing page.
 * Quản lý CSS tập trung, tự động ăn theo Design System & Theme.
 */
export default function ButtonCTA({
  text = 'Đăng ký tư vấn ngay',
  targetSection = 'tu-van',
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'glow'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = true,
  className = '',
  children,
  onClick,
  ...props
}) {
  const targetId = href ? href.replace(/^#/, '') : targetSection ? targetSection.replace(/^#/, '') : '';
  const finalHref = href || (targetId ? '#' + targetId : '#tu-van');

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (targetId) {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = '#' + targetId;
      }
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-xs gap-2',
    md: 'px-6 py-3.5 text-[13px] sm:text-sm gap-2.5',
    lg: 'px-8 py-4 text-base gap-3.5 font-black',
  }[size] || 'px-6 py-3.5 text-sm gap-2.5';

  const variantClasses = {
    primary:
      'bg-primary hover:bg-accent text-white shadow-md hover:shadow-xl shadow-primary/20',
    secondary:
      'bg-secondary hover:bg-secondary-hover text-slate-900 font-black shadow-lg shadow-secondary/25 active:scale-95',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent shadow-sm',
    glow:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black shadow-lg shadow-indigo-500/30 hover:shadow-amber-500/40',
  }[variant] || 'bg-primary hover:bg-accent text-white';

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={'group inline-flex w-fit items-center justify-center rounded-xl font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 ' + sizeClasses + ' ' + variantClasses + ' ' + className}
      {...props}
    >
      <span className="truncate">{children || text}</span>
      {icon && (
        <span className="text-base sm:text-lg leading-none transition-transform duration-200 group-hover:translate-x-1.5 shrink-0">
          →
        </span>
      )}
    </a>
  );
}
`;

export function formatSectionComponent(rawCode, compName, data = {}) {
  if (!rawCode || typeof rawCode !== 'string') {
    return `import React from 'react';\n\nexport default function ${compName}() {\n  return (\n    <section className="py-16 bg-white text-center">\n      <h2 className="text-2xl font-bold">${compName}</h2>\n    </section>\n  );\n}\n`;
  }

  let code = rawCode.trim();

  if (data && Object.keys(data).length > 0) {
    const dataString = JSON.stringify(data, null, 2);
    if (code.includes('({ data = {} })') || code.includes('({ data })')) {
      code = code.replace(
        /export\s+default\s+function\s+([A-Za-z0-9_]+)\(\{\s*data\s*(=\s*\{\})?\s*\}\)/,
        `const defaultData = ${dataString};\n\nexport default function $1({ data = defaultData })`
      );
    }
  }

  let autoImports = [];
  if (code.includes('<ButtonCTA') && !code.includes('ButtonCTA from')) {
    autoImports.push("import ButtonCTA from './ButtonCTA.jsx';");
  }

  if (code.includes('export default function') || code.includes('export default')) {
    if (!code.includes("import React") && !code.includes("from 'react'")) {
      code = `import React from 'react';\n` + code;
    }
    if (autoImports.length > 0) {
      code = `${autoImports.join('\n')}\n` + code;
    }
    return code;
  }

  if (/^function\s+([A-Za-z0-9_]+)/m.test(code)) {
    if (!code.includes("import React") && !code.includes("from 'react'")) {
      code = `import React from 'react';\n` + code;
    }
    if (autoImports.length > 0) {
      code = `${autoImports.join('\n')}\n` + code;
    }
    return `${code}\n\nexport default ${compName};\n`;
  }

  return `import React from 'react';
${autoImports.join('\n')}

export default function ${compName}() {
  return (
    <div className="w-full">
${code.split('\n').map((l) => '      ' + l).join('\n')}
    </div>
  );
}
`;
}

/**
 * Generate all project files in a flat dictionary mapping: { [filePath]: content }
 */
export function generateAllProjectFiles({
  projectName = 'edu-landing',
  projectTitle = 'Edu Landing Page',
  sections = [],
  theme = {},
  font = {},
  radius = 16,
}) {
  const cleanName = (projectName || 'edu-landing')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-');

  const files = {};

  // 1. Process Sections into separate files in src/components/
  const usedNames = new Set();
  const componentImports = [];
  const componentTags = [];
  const writtenComponentFiles = [];

  sections.forEach((sec, idx) => {
    let rawCompName = (sec.fileName || sec.name || `Section_${idx + 1}`)
      .replace(/\.jsx$/, '')
      .replace(/[^a-zA-Z0-9]/g, '');

    if (!rawCompName || /^[0-9]/.test(rawCompName)) {
      rawCompName = `Section${rawCompName}`;
    }
    rawCompName = rawCompName.charAt(0).toUpperCase() + rawCompName.slice(1);

    let finalCompName = rawCompName;
    let counter = 2;
    while (usedNames.has(finalCompName)) {
      finalCompName = `${rawCompName}_${counter++}`;
    }
    usedNames.add(finalCompName);

    const compFileName = `${finalCompName}.jsx`;
    const formattedCode = formatSectionComponent(sec.code, finalCompName, sec.data);
    files[`src/components/${compFileName}`] = formattedCode;
    writtenComponentFiles.push(compFileName);

    componentImports.push(`import ${finalCompName} from './components/${finalCompName}.jsx';`);
    componentTags.push(`        {/* Section: ${sec.name || finalCompName} */}\n        <${finalCompName} />`);
  });

  // 2. Shared ButtonCTA component
  files['src/components/ButtonCTA.jsx'] = BUTTON_CTA_SOURCE;

  // 3. App.jsx
  files['src/App.jsx'] = `import React from 'react';
${componentImports.join('\n')}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-primary selection:text-white">
      <main className="flex-1">
${componentTags.join('\n')}
      </main>
    </div>
  );
}
`;

  // 4. tailwind.config.js
  files['tailwind.config.js'] = buildTailwindConfig(theme, font, radius);

  // 5. src/index.css
  files['src/index.css'] = buildIndexCss(theme, font, radius);

  // 6. package.json
  files['package.json'] = JSON.stringify(
    {
      name: cleanName,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^19.2.8',
        'react-dom': '^19.2.8',
        'lucide-react': '^1.56.0',
        'react-icons': '^5.7.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^6.1.1',
        autoprefixer: '^10.6.1',
        postcss: '^8.5.28',
        tailwindcss: '^3.4.17',
        vite: '^8.3.0',
      },
    },
    null,
    2
  );

  // 7. vite.config.js
  files['vite.config.js'] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
`;

  // 8. postcss.config.js
  files['postcss.config.js'] = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  // 9. index.html
  files['index.html'] = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/assets/LOGO2.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectTitle || cleanName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  // 10. src/main.jsx
  files['src/main.jsx'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

  // 11. chay-du-an.bat (Windows 1-click execution script)
  files['chay-du-an.bat'] = `@echo off
chcp 65001 > nul
title Khởi Động Dự Án ${cleanName}
color 0B
echo ======================================================================
echo   TỰ ĐỘNG KHỞI CHẠY DỰ ÁN LANDING PAGE: ${cleanName}
echo ======================================================================
echo.
echo [1/2] Đang kiểm tra và cài đặt thư viện (npm install --legacy-peer-deps)...
call npm install --legacy-peer-deps
echo.
echo [2/2] Đang khởi động dev server (npm run dev)...
echo Dự án sẽ tự động bật trình duyệt tại http://localhost:3000...
echo.
call npm run dev
pause
`;

  // 12. README.md
  files['README.md'] = `# ${projectTitle || cleanName}

Landing Page được khởi tạo tự động bởi **EduLanding Studio**.

## Cấu trúc thư mục:
- \`src/components/\`: Chứa toàn bộ các section/component đã được chia tách riêng biệt:
${writtenComponentFiles.map((f) => `  - \`${f}\``).join('\n')}
- \`src/App.jsx\`: Lắp ghép và sắp xếp các section theo đúng thứ tự.
- \`tailwind.config.js\`: Cấu hình màu sắc, phông chữ và độ bo góc đã chọn trong Builder.
- \`chay-du-an.bat\`: File chạy tự động 1-click cho Windows (tự động \`npm install\` và \`npm run dev\`).

## Hướng dẫn chạy dự án:

### Cách 1 (Nhanh nhất trên Windows):
Double-click vào file **\`chay-du-an.bat\`**.

### Cách 2 (Dùng lệnh Terminal):
\`\`\`bash
# 1. Cài đặt thư viện:
npm install --legacy-peer-deps

# 2. Khởi chạy dev server:
npm run dev
\`\`\`
`;

  return {
    cleanName,
    files,
    writtenComponentFiles,
  };
}

/**
 * Client-Side ZIP Generator using JSZip (Works 100% in browser, even when deployed to Vercel/Netlify)
 */
export async function downloadProjectZipWithJsZip({
  projectName,
  projectTitle,
  sections,
  theme,
  font,
  radius,
}) {
  const { cleanName, files } = generateAllProjectFiles({
    projectName,
    projectTitle,
    sections,
    theme,
    font,
    radius,
  });

  const zip = new JSZip();
  const folder = zip.folder(cleanName) || zip;

  Object.entries(files).forEach(([relPath, content]) => {
    folder.file(relPath, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cleanName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileName: `${cleanName}.zip`,
    filesCount: Object.keys(files).length,
  };
}

/**
 * Client-Side Directory Writer using HTML5 File System Access API
 * Lets user pick a folder on their computer (e.g. e:\\cong ty\\landing-page)
 * and directly writes the project folder and files into it without needing any backend server!
 */
export async function writeProjectToLocalDirectoryWithPicker({
  projectName,
  projectTitle,
  sections,
  theme,
  font,
  radius,
}) {
  if (typeof window.showDirectoryPicker !== 'function') {
    throw new Error('Trình duyệt của bạn không hỗ trợ Directory Picker API (hãy dùng Chrome hoặc Edge).');
  }

  const { cleanName, files, writtenComponentFiles } = generateAllProjectFiles({
    projectName,
    projectTitle,
    sections,
    theme,
    font,
    radius,
  });

  // Prompt user to select parent folder
  const parentHandle = await window.showDirectoryPicker({
    mode: 'readwrite',
    startIn: 'desktop',
  });

  // Create project subfolder
  const projectDirHandle = await parentHandle.getDirectoryHandle(cleanName, { create: true });

  // Helper to ensure subfolder handle
  const getSubDirHandle = async (rootHandle, pathParts) => {
    let current = rootHandle;
    for (const part of pathParts) {
      current = await current.getDirectoryHandle(part, { create: true });
    }
    return current;
  };

  // Write all files
  for (const [relPath, content] of Object.entries(files)) {
    const parts = relPath.split('/');
    const fileName = parts.pop();
    const dirHandle = parts.length > 0 ? await getSubDirHandle(projectDirHandle, parts) : projectDirHandle;
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  return {
    success: true,
    folderName: cleanName,
    parentFolderName: parentHandle.name,
    filesCount: Object.keys(files).length,
    componentsCount: writtenComponentFiles.length,
  };
}
