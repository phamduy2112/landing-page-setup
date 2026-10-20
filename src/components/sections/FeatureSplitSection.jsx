import React from 'react';
import TextWithImage from '../common/TextWithImage';

/**
 * FeatureSplitSection - Section Bố Cục 2 Cột Chuẩn: Text Trái - Hình Phải (hoặc Hình Trái - Text Phải).
 */
export default function FeatureSplitSection({ data = {} }) {
  return (
    <section className="py-12 lg:py-20 bg-white relative overflow-hidden border-b border-slate-100">
      <TextWithImage
        eyebrow={data.eyebrow || 'PHƯƠNG PHÁP ĐỘC QUYỀN'}
        title={data.title || 'Tự Tin Giao Tiếp & Thi Đạt HSK'}
        highlight={data.highlight || 'Nhanh Gấp 3 Lần'}
        desc={data.desc || 'Lộ trình tinh gọn cá nhân hóa theo từng mục tiêu học viên, tập trung 80% thời lượng vào phản xạ thực chiến và chỉnh âm 1:1 cùng giảng viên chuyên môn cao.'}
        bullets={data.bullets || [
          'Chỉnh sửa phát âm trực tiếp 1:1 cùng giảng viên bản ngữ & chuyên gia',
          'Thực hành các tình huống đàm phán, thương mại và du học thực tế',
          'Cam kết chuẩn đầu ra bằng văn bản đào tạo minh bạch',
        ]}
        buttonText={data.buttonText || 'Nhận Lộ Trình Học 0Đ'}
        buttonVariant={data.buttonVariant || 'secondary'}
        targetSection={data.targetSection || 'tu-van'}
        imagePosition={data.imagePosition || 'right'}
        imageSrc={data.imageSrc || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80'}
        imageAlt={data.imageAlt || 'Lớp học tương tác thực chiến'}
        imageBadge={data.imageBadge || 'Cam kết đầu ra 100% bằng văn bản'}
      />
    </section>
  );
}
