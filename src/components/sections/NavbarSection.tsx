import React, { useState } from 'react';
import { NavbarContent, ThemeConfig, BusinessInfo } from '../../types/schema';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { OperatingStatusBadge } from '../common/OperatingStatusBadge';
import { getOperatingStatus } from '../../utils/operatingHours';
import { useViewport } from '../../context/ViewportContext';

interface Props {
  content: NavbarContent;
  theme: ThemeConfig;
  businessInfo?: BusinessInfo;
  isEditor?: boolean;
}

export const NavbarSection: React.FC<Props> = ({ content, theme, businessInfo, isEditor }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  const primaryColor = theme.primaryColor || '#2563eb';

  const operatingHours = businessInfo?.operatingHours || (content as any).operatingHours;
  const openTime = businessInfo?.openTime || (content as any).openTime;
  const closeTime = businessInfo?.closeTime || (content as any).closeTime;
  const status = getOperatingStatus(operatingHours, openTime, closeTime);

  // In mobile or tablet mode, or viewport below lg, use hamburger menu
  const forceMobileMenu = isMobile || isTablet;
  const padding = (content as any).padding || 'normal';
  const navHeightClass =
    padding === 'compact'
      ? 'h-14 sm:h-16'
      : padding === 'spacious'
      ? 'h-20 sm:h-24'
      : 'h-16 sm:h-20';

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${navHeightClass} gap-4`}>
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {content.logoUrl ? (
                <img src={content.logoUrl} alt={content.brandName} className="h-9 w-auto object-contain rounded" />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {content.brandName?.charAt(0) || 'L'}
                </div>
              )}
              {status && (
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${status.dotClass}`}
                  title={`${status.statusLabel} • ${status.detailLabel}`}
                />
              )}
            </div>

            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 truncate block max-w-[150px] sm:max-w-xs md:max-w-sm">
                {content.brandName || 'Nama Bisnis'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (Hidden on mobile & tablet) */}
          {!forceMobileMenu && (
            <div className="hidden lg:flex items-center gap-5 xl:gap-8 min-w-0">
              {content.links?.map((link, idx) => (
                <a
                  key={idx}
                  href={isEditor ? '#!' : link.href}
                  className="text-xs xl:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Right Action (Desktop) */}
          {!forceMobileMenu && (
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              {content.phone && (
                <a
                  href={isEditor ? '#!' : `tel:${content.phone}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 hidden xl:flex items-center gap-1.5 whitespace-nowrap"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{content.phone}</span>
                </a>
              )}

              {content.ctaText && (
                <a
                  href={isEditor ? '#!' : (content.ctaUrl || '#contact')}
                  target={isEditor ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-95 transition-all whitespace-nowrap"
                  style={{ backgroundColor: primaryColor }}
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  <span>{content.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Mobile & Tablet hamburger button */}
          <div className={`${forceMobileMenu ? 'flex' : 'flex lg:hidden'} shrink-0`}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/80 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className={`${forceMobileMenu ? 'block' : 'block lg:hidden'} py-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200`}>
            {/* Operating Hours status badge */}
            <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Jam Operasional:</span>
              <OperatingStatusBadge
                operatingHours={operatingHours}
                openTime={openTime}
                closeTime={closeTime}
                showDetail={true}
              />
            </div>

            {/* Links list */}
            <div className="space-y-1">
              {content.links?.map((link, idx) => (
                <a
                  key={idx}
                  href={isEditor ? '#!' : link.href}
                  className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Phone & CTA */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {content.phone && (
                <a
                  href={isEditor ? '#!' : `tel:${content.phone}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hubungi: {content.phone}</span>
                </a>
              )}

              {content.ctaText && (
                <a
                  href={isEditor ? '#!' : (content.ctaUrl || '#contact')}
                  target={isEditor ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm flex items-center justify-center gap-2 transition"
                  style={{ backgroundColor: primaryColor }}
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>{content.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
