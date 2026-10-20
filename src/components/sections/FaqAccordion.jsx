import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';

export default function FaqAccordion({ data = {} }) {
  const [openIndex, setOpenIndex] = useState(0);

  const title = data.title || "Giải Đáp Mọi Thắc Mắc Thường Gặp";
  const subtitle = data.subtitle || "Tất cả những băn khoăn về học phí, lịch học, giảng viên và chính sách bảo lưu của học viên.";

  const faqs = data.faqs || [
    {
      q: "Người chưa từng học tiếng Trung hoặc mất gốc hoàn toàn có theo kịp không?",
      a: "Hoàn toàn theo kịp! Khóa căn bản bắt đầu từ bảng chữ cái Pinyin, khẩu hình miệng và các nét chữ sơ khởi. Lớp học giới hạn dưới 8 học viên nên giảng viên và trợ giảng sẽ kèm cặp, chỉnh sửa phát âm trực tiếp từng bạn cho đến khi nói chuẩn xác mới chuyển sang bài mới."
    },
    {
      q: "Nếu tôi bận đi công tác hoặc có việc đột xuất thì có được học bù không?",
      a: "Có! Bạn được quyền học bù miễn phí tại các lớp song song có cùng tiến độ bài học. Ngoài ra, tất cả các buổi học đều có video bài giảng quay lại chất lượng cao và tài liệu tóm tắt từ trợ giảng để bạn ôn tập bất cứ lúc nào."
    },
    {
      q: "Chính sách cam kết đầu ra bằng văn bản hoạt động như thế nào?",
      a: "Ngay khi nhập học, trung tâm sẽ ký cam kết đào tạo có dấu đỏ pháp lý. Nếu học viên đi học đầy đủ và làm bài tập theo hướng dẫn mà không vượt qua kỳ thi đánh giá hoặc chứng chỉ mục tiêu, bạn sẽ được học lại toàn bộ khóa học hoàn toàn miễn phí 0Đ cho đến khi đạt kết quả."
    },
    {
      q: "Tôi có thể tham gia học thử trước khi đóng học phí không?",
      a: "Có! Trung tâm tổ chức các buổi học thử trải nghiệm 0Đ hàng tuần để bạn cảm nhận trực tiếp phương pháp giảng dạy, không khí lớp học và phong cách của giảng viên trước khi đưa ra quyết định chính thức."
    },
    {
      q: "Trung tâm có chính sách trả góp hoặc chia nhỏ học phí không?",
      a: "Có hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng liên kết 25+ ngân hàng lớn, hoặc chia làm 2 đợt đóng học phí nhằm giúp học viên và phụ huynh linh hoạt tài chính tối đa."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Câu Hỏi Thường Gặp
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all border duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-primary/40 bg-primary/5 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">
                      ?
                    </span>
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-white text-slate-600 shadow-sm shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-primary/10">
                    <p className="pl-9">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
              Bạn vẫn còn câu hỏi khác cần được tư vấn chi tiết?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Đội ngũ tư vấn viên sẵn sàng giải đáp 24/7 qua Zalo hoặc Hotline.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#register"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all"
            >
              Hỏi Tư Vấn Viên
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
