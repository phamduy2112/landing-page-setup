import React, { useState } from 'react';
import { X, Check, Palette, Type, Sparkles, RefreshCw, Square, Sliders } from 'lucide-react';
import { COLOR_PRESETS, FONT_PRESETS, RADIUS_PRESETS } from '../../data/themes';

export default function ThemeCustomizerModal({
  isOpen,
  onClose,
  activeTheme,
  setActiveTheme,
  activeFont,
  setActiveFont,
  activeRadius = 16,
  setActiveRadius,
}) {
  if (!isOpen) return null;

  const [tempTheme, setTempTheme] = useState(activeTheme);
  const [tempFont, setTempFont] = useState(activeFont);
  const [tempRadius, setTempRadius] = useState(activeRadius);

  const handleApply = () => {
    setActiveTheme(tempTheme);
    setActiveFont(tempFont);
    if (setActiveRadius) {
      setActiveRadius(tempRadius);
    }
    onClose();
  };

  const handlePresetSelect = (preset) => {
    setTempTheme(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Tùy Biến Màu Sắc & Font Chữ Thương Hiệu
              </h3>
              <p className="text-xs text-slate-400">
                Thay đổi áp dụng ngay lập tức lên toàn bộ các section trên trang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* SECTION 1: Color Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <span>Bảng Màu Giáo Dục Chuẩn Đã Kiểm Chứng (Presets)</span>
              </label>
              <span className="text-[11px] text-slate-400">Chọn 1 click</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = tempTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/50 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>

                    <div className="font-heading font-extrabold text-xs text-white">
                      {preset.name}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Custom Color Pickers */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Hoặc Tự Chọn Mã Màu Tùy Chỉnh (HEX)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Primary Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Màu Chính (Primary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.primary}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', primary: e.target.value })
                    }
                    className="w-9 h-9 rounded-xl border border-slate-600 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tempTheme.primary}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', primary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Secondary Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Màu Phụ / CTA (Secondary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.secondary}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', secondary: e.target.value })
                    }
                    className="w-9 h-9 rounded-xl border border-slate-600 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tempTheme.secondary}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', secondary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Accent Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Màu Nhấn (Accent)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.accent}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', accent: e.target.value })
                    }
                    className="w-9 h-9 rounded-xl border border-slate-600 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={tempTheme.accent}
                    onChange={(e) =>
                      setTempTheme({ ...tempTheme, id: 'custom', accent: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: Font Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <span>Bộ Font Chữ Hỗ Trợ Tiếng Việt Chuẩn (Google Fonts)</span>
              </label>
              <span className="text-[11px] text-slate-400">Tự động nạp font</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FONT_PRESETS.map((font) => {
                const isSelected = tempFont.id === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => setTempFont(font)}
                    className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}

                    <div className="text-base text-white font-black mb-1" style={{ fontFamily: font.fontFamily }}>
                      Aa Khóa Học 2026
                    </div>
                    <div className="font-heading font-extrabold text-xs text-slate-200">
                      {font.name}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {font.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Border Radius Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Square className="w-4 h-4 text-amber-400" />
                <span>Độ Bo Góc Giao Diện (Border Radius)</span>
              </label>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                {tempRadius}px ({RADIUS_PRESETS.find((r) => r.value === tempRadius)?.name || 'Tùy chỉnh'})
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {RADIUS_PRESETS.map((preset) => {
                const isSelected = tempRadius === preset.value;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTempRadius(preset.value)}
                    className={`p-3 rounded-2xl text-center border transition-all relative flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50 shadow-lg text-white'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    {/* Visual miniature box illustrating the border radius */}
                    <div
                      className="w-8 h-8 border-2 border-amber-400/80 bg-amber-400/10 transition-all duration-200"
                      style={{ borderRadius: `${preset.value}px` }}
                    />
                    <div className="font-extrabold text-xs">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">{preset.name.split('(')[0]}</div>
                  </button>
                );
              })}
            </div>

            {/* Slider & Live Test Card */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Kéo chỉnh linh hoạt theo Pixel:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="36"
                    value={tempRadius}
                    onChange={(e) => setTempRadius(Number(e.target.value))}
                    className="w-40 sm:w-60 accent-amber-500 cursor-pointer"
                  />
                  <span className="w-12 text-right font-mono font-bold text-amber-400 text-xs">
                    {tempRadius}px
                  </span>
                </div>
              </div>

              {/* Live Preview Elements Box */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[11px] text-slate-400">Xem thử bo góc thực tế:</div>
                <div className="flex items-center gap-3">
                  {/* Button preview */}
                  <button
                    className="px-4 py-2 font-bold text-xs text-slate-900 shadow-md transition-all"
                    style={{
                      backgroundColor: tempTheme.secondary,
                      borderRadius: `${tempRadius}px`,
                    }}
                  >
                    Nút Bấm CTA
                  </button>

                  {/* Card / Box preview */}
                  <div
                    className="px-3.5 py-2 text-xs font-medium text-white border border-white/20 transition-all"
                    style={{
                      backgroundColor: tempTheme.primary,
                      borderRadius: `${tempRadius}px`,
                    }}
                  >
                    Thẻ Khóa Học
                  </div>

                  {/* Badge preview */}
                  <div
                    className="px-3 py-1 text-[10px] font-bold text-amber-300 border border-amber-400/30 transition-all"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: `${tempRadius}px`,
                    }}
                  >
                    Huy Hiệu 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
            <span>Đang chọn:</span>
            <strong className="text-white">{tempTheme.name.split('(')[0]}</strong>
            <span>•</span>
            <strong className="text-emerald-400">{tempFont.name}</strong>
            <span>•</span>
            <strong className="text-amber-400">Bo góc: {tempRadius}px</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Áp Dụng Toàn Trang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
