import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  Sparkles,
  Layers,
  Rocket,
  Folder,
  FolderCheck,
  Play,
  Terminal,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Code
} from 'lucide-react';
import {
  generateAppJsx,
  generateTailwindConfig,
  generateIndexCss,
  generateCustomSectionStandaloneCode,
  downloadFile,
} from '../../utils/codeExporter';
import { getSectionSourceCode } from '../../data/sectionsRawCode';

export default function ExportModal({
  isOpen,
  onClose,
  canvasSections = [],
  activeTheme,
  activeFont,
  activeRadius = 16,
  singleSection = null,
}) {
  if (!isOpen) return null;

  // Tabs: 'auto-project' | 'app' | 'tailwind' | 'css' | 'single'
  const [activeTab, setActiveTab] = useState(singleSection ? 'single' : 'auto-project');
  const [copied, setCopied] = useState(false);

  // Auto Project Form States
  const [projectName, setProjectName] = useState('dai-tay-nam-edu-landing');
  const [projectTitle, setProjectTitle] = useState('Học Viện Ngôn Ngữ Giáo Dục - Edu Landing Page');
  const [syncToExisting, setSyncToExisting] = useState(true);
  const [autoInstall, setAutoInstall] = useState(true);
  const [availableProjects, setAvailableProjects] = useState([]);

  // Load available projects from workspace
  useEffect(() => {
    fetch('/api/list-projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setAvailableProjects(data.projects);
          // If dai-tay-nam-edu-landing exists in projects, keep it or use it
          if (data.projects.includes('dai-tay-nam-edu-landing')) {
            setProjectName('dai-tay-nam-edu-landing');
          } else if (!projectName) {
            setProjectName(data.projects[0]);
          }
        }
      })
      .catch((err) => console.warn('Could not load projects list:', err));
  }, []);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationResult, setGenerationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [zipLoading, setZipLoading] = useState(false);

  const appJsxCode = generateAppJsx(canvasSections);
  const tailwindCode = generateTailwindConfig(activeTheme, activeFont, activeRadius);
  const cssCode = generateIndexCss(activeTheme, activeFont, activeRadius);

  // Single section code template if requested
  const getSingleSectionCode = (sec) => {
    if (!sec) return '';
    const isCustom = sec.isCustom || sec.sectionDef?.isCustom;
    if (isCustom) {
      return generateCustomSectionStandaloneCode(sec, activeTheme, activeFont, activeRadius);
    }

    const secDef = sec.sectionDef || sec;
    const rawCode = getSectionSourceCode(sec);
    if (rawCode) return rawCode;

    return `// ========================================================
// FILE: src/components/sections/${secDef.fileName || 'Section.jsx'}
// ========================================================
import React from 'react';
import ${secDef.component?.name || 'SectionComponent'} from './${(secDef.fileName || 'Section.jsx').replace('.jsx', '')}';

export default function Demo() {
  return (
    <div className="bg-white">
      <${secDef.component?.name || 'SectionComponent'} />
    </div>
  );
}
`;
  };

  const currentCode = (() => {
    if (singleSection || activeTab === 'single') {
      return getSingleSectionCode(singleSection || canvasSections[0]);
    }
    if (activeTab === 'app') return appJsxCode;
    if (activeTab === 'tailwind') return tailwindCode;
    if (activeTab === 'css') return cssCode;
    return '';
  })();

  const currentFileName = (() => {
    if (singleSection || activeTab === 'single') {
      const sec = singleSection || canvasSections[0];
      const isCustom = sec?.isCustom || sec?.sectionDef?.isCustom;
      if (isCustom) {
        const name = (sec?.name || sec?.sectionDef?.name || 'CustomSection').replace(/[^a-zA-Z0-9]/g, '_');
        return `${name}.jsx`;
      }
      return sec?.fileName || sec?.sectionDef?.fileName || 'Section.jsx';
    }
    if (activeTab === 'app') return 'App.jsx';
    if (activeTab === 'tailwind') return 'tailwind.config.js';
    if (activeTab === 'css') return 'index.css';
    return 'code.txt';
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(currentFileName, currentCode);
  };

  // Main Handler: Auto Project Generation
  const handleAutoCreateProject = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationResult(null);

    try {
      setGenerationStep(1); // Preparing data
      await new Promise((r) => setTimeout(r, 300));

      // Build prepared sections with clean names and full raw JSX code
      const preparedSections = canvasSections.map((s, idx) => {
        const code = getSectionSourceCode(s);
        const fileName = s.fileName || s.sectionDef?.fileName || `Section_${idx + 1}.jsx`;
        const name = s.name || s.sectionDef?.name || `Section ${idx + 1}`;
        return {
          id: s.id,
          fileName,
          name,
          code,
          data: s.data || {},
        };
      });

      setGenerationStep(2); // Splitting components
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep(3); // Creating configs & App.jsx

      const res = await fetch('/api/create-landing-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName.trim() || 'edu-landing',
          projectTitle: projectTitle.trim() || 'Edu Landing Page',
          sections: preparedSections,
          theme: activeTheme,
          font: activeFont,
          radius: activeRadius,
          autoInstall,
          syncToExisting,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Lỗi máy chủ (${res.status})`);
      }

      setGenerationStep(4); // Installing dependencies
      await new Promise((r) => setTimeout(r, 500));

      const result = await res.json();
      setGenerationResult(result);
      setGenerationStep(5); // Complete!
    } catch (err) {
      console.error('Project creation failed:', err);
      setErrorMessage(err.message || 'Không thể tạo thư mục dự án tự động.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Action: Open Folder in Windows Explorer
  const handleOpenFolder = async () => {
    if (!generationResult?.targetDir) return;
    try {
      await fetch('/api/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: generationResult.targetDir }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Run Dev Server in New Terminal Window
  const handleRunDev = async () => {
    if (!generationResult?.targetDir) return;
    try {
      await fetch('/api/run-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: generationResult.targetDir }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Create and Download ZIP
  const handleCreateAndDownloadZip = async () => {
    if (!generationResult?.targetDir) return;
    setZipLoading(true);
    try {
      const res = await fetch('/api/create-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath: generationResult.targetDir,
          projectName: generationResult.projectName,
        }),
      });
      const data = await res.json();
      if (data.downloadUrl) {
        window.location.href = data.downloadUrl;
      } else {
        throw new Error(data.error || 'Không tạo được file zip');
      }
    } catch (e) {
      alert('Không thể tạo file zip: ' + e.message);
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white flex items-center gap-2">
                <span>Xuất & Tự Động Tạo Dự Án Landing Page</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {canvasSections.length} Sections
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tự động chia tách file component, cấu hình Vite + React + Tailwind & sẵn sàng chạy `npm run dev`
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

        {/* Tab Switcher */}
        {!singleSection && (
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('auto-project')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'auto-project'
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/90 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>🚀 Tự Động Tạo Folder & Chia File (Khuyên Dùng)</span>
            </button>

            <button
              onClick={() => setActiveTab('app')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'app'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/90'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Xem Code App.jsx</span>
            </button>

            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'tailwind'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/90'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>tailwind.config.js</span>
            </button>

            <button
              onClick={() => setActiveTab('css')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'css'
                  ? 'border-blue-500 text-blue-400 bg-slate-800/90'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>index.css</span>
            </button>
          </div>
        )}

        {/* Tab 1: AUTO PROJECT CREATION (THE MAIN AUTOMATED FEATURE) */}
        {activeTab === 'auto-project' && !singleSection && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
            
            {/* If Already Generated Success Screen */}
            {generationResult ? (
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-black text-white">
                      🎉 Đã Tự Động Tạo Xong Trọn Bộ Dự Án Thành Công!
                    </h4>
                    <p className="text-sm text-emerald-300/90 mt-1">
                      Toàn bộ {generationResult.componentsCount} component đã được chia tách riêng vào thư mục{' '}
                      <span className="font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                        src/components/
                      </span>
                    </p>
                  </div>
                </div>

                {/* Path info */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đường Dẫn Dự Án Trên Máy:</div>
                  <div className="font-mono text-xs sm:text-sm text-amber-300 break-all bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                    <span>{generationResult.targetDir}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(generationResult.targetDir)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors shrink-0"
                      title="Copy đường dẫn"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Components Split Overview */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Các file Component Section đã tự động tạo ({generationResult.writtenFiles?.length || 0}):</span>
                    <span className="text-[11px] text-emerald-400 font-mono">100% Sẵn Sàng</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {generationResult.writtenFiles?.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 shadow-sm"
                      >
                        <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Instant Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOpenFolder}
                    className="flex-1 min-w-[180px] px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>Mở Thư Mục Trên Máy</span>
                  </button>

                  <button
                    onClick={handleRunDev}
                    className="flex-1 min-w-[200px] px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Chạy Dev Server (npm run dev)</span>
                  </button>

                  <button
                    onClick={handleCreateAndDownloadZip}
                    disabled={zipLoading}
                    className="flex-1 min-w-[180px] px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {zipLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{zipLoading ? 'Đang nén...' : 'Tải File .ZIP Trọn Bộ'}</span>
                  </button>
                </div>

                {/* Reset button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setGenerationResult(null)}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
                  >
                    Tạo thư mục khác hoặc đổi tên dự án
                  </button>
                </div>

              </div>
            ) : (
              /* Configuration Form */
              <div className="space-y-6">
                
                {/* Mode Selector Card */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Mode 1: Create standalone folder */}
                  <div
                    onClick={() => setSyncToExisting(false)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      !syncToExisting
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${!syncToExisting ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        <FolderCheck className="w-4 h-4" />
                      </div>
                      <div className="font-heading font-black text-sm text-white">Tạo Thư Mục Mới Độc Lập</div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tự động tạo folder riêng (ví dụ: <code className="text-amber-300 font-mono">{projectName}</code>), chia từng file component, cài đặt Vite + Tailwind, tạo file <code className="text-emerald-400 font-mono">chay-du-an.bat</code> 1-click.
                    </p>
                  </div>

                  {/* Mode 2: Sync directly to running project */}
                  <div
                    onClick={() => setSyncToExisting(true)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      syncToExisting
                        ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${syncToExisting ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div className="font-heading font-black text-sm text-white">Đồng Bộ Vào Dự Án Đang Chạy</div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Ghi thẳng các component vào <code className="text-amber-300 font-mono">{projectName || 'dự án đang chọn'}/src/components/</code> và cập nhật App.jsx. Dev server đang bật sẽ hot-reload xem ngay lập tức!
                    </p>
                  </div>
                </div>

                {/* Form Inputs: Mode 2 (Sync to existing) vs Mode 1 (Create new) */}
                {syncToExisting ? (
                  <div className="bg-slate-900/90 p-5 rounded-2xl border border-blue-500/40 space-y-3.5 shadow-lg shadow-blue-500/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-xs font-bold text-blue-300 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                        <span>Tên Thư Mục Dự Án Đang Chạy Cần Đồng Bộ:</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Đích đến: <strong className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{projectName || 'Chưa nhập'}</strong>
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Nhập tên thư mục dự án (ví dụ: dai-tay-nam-edu-landing)"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-blue-500/60 font-mono text-sm text-blue-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        autoFocus
                      />
                      {projectName && (
                        <button
                          type="button"
                          onClick={() => setProjectName('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-2 py-1 rounded bg-slate-800"
                          title="Xóa để nhập lại"
                        >
                          ✕ Xóa
                        </button>
                      )}
                    </div>

                    {/* Quick suggestion project chips */}
                    {availableProjects.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>Dự án tìm thấy trong thư mục cha (Click chọn nhanh):</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {availableProjects.map((proj) => {
                            const isSelected = projectName.trim() === proj;
                            return (
                              <button
                                key={proj}
                                type="button"
                                onClick={() => setProjectName(proj)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400 ring-2 ring-blue-400/20'
                                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/80 hover:text-white'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-400'}`} />
                                <span>{proj}</span>
                                {isSelected && <span className="text-[10px] bg-blue-700 px-1 py-0.2 rounded text-white font-normal">Đang chọn</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                      <div className="leading-relaxed">
                        Toàn bộ file component sẽ được ghi vào <code className="text-amber-300 font-mono">landing-page/{projectName || '...'}/src/components/</code> và <code className="text-emerald-400 font-mono">App.jsx</code> sẽ được cập nhật. Nếu dự án này đang bật dev server, trình duyệt sẽ tự động Hot-Reload ngay lập tức.
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Form Inputs (If Mode 1: Tạo Thư Mục Mới) */
                  <div className="grid sm:grid-cols-2 gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tên Thư Mục Dự Án (Folder Name):
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="dai-tay-nam-edu-landing"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
                      />
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        Sẽ lưu tại: <span className="text-slate-300 font-mono">landing-page/{projectName || 'edu-landing'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Tiêu Đề Trang Web (HTML Title):
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Khóa Học Tiếng Nhật Edu - Landing Page"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                      <div className="text-[11px] text-slate-400 mt-1">
                        Hiển thị trên tab trình duyệt và tiêu đề SEO
                      </div>
                    </div>
                  </div>
                )}

                {/* Automation Checklist */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Các Tính Năng Tự Động 100%:
                  </div>
                  
                  <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                    />
                    <span>
                      Tự động chia tách <strong>{canvasSections.length} section</strong> thành từng file riêng biệt trong{' '}
                      <code className="text-emerald-400 font-mono">src/components/</code> (Header, Hero, Courses, Form, Footer...)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                    />
                    <span>
                      Tự động tạo <strong>App.jsx</strong> import và sắp xếp các component theo đúng thứ tự canvas
                    </span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                    />
                    <span>
                      Tự động tạo <strong>tailwind.config.js</strong> & <strong>index.css</strong> nhúng Màu (
                      <span className="text-amber-300 font-mono">{activeTheme.primary}</span>), Font (
                      <span className="text-emerald-300 font-mono">{activeFont.name}</span>), Bo góc (
                      <span className="text-cyan-300 font-mono">{activeRadius}px</span>)
                    </span>
                  </label>

                  {!syncToExisting && (
                    <label className="flex items-center gap-3 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoInstall}
                        onChange={(e) => setAutoInstall(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                      />
                      <span className="text-emerald-300 font-bold">
                        Tự động chạy `npm install` trong background ngay sau khi tạo folder
                      </span>
                    </label>
                  )}
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-3">
                    <X className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Step indicator during generation */}
                {isGenerating && (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-3 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>Đang tự động xử lý và tạo dự án...</span>
                      <span>Bước {generationStep}/5</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${(generationStep / 5) * 100}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {generationStep === 1 && '📁 Đang tạo cấu trúc thư mục...'}
                      {generationStep === 2 && '✂️ Đang chia tách từng file component vào src/components/...'}
                      {generationStep === 3 && '🎨 Đang cấu hình Tailwind CSS, Font & App.jsx...'}
                      {generationStep === 4 && '📦 Đang khởi tạo package.json và file chay-du-an.bat...'}
                      {generationStep === 5 && '⚡ Hoàn tất!'}
                    </div>
                  </div>
                )}

                {/* Big Action Submit Button */}
                <div className="pt-2">
                  <button
                    onClick={handleAutoCreateProject}
                    disabled={isGenerating || canvasSections.length === 0 || (syncToExisting && !projectName.trim())}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>ĐANG TỰ ĐỘNG TẠO DỰ ÁN ({generationStep}/5)...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span>
                          {syncToExisting
                            ? `🚀 ĐỒNG BỘ THẲNG VÀO DỰ ÁN "${projectName || '...'}" NGAY`
                            : `🚀 TỰ ĐỘNG TẠO THƯ MỤC "${projectName || 'edu-landing'}" & CÀI ĐẶT NGAY`}
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Không cần copy tay từng file! Toàn bộ file component sẽ được tạo và chia sẵn vào thư mục.
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Code Content Box for tabs (App.jsx, tailwind, index.css, single) */}
        {(activeTab !== 'auto-project' || singleSection) && (
          <div className="flex-1 overflow-hidden p-6 flex flex-col bg-slate-950/60">
            <div className="flex items-center justify-between pb-3 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">{currentFileName}</span>
              <span>Sao chép hoặc tải file trực tiếp</span>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
              <pre>
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Màu chính: <span className="text-amber-400 font-mono">{activeTheme.primary}</span> | Bo góc:{' '}
            <span className="text-emerald-400 font-mono">{activeRadius}px</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {(activeTab !== 'auto-project' || singleSection) && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép Mã'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File ({currentFileName})</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
