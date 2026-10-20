import React from 'react';
import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import ButtonCTA from './ButtonCTA';

/**
 * TextWithImage - Component 2 cột kinh điển: Text Trái - Hình Phải (hoặc Hình Trái - Text Phải).
 * Cho phép tùy biến tiêu đề, mô tả, checklist các gạch đầu dòng, nút CTA và ảnh minh họa.
 */
export default function TextWithImage({
  eyebrow = 'PHƯƠNG PHÁP ĐỘC QUYỀN',
  title = 'Tự Tin Giao Tiếp & Thi Đạt HSK',
  highlight = 'Nhanh Gấp 3 Lần',
  desc = 'Lộ trình tinh gọn cá nhân hóa theo trình độ từng học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1 kèm 1 cùng giảng viên chuyên môn cao.',
  bullets = [
    'Chỉnh sửa phát âm trực tiếp 1:1 cùng giảng viên bản ngữ & chuyên gia',
    'Thực hành các tình huống đàm phán, thương mại và du học thực tế',
    'Cam kết chuẩn đầu ra bằng văn bản đào tạo minh bạch',
  ],
  buttonText = 'Đăng Ký Nhận Lộ Trình Học',
  buttonVariant = 'secondary',
  targetSection = 'tu-van',
  imageSrc = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  imageAlt = 'Lớp học tương tác thực chiến',
  imagePosition = 'right', // 'right' (text trái hình phải) | 'left' (hình trái text phải)
  imageBadge = 'Cam kết đầu ra 100% bằng văn bản',
  className = '',
  ...props
}) {
  const isImageLeft = imagePosition === 'left';

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}
      {...props}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Cột Nội Dung Văn Bản (Text Column) */}
        <div
          className={`space-y-5 text-left ${
            isImageLeft ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7 lg:order-1'
          }`}
        >
          {/* Eyebrow Pill */}
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 text-primary text-xs font-extrabold border border-secondary/30 tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-secondary fill-secondary" />
              <span>{eyebrow}</span>
            </div>
          )}

          {/* Tiêu Đề Chính */}
          {(title || highlight) && (
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {title} {highlight && <span className="text-secondary">{highlight}</span>}
            </h3>
          )}

          {/* Đoạn Văn Bản Mô Tả */}
          {desc && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {desc}
            </p>
          )}

          {/* Danh Sách Checklist Gạch Đầu Dòng */}
          {Array.isArray(bullets) && bullets.length > 0 && (
            <ul className="space-y-2.5 pt-1">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Nút Kêu Gọi Hành Động (CTA Button) */}
          {buttonText && (
            <div className="pt-2">
              <ButtonCTA
                text={buttonText}
                variant={buttonVariant}
                targetSection={targetSection}
                size="md"
              />
            </div>
          )}
        </div>

        {/* Cột Hình Ảnh (Image Column) */}
        <div
          className={`relative ${
            isImageLeft ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
          }`}
        >
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Hiệu ứng phát sáng nền sau ảnh */}
            <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-primary/20 via-secondary/20 to-primary/10 blur-xl opacity-75 -z-10" />

            {/* Khung ảnh chính bo góc */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 border-4 border-white group">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Huy hiệu cam kết góc dưới ảnh */}
              {imageBadge && (
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-white/50 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
                    {imageBadge}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
