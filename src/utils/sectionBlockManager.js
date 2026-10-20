/**
 * sectionBlockManager.js:
 * Core utility for managing Section Sub-components (Blocks),
 * Reordering blocks (Move Up/Down), Column Layout Flip (Image Left <-> Right),
 * Adding new sub-components, deleting/hiding sub-components,
 * and generating live CSS and clean React JSX code.
 */

import { getSectionSourceCode } from '../data/sectionsRawCode';

// Default metadata schema for standard education landing page blocks
export const BLOCK_META_MAP = {
  badgeText: {
    id: 'badgeText',
    type: 'badge',
    label: 'Huy Hiệu / Badge Nổi Bật',
    tag: 'Badge',
    iconName: 'Sparkles',
    selector: '[class*="rounded-full"], .badge-wrapper, [class*="inline-flex"][class*="border"]',
  },
  title: {
    id: 'title',
    type: 'heading',
    label: 'Tiêu Đề Chính (Headline)',
    tag: 'Tiêu Đề',
    iconName: 'Heading',
    selector: 'h1, h2, [class*="font-heading"]',
  },
  subtitle: {
    id: 'subtitle',
    type: 'text',
    label: 'Đoạn Văn Mô Tả (Subtitle)',
    tag: 'Mô Tả',
    iconName: 'FileText',
    selector: 'p:not([class*="font-bold"]):not([class*="font-medium"])',
  },
  ctaPrimary: {
    id: 'ctaPrimary',
    type: 'button',
    label: 'Nút Bấm Chính (CTA Primary)',
    tag: 'Nút Bấm',
    iconName: 'Sliders',
    selector: 'a[href*="#"]:first-of-type, .cta-primary, [class*="bg-secondary"]',
  },
  ctaSecondary: {
    id: 'ctaSecondary',
    type: 'button',
    label: 'Nút Bấm Phụ (CTA Secondary)',
    tag: 'Nút Bấm',
    iconName: 'Sliders',
    selector: 'a[href*="#"]:last-of-type, .cta-secondary, [class*="border-slate-200"]',
  },
  ctaGroup: {
    id: 'ctaGroup',
    type: 'button-group',
    label: 'Cụm Nút Bấm Hành Động',
    tag: 'Cụm Nút',
    iconName: 'Sliders',
    selector: '[class*="sm:flex-row"], .cta-group',
  },
  guarantees: {
    id: 'guarantees',
    type: 'guarantees',
    label: 'Cam Kết & Tin Cậy (Trust Badges)',
    tag: 'Cam Kết',
    iconName: 'ShieldCheck',
    selector: '[class*="gap-x-6"], [class*="text-slate-600 font-medium"]',
  },
  stats: {
    id: 'stats',
    type: 'stats',
    label: 'Con Số Thống Kê (Stats Bar)',
    tag: 'Thống Kê',
    iconName: 'BarChart2',
    selector: '[class*="grid-cols-3"], [class*="border-t border-slate-200"]',
  },
  media: {
    id: 'media',
    type: 'media',
    label: 'Khung Hình Ảnh / Video Minh Họa',
    tag: 'Hình Ảnh',
    iconName: 'Image',
    selector: '[class*="lg:col-span-5"], [class*="lg:col-span-4"], .media-container',
  },
};

