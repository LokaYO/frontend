import React, { useState } from 'react';
import { Website } from '../../types/schema';
import { getPublicSiteUrl } from '../../utils/url.utils';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Save,
  Globe,
  ExternalLink,
  CheckCircle,
  Copy,
  LayoutGrid,
} from 'lucide-react';

interface Props {
  website: Website;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  saving: boolean;
  onSave: () => void;
  onPublishToggle: () => void;
  onBack: () => void;
  onUpdateTitle: (newTitle: string) => void;
  showGrid?: boolean;
  setShowGrid?: (show: boolean) => void;
}

export const EditorTopBar: React.FC<Props> = ({
  website,
  viewport,
  setViewport,
  previewMode,
  setPreviewMode,
  saving,
  onSave,
  onPublishToggle,
  onBack,
  onUpdateTitle,
  showGrid = false,
  setShowGrid,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(website.name);
  const [copied, setCopied] = useState(false);

  const publicUrl = getPublicSiteUrl(website.slug);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== website.name) {
      onUpdateTitle(titleInput.trim());
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Kembali ke Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 truncate">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="text-sm font-bold text-slate-900 px-2 py-1 border border-[#425B9A] rounded-lg outline-none ring-2 ring-[#425B9A]/20"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-1.5 text-sm font-bold text-slate-900 truncate hover:text-[#425B9A] transition"
              title="Klik untuk ubah nama website"
            >
              <span className="truncate">{website.name}</span>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#425B9A] shrink-0" />
            </button>
          )}

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide shrink-0 ${
              website.status === 'published'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {website.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Center: Viewport & Mode Toggle */}
      <div className="hidden md:flex items-center gap-2">
        {/* Viewport switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              viewport === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              viewport === 'tablet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              viewport === 'mobile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        {/* Toggle 12-Column Grid Blueprint */}
        {!previewMode && setShowGrid && (
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              showGrid
                ? 'bg-[#425B9A]/10 border-[#425B9A]/40 text-[#425B9A] shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Tampilkan Panduan Garis Grid 12-Kolom"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#425B9A]" />
            <span className="hidden lg:inline">Grid 12-Kolom</span>
            {showGrid && <span className="w-1.5 h-1.5 rounded-full bg-[#425B9A] animate-pulse" />}
          </button>
        )}

        {/* Edit / Preview Mode */}
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            previewMode
              ? 'bg-[#425B9A]/10 border-[#425B9A]/30 text-[#425B9A]'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {previewMode ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Kembali Edit</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Interaktif</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Save & Publish Action */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs active:scale-95 transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
        </button>

        {website.status === 'published' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={copyPublicUrl}
              className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
              title="Salin Link Publik"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <span>Kunjungi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onPublishToggle}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Unpublish
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onPublishToggle}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#425B9A] hover:bg-[#354a7d] shadow-sm active:scale-95 transition"
          >
            <Globe className="w-3.5 h-3.5 text-[#76C0EC]" />
            <span>Publish Website</span>
          </button>
        )}
      </div>
    </header>
  );
};
