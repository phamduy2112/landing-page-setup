import React, { useState } from 'react';
import {
  X,
  Code2,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  FileCode,
  Upload,
  AlertCircle,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { convertHtmlCssJsToReactTailwind } from '../../utils/htmlToReactTailwind';

export default function HtmlToReactTailwindModal({
  isOpen,
  onClose,
  onApplyConvertedCode,
}) {
  if (!isOpen) return null;

  const [inputMode, setInputMode] = useState('all-in-one'); // 'all-in-one' | 'split'
  const [allInOneHtml, setAllInOneHtml] = useState('');
  const [splitHtml, setSplitHtml] = useState('');
  const [splitCss, setSplitCss] = useState('');
  const [splitJs, setSplitJs] = useState('');
  const [componentName, setComponentName] = useState('MyCustomSection');
  const [outputCode, setOutputCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [convertStatus, setConvertStatus] = useState(null);

  // Mẫu ví dụ có sẵn để test nhanh
  const loadSample = () => {
    const sampleHtml = `<section class="py-16 bg-white">
  <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <div class="header-box" style="text-align: center; margin-bottom: 40px;">
      <span class="badge" style="display: inline-block; padding: 6px 14px; background-color: #fee2e2; color: #dc2626; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase;">
        Tuyển Sinh 2026
      </span>
      <h2 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-top: 12px; margin-bottom: 8px;">
        Chương Trình Đào Tạo Ngoại Ngữ & Du Học
      </h2>
      <p style="font-size: 16px; color: #64748b; max-width: 650px; margin: 0 auto;">
        Cam kết chuẩn đầu ra TOPIK / TOCFL và đồng hành trọn gói xử lý visa.
      </p>
    </div>

    <div class="grid-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      <div class="card" style="padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Tiếng Hàn Cấp Tốc</h3>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Đào tạo từ số 0 đến TOPIK 2 trong 3 tháng.</p>
        <button style="width: 100%; padding: 12px; background-color: #dc2626; color: #ffffff; border-radius: 8px; font-weight: 700; cursor: pointer; border: none;">
          Đăng Ký Ngay
        </button>
      </div>

      <div class="card" style="padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Tiếng Trung Giao Tiếp</h3>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Phản xạ thực tế, luyện thi chứng chỉ TOCFL.</p>
        <button style="width: 100%; padding: 12px; background-color: #16a34a; color: #ffffff; border-radius: 8px; font-weight: 700; cursor: pointer; border: none;">
          Đăng Ký Ngay
        </button>
      </div>

      <div class="card" style="padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Du Học Hàn & Đài</h3>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Học bổng 30% - 100%, tỷ lệ đỗ visa 98%+.</p>
        <button style="width: 100%; padding: 12px; background-color: #0f172a; color: #ffffff; border-radius: 8px; font-weight: 700; cursor: pointer; border: none;">
          Xem Chi Tiết
        </button>
      </div>
    </div>
  </div>
</section>`;

    setInputMode('all-in-one');
    setAllInOneHtml(sampleHtml);
    handleConvert(sampleHtml, '', '');
  };

  const handleConvert = (htmlInput, cssInput, jsInput) => {
    const rawHtml = htmlInput !== undefined ? htmlInput : (inputMode === 'all-in-one' ? allInOneHtml : splitHtml);
    const rawCss = cssInput !== undefined ? cssInput : (inputMode === 'split' ? splitCss : '');
    const rawJs = jsInput !== undefined ? jsInput : (inputMode === 'split' ? splitJs : '');

    if (!rawHtml || !rawHtml.trim()) {
      alert('Vui lòng nhập mã HTML cần chuyển đổi!');
      return;
    }

    try {
      const res = convertHtmlCssJsToReactTailwind({
        html: rawHtml,
        css: rawCss,
        js: rawJs,
        componentName: componentName.trim() || 'ConvertedSection',
      });

      if (res.success) {
        setOutputCode(res.code);
        setConvertStatus({
          type: 'success',
          msg: `Chuyển đổi thành công! Đã xử lý ${res.detectedClassesCount} CSS rules. ${
            res.inlineJsDetected ? '⚠️ Lưu ý: Phát hiện JS logic đi kèm, vui lòng xem ghi chú bên dưới.' : ''
          }`,
        });
      } else {
        setConvertStatus({
          type: 'error',
          msg: res.error || 'Có lỗi khi phân tích cú pháp HTML.',
        });
      }
    } catch (err) {
      setConvertStatus({
        type: 'error',
        msg: `Lỗi: ${err.message}`,
      });
    }
  };

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApply = () => {
    if (!outputCode) {
      alert('Chưa có mã React được chuyển đổi!');
      return;
    }
    if (onApplyConvertedCode) {
      onApplyConvertedCode({
        code: outputCode,
        name: componentName.trim() || 'ConvertedSection',
      });
    }
    onClose();
  };

  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputMode('all-in-one');
        setAllInOneHtml(content);
        const nameGuess = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '');
        if (nameGuess) setComponentName(nameGuess);
        handleConvert(content, '', '');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-white">
                  Chuyển Đổi HTML/CSS/JS Thuần ➔ React + TailwindCSS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  Offline Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tự động chuẩn hóa JSX (`className`, đóng thẻ, inline style) và map thuộc tính CSS sang Tailwind class.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSample}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
              title="Tải đoạn HTML mẫu để thử nghiệm nhanh"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nạp Mẫu Thử</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4 shrink-0 flex-wrap text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px]">Chế độ nhập:</span>
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setInputMode('all-in-one')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  inputMode === 'all-in-one'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gộp Tất Cả (HTML + &lt;style&gt; + &lt;script&gt;)
              </button>
              <button
                type="button"
                onClick={() => setInputMode('split')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  inputMode === 'split'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tách Riêng (HTML, CSS, JS)
              </button>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition border border-slate-700">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chọn File .html</span>
              <input
                type="file"
                accept=".html,.htm,.txt"
                className="hidden"
                onChange={handleUploadFile}
              />
            </label>
          </div>

          {/* Component Name */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px]">Tên Component:</span>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="VD: HeroBanner, ProgramCourses"
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Main Work Area: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-0 overflow-hidden">

          {/* CỘT TRÁI: INPUT HTML/CSS */}
          <div className="flex flex-col h-full min-h-0 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Mã Nguồn Đầu Vào ({inputMode === 'all-in-one' ? 'HTML / CSS / JS' : 'HTML & Styles'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleConvert()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Chuyển Đổi Ngay ➔</span>
              </button>
            </div>

            {inputMode === 'all-in-one' ? (
              <textarea
                value={allInOneHtml}
                onChange={(e) => setAllInOneHtml(e.target.value)}
                placeholder="Dán mã HTML thuần tại đây (có thể chứa cả <style>...</style> hoặc inline style='...')..."
                className="w-full flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 flex flex-col space-y-3 min-h-0">
                <div className="flex-1 flex flex-col min-h-0">
                  <span className="text-[11px] font-bold text-slate-400 mb-1">1. HTML:</span>
                  <textarea
                    value={splitHtml}
                    onChange={(e) => setSplitHtml(e.target.value)}
                    placeholder="<div>...</div>"
                    className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    spellCheck={false}
                  />
                </div>
                <div className="h-28 flex flex-col min-h-0">
                  <span className="text-[11px] font-bold text-slate-400 mb-1">2. CSS thuần (tùy chọn):</span>
                  <textarea
                    value={splitCss}
                    onChange={(e) => setSplitCss(e.target.value)}
                    placeholder=".container { max-width: 1200px; } .btn { color: white; }"
                    className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    spellCheck={false}
                  />
                </div>
                <div className="h-20 flex flex-col min-h-0">
                  <span className="text-[11px] font-bold text-slate-400 mb-1">3. JavaScript logic (tùy chọn):</span>
                  <textarea
                    value={splitJs}
                    onChange={(e) => setSplitJs(e.target.value)}
                    placeholder="function toggleModal() { ... }"
                    className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: OUTPUT REACT + TAILWIND */}
          <div className="flex flex-col h-full min-h-0 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Kết Quả: React JSX + Tailwind CSS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!outputCode}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã Sao Chép!' : 'Sao Chép'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!outputCode}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Áp Dụng Vào Editor</span>
                </button>
              </div>
            </div>

            <textarea
              value={outputCode}
              onChange={(e) => setOutputCode(e.target.value)}
              placeholder="Mã React JSX hoàn chỉnh đã chuyển sang Tailwind CSS sẽ hiển thị tại đây sau khi bạn nhấn 'Chuyển Đổi Ngay'..."
              className="w-full flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
              spellCheck={false}
            />

            {/* Status message */}
            {convertStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                  convertStatus.type === 'success'
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                    : 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{convertStatus.msg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="p-3 sm:px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div>
            💡 <strong className="text-slate-300">Mẹo:</strong> Bạn có thể copy một section từ <code className="text-cyan-300">mockup/index.html</code> (bao gồm cả class và style inline) rồi dán vào đây để chuyển đổi tức thì thành React JSX sạch!
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-xs"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
