import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Award } from 'lucide-react';

export default function FeedbackSlider({ data = {} }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const title = data.title || "Câu Chuyện Thành Công Từ Hơn 10.000 Học Viên";
  const subtitle = data.subtitle || "Những kết quả thật, điểm số thật và sự thay đổi tích cực trong công việc sau khi hoàn thành khóa học.";

  const testimonials = data.testimonials || [
    {
      name: "Nguyễn Thùy Linh",
      target: "Nhân viên Thu mua quốc tế (Cty Logistic)",
      score: "Đạt HSK 5 (275/300 điểm) sau 4 tháng",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      content: "Trước đây mình từng tự học online 6 tháng nhưng không thể mở miệng nói được một câu hoàn chỉnh vì sợ sai. Tại trung tâm, cô Quyên kèm khẩu hình từng từ và cho thực hành kịch bản gọi điện, đàm phán giá thật sự. Giờ mình đã tự tin phụ trách toàn bộ nhà cung cấp Trung Quốc!",
      tags: ["Khóa Giao Tiếp & Thương Mại", "Tăng lương 40%"]
    },
    {
      name: "Trần Minh Hoàng",
      target: "Sinh viên ĐH Ngoại Thương",
      score: "Vượt chuẩn đầu ra HSK 4 (280/300) sau 2.5 tháng",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      content: "Khóa luyện thi cấp tốc đúng nghĩa cứu cánh cho mình. Phương pháp giải đề và nhận diện bẫy ngữ pháp của thầy Cường cực kỳ sắc bén. Mình chỉ cần tập trung làm đúng theo lộ trình mỗi ngày 1 tiếng là điểm thi cao vượt mong đợi.",
      tags: ["Luyện Thi HSK Cấp Tốc", "Học bổng du học"]
    },
    {
      name: "Lê Phương Thảo",
      target: "Chủ thương hiệu thời trang thiết kế",
      score: "Tự đi xưởng Quảng Châu đánh hàng chỉ sau 8 tuần",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      content: "Mình học không để thi bằng mà để trực tiếp sang Quảng Châu thương lượng giá với các xưởng may. Giáo trình của lớp may đo sát sàn sạt, từ cách chào hỏi, trả giá, thỏa thuận số lượng đến điều khoản gửi hàng. Quá xứng đáng với số tiền đầu tư!",
      tags: ["Tiếng Trung Buôn Bán", "Tiết kiệm 50 triệu tiền qua trung gian"]
    }
  ];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="feedback" className="py-16 lg:py-24 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Bằng Chứng Người Thật • Việc Thật
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/15" />
                </div>

                {/* Score badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.score}</span>
                </div>

                {/* Testimonial body */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* Student info */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.target}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-bold text-slate-700 text-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>98.6% Học viên hài lòng về chất lượng giảng dạy</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>85% Học viên mới do học viên cũ giới thiệu</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Được hỗ trợ bảo lưu và học bù miễn phí 100%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
