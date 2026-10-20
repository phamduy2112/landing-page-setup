import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function OpeningScheduleTable({ data = {} }) {
  const title = data.title || "Lịch Khai Giảng Dự Kiến Tháng Này";
  const subtitle = data.subtitle || "Sĩ số giới hạn 6 - 8 học viên mỗi lớp để đảm bảo chất lượng sửa phát âm từng học viên.";

  const classes = data.classes || [
    {
      code: "TT-CB01",
      name: "Tiếng Trung Giao Tiếp Căn Bản",
      schedule: "Tối Thứ 2 - 4 - 6",
      time: "18:30 - 20:00",
      startDate: "15/11/2026",
      format: "Trực Tiếp (Cơ sở 1)",
      teacher: "ThS. Trương Lệ Quyên",
      seatsLeft: 2,
      status: "Sắp đầy",
    },
    {
      code: "TT-HSK04",
      name: "Luyện Thi Chứng Chỉ HSK 4 Cấp Tốc",
      schedule: "Tối Thứ 3 - 5 - 7",
      time: "19:30 - 21:00",
      startDate: "18/11/2026",
      format: "Trực Tiếp (Cơ sở 2)",
      teacher: "ThS. Vương Khắc Cường",
      seatsLeft: 3,
      status: "Còn 3 chỗ",
    },
    {
      code: "TT-ON02",
      name: "Giao Tiếp Phản Xạ Online Kèm Sát",
      schedule: "Tối Thứ 2 - 4 - 6",
      time: "20:00 - 21:30",
      startDate: "20/11/2026",
      format: "Online Tương Tác Trực Tuyến",
      teacher: "Cô Hoàng Mỹ Linh (Bản ngữ)",
      seatsLeft: 1,
      status: "Chỉ còn 1 chỗ",
    },
    {
      code: "TT-TM01",
      name: "Tiếng Trung Thương Mại & Đàm Phán",
      schedule: "Thứ 7 & Chủ Nhật",
      time: "09:00 - 11:30",
      startDate: "25/11/2026",
      format: "Trực Tiếp (Cơ sở 1)",
      teacher: "ThS. Nguyễn Đình Nam",
      seatsLeft: 4,
      status: "Đang nhận học viên",
    },
  ];

  return (
    <section id="schedule" className="py-16 lg:py-24 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Đăng Ký Sớm Nhận Ưu Đãi 35%
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Schedule Table / Card View */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 bg-slate-900 text-white p-5 font-heading font-bold text-sm tracking-wide">
            <div className="col-span-4">Lớp Học & Khóa Đào Tạo</div>
            <div className="col-span-3">Thời Gian & Lịch Học</div>
            <div className="col-span-2">Hình Thức & Giảng Viên</div>
            <div className="col-span-3 text-right pr-4">Tình Trạng & Đăng Ký</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {classes.map((cls, idx) => (
              <div
                key={idx}
                className="p-6 lg:p-5 grid lg:grid-cols-12 gap-4 lg:gap-0 items-center hover:bg-slate-50 transition-colors"
              >
                {/* Class name & code */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px] font-bold">
                      {cls.code}
                    </span>
                    <span className="text-xs text-primary font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Khai giảng: {cls.startDate}
                    </span>
                  </div>
                  <h4 className="font-heading font-extrabold text-base text-slate-900">
                    {cls.name}
                  </h4>
                </div>

                {/* Schedule & time */}
                <div className="lg:col-span-3 space-y-1 text-sm text-slate-600">
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="text-xs text-slate-500 pl-6">
                    Khung giờ: {cls.time}
                  </div>
                </div>

                {/* Format & teacher */}
                <div className="lg:col-span-2 space-y-1 text-xs text-slate-600">
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{cls.format}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1.5 pl-5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cls.teacher}</span>
                  </div>
                </div>

                {/* Seat status & CTA */}
                <div className="lg:col-span-3 flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      cls.seatsLeft <= 2
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cls.status}
                  </span>

                  <a
                    href="#register"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap"
                  >
                    Giữ Chỗ Ngay
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
