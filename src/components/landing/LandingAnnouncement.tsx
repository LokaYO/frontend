import React from "react";

export const LandingAnnouncement: React.FC = () => {
  return (
    <div className="bg-[#354a7d] text-white py-1.5 px-4 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 border-b border-white/10">
      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-white/20 uppercase tracking-wider">
        Baru
      </span>
      <span className="truncate">
        Platform B2B SaaS Landing Page &amp; Katalog WhatsApp Khusus Bisnis Lokal Indonesia 🇮🇩
      </span>
    </div>
  );
};
