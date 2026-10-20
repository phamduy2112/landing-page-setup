/**
 * sectionElementTransform.js
 * Utility hỗ trợ:
 * 1. Quản lý & chỉnh sửa hình ảnh trực tiếp trong Section (trích xuất src, alt, thay ảnh 1-click).
 * 2. Tự động chuyển đổi thẻ <div> thành <a> khi nhập href (và ngược lại khi xóa href).
 * 3. Thư viện ảnh mẫu tuyển chọn chất lượng cao.
 */

// Danh mục ảnh mẫu gợi ý chất lượng cao (Unsplash CDN tốc độ cao)
export const PRESET_IMAGE_SUGGESTIONS = [
  {
    category: 'Lớp Học & Thực Chiến',
    label: 'Lớp học tương tác nhóm nhỏ',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    alt: 'Lớp học tương tác thực chiến',
  },
  {
    category: 'Lớp Học & Thực Chiến',
    label: 'Sinh viên thảo luận sôi nổi',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    alt: 'Học viên thảo luận bài học',
  },
  {
    category: 'Giảng Viên & Chuyên Gia',
    label: 'Giảng viên chuyên môn cao',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    alt: 'Giảng viên ngoại ngữ chuyên nghiệp',
  },
  {
    category: 'Giảng Viên & Chuyên Gia',
    label: 'Thầy giáo bản ngữ hướng dẫn 1:1',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    alt: 'Giảng viên chỉnh sửa phát âm 1 kèm 1',
  },
  {
    category: 'Thành Tích & Chứng Chỉ',
    label: 'Học viên đạt chứng chỉ HSK',
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
    alt: 'Học viên nhận chứng chỉ tốt nghiệp',
  },
  {
    category: 'Học Trực Tuyến & E-Learning',
    label: 'Học viên học online với laptop',
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    alt: 'Góc học tập online tiện lợi',
  },
];

/**
 * 1. Trích xuất toàn bộ hình ảnh trong code JSX của section và dữ liệu customData
 */
export function extractSectionImages(code = '', customData = {}, extraBlocks = []) {
  const images = [];
  const seenSrc = new Set();

  if (!code && typeof code !== 'string') return images;

  // 1. Trích xuất thẻ <img ... />
  const imgRegex = /<img\b([^>]*?)\/?>/gi;
  let match;
  while ((match = imgRegex.exec(code)) !== null) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/i);
    const altMatch = attrs.match(/alt=(?:["']([^"']*)["']|\{["']([^"']*)["']\})/i);

    const src = srcMatch ? (srcMatch[1] || srcMatch[2] || '').trim() : '';
    const alt = altMatch ? (altMatch[1] || altMatch[2] || '').trim() : '';

    if (src && !seenSrc.has(src)) {
      seenSrc.add(src);
      images.push({
        id: `img-tag-${images.length}`,
        type: 'tag',
        src,
        alt: alt || 'Hình ảnh section',
        label: alt ? `Ảnh: ${alt}` : `Ảnh thẻ <img> #${images.length + 1}`,
        rawSnippet: match[0],
      });
    }
  }

  // 2. Trích xuất trong các khối bổ sung extraBlocks (ví dụ: type 'image', 'split-text-image')
  if (Array.isArray(extraBlocks)) {
    extraBlocks.forEach((b, idx) => {
      const bSrc = b.props?.src || b.props?.imageSrc;
      if (bSrc && !seenSrc.has(bSrc)) {
        seenSrc.add(bSrc);
        images.push({
          id: `extra-img-${b.id || idx}`,
          type: 'extra-block',
          blockId: b.id,
          src: bSrc,
          alt: b.props?.alt || b.title || 'Hình ảnh khối con',
          label: `${b.title || 'Khối Ảnh'}: ${b.props?.alt || 'Hình ảnh'}`,
        });
      }
    });
  }

  // 3. Trích xuất các thuộc tính ảnh trong customData
  if (customData && typeof customData === 'object') {
    Object.entries(customData).forEach(([key, val]) => {
      if (
        typeof val === 'string' &&
        (val.startsWith('http') || val.startsWith('./') || val.startsWith('/')) &&
        (val.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?.*)?$/i) || key.toLowerCase().includes('image') || key.toLowerCase().includes('src') || key.toLowerCase().includes('avatar'))
      ) {
        if (!seenSrc.has(val)) {
          seenSrc.add(val);
          images.push({
            id: `data-img-${key}`,
            type: 'data',
            dataKey: key,
            src: val,
            alt: key,
            label: `Dữ liệu ảnh [${key}]`,
          });
        }
      }
    });
  }

  return images;
}

/**
 * 2. Thay thế URL hình ảnh trực tiếp trong mã JSX
 */
