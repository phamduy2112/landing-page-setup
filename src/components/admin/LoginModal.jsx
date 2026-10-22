import React, { useState } from 'react';
import { Lock, Shield, ShieldCheck, ShieldAlert, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const validPasswords = ['123456', 'admin123', 'edulanding2026', 'admin'];
    const customPin = localStorage.getItem('edulanding_custom_pin');

    const enteredPass = password.trim();
    const isMatched =
      validPasswords.includes(enteredPass) ||
      (customPin && enteredPass === customPin) ||
      enteredPass === '123456';

    if (isMatched) {
      const sessionData = JSON.stringify({
        user: username.trim().toLowerCase() || 'admin',
        loggedInAt: Date.now(),
      });

      sessionStorage.setItem('edulanding_auth_session', sessionData);
      localStorage.removeItem('edulanding_auth_session');

      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 p-4 select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative backdrop-blur-xl">
        {/* Security Shield Icon Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-xl shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold font-mono uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>Xác Thực Bảo Mật</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
              Landing Page Builder
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nhập mật khẩu quản trị để mở khóa và truy cập Studio
            </p>
          </div>
        </div>

        {/* Security Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 font-bold animate-in fade-in duration-150">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Mở Khóa & Vào Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          <span>Hệ thống bảo mật trang nội bộ • EduLanding Studio</span>
        </div>
      </div>
    </div>
  );
}
