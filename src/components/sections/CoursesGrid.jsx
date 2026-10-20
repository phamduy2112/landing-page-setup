import React from 'react';
import { Clock, Users, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function CoursesGrid({ data = {} }) {
  const title = data.title || "Các Chương Trình Đào Tạo Tiêu Biểu";
  const subtitle = data.subtitle || "Lựa chọn khóa học phù hợp với quỹ thời gian và mục tiêu của bạn để đạt hiệu quả cao nhất.";

  const courses = data.courses || [
    {
      id: "course-1",
      badge: "Phổ Biến Nhất",
      isPopular: true,
      title: "Tiếng Trung Giao Tiếp Toàn Diện",
      target: "Người mới bắt đầu hoặc người mất gốc hoàn toàn",
      duration: "3 Tháng (36 buổi)",
      classSize: "6 - 8 Học viên",
      price: "4.500.000đ",
      originalPrice: "6.800.000đ",
      features: [
        "Làm chủ phát âm Pinyin chuẩn giọng Bắc Kinh",
        "Nắm chắc 600 từ vựng và 50 cấu trúc ngữ pháp giao tiếp",
        "Giao tiếp trôi chảy 25 chủ đề đời sống và công việc",
        "Tặng kèm khóa luyện viết chữ Hán 0Đ"
      ],
      ctaText: "Đăng Ký Giữ Chỗ Ưu Đãi",
      href: "#register"
    },
    {
      id: "course-2",
      badge: "Cam Kết Điểm Số",
      isPopular: false,
      title: "Luyện Thi Chứng Chỉ HSK 3 - 4 Cấp Tốc",
      target: "Sinh viên cần bằng tốt nghiệp & người đi làm thăng tiến",
      duration: "2.5 Tháng (30 buổi)",
      classSize: "8 - 10 Học viên",
      price: "5.200.000đ",
      originalPrice: "7.500.000đ",
      features: [
        "Chiến lược giải đề bẫy và tối ưu thời gian thi",
        "Luyện trực tiếp trên ngân hàng đề thi thật 5 năm gần nhất",
        "Đảm bảo đỗ HSK 4 với điểm số trên 240/300 điểm",
        "Hỗ trợ thủ tục đăng ký thi chính thức tại điểm thi"
      ],
      ctaText: "Tư Vấn Lộ Trình HSK",
      href: "#register"
    },
    {
      id: "course-3",
      badge: "Doanh Nghiệp",
      isPopular: false,
      title: "Tiếng Trung Thương Mại & Đàm Phán",
      target: "Chủ shop, quản lý xưởng, chuyên viên xuất nhập khẩu",
      duration: "2 Tháng (24 buổi)",
      classSize: "4 - 6 Học viên (Kèm sát)",
      price: "6.800.000đ",
      originalPrice: "9.500.000đ",
      features: [
        "Kỹ năng thương lượng giá cả, ký kết hợp đồng thương mại",
        "Bộ thuật ngữ chuyên sâu ngành dệt may, linh kiện, logistic",
        "Viết email, soạn báo giá và tiếp đón đối tác bản địa",
        "Thực hành đóng vai tình huống giao dịch thực tế"
      ],
      ctaText: "Xem Giáo Trình Thương Mại",
      href: "#register"
    }
  ];

  return (
    <section id="courses" className="py-16 lg:py-24 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Chương Trình Đào Tạo Chuẩn Khung Châu Âu
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative rounded-3xl bg-white p-8 flex flex-col justify-between transition-all duration-300 ${course.isPopular
                ? 'ring-2 ring-primary shadow-2xl lg:-translate-y-2'
                : 'border border-slate-200/80 shadow-lg hover:shadow-xl'
                }`}
            >
              {/* Top Popular Tag */}
              {course.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary text-slate-950 font-black text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{course.badge}</span>
                </div>
              )}

              <div>
                {/* Badge if not popular */}
                {!course.isPopular && (
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
                    {course.badge}
                  </span>
                )}

                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-1 mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mb-6 min-h-[32px]">
                  {course.target}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through block">
                      {course.originalPrice}
                    </span>
                    <span className="font-heading font-black text-2xl text-primary">
                      {course.price}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-600 font-extrabold text-xs">
                    Tiết kiệm 35%
                  </span>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{course.classSize}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {course.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href={course.href}
                  className={`w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${course.isPopular
                    ? 'bg-secondary hover:bg-secondary-hover text-slate-950 shadow-secondary/20'
                    : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                    }`}
                >
                  <span>{course.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
