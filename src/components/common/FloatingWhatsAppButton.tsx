import React, { useState } from 'react';
import { MessageCircle, Clock, X, Sparkles } from 'lucide-react';
import { getOperatingStatus } from '../../utils/operatingHours';
import { useViewport } from '../../context/ViewportContext';

interface Props {
  phone: string;
  businessName: string;
  templateMessage?: string;
  slug?: string;
  operatingHours?: string;
  openTime?: string;
  closeTime?: string;
  isEditor?: boolean;
}

export const FloatingWhatsAppButton: React.FC<Props> = ({
  phone,
  businessName,
  templateMessage,
  slug,
  operatingHours,
  openTime,
  closeTime,
  isEditor = false,
}) => {
  const { isMobile } = useViewport();
  const [showTooltip, setShowTooltip] = useState(false);
  const [editorPreviewOpen, setEditorPreviewOpen] = useState(false);
  const status = getOperatingStatus(operatingHours, openTime, closeTime);

  // Clean phone number (e.g. 08123... -> 628123...)
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  }

  // Pre-filled template message
  const defaultText = `Halo ${businessName || 'Admin'}, saya melihat profil website Anda dan ingin menanyakan informasi layanan/produk lebih lanjut.`;
  const textToSend = templateMessage?.trim() || defaultText;
  const whatsappUrl = `https://wa.me/${cleanPhone || '6281234567890'}?text=${encodeURIComponent(textToSend)}`;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditor) {
      e.preventDefault();
      setEditorPreviewOpen(true);
      return;
    }

    // Track analytics event asynchronously
    if (slug) {
      fetch(`/api/public/sites/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'whatsapp_click' }),
      }).catch((err) => console.error('Tracking WA click failed:', err));
    }
  };

  return (
    <div
      className={`${
        isEditor
          ? 'sticky bottom-6 right-6 mr-6 ml-auto w-fit z-30 -mt-20'
          : 'fixed bottom-6 right-6 z-40'
      } flex flex-col items-end select-none pointer-events-auto`}
    >
      {/* Floating Info Tooltip Popup */}
      {showTooltip && (
        <div className="mb-3 p-3.5 bg-white rounded-2xl shadow-lg border border-slate-200 text-slate-800 w-72 transition-all duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-900 truncate">
              {businessName || 'Chat WhatsApp'}
            </span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
              <span className="text-slate-700">{status.statusLabel}</span>
              <span className="text-slate-400 font-normal">&bull; {status.detailLabel}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed italic bg-slate-50 p-2 rounded-xl border border-slate-100">
              &ldquo;{textToSend}&rdquo;
            </p>
          </div>

          <a
            href={isEditor ? '#!' : whatsappUrl}
            target={isEditor ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Mulai Chat Sekarang</span>
          </a>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="flex items-center gap-2.5">
        {/* Status Pill Badge (Hidden on mobile) */}
        {!isMobile && (
          <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-slate-200 text-xs font-semibold text-slate-700">
            <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
            <span>{status.statusLabel}</span>
          </div>
        )}

        <a
          href={isEditor ? '#!' : whatsappUrl}
          target={isEditor ? undefined : '_blank'}
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`${
            isMobile ? 'w-11 h-11' : 'w-13 h-13 sm:w-14 sm:h-14'
          } bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer`}
          title={`Chat WhatsApp ke ${businessName || 'Admin'}`}
        >
          <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
        </a>
      </div>

      {/* Editor WhatsApp Preview Modal */}
      {editorPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
            {/* Header WhatsApp Bar */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight truncate">{businessName || 'Nomor WhatsApp Toko'}</h4>
                  <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    +{cleanPhone || '6281234567890'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditorPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="p-5 bg-[#e5ddd5]/40 space-y-3">
              <span className="text-[10px] text-center block text-slate-400 font-medium">
                Pratinjau Pesan Otomatis (Mode Editor)
              </span>

              <div className="bg-white rounded-2xl rounded-tr-xs p-3.5 shadow-xs border border-slate-100 text-xs text-slate-800 space-y-1 ml-auto max-w-[90%]">
                <p className="leading-relaxed whitespace-pre-wrap">{textToSend}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  <span>12:00</span>
                  <span className="text-emerald-600 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setEditorPreviewOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
