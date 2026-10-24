import React, { useState } from 'react';
import { Section, ThemeConfig, BusinessInfo } from '../../types/schema';
import { NavbarSection } from '../sections/NavbarSection';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { ServicesSection } from '../sections/ServicesSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { GallerySection } from '../sections/GallerySection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { CtaSection } from '../sections/CtaSection';
import { FaqSection } from '../sections/FaqSection';
import { ContactSection } from '../sections/ContactSection';
import { FooterSection } from '../sections/FooterSection';
import { FloatingWhatsAppButton } from '../common/FloatingWhatsAppButton';
import { ViewportProvider, ViewportMode } from '../../context/ViewportContext';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  LayoutGrid,
  Layers,
} from 'lucide-react';

interface Props {
  sections: Section[];
  theme: ThemeConfig;
  businessInfo?: BusinessInfo;
  slug?: string;
  isEditor?: boolean;
  activeSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onMoveSection?: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  onReorderSections?: (newSections: Section[]) => void;
  onUpdateSectionContent?: (sectionId: string, content: any) => void;
  showGridLines?: boolean;
  ownerPlan?: 'free' | 'pro';
  viewport?: ViewportMode;
}

export const getFontFamilyClass = (font?: string) => {
  switch (font) {
    case 'serif':
    case 'playfair':
      return 'font-playfair';
    case 'poppins':
      return 'font-poppins';
    case 'oswald':
      return 'font-oswald tracking-wide';
    case 'lora':
      return 'font-lora';
    case 'montserrat':
      return 'font-montserrat';
    case 'cinzel':
      return 'font-cinzel';
    case 'inter':
      return 'font-inter';
    case 'sans':
    case 'jakarta':
    default:
      return 'font-jakarta';
  }
};

