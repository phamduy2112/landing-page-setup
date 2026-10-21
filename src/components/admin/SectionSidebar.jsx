import React, { useState } from 'react';
import {
  Search,
  Plus,
  Code,
  Sparkles,
  Filter,
  ChevronRight,
  ChevronDown,
  Check,
  Edit3,
  Trash2,
  Upload,
  Copy,
  Box,
  Layers,
  GraduationCap,
  Globe,
  Palette,
  FileJson,
  Image as ImageIcon,
  Sliders,
  Type,
} from 'lucide-react';
import { SECTION_CATEGORIES, SECTIONS_CATALOG } from '../../data/sectionsCatalog';
import { SUBCOMPONENTS_CATALOG } from '../../data/subcomponentsCatalog';
import { COLOR_PRESETS, FONT_PRESETS, RADIUS_PRESETS } from '../../data/themes';
import ButtonCTA from '../common/ButtonCTA';

// Only educational landing pages have these categories
const EDUCATION_CATEGORIES = ['courses', 'schedule', 'roadmap', 'teachers', 'needs'];

export default function SectionSidebar({
  onAddSection,
  onAddComponentToSection,
  canvasSections = [],
  selectedSectionId,
  onSelectSection,
  onViewSectionCode,
  onOpenCodeModal,
  addedSectionIds = [],
  customTemplates = [],
  onDeleteCustomTemplate,
  customComponents = [],
  onDeleteCustomComponent,
  activeTheme,
  setActiveTheme,
  activeFont,
  setActiveFont,
  activeRadius = 16,
  setActiveRadius,
  siteConfig = {},
  onUpdateSiteConfig,
  onExportJson,
  onImportJson,
  onOpenThemeModal,
}) {
  const [sidebarTab, setSidebarTab] = useState('sections'); // 'sections' | 'brand-theme' | 'components'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Active targeted section for inserting components
  const targetSection =
    canvasSections.find((s) => s.instanceId === selectedSectionId) ||
    canvasSections[canvasSections.length - 1];
  const targetSectionName = targetSection
    ? (targetSection.name || targetSection.sectionDef?.name || 'Section')
    : '';

  const handleCopySnippet = (snippet, id) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddStandaloneComponent = (comp) => {
    const timestamp = Date.now();
    const wrappedCode = `import React from 'react';
import ButtonCTA from './ButtonCTA.jsx';

export default function StandaloneBlock_${timestamp}() {
  return (
    <section className="py-12 bg-white text-center border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        ${comp.codeSnippet}
      </div>
    </section>
  );
}`;
    onAddSection({
      id: `standalone-${comp.id}-${timestamp}`,
      name: `Khối: ${comp.name}`,
      isCustom: true,
      customCode: wrappedCode,
    });
  };

  const filteredSections = SECTIONS_CATALOG.filter((sec) => {
    const matchesCat = selectedCategory === 'all' || sec.category === selectedCategory;
    const matchesSearch =
      sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredCustomComponents = (customComponents || []).filter((comp) => {
    return (
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description && comp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comp.tag && comp.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comp.category && comp.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredSubcomponents = SUBCOMPONENTS_CATALOG.filter((comp) => {
    return (
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <aside className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] shrink-0 z-30 select-none overflow-hidden sticky top-16 shadow-xl">
      {/* Top Action & Search Bar */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/90 backdrop-blur-md">

        {/* JSON Tổng & Khôi Phục Nhanh */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={onExportJson}
            disabled={canvasSections.length === 0}
            className="flex-1 py-2 px-2.5 rounded-xl text-xs font-black text-amber-300 hover:text-slate-950 hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
            title="Xuất toàn bộ cấu hình trang thành file JSON tổng"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Xuất JSON ({canvasSections.length})</span>
          </button>

          <label
            className="flex-1 py-2 px-2.5 rounded-xl text-xs font-black text-emerald-400 hover:text-slate-950 hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Nhập file JSON tổng để khôi phục cấu hình trang"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportJson}
              className="hidden"
            />
          </label>
        </div>

        {/* Segmented Switcher: 1. Sections | 2. Brand & Theme | 3. Khối Con */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setSidebarTab('sections')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              sidebarTab === 'sections'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Sections</span>
          </button>

          <button
            onClick={() => setSidebarTab('brand-theme')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              sidebarTab === 'brand-theme'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-amber-400/90 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Màu & Brand</span>
          </button>

          <button
            onClick={() => setSidebarTab('components')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              sidebarTab === 'components'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khối Con</span>
          </button>
        </div>

        {/* Search Input (Hiển thị khi ở tab Sections hoặc Khối Con) */}
        {sidebarTab !== 'brand-theme' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                sidebarTab === 'sections'
                  ? 'Tìm section (Khóa học, Lịch học, Form, FAQ...)...'
                  : 'Tìm component (Button CTA, Card đơn, Tiêu đề...)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Category Pills (Only for Sections) with Education distinction */}
        {sidebarTab === 'sections' && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {SECTION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const isEducation = EDUCATION_CATEGORIES.includes(cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${isSelected
                      ? isEducation
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-blue-600 text-white shadow-sm'
                      : isEducation
                        ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                      }`}
                  >
                    {isEducation ? '🎓 ' : ''}{cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span className="flex items-center gap-1 text-amber-300">
                <GraduationCap className="w-3 h-3" />
                <span>🎓 = Đặc thù ngành giáo dục (Khóa học, Lịch học, Lộ trình...)</span>
              </span>
              <span>{filteredSections.length} mục</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area: Brand & Theme Tab */}
      {sidebarTab === 'brand-theme' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5">
          {/* 1. BRAND & META SETTINGS */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Thương Hiệu & Header</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Đồng bộ tức thì</span>
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Tên Thương Hiệu (Brand Name)
              </label>
              <input
                type="text"
                value={siteConfig?.brandName || ''}
                onChange={(e) => onUpdateSiteConfig && onUpdateSiteConfig({ brandName: e.target.value })}
                placeholder="VD: TÂN SANH NGỮ / ĐẠI TÂY NAM EDU"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            {/* Brand Slogan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Khẩu hiệu / Slogan
              </label>
              <input
                type="text"
                value={siteConfig?.brandSlogan || ''}
                onChange={(e) => onUpdateSiteConfig && onUpdateSiteConfig({ brandSlogan: e.target.value })}
                placeholder="VD: Học Viện Ngoại Ngữ Chuyên Sâu"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Đường dẫn Logo (Image URL / Path)</span>
                <ImageIcon className="w-3 h-3 text-slate-400" />
              </label>
              <input
                type="text"
                value={siteConfig?.logoUrl || ''}
                onChange={(e) => onUpdateSiteConfig && onUpdateSiteConfig({ logoUrl: e.target.value })}
                placeholder="VD: /assets/LOGO2.png hoặc link https://"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              {siteConfig?.logoUrl && (
                <div className="mt-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Xem trước:</span>
                  <img
                    src={siteConfig.logoUrl}
                    alt="Logo preview"
                    className="max-h-6 max-w-[120px] object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Tiêu Đề Trang (Meta Title)
              </label>
              <input
                type="text"
                value={siteConfig?.metaTitle || ''}
                onChange={(e) => onUpdateSiteConfig && onUpdateSiteConfig({ metaTitle: e.target.value })}
                placeholder="VD: Tân Sanh Ngữ - Đào tạo Ngoại Ngữ Thực Chiến"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Mô tả SEO (Meta Description)
              </label>
              <textarea
                rows={2}
                value={siteConfig?.metaDescription || ''}
                onChange={(e) => onUpdateSiteConfig && onUpdateSiteConfig({ metaDescription: e.target.value })}
                placeholder="Mô tả tóm tắt nội dung khi chia sẻ link Zalo, Facebook..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* 2. COLOR PALETTE PRESETS & CUSTOM */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Bảng Màu Tùy Biến</span>
              </span>
              <button
                onClick={onOpenThemeModal}
                className="text-[10px] text-blue-400 hover:text-white font-bold underline"
              >
                Mở rộng
              </button>
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PRESETS.slice(0, 6).map((preset) => {
                const isSelected = activeTheme?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setActiveTheme && setActiveTheme(preset)}
                    className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-[11px] font-bold truncate">{preset.name.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom HEX Colors */}
            <div className="pt-2 border-t border-slate-700/60 space-y-2">
              <span className="block text-[11px] font-bold text-slate-300">Tự Chọn Mã Màu Riêng (HEX)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Màu Chính (Primary)</span>
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    <input
                      type="color"
                      value={activeTheme?.primary || '#003366'}
                      onChange={(e) =>
                        setActiveTheme &&
                        setActiveTheme({ ...activeTheme, id: 'custom', primary: e.target.value })
                      }
                      className="w-6 h-6 rounded-lg border-0 bg-transparent cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={activeTheme?.primary || '#003366'}
                      onChange={(e) =>
                        setActiveTheme &&
                        setActiveTheme({ ...activeTheme, id: 'custom', primary: e.target.value })
                      }
                      className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Màu Nút (Secondary)</span>
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    <input
                      type="color"
                      value={activeTheme?.secondary || '#F5A623'}
                      onChange={(e) =>
                        setActiveTheme &&
                        setActiveTheme({ ...activeTheme, id: 'custom', secondary: e.target.value })
                      }
                      className="w-6 h-6 rounded-lg border-0 bg-transparent cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={activeTheme?.secondary || '#F5A623'}
                      onChange={(e) =>
                        setActiveTheme &&
                        setActiveTheme({ ...activeTheme, id: 'custom', secondary: e.target.value })
                      }
                      className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bo góc Radius */}
            <div className="pt-2 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
                <span>Độ Bo Góc Nút & Khối</span>
                <span className="text-amber-300 font-mono">{activeRadius}px</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[8, 12, 16, 24].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRadius && setActiveRadius(r)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
                      activeRadius === r
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {r}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Components Tab */}
      {sidebarTab === 'components' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <div className="text-xs text-slate-400 px-1 font-semibold flex items-center justify-between">
            <span>Component Dùng Chung</span>
            <span className="text-[11px] text-amber-400 font-mono">Dễ kiểm soát CSS</span>
          </div>

          {/* Target Section Selector Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 text-xs text-slate-200 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-300 flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>🎯 Thêm Component Vào Section:</span>
              </span>
              {canvasSections.length > 0 && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {canvasSections.length} section trên trang
                </span>
              )}
            </div>

            {canvasSections.length > 0 ? (
              <div className="space-y-1.5">
                <div className="relative">
                  <select
                    value={targetSection?.instanceId || ''}
                    onChange={(e) => onSelectSection && onSelectSection(e.target.value)}
                    className="w-full px-3 py-2 pr-8 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
                  >
                    {canvasSections.map((sec, idx) => (
                      <option key={sec.instanceId} value={sec.instanceId}>
                        #{idx + 1} - {sec.name || sec.sectionDef?.name || 'Section'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Các component bạn bấm bên dưới sẽ nằm <strong>CHUNG TRONG 1 SECTION #{canvasSections.findIndex((s) => s.instanceId === targetSection?.instanceId) + 1}</strong> này!
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-300 leading-snug">
                Trang chưa có section. Khi bấm thêm, hệ thống sẽ tự động tạo <strong>Section Mới</strong> chứa component này. Các component bấm tiếp theo sẽ vào <strong>chung section đó</strong>!
              </p>
            )}
          </div>

          {/* User-created Custom Components (if any) */}
          {filteredCustomComponents && filteredCustomComponents.length > 0 && (
            <div className="space-y-2.5 pb-2">
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Component Tự Tạo Của Bạn ({filteredCustomComponents.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">Đã lưu trong máy</span>
              </div>

              {filteredCustomComponents.map((comp) => {
                const isCopied = copiedId === comp.id;

                return (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-500/60 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-extrabold text-xs text-white">
                          {comp.name}
                        </h4>
                        <span className="text-[10px] text-purple-300/80 font-mono">
                          Phân loại: {comp.category || 'buttons'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 font-mono">
                        Tự Tạo
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto border border-slate-800">
                      <code>{comp.codeSnippet}</code>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (onAddComponentToSection) {
                              onAddComponentToSection(targetSection?.instanceId, comp, false);
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/25"
                          title={
                            canvasSections.length > 0
                              ? `Thêm component này vào "${targetSectionName}" (chung 1 section)`
                              : 'Tạo section mới chứa component này'
                          }
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            {canvasSections.length > 0
                              ? `➕ Thêm Vào Section #${canvasSections.findIndex((s) => s.instanceId === targetSection?.instanceId) + 1}`
                              : '➕ Tạo Section Với Khối Này'}
                          </span>
                        </button>

                        {canvasSections.length > 0 && (
                          <button
                            onClick={() => {
                              if (onAddComponentToSection) {
                                onAddComponentToSection(null, comp, true);
                              }
                            }}
                            className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition active:scale-95 shrink-0"
                            title="Tạo riêng 1 section mới hoàn toàn chỉ chứa khối này"
                          >
                            <span>+ Sec Mới</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopySnippet(comp.codeSnippet, comp.id)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono transition flex items-center justify-center gap-1 border ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                          }`}
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Đã Copy!' : 'Copy JSX'}</span>
                        </button>

                        <button
                          onClick={() => onOpenCodeModal && onOpenCodeModal(comp, 'component')}
                          className="p-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                          title="Sửa code component này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {onDeleteCustomComponent && (
                          <button
                            onClick={() => onDeleteCustomComponent(comp.id)}
                            className="p-1.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition"
                            title="Xóa component này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Preset Sub-components Catalog */}
          <div className="space-y-3 pt-1">
            <div className="text-xs text-slate-400 px-1 font-semibold flex items-center justify-between">
              <span>Thư Viện Khối Con Mẫu ({filteredSubcomponents.length})</span>
            </div>

            {filteredSubcomponents.map((comp) => {
              const isCopied = copiedId === comp.id;

              return (
                <div
                  key={comp.id}
                  className="rounded-2xl bg-slate-800/50 hover:bg-slate-800 p-3.5 border border-slate-700/70 hover:border-amber-500/50 transition-all duration-200 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-extrabold text-xs text-white">
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold shrink-0">
                      {comp.tag}
                    </span>
                  </div>

                  {/* Live Mini Preview Box */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center min-h-[50px] overflow-hidden">
                    {comp.category === 'buttons' ? (
                      <ButtonCTA
                        text={comp.props?.text}
                        variant={comp.props?.variant}
                        size={comp.props?.size || 'sm'}
                        targetSection={comp.props?.targetSection}
                      />
                    ) : comp.id === 'section-heading-standard' ? (
                      <div className="text-center py-1">
                        <span className="text-[9px] font-bold tracking-wider text-amber-400 uppercase block">LỘ TRÌNH ĐÀO TẠO</span>
                        <h5 className="text-xs font-bold text-white">Chương Trình Học <span className="text-amber-300">Thực Chiến</span></h5>
                      </div>
                    ) : comp.id === 'text-with-image-split' ? (
                      <div className="w-full flex items-center justify-between gap-2.5 py-1 px-1">
                        <div className="space-y-1 text-left min-w-0 flex-1">
                          <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider block">ĐỘC QUYỀN</span>
                          <div className="text-[11px] font-bold text-white truncate">Text Trái & <span className="text-amber-300">Ảnh Phải</span></div>
                          <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-900 text-[9px] font-black">Nút CTA</span>
                        </div>
                        <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-800 shadow">
                          <img src={comp.props?.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                        <span>✨</span>
                        <span>Cam kết đầu ra 100%</span>
                      </span>
                    )}
                  </div>

                  {/* Code Snippet Display */}
                  <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto border border-slate-800/80">
                    <code>{comp.codeSnippet}</code>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onAddComponentToSection) {
                            onAddComponentToSection(targetSection?.instanceId, comp, false);
                          }
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/25"
                        title={
                          canvasSections.length > 0
                            ? `Thêm component này vào "${targetSectionName}" (chung 1 section)`
                            : 'Tạo section mới chứa component này'
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {canvasSections.length > 0
                            ? `➕ Thêm Vào Section #${canvasSections.findIndex((s) => s.instanceId === targetSection?.instanceId) + 1}`
                            : '➕ Tạo Section Với Khối Này'}
                        </span>
                      </button>

                      {canvasSections.length > 0 && (
                        <button
                          onClick={() => {
                            if (onAddComponentToSection) {
                              onAddComponentToSection(null, comp, true);
                            }
                          }}
                          className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition active:scale-95 shrink-0"
                          title="Tạo riêng 1 section mới hoàn toàn chỉ chứa khối này"
                        >
                          <span>+ Sec Mới</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopySnippet(comp.codeSnippet, comp.id)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-mono transition flex items-center justify-center gap-1.5 border ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                      }`}
                      title="Sao chép mã JSX nếu muốn dùng trong code"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Đã sao chép mã JSX!' : 'Copy mã JSX (tùy chọn)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area: Sections Tab */}
      {sidebarTab === 'sections' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-800/40">

          {/* Saved Custom Code Section Templates (if any exist) */}
          {customTemplates && customTemplates.length > 0 && (
            <div className="pb-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold px-1">
                <span className="flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" />
                  <span>Section Tự Tạo Của Bạn ({customTemplates.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">Đã lưu trong máy</span>
              </div>

              <div className="space-y-2">
                {customTemplates.map((custom) => (
                  <div
                    key={custom.id}
                    className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-extrabold text-xs text-white truncate max-w-[180px]">
                        {custom.name}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        {custom.category ? `${custom.category}` : 'Custom'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => onAddSection(custom)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Thêm Vào Trang</span>
                      </button>

                      <button
                        onClick={() => onOpenCodeModal && onOpenCodeModal(custom, 'section')}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                        title="Sửa code mẫu này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteCustomTemplate && (
                        <button
                          onClick={() => onDeleteCustomTemplate(custom.id)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition"
                          title="Xóa mẫu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold pt-2">
            <span>Kho Section Mẫu ({filteredSections.length})</span>
            <span className="text-[11px] text-blue-400">Click để thêm vào trang</span>
          </div>

          {/* Preset Sections Catalog */}
          {filteredSections.map((sec) => {
            const isAdded = addedSectionIds.includes(sec.id);
            const isEducation = EDUCATION_CATEGORIES.includes(sec.category);

            return (
              <div
                key={sec.id}
                className={`pt-3 group rounded-2xl bg-slate-800/50 hover:bg-slate-800 p-3.5 border transition-all duration-200 space-y-2.5 shadow-sm hover:shadow-md ${isEducation
                  ? 'border-amber-500/30 hover:border-amber-500/60'
                  : 'border-slate-700/70 hover:border-blue-500/50'
                  }`}
              >
                {/* Header with Title & Source Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors">
                        {sec.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {isEducation && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                          🎓 Giáo Dục
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">
                        {sec.source}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                    {sec.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {sec.description}
                </p>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onAddSection(sec)}
                    className={`flex-1 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm ${isAdded
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAdded ? 'Thêm Thêm (+1)' : 'Thêm Vào Trang'}</span>
                  </button>

                  <button
                    onClick={() => onViewSectionCode(sec)}
                    className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-all active:scale-95"
                    title="Xem và xuất code JSX riêng của section này"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <p>Không tìm thấy section phù hợp với từ khóa.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-blue-400 hover:underline font-bold"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          )}

        </div>
      )}

      {/* Bottom Info Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>TailwindCSS & React 19</span>
        </span>
        <span className="text-slate-500">EduLanding Studio</span>
      </div>

    </aside>
  );
}
