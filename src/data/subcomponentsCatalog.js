/**
 * Danh mục các Khối Con / Component Dùng Chung (Sub-components)
 * Dùng để lôi vào bất kỳ Section nào, giúp kiểm soát CSS tập trung 
 * nhưng vẫn tùy biến được text và đích đến của từng nút.
 */
export const SUBCOMPONENTS_CATALOG = [
  {
    id: 'button-cta-primary',
    name: 'Nút CTA Chính (Primary Brand)',
    description: 'Nút bấm nền xanh đậm thương hiệu Tân Sanh Ngữ, hover sang màu vàng hổ phách có mũi tên trượt.',
    category: 'buttons',
    tag: 'Nút Bấm',
    codeSnippet: `<ButtonCTA text="Đăng ký tư vấn ngay" targetSection="tu-van" />`,
    fullSnippet: `import ButtonCTA from './button-cta';\n\n<ButtonCTA text="Đăng ký tư vấn ngay" targetSection="tu-van" />`,
    props: {
      text: 'Đăng ký tư vấn ngay',
      targetSection: 'tu-van',
      variant: 'primary',
    },
  },
  {
    id: 'button-cta-secondary',
    name: 'Nút CTA Nổi Bật (Secondary Gold)',
    description: 'Nút bấm nền vàng rực rỡ, chữ đen đậm, bóng mờ vàng thu hút sự chú ý cực độ.',
    category: 'buttons',
    tag: 'Nút Bấm',
    codeSnippet: `<ButtonCTA text="Giữ ưu đãi giảm 50%" variant="secondary" targetSection="tu-van" />`,
    fullSnippet: `import ButtonCTA from './button-cta';\n\n<ButtonCTA text="Giữ ưu đãi giảm 50%" variant="secondary" targetSection="tu-van" />`,
    props: {
      text: 'Giữ ưu đãi giảm 50%',
      targetSection: 'tu-van',
      variant: 'secondary',
    },
  },
  {
    id: 'button-cta-outline',
    name: 'Nút Viền Trong Suốt (Outline)',
    description: 'Nút viền mảnh 2px trang nhã, thích hợp làm nút phụ bên cạnh nút CTA chính (như Xem Lộ Trình).',
    category: 'buttons',
    tag: 'Nút Bấm',
    codeSnippet: `<ButtonCTA text="Xem chi tiết lộ trình học" variant="outline" targetSection="courses" />`,
    fullSnippet: `import ButtonCTA from './button-cta';\n\n<ButtonCTA text="Xem chi tiết lộ trình học" variant="outline" targetSection="courses" />`,
    props: {
      text: 'Xem chi tiết lộ trình học',
      targetSection: 'courses',
      variant: 'outline',
    },
  },
  {
    id: 'button-cta-glow',
    name: 'Nút Glow Gradient VIP',
    description: 'Nút gradient đa sắc hiện đại với hiệu ứng phát sáng cho các chiến dịch đặc biệt.',
    category: 'buttons',
    tag: 'Nút Bấm',
    codeSnippet: `<ButtonCTA text="Nhận học bổng Online 2026" variant="glow" targetSection="tu-van" size="lg" />`,
    fullSnippet: `import ButtonCTA from './button-cta';\n\n<ButtonCTA text="Nhận học bổng Online 2026" variant="glow" targetSection="tu-van" size="lg" />`,
    props: {
      text: 'Nhận học bổng Online 2026',
      targetSection: 'tu-van',
      variant: 'glow',
      size: 'lg',
    },
  },
  {
    id: 'section-heading-standard',
    name: 'Khối Tiêu Đề Chuẩn (SectionHeading)',
    description: 'Cụm tiêu đề gồm Eyebrow (nhãn nhỏ phía trên), Tiêu đề chính + Highlight vàng, và đoạn mô tả.',
    category: 'headings',
    tag: 'Tiêu Đề',
    codeSnippet: `<SectionHeading eyebrow="LỘ TRÌNH ĐÀO TẠO" title="Chương Trình Học" highlight="Thực Chiến 1:1" desc="Bám sát mục tiêu thực tế của học viên THPT, sinh viên và người đi làm." />`,
    fullSnippet: `import SectionHeading from './section-heading';\n\n<SectionHeading \n  eyebrow="LỘ TRÌNH ĐÀO TẠO" \n  title="Chương Trình Học" \n  highlight="Thực Chiến 1:1" \n  desc="Bám sát mục tiêu thực tế của học viên THPT, sinh viên và người đi làm." \n/>`,
  },
  {
    id: 'badge-pill',
    name: 'Badge Nhãn Cam Kết / Tin Cậy',
    description: 'Nhãn con bo tròn nổi bật thể hiện cam kết đầu ra hoặc số lượng học viên.',
    category: 'badges',
    tag: 'Nhãn Tag',
    codeSnippet: `<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-xs font-bold border border-secondary/30">\n  <span>✨</span>\n  <span>Cam kết đầu ra 100% bằng văn bản</span>\n</span>`,
    fullSnippet: `<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-xs font-bold border border-secondary/30">\n  <span>✨</span>\n  <span>Cam kết đầu ra 100% bằng văn bản</span>\n</span>`,
  },
  {
    id: 'text-with-image-split',
    name: 'Khối Text Trái - Hình Phải (Split 2 Cột)',
    description: 'Bố cục 2 cột kinh điển: bên trái có Tiêu đề, Mô tả, Checklist tích xanh và Nút CTA; bên phải là Khung ảnh minh họa bo tròn hiện đại.',
    category: 'features',
    tag: 'Text + Ảnh',
    codeSnippet: `<TextWithImage eyebrow="PHƯƠNG PHÁP ĐỘC QUYỀN" title="Tự Tin Giao Tiếp & Thi Đạt HSK" highlight="Nhanh Gấp 3 Lần" desc="Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên." buttonText="Nhận Lộ Trình Học 0Đ" imagePosition="right" />`,
    fullSnippet: `import TextWithImage from './TextWithImage';\n\n<TextWithImage \n  eyebrow="PHƯƠNG PHÁP ĐỘC QUYỀN" \n  title="Tự Tin Giao Tiếp & Thi Đạt HSK" \n  highlight="Nhanh Gấp 3 Lần" \n  desc="Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên." \n  buttonText="Nhận Lộ Trình Học 0Đ" \n  imagePosition="right" \n/>`,
    props: {
      eyebrow: 'PHƯƠNG PHÁP ĐỘC QUYỀN',
      title: 'Tự Tin Giao Tiếp & Thi Đạt HSK',
      highlight: 'Nhanh Gấp 3 Lần',
      desc: 'Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1:1.',
      buttonText: 'Nhận Lộ Trình Học 0Đ',
      buttonVariant: 'secondary',
      targetSection: 'tu-van',
      imagePosition: 'right',
      imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    },
  },
];

