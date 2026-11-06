import React from "react";

/* ── Feature icon SVGs from Figma ── */
import iconBuilder from "../../assets/features/icon-builder.svg";
import iconWhatsapp from "../../assets/features/icon-whatsapp.svg";
import iconAnalytics from "../../assets/features/icon-analytics.svg";
import iconQr from "../../assets/features/icon-qr.svg";
import iconInbox from "../../assets/features/icon-inbox.svg";
import iconResponsive from "../../assets/features/icon-responsive.svg";
import ellipseBg from "../../assets/features/ellipse-bg.svg";

interface FeatureItem {
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
}

export const LandingFeatures: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: iconBuilder,
      iconBg: "bg-[#eff6ff]", // rgba(239, 246, 255, 0.8)
      title: "Drag & Drop Section Builder",
      desc: "Susun seksi Hero, Layanan, Jam Buka, Galeri Foto, hingga Formulir Kontak semudah menggeser kartu dengan live preview.",
    },
    {
      icon: iconWhatsapp,
      iconBg: "bg-[#ecfdf5]", // rgba(236, 253, 245, 0.8)
      title: "Integrasi WhatsApp Otomatis",
      desc: "Tombol CTA langsung mengarahkan pesan yang sudah diformat ke nomor WhatsApp Anda tanpa perantara.",
    },
    {
      icon: iconAnalytics,
      iconBg: "bg-[#eef2ff]", // rgba(238, 242, 255, 0.8)
      title: "Analitik & Performa Real-Time",
      desc: "Ketahui jumlah pengunjung harian dan seberapa banyak pelanggan yang tertarik menghubungi WhatsApp toko Anda.",
    },
    {
      icon: iconQr,
      iconBg: "bg-[#faf5ff]", // rgba(250, 245, 255, 0.8)
      title: "Stand Meja QR Kasir Siap Cetak",
      desc: "Dapatkan kartu akrilik stand meja kasir otomatis beresolusi tinggi (A5/A6) untuk di scan langsung oleh pembeli di toko fisik.",
    },
    {
      icon: iconInbox,
      iconBg: "bg-[#f0f9ff]", // rgba(240, 249, 255, 0.8)
      title: "Kotak Masuk Leads Pelanggan",
      desc: "Kumpulkan pesan formulir dari pengunjung website dalam satu dashboard dan ekspor ke format Excel/CSV kapan saja.",
    },
    {
      icon: iconResponsive,
      iconBg: "bg-[#fffbeb]", // rgba(255, 251, 235, 0.8)
      title: "100% Responsif & Ringan",
      desc: "Website dimuat cepat di semua smartphone pelanggan tanpa lemot, dioptimalkan untuk koneksi internet seluler.",
    },
  ];

  return (
    <section
      id="fitur"
      className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32 bg-[#f7f9ff] overflow-hidden"
    >
      {/* ── Background Layer: Soft ambient glow ellipse from Figma ── */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden">
        <img
          src={ellipseBg}
          alt=""
          className="w-[984px] h-[984px] max-w-none opacity-60 scale-125"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header Container ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16 lg:mb-20">
          {/* Tagline / Badge */}
          <p className="font-poppins font-semibold text-sm sm:text-[16px] text-[#2563eb] tracking-[0.8px] uppercase">
            FITUR LENGKAP
          </p>

          {/* Heading 2 - Main Title */}
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-[40px] text-[#0f172a] tracking-tight leading-[1.18]">
            Semua yang Dibutuhkan Usaha Anda <br /> Ada di Sini
          </h2>

          {/* Subtitle Description */}
          <p className="font-poppins font-normal text-base sm:text-[14px] text-[#64748b] leading-relaxed max-w-2xl mx-auto pt-1">
            Dirancang khusus untuk mempermudah operasional dan promosi pemilik bisnis lokal di Indonesia.
          </p>
        </div>

        {/* ── 6 Feature Cards Grid (3 Columns, 2 Rows) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-[42px]">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-[32px] border border-[#f1f5f9] p-7 sm:p-8 lg:p-[32px] shadow-[0px_5px_26px_-5px_rgba(118,192,236,0.15)] hover:shadow-[0px_14px_36px_-6px_rgba(66,91,154,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon Wrapper (Rounded square with pastel tint) */}
                <div
                  className={`w-16 h-16 rounded-[16px] ${item.iconBg} flex items-center justify-center shrink-0 mb-6 transition-transform group-hover:scale-105 duration-300`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Heading 3 - Title */}
                <h3 className="font-poppins font-bold text-lg sm:text-[20px] text-[#0f172a] tracking-tight mb-3 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-poppins font-normal text-sm sm:text-[14px] text-[#64748b] leading-[1.8]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
