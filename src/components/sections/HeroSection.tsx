import React from 'react';
import { HeroContent, ThemeConfig } from '../../types/schema';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useViewport } from '../../context/ViewportContext';

interface Props {
  content: HeroContent;
  theme: ThemeConfig;
  isEditor?: boolean;
}

export const HeroSection: React.FC<Props> = ({ content, theme, isEditor }) => {
  const { isMobile, isTablet } = useViewport();
  const primaryColor = theme.primaryColor || '#2563eb';
  const rawLayout = (content as any).layoutVariant || (content.alignment === 'center' ? 'center' : 'image-right');
  const layoutVariant = rawLayout as 'image-right' | 'image-left' | 'center' | 'background';

  const isBackground = layoutVariant === 'background';
  const isCenter = layoutVariant === 'center';
  const isImageLeft = layoutVariant === 'image-left';

  const heroTitle = content.title || (content as any).headline || '';
  const heroDescription = content.description || (content as any).subheadline || '';
  const heroBadge = content.badge || (content as any).badgeText || '';
  const heroButtonText = content.buttonText || (content as any).ctaText || '';
  const heroButtonUrl = content.buttonUrl || (content as any).ctaUrl || '#contact';

  // Background Cover layout variant
  if (isBackground && content.imageUrl) {
    return (
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40 bg-slate-900 text-white flex items-center justify-center min-h-[520px]">
        {/* Background Image with Dark Contrast Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={content.imageUrl}
            alt={heroTitle}
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {heroBadge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/20 bg-white/10 shadow-xs backdrop-blur-md text-amber-300 mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{heroBadge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {heroTitle}
          </h1>

          <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
            {heroDescription}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
            {heroButtonText && (
              <a
                href={isEditor ? '#!' : heroButtonUrl}
                target={isEditor ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                style={{ backgroundColor: primaryColor }}
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{content.buttonText}</span>
              </a>
            )}

            {content.secondaryButtonText && (
              <a
                href={isEditor ? '#!' : (content.secondaryButtonUrl || '#services')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all"
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              >
                <span>{content.secondaryButtonText}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  const sectionPadding = isMobile ? 'py-10' : isTablet ? 'py-14 sm:py-16' : 'py-16 sm:py-24 lg:py-28';
  const gridLayout = isMobile
    ? 'grid grid-cols-1 gap-8 items-center'
    : isTablet
    ? `grid grid-cols-1 ${isCenter ? 'text-center' : 'gap-8'} items-center`
    : `grid grid-cols-1 ${isCenter ? 'text-center' : 'lg:grid-cols-12'} gap-12 items-center`;
  const titleSize = isMobile
    ? 'text-2xl font-black'
    : isTablet
    ? 'text-3xl font-extrabold'
    : 'text-3xl sm:text-4xl lg:text-5xl font-extrabold';
  const descSize = isMobile ? 'text-xs sm:text-sm' : 'text-base sm:text-lg';
  const buttonContainer = isMobile ? 'pt-2 flex flex-col gap-2.5 w-full' : `pt-2 flex flex-wrap gap-4 items-center ${isCenter ? 'justify-center' : ''}`;
  const buttonStyle = isMobile ? 'w-full justify-center text-sm py-3 px-5' : 'px-6 py-3.5 text-base';

  return (
    <section className={`relative overflow-hidden ${sectionPadding} bg-gradient-to-b from-white via-slate-50/50 to-white`}>
      {/* Decorative background glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: theme.accentColor || primaryColor }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={gridLayout}>
          {/* Text Content */}
          <div
            className={`${
              isCenter
                ? 'max-w-3xl mx-auto'
                : isImageLeft && !isMobile
                ? 'lg:col-span-7 order-1 lg:order-2'
                : !isMobile
                ? 'lg:col-span-7 order-1'
                : 'order-1'
            } space-y-4 sm:space-y-6`}
          >
            {heroBadge && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide border border-slate-200 bg-white/80 shadow-xs backdrop-blur-sm text-slate-800 ${
                  isCenter || isMobile ? 'mx-auto' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{heroBadge}</span>
              </div>
            )}

            <h1 className={`${titleSize} text-slate-900 tracking-tight leading-snug sm:leading-tight`}>
              {heroTitle}
            </h1>

            <p className={`${descSize} text-slate-600 leading-relaxed font-normal`}>
              {heroDescription}
            </p>

            {/* Buttons */}
            <div className={buttonContainer}>
              {heroButtonText && (
                <a
                  href={isEditor ? '#!' : heroButtonUrl}
                  target={isEditor ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 rounded-xl font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all ${buttonStyle}`}
                  style={{ backgroundColor: primaryColor }}
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{heroButtonText}</span>
                </a>
              )}

              {content.secondaryButtonText && (
                <a
                  href={isEditor ? '#!' : (content.secondaryButtonUrl || '#services')}
                  className={`inline-flex items-center gap-2 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all ${buttonStyle}`}
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  <span>{content.secondaryButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {content.imageUrl && (
            <div
              className={`${
                isCenter
                  ? 'max-w-2xl mx-auto w-full'
                  : isImageLeft
                  ? 'lg:col-span-5 order-2 lg:order-1'
                  : 'lg:col-span-5 order-2'
              }`}
            >
              <div className="relative group">
                <div
                  className="absolute -inset-1 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"
                  style={{ backgroundColor: primaryColor }}
                />
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className={`relative rounded-2xl sm:rounded-3xl shadow-xl w-full ${isMobile ? 'h-[200px]' : 'h-[280px] sm:h-[380px] lg:h-[440px]'} object-cover border border-slate-100`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
