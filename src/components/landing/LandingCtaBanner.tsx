import React from "react";

/* ── Logo & Icons ── */
import logoClean from "../../assets/Logo Loka (1) (1).png";
import arrowNext from "../../assets/hero/arrow-next.svg";

/* ── Ambient background blur ── */
import ellipseCta from "../../assets/cta/ellipse-cta.svg";

/* ── Marquee template screenshot images from Figma ── */
import marqueePetcare from "../../assets/cta/marquee-petcare.png";
import marqueeSkincare from "../../assets/cta/marquee-skincare.png";
import marqueeBakery from "../../assets/cta/marquee-bakery.png";
import marqueeBarber from "../../assets/cta/marquee-barber.png";
import marqueeTowel from "../../assets/cta/marquee-towel.png";
import marqueeCar from "../../assets/cta/marquee-car.png";
import marqueeFood from "../../assets/cta/marquee-food.png";
import marqueeSalon from "../../assets/cta/marquee-salon.png";

interface LandingCtaBannerProps {
  onTryNow: () => void;
}

export const LandingCtaBanner: React.FC<LandingCtaBannerProps> = ({
  onTryNow,
}) => {
  // Row 1 & Row 3 template cards
  const row1Templates = [
    { src: marqueePetcare, alt: "Pet Care Template" },
    { src: marqueeSkincare, alt: "Skincare Template" },
    { src: marqueeBakery, alt: "Bakery Template" },
    { src: marqueeBarber, alt: "Barbershop Template" },
  ];

  // Row 2 template cards (middle row, scrolls opposite direction)
  const row2Templates = [
    { src: marqueeTowel, alt: "Laundry & Boutique Template" },
    { src: marqueeCar, alt: "Auto Repair Template" },
    { src: marqueeFood, alt: "Food & Restaurant Template" },
    { src: marqueeSalon, alt: "Beauty Salon Template" },
  ];

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#f7f9ff] overflow-hidden">
      {/* ── Scoped CSS keyframe animations for ultra-smooth infinite marquee ── */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeScrollRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeScrollLeft 32s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeScrollRight 36s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* ── Background Layer: Ambient radial blur from Figma ── */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden">
        <img
          src={ellipseCta}
          alt=""
          className="w-[763px] h-[763px] max-w-none opacity-50 scale-125"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main CTA Showcase Card (Figma Node 16:506 / Desktop-7) ── */}
        <div className="cta-banner relative max-w-[1084px] mx-auto h-[440px] sm:h-[480px] lg:h-[500px] rounded-[24px] sm:rounded-[28px] border-4 sm:border-8 border-[#425B9A] overflow-hidden shadow-[0px_20px_50px_-10px_rgba(66,91,154,0.35)] bg-slate-900 group">
          {/* ═══════════════════════════════════════════════════════
              LAYER 1: THREE-ROW ANIMATED MARQUEE TEMPLATE GRID
              Row 1 & 3 scroll left, Row 2 scrolls right
              ═══════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 overflow-hidden select-none pointer-events-none opacity-85">
            {/* ── Marquee Row 1 (Top, Moves Left) ── */}
            <div className="overflow-hidden w-full h-[140px] sm:h-[155px]">
              <div className="animate-marquee-left gap-3.5 sm:gap-4">
                {/* 2 duplicates ensure seamless -50% infinite loop */}
                {[...row1Templates, ...row1Templates, ...row1Templates].map(
                  (item, idx) => (
                    <div
                      key={`row1-${idx}`}
                      className="w-[240px] sm:w-[270px] h-[135px] sm:h-[152px] rounded-[10px] overflow-hidden shrink-0 shadow-sm bg-slate-800"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ── Marquee Row 2 (Middle, Moves Right) ── */}
            <div className="overflow-hidden w-full h-[140px] sm:h-[155px]">
              <div className="animate-marquee-right gap-3.5 sm:gap-4">
                {[...row2Templates, ...row2Templates, ...row2Templates].map(
                  (item, idx) => (
                    <div
                      key={`row2-${idx}`}
                      className="w-[240px] sm:w-[270px] h-[135px] sm:h-[152px] rounded-[10px] overflow-hidden shrink-0 shadow-sm bg-slate-800"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ── Marquee Row 3 (Bottom, Moves Left) ── */}
            <div className="overflow-hidden w-full h-[140px] sm:h-[155px]">
              <div className="animate-marquee-left gap-3.5 sm:gap-4">
                {[...row1Templates, ...row1Templates, ...row1Templates].map(
                  (item, idx) => (
                    <div
                      key={`row3-${idx}`}
                      className="w-[240px] sm:w-[270px] h-[135px] sm:h-[152px] rounded-[10px] overflow-hidden shrink-0 shadow-sm bg-slate-800"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              LAYER 2: DARK GRADIENT OVERLAY (Figma Rectangle 209)
              Darkens the moving templates so text & logo are 100% crisp
              ═══════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 bg-slate-950/45 sm:bg-slate-950/40 backdrop-blur-[0px] transition-colors duration-300" />

          {/* ═══════════════════════════════════════════════════════
              LAYER 3: CENTER HERO CONTENT (Logo + Heading + CTA)
              ═══════════════════════════════════════════════════════ */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-4 sm:space-y-6">
            {/* Brand Logo */}
            <div className="w-[160px] sm:w-[204px] h-auto drop-shadow-lg transition-transform duration-300 hover:scale-105">
            </div>

            {/* Heading 2 - Main Title (2 Lines in Figma) */}
            <div className="space-y-1 max-w-2xl">
              <h2 className="font-poppins font-bold text-2xl sm:text-4xl lg:text-[46px] xl:text-[50px] text-white tracking-tight leading-[1.15] drop-shadow-md">
                Siap Meningkatkan Penjualan
                <br />
                Bisnis Anda?
              </h2>
            </div>

            {/* Subtitle Description */}
            <p className="font-poppins font-medium text-xs sm:text-base text-white/95 max-w-[530px] leading-relaxed drop-shadow-sm px-2">
              Bergabunglah dengan ribuan pelaku usaha lokal yang telah memiliki
              website profesional sendiri.
            </p>

            {/* CTA Button: Coba Sekarang */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onTryNow}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:px-8 sm:py-3.5 rounded-[13px] sm:rounded-[14px] text-[15px] sm:text-base font-poppins font-medium text-white shadow-xl shadow-[#425B9A]/40 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group/btn"
                style={{
                  backgroundImage:
                    "linear-gradient(108.5deg, #425B9A 0.8%, #76C0EC 100%)",
                }}
              >
                <span>Coba Sekarang</span>
                <img
                  src={arrowNext}
                  alt=""
                  className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
