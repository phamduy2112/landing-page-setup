import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

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

/**
 * Generate Tailwind CSS Config content
 */
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

/**
 * Generate index.css content with CSS variables and fonts
 */
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

/**
 * Clean & wrap component code if needed, baking custom data if available
 */
export function formatSectionComponent(rawCode, compName, data = {}) {
  if (!rawCode || typeof rawCode !== 'string') {
    return `import React from 'react';\n\nexport default function ${compName}() {\n  return (\n    <section className="py-16 bg-white text-center">\n      <h2 className="text-2xl font-bold">${compName}</h2>\n    </section>\n  );\n}\n`;
  }

  let code = rawCode.trim();

  // If there's custom data provided and component signature has ({ data = {} })
  if (data && Object.keys(data).length > 0) {
    const dataString = JSON.stringify(data, null, 2);
    if (code.includes('({ data = {} })') || code.includes('({ data })')) {
      code = code.replace(
        /export\s+default\s+function\s+([A-Za-z0-9_]+)\(\{\s*data\s*(=\s*\{\})?\s*\}\)/,
        `const defaultData = ${dataString};\n\nexport default function $1({ data = defaultData })`
      );
    }
  }

  // Auto-inject ButtonCTA import if used but missing
  let autoImports = [];
  if (code.includes('<ButtonCTA') && !code.includes('ButtonCTA from')) {
    autoImports.push("import ButtonCTA from './ButtonCTA.jsx';");
  }

  // If it's already an export default function
  if (code.includes('export default function') || code.includes('export default')) {
    // Ensure react import exists
    if (!code.includes("import React") && !code.includes("from 'react'")) {
      code = `import React from 'react';\n` + code;
    }
    if (autoImports.length > 0) {
      code = `${autoImports.join('\n')}\n` + code;
    }
    return code;
  }

  // If it's a function declaration
  if (/^function\s+([A-Za-z0-9_]+)/m.test(code)) {
    if (!code.includes("import React") && !code.includes("from 'react'")) {
      code = `import React from 'react';\n` + code;
    }
    if (autoImports.length > 0) {
      code = `${autoImports.join('\n')}\n` + code;
    }
    return `${code}\n\nexport default ${compName};\n`;
  }

  // If it's just a raw JSX fragment or HTML snippet
  return `import React from 'react';
${autoImports.join('\n')}

export default function ${compName}() {
  return (
    <div className="w-full">
${code.split('\n').map(l => '      ' + l).join('\n')}
    </div>
  );
}
`;
}

/**
 * Main project exporter function
 */
