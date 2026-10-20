/**
 * sectionColorTransform.js
 * Utility xử lý màu sắc thông minh cho Builder:
 * 1. Tự động chuyển đổi mã code dán vào (chưa có primary / dùng mã màu cứng / HTML mockup) sang Tailwind Primary
 * 2. Chuyển đổi qua lại giữa tông màu Primary và Secondary trực tiếp trên từng Section (không cần vào code)
 */

// Bảng màu hex thường gặp của Đại Tây Nam và các template phổ biến
export const BRAND_COLORS = {
  // Đỏ / Primary
  PRIMARY_HEX: '#FE0000',
  PRIMARY_HEX_ALT: '#ED1C24',
  PRIMARY_HEX_TAILWIND: '#dc2626',
  PRIMARY_HEX_TAILWIND_500: '#ef4444',
  // Xanh lá / Secondary
  SECONDARY_HEX: '#2BC412',
  SECONDARY_HEX_DARK: '#229E0E',
  SECONDARY_HEX_TAILWIND: '#16a34a',
  SECONDARY_HEX_CUSTOM: '#0D8626',
};

/**
 * Kiểm tra xem đoạn code có chứa các token màu primary hay không
 */
export function hasPrimaryTokens(code) {
  if (!code || typeof code !== 'string') return false;
  return (
    code.includes('text-primary') ||
    code.includes('bg-primary') ||
    code.includes('border-primary') ||
    code.includes('from-primary') ||
    code.includes('to-primary') ||
    code.includes('ring-primary') ||
    code.includes('var(--color-primary')
  );
}

/**
 * Kiểm tra xem đoạn code có chứa các token màu secondary hay không
 */
export function hasSecondaryTokens(code) {
  if (!code || typeof code !== 'string') return false;
  return (
    code.includes('text-secondary') ||
    code.includes('bg-secondary') ||
    code.includes('border-secondary') ||
    code.includes('from-secondary') ||
    code.includes('to-secondary') ||
    code.includes('ring-secondary') ||
    code.includes('var(--color-secondary')
  );
}

/**
 * Đoán tông màu hiện tại của section (dựa trên tỷ lệ xuất hiện của primary và secondary)
 */
