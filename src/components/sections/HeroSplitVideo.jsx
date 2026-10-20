import React, { useState } from 'react';
import { Play, Sparkles, Clock, Send, Check } from 'lucide-react';

export default function HeroSplitVideo({ data = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', target: 'HSK 4 - 5' });

  const title = data.title || "Luyện Thi Chứng Chỉ Quốc Tế & Bứt Phá Điểm Số Trong 60 Ngày";
  const subtitle = data.subtitle || "Lộ trình cá nhân hóa 1 kèm 1 và nhóm nhỏ dưới 8 học viên. Cam kết hoàn tiền 100% nếu không đạt band mục tiêu.";
  const videoUrl = data.videoUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="relative bg-slate-900 text-white py-16 lg:py-24 overflow-hidden">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Notification Bar */}
        <div className="max-w-fit mx-auto lg:mx-0 mb-6 flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium">
          <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping" />
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-slate-300">Học bổng trợ giá: <strong className="text-secondary">Chỉ còn 05 suất ưu đãi</strong> trong tháng này</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Video Container */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>

            {/* Video Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer bg-slate-800">
              <img
                src={videoUrl}
                alt="Video giới thiệu lớp học"
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-secondary text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    aria-label="Phát video lớp học"
                  >
                    <Play className="w-6 h-6 fill-slate-950 ml-1" />
                  </button>
                  <div>
                    <h4 className="text-white font-bold text-base">Xem 3 phút lớp học thực tế</h4>
                    <p className="text-slate-300 text-xs">Phương pháp phản xạ thực chiến không áp lực</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Lead Capture Box */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border-4 border-slate-100/50">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Đăng Ký Tư Vấn Cấp Tốc
                </div>
                <h3 className="font-heading font-black text-2xl text-slate-900">Nhận Đề Thi Thử & Lộ Trình</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Kiểm tra trình độ miễn phí và nhận phân tích điểm yếu 1 kèm 1</p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-800 text-lg">Đã Gửi Thành Công!</h4>
                  <p className="text-xs text-emerald-600 px-4">Chuyên viên khảo thí sẽ liên hệ qua Zalo/SĐT trong 15 phút tới.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Họ và tên của bạn *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mục tiêu bạn hướng tới
                    </label>
                    <select
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    >
                      <option value="Căn bản cho người mới bắt đầu">Căn bản cho người mới bắt đầu</option>
                      <option value="Giao tiếp văn phòng & phỏng vấn">Giao tiếp văn phòng & phỏng vấn</option>
                      <option value="Luyện thi chứng chỉ HSK / PTE">Luyện thi chứng chỉ HSK / PTE</option>
                      <option value="Du học & Định cư">Du học & Định cư</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-950 font-black text-base shadow-lg shadow-secondary/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Đăng Ký Nhận Lộ Trình Ngay</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Thông tin của bạn được bảo mật 100%. Không spam cuộc gọi.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
