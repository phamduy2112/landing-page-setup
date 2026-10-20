import HeaderTanSanhNgu from '../components/sections/HeaderTanSanhNgu';
import HeaderSection from '../components/sections/HeaderSection';
import HeroStandard from '../components/sections/HeroStandard';
import HeroSplitVideo from '../components/sections/HeroSplitVideo';
import NeedsCategorized from '../components/sections/NeedsCategorized';
import WhyUsComparison from '../components/sections/WhyUsComparison';
import CoursesGrid from '../components/sections/CoursesGrid';
import RoadmapTimeline from '../components/sections/RoadmapTimeline';
import OpeningScheduleTable from '../components/sections/OpeningScheduleTable';
import TeachersSlider from '../components/sections/TeachersSlider';
import FeedbackSlider from '../components/sections/FeedbackSlider';
import FaqAccordion from '../components/sections/FaqAccordion';
import ConsultationForm from '../components/sections/ConsultationForm';
import FloatingContact from '../components/sections/FloatingContact';
import FooterSection from '../components/sections/FooterSection';
import FeatureSplitSection from '../components/sections/FeatureSplitSection';

export const SECTION_CATEGORIES = [
  { id: 'all', name: 'Tất cả Section' },
  { id: 'header', name: 'Header & Navbar' },
  { id: 'hero', name: 'Hero Banners' },
  { id: 'needs', name: 'Nhu Cầu & Nỗi Đau' },
  { id: 'why', name: 'Tại Sao Chọn & Điểm Mạnh' },
  { id: 'courses', name: 'Khóa Học & Bảng Giá' },
  { id: 'roadmap', name: 'Lộ Trình & Phương Pháp' },
  { id: 'schedule', name: 'Lịch Khai Giảng' },
  { id: 'teachers', name: 'Giảng Viên' },
  { id: 'feedback', name: 'Đánh Giá & Review' },
  { id: 'faq', name: 'Hỏi Đáp (FAQ)' },
  { id: 'form', name: 'Form Tư Vấn (Lead)' },
  { id: 'footer', name: 'Footer & Liên Hệ' },
];