export function replaceImageInCode(code = '', oldSrc = '', newSrc = '', newAlt = null) {
  if (!code || !oldSrc || !newSrc) return code;

  let updatedCode = code.replaceAll(oldSrc, newSrc);

  if (newAlt !== null && typeof newAlt === 'string') {
    // Nếu có alt mới, tìm và thay thế alt đi kèm ảnh
    const escapedOldSrc = escapeRegex(newSrc);
    const regex = new RegExp(`(<img\\b[^>]*?src=["']${escapedOldSrc}["'][^>]*?alt=["'])([^"']*?)(["'])`, 'i');
    if (regex.test(updatedCode)) {
      updatedCode = updatedCode.replace(regex, `$1${newAlt}$3`);
    }
  }

  return updatedCode;
}

/**
 * 3. Quét tất cả các thẻ container (div / a) có thể nhận Href hoặc đã có Href
 */
export function scanLinkableContainers(code = '') {
  if (!code || typeof code !== 'string') return [];

  const items = [];
  // Tìm các thẻ <a> đã có href
  const aRegex = /<a\b([^>]*?)href=(?:["']([^"']*)["']|\{["']([^"']*)["']\})([^>]*?)>([\s\S]*?)<\/a>/gi;
  let match;
  let idx = 0;

  while ((match = aRegex.exec(code)) !== null) {
    const attrsBefore = match[1];
    const href = (match[2] || match[3] || '').trim();
    const attrsAfter = match[4];
    const innerHtml = match[5];

    // Trích xuất tiêu đề hoặc text ngắn bên trong thẻ
    const textPreview = innerHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 36);

    items.push({
      id: `linkable-a-${idx++}`,
      currentTag: 'a',
      href: href || '',
      label: textPreview ? `Link: "${textPreview}"` : `Thẻ Link <a> #${idx}`,
      rawOpening: `<a${attrsBefore}href="${href}"${attrsAfter}>`,
      rawFull: match[0],
      textPreview: textPreview || '(Nút / Thẻ liên kết)',
      startIndex: match.index,
    });
  }

  // Tìm các thẻ <div className="..."> tiêu biểu (như card, button, banner)
  const divRegex = /<div\b([^>]*?(?:className=["'][^"']*(?:card|btn|button|item|box|banner|link|group|p-|rounded)[^"']*["'])[^>]*?)>([\s\S]*?)<\/div>/gi;
  let divMatch;
  let dIdx = 0;

  while ((divMatch = divRegex.exec(code)) !== null) {
    const divAttrs = divMatch[1];
    const divInner = divMatch[2];

    // Bỏ qua nếu là container quá to (chứa toàn bộ section hoặc grid tổng)
    if (divAttrs.includes('max-w-7xl') || divAttrs.includes('grid lg:grid-cols') || divAttrs.includes('container')) {
      continue;
    }

    const textPreview = divInner
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 36);

    // Kiểm tra xem thẻ div này có thuộc tính href nào không
    const hrefMatch = divAttrs.match(/href=(?:["']([^"']*)["']|\{["']([^"']*)["']\})/i);
    const existingHref = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || '').trim() : '';

    items.push({
      id: `linkable-div-${dIdx++}`,
      currentTag: existingHref ? 'div (có href)' : 'div',
      href: existingHref,
      label: textPreview ? `Khối: "${textPreview}"` : `Khối <div> #${dIdx}`,
      rawOpening: `<div${divAttrs}>`,
      rawFull: divMatch[0],
      textPreview: textPreview || '(Khối giao diện)',
      startIndex: divMatch.index,
    });

    if (items.length >= 25) break; // Giới hạn số lượng thẻ trực quan nhất
  }

  return items;
}

/**
 * 4. Tự động chuyển đổi thẻ <div> thành <a> khi nhập Href (và ngược lại khi xóa Href)
 * Sử dụng thuật toán cân bằng độ sâu (depth-counting balance) để đóng đúng thẻ </a> tương ứng.
 */
