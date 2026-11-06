import React from "react";
import { Mail, MapPin } from "lucide-react";
import logoClean from "../../assets/Logo Loka (1) (1).png";
import logoWithTagline from "../../assets/Logo Loka (2).png";

interface LandingFooterProps {
  onTryNow: () => void;
  onLogin: () => void;
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  onAdminLogin?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onTryNow,
  onLogin,
  onScrollTo,
  onAdminLogin,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={logoWithTagline}
                alt="Loka - Your Business, Online"
                className="h-12 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Platform B2B SaaS pembuatan website &amp; katalog online instan
              khusus UMKM lokal Indonesia. Terhubung otomatis ke WhatsApp &amp;
              cetak QR stand meja kasir tanpa butuh keahlian coding.
            </p>

            {/* Country & Support */}
            <div className="pt-1 flex items-center gap-2 text-slate-500 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Bandar Lampung, Lampung</span>
            </div>
          </div>

          {/* Col 2: Fitur & Produk (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Fitur Produk
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#fitur"
                  onClick={(e) => onScrollTo(e, "fitur")}
                  className="hover:text-white transition"
                >
                  Drag &amp; Drop Builder
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onTryNow}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Generator AI Website
                </button>
              </li>
              <li>
                <a
                  href="#template"
                  onClick={(e) => onScrollTo(e, "template")}
                  className="hover:text-white transition"
                >
                  Galeri Template Bisnis
                </a>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Order via WhatsApp
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Stand Meja QR Kasir HD
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Kotak Masuk Leads Tamu
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Solusi Bisnis UMKM (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Solusi Bisnis
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Kafe &amp; Coffee Shop
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Barbershop &amp; Salon
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Laundry &amp; Cuci Sepatu
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Restoran &amp; Kuliner
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Klinik &amp; Skincare
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Bengkel &amp; Jasa Servis
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Akses (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onLogin}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Masuk Merchant
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onTryNow}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Daftar Akun Baru
                </button>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Status Berlangganan PRO
                </span>
              </li>
              <li>
                <a
                  href="#cara-kerja"
                  onClick={(e) => onScrollTo(e, "cara-kerja")}
                  className="hover:text-white transition"
                >
                  Cara Mulai Bisnis
                </a>
              </li>
              {onAdminLogin && (
                <li>
                  <button
                    type="button"
                    onClick={onAdminLogin}
                    className="hover:text-white text-slate-500 transition cursor-pointer text-left text-[11px]"
                  >
                    Portal Administrator
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Bantuan & Legal (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Bantuan &amp; Kontak
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@loka.id"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>support@loka.id</span>
                </a>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Pusat Bantuan UMKM
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Syarat &amp; Ketentuan
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Kebijakan Privasi Data
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Keamanan Cloud SSL
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={logoClean}
              alt="Loka"
              className="h-4 w-auto object-contain brightness-0 invert opacity-70"
            />
            <span>
              &copy; {new Date().getFullYear()} LOKA Platform. Seluruh hak cipta
              dilindungi.
            </span>
          </div>

          <div className="flex items-center gap-6"></div>
        </div>
      </div>
    </footer>
  );
};

