import React, { useState } from 'react';

const links = [
  ['Khó Khăn Thường Gặp', '#kho-khan'],
  ['Về Tân Sanh Ngữ', '#about'],
  ['Khóa Học Online', '#courses'],
  ['Lịch Khai Giảng', '#lich-hoc'],
  ['FAQ', '#faq'],
];

export default function HeaderTanSanhNgu({ data = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoUrl = data.logoUrl || data.logo || "/assets/LOGO2.png";
  const brandName = data.brandName || "Tân Sanh Ngữ";

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-surface/95 backdrop-blur">
      <div className="container mx-auto flex min-h-[82px] w-[calc(100%-3rem)] max-w-[1200px] items-center justify-between gap-7 md:w-[calc(100%-5rem)]">
        
        {/* Logo */}
        <a className="flex shrink-0 items-center gap-2.5" href="#top" aria-label={`${brandName} - về đầu trang`}>
          {logoUrl ? (
            <img src={logoUrl} className="w-[150px] max-h-12 object-contain" alt={`Logo ${brandName}`} />
          ) : (
            <span className="font-heading font-black text-xl text-primary">{brandName}</span>
          )}
        </a>

        {/* Mobile Hamburger Button */}
        <button
          className="grid h-11 w-11 place-content-center gap-1 rounded border border-primary/10 bg-surface md:hidden"
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="h-0.5 w-5 bg-primary" />
          <span className="h-0.5 w-5 bg-primary" />
          <span className="h-0.5 w-5 bg-primary" />
        </button>

        {/* Navigation Links */}
        <nav
          className={`${
            menuOpen ? 'grid' : 'hidden'
          } absolute left-0 right-0 top-full gap-0 border-b border-primary/10 bg-surface px-6 pb-5 shadow-xl md:static md:flex md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          aria-label="Điều hướng chính"
        >
          {links.map(([label, href]) => (
            <a
              className="border-b border-primary/10 py-3 text-[13px] font-semibold text-text-muted transition hover:text-accent md:border-0 md:py-0"
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="mt-3 inline-flex min-h-[42px] items-center justify-center gap-3 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-secondary-hover md:mt-0"
            href="#tu-van"
            onClick={() => setMenuOpen(false)}
          >
            Nhận tư vấn Online
          </a>
        </nav>

      </div>
    </header>
  );
}
