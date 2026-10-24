import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Store,
  QrCode,
  Inbox,
  TrendingUp,
  Globe,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Zap,
  Layers,
  Award,
  Eye,
  Crown,
} from 'lucide-react';
import logoClean from '../assets/Logo Loka (1) (1).png';
import logoWithTagline from '../assets/Logo Loka (2).png';

interface Props {
  onTryNow: () => void;
  onLogin: () => void;
  onAdminLogin?: () => void;
}

export const LandingPage: React.FC<Props> = ({ onTryNow, onLogin }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTryNow = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onTryNow();
    }, 200);
  };

  const handleLogin = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onLogin();
    }, 200);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#425B9A]/20 selection:text-[#425B9A] scroll-smooth transition-all duration-200 ${
        isNavigating ? 'opacity-60 scale-[0.995] pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Route Loading Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#425B9A] via-[#76C0EC] to-[#425B9A] animate-pulse z-50" />
      )}
      {/* ── Top Announcement Banner ── */}
      <div className="bg-[#425B9A] text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 uppercase tracking-wider">
          Baru
        </span>
        <span>Platform B2B SaaS Landing Page & Katalog WhatsApp Khusus Bisnis Lokal Indonesia 🇮🇩</span>
      </div>

      {/* ── Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src={logoClean}
                alt="Loka"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a
              href="#fitur"
              onClick={(e) => scrollToSection(e, 'fitur')}
              className="hover:text-[#425B9A] transition cursor-pointer"
            >
              Fitur Unggulan
            </a>
            <a
              href="#template"
              onClick={(e) => scrollToSection(e, 'template')}
              className="hover:text-[#425B9A] transition cursor-pointer"
            >
              Galeri Template
            </a>
            <a
              href="#cara-kerja"
              onClick={(e) => scrollToSection(e, 'cara-kerja')}
              className="hover:text-[#425B9A] transition cursor-pointer"
            >
              Cara Kerja
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleLogin}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition active:scale-95 cursor-pointer"
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={handleTryNow}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#425B9A] hover:bg-[#354a7d] shadow-sm hover:shadow transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Try Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#76C0EC]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-24 sm:pt-28 md:pt-36 md:pb-36 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-[#425B9A]/10 to-[#76C0EC]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Hadirkan Website Bisnis & Katalog Online Tanpa Ribet
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Solusi praktis bagi UMKM, restoran, barbershop, salon, klinik, dan toko lokal untuk membuat landing page profesional dalam hitungan menit. Terhubung otomatis ke WhatsApp, siap mendatangkan pelanggan.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleTryNow}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white bg-[#425B9A] hover:bg-[#354a7d] shadow-lg shadow-[#425B9A]/25 hover:shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 group"
            >
              <span>Try Now — Mulai Gratis</span>
              <ArrowRight className="w-4 h-4 text-[#76C0EC] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#fitur"
              onClick={(e) => scrollToSection(e, 'fitur')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Pelajari Fitur</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tanpa Keahlian Koding</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#425B9A]" />
              <span>Order Otomatis via WhatsApp</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Stand Meja QR Kasir Siap Cetak</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#425B9A]" />
              <span>Desain Responsif Mobile & Tablet</span>
            </span>
          </div>

          {/* ── Interactive Preview Mockup Card ── */}
          <div className="pt-16 sm:pt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xl relative overflow-hidden">
              <div className="bg-slate-100 rounded-2xl border border-slate-200 p-2 sm:p-3 flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white px-3 py-1 rounded-lg text-[11px] font-mono text-slate-600 border border-slate-200/70 flex-1 truncate text-left">
                  https://lokalsite.id/sites/paw-and-tail-care
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#425B9A] px-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Mode</span>
                </div>
              </div>

              {/* Mockup Inside Visual */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 sm:p-10 border border-slate-100 text-left space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#425B9A] text-white flex items-center justify-center font-bold shadow-xs">
                      P
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Paw & Tail Care</h3>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Buka Sekarang (09:00 - 20:00)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onTryNow}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Booking Grooming via WA</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Paket Populer</span>
                    <h4 className="font-bold text-sm text-slate-900">Full Grooming Treatment</h4>
                    <p className="text-xs text-slate-500">Mandi herbal, potong kuku, & hair styling.</p>
                    <span className="font-extrabold text-[#425B9A] text-xs block pt-2">Rp 120.000</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Penitipan Nyaman</span>
                    <h4 className="font-bold text-sm text-slate-900">Hotel Anabul VIP Room</h4>
                    <p className="text-xs text-slate-500">Ruangan ber-AC, CCTV live 24 jam, & makan.</p>
                    <span className="font-extrabold text-[#425B9A] text-xs block pt-2">Rp 85.000 / hari</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Perawatan Medis</span>
                    <h4 className="font-bold text-sm text-slate-900">Vaksin & Konsultasi Dokter</h4>
                    <p className="text-xs text-slate-500">Ditangani dokter hewan berizin profesional.</p>
                    <span className="font-extrabold text-[#425B9A] text-xs block pt-2">Rp 150.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Features Section ── */}
      <section id="fitur" className="scroll-mt-20 py-20 md:py-28 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#425B9A] block">
              Fitur Lengkap
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Semua yang Dibutuhkan Usaha Anda Ada di Sini
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Dirancang khusus untuk mempermudah operasional dan promosi pemilik bisnis lokal di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-[#425B9A]/10 text-[#425B9A] flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Drag & Drop Section Builder</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Susun seksi Hero, Layanan, Jam Buka, Galeri Foto, hingga Formulir Kontak semudah menggeser kartu dengan live preview.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Integrasi WhatsApp Otomatis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tombol CTA langsung mengarahkan pesan yang sudah diformat ke nomor WhatsApp Anda tanpa perantara.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Stand Meja QR Kasir Siap Cetak</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dapatkan kartu akrilik stand meja kasir otomatis beresolusi tinggi (A5/A6) untuk discan langsung oleh pembeli di toko fisik.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Kotak Masuk Leads Pelanggan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kumpulkan pesan formulir dari pengunjung website dalam satu dashboard dan ekspor ke format Excel/CSV kapan saja.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Analitik & Performa Real-Time</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ketahui jumlah pengunjung harian dan seberapa banyak pelanggan yang tertarik menghubungi WhatsApp toko Anda.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900">100% Responsif & Ringan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Website dimuat cepat di semua smartphone pelanggan tanpa lemot, dioptimalkan untuk koneksi internet seluler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Preset Templates Showcase ── */}
      <section id="template" className="scroll-mt-20 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#425B9A] block">
                Galeri Template
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Pilih Desain Siap Pakai untuk Jenis Bisnis Anda
              </h2>
            </div>
            <button
              type="button"
              onClick={onTryNow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#425B9A] hover:underline cursor-pointer"
            >
              <span>Jelajahi Semua Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Kedai Kopi & Cafe',
                category: 'Kuliner',
                tag: 'Bestseller',
                desc: 'Tampilkan menu signature, jam buka, dan link pemesanan online.',
                color: 'from-amber-700 to-amber-900',
              },
              {
                title: 'Pet Care & Salon Grooming',
                category: 'Jasa & Hewan',
                tag: 'Populer',
                desc: 'Daftar tarif perawatan, booking appointment, dan foto anabul.',
                color: 'from-sky-600 to-[#425B9A]',
              },
              {
                title: 'Barbershop & Studio Rambut',
                category: 'Grooming',
                tag: 'Modern',
                desc: 'Katalog gaya rambut, tarif cukur, dan testimoni pelanggan puas.',
                color: 'from-slate-800 to-slate-950',
              },
              {
                title: 'Klinik Kecantikan & Skincare',
                category: 'Kesehatan',
                tag: 'Elegan',
                desc: 'Jadwal dokter, konsultasi treatment, dan ulasan pasien.',
                color: 'from-rose-600 to-pink-700',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden group hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className={`h-36 bg-gradient-to-tr ${t.color} p-5 flex flex-col justify-between text-white relative`}>
                    <span className="self-start px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 backdrop-blur-xs">
                      {t.tag}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
                        {t.category}
                      </span>
                      <h4 className="font-extrabold text-base leading-tight mt-0.5">{t.title}</h4>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={onTryNow}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#425B9A] hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Gunakan Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Easy Steps Section ── */}
      <section id="cara-kerja" className="scroll-mt-20 py-20 md:py-28 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#425B9A] block">
              Cara Kerja
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Online dalam 3 Langkah Sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-[#425B9A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                1
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Pilih Template Bisnis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih tema yang sesuai dengan bidang usaha Anda, dari kuliner, salon, klinik, hingga jasa servis.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-[#425B9A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                2
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Lengkapi Profil & Menu</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Masukkan nama toko, jam operasional, foto produk/layanan, dan nomor WhatsApp admin Anda.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <span className="w-12 h-12 rounded-2xl bg-[#425B9A] text-white font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                3
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Publish & Bagikan Link</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Website Anda langsung aktif online! Bagikan di bio Instagram, TikTok, dan cetak QR stand meja toko Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Call-to-Action Banner ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#2c3d69] via-[#425B9A] to-[#3a639b] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3 relative z-10">
              <img
                src={logoWithTagline}
                alt="Loka - Your Bussines, Online"
                className="h-16 w-auto mx-auto object-contain brightness-0 invert opacity-95"
              />
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-4">
                Siap Meningkatkan Penjualan Bisnis Anda?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
                Bergabunglah dengan ribuan pelaku usaha lokal yang telah memiliki website profesional sendiri.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={handleTryNow}
                className="px-8 py-4 rounded-2xl text-sm font-black bg-white text-[#425B9A] hover:bg-slate-100 shadow-lg active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Try Now — Mulai Buat Website Gratis</span>
                <ArrowRight className="w-4 h-4 text-[#425B9A]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoClean} alt="Loka" className="h-6 w-auto object-contain" />
            <span>&copy; {new Date().getFullYear()} LOKA Platform. Hak Cipta Dilindungi.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button
              type="button"
              onClick={handleLogin}
              className="hover:text-slate-900 transition active:scale-95 cursor-pointer"
            >
              Masuk Merchant
            </button>
            <button
              type="button"
              onClick={handleTryNow}
              className="text-[#425B9A] hover:underline transition active:scale-95 cursor-pointer font-bold"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
