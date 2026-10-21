import React, { useState, useEffect } from 'react';
import AdminHeader from './components/admin/AdminHeader';
import SectionSidebar from './components/admin/SectionSidebar';
import CanvasSectionItem from './components/admin/CanvasSectionItem';
import ThemeCustomizerModal from './components/admin/ThemeCustomizerModal';
import ExportModal from './components/admin/ExportModal';
import CodeEditorModal from './components/admin/CodeEditorModal';
import ContentEditorModal from './components/admin/ContentEditorModal';
import SectionInspectorPanel from './components/admin/SectionInspectorPanel';
import HtmlToReactTailwindModal from './components/admin/HtmlToReactTailwindModal';
import LoginModal from './components/admin/LoginModal';
import { COLOR_PRESETS, FONT_PRESETS, RADIUS_PRESETS } from './data/themes';
import { SECTIONS_CATALOG } from './data/sectionsCatalog';
import { Plus, Sparkles, Layers, ArrowDown, Code, Eye, EyeOff, Sliders } from 'lucide-react';
import { generateUpdatedSectionJsx } from './utils/sectionBlockManager';
import { applyThemeToDom } from './utils/colorSystem';
import { switchSectionColorTheme } from './utils/sectionColorTransform';
import { getSectionSourceCode } from './data/sectionsRawCode';

const STORAGE_KEYS = {
  CANVAS: 'edulanding_builder_canvas_v2',
  CUSTOM_TEMPLATES: 'edulanding_custom_templates_v2',
  CUSTOM_COMPONENTS: 'edulanding_custom_components_v2',
  THEME_ID: 'edulanding_active_theme_id',
  FONT_ID: 'edulanding_active_font_id',
  RADIUS: 'edulanding_active_radius',
  AUTH: 'edulanding_auth_session',
  SITE_CONFIG: 'edulanding_site_config_v2',
};

