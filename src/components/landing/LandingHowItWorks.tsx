import React from "react";

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
      className="scroll-mt-20 py-20 md:py-28 bg-slate-50/60 border-y border-slate-200/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#425B9A] block">
            Cara Kerja
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Online dalam 3 Langkah Sederhana
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3"
            >
              <span className="w-12 h-12 rounded-2xl bg-[#425B9A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                {item.step}
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

