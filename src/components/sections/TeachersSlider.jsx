import React, { useState } from 'react';
import { Award, GraduationCap, ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';

export default function TeachersSlider({ data = {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const title = data.title || "Đội Ngũ Giảng Viên Chuyên Môn & Bản Xứ";
  const subtitle = data.subtitle || "100% Giảng viên tốt nghiệp Thạc sĩ chuyên ngành sư phạm, giàu năng lượng và đồng hành sửa phát âm từng học viên.";

  const teachers = data.teachers || [
    {
      name: "ThS. Trương Lệ Quyên",
      role: "Trưởng Bộ Môn Tiếng Trung Giao Tiếp",
      degree: "Thạc sĩ Ngôn ngữ ĐH Ngôn Ngữ Bắc Kinh (BLCU)",
      cert: "HSK 6 (292/300) • 10 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      quote: "Học ngoại ngữ không phải để nhớ thuộc lòng ngữ pháp, mà để mở ra một góc nhìn mới và tự tin kết nối với thế giới.",
      specialty: ["Phát âm chuẩn Bắc Kinh", "Giao tiếp thương mại", "Tâm lý học đường"]
    },
    {
      name: "ThS. Vương Khắc Cường",
      role: "Chuyên Gia Luyện Thi HSK 5 - 6",
      degree: "Tốt nghiệp Xuất Sắc ĐH Sư Phạm Hoa Đông",
      cert: "Chuyên gia khảo thí HSK • 8 năm luyện thi cấp tốc",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      quote: "Chiến thuật làm bài đúng đắn sẽ giúp bạn tăng ít nhất 30 - 40 điểm thi mà không cần cày cuốc thâu đêm.",
      specialty: ["Mẹo tránh bẫy đề HSK", "Luyện viết đoạn văn 99 điểm", "Ngữ pháp nâng cao"]
    },
    {
      name: "Cô Hoàng Mỹ Linh",
      role: "Giảng Viên Bản Ngữ & Phản Xạ 1-1",
      degree: "Thạc sĩ Giáo dục ĐH Đài Loan (NTU)",
      cert: "Chứng chỉ Giảng dạy Quốc tế TCSOL • 6 năm giảng dạy",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
      quote: "Mỗi buổi học là một không gian trải nghiệm vui vẻ, tạo phản xạ tự nhiên như người bản xứ từ câu nói đầu tiên.",
      specialty: ["Khẩu hình & ngữ điệu tự nhiên", "Văn hóa ứng xử bản địa", "Kèm phát âm chi tiết"]
    }
  ];

  const nextTeacher = () => {
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  };

  const prevTeacher = () => {
    setCurrentIndex((prev) => (prev - 1 + teachers.length) % teachers.length);
  };

  return (
    <section id="teachers" className="py-16 lg:py-24 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Nav Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
              Tận Tâm • Trách Nhiệm • Chuẩn Sư Phạm
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>

          {/* Slider Arrow Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTeacher}
              className="p-3 rounded-xl border border-slate-200 hover:border-primary text-slate-700 hover:text-primary hover:bg-primary/5 transition-all active:scale-95 shadow-sm"
              aria-label="Giảng viên trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTeacher}
              className="p-3 rounded-xl bg-primary hover:bg-primary-dark text-white transition-all active:scale-95 shadow-md shadow-primary/20"
              aria-label="Giảng viên tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((t, idx) => (
            <div
              key={idx}
              className={`rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden hover:bg-white hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between ${
                currentIndex === idx ? 'ring-2 ring-primary bg-white shadow-xl' : ''
              }`}
            >
              <div>
                {/* Photo with Overlay Badge */}
                <div className="relative h-72 overflow-hidden bg-slate-200">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                    <span>Giảng viên tiêu biểu</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">
                      {t.name}
                    </h3>
                    <p className="text-xs font-bold text-primary mt-1">
                      {t.role}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-slate-700 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                      <span>{t.degree}</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1.5 pl-5">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t.cert}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed border-l-2 border-secondary pl-3">
                    "{t.quote}"
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/60">
                  {t.specialty.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