export default function App() {
  // Authentication State (Mặc định cần đăng nhập)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH);
      return Boolean(session);
    } catch {
      return false;
    }
  });

  // Site Brand & Meta Config
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      brandName: 'TÂN SANH NGỮ',
      brandSlogan: 'Học Viện Ngoại Ngữ Chuyên Sâu',
      logoUrl: '/assets/LOGO2.png',
      metaTitle: 'Tân Sanh Ngữ - Đào tạo Ngoại Ngữ Chuyên Sâu',
      metaDescription: 'Học tiếng Anh, tiếng Trung giao tiếp & luyện thi chứng chỉ thực chiến cùng giảng viên chuyên môn cao.',
    };
  });

  // Theme, Font & Radius States
  const [activeTheme, setActiveTheme] = useState(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.THEME_ID);
    return COLOR_PRESETS.find((t) => t.id === savedId) || COLOR_PRESETS[0];
  });

  const [activeFont, setActiveFont] = useState(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.FONT_ID);
    return FONT_PRESETS.find((f) => f.id === savedId) || FONT_PRESETS[0];
  });

  const [activeRadius, setActiveRadius] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RADIUS);
    return saved !== null ? Number(saved) : 16;
  });

  // Viewport Device ('desktop' | 'tablet' | 'mobile')
  const [viewport, setViewport] = useState('desktop');
  const [showToolbars, setShowToolbars] = useState(true);

  // Modals
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHtmlConvertModalOpen, setIsHtmlConvertModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingContentItem, setEditingContentItem] = useState(null);
  const [singleSectionCode, setSingleSectionCode] = useState(null);

  // Right Inspector Sidebar State & Selected Section (Cố định bên phải khi cuộn)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Saved Custom Code Templates (Sections)
  const [customTemplates, setCustomTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Saved Custom Components (Khối con dùng chung)
  const [customComponents, setCustomComponents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_COMPONENTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Preload a default high-converting education landing page setup or load from localStorage
  const [canvasSections, setCanvasSections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANVAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasTanSanhNgu = parsed.some(
            (p) =>
              p.sectionDef?.id === 'header-tan-sanh-ngu' ||
              p.sectionDef?.fileName === 'HeaderTanSanhNgu.jsx'
          );

          // Re-hydrate sectionDef components for preset sections
          const rehydrated = parsed.map((item) => {
            if (item.isCustom) return item;
            const originalDef = SECTIONS_CATALOG.find((s) => s.id === item.sectionDef?.id);
            return {
              ...item,
              sectionDef: originalDef || item.sectionDef,
            };
          });

          if (!hasTanSanhNgu) {
            const headerDef = SECTIONS_CATALOG.find((s) => s.id === 'header-tan-sanh-ngu');
            if (headerDef) {
              return [
                {
                  instanceId: `${headerDef.id}-${Date.now()}`,
                  sectionDef: headerDef,
                  customData: { ...headerDef.defaultData },
                },
                ...rehydrated,
              ];
            }
          }

          return rehydrated;
        }
      }
    } catch (e) {
      console.warn('Could not load saved canvas:', e);
    }

    const defaultIds = [
      'header-tan-sanh-ngu',
      'hero-standard',
      'needs-categorized',
      'why-us-comparison',
      'courses-grid',
      'roadmap-timeline',
      'schedule-table',
      'teachers-slider',
      'feedback-slider',
      'faq-accordion',
      'consultation-form',
      'floating-contact',
      'footer-standard',
    ];
    return defaultIds
      .map((id) => SECTIONS_CATALOG.find((s) => s.id === id))
      .filter(Boolean)
      .map((sec) => ({
        instanceId: `${sec.id}-${Date.now()}-${Math.random()}`,
        sectionDef: sec,
        customData: { ...sec.defaultData },
      }));
  });

  // Save canvasSections to localStorage
  useEffect(() => {
    try {
      const serializable = canvasSections.map((item) => ({
        instanceId: item.instanceId,
        isCustom: item.isCustom,
        name: item.name,
        customCode: item.customCode,
        customData: item.customData,
        buttonSettings: item.buttonSettings,
        styleSettings: item.styleSettings,
        layoutSettings: item.layoutSettings,
        deletedFields: item.deletedFields,
        sectionDef: {
          id: item.sectionDef?.id,
          name: item.sectionDef?.name,
          source: item.sectionDef?.source,
          badge: item.sectionDef?.badge,
          isCustom: item.sectionDef?.isCustom,
          customCode: item.sectionDef?.customCode,
          fileName: item.sectionDef?.fileName,
        },
      }));
      localStorage.setItem(STORAGE_KEYS.CANVAS, JSON.stringify(serializable));
    } catch (e) {
      // ignore
    }
  }, [canvasSections]);

  // Save customTemplates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(customTemplates));
    } catch (e) {
      // ignore
    }
  }, [customTemplates]);

  // Save customComponents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_COMPONENTS, JSON.stringify(customComponents));
    } catch (e) {
      // ignore
    }
  }, [customComponents]);

  // Save siteConfig to localStorage & update document.title
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(siteConfig));
      if (siteConfig?.metaTitle) {
        document.title = siteConfig.metaTitle;
      }
    } catch (e) {
      // ignore
    }
  }, [siteConfig]);

  // Auto-select first section or maintain valid selection
  useEffect(() => {
    if (canvasSections.length > 0) {
      const exists = canvasSections.some((s) => s.instanceId === selectedSectionId);
      if (!exists) {
        setSelectedSectionId(canvasSections[0].instanceId);
      }
    } else {
      setSelectedSectionId(null);
    }
  }, [canvasSections, selectedSectionId]);

  // Smooth scroll listener when ButtonCTA calls a section from inside iframes or canvas
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'SCROLL_TO_SECTION' && e.data?.sectionId) {
        const id = String(e.data.sectionId).toLowerCase().replace(/^#/, '');
        const target =
          document.getElementById(id) ||
          document.querySelector(`[id*="${id}"]`) ||
          document.querySelector(`[data-section-id*="${id}"]`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save Theme, Font, Radius to localStorage & Apply CSS variables dynamically to the document root
  useEffect(() => {
    const root = document.documentElement;
    const r = Number(activeRadius) || 16;

    // Save choices
    if (activeTheme?.id) localStorage.setItem(STORAGE_KEYS.THEME_ID, activeTheme.id);
    if (activeFont?.id) localStorage.setItem(STORAGE_KEYS.FONT_ID, activeFont.id);
    localStorage.setItem(STORAGE_KEYS.RADIUS, String(r));

    // Apply comprehensive theme variables (HEX + RGB channels for Tailwind opacity)
    applyThemeToDom(root, activeTheme, activeFont, r);
  }, [activeTheme, activeFont, activeRadius]);

  // Add standard or custom section to canvas
  const handleAddSection = (sectionDef) => {
    if (sectionDef.isCustom) {
      const newInstance = {
        instanceId: `custom-${Date.now()}-${Math.random()}`,
        isCustom: true,
        name: sectionDef.name,
        customCode: sectionDef.customCode,
        sectionDef: { ...sectionDef },
      };
      setCanvasSections((prev) => [...prev, newInstance]);
      return;
    }

    const newInstance = {
      instanceId: `${sectionDef.id}-${Date.now()}-${Math.random()}`,
      sectionDef,
      customData: { ...sectionDef.defaultData },
    };
    setCanvasSections((prev) => [...prev, newInstance]);
  };

  // Save or Update custom code (Section or Component)
  const handleSaveCustomCode = ({ type = 'section', category = 'courses', name, customCode, instanceId, id }) => {
    const cleanFileName = `${name.replace(/[^a-zA-Z0-9]/g, '_') || (type === 'component' ? 'CustomComponent' : 'CustomSection')}.jsx`;

    // CASE 1: Save as reusable Sub-component
    if (type === 'component') {
      const compId = id || `custom-comp-${Date.now()}`;
      const newComp = {
        id: compId,
        name,
        category: category || 'buttons',
        tag: 'Khối Con Tự Tạo',
        isCustom: true,
        type: 'component',
        description: `Component dùng chung (${category})`,
        codeSnippet: customCode,
        fullSnippet: customCode,
      };

      setCustomComponents((prev) => {
        const existingIdx = prev.findIndex((c) => c.id === compId || c.name.toLowerCase() === name.toLowerCase());
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newComp;
          return updated;
        }
        return [newComp, ...prev];
      });
      return;
    }

    // CASE 2: Save as Section on Canvas & in Saved Templates
    if (instanceId) {
      // Update existing in canvas
      setCanvasSections((prev) =>
        prev.map((item) => {
          if (item.instanceId === instanceId) {
            return {
              ...item,
              name,
              customCode,
              category,
              sectionDef: {
                ...item.sectionDef,
                name,
                customCode,
                category,
                fileName: cleanFileName,
              },
            };
          }
          return item;
        })
      );
    } else {
      // Add as new section to canvas
      const newInstance = {
        instanceId: `custom-${Date.now()}-${Math.random()}`,
        isCustom: true,
        name,
        customCode,
        category,
        sectionDef: {
          id: `custom-${Date.now()}`,
          name,
          source: 'Tùy Biến (Custom Code)',
          badge: 'Code',
          isCustom: true,
          category,
          customCode,
          fileName: cleanFileName,
        },
      };
      setCanvasSections((prev) => [...prev, newInstance]);
    }

    // Also persist as a saved reusable custom template in sidebar
    setCustomTemplates((prev) => {
      const existingIdx = prev.findIndex((t) => t.name.toLowerCase() === name.toLowerCase());
      const templateItem = {
        id: id || `tmpl-${Date.now()}`,
        name,
        category,
        source: 'Tùy Biến',
        badge: 'Code',
        isCustom: true,
        customCode,
        fileName: cleanFileName,
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = templateItem;
        return copy;
      }
      return [templateItem, ...prev];
    });
  };

  // Open modal to edit existing section code
  const handleEditSectionCode = (item) => {
    setEditingSection(item);
    setIsCodeModalOpen(true);
  };

  // Open modal to create new custom code section/component (or preloaded template)
  const handleOpenCodeModal = (templateOrNull = null, initialType = 'section') => {
    if (templateOrNull) {
      setEditingSection({
        id: templateOrNull.id,
        name: templateOrNull.name,
        customCode: templateOrNull.customCode || templateOrNull.codeSnippet,
        type: templateOrNull.type || (templateOrNull.isCustom && templateOrNull.category === 'buttons' ? 'component' : 'section'),
        category: templateOrNull.category,
        instanceId: templateOrNull.instanceId,
      });
    } else {
      setEditingSection({
        name: initialType === 'component' ? 'Component Tùy Biến Mới' : 'Section Tùy Biến Mới',
        type: initialType,
      });
    }
    setIsCodeModalOpen(true);
  };

  // Delete saved custom component
  const handleDeleteCustomComponent = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khối con / component này khỏi thư viện?')) {
      setCustomComponents((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Open modal to visually edit content and images
  const handleEditContent = (item) => {
    setEditingContentItem(item);
    setIsContentModalOpen(true);
  };

  // Save updated content and images back to canvas item
  const handleSaveContentChanges = ({ instanceId, name, customCode, customData, isCustom }) => {
    setCanvasSections((prev) =>
      prev.map((item) => {
        if (item.instanceId === instanceId) {
          const updatedName = name || item.name || item.sectionDef?.name;
          if (isCustom) {
            return {
              ...item,
              name: updatedName,
              customCode,
              sectionDef: {
                ...item.sectionDef,
                name: updatedName,
                customCode,
              },
            };
          } else {
            return {
              ...item,
              name: updatedName,
              customData: {
                ...item.customData,
                ...customData,
              },
              sectionDef: {
                ...item.sectionDef,
                name: updatedName,
              },
            };
          }
        }
        return item;
      })
    );
  };

  // Delete saved custom template
  const handleDeleteCustomTemplate = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mẫu custom section này khỏi danh sách lưu?')) {
      setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Move section up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setCanvasSections((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move section down
  const handleMoveDown = (index) => {
    if (index === canvasSections.length - 1) return;
    setCanvasSections((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Delete section
  const handleDelete = (index) => {
    setCanvasSections((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset Canvas
  const handleResetCanvas = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ các section trên canvas để làm lại từ đầu?')) {
      setCanvasSections([]);
    }
  };

  // Update section CTA button settings (WordPress-style)
  const handleUpdateSectionButton = ({ instanceId, buttonSettings }) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;

        const updated = {
          ...sec,
          buttonSettings,
          customData: {
            ...(sec.customData || {}),
            ctaPrimary: buttonSettings.text,
            ctaText: buttonSettings.text,
            buttonText: buttonSettings.text,
            targetSection: buttonSettings.targetSection,
            variant: buttonSettings.variant,
            size: buttonSettings.size,
          },
        };

        if (updated.customCode) {
          let newCode = updated.customCode;
          if (buttonSettings.text) {
            newCode = newCode.replace(
              /(<ButtonCTA[^>]*text=["'])([^"']+)(["'])/,
              `$1${buttonSettings.text}$3`
            );
          }
          if (buttonSettings.targetSection) {
            newCode = newCode.replace(
              /(<ButtonCTA[^>]*targetSection=["'])([^"']+)(["'])/,
              `$1${buttonSettings.targetSection}$3`
            );
          }
          if (buttonSettings.variant) {
            newCode = newCode.replace(
              /(<ButtonCTA[^>]*variant=["'])([^"']+)(["'])/,
              `$1${buttonSettings.variant}$3`
            );
          }
          updated.customCode = newCode;
        }

        return updated;
      })
    );
  };

  // Update section typography & alignment styles (text-center, font-size, etc.)
  const handleUpdateSectionStyles = ({ instanceId, styleSettings }) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;
        return {
          ...sec,
          styleSettings: {
            ...(sec.styleSettings || {}),
            ...styleSettings,
          },
        };
      })
    );
  };

  // Update section layout (column flip, block reordering, added/deleted sub-components)
  const handleUpdateSectionLayout = ({ instanceId, layoutSettings, updatedCode }) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;
        return {
          ...sec,
          layoutSettings: {
            ...(sec.layoutSettings || {}),
            ...layoutSettings,
          },
          customCode: updatedCode || sec.customCode,
        };
      })
    );
  };

  // Add a sub-component (Button, Heading, Badge, etc.) into an existing Section, or create a new multi-component Section
  const handleAddComponentToSection = (targetSectionId, comp, forceNewSection = false) => {
    let targetSection = !forceNewSection && targetSectionId
      ? canvasSections.find((s) => s.instanceId === targetSectionId)
      : null;

    if (!targetSection && !forceNewSection && canvasSections.length > 0) {
      targetSection =
        canvasSections.find((s) => s.instanceId === selectedSectionId) ||
        canvasSections[canvasSections.length - 1];
    }

    const blockType =
      comp.category === 'buttons' || comp.id?.includes('button')
        ? 'button'
        : comp.id?.includes('heading') || comp.category === 'headings'
        ? 'heading'
        : comp.id?.includes('text-with-image') || comp.id?.includes('split') || comp.category === 'features'
        ? 'split-text-image'
        : comp.type || 'badge';

    const newBlock = {
      id: `blk-${comp.id || blockType}-${Date.now().toString(36)}`,
      type: blockType,
      title: comp.name || 'Khối Mới',
      codeSnippet: comp.codeSnippet || '',
      props: {
        ...(comp.props || {}),
        text: comp.props?.text || comp.name || 'Nội dung khối',
        eyebrow: comp.props?.eyebrow || 'LỘ TRÌNH ĐÀO TẠO',
        title: comp.props?.title || 'Chương Trình Học',
        highlight: comp.props?.highlight || 'Thực Chiến 1:1',
        desc: comp.props?.desc || 'Bám sát mục tiêu thực tế của học viên.',
        imagePosition: comp.props?.imagePosition || 'right',
        imageSrc: comp.props?.imageSrc || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
        imageBadge: comp.props?.imageBadge || 'Cam kết đầu ra 100% bằng văn bản',
        bullets: comp.props?.bullets || [
          'Chỉnh sửa phát âm trực tiếp 1:1 cùng giảng viên chuyên môn cao',
          'Thực hành đàm phán thương mại và du học thực tế',
          'Cam kết chuẩn đầu ra bằng văn bản đào tạo minh bạch',
        ],
      },
    };

    if (targetSection) {
      const curLayout = targetSection.layoutSettings || {};
      const nextExtra = [...(curLayout.extraBlocks || []), newBlock];
      const nextOrder = [
        ...(curLayout.blocksOrder || Object.keys(targetSection.customData || {})),
        newBlock.id,
      ];
      const nextLayout = {
        ...curLayout,
        extraBlocks: nextExtra,
        blocksOrder: nextOrder,
      };

      const updatedCode = generateUpdatedSectionJsx(targetSection, nextLayout);

      setCanvasSections((prev) =>
        prev.map((sec) => {
          if (sec.instanceId !== targetSection.instanceId) return sec;
          return {
            ...sec,
            layoutSettings: nextLayout,
            customCode: updatedCode || sec.customCode,
          };
        })
      );
      setSelectedSectionId(targetSection.instanceId);
      return targetSection.instanceId;
    } else {
      // Create a new container section holding this component
      const instanceId = `multi-comp-sec-${Date.now()}`;
      const initialCode = `import React from 'react';
import ButtonCTA from './button-cta';
import SectionHeading from './section-heading';
import TextWithImage from './TextWithImage';

export default function MultiComponentSection() {
  return (
    <section className="py-16 bg-white text-center border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        ${comp.codeSnippet || `<ButtonCTA text="${newBlock.props.text}" targetSection="tu-van" />`}
      </div>
    </section>
  );
}`;
      const newSection = {
        instanceId,
        name: `Section: ${comp.name || 'Tổ Hợp Khối Con'}`,
        isCustom: true,
        customCode: initialCode,
        layoutSettings: {
          columnFlip: 'default',
          extraBlocks: [newBlock],
          blocksOrder: [newBlock.id],
          deletedBlocks: [],
        },
        sectionDef: {
          id: `sec-${Date.now()}`,
          name: `Section: ${comp.name || 'Tổ Hợp Khối Con'}`,
          source: 'Khối Con Tổng Hợp',
          badge: 'Tổ Hợp',
          isCustom: true,
          customCode: initialCode,
        },
      };

      setCanvasSections((prev) => [...prev, newSection]);
      setSelectedSectionId(instanceId);
      return instanceId;
    }
  };

  // Save customized ButtonCTA into customComponents library
  const handleSaveButtonComponent = ({ name, category, customCode, codeSnippet }) => {
    const compId = `btn-${Date.now()}`;
    const newComp = {
      id: compId,
      name,
      category: 'buttons',
      tag: 'Nút Bấm CTA',
      isCustom: true,
      type: 'component',
      description: `Nút bấm CTA tùy chỉnh theo section`,
      codeSnippet,
      fullSnippet: customCode,
    };
    setCustomComponents((prev) => [newComp, ...prev]);
  };

  // Update section customData & deletedFields from inline wireframe editor
  const handleUpdateSectionData = (instanceId, updatedData, updatedCode, deletedFields) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;
        return {
          ...sec,
          customData: updatedData,
          customCode: updatedCode || sec.customCode,
          deletedFields: deletedFields !== undefined ? deletedFields : sec.deletedFields,
        };
      })
    );
  };

  // Update section JSX code directly from inline live code editor
  const handleUpdateSectionLiveCode = (instanceId, newCode) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;
        return {
          ...sec,
          isCustom: true,
          customCode: newCode,
        };
      })
    );
  };

  // Chuyển đổi màu sắc (Primary <-> Secondary) trực tiếp tại Section
  const handleSwitchSectionColor = (instanceId, targetTheme) => {
    setCanvasSections((prev) =>
      prev.map((sec) => {
        if (sec.instanceId !== instanceId) return sec;

        const currentCode = sec.customCode || getSectionSourceCode(sec);
        const newCode = switchSectionColorTheme(currentCode, targetTheme);

        return {
          ...sec,
          isCustom: true,
          customCode: newCode,
          colorTheme: targetTheme,
          styleSettings: {
            ...(sec.styleSettings || {}),
            colorTheme: targetTheme,
          },
        };
      })
    );
  };

  // View single section code
  const handleViewSectionCode = (item) => {
    setSingleSectionCode(item);
    setIsExportModalOpen(true);
  };

  // 1. Xuất file JSON cấu hình (Export Canvas Schema)
  const handleExportJson = () => {
    try {
      const serializableSections = canvasSections.map((item) => ({
        instanceId: item.instanceId,
        isCustom: item.isCustom,
        name: item.name,
        customCode: item.customCode,
        customData: item.customData,
        layoutSettings: item.layoutSettings,
        styleSettings: item.styleSettings,
        colorTheme: item.colorTheme,
        sectionDef: {
          id: item.sectionDef?.id,
          name: item.sectionDef?.name,
          category: item.sectionDef?.category,
          isCustom: item.sectionDef?.isCustom,
          customCode: item.sectionDef?.customCode,
          fileName: item.sectionDef?.fileName,
        },
      }));

      const exportData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        author: siteConfig?.brandName || 'EduLanding Studio',
        siteConfig,
        theme: activeTheme,
        font: activeFont,
        radius: activeRadius,
        canvasSections: serializableSections,
        customTemplates,
        customComponents,
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `landing-page-config-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Không thể xuất file JSON: ' + err.message);
    }
  };

  // 2. Nhập file JSON cấu hình (Import Canvas Schema từ máy khác)
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (!parsed || !Array.isArray(parsed.canvasSections)) {
          alert('File JSON không hợp lệ hoặc thiếu dữ liệu canvasSections!');
          return;
        }

        // Tái tạo component cho preset sections
        const rehydrated = parsed.canvasSections.map((item) => {
          if (item.isCustom) return item;
          const originalDef = SECTIONS_CATALOG.find((s) => s.id === item.sectionDef?.id);
          return {
            ...item,
            sectionDef: originalDef || item.sectionDef,
          };
        });

        // Áp dụng Site Brand & Meta, Theme, Font, Radius nếu có trong file
        if (parsed.siteConfig) setSiteConfig(parsed.siteConfig);
        if (parsed.theme) setActiveTheme(parsed.theme);
        if (parsed.font) setActiveFont(parsed.font);
        if (parsed.radius !== undefined) setActiveRadius(parsed.radius);
        if (Array.isArray(parsed.customTemplates)) setCustomTemplates(parsed.customTemplates);
        if (Array.isArray(parsed.customComponents)) setCustomComponents(parsed.customComponents);

        setCanvasSections(rehydrated);
        alert(`Đã nhập thành công ${rehydrated.length} sections từ file JSON!`);
      } catch (err) {
        alert('Lỗi khi đọc file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input file
  };

  // 3. Đăng xuất Studio
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất khỏi Studio không?')) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-body selection:bg-blue-600 selection:text-white">

      {/* Top Admin Header Bar */}
      <AdminHeader
        viewport={viewport}
        setViewport={setViewport}
        activeTheme={activeTheme}
        activeFont={activeFont}
        activeRadius={activeRadius}
        siteConfig={siteConfig}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenExportModal={() => {
          setSingleSectionCode(null);
          setIsExportModalOpen(true);
        }}
        onResetCanvas={handleResetCanvas}
        sectionsCount={canvasSections.length}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen((prev) => !prev)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onLogout={handleLogout}
      />

      {/* Login Modal khi chưa đăng nhập */}
      {!isAuthenticated && (
        <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Main Studio Workspace */}
      <div className="flex-1 flex w-full relative items-start">

        {/* Left Drawer / Sidebar */}
        <SectionSidebar
          onAddSection={handleAddSection}
          onAddComponentToSection={handleAddComponentToSection}
          canvasSections={canvasSections}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
          onViewSectionCode={handleViewSectionCode}
          onOpenCodeModal={handleOpenCodeModal}
          addedSectionIds={canvasSections.map((s) => s.sectionDef?.id || s.instanceId)}
          customTemplates={customTemplates}
          onDeleteCustomTemplate={handleDeleteCustomTemplate}
          customComponents={customComponents}
          onDeleteCustomComponent={handleDeleteCustomComponent}
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          activeFont={activeFont}
          setActiveFont={setActiveFont}
          activeRadius={activeRadius}
          setActiveRadius={setActiveRadius}
          siteConfig={siteConfig}
          onUpdateSiteConfig={(patch) => setSiteConfig((prev) => ({ ...prev, ...patch }))}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
        />

        {/* Center Canvas / Preview Area */}
        <main className="flex-1 bg-slate-900/60 p-4 sm:p-8 flex flex-col items-center min-w-0">

          {/* Viewport Frame */}
          <div
            className={`transition-all duration-300 w-full rounded-3xl overflow-hidden shadow-2xl border-4 ${viewport === 'desktop'
              ? 'max-w-7xl border-slate-800'
              : viewport === 'tablet'
                ? 'max-w-[768px] border-slate-700 shadow-blue-500/10'
                : 'max-w-[390px] border-slate-700 shadow-blue-500/10'
              }`}
          >

            {/* Viewport Header Indicator */}
            {viewport !== 'desktop' && (
              <div className="bg-slate-800 text-slate-300 py-1.5 px-3 sm:px-4 font-mono text-[11px] font-bold border-b border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Khung nhìn: {viewport.toUpperCase()} ({viewport === 'tablet' ? '768px' : '390px'})</span>
                </div>
                <button
                  onClick={() => setShowToolbars((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans font-semibold flex items-center gap-1.5 transition-all border border-slate-600 shadow-sm active:scale-95 cursor-pointer"
                  title="Bật hoặc ẩn thanh công cụ đen trên mỗi section"
                >
                  {showToolbars ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ẩn thanh công cụ</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hiện thanh công cụ</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Canvas Sections Container */}
            <div className="bg-white min-h-[600px] flex flex-col space-y-4 p-2 sm:p-4">

              {canvasSections.map((item, index) => (
                <CanvasSectionItem
                  key={item.instanceId}
                  item={item}
                  index={index}
                  total={canvasSections.length}
                  viewport={viewport}
                  showToolbar={showToolbars}
                  isSelected={item.instanceId === selectedSectionId}
                  onSelect={(id) => setSelectedSectionId(id)}
                  onCustomizeButton={(targetItem) => {
                    setSelectedSectionId(targetItem.instanceId);
                    setIsRightPanelOpen(true);
                  }}
                  onSwitchSectionColor={handleSwitchSectionColor}
                  onUpdateSectionData={handleUpdateSectionData}
                  onUpdateSectionLiveCode={handleUpdateSectionLiveCode}
                  onUpdateSectionStyles={handleUpdateSectionStyles}
                  onUpdateSectionLayout={handleUpdateSectionLayout}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onDelete={handleDelete}
                  onViewCode={handleViewSectionCode}
                  onEditCode={handleEditSectionCode}
                  onEditContent={handleEditContent}
                  activeTheme={activeTheme}
                  activeFont={activeFont}
                  activeRadius={activeRadius}
                  siteConfig={siteConfig}
                />
              ))}

              {/* Empty State */}
              {canvasSections.length === 0 && (
                <div className="py-24 text-center space-y-4 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                    <Layers className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-slate-800">
                    Trang hiện đang trống
                  </h3>
                  <p className="text-sm max-w-md mx-auto text-slate-500">
                    Hãy bấm vào các section ở cột bên trái hoặc nút{' '}
                    <strong className="text-blue-600">+ Thêm Section Bằng Code</strong> để tự động tạo ngay vào trang này.
                  </p>
                  <button
                    onClick={() => handleOpenCodeModal(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                  >
                    <Code className="w-4 h-4" />
                    <span>Dán / Nhập Code Mới Ngay</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </main>

        {/* Right Sidebar Inspector (CỐ ĐỊNH BÊN PHẢI KHI CUỘN CANVAS) */}
        {isRightPanelOpen && (
          <SectionInspectorPanel
            isOpen={isRightPanelOpen}
            onClose={() => setIsRightPanelOpen(false)}
            sections={canvasSections}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onSwitchSectionColor={handleSwitchSectionColor}
            onUpdateSectionStyles={handleUpdateSectionStyles}
            onUpdateSectionLayout={handleUpdateSectionLayout}
            onUpdateSectionButton={handleUpdateSectionButton}
            onSaveButtonComponent={handleSaveButtonComponent}
            onEditSectionContent={handleEditContent}
            onEditSectionCode={handleEditSectionCode}
            onUpdateSectionCode={handleUpdateSectionLiveCode}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDeleteSection={handleDelete}
            activeTheme={activeTheme}
            activeFont={activeFont}
            activeRadius={activeRadius}
          />
        )}

      </div>

      {/* Floating Re-Open Inspector Button when closed */}
      {!isRightPanelOpen && canvasSections.length > 0 && (
        <button
          onClick={() => setIsRightPanelOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-blue-500/30 flex items-center gap-2 border border-blue-400/40 active:scale-95 transition-all"
          title="Mở thanh Tùy Chỉnh Section & Nút Bấm bên phải"
        >
          <Sliders className="w-4 h-4 text-amber-300" />
          <span>Tùy Chỉnh Section</span>
        </button>
      )}

      {/* Code Editor Modal */}
      <CodeEditorModal
        isOpen={isCodeModalOpen}
        onClose={() => {
          setIsCodeModalOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveCustomCode}
        editingSection={editingSection}
        activeTheme={activeTheme}
        activeFont={activeFont}
        activeRadius={activeRadius}
      />

      {/* Theme Customizer Modal (Colors, Fonts & Border Radius) */}
      <ContentEditorModal
        isOpen={isContentModalOpen}
        onClose={() => {
          setIsContentModalOpen(false);
          setEditingContentItem(null);
        }}
        item={editingContentItem}
        onSave={handleSaveContentChanges}
        activeTheme={activeTheme}
        activeFont={activeFont}
        activeRadius={activeRadius}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        activeFont={activeFont}
        setActiveFont={setActiveFont}
        activeRadius={activeRadius}
        setActiveRadius={setActiveRadius}
      />

      {/* Export Code Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setSingleSectionCode(null);
        }}
        canvasSections={canvasSections}
        activeTheme={activeTheme}
        activeFont={activeFont}
        activeRadius={activeRadius}
        singleSection={singleSectionCode}
      />

      {/* HTML/CSS to React + Tailwind Modal */}
      <HtmlToReactTailwindModal
        isOpen={isHtmlConvertModalOpen}
        onClose={() => setIsHtmlConvertModalOpen(false)}
        onApplyToEditor={(convertedCode) => {
          setIsHtmlConvertModalOpen(false);
          setEditingSection({
            name: 'Section vừa chuyển đổi',
            customCode: convertedCode,
            isCustom: true,
          });
          setIsCodeModalOpen(true);
        }}
      />

    </div>
  );
}
