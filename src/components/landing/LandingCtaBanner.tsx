import React from "react";
import { motion } from "motion/react";

/* ── Logo & Icons ── */
import arrowNext from "../../assets/hero/arrow-next.svg";

/* ── Ambient background blur (Figma Ellipse 14, Node 51:390) ── */
import ellipseCta from "../../assets/cta/ellipse-cta.svg";

/* ── Template screenshot images from Figma ── */
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
  /* ── 5 Rows of Templates corresponding to Figma Frame 333, 336, 340, 338, 339 ── */
  const row1 = [
    { src: marqueeSkincare, alt: "Belora Skincare Template" },
    { src: marqueeBakery, alt: "The Cake Haven Bakery Template" },
    { src: marqueeBarber, alt: "Crafted Cuts Barbershop Template" },
    { src: marqueePetcare, alt: "Pet Care & Grooming Template" },
  ];

  const row2 = [
    { src: marqueeSalon, alt: "Glow Beauty Salon Template" },
    { src: marqueeTowel, alt: "Laundry & Textile Template" },
    { src: marqueeFood, alt: "Flavoria Restaurant Template" },
    { src: marqueeCar, alt: "Travice Car Detailing Template" },
  ];

  const row3 = [
    { src: marqueeBarber, alt: "Crafted Cuts Barbershop Template" },
    { src: marqueePetcare, alt: "Pet Care & Grooming Template" },
    { src: marqueeFood, alt: "Flavoria Restaurant Template" },
    { src: marqueeSkincare, alt: "Belora Skincare Template" },
  ];

  const row4 = [
    { src: marqueeTowel, alt: "Laundry & Textile Template" },
    { src: marqueeBakery, alt: "The Cake Haven Bakery Template" },
    { src: marqueeCar, alt: "Travice Car Detailing Template" },
    { src: marqueeSalon, alt: "Glow Beauty Salon Template" },
  ];

  const row5 = [
    { src: marqueeBakery, alt: "The Cake Haven Bakery Template" },
    { src: marqueeFood, alt: "Flavoria Restaurant Template" },
    { src: marqueePetcare, alt: "Pet Care & Grooming Template" },
    { src: marqueeTowel, alt: "Laundry & Textile Template" },
  ];

  /* Helper to render infinite continuous ticker row */
  const renderMarqueeRow = (
    items: { src: string; alt: string }[],
    direction: "left" | "right"
  ) => {
    // 4 repetitions ensure seamless -50% translateX loop across all screen sizes
    const repeated = [...items, ...items, ...items, ...items];
    const animClass =
      direction === "left"
        ? "animate-marquee-diagonal-left"
        : "animate-marquee-diagonal-right";

    return (
      <div className="overflow-hidden w-full h-[200px] sm:h-[250px] lg:h-[304px]">
        <div className={`${animClass} gap-5 sm:gap-6`}>
          {repeated.map((item, idx) => (
            <div
              key={`${direction}-${idx}`}
              className="w-[360px] sm:w-[450px] lg:w-[540px] h-[200px] sm:h-[250px] lg:h-[304px] rounded-[14px] sm:rounded-[18px] lg:rounded-[20px] overflow-hidden shrink-0 shadow-2xl bg-white border border-white/20"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full h-[640px] sm:h-[740px] lg:h-[870px] bg-[#f7f9ff] overflow-hidden select-none flex items-center justify-center">
      {/* ── Keyframe Animations for Infinite Diagonal Marquee ── */}
      <style>{`
        @keyframes marqueeDiagonalLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeDiagonalRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-diagonal-left {
          display: flex;
          width: max-content;
          animation: marqueeDiagonalLeft 48s linear infinite;
          will-change: transform;
        }
        .animate-marquee-diagonal-right {
          display: flex;
          width: max-content;
          animation: marqueeDiagonalRight 52s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* ═════════════════════════════════════════════════════════
          LAYER 1: AMBIENT RADIAL GLOW (Figma Ellipse 14, Node 51:390)
          ═════════════════════════════════════════════════════════ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <img
          src={ellipseCta}
          alt=""
          className="w-[763px] h-[763px] max-w-none opacity-80"
        />
      </div>

      {/* ═════════════════════════════════════════════════════════
          LAYER 2: FULL-WIDTH DIAGONAL MARQUEE RIBBONS (-27.58 DEG)
          Figma Nodes 51:391, 51:392, 51:393, 51:394, 51:395
          IMPORTANT: Do NOT use Tailwind -translate-x-1/2 here to avoid
          double-translation collision with CSS native translate property!
          ═════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none flex flex-col gap-5 sm:gap-6 z-[1]"
        style={{
          width: "3600px",
          transform: "translate(-50%, -50%) rotate(-27.58deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Row 1: Left */}
        {renderMarqueeRow(row1, "left")}

        {/* Row 2: Right */}
        {renderMarqueeRow(row2, "right")}

        {/* Row 3: Left */}
        {renderMarqueeRow(row3, "left")}

        {/* Row 4: Right */}
        {renderMarqueeRow(row4, "right")}

        {/* Row 5: Left */}
        {renderMarqueeRow(row5, "left")}
      </div>

      {/* ═════════════════════════════════════════════════════════
          LAYER 3: DARK OVERLAY (Figma Rectangle 209, Node 51:397)
          rgba(0, 0, 0, 0.40) across the entire 1920x870 canvas
          ═════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.40)" }}
      />

      {/* ═════════════════════════════════════════════════════════
          LAYER 4: CENTER CONTENT (Figma Frame 334, Node 51:400)
          Heading + Subtitle + CTA Button
          ═════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center"
      >
        {/* Heading 2 - Main Title (Node 51:401 & 51:402) */}
        <div className="max-w-[753px]">
          <h2 className="font-poppins font-bold text-3xl sm:text-5xl lg:text-[50.9px] leading-[1.2] sm:leading-[1.18] lg:leading-[60.5px] text-white tracking-tight lg:tracking-[-1.27px] drop-shadow-lg">
            Siap Meningkatkan Penjualan
            <br />
            Bisnis Anda?
          </h2>
        </div>

        {/* Subtitle Description (Node 51:403) */}
        <p className="mt-5 sm:mt-6 font-poppins font-semibold text-sm sm:text-base text-white max-w-[532px] leading-[24px] sm:leading-[25px] drop-shadow-md px-2">
          Bergabunglah dengan ribuan pelaku usaha lokal yang telah memiliki
          website profesional sendiri.
        </p>

        {/* CTA Button: Coba Sekarang (Node 51:404, 51:405, 51:406, 51:407) */}
        <div className="mt-7 sm:mt-8">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onTryNow}
            className="inline-flex items-center justify-center gap-2.5 h-[56px] sm:h-[59px] px-7 sm:w-[250px] rounded-[13px] text-white font-poppins font-medium text-base shadow-xl shadow-black/25 hover:shadow-2xl hover:brightness-105 transition-all cursor-pointer group"
            style={{
              backgroundImage:
                "linear-gradient(108.47deg, #425B9A 0.82%, #76C0EC 100%)",
            }}
          >
            <span>Coba Sekarang</span>
            <img
              src={arrowNext}
              alt=""
              className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
