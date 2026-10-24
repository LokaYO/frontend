import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Globe,
  Sparkles,
  QrCode,
  Smartphone,
  Store,
} from 'lucide-react';
import { Website } from '../../types/schema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  website: Website | null;
}

export const QrCodeModal: React.FC<Props> = ({ isOpen, onClose, website }) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const businessName = website?.businessInfo?.name || website?.name || 'Bisnis Lokal';
  const category = website?.businessInfo?.category || 'Katalog & Layanan';
  const fullUrl = website
    ? `${window.location.origin}/sites/${website.slug}`
    : '';

  useEffect(() => {
    if (!isOpen || !fullUrl) return;

    QRCode.toDataURL(fullUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [isOpen, fullUrl]);

  if (!isOpen || !website) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `QR-Stand-${website.slug}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!website || !dataUrl) return;

    let iframe = document.getElementById('loka-print-frame') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'loka-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stand Meja QR - ${businessName}</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
            @page {
              size: A5 portrait;
              margin: 1cm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .card {
              width: 100%;
              max-width: 370px;
              background: #ffffff;
              border: 3.5px solid #0f172a;
              border-radius: 28px;
              padding: 32px 28px;
              text-align: center;
              margin: 0 auto;
            }
            .avatar {
              width: 50px;
              height: 50px;
              border-radius: 16px;
              margin: 0 auto 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 22px;
              font-weight: 900;
              background-color: #425B9A;
            }
            .title {
              font-size: 20px;
              font-weight: 900;
              color: #0f172a;
              line-height: 1.25;
              margin-bottom: 4px;
            }
            .category {
              font-size: 10px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-bottom: 20px;
            }
            .qr-wrapper {
              background: #f8fafc;
              border: 2px dashed #cbd5e1;
              border-radius: 20px;
              padding: 16px;
              display: inline-block;
              margin: 0 auto 18px;
            }
            .qr-img {
              width: 210px;
              height: 210px;
              display: block;
              margin: 0 auto;
              border-radius: 12px;
            }
            .cta-title {
              font-size: 13px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .cta-sub {
              font-size: 10px;
              color: #64748b;
              margin-bottom: 22px;
              line-height: 1.4;
            }
            .footer {
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 10px;
              font-family: monospace;
              color: #94a3b8;
            }
            .logo-text {
              font-family: 'Inter', sans-serif;
              font-weight: 900;
              color: #425B9A;
              font-size: 14px;
              letter-spacing: -0.5px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="avatar">${businessName.charAt(0).toUpperCase()}</div>
            <div class="title">${businessName}</div>
            <div class="category">${category}</div>
            
            <div class="qr-wrapper">
              <img class="qr-img" src="${dataUrl}" alt="QR Code" />
            </div>

            <div class="cta-title">Scan QR untuk Buka Katalog Menu & Layanan</div>
            <div class="cta-sub">Buka Kamera Ponsel &bull; Arahkan ke Kode QR &bull; Buka Katalog Online</div>

            <div class="footer">
              <span>/sites/${website?.slug}</span>
              <span class="logo-text">Loka</span>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(printHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">QR Code Meja Kasir / Brosur</h3>
              <p className="text-[11px] text-slate-500">Siap cetak untuk dipajang di kasir atau etalase toko</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Stand Card Preview */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center bg-slate-100/60">
          {/* Printable Stand Card Container */}
          <div
            ref={printRef}
            id="printable-qr-stand"
            className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 text-center flex flex-col items-center space-y-4 relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Menu & Katalog Digital</span>
            </div>

            {/* Business Brand */}
            <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                {businessName}
              </h2>
              <p className="text-xs text-slate-500 font-medium capitalize">
                {category}
              </p>
            </div>

            {/* QR Frame */}
            <div className="p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl shadow-inner relative group">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt={`QR Code ${businessName}`}
                  className="w-48 h-48 rounded-xl object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Scan dengan Kamera HP</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug px-2">
                Buka menu, daftar harga lengkap, dan promo terbaru langsung di ponsel Anda.
              </p>
            </div>

            {/* URL Footer */}
            <div className="pt-3 border-t border-slate-100 w-full">
              <p className="text-[10px] font-mono font-semibold text-slate-400 truncate">
                {fullUrl.replace(/^https?:\/\//, '')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPNG}
              className="px-3.5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Stand Meja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

