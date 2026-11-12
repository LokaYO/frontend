import React from "react";
import { motion } from "motion/react";

/* ── Background assets ── */
import skyClouds from "../../assets/hero/sky-clouds.webp";
import waveDesktop5 from "../../assets/hero/wave-desktop5.svg";

/* ── 3D Device mockup assets ── */
import mockupLaptop from "../../assets/hero/mockup-laptop.webp";
import mockupTablet from "../../assets/hero/mockup-tablet.webp";
import mockupPhone from "../../assets/hero/mockup-phone.webp";
import starSparkle from "../../assets/hero/star-sparkle.svg";

/* ── UI Icons & Badges ── */
import arrowNext from "../../assets/hero/arrow-next.svg";
import badgeNoCoding from "../../assets/hero/badge-no-coding.svg";
import badgeWhatsapp from "../../assets/hero/badge-whatsapp.svg";
import badgeQrStand from "../../assets/hero/badge-qr-stand.svg";
import badgeResponsive from "../../assets/hero/badge-responsive.svg";

/* ── Browser Mockup Card assets ── */
import iconLiveMode from "../../assets/hero/icon-live-mode.svg";
import iconWhatsappBubble from "../../assets/hero/icon-whatsapp-bubble.svg";

interface LandingHeroProps {
  onTryNow: () => void;
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

/* ═══════════════════════════════════════════════════════════
   Browser Showcase Container Component (Figma Node 16:247 "P")
   Shows live interactive mockup of Paw & Tail Care store
   ═══════════════════════════════════════════════════════════ */
const BrowserMockupCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 35 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="w-full max-w-[1078px] mx-auto bg-white rounded-[26px] border border-slate-100/90 p-5 sm:p-7 shadow-[0px_13px_50px_-11px_rgba(20,50,90,0.08),0px_2px_11px_0px_rgba(0,0,0,0.03)]"
  >
    {/* Browser Window Chrome Top Bar */}
    <div className="bg-[#f1f5f9]/80 border border-slate-200/70 rounded-[20px] px-4 sm:px-5 py-3 flex items-center justify-between gap-3 sm:gap-6 mb-5 sm:mb-6">
      {/* Traffic Light Dots */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-1">
        <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#ff5f56]" />
        <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-[#27c93f]" />
      </div>

      {/* Address Bar (URL pill) */}
      <div className="flex-1 max-w-[560px]">
        <div className="bg-white border border-slate-200/80 rounded-lg px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-[0px_1px_1px_rgba(0,0,0,0.02)] flex items-center">
          <span className="font-mono text-xs sm:text-[14px] text-slate-500 tracking-tight truncate">
            https://paw-and-tail-care.ruuby.my.id
          </span>
        </div>
      </div>

      {/* Live Mode Badge */}
      <div className="hidden sm:flex items-center gap-2 bg-[#eef2ff]/70 border border-[#e0e7ff] rounded-full px-3.5 py-1.5 shrink-0">
        <img src={iconLiveMode} alt="" className="w-4 h-4" />
        <span className="font-poppins font-semibold text-xs text-[#4338ca]">
          Live Mode
        </span>
      </div>
    </div>

    {/* Preview Site Inner Page Canvas */}
    <div className="bg-white border border-slate-100 rounded-[18px] p-5 sm:p-8 space-y-6">
      {/* Store Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100/60">
        <div className="flex items-center gap-4">
          {/* Brand Initial Avatar */}
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#2c498d] flex items-center justify-center shadow-sm shrink-0">
            <span className="font-bold text-xl sm:text-2xl text-white">P</span>
          </div>
          <div>
            <h3 className="font-poppins font-bold text-lg sm:text-[22px] text-slate-900 tracking-tight">
              Paw &amp; Tail Care
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="font-poppins text-xs sm:text-[13px] text-[#10b981]">
                Buka Sekarang (09:00 - 20:00)
              </span>
            </div>
          </div>
        </div>

        {/* WhatsApp Booking Action Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 bg-[#00875a] rounded-full px-5 py-2.5 shadow-sm hover:opacity-95 transition cursor-pointer shrink-0"
        >
          <img src={iconWhatsappBubble} alt="" className="w-4 h-4" />
          <span className="font-poppins font-semibold text-xs sm:text-[14px] text-white whitespace-nowrap">
            Booking Grooming via WA
          </span>
        </motion.div>
      </div>

      {/* Service Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {[
          {
            tag: "PAKET POPULER",
            title: "Full Grooming Treatment",
            desc: "Mandi herbal, potong kuku, & hair styling.",
            price: "Rp 120.000",
          },
          {
            tag: "PENITIPAN NYAMAN",
            title: "Hotel Anabul VIP Room",
            desc: "Ruangan ber-AC, CCTV live 24 jam, & makan.",
            price: "Rp 85.000 / hari",
          },
          {
            tag: "PERAWATAN MEDIS",
            title: "Vaksin & Konsultasi Dokter",
            desc: "Ditangani dokter hewan berizin profesional.",
            price: "Rp 150.000",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white border border-slate-100 rounded-[18px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-shadow hover:shadow-md"
          >
            <div className="space-y-2">
              <p className="font-poppins font-bold text-[11px] text-[#94a3b8] tracking-[0.5px] uppercase">
                {card.tag}
              </p>
              <h4 className="font-poppins font-bold text-[16px] sm:text-[17px] text-slate-900 leading-snug">
                {card.title}
              </h4>
              <p className="font-poppins text-[13px] text-slate-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="pt-6 sm:pt-8">
              <span className="font-poppins font-bold text-[15px] sm:text-[16px] text-[#2c498d]">
                {card.price}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   Main Landing Hero Component (Matches Figma Desktop-5 exactly)
   ═══════════════════════════════════════════════════════════ */
export const LandingHero: React.FC<LandingHeroProps> = ({
  onTryNow,
  onScrollTo,
}) => {
  const trustBadges = [
    { icon: badgeNoCoding, label: "Tanpa Keahlian Coding" },
    { icon: badgeWhatsapp, label: "Order Otomatis Via WhatsApp" },
    { icon: badgeQrStand, label: "Stand Meja QR Kasir Siap Cetak" },
    { icon: badgeResponsive, label: "Desain Responsif Mobile & Tablet" },
  ];

  return (
    <div className="relative bg-white overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          HERO BANNER SECTION (Sky + Wave + Mockups + Badges)
          Height calibrated to fit laptop screens (1080p / 900p)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[700px] lg:min-h-[760px] xl:min-h-[840px] flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12">
        {/* ── Background Layer 1: Dreamy Blue Sky with Fluffy White Clouds ── */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src={skyClouds}
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Background Layer 2: Figma Wave SVGs (Navy #425B9A + Soft Blue #73A4CC) ── */}
        <div className="absolute -inset-20 pointer-events-none select-none overflow-hidden hidden md:block mt-20">
          <img
            src={waveDesktop5}
            alt=""
            className="w-full h-full object-fill"
          />
        </div>

        {/* Mobile Backdrop Fallback (< md screens) */}
        <div className="absolute inset-0 bg-[#73A4CC]/95 md:hidden pointer-events-none" />

        {/* ── Background Layer 3: Soft Bottom Fade into Fluffy Clouds & White ── */}
        <div
          className="absolute -bottom-8 left-0 right-0 h-40 sm:h-52 lg:h-64 bg-gradient-to-t from-white via-white/75 to-transparent pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* ── Main Content Container: Left Text + Right 3D Mockups ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full py-4">
            {/* Left Column: Headlines & CTA Buttons (Animated Fade-In) */}
            <div className="lg:col-span-7 text-left space-y-6 max-w-xl xl:max-w-2xl mt-0 lg:-mt-30">
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: [0.25, 1, 0.3, 1] }}
                className="font-poppins font-bold text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] text-white tracking-tight leading-[1.14]"
              >
                Hadirkan Website Bisnis &amp; Katalog Online Tanpa Ribet
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 2,
                  delay: 0.12,
                  ease: [0.25, 1, 0.3, 1],
                }}
                className="font-poppins font-medium text-sm sm:text-base lg:text-[16px] text-white/95 leading-relaxed max-w-lg"
              >
                Solusi praktis bagi UMKM, restoran, barbershop, salon, klinik dan
                toko lokal untuk membuat landing page profesional dalam hitungan
                menit
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 2,
                  delay: 0.24,
                  ease: [0.25, 1, 0.3, 1],
                }}
                className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6"
              >
                {/* Primary CTA: Coba Sekarang */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onTryNow}
                  className="flex items-center justify-center gap-2 px-6 sm:px-4 py-3 sm:py-3.5 rounded-[14px] text-[15px] sm:text-sm font-poppins font-medium text-white shadow-xl shadow-[#425B9A]/30 hover:shadow-2xl transition-all cursor-pointer group"
                  style={{
                    backgroundImage:
                      "linear-gradient(108.5deg, #425B9A 0.8%, #76C0EC 100%)",
                  }}
                >
                  <span>Coba Sekarang</span>
                  <img
                    src={arrowNext}
                    alt=""
                    className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>

                {/* Secondary CTA: Pelajari Fitur */}
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#fitur"
                  onClick={(e) => onScrollTo(e, "fitur")}
                  className="flex items-center justify-center gap-2 px-6 sm:px-4 py-3 sm:py-3.5 rounded-[14px] text-[15px] sm:text-sm font-poppins font-medium text-white bg-[#73a4cc] hover:bg-[#6295bd] border-2 border-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
                >
                  <span>Pelajari Fitur</span>
                  <img
                    src={arrowNext}
                    alt=""
                    className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                  />
                </motion.a>
              </motion.div>
            </div>

            {/* Right Column: 3D Isometric Device Mockups (Floating over Dreamy Sky) */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]">
              {/* Relative container holding tablet, phone, laptop, and sparkle star */}
              <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] h-[320px] sm:h-[370px] lg:h-[420px]">
                {/* Background 3D Tablet Mockup (Upper Left, Flipped -scale-x-100 per Figma) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 2,
                    delay: 0.25,
                    ease: [0.25, 1, 0.3, 1],
                  }}
                  className="absolute top-0 left-[6%] sm:left-[8%] z-10 w-[42%] max-w-[220px] sm:max-w-[250px] pointer-events-none select-none"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src={mockupTablet}
                      alt="Tablet Dashboard"
                      className="w-full h-auto drop-shadow-xl -scale-x-100"
                    />
                  </motion.div>
                </motion.div>

                {/* Background 3D Smartphone Mockup (Upper Right) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 2,
                    delay: 0.35,
                    ease: [0.25, 1, 0.3, 1],
                  }}
                  className="absolute top-[4%] right-[2%] sm:right-[4%] lg:left-[50%] z-10 w-[36%] max-w-[190px] sm:max-w-[220px] pointer-events-none select-none"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  >
                    <img
                      src={mockupPhone}
                      alt="Smartphone UI"
                      className="w-full h-auto drop-shadow-xl"
                    />
                  </motion.div>
                </motion.div>

                {/* Sparkle Star (Floating to the left of laptop screen at wave border) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
                  className="absolute top-[44%] left-[-4%] sm:left-[-2%] z-25 w-12 sm:w-16 lg:w-20 pointer-events-none select-none"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <img
                      src={starSparkle}
                      alt="Sparkle"
                      className="w-full h-auto drop-shadow-md"
                    />
                  </motion.div>
                </motion.div>

                {/* Foreground 3D Laptop Mockup (Center Foreground, Overlapping Tablet & Phone) */}
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 1.18 }}
                  animate={{ opacity: 1, y: 0, scale: 1.25 }}
                  transition={{
                    duration: 2,
                    delay: 0.3,
                    ease: [0.25, 1, 0.3, 1],
                  }}
                  className="absolute bottom-0 left-[2%] sm:left-[4%] lg:-left-[15%] z-20 w-[100%] max-w-[480px] sm:max-w-[520px] pointer-events-none select-none"
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  >
                    <img
                      src={mockupLaptop}
                      alt="Laptop Website Builder"
                      className="w-full h-auto drop-shadow-[0_20px_35px_rgba(20,50,90,0.22)]"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Layer: 4 Floating Pill Trust Badges over Fluffy Clouds ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 sm:mt-6">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-5">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 2 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-poppins font-medium shadow-md shadow-indigo-950/15 hover:shadow-lg transition-all cursor-default select-none border border-white/25"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #425B9A 0%, #76C0EC 100%)",
                }}
              >
                <img
                  src={badge.icon}
                  alt=""
                  className="w-4 sm:w-5 h-4 sm:h-5 object-contain shrink-0"
                />
                <span className="whitespace-nowrap">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BROWSER SHOWCASE SECTION (Live Mode Preview of Paw & Tail Care)
          Positioned directly below the hero section on clean white canvas
          ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <BrowserMockupCard />
      </section>
    </div>
  );
};
