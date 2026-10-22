import React from 'react';
import { HeroContent, ThemeConfig } from '../../types/schema';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  content: HeroContent;
  theme: ThemeConfig;
  isEditor?: boolean;
}

export const HeroSection: React.FC<Props> = ({ content, theme, isEditor }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const rawLayout = (content as any).layoutVariant || (content.alignment === 'center' ? 'center' : 'image-right');
  const layoutVariant = rawLayout as 'image-right' | 'image-left' | 'center' | 'background';

  const isBackground = layoutVariant === 'background';
  const isCenter = layoutVariant === 'center';
  const isImageLeft = layoutVariant === 'image-left';

  // Background Cover layout variant
  if (isBackground && content.imageUrl) {
    return (
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40 bg-slate-900 text-white flex items-center justify-center min-h-[520px]">
        {/* Background Image with Dark Contrast Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {content.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/20 bg-white/10 shadow-xs backdrop-blur-md text-amber-300 mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {content.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
            {content.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
            {content.buttonText && (
              <a
                href={isEditor ? '#!' : (content.buttonUrl || '#contact')}
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

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white">
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
        <div className={`grid grid-cols-1 ${isCenter ? 'text-center' : 'lg:grid-cols-12'} gap-12 items-center`}>
          {/* Text Content */}
          <div
            className={`${
              isCenter
                ? 'max-w-3xl mx-auto'
                : isImageLeft
                ? 'lg:col-span-7 order-1 lg:order-2'
                : 'lg:col-span-7 order-1'
            } space-y-6`}
          >
            {content.badge && (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-slate-200 bg-white/80 shadow-xs backdrop-blur-sm text-slate-800 ${
                  isCenter ? 'mx-auto' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{content.badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              {content.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {content.description}
            </p>

            {/* Buttons */}
            <div className={`pt-2 flex flex-wrap gap-4 items-center ${isCenter ? 'justify-center' : ''}`}>
              {content.buttonText && (
                <a
                  href={isEditor ? '#!' : (content.buttonUrl || '#contact')}
                  target={isEditor ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
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
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
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
                  className="relative rounded-2xl sm:rounded-3xl shadow-xl w-full h-[280px] sm:h-[380px] lg:h-[440px] object-cover border border-slate-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
