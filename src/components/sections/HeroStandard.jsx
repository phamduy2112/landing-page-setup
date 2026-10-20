import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Users, Trophy } from 'lucide-react';

export default function HeroStandard({ data = {} }) {
  const badgeText = data.badgeText || "⭐ Top 1 Học Viện Ngoại Ngữ Ứng Dụng Thực Chiến";
  const title = data.title || "Làm Chủ Tiếng Trung Giao Tiếp & Thi Đạt HSK Sau 3 Tháng";
  const subtitle = data.subtitle || "Phương pháp phản xạ đa giác quan độc quyền giúp người bận rộn nói lưu loát, tự tin phỏng vấn việc làm và du học mà không cần học vẹt.";
  const ctaPrimary = data.ctaPrimary || "Nhận Lộ Trình & Học Thử 0Đ";
  const ctaSecondary = data.ctaSecondary || "Xem Lịch Khai Giảng Mới Nhất";

  const stats = data.stats || [
    { number: "10.000+", label: "Học viên tốt nghiệp", icon: Users },
    { number: "98.5%", label: "Tỉ lệ đỗ chứng chỉ", icon: Trophy },
    { number: "100%", label: "Cam kết bằng văn bản", icon: ShieldCheck },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold tracking-wide shadow-sm animate-fadeIn">
              <Sparkles className="w-4 h-4 text-secondary fill-secondary" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              {title.split("&").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-primary font-black"> & </span>}
                  {part}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-900 font-extrabold text-base shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>{ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </a>

              <a
                href="#schedule"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border-2 border-slate-200 hover:border-primary/40 shadow-sm transition-all"
              >
                <span>{ctaSecondary}</span>
              </a>
            </div>

            {/* Key Trust Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Không mất gốc, học là ứng dụng ngay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hoàn 100% học phí nếu không đạt cam kết</span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              {stats.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="font-heading font-black text-2xl sm:text-3xl text-primary tracking-tight">
                      {item.number}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Hero Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-primary/30 to-secondary/40 blur-xl opacity-70 -z-10" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
                  alt="Lớp học ngoại ngữ tương tác"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Cam Kết Đầu Ra 100%</h4>
                      <p className="text-[11px] text-slate-600">Được học lại hoàn toàn miễn phí nếu không đạt điểm chuẩn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Top Badge */}
              <div className="absolute -top-4 -left-4 bg-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-slate-900 font-extrabold text-sm">
                  🔥
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ưu Đãi Hôm Nay</div>
                  <div className="text-xs font-black text-primary">Giảm 35% Học Phí Khóa Mới</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
