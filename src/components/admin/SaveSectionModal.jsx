import React, { useState, useEffect } from 'react';
import { BookmarkPlus, X, Check, AlertCircle } from 'lucide-react';

export default function SaveSectionModal({
  isOpen,
  sectionItem,
  onClose,
  onSave,
}) {
  const [templateName, setTemplateName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sectionItem) {
      const defaultName =
        sectionItem.name ||
        sectionItem.sectionDef?.name ||
        'Section Mẫu Tùy Biến';
      setTemplateName(defaultName);
      setError('');
    }
  }, [sectionItem, isOpen]);

  if (!isOpen || !sectionItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = templateName.trim();
    if (!trimmed) {
      setError('Tên mẫu không được để trống.');
      return;
    }
    onSave({
      name: trimmed,
      sectionItem,
    });
  };

  const isCustom = Boolean(sectionItem.isCustom || sectionItem.sectionDef?.isCustom);
  const badgeText = sectionItem.sectionDef?.badge || (isCustom ? 'Custom Code' : 'Mẫu Có Sẵn');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-white">
                Lưu Section Thành Mẫu
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Lưu vào thư viện "Đã Lưu" để tái sử dụng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Info Card */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
              Section đang chọn
            </span>
            <span className="text-xs font-extrabold text-slate-200 truncate block">
              {sectionItem.name || sectionItem.sectionDef?.name || 'Section'}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            {badgeText}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tên Mẫu Section <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                if (error) setError('');
              }}
              placeholder="VD: Header Chiến Dịch Tuyển Sinh Mới"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-bold transition ${
                error
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:ring-amber-500'
              }`}
            />
            {error && (
              <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Mẫu sẽ được lưu độc lập với toàn bộ cấu hình, props, mã code và các khối con. Bạn có thể chèn lại vào Canvas bất cứ khi nào.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Mẫu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
