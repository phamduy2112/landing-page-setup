import React, { useState, useEffect } from 'react';
import {
  X,
  Code,
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Wand2,
  FileCode,
  Info,
  ChevronDown,
  Upload,
  Clipboard,
  Box,
  GraduationCap,
  Globe,
  RefreshCw,
} from 'lucide-react';
import CustomCodeRenderer from './CustomCodeRenderer';
import ResponsiveIframe from './ResponsiveIframe';
import HtmlToReactTailwindModal from './HtmlToReactTailwindModal';
import { normalizeColorsToPrimary, switchSectionColorTheme } from '../../utils/sectionColorTransform';

// Education-specific section categories (Only education landing pages have these)
const EDUCATION_SECTION_CATEGORIES = ['courses', 'schedule', 'roadmap', 'teachers', 'needs'];

// Starter Templates for SECTIONS (Full-page blocks)
const SECTION_TEMPLATES = [
  // --- 🎓 ĐẶC THÙ GIÁO DỤC (Chỉ Landing Page Giáo Dục Mới Có) ---
  {
    id: 'courses-tan-sanh-ngu',
    name: 'Khóa Học: Tân Sanh Ngữ (Tab Lọc & Card Grid)',
    category: 'courses',
    isEducation: true,
    code: `import { useState } from 'react';
import SectionHeading from './section-heading';
import { MdKeyboardArrowRight } from 'react-icons/md';

const courses = [
  {
    number: '01',
    type: 'GIAO TIẾP',
    title: 'Tiếng Anh Giao Tiếp Phản Xạ',
    desc: 'Củng cố phát âm chuẩn, rèn phản xạ hội thoại tự nhiên trong đời sống hàng ngày và môi trường học tập, làm việc.',
    cta: 'Tư vấn lộ trình Online',
    href: '#tu-van',
    badgeClass: 'bg-primary text-surface',
    linkClass: 'text-primary',
  },
  {
    number: '02',
    type: 'GIAO TIẾP',
    title: 'Tiếng Anh Giao Tiếp Công Sở',
    desc: 'Nâng cao vốn từ vựng thực tế, kỹ năng thuyết trình, trao đổi email và tự tin phỏng vấn tuyển dụng.',
    cta: 'Tư vấn lộ trình Online',
    href: '#tu-van',
    badgeClass: 'bg-primary text-surface',
    linkClass: 'text-primary',
  },
  {
    number: '03',
    type: 'TOEIC',
    title: 'TOEIC Foundation',
    desc: 'Lấy lại căn bản ngữ pháp, xây dựng vốn từ vựng học thuật và làm quen các dạng bài nghe - đọc trọng tâm.',
    cta: 'Tư vấn khóa TOEIC',
    href: '#tu-van',
    badgeClass: 'bg-secondary text-primary font-bold',
    linkClass: 'text-primary',
  },
  {
    number: '04',
    type: 'TOEIC',
    title: 'TOEIC Luyện Đề Chuẩn Đầu Ra',
    desc: 'Rèn chiến thuật làm bài thi Listening & Reading, khắc phục bẫy đề thi, bứt phá điểm số xét tốt nghiệp và đi làm.',
    cta: 'Tư vấn khóa TOEIC',
    href: '#tu-van',
    badgeClass: 'bg-secondary text-primary font-bold',
    linkClass: 'text-primary',
  },
  {
    number: '05',
    type: 'IELTS',
    title: 'IELTS Foundation',
    desc: 'Xây nền ngữ pháp vững chắc, chuẩn hóa phát âm và làm quen tư duy học thuật cho người mới bắt đầu.',
    cta: 'Tư vấn khóa IELTS',
    href: '#tu-van',
    badgeClass: 'bg-primary text-surface',
    linkClass: 'text-primary',
  },
  {
    number: '06',
    type: 'IELTS',
    title: 'IELTS Bứt Phá Mục Tiêu',
    desc: 'Luyện đề chuyên sâu, được giảng viên sửa bài chi tiết từng kỹ năng, tối ưu điểm số xét tuyển ĐH và du học.',
    cta: 'Tư vấn khóa IELTS',
    href: '#tu-van',
    badgeClass: 'bg-primary text-surface',
    linkClass: 'text-primary',
  },
];

function CourseCard({ item }) {
  return (
    <article className="group bg-white flex flex-col overflow-hidden rounded-[24px] border border-primary/10 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[200px] shrink-0 overflow-hidden md:h-[240px] bg-slate-100 flex items-center justify-center">
        <img
          src="/assets/dangcapnhan.png"
          alt={item.title}
          className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
        <span
          className={\`absolute bottom-4 left-4 md:bottom-5 md:left-5 rounded-full px-3 py-2 text-[10px] font-extrabold tracking-[0.1em] \${item.badgeClass}\`}
        >
          {item.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-7">
        <h3 className="text-[19px] font-bold leading-[1.25] text-primary">
          {item.title}
        </h3>
        <p className="mt-2.5 text-[13px] leading-[1.65] text-text-muted">
          {item.desc}
        </p>
        <div className="my-4 h-px w-full bg-primary/10" />
        <a
          href={item.href}
          className="group/link mt-auto inline-flex w-fit items-center gap-2 text-[13px] font-bold text-primary transition-colors hover:text-accent-dark"
        >
          {item.cta}
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
            <MdKeyboardArrowRight size={18} />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function CoursesSection() {
  const categories = ['IELTS', 'TOEIC', 'GIAO TIẾP'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const filteredCourses = courses.filter((course) => course.type === activeCategory);

  return (
    <section id="courses" className="overflow-hidden bg-surface-muted py-12 lg:py-16 px-4 md:px-0">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="CHƯƠNG TRÌNH ĐÀO TẠO ONLINE"
          title="Các Khóa Học Online Tại"
          highlight="Tân Sanh Ngữ"
          desc="Hệ thống chương trình ngoại ngữ Online tương tác cao, bám sát nhu cầu học tập, xét tốt nghiệp và thăng tiến sự nghiệp."
          className="mb-4 text-center"
        />

        <div className="mb-6 flex w-full overflow-x-auto justify-start md:justify-center gap-3 pb-2 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={\`shrink-0 rounded-full px-6 py-2.5 text-[14px] font-bold transition-all duration-300 \${
                activeCategory === category
                  ? 'bg-primary text-surface shadow-lg scale-105'
                  : 'bg-surface text-primary border border-primary/20 hover:bg-primary/5'
              }\`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((item) => (
            <CourseCard key={item.number} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}`,
  },
  {
    id: 'courses-pricing',
    name: 'Khóa Học: Bảng 3 Gói Học Phí & Quyền Lợi',
    category: 'courses',
    isEducation: true,
    code: `<section id="pricing" className="py-16 lg:py-24 bg-slate-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
        Các Gói Đào Tạo Trọng Tâm
      </span>
      <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
        Chọn Lộ Trình Phù Hợp Với Bạn
      </h2>
      <p className="text-sm text-slate-600">
        Mỗi khóa học được thiết kế chuẩn đầu ra quốc tế với lịch học linh hoạt sáng, tối và cuối tuần.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 items-stretch">
      {/* Plan 1 */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">Căn Bản Cho Người Mới</h3>
          <p className="text-xs text-slate-500 mt-1">Khởi động phát âm chuẩn & phản xạ đời thường</p>
          <div className="mt-4 text-3xl font-black text-slate-900 font-heading">2.950.000đ <span className="text-xs font-normal text-slate-400">/khóa</span></div>
          <ul className="mt-6 space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2">✓ 24 buổi học tương tác trực tiếp</li>
            <li className="flex items-center gap-2">✓ Tặng bộ giáo trình độc quyền</li>
            <li className="flex items-center gap-2">✓ Hỗ trợ sửa phát âm 1-1</li>
          </ul>
        </div>
        <button className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition">
          Chọn Gói Này
        </button>
      </div>

      {/* Plan 2: Featured */}
      <div className="p-8 rounded-3xl bg-white border-2 border-primary shadow-xl shadow-primary/10 flex flex-col justify-between space-y-6 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold shadow-md">
          Phổ Biến Nhất ⭐
        </span>
        <div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">Luyện Thi Cấp Tốc HSK/IELTS</h3>
          <p className="text-xs text-slate-500 mt-1">Chiến thuật làm bài & cam kết đạt mục tiêu</p>
          <div className="mt-4 text-3xl font-black text-primary font-heading">4.850.000đ <span className="text-xs font-normal text-slate-400">/khóa</span></div>
          <ul className="mt-6 space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2">✓ 36 buổi luyện đề thực chiến</li>
            <li className="flex items-center gap-2">✓ Thi thử miễn phí không giới hạn</li>
            <li className="flex items-center gap-2">✓ Cam kết bảo hành học lại 100%</li>
            <li className="flex items-center gap-2">✓ Giảng viên chấm bài chi tiết</li>
          </ul>
        </div>
        <button className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-900 font-black text-xs shadow-md transition">
          Đăng Ký Nhận Ưu Đãi
        </button>
      </div>

      {/* Plan 3 */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900">Kèm 1 Kèm 1 VIP</h3>
          <p className="text-xs text-slate-500 mt-1">Thiết kế lộ trình theo lịch trình bận rộn</p>
          <div className="mt-4 text-3xl font-black text-slate-900 font-heading">Liên Hệ <span className="text-xs font-normal text-slate-400">/theo nhu cầu</span></div>
          <ul className="mt-6 space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2">✓ Tự do xếp lịch học linh hoạt</li>
            <li className="flex items-center gap-2">✓ 100% thời lượng với Master Teacher</li>
            <li className="flex items-center gap-2">✓ Giáo trình chuyên biệt ngành nghề</li>
          </ul>
        </div>
        <button className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition">
          Tư Vấn Gói VIP
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'schedule-table',
    name: 'Lịch Khai Giảng: Bảng Lịch Học Hàng Tháng',
    category: 'schedule',
    isEducation: true,
    code: `<section id="schedule" className="py-16 bg-slate-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
      <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
        Tuyển Sinh Khóa Mới
      </span>
      <h2 className="font-heading text-3xl font-black text-slate-900">
        Lịch Khai Giảng Dự Kiến Tháng Này
      </h2>
      <p className="text-sm text-slate-600">
        Sĩ số giới hạn 6 - 8 học viên mỗi lớp để đảm bảo chất lượng sửa lỗi phát âm và tương tác 1:1.
      </p>
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-4 px-4 sm:px-6">Khóa Học</th>
            <th className="py-4 px-4">Lịch Học</th>
            <th className="py-4 px-4">Giờ Học</th>
            <th className="py-4 px-4">Hình Thức</th>
            <th className="py-4 px-4">Tình Trạng</th>
            <th className="py-4 px-4 sm:px-6 text-right">Hành Động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr className="hover:bg-slate-50/80 transition">
            <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">Tiếng Trung Giao Tiếp Căn Bản</td>
            <td className="py-4 px-4 text-slate-600">Tối 2 - 4 - 6</td>
            <td className="py-4 px-4 text-slate-600">18:30 - 20:00</td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-xs">Cơ sở 1</span></td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-bold text-xs">Còn 2 chỗ</span></td>
            <td className="py-4 px-4 sm:px-6 text-right">
              <a href="#tu-van" className="inline-block px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs transition">
                Giữ Chỗ
              </a>
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80 transition">
            <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">Luyện Thi HSK 4 Cấp Tốc</td>
            <td className="py-4 px-4 text-slate-600">Tối 3 - 5 - 7</td>
            <td className="py-4 px-4 text-slate-600">19:30 - 21:00</td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-xs">Online Zoom</span></td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-bold text-xs">Còn 1 chỗ</span></td>
            <td className="py-4 px-4 sm:px-6 text-right">
              <a href="#tu-van" className="inline-block px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover text-slate-900 font-bold text-xs transition">
                Giữ Chỗ
              </a>
            </td>
          </tr>
          <tr className="hover:bg-slate-50/80 transition">
            <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">Giao Tiếp Doanh Nghiệp</td>
            <td className="py-4 px-4 text-slate-600">Thứ 7 & CN</td>
            <td className="py-4 px-4 text-slate-600">09:00 - 11:30</td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-xs">Cơ sở 2</span></td>
            <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs">Đang nhận</span></td>
            <td className="py-4 px-4 sm:px-6 text-right">
              <a href="#tu-van" className="inline-block px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs transition">
                Giữ Chỗ
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
  {
    id: 'roadmap-timeline',
    name: 'Lộ Trình: 4 Bước Tinh Gọn Từ Số 0 Đến Chuẩn Đầu Ra',
    category: 'roadmap',
    isEducation: true,
    code: `<section id="roadmap" className="py-16 lg:py-24 bg-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
      <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
        Lộ Trình Tinh Gọn
      </span>
      <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
        4 Giai Đoạn Chinh Phục Ngoại Ngữ
      </h2>
      <p className="text-sm text-slate-600">
        Được thiết kế khoa học từ nền tảng phát âm đến kỹ năng phản xạ và luyện đề thực chiến.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
        <span className="text-2xl font-black text-primary font-heading">01</span>
        <span className="block mt-1 text-[11px] font-bold text-amber-600 uppercase">Tuần 1 - Tuần 2</span>
        <h3 className="font-heading font-extrabold text-base text-slate-900 mt-2">Chuẩn Hóa Phát Âm</h3>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Luyện khẩu hình chuẩn xác 100%, xóa bỏ tật ngọng thanh điệu, tự đọc chuẩn mọi từ có phiên âm.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
        <span className="text-2xl font-black text-primary font-heading">02</span>
        <span className="block mt-1 text-[11px] font-bold text-amber-600 uppercase">Tuần 3 - Tuần 6</span>
        <h3 className="font-heading font-extrabold text-base text-slate-900 mt-2">600 Từ Vựng Cốt Lõi</h3>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Phương pháp liên tưởng hình ảnh độc quyền, nhớ mặt chữ và tự tin nối câu giao tiếp thông dụng.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
        <span className="text-2xl font-black text-primary font-heading">03</span>
        <span className="block mt-1 text-[11px] font-bold text-amber-600 uppercase">Tuần 7 - Tuần 10</span>
        <h3 className="font-heading font-extrabold text-base text-slate-900 mt-2">Phản Xạ Đa Giác Quan</h3>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Nâng cao tốc độ phản hồi dưới 2 giây. Luyện nghe các ngữ điệu thực tế và xử lý tình huống phát sinh.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
        <span className="text-2xl font-black text-secondary-dark font-heading">04</span>
        <span className="block mt-1 text-[11px] font-bold text-secondary-dark uppercase">Tuần 11 - Tuần 12</span>
        <h3 className="font-heading font-extrabold text-base text-slate-900 mt-2">Luyện Đề & Về Đích</h3>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">
          Chiến thuật giải đề thi thật, mẹo tránh bẫy câu hỏi khó và cam kết đỗ chứng chỉ bằng văn bản.
        </p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'teachers-grid',
    name: 'Giảng Viên: Đội Ngũ Giáo Viên Chuyên Nghiệp',
    category: 'teachers',
    isEducation: true,
    code: `<section id="teachers" className="py-16 lg:py-24 bg-slate-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
      <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
        Đội Ngũ Học Thuật
      </span>
      <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
        Giảng Viên Tận Tâm & Giàu Kinh Nghiệm
      </h2>
      <p className="text-sm text-slate-600">
        100% giảng viên có chứng chỉ quốc tế và tối thiểu 5 năm kinh nghiệm dẫn dắt học viên đạt điểm cao.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-4xl mb-4">
          👨‍🏫
        </div>
        <h3 className="font-heading font-extrabold text-lg text-slate-900">ThS. Trương Lệ Quyên</h3>
        <p className="text-xs font-bold text-primary mt-1">Giảng viên Trưởng - HSK 6</p>
        <span className="mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold">
          8+ năm kinh nghiệm
        </span>
        <p className="text-xs text-slate-500 italic mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          "Học ngôn ngữ là mở rộng thế giới quan. Tôi chú trọng truyền cảm hứng tự học và phản xạ tự nhiên."
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-4xl mb-4">
          👩‍🏫
        </div>
        <h3 className="font-heading font-extrabold text-lg text-slate-900">Cô Hoàng Mỹ Linh</h3>
        <p className="text-xs font-bold text-primary mt-1">Chuyên gia Giao tiếp Bản ngữ</p>
        <span className="mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold">
          6+ năm kinh nghiệm
        </span>
        <p className="text-xs text-slate-500 italic mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          "Không có người học dốt ngoại ngữ, chỉ có người chưa tìm được đúng phương pháp luyện phản xạ."
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-4xl mb-4">
          👨‍🏫
        </div>
        <h3 className="font-heading font-extrabold text-lg text-slate-900">ThS. Vương Khắc Cường</h3>
        <p className="text-xs font-bold text-primary mt-1">Chuyên gia Luyện thi Cấp tốc</p>
        <span className="mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold">
          7+ năm kinh nghiệm
        </span>
        <p className="text-xs text-slate-500 italic mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          "Chiến thuật giải đề thông minh giúp học viên tiết kiệm 50% thời gian ôn luyện mà vẫn đạt điểm tuyệt đối."
        </p>
      </div>
    </div>
  </div>
</section>`,
  },

  // --- 🌐 SECTION PHỔ THÔNG (Cho Mọi Loại Landing Page) ---
  {
    id: 'header-tan-sanh-ngu',
    name: 'Header: Tân Sanh Ngữ (Logo, Nav & Nút Tư Vấn)',
    category: 'header',
    isEducation: false,
    code: `import { useState } from 'react';

const links = [
  ['Khó Khăn Thường Gặp', '#kho-khan'],
  ['Về Tân Sanh Ngữ', '#about'],
  ['Khóa Học Online', '#courses'],
  ['Lịch Khai Giảng', '#schedule'],
  ['FAQ', '#faq'],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-surface/95 backdrop-blur">
      <div className="container mx-auto flex min-h-[82px] w-[calc(100%-3rem)] max-w-[1200px] items-center justify-between gap-7 md:w-[calc(100%-5rem)]">
        <a className="flex shrink-0 items-center gap-2.5" href="#top" aria-label="Tân Sanh Ngữ - về đầu trang">
          <img src="/assets/LOGO2.png" className="w-[150px] h-auto" alt="Logo Tân Sanh Ngữ" />
        </a>
        <button
          className="grid h-11 w-11 place-content-center gap-1 rounded border border-primary/10 bg-surface md:hidden"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="h-0.5 w-5 bg-primary" />
          <span className="h-0.5 w-5 bg-primary" />
          <span className="h-0.5 w-5 bg-primary" />
        </button>
        <nav
          className={\`\${menuOpen ? 'grid' : 'hidden'} absolute left-0 right-0 top-full gap-0 border-b border-primary/10 bg-surface px-6 pb-5 shadow-xl md:static md:flex md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none\`}
          aria-label="Điều hướng chính"
        >
          {links.map(([label, href]) => (
            <a
              className="border-b border-primary/10 py-3 text-[13px] font-semibold text-text-muted transition hover:text-accent md:border-0 md:py-0"
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="mt-3 inline-flex min-h-[42px] items-center justify-center gap-3 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-secondary-hover md:mt-0"
            href="#tu-van"
            onClick={() => setMenuOpen(false)}
          >
            Nhận tư vấn Online
          </a>
        </nav>
      </div>
    </header>
  );
}`,
  },
  {
    id: 'hero-promo',
    name: 'Hero: Khuyến Mãi Đầu Trang Kèm Thống Kê',
    category: 'hero',
    isEducation: false,
    code: `<section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-primary/5 via-white to-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center space-y-6">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold shadow-sm">
        <span>✨</span>
        <span>Ưu Đãi Tuyển Sinh Khóa Mới - Giảm Đến 35%</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
        Chinh Phục Giao Tiếp & Thi Đạt Chứng Chỉ <span className="text-primary">Sau 3 Tháng</span>
      </h1>

      {/* Description */}
      <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
        Lộ trình cá nhân hóa tinh gọn, giáo viên bản ngữ tận tâm cùng cam kết chuẩn đầu ra bằng văn bản 100%.
      </p>

      {/* CTA Group */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <a
          href="#tu-van"
          className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary-hover text-slate-900 font-black rounded-xl shadow-lg shadow-secondary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Nhận Lộ Trình & Học Thử 0Đ</span>
          <span>→</span>
        </a>

        <a
          href="#courses"
          className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <span>Xem Các Khóa Học</span>
        </a>
      </div>

      {/* Stats Counter */}
      <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-primary font-heading">10.000+</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Học Viên Tốt Nghiệp</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-primary font-heading">98.5%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Tỉ Lệ Đỗ Chuẩn</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-primary font-heading">100%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Cam Kết Văn Bản</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-secondary font-heading">5.0 ★</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Đánh Giá Thực Tế</div>
        </div>
      </div>

    </div>
  </div>
</section>`,
  },
  {
    id: 'consultation-form',
    name: 'Form: Đăng Ký Tư Vấn & Nhận Ưu Đãi',
    category: 'form',
    isEducation: false,
    code: `<section id="tu-van" className="py-16 bg-gradient-to-br from-primary via-primary-dark to-slate-950 text-white">
  <div className="max-w-4xl mx-auto px-4 sm:px-6">
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8">
      
      <div className="text-center space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-secondary text-slate-900 font-black text-xs uppercase tracking-wide">
          Chỉ Còn 15 Suất Giảm 35%
        </span>
        <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight">
          Đăng Ký Tư Vấn & Thi Thử Trình Độ 0Đ
        </h2>
        <p className="text-sm text-slate-200 max-w-lg mx-auto">
          Để lại thông tin, đội ngũ chuyên gia học thuật sẽ liên hệ gửi lộ trình chi tiết trong vòng 15 phút.
        </p>
      </div>

      <form className="space-y-4 max-w-2xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Họ và tên *</label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Số điện thoại / Zalo *</label>
            <input
              type="tel"
              placeholder="0912 345 678"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">Khóa học bạn quan tâm</label>
          <select className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
            <option>Tiếng Anh Giao Tiếp Thực Chiến</option>
            <option>Luyện Thi Chứng Chỉ Quốc Tế (IELTS / TOEIC / HSK)</option>
            <option>Lấy Lại Căn Bản Cho Người Mất Gốc</option>
            <option>Khóa Kèm 1:1 VIP Theo Yêu Cầu</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="w-full py-4 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-900 font-black text-base shadow-xl shadow-secondary/20 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>GỬI ĐĂNG KÝ & GIỮ ƯU ĐÃI NGAY</span>
            <span>→</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-300">
          🔒 Cam kết bảo mật thông tin cá nhân. Hoàn toàn không làm phiền nếu bạn chưa sẵn sàng.
        </p>
      </form>

    </div>
  </div>
</section>`,
  },
  {
    id: 'footer-tan-sanh-ngu',
    name: 'Footer: Tân Sanh Ngữ (Địa Chỉ & Hotline)',
    category: 'footer',
    isEducation: false,
    code: `<footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
      
      {/* Brand Info */}
      <div className="md:col-span-5 space-y-4">
        <div className="flex items-center gap-3">
          <img src="/assets/LOGO2.png" alt="Tân Sanh Ngữ" className="h-10 w-auto brightness-0 invert" />
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
          Đơn vị tiên phong đào tạo ngoại ngữ Online thực chiến với phương pháp phản xạ đa giác quan. Cam kết đầu ra bằng văn bản.
        </p>
        <div className="space-y-1.5 text-xs text-slate-300">
          <p>📞 Hotline Tuyển Sinh: <strong className="text-white">0988.123.456</strong></p>
          <p>📧 Email: <strong className="text-white">tuyensinh@tansanhngu.edu.vn</strong></p>
          <p>⏰ Giờ làm việc: 08:00 - 21:30 (Thứ 2 đến Chủ Nhật)</p>
        </div>
      </div>

      {/* Campuses */}
      <div className="md:col-span-4 space-y-3">
        <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider">Hệ Thống Cơ Sở</h4>
        <div className="space-y-2 text-xs text-slate-400">
          <p><strong className="text-slate-200">Cơ sở 1:</strong> 123 Nguyễn Thị Minh Khai, P. Bến Thành, Q.1, TP.HCM</p>
          <p><strong className="text-slate-200">Cơ sở 2:</strong> 45 Trần Thái Tông, Cầu Giấy, Hà Nội</p>
          <p><strong className="text-slate-200">Đào tạo Online:</strong> Tương tác trực tiếp qua nền tảng Zoom bản quyền</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="md:col-span-3 space-y-3">
        <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider">Liên Kết Nhanh</h4>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li><a href="#courses" className="hover:text-secondary transition">Khóa Học Online</a></li>
          <li><a href="#schedule" className="hover:text-secondary transition">Lịch Khai Giảng</a></li>
          <li><a href="#teachers" className="hover:text-secondary transition">Đội Ngũ Giảng Viên</a></li>
          <li><a href="#tu-van" className="hover:text-secondary transition">Đăng Ký Tư Vấn</a></li>
        </ul>
      </div>

    </div>

    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
      <p>© 2026 Tân Sanh Ngữ. Bản quyền thuộc về Viện Đào Tạo Ngoại Ngữ.</p>
      <div className="flex gap-4">
        <a href="#privacy" className="hover:text-slate-400">Chính Sách Bảo Mật</a>
        <a href="#terms" className="hover:text-slate-400">Điều Khoản Dịch Vụ</a>
      </div>
    </div>
  </div>
</footer>`,
  },
  {
    id: 'blank-boilerplate',
    name: 'Khung Trống Cơ Bản (Boilerplate)',
    category: 'custom',
    isEducation: false,
    code: `<section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center space-y-4">
      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
        Section Mới
      </span>
      <h2 className="font-heading text-3xl font-black text-slate-900">
        Tiêu Đề Section Của Bạn
      </h2>
      <p className="text-sm text-slate-600 max-w-xl mx-auto">
        Nhập nội dung mô tả ở đây. Hãy sử dụng class bg-primary, text-secondary, rounded-xl để tự động nhận theme!
      </p>
      <div className="pt-4">
        <ButtonCTA text="Hành Động Chính" targetSection="tu-van" />
      </div>
    </div>
  </div>
</section>`,
  },
];

// Starter Templates for COMPONENTS (Sub-components)
const COMPONENT_TEMPLATES = [
  {
    id: 'comp-button-primary',
    name: 'Button: CTA Gọi Section (Primary Brand)',
    category: 'buttons',
    code: `export default function ActionButton({
  text = "Đăng Ký Tư Vấn Ngay",
  targetSection = "tu-van",
  variant = "primary" // "primary" | "secondary" | "outline" | "glow"
}) {
  return (
    <ButtonCTA
      text={text}
      targetSection={targetSection}
      variant={variant}
    />
  );
}`,
  },
  {
    id: 'comp-button-secondary',
    name: 'Button: CTA Vàng Hổ Phách Nổi Bật',
    category: 'buttons',
    code: `export default function GoldButton({
  text = "Giữ Ưu Đãi Giảm 35%",
  targetSection = "tu-van"
}) {
  return (
    <ButtonCTA
      text={text}
      targetSection={targetSection}
      variant="secondary"
      size="lg"
    />
  );
}`,
  },
  {
    id: 'comp-button-outline',
    name: 'Button: Viền Trong Suốt (Outline)',
    category: 'buttons',
    code: `export default function OutlineButton({
  text = "Xem Chi Tiết Lộ Trình",
  targetSection = "courses"
}) {
  return (
    <ButtonCTA
      text={text}
      targetSection={targetSection}
      variant="outline"
    />
  );
}`,
  },
  {
    id: 'comp-single-course-card',
    name: 'Card: Thẻ Khóa Học Đơn (Kèm Giá & Nút)',
    category: 'cards',
    code: `export default function SingleCourseCard({
  type = "GIAO TIẾP",
  title = "Tiếng Anh Giao Tiếp Phản Xạ",
  desc = "Củng cố phát âm chuẩn, rèn phản xạ hội thoại tự nhiên trong đời sống hàng ngày và công việc.",
  price = "2.950.000đ",
  cta = "Tư Vấn Khóa Học",
  target = "tu-van"
}) {
  return (
    <div className="max-w-sm bg-white flex flex-col rounded-2xl border border-primary/10 shadow-lg hover:shadow-xl p-6 transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary">
          {type}
        </span>
        <span className="text-xs font-bold text-amber-500">⭐ 4.9/5</span>
      </div>
      <h4 className="text-xl font-bold text-primary mb-2 leading-snug">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mb-5 flex-1">{desc}</p>
      <div className="pt-4 border-t border-primary/10 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold">Học phí trọn gói</span>
          <span className="text-lg font-black text-secondary-dark">{price}</span>
        </div>
        <ButtonCTA text={cta} targetSection={target} variant="primary" />
      </div>
    </div>
  );
}`,
  },
  {
    id: 'comp-single-teacher-card',
    name: 'Card: Thẻ Giảng Viên Đơn (Avatar & Quote)',
    category: 'cards',
    code: `export default function SingleTeacherCard({
  name = "ThS. Trương Lệ Quyên",
  title = "Giảng Viên Trưởng Tiếng Trung",
  exp = "8+ Năm Kinh Nghiệm",
  quote = "Học ngôn ngữ là mở rộng thế giới quan. Tôi chú trọng truyền cảm hứng tự học và phản xạ tự nhiên."
}) {
  return (
    <div className="max-w-sm bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition text-center flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-3xl mb-3 shadow-inner">
        👨‍🏫
      </div>
      <h4 className="font-heading font-black text-slate-900 text-base">{name}</h4>
      <p className="text-xs font-bold text-primary mt-0.5">{title}</p>
      <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
        {exp}
      </span>
      <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
        "{quote}"
      </p>
    </div>
  );
}`,
  },
  {
    id: 'comp-section-heading',
    name: 'Heading: Tiêu Đề Section Chuẩn (Eyebrow & Highlight)',
    category: 'headings',
    code: `export default function CustomSectionHeading({
  eyebrow = "CHƯƠNG TRÌNH ĐÀO TẠO ONLINE",
  title = "Các Khóa Học Trọng Điểm Tại",
  highlight = "Tân Sanh Ngữ",
  desc = "Hệ thống chương trình ngoại ngữ tương tác cao, bám sát nhu cầu học tập và đi làm."
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-8 px-4">
      {eyebrow && (
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-accent mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
        {title} <span className="text-secondary">{highlight}</span>
      </h2>
      {desc && (
        <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-2xl mx-auto">
          {desc}
        </p>
      )}
    </div>
  );
}`,
  },
  {
    id: 'comp-badge-pill',
    name: 'Badge: Huy Hiệu Cam Kết Đầu Ra 100%',
    category: 'badges',
    code: `export default function TrustBadge({
  text = "Cam kết đầu ra bằng hợp đồng văn bản 100%",
  icon = "✨"
}) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 border border-secondary/30 text-primary text-xs font-black shadow-sm">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}`,
  },
  {
    id: 'comp-form-input',
    name: 'Input: Ô Nhập Liệu Form Kèm Nhãn',
    category: 'forms',
    code: `export default function FormInputField({
  label = "Số điện thoại / Zalo *",
  placeholder = "0912 345 678",
  type = "tel"
}) {
  return (
    <div className="w-full text-left space-y-1.5">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}`,
  },
];

export default function CodeEditorModal({
  isOpen,
  onClose,
  onSave,
  editingSection = null,
  activeTheme,
  activeFont,
  activeRadius,
}) {
  if (!isOpen) return null;

  // 1. Dual Mode: 'section' | 'component'
  const [itemType, setItemType] = useState(() => {
    if (editingSection?.type) return editingSection.type;
    if (editingSection?.isComponent) return 'component';
    return 'section';
  });

  // 2. Category State
  const [itemCategory, setItemCategory] = useState(() => {
    return editingSection?.category || (itemType === 'component' ? 'buttons' : 'courses');
  });

  // 3. Name & Code States
  const [sectionName, setSectionName] = useState(
    editingSection?.name ||
    editingSection?.sectionDef?.name ||
    (itemType === 'component' ? 'Component Tùy Biến Mới' : 'Section Tùy Biến Mới')
  );

  const [code, setCode] = useState(
    editingSection?.customCode ||
    editingSection?.sectionDef?.customCode ||
    editingSection?.codeSnippet ||
    (itemType === 'component' ? COMPONENT_TEMPLATES[0].code : SECTION_TEMPLATES[0].code)
  );

  const [previewViewport, setPreviewViewport] = useState('desktop');
  const [copied, setCopied] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [autoConvertOnPaste, setAutoConvertOnPaste] = useState(true);
  const [colorNotice, setColorNotice] = useState('');

  // Sync state if editingSection changes
  useEffect(() => {
    if (editingSection) {
      const type = editingSection.type || (editingSection.isComponent ? 'component' : 'section');
      setItemType(type);
      setItemCategory(editingSection.category || (type === 'component' ? 'buttons' : 'courses'));
      setSectionName(editingSection.name || editingSection.sectionDef?.name || 'Mục Tùy Biến');
      setCode(
        editingSection.customCode ||
        editingSection.sectionDef?.customCode ||
        editingSection.codeSnippet ||
        (type === 'component' ? COMPONENT_TEMPLATES[0].code : SECTION_TEMPLATES[0].code)
      );
    }
  }, [editingSection]);

  // Handle switching between Section mode and Component mode
  const handleSwitchType = (newType) => {
    if (newType === itemType) return;
    setItemType(newType);
    if (newType === 'component') {
      setItemCategory('buttons');
      if (!editingSection || sectionName.includes('Section')) {
        setSectionName('Nút CTA Tùy Biến Mới');
        setCode(COMPONENT_TEMPLATES[0].code);
      }
    } else {
      setItemCategory('courses');
      if (!editingSection || sectionName.includes('Component')) {
        setSectionName('Khóa Học Mới');
        setCode(SECTION_TEMPLATES[0].code);
      }
    }
  };

  const handleTemplateSelect = (tmpl) => {
    if (window.confirm(`Bạn có muốn tải mẫu "${tmpl.name}" vào trình soạn thảo không?`)) {
      setCode(tmpl.code);
      if (tmpl.category) setItemCategory(tmpl.category);
      if (!editingSection) {
        setSectionName(tmpl.name.replace(/^[A-Za-z0-9\s]+:\s*/, ''));
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const fileName = `${sectionName.replace(/[^a-zA-Z0-9]/g, '_') || (itemType === 'component' ? 'CustomComponent' : 'CustomSection')}.jsx`;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const processed = autoConvertOnPaste ? normalizeColorsToPrimary(text) : text;
        setCode(processed);
        if (autoConvertOnPaste && processed !== text) {
          setColorNotice('✨ Đã tự động chuẩn hóa các màu trong code sang màu Primary!');
          setTimeout(() => setColorNotice(''), 3500);
        }
        const nameMatch = text.match(/function\s+([A-Za-z0-9_]+)/);
        if (nameMatch && (!editingSection || sectionName.includes('Tùy Biến Mới'))) {
          setSectionName(nameMatch[1]);
        }
      }
    } catch (err) {
      alert('Vui lòng nhấn phím Ctrl + V trực tiếp vào ô soạn thảo để dán code.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCode(content);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setSectionName(cleanName || (itemType === 'component' ? 'Component Mới' : 'Section Mới'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!sectionName.trim()) {
      alert(itemType === 'component' ? 'Vui lòng nhập tên cho component!' : 'Vui lòng nhập tên cho section!');
      return;
    }
    onSave({
      type: itemType,
      category: itemCategory,
      name: sectionName.trim(),
      customCode: code,
      instanceId: editingSection?.instanceId,
      id: editingSection?.id,
    });
    onClose();
  };

  const insertSnippet = (snippet) => {
    setCode((prev) => {
      const trimmed = prev.trim();
      const lastDivIndex = trimmed.lastIndexOf('</div>');
      if (lastDivIndex > -1) {
        return (
          trimmed.slice(0, lastDivIndex) +
          `\n        {/* Component lồng vào */}\n        ${snippet}\n      ` +
          trimmed.slice(lastDivIndex)
        );
      }
      return `${prev}\n\n{/* Component lồng vào */}\n${snippet}\n`;
    });
  };

  // Determine whether current category belongs to Education-only
  const isEducationCategory = itemType === 'section' && EDUCATION_SECTION_CATEGORIES.includes(itemCategory);

  // Filter templates list based on itemType
  const activeTemplates = itemType === 'component' ? COMPONENT_TEMPLATES : SECTION_TEMPLATES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-7xl h-[94vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Top Header Bar: Switcher (1. Section vs 2. Component) + Inputs */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900 shrink-0 flex-wrap">

          {/* Icon & Title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              itemType === 'component'
                ? 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            }`}>
              {itemType === 'component' ? <Sparkles className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-white">
                  {editingSection
                    ? `Chỉnh Sửa Code ${itemType === 'component' ? 'Component' : 'Section'}`
                    : `Nhập Code Mới: ${itemType === 'component' ? 'Component Dùng Chung' : 'Section Trang'}`}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 font-mono">
                  React JSX / Tailwind
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tự động nhận màu chủ đạo ({activeTheme.name.split('(')[0]}), font ({activeFont.name}), bo góc ({activeRadius}px)
              </p>
            </div>
          </div>

          {/* Central Segmented Mode Switcher: 1. Section vs 2. Component */}
          <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => handleSwitchType('section')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                itemType === 'section'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>1. Section (Khối Trang)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchType('component')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                itemType === 'component'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>2. Component (Khối Con)</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="min-w-[190px] hidden md:block">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Phân Loại
            </label>
            {itemType === 'section' ? (
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <optgroup label="🎓 ĐẶC THÙ GIÁO DỤC (Chỉ Landing Page Giáo Dục Mới Có)">
                  <option value="courses">📚 Khóa Học & Bảng Giá (Chỉ có ở GD)</option>
                  <option value="schedule">📅 Lịch Khai Giảng Dự Kiến (Chỉ có ở GD)</option>
                  <option value="roadmap">🗺️ Lộ Trình & Phương Pháp Đào Tạo (Chỉ có ở GD)</option>
                  <option value="teachers">👨‍🏫 Đội Ngũ Giảng Viên / Chuyên Gia (Chỉ có ở GD)</option>
                  <option value="needs">🎯 Nhu Cầu & Khó Khăn Học Viên (Chỉ có ở GD)</option>
                </optgroup>
                <optgroup label="🌐 SECTION PHỔ THÔNG (Cho Mọi Loại Landing Page)">
                  <option value="header">🔝 Header Navbar (Menu Điều Hướng)</option>
                  <option value="footer">🔻 Footer & Thông Tin Liên Hệ</option>
                  <option value="hero">⭐ Hero Banner Đầu Trang</option>
                  <option value="why">💡 Tại Sao Chọn / Ưu Thế (Why Us)</option>
                  <option value="form">📝 Form Đăng Ký Tư Vấn (Lead)</option>
                  <option value="feedback">💬 Đánh Giá / Cảm Nhận Khách Hàng</option>
                  <option value="faq">❓ Câu Hỏi Thường Gặp (FAQ)</option>
                  <option value="custom">⚡ Khung Trống Tự Do (Boilerplate)</option>
                </optgroup>
              </select>
            ) : (
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              >
                <option value="buttons">🔘 Nút Bấm CTA (Gọi Section / Cuộn Mượt)</option>
                <option value="cards">🎴 Thẻ Đơn (Thẻ Khóa Học, Thẻ Giảng Viên)</option>
                <option value="headings">🏷️ Cụm Tiêu Đề Section (SectionHeading)</option>
                <option value="badges">🎖️ Huy Hiệu / Badge Cam Kết</option>
                <option value="forms">📋 Phần Tử Form (Input, Select, Button)</option>
              </select>
            )}
          </div>

          {/* Name Input */}
          <div className="flex-1 max-w-xs sm:max-w-sm hidden lg:block">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {itemType === 'component' ? 'Tên Component' : 'Tên Section'}
            </label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder={itemType === 'component' ? "VD: Nút CTA Vàng Glow" : "VD: Khóa Học Tiếng Anh Căn Bản"}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Category Context Banner */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap">
          {itemType === 'section' ? (
            isEducationCategory ? (
              <div className="flex items-center gap-2 text-amber-300">
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/30 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Đặc Thù Giáo Dục</span>
                </span>
                <span className="text-slate-300 text-[11px]">
                  Chỉ landing page về giáo dục / đào tạo thì mới có các section này (Khóa học, Lịch khai giảng, Lộ trình, Giảng viên).
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-300">
                <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 font-extrabold text-[11px] border border-blue-500/30 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Section Phổ Thông</span>
                </span>
                <span className="text-slate-300 text-[11px]">
                  Dùng chung cho mọi loại landing page (Header, Footer, Hero, Form tư vấn, Câu hỏi thường gặp FAQ...).
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-purple-300">
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-extrabold text-[11px] border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Khối Con Tái Sử Dụng</span>
              </span>
              <span className="text-slate-300 text-[11px]">
                Component lưu vào thư viện "Khối Con & Button" ở Sidebar. Bạn có thể copy mã JSX hoặc thêm làm khối riêng vào trang.
              </span>
            </div>
          )}

          {/* Quick Actions (Convert HTML / Paste / Upload) */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setIsConvertModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-[11px] font-black cursor-pointer transition active:scale-95 shrink-0 shadow-sm"
              title="Chuyển đổi mã HTML/CSS/JS thuần sang React JSX + Tailwind CSS"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>⚡ Chuyển HTML sang React</span>
            </button>

            <button
              onClick={handlePasteClipboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition active:scale-95 shrink-0 shadow-sm"
              title="Dán nhanh nội dung code từ Clipboard (Ctrl + V)"
            >
              <Clipboard className="w-3 h-3" />
              <span>Dán Code</span>
            </button>

            <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer transition active:scale-95 shrink-0 shadow-sm">
              <Upload className="w-3 h-3 text-amber-300" />
              <span>Tải .jsx</span>
              <input
                type="file"
                accept=".jsx,.js,.tsx,.html"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Starter Template Pickers & Viewport Switches */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0 flex-wrap">

          {/* Starter Templates Picker */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Mẫu {itemType === 'component' ? 'Component' : 'Section'}:</span>
            </span>

            {activeTemplates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleTemplateSelect(tmpl)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 transition ${
                  tmpl.isEducation
                    ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                }`}
                title={tmpl.name}
              >
                {tmpl.isEducation ? '🎓 ' : ''}{tmpl.name.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setPreviewViewport('desktop')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                previewViewport === 'desktop'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Laptop / Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Laptop</span>
            </button>

            <button
              onClick={() => setPreviewViewport('tablet')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                previewViewport === 'tablet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>

            <button
              onClick={() => setPreviewViewport('mobile')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                previewViewport === 'mobile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Main Work Area: Split Editor & Preview */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Pane: Code Editor */}
          <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-950/70">

            {/* Editor Toolbar */}
            <div className="p-2.5 px-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Trình Soạn Thảo JSX / HTML ({itemType.toUpperCase()})</span>
              </div>

              {/* Theme Tokens Cheat Sheet */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Dùng class:</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">bg-primary</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">bg-secondary</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">rounded-xl</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">font-heading</span>
              </div>
            </div>

            {/* Quick Color Transform Toolbar */}
            <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between gap-2 text-[11px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Màu sắc code:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const converted = normalizeColorsToPrimary(code);
                    setCode(converted);
                    setColorNotice('✨ Đã chuẩn hóa toàn bộ màu trong code sang màu Primary!');
                    setTimeout(() => setColorNotice(''), 3000);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 font-bold transition flex items-center gap-1 active:scale-95"
                  title="Tự động nhận diện và chuyển các màu cứng/màu khác sang PRIMARY (Đỏ / Hàn Quốc)"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span>Chuyển Sang Primary</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const converted = switchSectionColorTheme(code, 'secondary');
                    setCode(converted);
                    setColorNotice('🌿 Đã chuyển toàn bộ màu trong code sang màu Secondary!');
                    setTimeout(() => setColorNotice(''), 3000);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold transition flex items-center gap-1 active:scale-95"
                  title="Chuyển toàn bộ màu trong code sang SECONDARY (Xanh Lá / Đài Loan)"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Chuyển Sang Secondary</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {colorNotice && (
                  <span className="text-amber-300 text-[10px] font-bold animate-pulse">
                    {colorNotice}
                  </span>
                )}
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoConvertOnPaste}
                    onChange={(e) => setAutoConvertOnPaste(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[11px]">Tự đổi sang Primary khi dán</span>
                </label>
              </div>
            </div>

            {/* Quick Sub-component Insert Bar (If Section Mode) */}
            {itemType === 'section' && (
              <div className="px-3 py-1.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-amber-400 font-bold shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Lôi Khối Con Vào:</span>
                </span>
                <button
                  type="button"
                  onClick={() => insertSnippet('<ButtonCTA text="Đăng ký tư vấn ngay" targetSection="tu-van" />')}
                  className="px-2 py-0.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 font-bold shrink-0 transition"
                  title="Chèn component ButtonCTA chính"
                >
                  + ButtonCTA Chính
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<ButtonCTA text="Giữ ưu đãi giảm 50%" variant="secondary" targetSection="tu-van" />')}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold shrink-0 transition"
                  title="Chèn Button màu vàng nổi bật"
                >
                  + Button Vàng
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<ButtonCTA text="Xem chi tiết lộ trình" variant="outline" targetSection="courses" />')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold shrink-0 transition"
                  title="Chèn Button viền trong suốt"
                >
                  + Button Viền
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('<SectionHeading eyebrow="GIỚI THIỆU" title="Tiêu đề chính" highlight="Nổi bật" desc="Mô tả..." />')}
                  className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/40 font-bold shrink-0 transition"
                  title="Chèn cụm SectionHeading"
                >
                  + SectionHeading
                </button>
              </div>
            )}

            {/* Code Textarea */}
            <div className="flex-1 relative p-3">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onPaste={(e) => {
                  if (autoConvertOnPaste) {
                    const pastedText = e.clipboardData?.getData('text');
                    if (pastedText && pastedText.trim()) {
                      const normalized = normalizeColorsToPrimary(pastedText);
                      if (normalized !== pastedText) {
                        e.preventDefault();
                        const textarea = e.target;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const currentVal = textarea.value;
                        const newVal = currentVal.substring(0, start) + normalized + currentVal.substring(end);
                        setCode(newVal);
                        setColorNotice('✨ Đã tự động đổi màu code vừa dán sang Primary!');
                        setTimeout(() => setColorNotice(''), 3000);
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start + normalized.length;
                        }, 0);
                      }
                    }
                  }
                }}
                placeholder={
                  itemType === 'component'
                    ? "Dán code React component con tại đây (export default function TênComponent(props) { ... })"
                    : "Dán mã nguồn JSX hoặc HTML section tại đây..."
                }
                className="w-full h-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner scrollbar-thin"
                spellCheck="false"
              />
            </div>

            {/* Hint Footer in Editor */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hỗ trợ React JSX, TailwindCSS, React Icons (Fa, Md, Io, Bs...)</span>
              <span className="font-mono text-slate-500">{code.length} ký tự</span>
            </div>
          </div>

          {/* Right Pane: Live Viewport Preview */}
          <div className="hidden lg:flex flex-1 flex-col bg-slate-900/50 overflow-hidden">

            {/* Preview Header */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-300">
                  Xem Trước Trực Tiếp ({previewViewport.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {previewViewport === 'desktop'
                  ? 'Toàn màn hình laptop'
                  : previewViewport === 'tablet'
                    ? 'Độ rộng 768px'
                    : 'Độ rộng 390px'}
              </span>
            </div>

            {/* Preview Frame Wrapper */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-slate-950/40">

              <div
                className={`transition-all duration-300 w-full rounded-3xl overflow-hidden shadow-2xl border-4 ${
                  previewViewport === 'desktop'
                    ? 'max-w-5xl border-slate-800'
                    : previewViewport === 'tablet'
                      ? 'max-w-[768px] border-slate-700 shadow-blue-500/10'
                      : 'max-w-[390px] border-slate-700 shadow-blue-500/10'
                }`}
              >
                {/* Viewport indicator inside frame if mobile/tablet */}
                {previewViewport !== 'desktop' && (
                  <div className="bg-slate-800 text-slate-300 py-1.5 px-4 text-center font-mono text-[10px] font-bold border-b border-slate-700 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mô Phỏng Trình Duyệt: {previewViewport === 'tablet' ? '768px' : '390px'}</span>
                  </div>
                )}

                {/* Rendered Custom Code inside real responsive iframe */}
                <div className="bg-white">
                  <ResponsiveIframe
                    viewport={previewViewport}
                    activeTheme={activeTheme}
                    activeFont={activeFont}
                    activeRadius={activeRadius}
                    minHeight={80}
                  >
                    <div className={itemType === 'component' ? 'p-8 flex items-center justify-center min-h-[160px] bg-slate-50' : ''}>
                      <CustomCodeRenderer
                        code={code}
                        activeTheme={activeTheme}
                        activeFont={activeFont}
                        activeRadius={activeRadius}
                      />
                    </div>
                  </ResponsiveIframe>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3 shrink-0 flex-wrap">

          {/* Left Theme Info */}
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: activeTheme.primary }}
              />
              <span>Màu: <strong className="text-white">{activeTheme.primary}</strong></span>
            </span>
            <span>•</span>
            <span>Font: <strong className="text-emerald-400">{activeFont.name}</strong></span>
            <span>•</span>
            <span>Bo góc: <strong className="text-amber-400">{activeRadius}px</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Code'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadCode}
              className="hidden sm:flex px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition items-center gap-1.5 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải File (.jsx)</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition"
            >
              Hủy
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition active:scale-95 flex items-center gap-2 ${
                itemType === 'component'
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {itemType === 'component'
                  ? (editingSection ? 'Cập Nhật Component' : 'Lưu Vào Thư Viện Component')
                  : (editingSection ? 'Cập Nhật Section' : 'Lưu & Thêm Vào Trang')}
              </span>
            </button>

          </div>

        </div>

      </div>

      {/* Modal Chuyển Đổi HTML/CSS sang React + Tailwind */}
      <HtmlToReactTailwindModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onApplyConvertedCode={({ code: convertedCode, name: convertedName }) => {
          setCode(convertedCode);
          if (convertedName && (!editingSection || sectionName.includes('Mới'))) {
            setSectionName(convertedName);
          }
        }}
      />
    </div>
  );
}
