import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function FooterSection({ data = {} }) {
  const brandName = data.brandName || "TẤN SANH NGỮ";
  const brandSlogan = data.brandSlogan || "Học Viện Ngoại Ngữ Chuyên Sâu";
  const hotline = data.hotline || "0988.123.456";
  const email = data.email || "tuyensinh@tansanhngu.edu.vn";

  const branches = data.branches || [
    { name: "Cơ sở 1 (TP.HCM)", address: "Số 123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1" },
    { name: "Cơ sở 2 (Hà Nội)", address: "Số 45 Trần Thái Tông, Dịch Vọng Hậu, Quận Cầu Giấy" },
    { name: "Đào tạo Trực tuyến", address: "Hệ thống LMS chuyên nghiệp dành cho học viên toàn quốc" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-heading font-black text-xl text-white tracking-tight">
                  {brandName}
                </span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {brandSlogan}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Đơn vị tiên phong ứng dụng phương pháp phản xạ đa giác quan trong đào tạo ngoại ngữ thực chiến. Cam kết chất lượng chuẩn đầu ra bằng văn bản.
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>Hotline tuyển sinh: <strong className="text-white">{hotline}</strong> (24/7)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>Email: <strong className="text-white">{email}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-secondary shrink-0" />
                <span>Giờ làm việc: 08:00 - 21:30 (Thứ 2 đến Chủ Nhật)</span>
              </div>
            </div>
          </div>

          {/* Campuses */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Hệ Thống Cơ Sở Đào Tạo
            </h4>
            <div className="space-y-3">
              {branches.map((b, idx) => (
                <div key={idx} className="text-xs sm:text-sm space-y-0.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{b.name}</span>
                  </div>
                  <p className="text-slate-400 pl-5 text-xs">{b.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Policies & Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Chính Sách & Bảo Vệ Học Viên
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">• Cam kết chuẩn đầu ra văn bản</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Chính sách học bù & bảo lưu</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Điều khoản bảo mật thông tin</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Hỗ trợ trả góp học phí 0%</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 {brandName}. Bảo lưu mọi quyền. Giấy phép hoạt động giáo dục số 1234/QĐ-SGDĐT.
          </div>
          <div className="flex items-center gap-1">
            <span>Thiết kế & phát triển cho các dự án Landing Page Giáo Dục</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
