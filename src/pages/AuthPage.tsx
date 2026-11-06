import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/* ── Brand Logo ── */
import logoClean from "../assets/Logo Loka (1) (1).png";

/* ── 3D Illustration & Background Assets from Figma ── */
import authLandscape from "../assets/auth/auth-landscape.png";
import authIllustration from "../assets/auth/auth-illustration.png";
import authShadowCharacter from "../assets/auth/auth-shadow-character.svg";
import authEllipse17 from "../assets/auth/auth-ellipse-17.svg";

/* ── Form Icons from Figma ── */
import authArrowBack from "../assets/auth/auth-arrow-back.svg";
import authIconUser from "../assets/auth/auth-icon-user.svg";
import authIconMail from "../assets/auth/auth-icon-mail.svg";
import authIconLock from "../assets/auth/auth-icon-lock.svg";
import authArrowSubmit from "../assets/auth/auth-arrow-submit.svg";
import authCheck from "../assets/auth/auth-check.svg";

interface Props {
  onNavigateAdmin?: () => void;
  onNavigateHome?: () => void;
  initialMode?: "login" | "register";
}

export const AuthPage: React.FC<Props> = ({
  onNavigateAdmin,
  onNavigateHome,
  initialMode = "login",
}) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        await authService.register(name, email, password);
        // Setelah registrasi sukses, jangan langsung auto-login ke dashboard.
        // Arahkan ke tab login agar user login secara sadar dan resmi.
        setIsRegister(false);
        setPassword("");
        setSuccessMsg("Pendaftaran berhasil! Akun Anda telah aktif, silakan masuk dengan email dan password Anda.");
      } else {
        const data = await authService.login(email, password);
        login(data.token, data.user);
        const data = isRegister
          ? await authService.register(name, email, password)
          : await authService.login(email, password);

        login(data.token, data.user);

        // Jika yang login ternyata admin, arahkan ke /admin
        if ((data.user.role === "admin" || data.user.role === "support") && onNavigateAdmin) {
          onNavigateAdmin();
        }
      } catch (err: any) {
        console.error("Auth error:", err);
        setErrorMsg(err.message || (isRegister ? "Gagal mendaftar" : "Gagal masuk"));
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden"
        style={{
          backgroundImage:
            "linear-gradient(244.16deg, rgb(225, 244, 255) 0%, rgb(255, 255, 255) 100.35%)",
        }}
      >
        {/* ── Background Layer 1: Ambient Decorative Grid & Glow ── */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Ambient Blur from Figma */}
        <div className="absolute left-[-100px] top-[260px] pointer-events-none select-none opacity-40">
          <img
            src={authEllipse17}
            alt=""
            className="w-[860px] h-[860px] max-w-none"
          />
        </div>

        {/* ── Top Header Bar: Loka Logo ── */}
        <header className="relative z-30 max-w-[1720px] w-full mx-auto px-6 sm:px-12 xl:px-16 pt-6 sm:pt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src={logoClean}
              alt="Loka"
              className="h-8 sm:h-9 xl:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>
        </header>

        {/* ── Main Workspace: 2-Column Responsive Layout (Figma Node 24:231) ── */}
        <main className="relative z-20 max-w-[1720px] w-full mx-auto px-6 sm:px-12 xl:px-16 py-6 sm:py-8 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
            {/* ══════════════════════════════════════════════════
              LEFT COLUMN: 3D Illustration & Visual Canvas
              (Anime Characters Building Website Dashboard)
              ══════════════════════════════════════════════════ */}
            <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 relative items-center justify-center min-h-[540px] xl:min-h-[620px] select-none pointer-events-none">
              {/* Soft Blue 3D Abstract Landscape Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={authLandscape}
                  alt=""
                  className="w-full max-w-[920px] h-auto object-contain opacity-95 scale-105"
                />
              </div>

              {/* 3D Web Dashboard Team Characters Illustration with matched ground shadows */}
              <div className="relative z-10 w-full max-w-[660px] xl:max-w-[720px] flex items-center justify-center">
                <img
                  src={authIllustration}
                  alt="3D Website Building Illustration"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(20,50,90,0.18)]"
                />
                {/* Ground Shadows directly under character feet */}
                <div className="absolute bottom-[2%] left-[13%] w-[27%] opacity-75">
                  <img src={authShadowCharacter} alt="" className="w-full h-auto" />
                </div>
                <div className="absolute bottom-[1%] right-[14%] w-[27%] opacity-75">
                  <img src={authShadowCharacter} alt="" className="w-full h-auto" />
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
              RIGHT COLUMN: Auth Form Card (Figma Node 24:241)
              ══════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end w-full">
              <div className="w-full max-w-[560px] bg-white rounded-[32px] sm:rounded-[38px] border border-[#f1f5f9] pt-[36px] sm:pt-[40px] pb-[38px] sm:pb-[44px] px-7 sm:px-[48px] shadow-[0px_14px_53px_-12px_rgba(20,60,120,0.08)] relative z-20 space-y-6 animate-scale-up">
                {/* Back to Home Button */}
                {onNavigateHome && (
                  <div>
                    <button
                      type="button"
                      onClick={onNavigateHome}
                      className="inline-flex items-center gap-2 text-[14.5px] sm:text-[15.3px] font-poppins font-medium text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group"
                    >
                      <img
                        src={authArrowBack}
                        alt=""
                        className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1"
                      />
                      <span>Kembali ke Beranda</span>
                    </button>
                  </div>
                )}

                {/* Brand Header Subtitle */}
                <div className="text-center pt-1">
                  <p className="font-poppins font-normal text-xs sm:text-[14.8px] text-[#64748b] leading-relaxed max-w-[420px] mx-auto">
                    Platform B2B SaaS pembuatan landing page profesional untuk UMKM
                    &amp; bisnis lokal secara mandiri.
                  </p>
                </div>

                {/* Auth Mode Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${!isRegister ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${isRegister ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    Daftar Baru
                  </button>
                </div>

                {/* Error Notification */}
                {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">{errorMsg}</div>}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Name Field (Register Mode Only) */}
                  {isRegister && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block font-poppins font-semibold text-xs sm:text-[14.8px] text-[#334155]">
                        Nama Lengkap / Nama Bisnis
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-[18px] pointer-events-none flex items-center">
                          <img
                            src={authIconUser}
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: M Atha"
                          className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2.5px] focus:ring-[#dbeafe] rounded-[14px] pl-[52px] pr-4 py-3 sm:py-3.5 text-xs sm:text-[15.5px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins font-semibold text-xs sm:text-[14.8px] text-[#334155]">
                      Alamat Email
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-[18px] pointer-events-none flex items-center">
                        <img
                          src={authIconMail}
                          alt=""
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@gmail.com"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2.5px] focus:ring-[#dbeafe] rounded-[14px] pl-[52px] pr-4 py-3 sm:py-3.5 text-xs sm:text-[15.5px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins font-semibold text-xs sm:text-[14.8px] text-[#334155]">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-[18px] pointer-events-none flex items-center">
                        <img
                          src={authIconLock}
                          alt=""
                          className="w-[18px] h-[18px]"
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          isRegister ? "Minimal 6 karakter" : "Masukkan password"
                        }
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2.5px] focus:ring-[#dbeafe] rounded-[14px] pl-[52px] pr-12 py-3 sm:py-3.5 text-xs sm:text-[15.5px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 sm:py-4 rounded-[14px] bg-[#425B9A] hover:bg-[#354a7d] text-white font-poppins font-semibold text-sm sm:text-[16px] shadow-md shadow-[#425B9A]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {isRegister ? "Daftar Sekarang" : "Masuk ke Akun"}
                          </span>
                          <img
                            src={authArrowSubmit}
                            alt=""
                            className="w-[18px] h-[18px]"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Bottom Feature Badges (AI Generator, Drag & Drop, WhatsApp Direct) */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-[13px] font-poppins text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                      <img src={authCheck} alt="" className="w-2.5 h-2.5" />
                    </div>
                    <span className="whitespace-nowrap font-medium">AI Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                      <img src={authCheck} alt="" className="w-2.5 h-2.5" />
                    </div>
                    <span className="whitespace-nowrap font-medium">Drag &amp; Drop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                      <img src={authCheck} alt="" className="w-2.5 h-2.5" />
                    </div>
                    <span className="whitespace-nowrap font-medium">WhatsApp Direct</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer subtle copyright ── */}
        <footer className="relative z-10 py-4 text-center text-xs text-slate-400 font-poppins">
          © {new Date().getFullYear()} LOKA Platform. Hak Cipta Dilindungi.
        </footer>
      </div>
    );
  };
