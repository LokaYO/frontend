import React from "react";

/* ── Template card header images from Figma ── */
import templateKuliner from "../../assets/templates/template-kuliner.png";
import templatePetcare from "../../assets/templates/template-petcare.png";
import templateBarbershop from "../../assets/templates/template-barbershop.png";
import templateSkincare from "../../assets/templates/template-skincare-2.png";

/* ── Arrow icons ── */
import iconArrowLink from "../../assets/templates/icon-arrow-link.svg";
import iconArrowBtn from "../../assets/templates/icon-arrow-btn.svg";

interface LandingTemplatesProps {
  onTryNow: () => void;
}

interface TemplateCard {
  tag: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  overlayStyle?: string;
}

export const LandingTemplates: React.FC<LandingTemplatesProps> = ({
  onTryNow,
}) => {
  const templates: TemplateCard[] = [
    {
      tag: "Bestseller",
      category: "KULINER",
      title: "Kedai Kopi & Cafe",
      desc: "Tampilkan menu signature, jam buka, dan link pemesanan online.",
      image: templateKuliner,
    },
    {
      tag: "Populer",
      category: "JASA & HEWAN",
      title: "Pet Care & Salon Grooming",
      desc: "Daftar tarif perawatan, booking appointment, dan foto anabul.",
      image: templatePetcare,
    },
    {
      tag: "Modern",
      category: "GROOMING",
      title: "Barbershop & Studio Rambut",
      desc: "Katalog gaya rambut, tarif cukur, dan testimoni pelanggan puas.",
      image: templateBarbershop,
    },
    {
      tag: "Elegan",
      category: "KESEHATAN",
      title: "Klinik Kecantikan & Skincare",
      desc: "Jadwal dokter, konsultasi treatment, dan ulasan pasien.",
      image: templateSkincare,
    },
  ];

  return (
    <section
      id="template"
      className="relative scroll-mt-20 py-24 sm:py-28 lg:py-32 bg-[#f0f9ff] overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="space-y-4 mb-12 sm:mb-16">
          {/* Tagline / Badge */}
          <p className="font-poppins font-semibold text-sm sm:text-[16px] text-[#2563eb] tracking-[0.8px] uppercase">
            GALERI TEMPLATE
          </p>

          {/* Main Title Row with Link */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-[48px] xl:text-[40px] text-[#0f172a] tracking-tight leading-[1.18] max-w-3xl">
              Pilih Desain Siap Pakai untuk Jenis Bisnis Anda
            </h2>

            <button
              type="button"
              onClick={onTryNow}
              className="inline-flex items-center gap-2 font-poppins font-semibold text-sm sm:text-[16px] text-[#1e40af] hover:text-[#1d4ed8] hover:translate-x-0.5 transition-all cursor-pointer self-start lg:self-auto shrink-0 pb-1"
            >
              <span>Jelajahi Semua Template</span>
              <img src={iconArrowLink} alt="" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 4 Business Category Template Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-[24px]">
          {templates.map((card, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-[22px] border border-[#f1f5f9] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] hover:shadow-[0px_14px_34px_0px_rgba(30,58,138,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Image Banner with Overlay */}
                <div className="relative h-[192px] w-full overflow-hidden rounded-t-[22px]">
                  {/* Banner Image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark gradient vignette for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />

                  {/* Banner Content (Tag + Category + Title) */}
                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white">
                    {/* Badge Pill */}
                    <div className="self-start">
                      <span className="backdrop-blur-[4px] bg-black/30 px-3 py-1 rounded-full text-[12px] font-poppins font-semibold tracking-[0.3px]">
                        {card.tag}
                      </span>
                    </div>

                    {/* Category & Title */}
                    <div className="space-y-1">
                      <p className="font-poppins font-bold text-[11px] text-white/90 tracking-[1.1px] uppercase">
                        {card.category}
                      </p>
                      <h3 className="font-poppins font-bold text-lg sm:text-[20px] text-white tracking-tight leading-snug">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Body Description */}
                <div className="p-6">
                  <p className="font-poppins font-normal text-[13px] text-[#64748b] leading-[1.6]">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={onTryNow}
                  className="w-full py-3 px-4 rounded-[12px] bg-[#f1f4f9] group-hover:bg-[#425B9A] group-hover:text-white text-[#0b1528] font-poppins font-semibold text-[12px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Gunakan Template</span>
                  <img
                    src={iconArrowBtn}
                    alt=""
                    className="w-3.5 h-3.5 group-hover:brightness-200 group-hover:translate-x-0.5 transition-all"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
