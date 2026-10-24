import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Website } from '../../types/schema';
import { useToast } from '../../context/ToastContext';
import {
  QrCode,
  Printer,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  Store,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import logoClean from '../../assets/Logo Loka (1) (1).png';

interface Props {
  websites: Website[];
  onOpenPublicSite: (slug: string) => void;
}

export const MerchantMarketingView: React.FC<Props> = ({ websites, onOpenPublicSite }) => {
  const toast = useToast();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>(
    websites[0]?.id || ''
  );

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId) || websites[0] || null;

  // Customizer State for Table Stand Card
  const [standTitle, setStandTitle] = useState('');
  const [standSubtitle, setStandSubtitle] = useState('Scan QR untuk Buka Katalog Menu & Layanan');
  const [qrColor, setQrColor] = useState('#0f172a');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const printCardRef = useRef<HTMLDivElement>(null);

  const businessName = selectedWebsite?.businessInfo?.name || selectedWebsite?.name || 'Bisnis Lokal';
  const category = selectedWebsite?.businessInfo?.category || 'Katalog & Layanan';
  const fullUrl = selectedWebsite ? `${window.location.origin}/sites/${selectedWebsite.slug}` : '';

  // Synchronize stand title with selected website
  useEffect(() => {
    if (selectedWebsite) {
      setStandTitle(businessName);
    }
  }, [selectedWebsite?.id, businessName]);

  // Generate QR Code data URL
  useEffect(() => {
    if (!fullUrl) return;

    QRCode.toDataURL(fullUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: qrColor,
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [fullUrl, qrColor]);

  const handleCopyLink = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    toast.success('Link Website Berhasil Disalin!', 'Siap dibagikan ke media sosial atau pelanggan.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl || !selectedWebsite) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_${selectedWebsite.slug}_LokalSite.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code HD Berhasil Diunduh!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `Halo! Kunjungi katalog dan daftar layanan kami secara online di sini: ${fullUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (websites.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-[#425B9A]/10 text-[#425B9A] flex items-center justify-center mx-auto shadow-inner">
          <QrCode className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Belum Ada Website</h3>
          <p className="text-xs text-slate-500">
            Buat website bisnis pertama Anda untuk mendapatkan QR Code otomatis dan kartu stand meja kasir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#425B9A]/10 text-[#425B9A]">
              <QrCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kit Promosi & QR Stand Meja Kasir
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Cetak kartu stand meja akrilik (*tent card*) dan bagikan QR Code resolusi tinggi agar pelanggan fisik dapat langsung mem-bookmark katalog digital toko Anda.
          </p>
        </div>

        {/* Website Selector */}
        {websites.length > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-600">Pilih Website:</label>
            <select
              value={selectedWebsiteId}
              onChange={(e) => setSelectedWebsiteId(e.target.value)}
              className="text-xs font-bold px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A] text-slate-800 cursor-pointer"
            >
              {websites.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.status === 'published' ? 'Live' : 'Draft'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Main 2-Column Workspace: Controls vs Live Stand Meja Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customizer & Sharing Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Customizer Stand Meja */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-[#425B9A]" />
              <h2 className="text-sm font-bold text-slate-900">Kustomisasi Kartu Meja</h2>
            </div>

            {/* Input: Judul Toko */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko / Stand Meja</label>
              <input
                type="text"
                value={standTitle}
                onChange={(e) => setStandTitle(e.target.value)}
                placeholder="Contoh: Kopi Senja - Meja 05"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A] focus:bg-white font-semibold"
              />
            </div>

            {/* Input: Teks Ajakan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Ajakan (Call to Action)</label>
              <input
                type="text"
                value={standSubtitle}
                onChange={(e) => setStandSubtitle(e.target.value)}
                placeholder="Contoh: Scan untuk Lihat Menu & Layanan"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A] focus:bg-white"
              />
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Warna Tinta QR Code</label>
              <div className="flex items-center gap-2.5">
                {[
                  { color: '#0f172a', label: 'Classic Slate' },
                  { color: '#425B9A', label: 'Loka Navy' },
                  { color: '#76C0EC', label: 'Loka Sky' },
                  { color: '#059669', label: 'Emerald' },
                  { color: '#ea580c', label: 'Warm Orange' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setQrColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                      qrColor === c.color ? 'ring-3 ring-[#425B9A]/40 scale-110' : 'hover:scale-105'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-3 bg-[#425B9A] hover:bg-[#354a7d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Stand Meja (Print / PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar QR Code Saja (PNG)</span>
              </button>
            </div>
          </div>

          {/* Card: Link Sharing */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Bagikan Tautan Online</h2>
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="flex-1 min-w-0 bg-transparent text-xs px-2 font-mono text-slate-700 outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#425B9A] hover:bg-[#354a7d] text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Status WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPublicSite(selectedWebsite?.slug || '')}
                className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Buka Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stand Meja Kasir HD Mockup (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="text-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Stand Meja Akrilik (Format A5 / A6)
            </span>
          </div>

          {/* Stand Meja Printable Box */}
          <div
            ref={printCardRef}
            className="w-full max-w-sm bg-white rounded-3xl p-8 border-4 border-slate-900 shadow-2xl space-y-6 text-center select-none relative overflow-hidden transition-all print:border-none print:shadow-none print:max-w-none print:w-full"
          >
            {/* Top Brand Pill Header */}
            <div className="space-y-2">
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-md"
                style={{ backgroundColor: qrColor }}
              >
                {businessName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                  {standTitle || businessName}
                </h3>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                  {category}
                </span>
              </div>
            </div>

            {/* QR Code Graphic Frame */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 inline-block shadow-inner mx-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code ${businessName}`}
                  className="w-56 h-56 mx-auto rounded-xl object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs font-medium">
                  Membuat QR Code...
                </div>
              )}
            </div>

            {/* Instruction Callout */}
            <div className="space-y-1.5 max-w-xs mx-auto">
              <p className="text-xs font-extrabold text-slate-800">
                {standSubtitle || 'Scan QR untuk Membuka Katalog'}
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Buka Kamera Ponsel &bull; Arahkan ke Kode QR &bull; Klik Link Otomatis
              </p>
            </div>

            {/* Card Footer Watermark */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="truncate max-w-[160px]">/sites/{selectedWebsite?.slug}</span>
              <img src={logoClean} alt="Loka" className="h-3.5 w-auto object-contain" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4 max-w-sm">
            💡 <strong>Saran Praktis:</strong> Klik <em>Cetak Stand Meja</em>, pilih ukuran kertas A5 atau A6, cetak menggunakan kertas foto tebal (210–260 gsm), lalu masukkan ke dalam standing akrilik kasir toko Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

