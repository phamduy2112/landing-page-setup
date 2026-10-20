import React from 'react';

/**
 * ButtonCTA - Component Nút Kêu Gọi Hành Động dùng chung cho toàn bộ landing page.
 * Được quản lý CSS tập trung, tự động ăn theo Design System & Theme, 
 * cho phép mọi Section tái sử dụng và tùy chỉnh text linh hoạt.
 */
export default function ButtonCTA({
  text = 'Đăng ký tư vấn ngay',
  targetSection = 'tu-van',
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'glow'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = true,
  className = '',
  children,
  onClick,
  ...props
}) {
  const targetId = href ? href.replace(/^#/, '') : targetSection ? targetSection.replace(/^#/, '') : '';
  const finalHref = href || (targetId ? `#${targetId}` : '#tu-van');

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (targetId) {
      e.preventDefault();
      // 1. Thử cuộn trên chính document hiện tại
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // 2. Nếu đang chạy trong iframe preview, gửi message lên trang cha (Canvas Studio)
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              { type: 'SCROLL_TO_SECTION', sectionId: targetId },
              '*'
            );
          }
        } catch (err) {}
        // Fallback hash
        window.location.hash = `#${targetId}`;
      }
    }
  };

  // Base sizing
  const sizeClasses = {
    sm: 'px-4 py-2.5 text-xs gap-2',
    md: 'px-6 py-3.5 text-[13px] sm:text-sm gap-2.5',
    lg: 'px-8 py-4 text-base gap-3.5 font-black',
  }[size] || 'px-6 py-3.5 text-sm gap-2.5';

  // Variant CSS Styles (quản lý tập trung)
  const variantClasses = {
    primary:
      'bg-primary hover:bg-accent text-surface hover:text-primary shadow-md hover:shadow-xl shadow-primary/20',
    secondary:
      'bg-secondary hover:bg-secondary-hover text-slate-900 font-black shadow-lg shadow-secondary/25 active:scale-95',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent shadow-sm',
    glow:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black shadow-lg shadow-indigo-500/30 hover:shadow-amber-500/40',
  }[variant] || 'bg-primary hover:bg-accent text-surface hover:text-primary';

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={`group inline-flex w-fit items-center justify-center rounded-xl font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="truncate">{children || text}</span>
      {icon && (
        <span className="text-base sm:text-lg leading-none transition-transform duration-200 group-hover:translate-x-1.5 shrink-0">
          →
        </span>
      )}
    </a>
  );
}

ButtonCTA.__esModule = true;
ButtonCTA.default = ButtonCTA;
