import React from 'react';
import { Crown, Sparkles, Check, Globe, ShieldCheck, QrCode, Inbox, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProSuccessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up">
        {/* Header celebratory banner */}
        <div className="bg-gradient-to-br from-[#1b2744] via-[#425B9A] to-[#206994] p-6 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#76C0EC]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-amber-400/25 rounded-full blur-2xl pointer-events-none" />

          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-slate-950 shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
            <Crown className="w-9 h-9 fill-current" />
            <Sparkles className="w-4 h-4 text-amber-900 absolute -top-1 -right-1" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-amber-300 font-black text-[10px] uppercase tracking-wider mb-2 border border-white/20">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Pembayaran Berhasil Diverifikasi</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Selamat Datang di LOKA Pro! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-sm mx-auto leading-relaxed">
            Akun Anda kini resmi berstatus <strong className="text-amber-300 font-bold">LOKA PRO</strong>. Seluruh batasan telah dibuka penuh.
          </p>
        </div>

        {/* Unlocked perks list */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Fitur Premium Langsung Aktif:
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              UNLOCKED
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">Custom Clean Slug & Subdomain</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bebas ganti tautan website tanpa akhiran 4 angka acak (misal: <span className="font-mono text-blue-600">kopi-senja.ruuby.my.id</span>).
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">100% White-Label (Bebas Watermark)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Watermark LOKA di footer landing page otomatis hilang permanen untuk citra brand profesional.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">Cetak QR Stand Meja Kasir HD</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Download & cetak kartu akrilik stand meja beresolusi tinggi siap pajang di toko fisik.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Inbox className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">Inbox Buku Tamu & Leads Tanpa Batas</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tampung pesan & kontak calon pembeli sepuasnya tanpa khawatir batas penyimpanan.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/80 flex items-start gap-3 transition">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">AI Copywriter Prioritas Tinggi</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Generasi copywriting website dan katalog dengan Google Gemini berkecepatan tinggi.
                </p>
              </div>
            </div>
          </div>

          {user?.subscriptionUntil && (
            <div className="text-center p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              Masa aktif Pro berlaku hingga:{' '}
              <strong className="font-bold">
                {new Date(user.subscriptionUntil).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-[#293a62] via-[#425B9A] to-[#206994] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-[#425B9A]/20 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-98"
          >
            <span>Mulai Nikmati Fitur Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
