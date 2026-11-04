import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { ArrowRight, Lock, Mail, User, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import logoOfficialWithTagline from "../assets/Logo Loka (2).png";

interface Props {
  onNavigateAdmin?: () => void;
  onNavigateHome?: () => void;
  initialMode?: "login" | "register";
}

export const AuthPage: React.FC<Props> = ({ onNavigateAdmin, onNavigateHome, initialMode = "login" }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || (isRegister ? "Gagal mendaftar" : "Gagal masuk"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/80 to-blue-50/40 flex items-center justify-center p-4 overflow-hidden animate-fade-in">
      {/* Decorative Background Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Ambient Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#425B9A]/20 blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-36 -right-36 w-[30rem] h-[30rem] rounded-full bg-[#76C0EC]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#425B9A]/15 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#76C0EC]/20 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#425B9A]/15 via-[#76C0EC]/15 to-transparent blur-[130px] pointer-events-none" />

      {/* Main Auth Card */}
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-950/10 border border-white/80 ring-1 ring-slate-900/5 p-8 space-y-6 animate-scale-up">
        {/* Top Back Nav */}
        {onNavigateHome && (
          <div className="flex items-center justify-between">
            <button type="button" onClick={onNavigateHome} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"></span>
          </div>
        )}

        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logoOfficialWithTagline} alt="Loka - Your Bussines, Online" className="h-16 w-auto object-contain drop-shadow-xs" />
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Platform B2B SaaS pembuatan landing page profesional untuk UMKM & bisnis lokal secara mandiri.</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
              setSuccessMsg(null);
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
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${isRegister ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Success Notification */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2 shadow-2xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs animate-in fade-in">{errorMsg}</div>}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap / Nama Bisnis</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: M Atha"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#425B9A" }}
            className="w-full py-3 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Memproses..." : isRegister ? "Daftar Sekarang" : "Masuk ke Dashboard"}</span>
            <ArrowRight className="w-4 h-4 text-[#76C0EC]" />
          </button>
        </form>

        {/* Feature List Badges */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI Generator
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Drag & Drop
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Direct
          </span>
        </div>
      </div>
    </div>
  );
};
