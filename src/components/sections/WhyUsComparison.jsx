import React from 'react';
import { Check, X, Shield, Award, Users, BookOpen, Clock, HeartHandshake } from 'lucide-react';

export default function WhyUsComparison({ data = {} }) {
  const title = data.title || "Tại Sao Hơn 10.000 Học Viên Lựa Chọn Chúng Tôi?";
  const subtitle = data.subtitle || "Sự khác biệt vượt trội về phương pháp giảng dạy, hỗ trợ tận tâm và cam kết bảo chứng kết quả đầu ra rõ ràng.";

  const comparisonRows = [
    {
      feature: "Phương pháp giảng dạy",
      us: "Phản xạ đa giác quan, ứng dụng thực tế 80% thời lượng",
      others: "Học lý thuyết ngữ pháp nặng nề, ít cơ hội nói",
    },
    {
      feature: "Sĩ số lớp học",
      us: "Giới hạn tối đa 6 - 8 học viên / lớp (giáo viên sửa từng câu)",
      others: "Đông đúc từ 20 - 30 người, ít được tương tác",
    },
    {
      feature: "Đội ngũ giảng viên",
      us: "100% Thạc sĩ sư phạm, có chứng chỉ cao cấp & giáo viên bản xứ",
      others: "Sinh viên trợ giảng hoặc giáo viên thiếu nghiệp vụ sư phạm",
    },
    {
      feature: "Cam kết đầu ra",
      us: "Ký cam kết văn bản pháp lý, học lại hoàn toàn 0Đ nếu không đạt",
      others: "Hứa hẹn miệng, không có chính sách học lại rõ ràng",
    },
    {
      feature: "Hỗ trợ ngoài giờ",
      us: "Trợ giảng kèm 1-1, câu lạc bộ giao tiếp & sửa bài mỗi ngày",
      others: "Chỉ học trên lớp, hết giờ tự bơi không ai hỗ trợ",
    },
  ];

  const pillarCards = [
    {
      icon: Award,
      title: "Chứng Nhận Chuẩn Quốc Tế",
      desc: "Giáo trình cập nhật bám sát format đề thi quốc tế mới nhất.",
    },
    {
      icon: Clock,
      title: "Tiết Kiệm 50% Thời Gian",
      desc: "Rút ngắn lộ trình từ 1 năm xuống còn 3-4 tháng nhờ phương pháp tinh gọn.",
    },
    {
      icon: HeartHandshake,
      title: "Đồng Hành Trọn Đời",
      desc: "Miễn phí tham gia sinh hoạt CLB ngoại ngữ và sửa hồ sơ, CV trọn đời.",
    },
  ];

  return (
    <section id="why" className="py-16 lg:py-24 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Bảo Chứng Chất Lượng Đào Tạo
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="mb-16 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <div className="grid grid-cols-12 bg-slate-900 text-white font-heading font-extrabold text-center text-xs sm:text-base">
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-left text-slate-300">
              Tiêu chí so sánh
            </div>
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 bg-primary text-white flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Tại Trung Tâm Của Chúng Tôi
            </div>
            <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-slate-400 bg-slate-800">
              Tự học / Trung tâm thông thường
            </div>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            {comparisonRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 text-xs sm:text-sm items-center hover:bg-slate-50/70 transition-colors">
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 font-bold text-slate-800">
                  {row.feature}
                </div>
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 bg-primary/5 font-semibold text-slate-900 flex items-start gap-2 border-x border-primary/10">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{row.us}</span>
                </div>
                <div className="col-span-4 sm:col-span-4 p-4 sm:p-5 text-slate-500 flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{row.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillarCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
