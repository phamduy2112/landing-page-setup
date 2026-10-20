import React from 'react';
import { Phone, MessageCircle, Send } from 'lucide-react';

export default function FloatingContact({ data = {} }) {
  const hotline = data.hotline || "0988.123.456";
  const zaloNumber = data.zaloNumber || "0988123456";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Zalo Button */}
      <a
        href={`https://zalo.me/${zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
        title="Chat qua Zalo"
      >
        <span className="font-extrabold text-xs tracking-tighter">Zalo</span>
        <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-md">
          Chat Zalo tư vấn 24/7
        </span>
      </a>

      {/* Hotline Call Button with ripple */}
      <a
        href={`tel:${hotline.replace(/\D/g, '')}`}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-700 transition-all hover:scale-110 active:scale-95"
        title="Gọi hotline ngay"
      >
        {/* Ripple effect */}
        <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping -z-10" />
        <Phone className="w-6 h-6 animate-pulse" />
        
        <span className="absolute right-full mr-3 hidden sm:group-hover:inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-md">
          Hotline: {hotline}
        </span>
      </a>

    </div>
  );
}