// Available addable blocks library
export const ADDABLE_BLOCK_TEMPLATES = [
  {
    type: 'split-text-image',
    title: 'Khối Text Trái - Hình Phải (2 Cột)',
    description: 'Bố cục 2 cột: Tiêu đề + Mô tả + Checklist + Nút CTA bên trái, Hình ảnh bên phải (có thể đảo chiều)',
    defaultProps: {
      eyebrow: 'PHƯƠNG PHÁP ĐỘC QUYỀN',
      title: 'Tự Tin Giao Tiếp & Thi Đạt HSK',
      highlight: 'Nhanh Gấp 3 Lần',
      desc: 'Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1:1.',
      bullets: [
        'Chỉnh sửa phát âm trực tiếp 1:1 cùng giảng viên bản ngữ & chuyên gia',
        'Thực hành các tình huống đàm phán, thương mại và du học thực tế',
        'Cam kết chuẩn đầu ra bằng văn bản đào tạo minh bạch',
      ],
      buttonText: 'Nhận Lộ Trình Học 0Đ',
      buttonVariant: 'secondary',
      targetSection: 'tu-van',
      imagePosition: 'right',
      imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      imageAlt: 'Lớp học tương tác thực chiến',
      imageBadge: 'Cam kết đầu ra 100% bằng văn bản',
    },
  },
  {
    type: 'heading',
    title: 'Khối Tiêu Đề Chuẩn (SectionHeading)',
    description: 'Eyebrow + Tiêu đề chính + Highlight vàng + Đoạn mô tả',
    defaultProps: {
      eyebrow: 'LỘ TRÌNH ĐÀO TẠO',
      title: 'Chương Trình Học',
      highlight: 'Thực Chiến 1:1',
      desc: 'Bám sát mục tiêu thực tế của học viên THPT, sinh viên và người đi làm.',
    },
  },
  {
    type: 'button',
    title: 'Nút Bấm CTA Mới (ButtonCTA)',
    description: 'Thêm nút đăng ký, liên hệ hoặc tư vấn với màu sắc tùy chọn',
    defaultProps: {
      text: 'Đăng Ký Tư Vấn Ngay',
      variant: 'secondary',
      targetSection: 'tu-van',
      size: 'md',
    },
  },
  {
    type: 'badge',
    title: 'Huy Hiệu / Tag Nổi Bật',
    description: 'Nhãn cam kết hoàn tiền hoặc ưu đãi khóa học',
    defaultProps: {
      text: '✨ Ưu Đãi Độc Quyền Tháng Này: Giảm 50% Học Phí',
    },
  },
  {
    type: 'text',
    title: 'Đoạn Văn Bản / Ghi Chú Phụ',
    description: 'Đoạn ghi chú hoặc thông báo ngắn dưới nút bấm',
    defaultProps: {
      text: '⚡ Hỗ trợ trả góp 0% lãi suất. Cam kết đậu chứng chỉ bằng văn bản.',
    },
  },
  {
    type: 'stat',
    title: 'Con Số Thống Kê (Stat Counter)',
    description: 'Thẻ số liệu ấn tượng (Ví dụ: 15.000+ Học viên tốt nghiệp)',
    defaultProps: {
      number: '15.000+',
      label: 'Học viên đã tốt nghiệp',
    },
  },
  {
    type: 'highlight',
    title: 'Dòng Cam Kết Có Tích Xanh',
    description: 'Cam kết chất lượng hoặc ưu đãi kèm icon tích xanh',
    defaultProps: {
      text: 'Cam kết hoàn tiền 100% nếu không đạt mục tiêu đầu ra',
    },
  },
  {
    type: 'image',
    title: 'Hình Ảnh Minh Họa',
    description: 'Hình ảnh học viên hoặc banner phụ',
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      alt: 'Hình ảnh học viên',
    },
  },
];

/**
 * Generate scoped CSS rules for Section layout flip and block reordering
 */
