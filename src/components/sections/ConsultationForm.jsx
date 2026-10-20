import React, { useState } from 'react';
import { Gift, CheckCircle, ShieldCheck, Send, Sparkles, Clock, Phone, MapPin } from 'lucide-react';

export default function ConsultationForm({ data = {} }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'Tiếng Trung Giao Tiếp Căn Bản',
    campus: 'Cơ sở 1: Quận 1, TP.HCM',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const title = data.title || "Đăng Ký Nhận Lộ Trình Học & Ưu Đãi 35% Học Phí";
  const subtitle = data.subtitle || "Điền thông tin để chuyên viên khảo thí liên hệ tư vấn lộ trình phù hợp nhất với quỹ thời gian của bạn.";

  const gifts = data.gifts || [
    { title: "Voucher Giảm 35% Học Phí", desc: "Áp dụng cho 10 học viên đăng ký sớm nhất tuần này" },
    { title: "Bộ Giáo Trình & Video Pinyin Bản Quyền", desc: "Trị giá 500.000đ gửi qua Zalo ngay sau khi đăng ký" },
    { title: "01 Buổi Học Thử Trực Tiếp Miễn Phí", desc: "Trải nghiệm phương pháp phản xạ độc quyền cùng giáo viên bản xứ" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <section id="register" className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden transition-colors">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Incentives & Trust */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary text-xs sm:text-sm font-bold">
              <Gift className="w-4 h-4" />
              <span>Quà Tặng Giới Hạn Dành Cho Học Viên Mới</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>

            {/* Gifts Checklist */}
            <div className="space-y-4 pt-2">
              {gifts.map((g, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm sm:text-base">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {g.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Footer */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo mật thông tin 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Phản hồi trong 15 phút</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-900 shadow-2xl border-4 border-white/10">
              
              <div className="text-center mb-8 space-y-1">
                <h3 className="font-heading font-black text-2xl text-slate-900">
                  Nhận Tư Vấn & Đặt Lịch Học Thử
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Vui lòng để lại thông tin chính xác để nhận quà tặng qua Zalo
                </p>
              </div>

              {isSuccess ? (
                <div className="py-12 px-6 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-emerald-900 text-xl">
                    Đăng Ký Thành Công!
                  </h4>
                  <p className="text-sm text-emerald-700 max-w-sm mx-auto">
                    Cảm ơn bạn! Chuyên viên khảo thí sẽ gửi bộ tài liệu và liên hệ tư vấn qua SĐT/Zalo <strong className="font-bold text-emerald-900">{formData.phone}</strong> trong ít phút.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Gửi lại thông tin khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Họ và tên của bạn *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email nhận tài liệu
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Khóa học bạn quan tâm *
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50/50"
                    >
                      <option value="Tiếng Trung Giao Tiếp Căn Bản">Tiếng Trung Giao Tiếp Căn Bản (Người mới)</option>
                      <option value="Luyện Thi HSK 3 - 4 Cấp Tốc">Luyện Thi HSK 3 - 4 Cấp Tốc</option>
                      <option value="Tiếng Trung Thương Mại & Đàm Phán">Tiếng Trung Thương Mại & Đàm Phán</option>
                      <option value="Lớp Kèm 1-1 Theo Yêu Cầu">Lớp Kèm 1-1 Theo Yêu Cầu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Cơ sở học thuận tiện nhất *
                    </label>
                    <select
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-slate-50/50"
                    >
                      <option value="Cơ sở 1: Quận 1, TP.HCM">Cơ sở 1: Quận 1, TP.HCM</option>
                      <option value="Cơ sở 2: Quận Cầu Giấy, Hà Nội">Cơ sở 2: Quận Cầu Giấy, Hà Nội</option>
                      <option value="Lớp Học Online Tương Tác Trực Tuyến">Lớp Học Online Tương Tác Trực Tuyến</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-950 font-black text-base shadow-xl shadow-secondary/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Nhận Ưu Đãi 35% & Lộ Trình Ngay</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    🔒 Chúng tôi cam kết không spam cuộc gọi ngoài mục đích tư vấn.
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