export function detectSectionTheme(code) {
  if (!code || typeof code !== 'string') return 'primary';

  const primaryCount = (code.match(/(-primary|--color-primary|#fe0000|#ed1c24)/gi) || []).length;
  const secondaryCount = (code.match(/(-secondary|--color-secondary|#2bc412|#229e0e|#0d8626)/gi) || []).length;

  if (secondaryCount > primaryCount) {
    return 'secondary';
  }
  return 'primary';
}

/**
 * Tự động chuyển đổi code dán vào sang hệ màu PRIMARY của Theme:
 * - Thay thế các class màu đỏ/xanh cố định (red-500, red-600, blue-600, indigo-600,...)
 * - Thay thế hex colors (#fe0000, #ed1c24, #dc2626, #0D8626,...)
 * - Thay thế SVG fill/stroke cố định
 * - Thay thế class mockup cũ (.btn-primary, .text-red, .badge-red,...)
 */
export function normalizeColorsToPrimary(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return rawCode;

  let transformed = rawCode;

  // 1. Chuyển đổi các class HTML từ mockup Đại Tây Nam sang Tailwind JSX
  transformed = transformed
    // .text-red -> text-primary
    .replace(/\btext-red\b/g, 'text-primary font-bold')
    .replace(/\bbtn-primary\b/g, 'bg-primary hover:bg-primary-dark text-white font-bold transition shadow-md shadow-primary/25')
    .replace(/\bbtn-secondary\b/g, 'bg-secondary hover:bg-secondary-dark text-white font-bold transition shadow-md shadow-secondary/25')
    .replace(/\bbadge-red\b/g, 'bg-primary/10 text-primary border border-primary/20')
    .replace(/\bbadge-green\b/g, 'bg-secondary/10 text-secondary border border-secondary/20')
    .replace(/\bactive-red\b/g, 'border-primary text-primary font-bold')
    .replace(/\bactive-green\b/g, 'border-secondary text-secondary font-bold');

  // 2. Chuyển đổi các class màu cố định sang primary
  // Nền đỏ/xanh dương -> bg-primary
  transformed = transformed
    .replace(/\bbg-red-([5678]00)\b/g, 'bg-primary')
    .replace(/\bbg-rose-([5678]00)\b/g, 'bg-primary')
    .replace(/\bbg-blue-([67]00)\b/g, 'bg-primary')
    .replace(/\bbg-indigo-([67]00)\b/g, 'bg-primary')
    .replace(/\bbg-red-50\b/g, 'bg-primary/5')
    .replace(/\bbg-red-100\b/g, 'bg-primary/10')
    .replace(/\bbg-red-200\b/g, 'bg-primary/20');

  // Chữ đỏ/xanh dương -> text-primary
  transformed = transformed
    .replace(/\btext-red-([5678]00)\b/g, 'text-primary')
    .replace(/\btext-rose-([5678]00)\b/g, 'text-primary')
    .replace(/\btext-blue-([67]00)\b/g, 'text-primary')
    .replace(/\btext-indigo-([67]00)\b/g, 'text-primary');

  // Viền đỏ/xanh dương -> border-primary
  transformed = transformed
    .replace(/\bborder-red-([5678]00)\b/g, 'border-primary')
    .replace(/\bborder-rose-([5678]00)\b/g, 'border-primary')
    .replace(/\bborder-blue-([67]00)\b/g, 'border-primary')
    .replace(/\bborder-red-100\b/g, 'border-primary/15')
    .replace(/\bborder-red-200\b/g, 'border-primary/25')
    .replace(/\bborder-red-300\b/g, 'border-primary/40');

  // Gradient from/to/via
  transformed = transformed
    .replace(/\bfrom-red-([5678]00)\b/g, 'from-primary')
    .replace(/\bto-red-([5678]00)\b/g, 'to-primary')
    .replace(/\bvia-red-([5678]00)\b/g, 'via-primary')
    .replace(/\bfrom-blue-([67]00)\b/g, 'from-primary')
    .replace(/\bto-blue-([67]00)\b/g, 'to-primary');

  // Ring & Shadow
  transformed = transformed
    .replace(/\bring-red-([5678]00)\b/g, 'ring-primary')
    .replace(/\bshadow-red-500\/([0-9]+)\b/g, 'shadow-primary/$1')
    .replace(/\bshadow-blue-500\/([0-9]+)\b/g, 'shadow-primary/$1');

  // 3. Chuyển đổi mã màu Hex thương hiệu sang token primary
  transformed = transformed
    // Hex màu đỏ Đại Tây Nam / Tailwind Red
    .replace(/#FE0000/gi, 'var(--color-primary, #FE0000)')
    .replace(/#ED1C24/gi, 'var(--color-primary, #FE0000)')
    .replace(/#dc2626/gi, 'var(--color-primary, #FE0000)')
    .replace(/#ef4444/gi, 'var(--color-primary, #FE0000)');

  // 4. Xử lý SVG Fill / Stroke cố định
  // Nếu SVG có fill màu xanh cố định #0D8626 hoặc màu đỏ mà không dùng biến màu:
  transformed = transformed
    .replace(/fill="#0D8626"/gi, 'fill="currentColor" className="text-primary"')
    .replace(/fill="#2BC412"/gi, 'fill="currentColor" className="text-primary"')
    .replace(/fill="#FE0000"/gi, 'fill="currentColor" className="text-primary"')
    .replace(/stroke="#0D8626"/gi, 'stroke="currentColor" className="text-primary"')
    .replace(/stroke="#2BC412"/gi, 'stroke="currentColor" className="text-primary"');

  // 5. Nếu sau các bước trên mà trong toàn bộ code VẪN KHÔNG CÓ BẤT KỲ primary nào:
  if (!hasPrimaryTokens(transformed)) {
    // Tìm các button hoặc link CTA và ép sang bg-primary text-white
    transformed = transformed.replace(
      /(className=["'][^"']*?)\b(bg-(?:slate|gray|zinc|neutral)-900|bg-black)\b([^"']*?["'])/g,
      '$1bg-primary text-white$3'
    );
  }

  return transformed;
}

/**
 * Chuyển đổi tông màu của Section giữa PRIMARY và SECONDARY trực tiếp:
 * @param {string} code - Mã nguồn JSX của section
 * @param {'primary' | 'secondary'} targetTheme - Tông màu muốn chuyển tới
 * @returns {string} Mã nguồn mới với tất cả token màu đã được hoán chuyển
 */
export function switchSectionColorTheme(code, targetTheme = 'primary') {
  if (!code || typeof code !== 'string') return code;

  let result = code;

  if (targetTheme === 'secondary') {
    // CHUYỂN TOÀN BỘ SANG SECONDARY (Màu xanh / Đài Loan / Trust)
    // 1. Tailwind Classes
    result = result
      // text
      .replace(/\btext-primary\b/g, 'text-secondary')
      .replace(/\btext-primary-dark\b/g, 'text-secondary-dark')
      .replace(/\btext-primary-light\b/g, 'text-secondary-light')
      // bg
      .replace(/\bbg-primary\b/g, 'bg-secondary')
      .replace(/\bbg-primary-dark\b/g, 'bg-secondary-dark')
      .replace(/\bbg-primary-light\b/g, 'bg-secondary-light')
      // bg-primary/opacity
      .replace(/\bbg-primary\/([0-9]+)\b/g, 'bg-secondary/$1')
      // border
      .replace(/\bborder-primary\b/g, 'border-secondary')
      .replace(/\bborder-primary\/([0-9]+)\b/g, 'border-secondary/$1')
      // gradients
      .replace(/\bfrom-primary\b/g, 'from-secondary')
      .replace(/\bfrom-primary\/([0-9]+)\b/g, 'from-secondary/$1')
      .replace(/\bto-primary\b/g, 'to-secondary')
      .replace(/\bto-primary\/([0-9]+)\b/g, 'to-secondary/$1')
      .replace(/\bvia-primary\b/g, 'via-secondary')
      .replace(/\bvia-primary\/([0-9]+)\b/g, 'via-secondary/$1')
      // ring & shadow & stroke & fill
      .replace(/\bring-primary\b/g, 'ring-secondary')
      .replace(/\bring-primary\/([0-9]+)\b/g, 'ring-secondary/$1')
      .replace(/\bshadow-primary\b/g, 'shadow-secondary')
      .replace(/\bshadow-primary\/([0-9]+)\b/g, 'shadow-secondary/$1')
      .replace(/\bfill-primary\b/g, 'fill-secondary')
      .replace(/\bstroke-primary\b/g, 'stroke-secondary')
      // Mockup class & buttons
      .replace(/\bbtn-primary\b/g, 'btn-secondary')
      .replace(/\bbadge-red\b/g, 'badge-green')
      .replace(/\bactive-red\b/g, 'active-green')
      // Component ButtonCTA variant
      .replace(/variant=["']primary["']/g, 'variant="secondary"')
      // CSS variables
      .replace(/var\(--color-primary\)/g, 'var(--color-secondary)')
      .replace(/var\(--color-primary-dark\)/g, 'var(--color-secondary-dark)')
      .replace(/var\(--color-primary-light\)/g, 'var(--color-secondary-light)')
      .replace(/var\(--color-primary-glow\)/g, 'var(--color-secondary-glow)')
      // Hex colors
      .replace(/#FE0000/gi, '#2BC412')
      .replace(/#ED1C24/gi, '#2BC412')
      .replace(/#dc2626/gi, '#16a34a')
      .replace(/#ef4444/gi, '#22c55e');

  } else {
    // CHUYỂN TOÀN BỘ SANG PRIMARY (Màu đỏ / Hàn Quốc / Chính)
    // 1. Tailwind Classes
    result = result
      // text
      .replace(/\btext-secondary\b/g, 'text-primary')
      .replace(/\btext-secondary-dark\b/g, 'text-primary-dark')
      .replace(/\btext-secondary-light\b/g, 'text-primary-light')
      // bg
      .replace(/\bbg-secondary\b/g, 'bg-primary')
      .replace(/\bbg-secondary-dark\b/g, 'bg-primary-dark')
      .replace(/\bbg-secondary-light\b/g, 'bg-primary-light')
      // bg-secondary/opacity
      .replace(/\bbg-secondary\/([0-9]+)\b/g, 'bg-primary/$1')
      // border
      .replace(/\bborder-secondary\b/g, 'border-primary')
      .replace(/\bborder-secondary\/([0-9]+)\b/g, 'border-primary/$1')
      // gradients
      .replace(/\bfrom-secondary\b/g, 'from-primary')
      .replace(/\bfrom-secondary\/([0-9]+)\b/g, 'from-primary/$1')
      .replace(/\bto-secondary\b/g, 'to-primary')
      .replace(/\bto-secondary\/([0-9]+)\b/g, 'to-primary/$1')
      .replace(/\bvia-secondary\b/g, 'via-primary')
      .replace(/\bvia-secondary\/([0-9]+)\b/g, 'via-primary/$1')
      // ring & shadow & stroke & fill
      .replace(/\bring-secondary\b/g, 'ring-primary')
      .replace(/\bring-secondary\/([0-9]+)\b/g, 'ring-primary/$1')
      .replace(/\bshadow-secondary\b/g, 'shadow-primary')
      .replace(/\bshadow-secondary\/([0-9]+)\b/g, 'shadow-primary/$1')
      .replace(/\bfill-secondary\b/g, 'fill-primary')
      .replace(/\bstroke-secondary\b/g, 'stroke-primary')
      // Mockup class & buttons
      .replace(/\bbtn-secondary\b/g, 'btn-primary')
      .replace(/\bbadge-green\b/g, 'badge-red')
      .replace(/\bactive-green\b/g, 'active-red')
      // Component ButtonCTA variant
      .replace(/variant=["']secondary["']/g, 'variant="primary"')
      // CSS variables
      .replace(/var\(--color-secondary\)/g, 'var(--color-primary)')
      .replace(/var\(--color-secondary-dark\)/g, 'var(--color-primary-dark)')
      .replace(/var\(--color-secondary-light\)/g, 'var(--color-primary-light)')
      .replace(/var\(--color-secondary-glow\)/g, 'var(--color-primary-glow)')
      // Hex colors (Xanh lá -> Đỏ)
      .replace(/#2BC412/gi, '#FE0000')
      .replace(/#229E0E/gi, '#FE0000')
      .replace(/#0D8626/gi, '#FE0000')
      .replace(/#16a34a/gi, '#dc2626')
      .replace(/#22c55e/gi, '#ef4444');
  }

  return result;
}

/**
 * Hoán đổi giữa 2 màu Primary và Secondary (Swap)
 */
export function toggleSectionColorTheme(code) {
  const current = detectSectionTheme(code);
  const next = current === 'primary' ? 'secondary' : 'primary';
  return {
    code: switchSectionColorTheme(code, next),
    newTheme: next,
  };
}
