import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { ShieldCheck, ShieldAlert, Lock, Mail, ArrowRight, Server, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import logoWithTagline from "../assets/Logo Loka (2).png";

interface Props {
  onNavigateHome: () => void;
  onNavigateUserLogin?: () => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onNavigateHome, onNavigateUserLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      // Validasi role harus staf internal (admin / support)
      if (data.user.role !== "admin" && data.user.role !== "support") {
        throw new Error("Akun Anda terdaftar sebagai Merchant biasa, bukan Administrator. Silakan login melalui halaman login merchant.");
      }
      login(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || "Login administrator gagal. Periksa email & password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetEmail: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await authService.login(targetEmail, "password123");
      login(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal login kredensial otomatis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/80 to-blue-50/40 flex items-center justify-center p-4 overflow-hidden animate-fade-in">
      {/* Decorative Background Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Ambient Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#425B9A]/20 blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute -bottom-36 -right-36 w-[30rem] h-[30rem] rounded-full bg-[#76C0EC]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#425B9A]/15 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#76C0EC]/20 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#425B9A]/15 via-[#76C0EC]/15 to-transparent blur-[130px] pointer-events-none" />

      {/* Main Admin Card */}
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-950/10 border border-white/80 ring-1 ring-slate-900/5 p-8 space-y-6 animate-scale-up">
        {/* Top Navigation & Back */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={onNavigateHome} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#425B9A]/10 text-[#425B9A] border border-[#425B9A]/20">Akses Internal</span>
        </div>

        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logoWithTagline} alt="Loka - Your Bussines, Online" className="h-14 w-auto object-contain drop-shadow-xs" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Portal Administrator</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Pusat kendali dan pengawasan seluruh client UMKM, moderasi konten landing page, serta log audit sistem.</p>
          </div>
        </div>

        {/* 1-Click Quick Credentials for Admin/Support */}
        {/* <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block text-center">Akses Cepat Pengujian (Admin & Support):</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("admin@loka.id")}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#425B9A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#76C0EC]" />
                <span>Super Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5 font-mono">admin@loka.id</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("support@loka.id")}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
                <Server className="w-3.5 h-3.5 text-indigo-500" />
                <span>Staf Support</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5 font-mono">support@loka.id</span>
            </button>
          </div>
        </div> */}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Administrator</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@loka.id"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#425B9A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password Administrator</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#425B9A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#425B9A" }}
            className="w-full py-3 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#76C0EC]" />
            <span>{loading ? "Memverifikasi Akses..." : "Masuk sebagai Administrator"}</span>
          </button>
        </form>

        {/* Switch to Regular Merchant Login */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Bukan Administrator?</span>
          <button type="button" onClick={onNavigateUserLogin || onNavigateHome} className="font-bold text-[#425B9A] hover:underline flex items-center gap-1 transition cursor-pointer">
            <span>Login Merchant / UMKM &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
