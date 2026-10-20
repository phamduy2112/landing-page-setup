// Raw source code imports for all 15 preset sections in EduLanding Studio
import headerTanSanhNguRaw from '../components/sections/HeaderTanSanhNgu.jsx?raw';
import headerSectionRaw from '../components/sections/HeaderSection.jsx?raw';
import heroStandardRaw from '../components/sections/HeroStandard.jsx?raw';
import heroSplitVideoRaw from '../components/sections/HeroSplitVideo.jsx?raw';
import needsCategorizedRaw from '../components/sections/NeedsCategorized.jsx?raw';
import whyUsComparisonRaw from '../components/sections/WhyUsComparison.jsx?raw';
import coursesGridRaw from '../components/sections/CoursesGrid.jsx?raw';
import roadmapTimelineRaw from '../components/sections/RoadmapTimeline.jsx?raw';
import openingScheduleTableRaw from '../components/sections/OpeningScheduleTable.jsx?raw';
import teachersSliderRaw from '../components/sections/TeachersSlider.jsx?raw';
import feedbackSliderRaw from '../components/sections/FeedbackSlider.jsx?raw';
import faqAccordionRaw from '../components/sections/FaqAccordion.jsx?raw';
import consultationFormRaw from '../components/sections/ConsultationForm.jsx?raw';
import floatingContactRaw from '../components/sections/FloatingContact.jsx?raw';
import footerSectionRaw from '../components/sections/FooterSection.jsx?raw';
import featureSplitRaw from '../components/sections/FeatureSplitSection.jsx?raw';

export const SECTIONS_RAW_CODE = {
  'header-tan-sanh-ngu': headerTanSanhNguRaw,
  'header-standard': headerSectionRaw,
  'hero-standard': heroStandardRaw,
  'hero-split-video': heroSplitVideoRaw,
  'needs-categorized': needsCategorizedRaw,
  'why-us-comparison': whyUsComparisonRaw,
  'feature-split-text-image': featureSplitRaw,
  'courses-grid': coursesGridRaw,
  'roadmap-timeline': roadmapTimelineRaw,
  'opening-schedule-table': openingScheduleTableRaw,
  'teachers-slider': teachersSliderRaw,
  'feedback-slider': feedbackSliderRaw,
  'faq-accordion': faqAccordionRaw,
  'consultation-form': consultationFormRaw,
  'floating-contact': floatingContactRaw,
  'footer-section': footerSectionRaw,
};

/**
 * Get raw JSX code for any section item (custom or catalog preset)
 */
export function getSectionSourceCode(item) {
  if (!item) return '';

  // 1. If it has customCode explicitly saved
  if (item.customCode) {
    return item.customCode;
  }

  // 2. If it's a sectionDef with customCode
  if (item.sectionDef?.customCode) {
    return item.sectionDef.customCode;
  }

  // 3. If it's one of the 15 standard catalog sections
  const defId = item.sectionDef?.id || item.id;
  if (defId && SECTIONS_RAW_CODE[defId]) {
    return SECTIONS_RAW_CODE[defId];
  }

  // 4. Fallback search by fileName
  const fileName = item.sectionDef?.fileName || item.fileName;
  if (fileName) {
    const key = Object.keys(SECTIONS_RAW_CODE).find(
      (k) => SECTIONS_RAW_CODE[k]?.includes(fileName.replace('.jsx', ''))
    );
    if (key && SECTIONS_RAW_CODE[key]) return SECTIONS_RAW_CODE[key];
  }

  // 5. Default generic JSX fallback
  return `import React from 'react';\n\nexport default function ${item.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Section'}() {\n  return (\n    <section className="py-16 bg-white text-center">\n      <h2 className="text-3xl font-bold">${item.name || 'Section'}</h2>\n    </section>\n  );\n}`;
}
