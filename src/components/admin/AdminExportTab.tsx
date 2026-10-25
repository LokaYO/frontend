import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { getApiUrl } from '../../services/api.client';
import {
  FileSpreadsheet,
  Download,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

export const AdminExportTab: React.FC = () => {
  const toast = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (endpoint: string, filenameFallback: string, typeKey: string) => {
    try {
      setDownloading(typeKey);
      const res = await fetch(getApiUrl(endpoint), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loka_token') || localStorage.getItem('lokalsite_token') || ''}`,
        },
      });

      if (!res.ok) {
        throw new Error('Gagal mengunduh file laporan');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filenameFallback;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Unduhan Berhasil!', `File ${filenameFallback} siap dibuka di Microsoft Excel.`);
    } catch (err: any) {
      toast.error('Gagal Mengunduh Laporan', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setDownloading(null);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <FileSpreadsheet className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Ekspor Data Laporan (Excel & CSV)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Unduh rekapitulasi data platform dalam format CSV berstandar UTF-8 BOM, siap langsung dibuka secara rapi di Microsoft Excel atau Google Sheets untuk kebutuhan laporan perkuliahan, skripsi, maupun evaluasi bisnis.
        </p>
      </div>

      {/* ── Export Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Users */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Data Pengguna & Klien
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Rekap seluruh akun terdaftar, role akses, status online, riwayat login terakhir, jenis perangkat, dan jumlah website yang dibuat.
              </p>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-700">Kolom Data Termasuk:</p>
              <p className="text-slate-500">ID, Nama, Email, Role, Sesi Online, Total Website, Live Status, IP Address, Waktu Registrasi.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDownload(
                '/api/admin/export/users',
                `laporan-pengguna-loka-${todayStr}.csv`,
                'users'
              )
            }
            disabled={downloading === 'users'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'users' ? 'Mengunduh...' : 'Unduh CSV Pengguna'}</span>
          </button>
        </div>

        {/* Card 2: Websites & Moderation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Data Direktori Website
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Seluruh landing page buatan client, slug URL, template yang dipilih, jumlah section, status publikasi, serta riwayat penangguhan admin.
              </p>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-700">Kolom Data Termasuk:</p>
              <p className="text-slate-500">ID, Nama, Slug, Status (Live/Draft/Suspend), Alasan Suspend, Pemilik, Template, Seksi Konten.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDownload(
                '/api/admin/export/websites',
                `laporan-website-loka-${todayStr}.csv`,
                'websites'
              )
            }
            disabled={downloading === 'websites'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'websites' ? 'Mengunduh...' : 'Unduh CSV Website'}</span>
          </button>
        </div>

        {/* Card 3: Analytics & Traffic */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Laporan Trafik & Analitik
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Metrik kunjungan pengunjung (pageviews), interaksi klik tombol WhatsApp, rasio konversi (CTR %), dan indikator performa penjualan.
              </p>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-700">Kolom Data Termasuk:</p>
              <p className="text-slate-500">Nama Bisnis, Pemilik, URL Publik, Total Kunjungan, Klik WhatsApp, Rasio Konversi (%), Keterangan.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              handleDownload(
                '/api/admin/export/analytics',
                `laporan-analitik-loka-${todayStr}.csv`,
                'analytics'
              )
            }
            disabled={downloading === 'analytics'}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'analytics' ? 'Mengunduh...' : 'Unduh CSV Analitik'}</span>
          </button>
        </div>
      </div>

      {/* ── Excel Compatibility Note ── */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-800">Tips Kompatibilitas Microsoft Excel:</strong>
          <p className="leading-relaxed">
            Semua file CSV yang dihasilkan dari platform LOKA telah disematkan header Byte Order Mark (UTF-8 BOM). Anda dapat langsung mengklik dua kali file CSV untuk membukanya di Microsoft Excel tanpa terjadi masalah karakter acak atau format kolom berantakan.
          </p>
        </div>
      </div>
    </div>
  );
};