export function convertDivToAnchorWithHref(code = '', rawOpeningTag = '', newHref = '') {
  if (!code || !rawOpeningTag) return code;

  const targetHref = (newHref || '').trim();
  const isTargetingAnchor = targetHref.length > 0;

  // 1. Nếu rawOpeningTag là <div> và người dùng nhập Href -> Đổi <div> thành <a href="...">
  if (rawOpeningTag.startsWith('<div')) {
    if (!isTargetingAnchor) return code; // Vẫn là div nếu không có href

    // Tạo thẻ mở <a> mới giữ nguyên tất cả className, id, style, onClick,...
    let newOpeningTag = rawOpeningTag.replace(/^<div\b/, '<a');
    // Nếu trong thẻ mở cũ chưa có href, thêm href vào
    if (!/href=/i.test(newOpeningTag)) {
      newOpeningTag = newOpeningTag.replace(/^<a\b/, `<a href="${targetHref}"`);
    } else {
      newOpeningTag = newOpeningTag.replace(/href=(?:["'][^"']*["']|\{[^}]*\})/i, `href="${targetHref}"`);
    }

    // Thay thế thẻ mở và tìm đúng thẻ đóng </div> tương ứng
    return replaceOpenAndMatchingCloseTag(code, rawOpeningTag, newOpeningTag, 'div', 'a');
  }

  // 2. Nếu rawOpeningTag là <a> và người dùng xóa sạch Href -> Chuyển về <div>
  if (rawOpeningTag.startsWith('<a')) {
    if (!isTargetingAnchor) {
      // Xóa thuộc tính href và đổi <a thành <div
      let newOpeningTag = rawOpeningTag
        .replace(/^<a\b/, '<div')
        .replace(/\s*href=(?:["'][^"']*["']|\{[^}]*\})/i, '');

      return replaceOpenAndMatchingCloseTag(code, rawOpeningTag, newOpeningTag, 'a', 'div');
    } else {
      // Vẫn là <a>, cập nhật lại giá trị href mới
      let newOpeningTag = rawOpeningTag;
      if (/href=/i.test(newOpeningTag)) {
        newOpeningTag = newOpeningTag.replace(/href=(?:["'][^"']*["']|\{[^}]*\})/i, `href="${targetHref}"`);
      } else {
        newOpeningTag = newOpeningTag.replace(/^<a\b/, `<a href="${targetHref}"`);
      }
      return code.replace(rawOpeningTag, newOpeningTag);
    }
  }

  return code;
}

/**
 * 5. Tự động chuyển tất cả các thẻ <div ... href="..." ...> thành <a ... href="..." ...>
 * Chạy quét toàn diện để sửa tự động mọi đoạn code mà người dùng gán href vào div.
 */
export function autoConvertDivsWithHrefInJsx(rawCode = '') {
  if (!rawCode || typeof rawCode !== 'string' || !rawCode.includes('href=')) {
    return rawCode;
  }

  let code = rawCode;
  let hasMore = true;
  let iterations = 0;

  // Lặp tìm từng thẻ <div ... href="..." ...>
  while (hasMore && iterations < 30) {
    iterations++;
    const match = code.match(/<div\b([^>]*?\bhref=(?:["'][^"']*["']|\{[^}]*\})[^>]*?)>/i);
    if (!match) {
      hasMore = false;
      break;
    }

    const fullOpening = match[0];
    const innerAttrs = match[1];
    const newOpening = `<a${innerAttrs}>`;

    const nextCode = replaceOpenAndMatchingCloseTag(code, fullOpening, newOpening, 'div', 'a');
    if (nextCode === code) {
      // Không đổi được (ví dụ thẻ tự đóng), thay tạm thẻ mở
      code = code.replace(fullOpening, newOpening);
    } else {
      code = nextCode;
    }
  }

  return code;
}

/**
 * Thuật toán tìm thẻ mở và thẻ đóng tương ứng dựa trên Depth Balance
 */
function replaceOpenAndMatchingCloseTag(code, oldOpening, newOpening, oldTagName, newTagName) {
  const startIndex = code.indexOf(oldOpening);
  if (startIndex === -1) return code;

  const afterOpeningIndex = startIndex + oldOpening.length;
  const restCode = code.slice(afterOpeningIndex);

  // Tìm thẻ đóng tương ứng
  const openTagPattern = new RegExp(`<${oldTagName}\\b[^>]*?(?:\\/)?\\s*>`, 'gi');
  const closeTagPattern = new RegExp(`</${oldTagName}\\s*>`, 'gi');

  let depth = 1;
  let closeTagStartInRest = -1;
  let closeTagEndInRest = -1;

  // Tìm tất cả các vị trí thẻ mở/đóng trong đoạn còn lại
  const events = [];

  let m;
  while ((m = openTagPattern.exec(restCode)) !== null) {
    // Bỏ qua nếu là tự đóng <div ... />
    if (!m[0].endsWith('/>')) {
      events.push({ type: 'open', index: m.index, length: m[0].length });
    }
  }
  while ((m = closeTagPattern.exec(restCode)) !== null) {
    events.push({ type: 'close', index: m.index, length: m[0].length });
  }

  // Sắp xếp các sự kiện theo thứ tự xuất hiện
  events.sort((a, b) => a.index - b.index);

  for (const ev of events) {
    if (ev.type === 'open') {
      depth++;
    } else if (ev.type === 'close') {
      depth--;
      if (depth === 0) {
        closeTagStartInRest = ev.index;
        closeTagEndInRest = ev.index + ev.length;
        break;
      }
    }
  }

  if (closeTagStartInRest !== -1) {
    // Thay thế cả thẻ mở và thẻ đóng
    const beforeOpen = code.slice(0, startIndex);
    const contentBetween = restCode.slice(0, closeTagStartInRest);
    const afterClose = restCode.slice(closeTagEndInRest);

    return `${beforeOpen}${newOpening}${contentBetween}</${newTagName}>${afterClose}`;
  } else {
    // Fallback: chỉ thay thẻ mở
    return code.replace(oldOpening, newOpening);
  }
}

function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
