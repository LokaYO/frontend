import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/* ── Brand Logo ── */
import logoClean from "../assets/Logo Loka (1) (1).png";

/* ── 3D Illustration & Background Assets ── */
import vectorLogin from "../assets/hero/vector_login.webp";
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

        // Jika yang login ternyata admin, arahkan ke /admin
        if ((data.user.role === "admin" || data.user.role === "support") && onNavigateAdmin) {
          onNavigateAdmin();
        }
      }
    } catch (err: unknown) {
      console.error("Auth error:", err);
      setErrorMsg(
        (err instanceof Error ? err.message : null) ||
          (isRegister ? "Gagal mendaftar" : "Gagal masuk"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen max-h-screen w-full flex flex-col justify-between overflow-hidden select-none"
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
      <header className="relative z-30 max-w-[1720px] w-full mx-auto px-6 sm:px-10 xl:px-16 pt-3 sm:pt-4 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <img
            src={logoClean}
            alt="Loka"
            className="h-7 sm:h-8 xl:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </button>
      </header>

      {/* ── Main Workspace: 2-Column Responsive Layout (Figma Node 24:231) ── */}
      <main className="relative z-20 max-w-[1720px] w-full mx-auto px-6 sm:px-10 xl:px-16 py-1 sm:py-2 flex-1 min-h-0 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center w-full h-full max-h-full">
          {/* ══════════════════════════════════════════════════
            LEFT COLUMN: 3D Illustration & Visual Canvas
            ══════════════════════════════════════════════════ */}
          <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 relative items-center justify-center h-full max-h-[calc(100vh-100px)] select-none pointer-events-none">
            <div className="relative z-10 w-full max-w-[640px] xl:max-w-[720px] flex items-center justify-center animate-illustration-fade-in">
              <img
                src={vectorLogin}
                alt="Loka Platform Illustration"
                className="w-full max-h-[calc(100vh-130px)] h-auto object-contain drop-shadow-[0_16px_36px_rgba(20,50,90,0.14)]"
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
            RIGHT COLUMN: Auth Form Card (Figma Node 24:241)
            ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end w-full h-full max-h-full items-center">
            <div className="w-full max-w-[480px] xl:max-w-[510px] bg-white rounded-[26px] sm:rounded-[30px] border border-[#f1f5f9] p-5 sm:p-7 xl:p-8 shadow-[0px_14px_53px_-12px_rgba(20,60,120,0.08)] relative z-20 space-y-3.5 sm:space-y-4 animate-scale-up max-h-[calc(100vh-90px)] overflow-y-auto no-scrollbar select-text">
              {/* Back to Home Button */}
              {onNavigateHome && (
                <div>
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="inline-flex items-center gap-2 text-xs sm:text-[13.5px] font-poppins font-medium text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group"
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
              <div className="text-center pt-0.5">
                <p className="font-poppins font-normal text-xs sm:text-[13.5px] text-[#64748b] leading-relaxed max-w-[380px] mx-auto">
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
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition cursor-pointer ${!isRegister ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition cursor-pointer ${isRegister ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Daftar Baru
                </button>
              </div>

              {/* Error Notification */}
              {errorMsg && <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">{errorMsg}</div>}

              {/* Success Notification */}
              {successMsg && <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">{successMsg}</div>}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                {/* Name Field (Register Mode Only) */}
                {isRegister && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="block font-poppins font-semibold text-xs sm:text-[13.5px] text-[#334155]">
                      Nama Lengkap / Nama Bisnis
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-[16px] pointer-events-none flex items-center">
                        <img
                          src={authIconUser}
                          alt=""
                          className="w-4 h-4"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: M Atha"
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2px] focus:ring-[#dbeafe] rounded-[12px] pl-[46px] pr-4 py-2.5 text-xs sm:text-[14px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block font-poppins font-semibold text-xs sm:text-[13.5px] text-[#334155]">
                    Alamat Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-[16px] pointer-events-none flex items-center">
                      <img
                        src={authIconMail}
                        alt=""
                        className="w-4 h-4"
                      />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2px] focus:ring-[#dbeafe] rounded-[12px] pl-[46px] pr-4 py-2.5 text-xs sm:text-[14px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block font-poppins font-semibold text-xs sm:text-[13.5px] text-[#334155]">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-[16px] pointer-events-none flex items-center">
                      <img
                        src={authIconLock}
                        alt=""
                        className="w-4 h-4"
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
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-[#3b82f6] focus:bg-white focus:ring-[2px] focus:ring-[#dbeafe] rounded-[12px] pl-[46px] pr-11 py-2.5 text-xs sm:text-[14px] font-poppins text-slate-800 placeholder-[#717d8d] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 rounded-[12px] bg-[#425B9A] hover:bg-[#354a7d] text-white font-poppins font-semibold text-xs sm:text-[15px] shadow-md shadow-[#425B9A]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                          className="w-4 h-4"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Feature Badges (AI Generator, Drag & Drop, WhatsApp Direct) */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-poppins text-[#64748b]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                    <img src={authCheck} alt="" className="w-2 h-2" />
                  </div>
                  <span className="whitespace-nowrap font-medium">AI Generator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                    <img src={authCheck} alt="" className="w-2 h-2" />
                  </div>
                  <span className="whitespace-nowrap font-medium">Drag &amp; Drop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-[#10b981] flex items-center justify-center shrink-0">
                    <img src={authCheck} alt="" className="w-2 h-2" />
                  </div>
                  <span className="whitespace-nowrap font-medium">WhatsApp Direct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer subtle copyright ── */}
      <footer className="relative z-10 py-2 sm:py-2.5 text-center text-[11px] sm:text-xs text-slate-400 font-poppins shrink-0">
        © {new Date().getFullYear()} LOKA Platform. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
  };