export async function createFullLandingProject({
  projectName = 'dai-tay-nam-edu-landing',
  projectTitle = 'Edu Landing Page',
  sections = [],
  theme = {},
  font = {},
  radius = 16,
  autoInstall = true,
  syncToExisting = false,
  workspaceRoot = path.resolve('..'),
}) {
  const rawProjectName = (projectName || '').trim();
  const cleanName = rawProjectName
    ? rawProjectName.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-')
    : (syncToExisting ? 'dai-tay-nam-edu-landing' : 'edu-landing');

  // If syncing or folder exists by exact name, use it; otherwise fallback to cleanName
  let targetDir = path.join(workspaceRoot, rawProjectName || cleanName);
  if (!fs.existsSync(targetDir)) {
    targetDir = path.join(workspaceRoot, cleanName);
  }

  const srcDir = path.join(targetDir, 'src');
  const componentsDir = path.join(srcDir, 'components');
  const publicDir = path.join(targetDir, 'public');
  const assetsDir = path.join(publicDir, 'assets');

  // 1. Ensure folder structure
  [targetDir, srcDir, componentsDir, publicDir, assetsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 2. Copy static assets if source exists
  const srcAssets = path.join(workspaceRoot, 'tan-sanh-ngu-landing', 'public', 'assets');
  if (fs.existsSync(srcAssets) && srcAssets !== assetsDir) {
    try {
      fs.cpSync(srcAssets, assetsDir, { recursive: true, overwrite: false });
    } catch (err) {
      console.warn('Asset copy notice:', err.message);
    }
  }

  // 2.5 Ensure shared ButtonCTA.jsx is always available in componentsDir
  const buttonCtaSource = path.resolve('src', 'components', 'common', 'ButtonCTA.jsx');
  const buttonCtaDest = path.join(componentsDir, 'ButtonCTA.jsx');
  if (fs.existsSync(buttonCtaSource)) {
    fs.copyFileSync(buttonCtaSource, buttonCtaDest);
  }

  // 3. Process each section and create component files
  const usedNames = new Set();
  const componentImports = [];
  const componentTags = [];
  const writtenFiles = [];

  sections.forEach((sec, idx) => {
    // Generate clean PascalCase component name
    let rawCompName = (sec.fileName || sec.name || `Section_${idx + 1}`)
      .replace(/\.jsx$/, '')
      .replace(/[^a-zA-Z0-9]/g, '');

    if (!rawCompName || /^[0-9]/.test(rawCompName)) {
      rawCompName = `Section${rawCompName}`;
    }
    // Capitalize first letter
    rawCompName = rawCompName.charAt(0).toUpperCase() + rawCompName.slice(1);

    let finalCompName = rawCompName;
    let counter = 2;
    while (usedNames.has(finalCompName)) {
      finalCompName = `${rawCompName}_${counter++}`;
    }
    usedNames.add(finalCompName);

    const compFileName = `${finalCompName}.jsx`;
    const compFilePath = path.join(componentsDir, compFileName);

    const formattedCode = formatSectionComponent(sec.code, finalCompName, sec.data);
    fs.writeFileSync(compFilePath, formattedCode, 'utf-8');

    writtenFiles.push(compFileName);
    componentImports.push(`import ${finalCompName} from './components/${finalCompName}.jsx';`);
    componentTags.push(`        {/* Section: ${sec.name || finalCompName} */}\n        <${finalCompName} />`);
  });

  // 4. Generate App.jsx
  const appJsxContent = `import React from 'react';
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
  fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsxContent, 'utf-8');

  // 5. Update or write Tailwind config & index.css
  const tailwindContent = buildTailwindConfig(theme, font, radius);
  fs.writeFileSync(path.join(targetDir, 'tailwind.config.js'), tailwindContent, 'utf-8');

  const indexCssContent = buildIndexCss(theme, font, radius);
  fs.writeFileSync(path.join(srcDir, 'index.css'), indexCssContent, 'utf-8');

  // 6. If standalone project (not sync to existing), write all boilerplate files
  if (!syncToExisting) {
    // package.json
    const packageJsonContent = JSON.stringify(
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
    fs.writeFileSync(path.join(targetDir, 'package.json'), packageJsonContent, 'utf-8');

    // vite.config.js
    const viteConfigContent = `import { defineConfig } from 'vite';
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
    fs.writeFileSync(path.join(targetDir, 'vite.config.js'), viteConfigContent, 'utf-8');

    // postcss.config.js
    const postcssConfigContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    fs.writeFileSync(path.join(targetDir, 'postcss.config.js'), postcssConfigContent, 'utf-8');

    // index.html
    const indexHtmlContent = `<!doctype html>
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
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtmlContent, 'utf-8');

    // src/main.jsx
    const mainJsxContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
    fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsxContent, 'utf-8');

    // chay-du-an.bat (Windows 1-click execution script)
    const batContent = `@echo off
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
    fs.writeFileSync(path.join(targetDir, 'chay-du-an.bat'), batContent, 'utf-8');

    // README.md
    const readmeContent = `# ${projectTitle || cleanName}

Landing Page được khởi tạo tự động bởi **EduLanding Studio**.

## Cấu trúc thư mục:
- \`src/components/\`: Chứa toàn bộ các section/component đã được chia tách riêng biệt:
${writtenFiles.map(f => `  - \`${f}\``).join('\n')}
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
    fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf-8');
  }

  // 7. Auto run npm install if requested
  let installStarted = false;
  if (autoInstall && !syncToExisting) {
    try {
      exec('npm install --legacy-peer-deps', { cwd: targetDir }, (error, stdout, stderr) => {
        if (error) {
          console.error(`[npm install error for ${cleanName}]:`, error.message);
        } else {
          console.log(`[npm install success for ${cleanName}]`);
        }
      });
      installStarted = true;
    } catch (err) {
      console.warn('npm install trigger notice:', err.message);
    }
  }

  return {
    success: true,
    targetDir,
    projectName: cleanName,
    componentsCount: writtenFiles.length,
    writtenFiles,
    installStarted,
    isExistingSync: syncToExisting,
  };
}
