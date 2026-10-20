import React, { useState } from 'react';
import { Briefcase, GraduationCap, RefreshCw, Globe, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

export default function NeedsCategorized({ data = {} }) {
  const [activeTab, setActiveTab] = useState(0);

  const title = data.title || "Khóa Học Thiết Kế Chuyên Biệt Theo Đúng Mục Tiêu Của Bạn";
  const subtitle = data.subtitle || "Không áp dụng một giáo trình đại trà cho tất cả. Mỗi đối tượng học viên có quỹ thời gian, nhu cầu thực tiễn và lộ trình riêng biệt.";

  const items = data.items || [
    {
      id: "di-lam",
      tabLabel: "Người Đi Làm & Doanh Nghiệp",
      icon: Briefcase,
      badge: "Lịch học linh hoạt",
      heading: "Cần Tiếng Trung Giao Tiếp Đàm Phán & Gặp Khách Hàng",
      desc: "Tập trung 100% vào hội thoại thương mại, viết email chuẩn chỉnh, kỹ năng thương lượng giá và phỏng vấn vào các tập đoàn đa quốc gia.",
      highlights: [
        "Lịch học buổi tối & cuối tuần, có thể đổi ca linh động",
        "Bộ từ vựng và kịch bản hội thoại chuẩn ngành nghề thực tế",
        "Tự tin giao tiếp với đối tác Trung - Đài sau 8 tuần"
      ],
      ctaText: "Xem lộ trình cho người đi làm",
      href: "#register"
    },
    {
      id: "mat-goc",
      tabLabel: "Người Mất Gốc / Mới Bắt Đầu",
      icon: RefreshCw,
      badge: "Kèm 1-1 không áp lực",
      heading: "Sợ Chữ Hán Khó Nhớ & Phát Âm Sai Ngay Từ Đầu?",
      desc: "Xóa bỏ rào cản sợ chữ tượng hình bằng phương pháp liên tưởng hình ảnh độc quyền. Chỉnh khẩu hình chuẩn bản xứ từ bảng chữ cái Pinyin.",
      highlights: [
        "Phát âm chuẩn xác 100%, không bị ngọng hay sai thanh điệu",
        "Phương pháp ghi nhớ 500 chữ Hán căn bản chỉ qua 15 ngày",
        "Trợ giảng bản ngữ đồng hành sửa bài mỗi ngày qua audio"
      ],
      ctaText: "Nhận giáo trình cho người mới",
      href: "#register"
    },
    {
      id: "chung-chi",
      tabLabel: "Luyện Thi Chứng Chỉ HSK / HSKK",
      icon: GraduationCap,
      badge: "Cam kết đỗ 100%",
      heading: "Cần Bằng HSK Cấp Tốc Để Tốt Nghiệp & Thăng Tiến",
      desc: "Chiến thuật làm bài độc quyền, luyện trực tiếp trên kho đề thi thật có cập nhật mới nhất. Mẹo tránh bẫy ngữ pháp và tối ưu điểm phần thi Nghe - Đọc.",
      highlights: [
        "Đảm bảo vượt band HSK 3, 4, 5 với điểm số ấn tượng",
        "Luyện đề thi thử trên phần mềm mô phỏng phòng thi thật",
        "Tặng bộ tài liệu tổng hợp ngữ pháp và từ vựng trọng tâm"
      ],
      ctaText: "Đăng ký thi thử & xem đề mẫu",
      href: "#register"
    },
    {
      id: "du-hoc",
      tabLabel: "Du Học & Xuất Khẩu Lao Động",
      icon: Globe,
      badge: "Hỗ trợ thủ tục hồ sơ",
      heading: "Chuẩn Bị Sang Trung Quốc / Đài Loan Làm Việc & Học Tập",
      desc: "Trang bị vốn từ sinh hoạt thực tế, văn hóa ứng xử bản địa và hỗ trợ toàn diện hồ sơ xin học bổng toàn phần các trường đại học top đầu.",
      highlights: [
        "Giao tiếp thành thạo các tình huống đời sống sinh hoạt",
        "Hướng dẫn viết thư giới thiệu, CV và luyện phỏng vấn visa",
        "Kết nối cộng đồng du học sinh và cơ hội học bổng giá trị"
      ],
      ctaText: "Tư vấn hồ sơ du học",
      href: "#register"
    }
  ];

  const currentItem = items[activeTab] || items[0];
  const CurrentIcon = currentItem.icon;

  return (
    <section id="needs" className="py-16 lg:py-24 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Phân Loại Theo Nhu Cầu Thực Tế
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {items.map((tab, idx) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white text-slate-600 hover:text-primary hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-slate-500'}`} />
                <span>{tab.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Content Showcase Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 transition-all duration-500">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Details & Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-slate-900 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {currentItem.badge}
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 leading-snug">
                {currentItem.heading}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentItem.desc}
              </p>

              {/* Highlights checklist */}
              <div className="space-y-3 pt-2">
                {currentItem.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Link */}
              <div className="pt-4">
                <a
                  href={currentItem.href}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all group"
                >
                  <span>{currentItem.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: Visual Feature Box */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/15 border border-primary/20 space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
                  <CurrentIcon className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-lg">
                    Cam Kết Đầu Ra Bằng Hợp Đồng
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    Kiểm tra đánh giá năng lực liên tục sau mỗi 4 buổi học. Học viên được hỗ trợ học bù và bảo lưu thời gian linh hoạt trong 365 ngày.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-between text-left">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Hình thức học</div>
                    <div className="text-xs font-bold text-slate-800">Trực tiếp tại lớp hoặc Online 1-1</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs">
                    Có lớp mới
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