export const WebsiteRenderer: React.FC<Props> = ({
  sections,
  theme,
  businessInfo,
  slug,
  isEditor = false,
  activeSectionId,
  onSelectSection,
  onMoveSection,
  onDeleteSection,
  onReorderSections,
  onUpdateSectionContent,
  showGridLines = false,
  ownerPlan = 'free',
  viewport = 'desktop',
}) => {
  const sortedSections = [...sections].sort((a, b) => a.position - b.position);

  // Drag and drop state directly on canvas
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'navbar': return 'Navigation Bar';
      case 'hero': return 'Hero Header (12 Kolom)';
      case 'about': return 'Tentang Kami (Split Grid)';
      case 'services': return 'Layanan & Menu (Multi-Kolom)';
      case 'features': return 'Keunggulan Bisnis (Grid)';
      case 'gallery': return 'Galeri Foto (Grid Layout)';
      case 'testimonials': return 'Testimoni Klien (Grid)';
      case 'cta': return 'Call To Action (Banner)';
      case 'faq': return 'FAQ Tanya Jawab (Accordion)';
      case 'contact': return 'Kontak & WhatsApp';
      case 'footer': return 'Footer Website';
      default: return type;
    }
  };

  const renderSectionComponent = (section: Section) => {
    switch (section.type) {
      case 'navbar':
        return (
          <NavbarSection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            businessInfo={businessInfo}
          />
        );
      case 'hero':
        return <HeroSection content={section.content as any} theme={theme} isEditor={isEditor} />;
      case 'about':
        return <AboutSection content={section.content as any} theme={theme} isEditor={isEditor} />;
      case 'services':
        return (
          <ServicesSection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            onUpdateContent={(c) => onUpdateSectionContent?.(section.id, c)}
          />
        );
      case 'features':
        return (
          <FeaturesSection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            onUpdateContent={(c) => onUpdateSectionContent?.(section.id, c)}
          />
        );
      case 'gallery':
        return (
          <GallerySection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            onUpdateContent={(c) => onUpdateSectionContent?.(section.id, c)}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            onUpdateContent={(c) => onUpdateSectionContent?.(section.id, c)}
          />
        );
      case 'cta':
        return <CtaSection content={section.content as any} theme={theme} isEditor={isEditor} />;
      case 'faq':
        return (
          <FaqSection
            content={section.content as any}
            theme={theme}
            isEditor={isEditor}
            onUpdateContent={(c) => onUpdateSectionContent?.(section.id, c)}
          />
        );
      case 'contact':
        return <ContactSection content={section.content as any} theme={theme} isEditor={isEditor} slug={slug} />;
      case 'footer':
        return <FooterSection content={section.content as any} theme={theme} isEditor={isEditor} />;
      default:
        return (
          <div className="p-8 text-center bg-amber-50 text-amber-800 border border-amber-200">
            Section tidak dikenal: {section.type}
          </div>
        );
    }
  };

  // Canvas Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    setDraggedIndex(null);
    setDragOverIndex(null);

    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const list = [...sortedSections];
    const [movedItem] = list.splice(sourceIndex, 1);
    list.splice(targetIndex, 0, movedItem);

    const reordered = list.map((s, idx) => ({ ...s, position: idx }));
    if (onReorderSections) {
      onReorderSections(reordered);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <ViewportProvider viewport={viewport}>
      <div
        className={`min-h-screen bg-white transition-all relative ${getFontFamilyClass(theme.font)}`}
        style={{
          backgroundColor: theme.backgroundColor || '#ffffff',
        }}
      >
      {/* ── Visual 12-Column Grid Blueprint Overlay (Tampilan Grid) ── */}
      {isEditor && showGridLines && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 12 }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="bg-indigo-500/5 border-x border-indigo-500/15 h-full relative"
              >
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-indigo-400 bg-indigo-50 px-1 rounded shadow-2xs">
                  C{colIdx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Render Sections List ── */}
      {sortedSections.map((section, index) => {
        const isActive = isEditor && activeSectionId === section.id;
        const isDragging = draggedIndex === index;
        const isTarget = dragOverIndex === index && draggedIndex !== index;

        if (!isEditor) {
          return <div key={section.id}>{renderSectionComponent(section)}</div>;
        }

        return (
          <div
            key={section.id}
            id={`editor-section-${section.id}`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className="relative"
          >
            {/* Visual Drop Target Bar Indicator */}
            {isTarget && (
              <div className="h-2 bg-blue-500 my-1 rounded-full animate-pulse shadow-md relative z-40 flex items-center justify-center">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                  ✦ Pindahkan Section ke Sini
                </span>
              </div>
            )}

            {/* Section Wrapper */}
            <div
              onClick={() => onSelectSection && onSelectSection(section.id)}
              className={`relative group cursor-pointer transition-all ${
                isDragging ? 'opacity-40 scale-98 border-2 border-dashed border-blue-500' : ''
              } ${
                isActive
                  ? 'ring-3 ring-blue-600 ring-offset-2 z-20 shadow-lg'
                  : 'hover:ring-2 hover:ring-blue-400 hover:ring-offset-1'
              } ${showGridLines ? 'border-b border-indigo-200/50' : ''}`}
            >
              {/* Floating Action Toolbar on Canvas */}
              <div
                className={`absolute top-2 right-3 z-30 px-2 py-1 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  isActive
                    ? 'bg-slate-900/90 text-white opacity-100'
                    : 'bg-slate-900/80 text-white opacity-0 group-hover:opacity-100'
                }`}
              >
                {/* Drag Handle on Canvas */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-grab active:cursor-grabbing"
                  title="Tarik (Drag) untuk memindahkan section di kanvas"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Drag</span>
                </div>

                {/* Move Up */}
                {index > 0 && onMoveSection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(index, 'up');
                    }}
                    className="p-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Pindah ke Atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Move Down */}
                {index < sortedSections.length - 1 && onMoveSection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(index, 'down');
                    }}
                    className="p-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Pindah ke Bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete */}
                {onDeleteSection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(section.id);
                    }}
                    className="p-1 rounded-md hover:bg-red-900/80 text-red-300 hover:text-red-100 transition"
                    title="Hapus Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Section Tag Badge (Top Left) */}
              <div
                className={`absolute top-2 left-3 z-30 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/80 text-white opacity-0 group-hover:opacity-100'
                }`}
              >
                <LayoutGrid className="w-3 h-3 text-blue-200" />
                <span>{getSectionTitle(section.type)}</span>
                {isActive && (
                  <span className="text-[9px] bg-blue-700 text-blue-100 px-1 rounded uppercase font-black">
                    Aktif
                  </span>
                )}
              </div>

              {/* Render Section Component */}
              {renderSectionComponent(section)}
            </div>
          </div>
        );
      })}

      {/* Floating WhatsApp Action Button */}
      {businessInfo?.enableFloatingWhatsapp !== false && (businessInfo?.whatsapp || isEditor) && (
        <FloatingWhatsAppButton
          phone={businessInfo?.whatsapp || ''}
          businessName={businessInfo?.name || ''}
          templateMessage={businessInfo?.whatsappMessageTemplate}
          slug={slug}
          operatingHours={businessInfo?.operatingHours}
          openTime={businessInfo?.openTime}
          closeTime={businessInfo?.closeTime}
          isEditor={isEditor}
        />
      )}

      {/* Free Plan Watermark Footer (100% Removed / White-label for PRO Plan) */}
      {ownerPlan !== 'pro' && (
        <aside
          aria-label="Branding Platform"
          className="py-5 px-4 bg-slate-900 text-center flex flex-col sm:flex-row items-center justify-center gap-2 border-t border-slate-800 text-slate-400 select-none"
        >
          <div className="flex items-center gap-1.5 text-xs">
            <span>Dibuat dengan</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold hover:text-blue-400 transition underline underline-offset-2 flex items-center gap-1"
            >
              <span>⚡ LOKA Site</span>
            </a>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <a
            href="/"
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Buat landing page bisnis Anda gratis →
          </a>
        </aside>
      )}
    </div>
  </ViewportProvider>
);
};
