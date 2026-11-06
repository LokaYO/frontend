import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminService, AdminModerationWebsite } from '../../services/admin.service';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { getPublicSiteUrl, getPublicSiteDisplayUrl } from '../../utils/url.utils';
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
  ArrowLeft,
  ChevronRight,
  Store,
  Crown,
  Layers,
  Building2,
} from 'lucide-react';

interface Props {
  currentAdminRole: string;
}

export interface MerchantGroup {
  userId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPlan?: 'free' | 'pro';
  websites: AdminModerationWebsite[];
  totalWebsites: number;
  publishedCount: number;
  draftCount: number;
  suspendedCount: number;
  totalViews: number;
  totalWhatsAppClicks: number;
  latestUpdatedAt: string;
}

export const AdminModerationTab: React.FC<Props> = ({ currentAdminRole }) => {
  const toast = useToast();
  const [websites, setWebsites] = useState<AdminModerationWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [siteToUnsuspend, setSiteToUnsuspend] = useState<AdminModerationWebsite | null>(null);
  const [isUnsuspending, setIsUnsuspending] = useState(false);

  // Merchant Selection State
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  // Filters for Merchant List
  const [merchantSearch, setMerchantSearch] = useState('');
  const [merchantFilter, setMerchantFilter] = useState<'all' | 'suspended' | 'live' | 'draft'>('all');

  // Filters for Website List (inside selected merchant)
  const [siteSearch, setSiteSearch] = useState('');
  const [siteStatusFilter, setSiteStatusFilter] = useState<'all' | 'published' | 'draft' | 'suspended'>('all');

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

  // Group websites by Merchant (userId)
  const merchants = useMemo<MerchantGroup[]>(() => {
    const map = new Map<string, MerchantGroup>();

    for (const site of websites) {
      const existing = map.get(site.userId);
      if (!existing) {
        map.set(site.userId, {
          userId: site.userId,
          ownerName: site.ownerName || 'Merchant',
          ownerEmail: site.ownerEmail,
          ownerPlan: site.ownerPlan,
          websites: [site],
          totalWebsites: 1,
          publishedCount: site.status === 'published' ? 1 : 0,
          draftCount: site.status === 'draft' ? 1 : 0,
          suspendedCount: site.status === 'suspended' ? 1 : 0,
          totalViews: site.viewsCount || 0,
          totalWhatsAppClicks: site.whatsappClicksCount || 0,
          latestUpdatedAt: site.updatedAt,
        });
      } else {
        existing.websites.push(site);
        existing.totalWebsites += 1;
        if (site.status === 'published') existing.publishedCount += 1;
        if (site.status === 'draft') existing.draftCount += 1;
        if (site.status === 'suspended') existing.suspendedCount += 1;
        existing.totalViews += site.viewsCount || 0;
        existing.totalWhatsAppClicks += site.whatsappClicksCount || 0;
        if (new Date(site.updatedAt) > new Date(existing.latestUpdatedAt)) {
          existing.latestUpdatedAt = site.updatedAt;
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      // Prioritize merchants that have suspended websites, then by latest activity
      if (a.suspendedCount > 0 && b.suspendedCount === 0) return -1;
      if (b.suspendedCount > 0 && a.suspendedCount === 0) return 1;
      return new Date(b.latestUpdatedAt).getTime() - new Date(a.latestUpdatedAt).getTime();
    });
  }, [websites]);

  const selectedMerchant = useMemo(() => {
    if (!selectedMerchantId) return null;
    return merchants.find((m) => m.userId === selectedMerchantId) || null;
  }, [merchants, selectedMerchantId]);

  // Global Platform Metrics
  const countTotalWebsites = websites.length;
  const countLiveWebsites = websites.filter((w) => w.status === 'published').length;
  const countDraftWebsites = websites.filter((w) => w.status === 'draft').length;
  const countSuspendedWebsites = websites.filter((w) => w.status === 'suspended').length;
  const countMerchantsWithSuspended = merchants.filter((m) => m.suspendedCount > 0).length;

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

  const handleUnsuspend = (site: AdminModerationWebsite) => {
    setSiteToUnsuspend(site);
  };

  const confirmUnsuspend = async () => {
    if (!siteToUnsuspend) return;
    const site = siteToUnsuspend;
    try {
      setIsUnsuspending(true);
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
      setSiteToUnsuspend(null);
    } catch (err: any) {
      toast.error('Gagal Memulihkan Website', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsUnsuspending(false);
    }
  };

  // Filtered Merchants List
  const filteredMerchants = useMemo(() => {
    const q = merchantSearch.toLowerCase().trim();
    return merchants.filter((m) => {
      const matchSearch =
        !q ||
        m.ownerName.toLowerCase().includes(q) ||
        m.ownerEmail.toLowerCase().includes(q) ||
        m.websites.some(
          (w) =>
            w.name.toLowerCase().includes(q) || w.slug.toLowerCase().includes(q)
        );

      let matchFilter = true;
      if (merchantFilter === 'suspended') matchFilter = m.suspendedCount > 0;
      if (merchantFilter === 'live') matchFilter = m.publishedCount > 0 && m.suspendedCount === 0;
      if (merchantFilter === 'draft') matchFilter = m.draftCount > 0;

      return matchSearch && matchFilter;
    });
  }, [merchants, merchantSearch, merchantFilter]);

  // Filtered Websites for Selected Merchant
  const filteredMerchantWebsites = useMemo(() => {
    if (!selectedMerchant) return [];
    const q = siteSearch.toLowerCase().trim();
    return selectedMerchant.websites.filter((w) => {
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.slug.toLowerCase().includes(q) ||
        (w.template && w.template.toLowerCase().includes(q));

      const matchStatus =
        siteStatusFilter === 'all' || w.status === siteStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [selectedMerchant, siteSearch, siteStatusFilter]);

  return (
    <div className="space-y-6">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Merchant</span>
            <span className="p-2 rounded-xl bg-[#425B9A]/10 text-[#425B9A]">
              <Store className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{merchants.length}</p>
          <span className="text-[10px] text-slate-400">Pemilik usaha lokal di platform</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Website</span>
            <span className="p-2 rounded-xl bg-[#76C0EC]/20 text-[#425B9A]">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{countTotalWebsites}</p>
          <span className="text-[10px] text-slate-400">
            {countLiveWebsites} Live &bull; {countDraftWebsites} Draft
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Website Live</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{countLiveWebsites}</p>
          <span className="text-[10px] text-emerald-600/80">Aktif dapat diakses publik</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ditangguhkan</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-black text-red-600">{countSuspendedWebsites}</p>
            {countSuspendedWebsites > 0 && (
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {countMerchantsWithSuspended} merchant
              </span>
            )}
          </div>
          <span className="text-[10px] text-red-500 font-semibold">Takedown oleh administrator</span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 1: DAFTAR MERCHANT (Per Merchant View)                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {!selectedMerchantId && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setMerchantFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  merchantFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Merchant ({merchants.length})
              </button>
              <button
                type="button"
                onClick={() => setMerchantFilter('suspended')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  merchantFilter === 'suspended'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ada Ditangguhkan ({countMerchantsWithSuspended})
              </button>
              <button
                type="button"
                onClick={() => setMerchantFilter('live')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  merchantFilter === 'live'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Live ({merchants.filter((m) => m.publishedCount > 0 && m.suspendedCount === 0).length})
              </button>
              <button
                type="button"
                onClick={() => setMerchantFilter('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  merchantFilter === 'draft'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ada Draft ({merchants.filter((m) => m.draftCount > 0).length})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={merchantSearch}
                  onChange={(e) => setMerchantSearch(e.target.value)}
                  placeholder="Cari merchant, email, atau nama website..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A] focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={loadWebsites}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition shrink-0 cursor-pointer"
                title="Segarkan data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Merchant Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Merchant / Pemilik</th>
                  <th className="py-3 px-4">Jumlah Website</th>
                  <th className="py-3 px-4">Status Moderasi</th>
                  <th className="py-3 px-4">Akumulasi Trafik</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="w-8 h-8 border-3 border-[#425B9A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Memuat daftar merchant...
                    </td>
                  </tr>
                ) : filteredMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Tidak ada merchant yang sesuai dengan pencarian atau filter.
                    </td>
                  </tr>
                ) : (
                  filteredMerchants.map((merchant) => {
                    const hasSuspended = merchant.suspendedCount > 0;

                    return (
                      <tr
                        key={merchant.userId}
                        onClick={() => setSelectedMerchantId(merchant.userId)}
                        className={`hover:bg-[#425B9A]/5 transition cursor-pointer ${
                          hasSuspended ? 'bg-red-50/20' : ''
                        }`}
                      >
                        {/* Merchant Profile */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#425B9A] to-[#76C0EC] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                              {merchant.ownerName?.charAt(0)?.toUpperCase() || 'M'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-sm truncate max-w-xs block">
                                  {merchant.ownerName}
                                </span>
                                {merchant.ownerPlan === 'pro' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs">
                                    <Crown className="w-2.5 h-2.5 fill-current" />
                                    PRO
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 truncate block font-mono mt-0.5">
                                {merchant.ownerEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Total Websites with Sub-breakdown */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Layers className="w-3.5 h-3.5 text-[#425B9A]" />
                              <span>{merchant.totalWebsites} Website</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-semibold flex-wrap">
                              {merchant.publishedCount > 0 && (
                                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                  {merchant.publishedCount} Live
                                </span>
                              )}
                              {merchant.draftCount > 0 && (
                                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                                  {merchant.draftCount} Draft
                                </span>
                              )}
                              {merchant.suspendedCount > 0 && (
                                <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200 font-bold">
                                  {merchant.suspendedCount} Ditangguhkan
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Moderation Status */}
                        <td className="py-4 px-4">
                          {hasSuspended ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>{merchant.suspendedCount} Perlu Ditinjau</span>
                            </span>
                          ) : merchant.publishedCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Semua Aman (Live)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Draft Mode</span>
                            </span>
                          )}
                        </td>

                        {/* Traffic Overview */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5 text-[11px]">
                            <span className="flex items-center gap-1.5 text-slate-600 font-mono">
                              <Eye className="w-3.5 h-3.5 text-[#425B9A]" />
                              <strong>{merchant.totalViews.toLocaleString()}</strong> views
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-700 font-mono">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <strong>{merchant.totalWhatsAppClicks.toLocaleString()}</strong> klik WA
                            </span>
                          </div>
                        </td>

                        {/* Action Button */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMerchantId(merchant.userId);
                            }}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#425B9A]/10 hover:bg-[#425B9A]/20 text-[#425B9A] border border-[#425B9A]/20 transition cursor-pointer shadow-2xs"
                          >
                            <span>Kelola Website ({merchant.totalWebsites})</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
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
            <span>
              Menampilkan <strong>{filteredMerchants.length}</strong> merchant
            </span>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 2: DAFTAR WEBSITE KHUSUS MERCHANT YANG DIPILIH                        */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {selectedMerchant && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
          {/* Top Bar Navigation (Back Button & Breadcrumb) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedMerchantId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar Merchant</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span>Moderasi Website</span>
                <span>/</span>
                <span className="text-[#425B9A] font-bold">{selectedMerchant.ownerName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Total Website Merchant:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#425B9A]/15 text-[#425B9A] text-xs font-bold">
                {selectedMerchant.totalWebsites} Website
              </span>
            </div>
          </div>

          {/* Selected Merchant Detail Card */}
          <div className="bg-gradient-to-r from-[#2c3d69] via-[#425B9A] to-[#3a639b] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                  {selectedMerchant.ownerName?.charAt(0)?.toUpperCase() || 'M'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-extrabold tracking-tight">
                      {selectedMerchant.ownerName}
                    </h2>
                    {selectedMerchant.ownerPlan === 'pro' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 shadow-xs">
                        <Crown className="w-3 h-3 fill-current" />
                        PRO PLAN MERCHANT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white/90">
                        FREE PLAN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 font-mono">
                    {selectedMerchant.ownerEmail}
                  </p>
                </div>
              </div>

              {/* Status Breakdown Counters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-200 block">Live Publik</span>
                  <span className="text-lg font-black text-emerald-300">{selectedMerchant.publishedCount}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-200 block">Draft</span>
                  <span className="text-lg font-black text-amber-300">{selectedMerchant.draftCount}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-200 block">Ditangguhkan</span>
                  <span className={`text-lg font-black ${selectedMerchant.suspendedCount > 0 ? 'text-red-300' : 'text-slate-300'}`}>
                    {selectedMerchant.suspendedCount}
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-200 block">Total Trafik</span>
                  <span className="text-lg font-black text-white">{selectedMerchant.totalViews} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Websites belonging to this Merchant */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter controls */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSiteStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    siteStatusFilter === 'all'
                      ? 'bg-[#425B9A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Website ({selectedMerchant.totalWebsites})
                </button>
                <button
                  type="button"
                  onClick={() => setSiteStatusFilter('published')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    siteStatusFilter === 'published'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Live ({selectedMerchant.publishedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSiteStatusFilter('draft')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    siteStatusFilter === 'draft'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Draft ({selectedMerchant.draftCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSiteStatusFilter('suspended')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    siteStatusFilter === 'suspended'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ditangguhkan ({selectedMerchant.suspendedCount})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={siteSearch}
                    onChange={(e) => setSiteSearch(e.target.value)}
                    placeholder="Cari website merchant ini..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Websites Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Nama Website & URL</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Seksi & Template</th>
                    <th className="py-3 px-4">Statistik Trafik</th>
                    <th className="py-3 px-6 text-right">Moderasi & Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMerchantWebsites.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Tidak ada website yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMerchantWebsites.map((site) => {
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
                                href={getPublicSiteUrl(site.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-[#425B9A] hover:underline inline-flex items-center gap-1 font-mono mt-0.5"
                              >
                                <span>/sites/{site.slug}</span>
                                <span>{getPublicSiteDisplayUrl(site.slug)}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              {isSuspended && site.suspendReason && (
                                <p className="text-[10px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200 mt-1.5 max-w-sm">
                                  <strong>Alasan Suspend:</strong> {site.suspendReason}
                                </p>
                              )}
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
                              {/* Public Site Preview */}
                              <a
                                href={`/sites/${site.slug}`}
                                href={getPublicSiteUrl(site.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                title="Buka website publik di tab baru"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Kunjungi</span>
                              </a>

                              {/* Suspend / Unsuspend Actions */}
                              {isSuspended ? (
                                <button
                                  type="button"
                                  onClick={() => handleUnsuspend(site)}
                                  disabled={actionLoading === site.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer disabled:opacity-50"
                                  title="Batalkan penangguhan dan pulihkan ke status Draft"
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
              <span>
                Menampilkan <strong>{filteredMerchantWebsites.length}</strong> website milik merchant ini
              </span>
            </div>
          </div>
        </div>
      )}

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
              <p>
                <strong>Website:</strong> {selectedSiteForSuspend.name}
              </p>
              <p>
                <strong>URL:</strong> /sites/{selectedSiteForSuspend.slug}
                <strong>URL:</strong> {getPublicSiteDisplayUrl(selectedSiteForSuspend.slug)}
              </p>
              <p>
                <strong>Pemilik:</strong> {selectedSiteForSuspend.ownerName} ({selectedSiteForSuspend.ownerEmail})
              </p>
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

      {/* Unsuspend Confirmation Modal */}
      <ConfirmModal
        isOpen={!!siteToUnsuspend}
        title="Pulihkan Website yang Ditangguhkan?"
        message={
          siteToUnsuspend ? (
            <span>
              Yakin ingin mencabut status penangguhan website <strong className="text-slate-800">"{siteToUnsuspend.name}"</strong>? Status website akan dikembalikan ke <strong>Draft</strong> agar pemilik usaha dapat mengedit dan mempublikasikannya kembali.
            </span>
          ) : ''
        }
        confirmText="Ya, Pulihkan ke Draft"
        cancelText="Batal"
        variant="warning"
        loading={isUnsuspending}
        onConfirm={confirmUnsuspend}
        onClose={() => setSiteToUnsuspend(null)}
      />
    </div>
  );
};
