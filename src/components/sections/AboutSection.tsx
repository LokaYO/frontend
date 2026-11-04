import React from 'react';
import { AboutContent, ThemeConfig } from '../../types/schema';
import { CheckCircle2 } from 'lucide-react';
import { useViewport } from '../../context/ViewportContext';

interface Props {
  content: AboutContent;
  theme: ThemeConfig;
  isEditor?: boolean;
}

export const AboutSection: React.FC<Props> = ({ content, theme }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const rawPosition = (content as any).imagePosition || 'left';
  const imagePosition = rawPosition as 'left' | 'right' | 'bottom';

  const { isMobile, isTablet } = useViewport();
  const isStacked = isMobile || isTablet || imagePosition === 'bottom';
  const isBottom = imagePosition === 'bottom';
  const isRight = imagePosition === 'right' && !isMobile && !isTablet;

  const secondaryImage = (content as any).secondaryImageUrl;
  const padding = (content as any).padding || 'normal';

  const paddingClass =
    padding === 'compact'
      ? isMobile
        ? 'py-8'
        : 'py-10 sm:py-14'
      : padding === 'spacious'
      ? isMobile
        ? 'py-20'
        : 'py-24 sm:py-36'
      : isMobile
      ? 'py-12'
      : 'py-16 sm:py-24';

  return (
    <section id="about" className={`${paddingClass} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 ${
            isStacked ? 'max-w-4xl mx-auto' : 'lg:grid-cols-12'
          } gap-8 sm:gap-12 items-center`}
        >
          {/* Main Story Image Container */}
          {content.imageUrl && (
            <div
              className={`${
                isStacked
                  ? 'w-full order-2 mt-2'
                  : isRight
                  ? 'lg:col-span-5 order-2'
                  : 'lg:col-span-5 order-2 lg:order-1'
              }`}
            >
              <div className="relative">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className={`rounded-2xl sm:rounded-3xl shadow-lg w-full object-cover border border-slate-100 ${
                    isMobile
                      ? 'h-[240px]'
                      : isBottom
                      ? 'h-[360px] sm:h-[480px]'
                      : 'h-[320px] sm:h-[420px]'
                  }`}
                />

                {/* Optional Secondary Image Overlay (Collage Look) */}
                {secondaryImage && !isStacked && (
                  <div className="absolute -bottom-6 -right-6 w-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden sm:block">
                    <img
                      src={secondaryImage}
                      alt="Detail Usaha"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text and stats */}
          <div
            className={`${
              isStacked
                ? `w-full order-1 ${isBottom ? 'text-center' : 'text-left'}`
                : content.imageUrl
                ? isRight
                  ? 'lg:col-span-7 order-1'
                  : 'lg:col-span-7 order-1 lg:order-2'
                : 'lg:col-span-10 lg:mx-auto'
            } space-y-6`}
          >
            {content.badge && (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isBottom ? 'mx-auto' : ''
                }`}
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {content.badge}
              </span>
            )}

            <h2 className={`${isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-bold text-slate-900 tracking-tight leading-snug`}>
              {content.title}
            </h2>

            <p className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} text-slate-600 leading-relaxed font-normal`}>
              {content.story}
            </p>

            {/* Highlights */}
            {content.highlights && content.highlights.length > 0 && (
              <ul className={`space-y-3 pt-2 ${isBottom ? 'text-left max-w-lg mx-auto' : ''}`}>
                {content.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span className="text-sm sm:text-base text-slate-700 font-medium">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Stats */}
            {content.stats && content.stats.length > 0 && (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 ${
                  isBottom ? 'justify-center max-w-lg mx-auto' : ''
                }`}
              >
                {content.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                      style={{ color: primaryColor }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
