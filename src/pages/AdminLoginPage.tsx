import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Server,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onNavigateHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      // Guard: Pastikan role adalah admin atau support
      if (data.user.role !== 'admin' && data.user.role !== 'support') {
        setErrorMsg(
          `Akses Ditolak: Akun (${data.user.email}) memiliki role '${data.user.role}'. Portal ini khusus Administrator & Tim Support. Silakan login di portal pengguna utama.`
        );
        return;
      }

      login(data.token, data.user);
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      setErrorMsg(err.message || 'Kredensial administrator tidak valid');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetEmail: string) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await authService.login(targetEmail, 'password123');
      login(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal login kredensial otomatis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Cyber Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Admin Container */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Top Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-black tracking-widest uppercase">
            <Server className="w-3 h-3" />
            <span>Internal Staff & Administrator Portal</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30 border border-purple-400/20">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              LOKA Admin Monitoring
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Pusat kendali dan monitoring aktivitas client, sesi login, serta website yang dibuat pengguna.
            </p>
          </div>
        </div>

        {/* Security Alert Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-300">
            <strong className="text-amber-300 font-bold">Akses Terbatas:</strong> Halaman ini dilindungi autentikasi JWT dan pencatatan sesi IP. Hanya untuk role <span className="text-purple-300 font-bold">admin</span> & <span className="text-purple-300 font-bold">support</span>.
          </p>
        </div>

        {/* Quick Credentials Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block">
            Akses Cepat (Pre-Seeded Accounts):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@lokalsite.id')}
              className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-200 text-left transition disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold">Admin Master</span>
                <KeyRound className="w-3 h-3 text-purple-400 group-hover:scale-110 transition" />
              </div>
              <span className="text-[9px] text-purple-400/70 block truncate">admin@lokalsite.id</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('support@lokalsite.id')}
              className="p-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 text-indigo-200 text-left transition disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold">Support Team</span>
                <KeyRound className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition" />
              </div>
              <span className="text-[9px] text-indigo-400/70 block truncate">support@lokalsite.id</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2">
            <span className="font-bold text-red-400">Error:</span>
            <span className="flex-1 leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Email Administrator</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lokalsite.id"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Memverifikasi Otoritas...</span>
            ) : (
              <>
                <span>Masuk ke Panel Monitoring</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to User Portal */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal Pengguna UMKM (/)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

