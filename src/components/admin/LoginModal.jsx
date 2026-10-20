import React, { useState } from 'react';
import { Lock, Sparkles, KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Tài khoản và mật khẩu mặc định (hoặc nhập admin / 123456)
    const validUsers = [
      { u: 'admin', p: '123456' },
      { u: 'admin', p: 'admin123' },
      { u: 'daitaynam', p: '123456' },
      { u: 'sep', p: '123456' }
    ];

    const trimmedUser = username.trim().toLowerCase();
    const isMatched = validUsers.some(
      (acc) => acc.u === trimmedUser && acc.p === password.trim()
    ) || password.trim() === '123456';

    if (isMatched) {
      localStorage.setItem('edulanding_auth_session', JSON.stringify({
        user: trimmedUser || 'admin',
        loggedInAt: Date.now()
      }));
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Mật khẩu không chính xác!');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Lock className="w-7 h-7 text-amber-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
            EduLanding Studio
          </h2>
          <p className="text-xs text-slate-400">
            Vui lòng đăng nhập để bắt đầu chỉnh sửa và quản lý Landing Page
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tài Khoản
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin hoặc daitaynam..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Mật Khẩu</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nhập..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                autoFocus
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Đăng Nhập Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>


      </div>
    </div>
  );
}
