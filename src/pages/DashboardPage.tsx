import React, { useState, useEffect, useCallback } from 'react';
import { Website } from '../types/schema';
import { useAuth } from '../context/AuthContext';
import { websiteService } from '../services/website.service';
import { CreateWebsiteModal } from '../components/modals/CreateWebsiteModal';
import { PRESET_TEMPLATES } from '../templates/presetTemplates';
import {
  Plus,
  Globe,
  Edit3,
  ExternalLink,
  Trash2,
  Copy,
  CheckCircle,
  LayoutDashboard,
  Layers,
  LayoutTemplate,
  Settings,
  LogOut,
  Search,
  Sparkles,
  Calendar,
  Eye,
  AlertTriangle,
  ShieldCheck,
  MessageCircle,
  TrendingUp,
  QrCode,
  Inbox,
  Megaphone,
  X,
  ShieldAlert,
  Crown,
} from 'lucide-react';
import { AdminMonitoringPanel } from '../components/admin/AdminMonitoringPanel';
import { QrCodeModal } from '../components/common/QrCodeModal';
import { LeadsModal } from '../components/common/LeadsModal';
import { PricingModal } from '../components/modals/PricingModal';
import { adminService, AdminAnnouncement } from '../services/admin.service';
import { useToast } from '../context/ToastContext';

interface Props {
  onOpenEditor: (websiteId: string) => void;
  onOpenPublicSite: (slug: string) => void;
  initialNav?: 'websites' | 'templates' | 'settings' | 'admin';
}