export const SECTIONS_CATALOG = [
  {
    id: 'header-tan-sanh-ngu',
    name: 'Header Tân Sanh Ngữ (Thực Tế)',
    category: 'header',
    source: 'tan-sanh-ngu-landing/Header.jsx',
    badge: 'Chuẩn File JSX',
    description: 'Header thực tế từ file Header.jsx, có logo Tân Sanh Ngữ, menu điều hướng và mobile menu mở xổ.',
    component: HeaderTanSanhNgu,
    fileName: 'HeaderTanSanhNgu.jsx',
    defaultData: {},
  },
  {
    id: 'header-standard',
    name: 'Header Navbar Cao Cấp',
    category: 'header',
    source: 'Tấn Sanh Ngữ & Duo Center',
    badge: 'Navbar Dính (Sticky)',
    description: 'Logo thương hiệu, menu điều hướng đa điểm, hotline nhấp nháy và nút đăng ký tư vấn.',
    component: HeaderSection,
    fileName: 'HeaderSection.jsx',
    defaultData: {
      brandName: 'TẤN SANH NGỮ',
      brandSlogan: 'Học Viện Ngoại Ngữ Chuyên Sâu',
      hotline: '0988.123.456',
    }
  },
  {
    id: 'hero-standard',
    name: 'Hero Banner Chuẩn Quốc Tế',
    category: 'hero',
    source: 'Tấn Sanh Ngữ (tan-sanh-ngu-landing)',
    badge: 'Chuyển Đổi Cao',
    description: 'Badge chứng nhận, H1 nổi bật, 2 nút CTA, thanh con số thống kê (10k+ học viên, 98% đỗ) và card ảnh học viên.',
    component: HeroStandard,
    fileName: 'HeroStandard.jsx',
    defaultData: {
      badgeText: '⭐ Top 1 Học Viện Ngoại Ngữ Ứng Dụng Thực Chiến',
      title: 'Làm Chủ Tiếng Trung Giao Tiếp & Thi Đạt HSK Sau 3 Tháng',
      subtitle: 'Phương pháp phản xạ đa giác quan độc quyền giúp người bận rộn nói lưu loát, tự tin phỏng vấn việc làm và du học mà không cần học vẹt.',
      ctaPrimary: 'Nhận Lộ Trình & Học Thử 0Đ',
      ctaSecondary: 'Xem Lịch Khai Giảng Mới Nhất',
    }
  },
  {
    id: 'hero-split-video',
    name: 'Hero Chia Đôi Kèm Form & Video',
    category: 'hero',
    source: 'Duo Center & Edu Việt (Luyện thi chứng chỉ)',
    badge: 'Chốt Lead Nhanh',
    description: 'Khung video lớp học thực tế 3 phút bên trái và form thu thập thông tin trực tiếp bên phải.',
    component: HeroSplitVideo,
    fileName: 'HeroSplitVideo.jsx',
    defaultData: {
      title: 'Luyện Thi Chứng Chỉ Quốc Tế & Bứt Phá Điểm Số Trong 60 Ngày',
      subtitle: 'Lộ trình cá nhân hóa 1 kèm 1 và nhóm nhỏ dưới 8 học viên. Cam kết hoàn tiền 100% nếu không đạt band mục tiêu.',
    }
  },
  {
    id: 'needs-categorized',
    name: 'Phân Loại Đối Tượng & Nỗi Đau',
    category: 'needs',
    source: 'Tấn Sanh Ngữ (Needs.jsx) & Ươm Mầm',
    badge: 'Tabs Tương Tác',
    description: 'Tabs phân loại theo nhóm đối tượng: Người đi làm, Mất gốc, Luyện thi HSK, Du học kèm giải pháp chi tiết.',
    component: NeedsCategorized,
    fileName: 'NeedsCategorized.jsx',
    defaultData: {
      title: 'Khóa Học Thiết Kế Chuyên Biệt Theo Đúng Mục Tiêu Của Bạn',
      subtitle: 'Không áp dụng một giáo trình đại trà cho tất cả. Mỗi đối tượng học viên có quỹ thời gian và lộ trình riêng.',
    }
  },
  {
    id: 'why-us-comparison',
    name: 'Bảng So Sánh Lợi Thế Vượt Trội',
    category: 'why',
    source: 'Tấn Sanh Ngữ (Why.jsx) & Edu Việt',
    badge: 'Tạo Niềm Tin',
    description: 'Bảng so sánh 5 tiêu chí: Tại trung tâm chúng tôi vs Tự học / Trung tâm thông thường + 3 trụ cột giá trị.',
    component: WhyUsComparison,
    fileName: 'WhyUsComparison.jsx',
    defaultData: {
      title: 'Tại Sao Hơn 10.000 Học Viên Lựa Chọn Chúng Tôi?',
      subtitle: 'Sự khác biệt vượt trội về phương pháp giảng dạy, hỗ trợ tận tâm và cam kết bảo chứng kết quả đầu ra rõ ràng.',
    }
  },
  {
    id: 'feature-split-text-image',
    name: 'Khối Giới Thiệu (Text Trái - Hình Phải)',
    category: 'why',
    source: 'Tân Sanh Ngữ & SmartKids',
    badge: 'Bố Cục 2 Cột Chuẩn',
    description: 'Bố cục 2 cột kinh điển: bên trái có Tiêu đề, Mô tả, Checklist cam kết tích xanh & Nút CTA; bên phải là Ảnh minh họa bo góc sang trọng (có thể đảo vị trí).',
    component: FeatureSplitSection,
    fileName: 'FeatureSplitSection.jsx',
    defaultData: {
      eyebrow: 'PHƯƠNG PHÁP ĐỘC QUYỀN',
      title: 'Tự Tin Giao Tiếp & Thi Đạt HSK',
      highlight: 'Nhanh Gấp 3 Lần',
      desc: 'Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1:1 cùng giảng viên chuyên môn cao.',
      buttonText: 'Nhận Lộ Trình Học 0Đ',
      buttonVariant: 'secondary',
      targetSection: 'tu-van',
      imagePosition: 'right',
      imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    }
  },
  {
    id: 'courses-grid',
    name: 'Lưới Khóa Học & Bảng Giá Ưu Đãi',
    category: 'courses',
    source: 'Tấn Sanh Ngữ (LearningPaths.jsx) & Duo Center',
    badge: '3 Gói Khóa Học',
    description: 'Card khóa học có tag giá gốc & giá ưu đãi -35%, thời lượng, sĩ số, checklist đặc quyền và nút đăng ký giữ chỗ.',
    component: CoursesGrid,
    fileName: 'CoursesGrid.jsx',
    defaultData: {
      title: 'Các Chương Trình Đào Tạo Tiêu Biểu',
      subtitle: 'Lựa chọn khóa học phù hợp với quỹ thời gian và mục tiêu của bạn để đạt hiệu quả cao nhất.',
    }
  },
  {
    id: 'roadmap-timeline',
    name: 'Lộ Trình Tinh Gọn 4 Bước (Roadmap)',
    category: 'roadmap',
    source: 'Tấn Sanh Ngữ (Roadmap.jsx) & Edu Việt',
    badge: 'Timeline Trực Quan',
    description: '4 chặng học tập: Khởi động Pinyin -> Tích lũy vốn từ -> Phản xạ giao tiếp -> Cán mốc chứng chỉ kèm chuẩn đầu ra.',
    component: RoadmapTimeline,
    fileName: 'RoadmapTimeline.jsx',
    defaultData: {
      title: 'Lộ Trình Tinh Gọn 4 Bước Từ Số 0 Đến Lưu Loát',
      subtitle: 'Từng chặng được đo lường kết quả rõ ràng, cam kết đạt chuẩn năng lực sau mỗi giai đoạn.',
    }
  },
  {
    id: 'schedule-table',
    name: 'Bảng Lịch Khai Giảng Dự Kiến',
    category: 'schedule',
    source: 'Tấn Sanh Ngữ (OpeningSchedule.jsx)',
    badge: 'Tạo Cảm Giác Gấp Rút',
    description: 'Danh sách lớp khai giảng theo thứ, giờ học, giảng viên phụ trách và số ghế còn lại (Sắp đầy, Còn 1 chỗ).',
    component: OpeningScheduleTable,
    fileName: 'OpeningScheduleTable.jsx',
    defaultData: {
      title: 'Lịch Khai Giảng Dự Kiến Tháng Này',
      subtitle: 'Sĩ số giới hạn 6 - 8 học viên mỗi lớp để đảm bảo chất lượng sửa phát âm từng học viên.',
    }
  },
  {
    id: 'teachers-slider',
    name: 'Đội Ngũ Giảng Viên & Chuyên Gia',
    category: 'teachers',
    source: 'Tấn Sanh Ngữ & Edu Việt (teacher.section.tsx)',
    badge: 'Bằng Cấp Sư Phạm',
    description: 'Hồ sơ giảng viên có ảnh chân dung, bằng thạc sĩ ĐH Bắc Kinh/Đài Loan, chứng chỉ HSK 6 và triết lý giảng dạy.',
    component: TeachersSlider,
    fileName: 'TeachersSlider.jsx',
    defaultData: {
      title: 'Đội Ngũ Giảng Viên Chuyên Môn & Bản Xứ',
      subtitle: '100% Giảng viên tốt nghiệp Thạc sĩ chuyên ngành sư phạm, giàu năng lượng và đồng hành sửa phát âm từng học viên.',
    }
  },
  {
    id: 'feedback-slider',
    name: 'Đánh Giá & Bằng Chứng Học Viên',
    category: 'feedback',
    source: 'Tấn Sanh Ngữ (FeedbackSlider.jsx) & Ươm Mầm',
    badge: 'Review 5 Sao',
    description: 'Nhận xét chi tiết của học viên, điểm thi HSK 5 đạt được, vị trí việc làm và lợi ích sau khóa học.',
    component: FeedbackSlider,
    fileName: 'FeedbackSlider.jsx',
    defaultData: {
      title: 'Câu Chuyện Thành Công Từ Hơn 10.000 Học Viên',
      subtitle: 'Những kết quả thật, điểm số thật và sự thay đổi tích cực trong công việc sau khi hoàn thành khóa học.',
    }
  },
  {
    id: 'faq-accordion',
    name: 'Câu Hỏi Thường Gặp (Accordion FAQ)',
    category: 'faq',
    source: 'Tấn Sanh Ngữ (Faq-section.jsx) & Duo Center',
    badge: 'Tháo Gỡ Rào Cản',
    description: 'Accordion mở/đóng giải đáp: Mất gốc có học được không, chính sách học bù/bảo lưu, cam kết hoàn tiền 0Đ.',
    component: FaqAccordion,
    fileName: 'FaqAccordion.jsx',
    defaultData: {
      title: 'Giải Đáp Mọi Thắc Mắc Thường Gặp',
      subtitle: 'Tất cả những băn khoăn về học phí, lịch học, giảng viên và chính sách bảo lưu của học viên.',
    }
  },
  {
    id: 'consultation-form',
    name: 'Form Tư Vấn Lead & Quà Tặng Đính Kèm',
    category: 'form',
    source: 'Tấn Sanh Ngữ (ConsultationForm.jsx) & Edu Việt',
    badge: 'Thu Lead Tối Đa',
    description: 'Form 2 cột chuyên nghiệp: Quà tặng voucher 35% & tài liệu độc quyền bên trái, form nhập thông tin có validation bên phải.',
    component: ConsultationForm,
    fileName: 'ConsultationForm.jsx',
    defaultData: {
      title: 'Đăng Ký Nhận Lộ Trình Học & Ưu Đãi 35% Học Phí',
      subtitle: 'Điền thông tin để chuyên viên khảo thí liên hệ tư vấn lộ trình phù hợp nhất với quỹ thời gian của bạn.',
    }
  },
  {
    id: 'floating-contact',
    name: 'Nút Nổi Liên Hệ Zalo & Hotline',
    category: 'footer',
    source: 'Tấn Sanh Ngữ (FloatingContact.jsx)',
    badge: 'Nổi Góc Màn Hình',
    description: 'Nút hotline có hiệu ứng sóng xung kích lan tỏa (ping wave) và nút Zalo trực tiếp.',
    component: FloatingContact,
    fileName: 'FloatingContact.jsx',
    defaultData: {
      hotline: '0988.123.456',
      zaloNumber: '0988123456',
    }
  },
  {
    id: 'footer-standard',
    name: 'Footer Chi Nhánh & Pháp Lý',
    category: 'footer',
    source: 'Tấn Sanh Ngữ (Footer.jsx) & SmartKids',
    badge: 'Đầy Đủ Cơ Sở',
    description: 'Hệ thống cơ sở Hà Nội, TP.HCM, giấy phép đào tạo, hotline, email và chính sách bảo vệ học viên.',
    component: FooterSection,
    fileName: 'FooterSection.jsx',
    defaultData: {
      brandName: 'TẤN SANH NGỮ',
      brandSlogan: 'Học Viện Ngoại Ngữ Chuyên Sâu',
      hotline: '0988.123.456',
    }
  },
];