export function generateBlockCssRules(wrapperId, layoutSettings = {}) {
  const {
    columnFlip = 'default',
    blocksOrder = [],
    deletedBlocks = [],
  } = layoutSettings;

  let css = '';

  // 1. Column Flip (Image Left <-> Image Right)
  if (columnFlip === 'image-left') {
    css += `
      #${wrapperId} .grid > div:first-child,
      #${wrapperId} [class*="lg:col-span-7"],
      #${wrapperId} [class*="lg:col-span-8"],
      #${wrapperId} [class*="lg:col-span-6"]:first-child {
        order: 2 !important;
      }
      #${wrapperId} .grid > div:last-child,
      #${wrapperId} [class*="lg:col-span-5"],
      #${wrapperId} [class*="lg:col-span-4"],
      #${wrapperId} [class*="lg:col-span-6"]:last-child {
        order: 1 !important;
      }
    `;
  } else if (columnFlip === 'image-right') {
    css += `
      #${wrapperId} .grid > div:first-child,
      #${wrapperId} [class*="lg:col-span-7"],
      #${wrapperId} [class*="lg:col-span-8"] {
        order: 1 !important;
      }
      #${wrapperId} .grid > div:last-child,
      #${wrapperId} [class*="lg:col-span-5"],
      #${wrapperId} [class*="lg:col-span-4"] {
        order: 2 !important;
      }
    `;
  } else if (columnFlip === 'stacked-center') {
    css += `
      #${wrapperId} .grid {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
      }
      #${wrapperId} .grid > div {
        width: 100% !important;
        max-width: 768px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    `;
  }

  // 2. Block Reordering (Flex Order inside Text Column)
  if (Array.isArray(blocksOrder) && blocksOrder.length > 0) {
    css += `
      #${wrapperId} [class*="lg:col-span-7"],
      #${wrapperId} [class*="space-y-6"],
      #${wrapperId} [class*="space-y-8"] {
        display: flex !important;
        flex-direction: column !important;
      }
    `;

    blocksOrder.forEach((blockKey, idx) => {
      const meta = BLOCK_META_MAP[blockKey];
      const selector = meta?.selector;
      if (selector) {
        css += `
          #${wrapperId} ${selector} {
            order: ${idx + 1} !important;
          }
        `;
      }
      // Also apply for custom data-block-id
      css += `
        #${wrapperId} [data-block-id="${blockKey}"] {
          order: ${idx + 1} !important;
        }
      `;
    });
  }

  // 3. Deleted / Hidden Blocks
  if (Array.isArray(deletedBlocks) && deletedBlocks.length > 0) {
    deletedBlocks.forEach((key) => {
      const meta = BLOCK_META_MAP[key];
      if (meta?.selector) {
        css += `
          #${wrapperId} ${meta.selector} {
            display: none !important;
          }
        `;
      }
      css += `
        #${wrapperId} [data-block-id="${key}"] {
          display: none !important;
        }
      `;
    });
  }

  return css;
}

/**
 * Reorder array elements
 */
export function reorderArray(list, fromIndex, toIndex) {
  if (!Array.isArray(list)) return [];
  if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
    return list;
  }
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Generate clean updated JSX source code reflecting column flips,
 * reordered blocks, deleted blocks, and newly added extra blocks.
 */
