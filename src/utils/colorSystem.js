/**
 * colorSystem.js
 * Quản lý màu sắc, bảng mã RGB và CSS Variables cho toàn bộ Builder & Sections.
 * Đảm bảo:
 * 1. Hỗ trợ 100% cú pháp Opacity của Tailwind CSS v3 (vd: bg-primary/10, text-primary/80, from-primary/5).
 * 2. Tự động tính toán các sắc độ (tint 50, tint 100, dark, light) từ mã HEX.
 * 3. Đồng bộ hoàn hảo giữa Theme Customizer, Live Canvas, Mobile Iframe và Custom Code Renderer.
 */

/**
 * Chuyển đổi mã màu HEX (#003A70 hoặc #03A) thành chuỗi RGB channels ('0 58 112')
 */
export function hexToRgbChannels(hex = '#003A70') {
  if (!hex || typeof hex !== 'string') return '0 58 112';
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) return '0 58 112';

  const num = parseInt(clean, 16);
  if (isNaN(num)) return '0 58 112';

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

/**
 * Làm tối hoặc làm sáng màu HEX theo tỉ lệ percent (-1 đến 1)
 */
export function adjustHexBrightness(hex, percent) {
  if (!hex || typeof hex !== 'string') return hex;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  if (percent > 0) {
    // Làm sáng
    r = Math.round(r + (255 - r) * percent);
    g = Math.round(g + (255 - g) * percent);
    b = Math.round(b + (255 - b) * percent);
  } else {
    // Làm tối
    const factor = 1 + percent;
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
  }

  const toHex = (n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Sinh đầy đủ bộ CSS Variables (cả mã HEX lẫn chuỗi RGB channels) từ activeTheme
 */
export function computeThemeCssVariables(theme = {}, font = {}, radius = 16) {
  const primary = theme.primary || '#003A70';
  const primaryDark = theme.primaryDark || adjustHexBrightness(primary, -0.25);
  const primaryLight = theme.primaryLight || adjustHexBrightness(primary, 0.25);

  const secondary = theme.secondary || '#FFC84D';
  const secondaryHover = theme.secondaryHover || adjustHexBrightness(secondary, -0.08);
  const secondaryDark = theme.secondaryDark || adjustHexBrightness(secondary, -0.2);

  const accent = theme.accent || secondary;
  const accentDark = theme.accentDark || secondaryDark;

  const r = Number(radius) || 16;
  const fontFamily = font.fontFamily || '"Be Vietnam Pro", sans-serif';

  return {
    // 1. Primary Colors
    '--color-primary': primary,
    '--color-primary-rgb': hexToRgbChannels(primary),
    '--color-primary-dark': primaryDark,
    '--color-primary-dark-rgb': hexToRgbChannels(primaryDark),
    '--color-primary-light': primaryLight,
    '--color-primary-light-rgb': hexToRgbChannels(primaryLight),
    '--color-primary-50': `rgb(${hexToRgbChannels(primary)} / 0.05)`,
    '--color-primary-100': `rgb(${hexToRgbChannels(primary)} / 0.1)`,

    // 2. Secondary & Accent Colors (Đồng bộ theo tông vàng/hổ phách chuẩn brand)
    '--color-secondary': secondary,
    '--color-secondary-rgb': hexToRgbChannels(secondary),
    '--color-secondary-hover': secondaryHover,
    '--color-secondary-hover-rgb': hexToRgbChannels(secondaryHover),
    '--color-secondary-dark': secondaryDark,
    '--color-secondary-dark-rgb': hexToRgbChannels(secondaryDark),
    '--color-secondary-50': `rgb(${hexToRgbChannels(secondary)} / 0.08)`,

    '--color-accent': accent,
    '--color-accent-rgb': hexToRgbChannels(accent),
    '--color-accent-dark': accentDark,
    '--color-accent-dark-rgb': hexToRgbChannels(accentDark),

    // 3. Neutral & Surface
    '--color-surface': '#FFFFFF',
    '--color-surface-muted': '#F4F7FC',
    '--color-text-muted': '#5D7186',
    '--color-text': primary,

    // 4. Typography
    '--font-heading': fontFamily,
    '--font-body': fontFamily,

    // 5. Border Radius
    '--radius-base': `${r}px`,
    '--radius-sm': `${Math.max(0, Math.round(r * 0.5))}px`,
    '--radius-md': `${Math.max(0, Math.round(r * 0.75))}px`,
    '--radius-lg': `${r}px`,
    '--radius-xl': `${Math.round(r * 1.25)}px`,
    '--radius-2xl': `${Math.round(r * 1.5)}px`,
    '--radius-3xl': `${Math.round(r * 2)}px`,
  };
}

/**
 * Gán trực tiếp bộ CSS Variables vào phần tử DOM (thường là document.documentElement hoặc iframe doc)
 */
export function applyThemeToDom(element, theme = {}, font = {}, radius = 16) {
  if (!element || !element.style) return;
  const variables = computeThemeCssVariables(theme, font, radius);
  Object.entries(variables).forEach(([prop, val]) => {
    element.style.setProperty(prop, val);
  });
}
