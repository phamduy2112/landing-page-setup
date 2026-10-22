import {
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Download,
  Sparkles,
  Plus,
  Eye,
  RefreshCw,
  Code,
  Square,
  FileJson,
  Upload,
  LogOut,
  Lock,
} from 'lucide-react';

export default function AdminHeader({
  viewport,
  setViewport,
  activeTheme,
  activeFont,
  activeRadius = 16,
  siteConfig = {},
  onOpenBrandSettings,
  onOpenThemeModal,
  onOpenExportModal,
  onOpenCodeModal,
  onOpenConvertModal,
  onResetCanvas,
  sectionsCount,
  onExportJson,
  onImportJson,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shadow-xl">

      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        {siteConfig?.logoUrl ? (
          <img
            src={siteConfig.logoUrl}
            alt={siteConfig.brandName || "Logo"}
            className="h-9 w-auto max-w-[120px] object-contain rounded-lg bg-slate-800/80 p-1 border border-slate-700"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-base sm:text-lg tracking-tight text-white leading-none">
              {siteConfig?.brandName ? (
                <>
                  {siteConfig.brandName}{' '}
                  <span className="text-amber-400 font-normal text-xs sm:text-sm">Builder</span>
                </>
              ) : (
                <>
                  EduLanding <span className="text-blue-400">Studio</span>
                </>
              )}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/30">
              Admin Builder
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400 mt-0.5">
            {siteConfig?.brandSlogan || 'Tổng hợp kho section Giáo dục • Click tạo y chang • Xuất mã React chuẩn'}
          </p>
        </div>
      </div>

      {/* Viewport Device Switcher */}
      <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
        <button
          onClick={() => setViewport('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewport === 'desktop'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
            }`}
          title="Xem chế độ Máy tính (Desktop 100%)"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        <button
          onClick={() => setViewport('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewport === 'tablet'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
            }`}
          title="Xem chế độ Tablet (768px)"
        >
          <Tablet className="w-4 h-4" />
          <span className="hidden sm:inline">Tablet</span>
        </button>

        <button
          onClick={() => setViewport('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewport === 'mobile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
            }`}
          title="Xem chế độ Mobile (375px)"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Theme & Export Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Current Theme & Radius Pill Button */}
        <button
          onClick={onOpenThemeModal}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm group"
          title="Nhấn để đổi Màu Sắc, Font Chữ & Độ Bo Góc"
        >
          <Palette className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden lg:inline">{activeTheme.name.split('(')[0]}</span>
          <div className="flex items-center gap-1">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/30"
              style={{ backgroundColor: activeTheme.primary }}
            />
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/30"
              style={{ backgroundColor: activeTheme.secondary }}
            />
          </div>
          <span className="hidden xl:inline-block text-[10px] text-amber-300 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
            R: {activeRadius}px
          </span>
        </button>

        {/* Reset Canvas */}
        {sectionsCount > 0 && (
          <button
            onClick={onResetCanvas}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-bold transition-all"
            title="Làm mới Canvas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          disabled={sectionsCount === 0}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all ${sectionsCount > 0
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/25 active:scale-95 animate-pulse hover:animate-none'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          title="Tự động tạo folder dự án độc lập, chia nhỏ component và chạy npm run dev"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>🚀 Tạo Dự Án ({sectionsCount})</span>
        </button>

        {/* Lock Studio Security Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 transition text-xs font-bold active:scale-95"
            title="Khóa Studio bằng mật khẩu bảo vệ"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Khóa Trang</span>
          </button>
        )}

      </div>

    </header>
  );
}
