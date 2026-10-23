import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, Check, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const ImageUploadInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'https://images.unsplash.com/... atau upload file',
  label,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('image', file);

      // Gunakan /api/upload (Vite proxy otomatis redirect ke http://localhost:5000)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Gagal mengunggah file gambar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

      {/* Input Group: Text URL + Upload Button */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full text-[11px] font-mono px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 pr-7"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Hapus gambar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
        />

        {/* Upload Trigger Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border border-slate-200 cursor-pointer disabled:opacity-50"
          title="Upload file gambar langsung dari laptop"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>{uploading ? 'Mengunggah...' : 'Upload'}</span>
        </button>
      </div>

      {uploadError && (
        <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
      )}

      {/* Thumbnail Preview if value exists */}
      {value && (
        <div className="relative group w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-1.5">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <span className="text-[10px] font-semibold text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-xs">
              Foto Aktif
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-md hover:bg-blue-500 transition shadow-xs"
            >
              Ganti File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
