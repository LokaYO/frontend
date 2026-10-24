import React, { useState } from 'react';
import { ContactContent, ThemeConfig } from '../../types/schema';
import { MapPin, Phone, MessageCircle, Mail, Clock, Instagram, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { OperatingStatusBadge } from '../common/OperatingStatusBadge';
import { websiteService } from '../../services/website.service';
import { useViewport } from '../../context/ViewportContext';

interface Props {
  content: ContactContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  slug?: string;
}

export const ContactSection: React.FC<Props> = ({ content, theme, isEditor, slug }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const cleanPhone = content.whatsapp ? content.whatsapp.replace(/\D/g, '') : '';
  const waUrl = `https://wa.me/${cleanPhone}?text=Halo,%20saya%20ingin%20menghubungi%20Anda`;
  const { isMobile, isTablet } = useViewport();

  const gridColsClass = isMobile
    ? 'grid-cols-1'
    : isTablet
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceInterest: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditor) {
      alert('Mode Pratinjau Editor: Formulir kontak berfungsi penuh di halaman web publik pengunjung.');
      return;
    }

    if (!slug) {
      setErrorMessage('Alamat website tidak valid.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Mohon lengkapi nama, nomor telepon/WA, dan pesan Anda.');
      return;
    }

    try {
      setSending(true);
      setErrorMessage('');
      await websiteService.submitPublicLead(slug, formData);
      setSentSuccess(true);
      setFormData({ name: '', phone: '', serviceInterest: '', message: '' });
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      setErrorMessage(err.message || 'Gagal mengirim pesan. Silakan coba kembali.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          {content.badge && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              {content.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Contact Info Cards Grid */}
        <div className={`grid ${gridColsClass} gap-6 max-w-5xl mx-auto mb-14`}>
          {/* Address */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Alamat Lokasi</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {content.address}
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">WhatsApp Resmi</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                {content.whatsapp}
              </p>
              <a
                href={isEditor ? '#!' : waUrl}
                target={isEditor ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline mt-1"
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              >
                Chat WhatsApp Sekarang →
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">Jam Operasional</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {content.operatingHours || 'Buka setiap hari'}
              </p>
              <div>
                <OperatingStatusBadge operatingHours={content.operatingHours} className="mt-1" />
              </div>
            </div>
          </div>

          {/* Phone */}
          {content.phone && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Telepon</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  {content.phone}
                </p>
              </div>
            </div>
          )}

          {/* Email */}
          {content.email && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Email</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal break-all">
                  {content.email}
                </p>
              </div>
            </div>
          )}

          {/* Instagram */}
          {content.instagram && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Instagram</h4>
                <a
                  href={isEditor ? '#!' : `https://instagram.com/${content.instagram.replace('@', '')}`}
                  target={isEditor ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-slate-700 hover:text-slate-900 font-medium underline"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  {content.instagram}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Interactive Leads / Guestbook Form ── */}
        <div className="max-w-2xl mx-auto bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="text-center space-y-1.5 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Kirim Pesan / Konsultasi Langsung
            </h3>
            <p className="text-xs text-slate-500">
              Tinggalkan pesan Anda, kami akan segera merespons ke nomor WhatsApp Anda.
            </p>
          </div>

          {sentSuccess ? (
            <div className="p-6 bg-white rounded-2xl border border-emerald-200 text-center space-y-3 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Pesan Berhasil Terkirim!</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Terima kasih telah menghubungi kami. Pesan Anda telah tersimpan di sistem kami dan akan segera kami tindak lanjuti.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Layanan / Produk yang Diminati (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  placeholder="Contoh: Paket Komplit, Cuci Sepatu, Reservasi..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pesan Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan atau kebutuhan spesifik Anda..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
