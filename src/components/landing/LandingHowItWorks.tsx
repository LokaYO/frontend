import React from "react";
import { motion } from "motion/react";

export const LandingHowItWorks: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Pilih Template Bisnis",
      desc: "Pilih tema yang sesuai dengan bidang usaha Anda, dari kuliner, salon, klinik, hingga jasa servis.",
    },
    {
      step: "2",
      title: "Lengkapi Profil & Menu",
      desc: "Masukkan nama toko, jam operasional, foto produk/layanan, dan nomor WhatsApp admin Anda.",
    },
    {
      step: "3",
      title: "Publish & Bagikan Link",
      desc: "Website Anda langsung aktif online! Bagikan di bio Instagram, TikTok, dan cetak QR stand meja toko Anda.",
    },
  ];

  return (
    <section
      id="cara-kerja"
      className="scroll-mt-20 py-20 md:py-28 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-black uppercase tracking-widest text-[#425B9A] block"
          >
            Cara Kerja
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Online dalam 3 Langkah Sederhana
          </motion.h2>
        </div>

        {/* ── 3 Step Cards Grid (Appears one by one / Staggered) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: idx * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="group bg-white p-7 sm:p-8 rounded-[28px] border border-slate-200/90 shadow-[0px_4px_20px_-4px_rgba(66,91,154,0.08)] hover:shadow-[0px_14px_30px_-6px_rgba(66,91,154,0.16)] transition-shadow duration-300 space-y-4 cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#425B9A] group-hover:bg-[#354a7d] group-hover:scale-105 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-[#425B9A]/25 transition-all duration-300">
                {item.step}
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-poppins">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
