import React, { useState, useEffect, useCallback } from 'react';
import { adminService, AdminModerationWebsite } from '../../services/admin.service';
import { useToast } from '../../context/ToastContext';
import {
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentAdminRole: string;
}

export const AdminModerationTab: React.FC<Props> = ({ currentAdminRole }) => {
  const toast = useToast();
  const [websites, setWebsites] = useState<AdminModerationWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'suspended'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal Suspend State
  const [selectedSiteForSuspend, setSelectedSiteForSuspend] = useState<AdminModerationWebsite | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const loadWebsites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getModerationWebsites();
      setWebsites(data);
    } catch (err) {
      console.error('Fetch moderation websites error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const handleOpenSuspendModal = (site: AdminModerationWebsite) => {
    setSelectedSiteForSuspend(site);
    setSuspendReason(
      'Melanggar ketentuan layanan platform LOKA (Konten tidak pantas, penipuan, atau spam).'
    );
  };

  const handleConfirmSuspend = async () => {
    if (!selectedSiteForSuspend) return;
    try {
      setActionLoading(selectedSiteForSuspend.id);
      await adminService.suspendWebsite(selectedSiteForSuspend.id, suspendReason);
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === selectedSiteForSuspend.id
            ? { ...w, status: 'suspended', suspendReason }
            : w
        )
      );
      toast.suspend(
        `Website "${selectedSiteForSuspend.name}" Berhasil Ditangguhkan`,
        'Akses publik dinonaktifkan secara instan.'
      );
      setSelectedSiteForSuspend(null);
    } catch (err: any) {
      toast.error('Gagal Menangguhkan Website', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsuspend = async (site: AdminModerationWebsite) => {
    if (!window.confirm(`Pulihkan website "${site.name}"? Status akan dikembalikan ke Draft agar pemilik dapat memperbaikinya.`)) {
      return;
    }
    try {
      setActionLoading(site.id);
      await adminService.unsuspendWebsite(site.id);
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === site.id ? { ...w, status: 'draft', suspendReason: null } : w
        )
      );
      toast.success(
        'Penangguhan Dicabut!',
        `Website "${site.name}" berhasil dipulihkan dan dikembalikan ke status Draft.`
      );
    } catch (err: any) {
      toast.error('Gagal Memulihkan Website', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredWebsites = websites.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.slug.toLowerCase().includes(search.toLowerCase()) ||
      w.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      w.ownerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countTotal = websites.length;
  const countLive = websites.filter((w) => w.status === 'published').length;
  const countDraft = websites.filter((w) => w.status === 'draft').length;
  const countSuspended = websites.filter((w) => w.status === 'suspended').length;

  return (
    <div className="space-y-6">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Website</span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{countTotal}</p>
          <span className="text-[10px] text-slate-400">Seluruh website di platform</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Published (Live)</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{countLive}</p>
          <span className="text-[10px] text-emerald-600/80">Dapat diakses publik</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Draft Mode</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{countDraft}</p>
          <span className="text-[10px] text-slate-400">Sedang diedit pemilik</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ditangguhkan</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{countSuspended}</p>
          <span className="text-[10px] text-red-500 font-semibold">Takedown oleh admin</span>
        </div>
      </div>

      {/* ── Table & Filters Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({countTotal})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Live ({countLive})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Draft ({countDraft})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'suspended'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ditangguhkan ({countSuspended})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, slug, atau pemilik..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={loadWebsites}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition shrink-0"
              title="Segarkan daftar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Websites List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Website & URL</th>
                <th className="py-3 px-4">Pemilik (Client)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Seksi & Template</th>
                <th className="py-3 px-4">Statistik Trafik</th>
                <th className="py-3 px-6 text-right">Moderasi & Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Memuat data website...
                  </td>
                </tr>
              ) : filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada website yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredWebsites.map((site) => {
                  const isSuspended = site.status === 'suspended';
                  const isLive = site.status === 'published';

                  return (
                    <tr key={site.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Slug */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-extrabold text-slate-900 block truncate max-w-xs text-sm">
                            {site.name}
                          </span>
                          <a
                            href={`/sites/${site.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-mono mt-0.5"
                          >
                            <span>/sites/{site.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {isSuspended && site.suspendReason && (
                            <p className="text-[10px] text-red-600 bg-red-50 p-1.5 rounded-lg border border-red-100 mt-1 max-w-xs">
                              <strong>Alasan Suspend:</strong> {site.suspendReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-bold text-slate-800 block truncate max-w-[180px]">
                            {site.ownerName}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                            {site.ownerEmail}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <ShieldAlert className="w-3 h-3" />
                            Ditangguhkan
                          </span>
                        ) : isLive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Live Publik
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Draft Mode
                          </span>
                        )}
                      </td>

                      {/* Template & Section Count */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-700 block capitalize">
                          {site.template || 'Custom'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {site.sectionCount} seksi konten
                        </span>
                      </td>

                      {/* Traffic */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-600 font-mono">
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                            <strong>{site.viewsCount}</strong> views
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-mono">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <strong>{site.whatsappClicksCount}</strong> klik WA
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isSuspended ? (
                            <button
                              type="button"
                              onClick={() => handleUnsuspend(site)}
                              disabled={actionLoading === site.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer disabled:opacity-50"
                              title="Cabut penangguhan dan kembalikan ke Draft"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Pulihkan</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenSuspendModal(site)}
                              disabled={actionLoading === site.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer disabled:opacity-50"
                              title="Takedown / Nonaktifkan paksa website ini"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong>{filteredWebsites.length}</strong> website</span>
        </div>
      </div>

      {/* ── Suspend Confirmation Modal ── */}
      {selectedSiteForSuspend && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Takedown / Suspend Website
                </h3>
                <p className="text-xs text-slate-500">
                  Website akan dinonaktifkan dari publik secara instan.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Website:</strong> {selectedSiteForSuspend.name}</p>
              <p><strong>URL:</strong> /sites/{selectedSiteForSuspend.slug}</p>
              <p><strong>Pemilik:</strong> {selectedSiteForSuspend.ownerName} ({selectedSiteForSuspend.ownerEmail})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alasan Penangguhan (Tampil ke Pengunjung & Pemilik)
              </label>
              <textarea
                rows={3}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Tuliskan pelanggaran atau alasan spesifik..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSiteForSuspend(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={actionLoading === selectedSiteForSuspend.id}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {actionLoading === selectedSiteForSuspend.id ? 'Memproses...' : 'Takedown Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
