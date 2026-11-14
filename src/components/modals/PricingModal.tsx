import React, { useState } from 'react';
import { paymentService } from '../../services/payment.service';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Check,
  X,
  CreditCard,
  Zap,
  ShieldCheck,
  Crown,
  HelpCircle,
  QrCode,
  Flame,
  RefreshCw,
  Globe,
  Inbox,
  Share2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgraded?: () => void;
  onViewProPerks?: () => void;
}

export const PricingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpgraded,
  onViewProPerks,
}) => {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'pro_yearly'>('pro_monthly');
  const [loading, setLoading] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showExtendSection, setShowExtendSection] = useState(false);

  if (!isOpen) return null;

  const handlePayMidtrans = async () => {
    try {
      setLoading(true);
      const res = await paymentService.createSnapToken(selectedPlan);
      setActiveOrderId(res.orderId);

      // Cek apakah Midtrans Snap SDK ter-load
      const snap = (window as any).snap;

      if (snap && snap.pay) {
        snap.pay(res.token, {
          onSuccess: async () => {
            await handlePaymentSuccess(res.orderId);
          },
          onPending: () => {
            toast.info(
              'Menunggu Pembayaran',
              'Silakan selesaikan pembayaran di simulator/QRIS Midtrans. Klik "Cek Status" jika sudah bayar.'
            );
          },
          onError: (err: any) => {
            console.error('Midtrans payment error:', err);
            toast.error('Pembayaran Gagal', 'Transaksi dibatalkan atau waktu pembayaran telah habis.');
          },
          onClose: async () => {
            await checkStatusManual(res.orderId, true);
          },
        });
      } else {
        // Fallback jika adblocker memblokir snap.js
        toast.info(
          'Membuka Gateway Pembayaran',
          'Silakan selesaikan pembayaran di jendela yang terbuka lalu klik Cek Status.'
        );
        window.open(res.redirectUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Snap error:', err);
      toast.error('Gagal Memulai Pembayaran', err.message || 'Terjadi kesalahan gateway');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      setLoading(true);
      const verifyRes = await paymentService.verifyPayment(orderId);
      if (verifyRes.user) {
        updateUser(verifyRes.user);
      } else if (user) {
        updateUser({
          ...user,
          plan: 'pro',
        });
      }
      toast.success(
        '⭐ Selamat! Anda Kini Berstatus LOKA Pro',
        'Fitur custom clean slug dan penghapusan watermark kini aktif penuh di akun Anda.'
      );
      if (onUpgraded) onUpgraded();
      onClose();
    } catch (err) {
      console.error('Success handler error:', err);
      if (onUpgraded) onUpgraded();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const checkStatusManual = async (orderIdToCheck?: string, isSilent = false) => {
    const targetOrderId = orderIdToCheck || activeOrderId;
    if (!targetOrderId) return;
    try {
      setLoading(true);
      const res = await paymentService.verifyPayment(targetOrderId);
      if (res.plan === 'pro') {
        if (res.user) {
          updateUser(res.user);
        } else if (user) {
          updateUser({ ...user, plan: 'pro' });
        }
        toast.success(
          '⭐ Pembayaran Terverifikasi!',
          'Status LOKA Pro aktif! Fitur custom clean slug & bebas watermark siap digunakan.'
        );
        if (onUpgraded) onUpgraded();
        onClose();
      } else if (!isSilent) {
        toast.info(
          'Status: Menunggu Pembayaran',
          'Pembayaran belum diselesaikan di simulator Midtrans. Silakan selesaikan transfer/QRIS Anda.'
        );
      }
    } catch (err: any) {
      if (!isSilent) {
        toast.error('Gagal Cek Status', err.message || 'Terjadi kendala saat memeriksa status pembayaran.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSandbox = async () => {
    try {
      setLoading(true);
      let orderId = activeOrderId;
      if (!orderId) {
        const res = await paymentService.createSnapToken(selectedPlan);
        orderId = res.orderId;
      }

      const simRes = await paymentService.simulateSuccess(orderId);
      const verifyRes = await paymentService.verifyPayment(orderId);
      if (verifyRes.user) {
        updateUser(verifyRes.user);
      } else if (user) {
        updateUser({
          ...user,
          plan: 'pro',
        });
      }
      toast.success('Pembayaran Sandbox Berhasil!', simRes.message);
      if (onUpgraded) onUpgraded();
      onClose();
    } catch (err: any) {
      toast.error('Simulasi Gagal', err.message || 'Terjadi kesalahan simulasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up">
        {/* Header Banner - Fixed at top with LOKA Navy Sapphire & Cyan Glow */}
        <div className="bg-gradient-to-r from-[#1b2744] via-[#425B9A] to-[#206994] p-5 sm:p-6 text-white relative overflow-hidden shrink-0">
          {/* Ambient luminous glow orbs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#76C0EC]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-[10px] uppercase tracking-wider mb-2.5 shadow-md shadow-amber-500/25">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>{user?.plan === 'pro' ? 'Status Keanggotaan: PRO AKTIF' : 'LOKA Pro Membership'}</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight">
            {user?.plan === 'pro' ? 'Hak Istimewa & Benefit LOKA PRO' : 'Tingkatkan Bisnis ke Level Profesional'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-lg leading-relaxed">
            {user?.plan === 'pro'
              ? 'Seluruh hak istimewa profesional, domain custom bersih, akses template eksklusif PRO, dan white-label tanpa watermark terbuka penuh di akun Anda.'
              : 'Dapatkan nama domain bersih tanpa angka acak, hilangkan watermark LOKA, akses template eksklusif PRO, dan nikmati fitur lainnya.'}
          </p>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active Pro Member Banner */}
          {user?.plan === 'pro' && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>Keanggotaan LOKA PRO Aktif</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black tracking-wide">
                      VERIFIED
                    </span>
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {user.subscriptionUntil
                      ? `Masa aktif langganan berlaku hingga ${new Date(user.subscriptionUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                      : 'Status akun PRO aktif penuh tanpa batas waktu.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {onViewProPerks && (
                  <button
                    type="button"
                    onClick={onViewProPerks}
                    className="py-1.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Lihat Benefit & Animasi</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowExtendSection(!showExtendSection)}
                  className="py-1.5 px-3 bg-white hover:bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                  <span>{showExtendSection ? 'Tutup Opsi' : 'Perpanjang Langganan'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Pending Order Sync Card */}
          {activeOrderId && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <span className="font-bold text-blue-900 block truncate">Order ID: {activeOrderId}</span>
                <span className="text-[11px] text-blue-700">Sudah bayar di Midtrans Simulator / QRIS?</span>
              </div>
              <button
                type="button"
                onClick={() => checkStatusManual(activeOrderId)}
                disabled={loading}
                className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Cek Status Pembayaran</span>
              </button>
            </div>
          )}

          {/* 6 PRO BENEFITS SHOWCASE (Highlighted for Both PRO & Free users) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Rincian Benefit & Fitur LOKA PRO:</span>
              </h3>
              {user?.plan === 'pro' && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Semua Benefit Aktif</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Benefit 1 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-amber-300 transition group">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Custom Clean Slug</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Bebas menentukan alamat URL tanpa 4 digit angka acak (misal: <code className="bg-slate-100 text-blue-600 font-mono px-1 rounded">/sites/kopi-senja</code>).
                    Bebas menentukan alamat subdomain tanpa 4 digit angka acak (misal: <code className="bg-slate-100 text-blue-600 font-mono px-1 rounded">kopi-senja.ruuby.my.id</code>).
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-[#76C0EC] transition group">
                <div className="w-8 h-8 rounded-xl bg-[#425B9A]/10 text-[#425B9A] flex items-center justify-center shrink-0 group-hover:bg-[#425B9A] group-hover:text-white transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">100% White-Label</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Watermark footer <em>"⚡ Dibuat dengan LOKA Site"</em> otomatis dihapus permanen dari landing page bisnis Anda.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-[#76C0EC] transition group">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Inbox className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Buku Tamu & Inbox Leads</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Penyimpanan kontak dan pesan dari pengunjung website tanpa batasan kuota, lengkap dengan rekapitulasi data.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-[#76C0EC] transition group">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">QR Stand Meja Kasir HD</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Cetak kartu stand QR Code resolusi tinggi untuk meja kasir/kafe agar pengunjung fisik langsung membuka katalog.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-[#76C0EC] transition group">
                <div className="w-8 h-8 rounded-xl bg-[#76C0EC]/20 text-[#1b5073] flex items-center justify-center shrink-0 group-hover:bg-[#425B9A] group-hover:text-white transition">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">SEO & OpenGraph Preview</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Kustomisasi foto thumbnail, judul, dan kartu link saat website Anda dibagikan ke WhatsApp, Facebook, dan Google.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3 hover:border-[#76C0EC] transition group">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">Prioritas Gemini AI</h4>
                    {user?.plan === 'pro' && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-black uppercase">Aktif</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Pembuatan copywriting dan struktur 9 section bisnis berbasis AI Gemini diproses instan dengan kuota prioritas tinggi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRICING & PAYMENT SECTION (Shown for Free Users OR when PRO user wants to extend) */}
          {(user?.plan !== 'pro' || showExtendSection) && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {user?.plan === 'pro' ? 'Pilih Paket Perpanjangan:' : 'Pilih Paket Langganan:'}
                </h4>
                <span className="text-[11px] text-slate-500">Midtrans Sandbox Gateway</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plan 1: Monthly */}
                <div
                  onClick={() => setSelectedPlan('pro_monthly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    selectedPlan === 'pro_monthly'
                      ? 'border-[#425B9A] bg-[#425B9A]/5 shadow-md ring-2 ring-[#76C0EC]/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Pro 1 Bulan
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === 'pro_monthly'
                          ? 'border-[#425B9A] bg-[#425B9A] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPlan === 'pro_monthly' && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">Rp 29.000</span>
                    <span className="text-xs text-slate-400">/ bulan</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Cocok untuk uji coba promosi awal toko atau event musiman.
                  </p>
                </div>

                {/* Plan 2: Yearly (Recommended) */}
                <div
                  onClick={() => setSelectedPlan('pro_yearly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    selectedPlan === 'pro_yearly'
                      ? 'border-[#425B9A] bg-[#425B9A]/5 shadow-md ring-2 ring-[#76C0EC]/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
                    <Flame className="w-3 h-3" />
                    <span>Hemat 40%</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Pro 1 Tahun
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === 'pro_yearly'
                          ? 'border-[#425B9A] bg-[#425B9A] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPlan === 'pro_yearly' && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">Rp 199.000</span>
                    <span className="text-xs text-slate-400">/ tahun</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Hanya Rp 16.500/bulan. Pilihan hemat untuk operasional bisnis.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handlePayMidtrans}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#293a62] via-[#425B9A] to-[#2572a3] hover:from-[#202f52] hover:to-[#1e5d85] text-white font-black rounded-2xl shadow-lg shadow-[#425B9A]/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {loading
                      ? 'Menghubungkan ke Midtrans...'
                      : `${user?.plan === 'pro' ? 'Perpanjang Sekarang' : 'Bayar Sekarang'} (${selectedPlan === 'pro_monthly' ? 'Rp 29.000' : 'Rp 199.000'})`}
                  </span>
                </button>

                {/* Sandbox 1-Click Simulation Button for Education/Demo */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleSimulateSandbox}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                    title="Simulasi otomatis pembayaran sukses tanpa harus membayar QRIS asli"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mode Demo Sandbox: 1-Klik Langsung Aktifkan Pro</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Midtrans Gateway Sandbox &bull; Aman untuk demonstrasi perkuliahan & pengujian sistem
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