export function generateUpdatedSectionJsx(item, layoutSettings = {}) {
  const originalCode = item.customCode || getSectionSourceCode(item) || '';
  if (!originalCode) return originalCode;

  let code = originalCode;
  const { columnFlip, deletedBlocks = [], extraBlocks = [] } = layoutSettings;

  // 1. Apply Column Flip to JSX Code
  if (columnFlip === 'image-left') {
    // Add order-first to the second column or order-last to the first column
    if (code.includes('lg:col-span-5') && !code.includes('lg:col-span-5 order-first')) {
      code = code.replace(/lg:col-span-5\b/g, 'lg:col-span-5 order-first');
    }
  } else if (columnFlip === 'image-right') {
    // Restore default
    code = code.replace(/lg:col-span-5 order-first\b/g, 'lg:col-span-5');
  }

  // 2. Remove Deleted Blocks from JSX
  if (Array.isArray(deletedBlocks) && deletedBlocks.length > 0) {
    deletedBlocks.forEach((key) => {
      const val = item.customData?.[key];
      if (val && typeof val === 'string' && code.includes(val)) {
        // Comment out or remove the enclosing element
        const reg = new RegExp(`(<[^>]+>\\s*(\\{)?.*${escapeRegex(val)}.*(\\})?\\s*<\\/[^>]+>)`, 'g');
        if (reg.test(code)) {
          code = code.replace(reg, `{/* Khối [${key}] đã ẩn */}`);
        }
      }
    });
  }

  // 3. Inject Extra Blocks into JSX
  if (Array.isArray(extraBlocks) && extraBlocks.length > 0) {
    const extraJsxItems = extraBlocks.map((b) => {
      if (b.type === 'split-text-image' || b.type === 'text-with-image') {
        const bulletsJson = JSON.stringify(b.props?.bullets || [
          'Chỉnh sửa phát âm trực tiếp 1:1 cùng giảng viên bản ngữ & chuyên gia',
          'Thực hành các tình huống đàm phán, thương mại và du học thực tế',
          'Cam kết chuẩn đầu ra bằng văn bản đào tạo minh bạch',
        ]);
        return `          <TextWithImage 
            eyebrow="${b.props?.eyebrow || 'PHƯƠNG PHÁP ĐỘC QUYỀN'}" 
            title="${b.props?.title || 'Tự Tin Giao Tiếp & Thi Đạt HSK'}" 
            highlight="${b.props?.highlight || 'Nhanh Gấp 3 Lần'}" 
            desc="${b.props?.desc || 'Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1:1.'}" 
            bullets={${bulletsJson}}
            buttonText="${b.props?.buttonText || 'Nhận Lộ Trình Học 0Đ'}"
            buttonVariant="${b.props?.buttonVariant || 'secondary'}"
            targetSection="${b.props?.targetSection || 'tu-van'}"
            imagePosition="${b.props?.imagePosition || 'right'}"
            imageSrc="${b.props?.imageSrc || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80'}"
            imageBadge="${b.props?.imageBadge || 'Cam kết đầu ra 100% bằng văn bản'}"
          />`;
      }
      if (b.type === 'heading') {
        return `          <SectionHeading eyebrow="${b.props?.eyebrow || 'LỘ TRÌNH ĐÀO TẠO'}" title="${b.props?.title || 'Chương Trình Học'}" highlight="${b.props?.highlight || 'Thực Chiến 1:1'}" desc="${b.props?.desc || 'Bám sát mục tiêu thực tế của học viên.'}" />`;
      }
      if (b.type === 'button') {
        return `          <ButtonCTA text="${b.props?.text || 'Bấm Vào Đây'}" variant="${b.props?.variant || 'secondary'}" targetSection="${b.props?.targetSection || 'tu-van'}" />`;
      }
      if (b.type === 'badge') {
        return `          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 text-primary text-xs font-bold border border-secondary/30">\n            <span>${b.props?.text || 'Huy Hiệu Mới'}</span>\n          </div>`;
      }
      if (b.type === 'text') {
        return `          <p className="text-xs sm:text-sm text-slate-600 font-medium py-1">\n            ${b.props?.text || 'Ghi chú bổ sung'}\n          </p>`;
      }
      if (b.type === 'stat') {
        return `          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-block">\n            <div className="font-heading font-black text-2xl text-primary">${b.props?.number || '100%'}</div>\n            <div className="text-xs text-slate-500">${b.props?.label || 'Chỉ số mới'}</div>\n          </div>`;
      }
      if (b.type === 'highlight') {
        return `          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">\n            <span className="text-emerald-500 font-bold">✓</span>\n            <span>${b.props?.text || 'Cam kết chất lượng'}</span>\n          </div>`;
      }
      if (b.type === 'image') {
        return `          <img src="${b.props?.src || ''}" alt="${b.props?.alt || 'Hình ảnh'}" className="rounded-2xl shadow-md max-w-full my-3" />`;
      }
      if (b.codeSnippet) {
        return `          ${b.codeSnippet}`;
      }
      return '';
    }).filter(Boolean);

    if (extraJsxItems.length > 0) {
      if (code.includes('space-y-6') || code.includes('space-y-4')) {
        // Multi-component section container: replace its children with the current components
        code = code.replace(
          /(<div className="[^"]*space-y-[468][^"]*">)([\s\S]*?)(<\/div>\s*<\/section>)/,
          `$1\n${extraJsxItems.join('\n')}\n      $3`
        );
      } else if (code.includes('</ButtonCTA>') || code.includes('href="#register"')) {
        code = code.replace(
          /(<div className="pt-2 flex[^\n]*>)/,
          `$1\n${extraJsxItems.join('\n')}`
        );
      } else if (code.includes('lg:col-span-7')) {
        code = code.replace(
          /(<\/div>\s*<\/div>\s*<\/?div class(?:Name)?="lg:col-span-5")/,
          `\n          {/* Các khối con bổ sung mới */}\n${extraJsxItems.join('\n')}\n$1`
        );
      } else if (code.includes('</section>')) {
        code = code.replace(
          /(<\/section>)/,
          `  <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-3">\n${extraJsxItems.join('\n')}\n  </div>\n$1`
        );
      }
    }
  }

  return code;
}

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
