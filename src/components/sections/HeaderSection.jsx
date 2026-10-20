import React, { useState } from 'react';
import { Phone, Calendar, Menu, X, GraduationCap, ChevronRight } from 'lucide-react';

export default function HeaderSection({ data = {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = data.brandName || "TẤN SANH NGỮ";
  const brandSlogan = data.brandSlogan || "Học Viện Ngoại Ngữ Chuyên Sâu";
  const hotline = data.hotline || "0988.123.456";
  const navLinks = data.navLinks || [
    { label: "Khóa học", href: "#courses" },
    { label: "Lộ trình", href: "#roadmap" },
    { label: "Lịch khai giảng", href: "#schedule" },
    { label: "Giảng viên", href: "#teachers" },
    { label: "Đánh giá", href: "#feedback" },
    { label: "Hỏi đáp", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="block font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-primary leading-tight">
                {brandName}
              </span>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                {brandSlogan}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${hotline.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition-opacity px-3 py-2 rounded-lg bg-primary/5 border border-primary/10"
            >
              <Phone className="w-4 h-4 text-primary animate-pulse" />
              <span>{hotline}</span>
            </a>

            <a
              href="#register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-hover text-slate-900 font-bold text-sm shadow-md shadow-secondary/25 hover:shadow-lg transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-slate-900" />
              <span>Đăng Ký Tư Vấn</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#register"
              className="sm:hidden px-3 py-1.5 rounded-lg bg-secondary text-slate-900 text-xs font-bold"
            >
              Tư vấn
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-semibold text-slate-800 hover:text-primary"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href={`tel:${hotline.replace(/\D/g, '')}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/5 text-primary font-bold text-sm"
            >
              <Phone className="w-4 h-4" />
              Hotline: {hotline}
            </a>
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-slate-900 font-bold text-sm"
            >
              Nhận Lộ Trình & Học Thử Miễn Phí
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
