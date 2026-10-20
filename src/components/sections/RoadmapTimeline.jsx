import React from 'react';
import { CheckCircle2, ArrowRight, Zap, Target, Award, Rocket } from 'lucide-react';

export default function RoadmapTimeline({ data = {} }) {
  const title = data.title || "Lộ Trình Tinh Gọn 4 Bước Từ Số 0 Đến Lưu Loát";
  const subtitle = data.subtitle || "Từng chặng được đo lường kết quả rõ ràng, cam kết đạt chuẩn năng lực sau mỗi giai đoạn.";

  const steps = data.steps || [
    {
      step: "01",
      icon: Zap,
      title: "Khởi Động & Chuẩn Hóa Phát Âm",
      duration: "Tuần 1 - Tuần 2",
      badge: "Pinyin & Thanh Điệu",
      desc: "Luyện khẩu hình chuẩn xác 100%, xóa bỏ tật ngọng thanh 1 - thanh 4. Nhớ quy tắc ghép âm và 50 câu chào hỏi quen thuộc.",
      outcome: "Tự đọc chuẩn bất kỳ từ nào có phiên âm không cần giáo viên hỗ trợ.",
    },
    {
      step: "02",
      icon: Target,
      title: "Tích Lũy Vốn Từ & Ngữ Pháp Ứng Dụng",
      duration: "Tuần 3 - Tuần 6",
      badge: "600 Từ Vựng Cốt Lõi",
      desc: "Phương pháp liên tưởng hình ảnh độc quyền giúp nhớ chữ Hán không quên. Thực hành nối câu giao tiếp theo các chủ đề thiết yếu.",
      outcome: "Giao tiếp cơ bản về gia đình, ăn uống, chỉ đường, mua sắm và tiền tệ.",
    },
    {
      step: "03",
      icon: Rocket,
      title: "Phản Xạ Tự Nhiên & Hội Thoại Chuyên Sâu",
      duration: "Tuần 7 - Tuần 10",
      badge: "Phản Xạ Đa Giác Quan",
      desc: "Nâng cao tốc độ phản hồi dưới 2 giây. Luyện nghe các ngữ điệu bản xứ và xử lý tình huống phát sinh trong môi trường công sở.",
      outcome: "Tự tin thảo luận công việc, phỏng vấn tuyển dụng và đi du lịch độc lập.",
    },
    {
      step: "04",
      icon: Award,
      title: "Luyện Đề Thực Chiến & Cán Đích Chứng Chỉ",
      duration: "Tuần 11 - Tuần 12",
      badge: "Cán Mốc HSK 3 - 4",
      desc: "Giải đề thi thật, rèn chiến thuật phân bổ thời gian và mẹo tránh bẫy câu hỏi khó. Thi thử định kỳ trên phần mềm chuẩn phòng thi.",
      outcome: "Đạt chứng chỉ quốc tế và sử dụng tiếng Trung thành thạo như ngôn ngữ thứ hai.",
    },
  ];

  return (
    <section id="roadmap" className="py-16 lg:py-24 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Lộ Trình Học Rõ Ràng & Minh Bạch
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl bg-slate-50 p-6 sm:p-7 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading font-black text-3xl text-primary/30 group-hover:text-primary transition-colors">
                      {st.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-bold text-xs mb-3">
                    {st.duration}
                  </span>

                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 leading-snug">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {st.desc}
                  </p>
                </div>

                {/* Outcome badge */}
                <div className="pt-4 border-t border-slate-200/60 bg-primary/5 -mx-6 -mb-6 p-4 rounded-b-3xl">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {st.outcome}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-heading font-bold text-xl sm:text-2xl">
              Bạn chưa rõ mình đang ở giai đoạn nào?
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm">
              Làm bài kiểm tra năng lực đầu vào miễn phí (15 phút) cùng giáo viên chuyên môn.
            </p>
          </div>
          <a
            href="#register"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
          >
            Đăng Ký Test Trình Độ 0Đ
          </a>
        </div>

      </div>
    </section>
  );
}
