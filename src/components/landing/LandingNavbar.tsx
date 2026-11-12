import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoClean from "../../assets/Logo Loka (1) (1).png";

interface LandingNavbarProps {
  onLogin: () => void;
  onTryNow: () => void;
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLogin,
  onTryNow,
  onScrollTo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("beranda");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setActiveTab(id);
    if (id === "beranda") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onScrollTo(e, id);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: "beranda", label: "Beranda" },
    { id: "fitur", label: "Fitur Unggulan" },
    { id: "template", label: "Galeri Template" },
    { id: "cara-kerja", label: "Cara Kerja" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${isScrolled
        ? " backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-b border-white/60 py-2 sm:py-2.5"
        : "bg-transparent py-3 sm:py-4"
        }`}
      style={{
        backdropFilter: isScrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(18px)" : "none",
      }}
    >
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-[110px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="/" className="flex items-center gap-2 group">
            <img
              src={logoClean}
              alt="Loka"
              className="h-8 sm:h-9 lg:h-[42px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>
        </div>

        {/* Center Pill Navigation — Figma: white rounded pill with smooth blur glass transition on scroll */}
        <div className="hidden md:flex items-center justify-center">
          <nav
            className={`rounded-[23px] px-8 lg:px-10 py-3 lg:py-[14px] flex items-center gap-8 lg:gap-[61px] text-[12px] font-medium font-poppins transition-all duration-300 ${isScrolled
              ? "bg-white/80 backdrop-blur-md border border-white/70 shadow-sm"
              : "bg-white border border-slate-100 shadow-lg shadow-indigo-950/10"
              }`}
            style={{
              backdropFilter: isScrolled ? "blur(12px)" : "none",
              WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.id === "beranda" ? "#" : `#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative py-1 transition cursor-pointer ${activeTab === link.id
                  ? "text-[#425B9A] font-semibold"
                  : "text-slate-800 hover:text-[#425B9A]"
                  }`}
              >
                <span>{link.label}</span>
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#425B9A] rounded-full" />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Masuk Button — Figma: solid navy #425B9A rounded-[15px] */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onLogin}
            className="px-6 py-3 lg:px-[15px] lg:py-[25px] rounded-[15px] w-[100px] h-[45px] text-[12px] font-medium font-poppins text-white bg-[#425B9A] hover:bg-[#354a7d] shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            Masuk
          </button>
        </div>

        {/* Mobile Hamburger & Quick Action */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#425B9A] shadow-sm flex items-center gap-1"
          >
            <span>Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className={`p-1.5 rounded-xl shadow-sm border transition ${isScrolled
              ? "bg-white/80 backdrop-blur-md text-[#425B9A] border-white/60"
              : "bg-white/20 text-white border-white/30"
              }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown with Blur Glass Effect */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white/85 backdrop-blur-xl border border-white/70 shadow-xl px-4 pt-3 pb-5 space-y-3 animate-fade-in text-slate-800 mt-2 mx-4 rounded-2xl"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <nav className="flex flex-col space-y-1.5 text-xs font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.id === "beranda" ? "#" : `#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`px-3.5 py-2.5 rounded-xl hover:bg-slate-100/80 transition flex items-center justify-between ${activeTab === link.id
                  ? "text-[#425B9A] bg-white/90 shadow-xs"
                  : "text-slate-700"
                  }`}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-[#425B9A] rounded-xl hover:bg-[#354a7d] transition"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onTryNow();
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-[#425B9A] to-[#76C0EC] rounded-xl hover:opacity-95 transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Coba Sekarang</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