export const DashboardPage: React.FC<Props> = ({ onOpenEditor, onOpenPublicSite, initialNav }) => {
  const { user, token, logout } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin' || user?.role === 'support';
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState<'websites' | 'templates' | 'settings' | 'admin'>(
    isAdmin ? 'admin' : (initialNav || 'websites')
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedQrSite, setSelectedQrSite] = useState<Website | null>(null);
  const [selectedLeadsSite, setSelectedLeadsSite] = useState<Website | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('loka_dismissed_announcements') || '[]');
    } catch {
      return [];
    }
  });

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncements((prev) => {
      const updated = [...prev, id];
      sessionStorage.setItem('loka_dismissed_announcements', JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch active system announcements for clients
  useEffect(() => {
    if (!isAdmin) {
      adminService.getActiveAnnouncements()
        .then((data) => setAnnouncements(data))
        .catch(() => {});
    }
  }, [isAdmin]);

  // Fetch all websites belonging to user (Khusus role 'user', admin tidak punya website pribadi)
  const fetchWebsites = useCallback(async () => {
    if (!token || isAdmin) return;
    try {
      setLoading(true);
      const data = await websiteService.getWebsites();
      setWebsites(data);
    } catch (err) {
      console.error('Fetch websites error:', err);
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  // Toggle publish / unpublish
  const handleTogglePublish = async (website: Website) => {
    if (!token) return;

    if (website.status === 'suspended') {
      toast.suspend(
        `Website "${website.name}" Ditangguhkan`,
        `Alasan: ${website.suspendReason || 'Pelanggaran ketentuan layanan platform'}. Silakan hubungi tim administrator untuk proses pemulihan.`
      );
      return;
    }

    const isPublished = website.status === 'published';

    try {
      if (isPublished) {
        await websiteService.unpublishWebsite(website.id);
        toast.info(
          'Website Diubah ke Draft',
          `"${website.name}" dinonaktifkan sementara dan tidak dapat diakses publik.`
        );
      } else {
        await websiteService.publishWebsite(website.id);
        toast.success(
          'Website Berhasil Dipublikasikan!',
          `"${website.name}" kini live dan dapat diakses publik.`
        );
      }
      fetchWebsites();
    } catch (err: any) {
      console.error('Toggle publish error:', err);
      toast.error('Gagal Mengubah Status', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  // Delete website
  const handleDeleteWebsite = async (websiteId: string, websiteName: string) => {
    if (!token) return;
    if (!window.confirm(`Yakin ingin menghapus website "${websiteName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      await websiteService.deleteWebsite(websiteId);
      setWebsites((prev) => prev.filter((w) => w.id !== websiteId));
      toast.info('Website Dihapus', `"${websiteName}" telah dihapus secara permanen.`);
    } catch (err: any) {
      console.error('Delete website error:', err);
      toast.error('Gagal Menghapus Website', err.message || 'Terjadi kesalahan saat menghapus.');
    }
  };

  // Duplicate website
  const handleDuplicateWebsite = async (id: string) => {
    try {
      setDuplicatingId(id);
      const res = await websiteService.duplicateWebsite(id);
      await fetchWebsites();
      toast.success(
        'Website Berhasil Diduplikasi!',
        `Salinan baru "${res.name || 'Website Copy'}" siap dikustomisasi.`
      );
    } catch (err: any) {
      toast.error('Gagal Menduplikasi', err.message || 'Terjadi kendala saat kloning website.');
    } finally {
      setDuplicatingId(null);
    }
  };

  const copyPublicLink = (slug: string) => {
    const url = `${window.location.origin}/sites/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success('Tautan Tersalin!', 'Alamat link landing page berhasil disalin ke clipboard.');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredWebsites = websites.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.businessInfo?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 h-screen max-h-screen w-screen overflow-hidden bg-slate-50 flex">
      {/* SaaS Sidebar (Fixed & Pinned for Both Admin and Client) */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 z-30 select-none">
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div
            className={`w-8 h-8 rounded-xl ${
              isAdmin ? 'bg-purple-600' : 'bg-blue-600'
            } flex items-center justify-center text-white font-bold shadow-xs`}
          >
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : 'L'}
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              {isAdmin ? 'LokalSite Admin' : 'LokalSite'}
            </span>
            <span
              className={`text-[10px] ${
                isAdmin ? 'text-purple-600' : 'text-blue-600'
              } font-semibold block leading-none`}
            >
              {isAdmin ? 'Monitoring Portal' : 'SaaS Builder'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1 min-h-0 overflow-y-auto">
          {isAdmin ? (
            /* ADMIN ONLY NAVIGATION - PURELY MONITORING */
            <>
              <button
                type="button"
                onClick={() => setActiveNav('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'admin'
                    ? 'bg-purple-50 text-purple-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Monitoring Client</span>
                <span className="ml-auto text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md uppercase font-bold">
                  {user.role}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'settings'
                    ? 'bg-purple-50 text-purple-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Pengaturan Akun</span>
              </button>
            </>
          ) : (
            /* REGULAR CLIENT NAVIGATION */
            <>
              <button
                type="button"
                onClick={() => setActiveNav('websites')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'websites'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Website Saya</span>
                <span className="ml-auto text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                  {websites.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('templates')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'templates'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                <span>Galeri Template</span>
                <span className="ml-auto text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  5
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNav === 'settings'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Pengaturan Akun</span>
              </button>
            </>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Blackiee'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area (Independent Scroll Container) */}
      <div className="flex-1 h-full min-h-0 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Fixed at Top */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg ${
                  isAdmin ? 'bg-purple-600' : 'bg-blue-600'
                } flex items-center justify-center text-white font-bold text-xs`}
              >
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : 'L'}
              </div>
              <span className="font-bold text-sm text-slate-900">
                {isAdmin ? 'LokalSite Admin' : 'LokalSite'}
              </span>
            </div>
            <div className="hidden md:block">
              <h2 className="text-sm font-bold text-slate-900">
                {isAdmin
                  ? activeNav === 'settings'
                    ? 'Pengaturan Akun'
                    : 'Monitoring Pengguna & Client'
                  : activeNav === 'websites'
                  ? 'Kelola Website'
                  : activeNav === 'templates'
                  ? 'Galeri Template Siap Pakai'
                  : 'Pengaturan Akun'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PRO BADGE / UPGRADE BUTTON */}
            {!isAdmin && (
              user?.plan === 'pro' ? (
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  title="Klik untuk melihat status langganan & seluruh benefit PRO Anda"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>PRO PLAN</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>⭐ Upgrade ke Pro</span>
                </button>
              )
            )}

            {/* ONLY REGULAR CLIENTS CAN CREATE WEBSITES */}
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Website</span>
              </button>
            )}
          </div>
        </header>

        {/* Body Content (Only this scrolls smoothly) */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 scroll-smooth">
          {/* TAB 1: WEBSITES (CLIENT ONLY) */}
          {!isAdmin && activeNav === 'websites' && (
            <div className="space-y-6">
              {/* Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Halo, {user?.name || 'Blackiee'} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Buat dan kelola landing page bisnis lokal Anda agar calon pelanggan mudah menghubungi Anda lewat WhatsApp.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari website..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* ── Broadcast Pengumuman Sistem Banner ── */}
              {announcements.filter((a) => !dismissedAnnouncements.includes(a.id)).map((ann) => {
                const typeStyle = {
                  info: 'bg-blue-50/90 border-blue-200 text-blue-900',
                  warning: 'bg-amber-50/90 border-amber-200 text-amber-900',
                  alert: 'bg-red-50/90 border-red-200 text-red-900',
                  success: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
                }[ann.type] || 'bg-blue-50/90 border-blue-200 text-blue-900';

                const badgeBg = {
                  info: 'bg-blue-600 text-white',
                  warning: 'bg-amber-600 text-white',
                  alert: 'bg-red-600 text-white',
                  success: 'bg-emerald-600 text-white',
                }[ann.type] || 'bg-blue-600 text-white';

                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border ${typeStyle} shadow-xs flex items-start justify-between gap-4 transition-all`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="p-2 rounded-xl bg-white/80 shadow-2xs shrink-0 mt-0.5">
                        <Megaphone className="w-4 h-4 text-slate-700" />
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${badgeBg}`}>
                            {ann.type === 'alert' ? 'PENTING' : ann.type === 'warning' ? 'PERHATIAN' : 'PENGUMUMAN'}
                          </span>
                          <h4 className="text-xs font-bold truncate">{ann.title}</h4>
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed">{ann.message}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissAnnouncement(ann.id)}
                      className="p-1.5 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition shrink-0"
                      title="Tutup pengumuman"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Analytics Summary Banner */}
              {!loading && websites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total Pengunjung</p>
                      <h4 className="text-xl font-extrabold text-slate-900">
                        {websites.reduce((acc, w) => acc + (w.viewsCount || 0), 0)}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Klik WhatsApp (Leads)</p>
                      <h4 className="text-xl font-extrabold text-emerald-700">
                        {websites.reduce((acc, w) => acc + (w.whatsappClicksCount || 0), 0)}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Rata-rata Konversi</p>
                      <h4 className="text-xl font-extrabold text-indigo-700">
                        {(() => {
                          const totalViews = websites.reduce((acc, w) => acc + (w.viewsCount || 0), 0);
                          const totalClicks = websites.reduce((acc, w) => acc + (w.whatsappClicksCount || 0), 0);
                          return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) + '%' : '0%';
                        })()}
                      </h4>
                    </div>
                  </div>
                </div>
              )}

              {/* Website Cards Grid */}
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Memuat daftar website...</p>
                </div>
              ) : filteredWebsites.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Belum Ada Website yang Dibuat</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Mulai buat landing page pertama Anda sekarang dengan bantuan AI atau pilih template bisnis lokal siap pakai.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Website Pertama Saya</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWebsites.map((site) => {
                    const isPublished = site.status === 'published';
                    const publicUrl = `${window.location.origin}/sites/${site.slug}`;

                    return (
                      <div
                        key={site.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Card Top Preview Header */}
                        <div
                          className="h-32 p-4 flex flex-col justify-between relative overflow-hidden"
                          style={{
                            backgroundColor: site.theme?.backgroundColor || '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          <div className="flex items-center justify-between z-10">
                            {site.status === 'suspended' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs bg-red-600 text-white flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                Ditangguhkan
                              </span>
                            ) : (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${
                                  isPublished
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-400 text-slate-900'
                                }`}
                              >
                                {isPublished ? '● Published' : '○ Draft'}
                              </span>
                            )}

                            <span className="text-[10px] text-slate-500 font-semibold bg-white/90 px-2 py-0.5 rounded-md shadow-2xs">
                              {site.businessInfo?.category || 'Bisnis Lokal'}
                            </span>
                          </div>

                          <div className="z-10">
                            <h3 className="font-extrabold text-base text-slate-900 truncate">
                              {site.name}
                            </h3>
                            <p className="text-[11px] font-mono text-slate-500 truncate">
                              /sites/{site.slug}
                            </p>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3 flex-1">
                          <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {site.businessInfo?.description || 'Landing page bisnis lokal dengan navigasi, penawaran menarik, dan tautan WhatsApp resmi.'}
                          </div>

                          {/* Analytics Counter Chips */}
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                            <div className="flex items-center gap-1.5 text-slate-600" title="Total Pengunjung">
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              <span>{site.viewsCount || 0} Pengunjung</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold" title="Total Calon Pelanggan Klik WhatsApp">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{site.whatsappClicksCount || 0} Klik WA</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                            <span>Lokasi: {site.businessInfo?.location || 'Indonesia'}</span>
                            <span>{site.sections?.length || 0} Section</span>
                          </div>

                          {/* Quick Tools Row: QR Stand, Leads Inbox, Duplicate */}
                          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setSelectedQrSite(site)}
                              className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/90 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Cetak Stand Meja QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5 text-blue-600" />
                              <span>QR Meja</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedLeadsSite(site)}
                              className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/90 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Lihat Pesan Masuk / Buku Tamu"
                            >
                              <Inbox className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Pesan</span>
                            </button>

                            <button
                              type="button"
                              disabled={duplicatingId === site.id}
                              onClick={() => handleDuplicateWebsite(site.id)}
                              className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/90 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                              title="Duplikasi Website Ini (1-Click Clone)"
                            >
                              <Copy className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{duplicatingId === site.id ? '...' : 'Duplikat'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEditor(site.id)}
                            className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit</span>
                          </button>

                          {isPublished ? (
                            <>
                              <button
                                type="button"
                                onClick={() => copyPublicLink(site.slug)}
                                className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition"
                                title="Salin URL Publik"
                              >
                                {copiedSlug === site.slug ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <a
                                href={`/sites/${site.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl transition"
                                title="Buka Halaman Publik"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(site)}
                              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Publish</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteWebsite(site.id, site.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Hapus website"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEMPLATES GALLERY (CLIENT ONLY) */}
          {!isAdmin && activeNav === 'templates' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Galeri Template Bisnis Lokal
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pilih salah satu template di bawah untuk langsung membuat landing page siap pakai dengan struktur profesional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRESET_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={tpl.previewImage}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-sm">
                          {tpl.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2 flex-1">
                      <h3 className="font-bold text-base text-slate-900">{tpl.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">{tpl.description}</p>
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          WhatsApp Order
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          Mobile Responsive
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          9 Sections
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateModalOpen(true);
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Gunakan Template Ini
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeNav === 'settings' && (
            <div className="max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                {isAdmin ? 'Pengaturan Akun Administrator' : 'Profil & Pengaturan Akun'}
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Alamat Email</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tingkatan Akses (Role)</label>
                  <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 font-bold uppercase text-[11px] inline-block">
                    {user?.role}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Keluar dari sesi saat ini</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN MONITORING (KHUSUS ROLE ADMIN/SUPPORT) */}
          {(isAdmin || activeNav === 'admin') && activeNav !== 'settings' && (
            <AdminMonitoringPanel />
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Always Pinned) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around z-40 shadow-lg">
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setActiveNav('admin')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'admin' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Monitoring</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'settings' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:text-red-600 transition cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveNav('websites')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'websites' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>Website</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('templates')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'templates' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutTemplate className="w-5 h-5" />
              <span>Template</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'settings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:text-red-600 transition cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </>
        )}
      </nav>

      {/* Create Website Modal (Khusus Client Pengguna Saja) */}
      {!isAdmin && (
        <>
          <CreateWebsiteModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onWebsiteCreated={(newWebsiteId) => {
              setIsCreateModalOpen(false);
              onOpenEditor(newWebsiteId);
            }}
          />

          {/* QR Code Stand Meja Kasir Modal */}
          <QrCodeModal
            isOpen={!!selectedQrSite}
            onClose={() => setSelectedQrSite(null)}
            website={selectedQrSite}
          />

          {/* Leads & Buku Tamu Modal */}
          <LeadsModal
            isOpen={!!selectedLeadsSite}
            onClose={() => setSelectedLeadsSite(null)}
            website={selectedLeadsSite}
          />

          {/* Pricing & Midtrans Payment Modal */}
          <PricingModal
            isOpen={isPricingModalOpen}
            onClose={() => setIsPricingModalOpen(false)}
            onUpgraded={() => {
              fetchWebsites();
              window.location.reload();
            }}
          />
        </>
      )}
    </div>
  );
};
