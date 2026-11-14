import React, { useEffect } from 'react';
import {
  Crown,
  Sparkles,
  Check,
  Globe,
  ShieldCheck,
  QrCode,
  Inbox,
  ArrowRight,
  Zap,
  X,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import animasiProPlan from '../../assets/ANIMASI-PROPLAN.webm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onManageSubscription?: () => void;
}

export const ProSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onManageSubscription,
}) => {
  const { user } = useAuth();

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl shadow-sky-950/30 border border-slate-200/80 overflow-hidden relative animate-scale-up">
        {/* Header celebratory banner with Video Animation on Top */}
        <div className="bg-gradient-to-b from-[#080d19] via-[#0f172a] to-[#162344] text-white text-center relative overflow-hidden shrink-0">
          {/* Ambient luminous glow orbs */}
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#76C0EC]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-6 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer backdrop-blur-xs"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* 3D Mascot Celebration Animation Video on Top */}
          <div className="relative w-full flex items-center justify-center pt-3 pb-1 overflow-hidden">
            {/* Luminous aura behind character */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-36 bg-gradient-to-r from-blue-500/25 via-cyan-400/25 to-amber-400/20 rounded-full blur-2xl pointer-events-none" /> */}

            <video
              src={animasiProPlan}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-h-[175px] sm:max-h-[200px] object-contain relative z-10 filter drop-shadow-[0_12px_24px_rgba(30,58,138,0.45)]"
            />

            {/* Seamless gradient transition into header text */}
            {/* <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#162344] to-transparent z-20 pointer-events-none" /> */}
          </div>

          {/* Celebratory badge & Title */}
          <div className="px-6 pb-5 pt-1 relative z-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-300/10 backdrop-blur-md text-amber-300 font-poppins font-bold text-[10.5px] uppercase tracking-wider border border-amber-400/35 shadow-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300 animate-pulse" />
              <span>Pembayaran Berhasil Diverifikasi</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-poppins font-black text-white tracking-tight">
              Selamat Datang di LOKA Pro! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-sm mx-auto leading-relaxed font-poppins">
              Akun Anda kini resmi berstatus <strong className="text-amber-300 font-bold">LOKA PRO</strong>. Seluruh batasan telah dibuka penuh.
            </p>
          </div>
        </div>

        {/* Unlocked perks list */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-poppins font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Fitur Premium Langsung Aktif:
            </span>
            <span className="text-[10px] font-poppins font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              UNLOCKED
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Perk 1: Custom Slug */}
            <div className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-blue-50/60 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/25">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-poppins font-bold text-slate-900">Custom Clean Slug & Subdomain</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-poppins uppercase">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-poppins leading-relaxed">
                  Bebas ganti tautan website tanpa akhiran 4 angka acak (misal: <span className="font-mono text-blue-600 font-semibold">kopi-senja.ruuby.my.id</span>).
                </p>
              </div>
            </div>

            {/* Perk 2: White Label */}
            <div className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-purple-50/60 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-purple-500/25">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-poppins font-bold text-slate-900">100% White-Label (Bebas Watermark)</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-poppins uppercase">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-poppins leading-relaxed">
                  Watermark LOKA di footer landing page otomatis hilang permanen untuk citra brand profesional.
                </p>
              </div>
            </div>

            {/* Perk 3: QR Stand Meja HD */}
            <div className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-amber-50/60 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs shadow-amber-500/25">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-poppins font-bold text-slate-900">Cetak QR Stand Meja Kasir HD</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-poppins uppercase">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-poppins leading-relaxed">
                  Download & cetak kartu akrilik stand meja beresolusi tinggi siap pajang di toko fisik.
                </p>
              </div>
            </div>

            {/* Perk 4: Inbox Leads */}
            <div className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-emerald-500/25">
                <Inbox className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-poppins font-bold text-slate-900">Inbox Buku Tamu & Leads Tanpa Batas</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-poppins uppercase">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-poppins leading-relaxed">
                  Tampung pesan & kontak calon pembeli sepuasnya tanpa khawatir batas penyimpanan.
                </p>
              </div>
            </div>

            {/* Perk 5: AI Copywriter */}
            <div className="p-3 sm:p-3.5 bg-slate-50/80 hover:bg-rose-50/60 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-rose-500/25">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-poppins font-bold text-slate-900">AI Copywriter Prioritas Tinggi</h4>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-poppins uppercase">Aktif</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-poppins leading-relaxed">
                  Generasi copywriting website dan katalog dengan Google Gemini berkecepatan tinggi.
                </p>
              </div>
            </div>
          </div>

          {/* Pro Expiration Status */}
          <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-orange-500/10 rounded-2xl border border-amber-300/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <Crown className="w-4 h-4 fill-current text-amber-950" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-amber-900 font-poppins font-medium">Masa aktif LOKA Pro berlaku hingga:</p>
                <p className="text-xs font-poppins font-bold text-amber-950 truncate">
                  {user?.subscriptionUntil
                    ? new Date(user.subscriptionUntil).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '30 Hari (Aktif Penuh)'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-poppins font-extrabold text-emerald-700 bg-emerald-100/90 border border-emerald-300/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
              Aktif
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {onManageSubscription ? (
            <button
              type="button"
              onClick={onManageSubscription}
              className="text-xs font-poppins font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Kelola / Perpanjang Langganan</span>
            </button>
          ) : (
            <div className="order-2 sm:order-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-poppins">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Status akun terverifikasi</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-[#1e2a4a] via-[#425B9A] to-[#206994] hover:brightness-110 text-white font-poppins font-bold rounded-2xl shadow-lg shadow-[#425B9A]/25 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-98 order-1 sm:order-2"
          >
            <span>Mulai Nikmati Fitur Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
