import React, { useState, useEffect, useCallback } from 'react';
import { Website } from '../types/schema';
import { useAuth } from '../context/AuthContext';
import { websiteService } from '../services/website.service';
import { CreateWebsiteModal } from '../components/modals/CreateWebsiteModal';
import { PRESET_TEMPLATES, PresetTemplate } from '../templates/presetTemplates';
import { getPublicSiteUrl, getPublicSiteDisplayUrl } from '../utils/url.utils';
import {
  Plus,
  Globe,
  Edit3,
  ExternalLink,
  Trash2,
  Copy,
  CheckCircle,
  CheckCircle2,
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
  Users,
  FileSpreadsheet,
  History,
} from 'lucide-react';
import { AdminMonitoringPanel, AdminTab } from '../components/admin/AdminMonitoringPanel';
import { MerchantLeadsView } from '../components/merchant/MerchantLeadsView';
import { MerchantAnalyticsView } from '../components/merchant/MerchantAnalyticsView';
import { MerchantMarketingView } from '../components/merchant/MerchantMarketingView';
import { QrCodeModal } from '../components/common/QrCodeModal';
import { LeadsModal } from '../components/common/LeadsModal';
import { PricingModal } from '../components/modals/PricingModal';
import { adminService, AdminAnnouncement } from '../services/admin.service';
import logoClean from '../assets/Logo Loka (1) (1).png';
import logoLokaFigma from '../assets/dashboard/logo-loka-figma.png';
import { useToast } from '../context/ToastContext';
/* ── Figma Node 41:142 Dashboard Assets ── */
import iconWebsiteGlobe from '../assets/dashboard/icon-website-globe.svg';
import iconInboxTab from '../assets/dashboard/icon-inbox.svg';
import iconAnalyticsTab from '../assets/dashboard/icon-analytics.svg';
import iconQrTab from '../assets/dashboard/icon-qr.svg';
import iconTemplateGrid from '../assets/dashboard/icon-template-grid.svg';
import iconSettingTab from '../assets/dashboard/icon-setting.svg';
import iconLogoutTab from '../assets/dashboard/icon-logout.svg';
import star4 from '../assets/dashboard/star-4.svg';
import star2 from '../assets/dashboard/star-2.svg';
import star3 from '../assets/dashboard/star-3.svg';
import iconCrownCard from '../assets/dashboard/icon-crown-card.svg';
import iconCrownHeader from '../assets/dashboard/icon-crown-header.svg';
import iconPlusWhite from '../assets/dashboard/icon-plus-white.svg';


export type MerchantNavTab = 'websites' | 'leads' | 'analytics' | 'marketing' | 'templates' | 'settings' | 'admin';

interface Props {
  onOpenEditor: (websiteId: string) => void;
  onOpenPublicSite: (slug: string) => void;
  initialNav?: MerchantNavTab;
}

export const DashboardPage: React.FC<Props> = ({ onOpenEditor, onOpenPublicSite, initialNav }) => {
  const { user, token, logout } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin' || user?.role === 'support';
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState<MerchantNavTab>(
    isAdmin ? 'admin' : (initialNav || 'websites')
  );
  const [adminTab, setAdminTab] = useState<AdminTab>('users');
  const [unreadLeadsCount, setUnreadLeadsCount] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPresetTemplate, setSelectedPresetTemplate] = useState<PresetTemplate | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedQrSite, setSelectedQrSite] = useState<Website | null>(null);
  const [selectedLeadsSite, setSelectedLeadsSite] = useState<Website | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingWebsite, setIsDeletingWebsite] = useState(false);
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

      websiteService.getAllUserLeads()
        .then((data) => {
          setUnreadLeadsCount(data.filter((l) => l.status === 'unread').length);
        })
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
  const handleDeleteWebsite = (websiteId: string, websiteName: string) => {
    setWebsiteToDelete({ id: websiteId, name: websiteName });
  };

  const confirmDeleteWebsite = async () => {
    if (!token || !websiteToDelete) return;

    try {
      setIsDeletingWebsite(true);
      await websiteService.deleteWebsite(websiteToDelete.id);
      setWebsites((prev) => prev.filter((w) => w.id !== websiteToDelete.id));
      toast.info('Website Dihapus', `"${websiteToDelete.name}" telah dihapus secara permanen.`);
      setWebsiteToDelete(null);
    } catch (err: any) {
      console.error('Delete website error:', err);
      toast.error('Gagal Menghapus Website', err.message || 'Terjadi kesalahan saat menghapus.');
    } finally {
      setIsDeletingWebsite(false);
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
    const url = getPublicSiteUrl(slug);
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
  /* ── Figma Concave Curved Navigation Item Helper (Node 41:142) ── */
  const renderNavItem = (
    key: string,
    label: string,
    iconSrc: string | null,
    LucideIcon: React.ComponentType<{ className?: string }> | null,
    isActive: boolean,
    onClick: () => void,
    badge?: React.ReactNode
  ) => (
    <div key={key} className="relative my-1 pl-[15px]">
      {isActive && (
        <div className="absolute inset-y-0 left-[15px] right-0 bg-[#F9FAFC] rounded-l-[20px] shadow-xs pointer-events-none z-10 animate-tab-drop">
          {/* Top concave inverted notch (Figma 22px curve radius) */}
          <div className="absolute right-0 -top-[22px] w-[22px] h-[22px] bg-[#F9FAFC] pointer-events-none z-10">
            <div className="w-full h-full bg-[#425B9A] rounded-br-[22px]" />
          </div>
          {/* Bottom concave inverted notch (Figma 22px curve radius) */}
          <div className="absolute right-0 -bottom-[22px] w-[22px] h-[22px] bg-[#F9FAFC] pointer-events-none z-10">
            <div className="w-full h-full bg-[#425B9A] rounded-tr-[22px]" />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-[44px] flex items-center gap-3.5 pl-5 pr-4 font-poppins text-[13.5px] transition-all duration-200 cursor-pointer relative z-20 ${
          isActive
            ? 'text-[#425B9A] font-bold rounded-l-[20px]'
            : 'text-white/85 hover:text-white hover:bg-white/10 hover:translate-x-0.5 rounded-l-[16px] font-medium'
        }`}
      >
        {iconSrc ? (
          <span
            aria-hidden="true"
            className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 inline-block ${
              isActive ? 'bg-[#425B9A]' : 'bg-white'
            }`}
            style={{
              maskImage: `url("${iconSrc}")`,
              WebkitMaskImage: `url("${iconSrc}")`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          />
        ) : LucideIcon ? (
          <LucideIcon
            className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
              isActive ? 'text-[#425B9A]' : 'text-white'
            }`}
          />
        ) : null}
        <span className="truncate">{label}</span>
        {badge}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 h-screen max-h-screen w-screen overflow-hidden bg-[#F9FAFC] flex">
      {/* SaaS Sidebar (Figma Node 41:142 Solid Navy #425B9A with Active Curved Cutout) */}
      <div className="w-[264px] h-full hidden md:flex flex-col shrink-0 z-30 select-none bg-[#F9FAFC]">
        {/* Brand Header (Figma: Light/White Background with Authentic Blue Loka Logo) */}
        <div className="h-[56px] px-6 flex items-center justify-between shrink-0 bg-[#F9FAFC]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoLokaFigma}
              alt="Loka"
              className="h-[30px] w-auto object-contain"
            />
            {isAdmin && (
              <span className="text-[9px] font-poppins font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#425B9A]/15 text-[#425B9A] border border-[#425B9A]/30">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* SaaS Sidebar Container (Solid Navy #425B9A with rounded-tr-[24px] and Active Cutout) */}
        <aside className="flex-1 min-h-0 bg-[#425B9A] rounded-tr-[24px] flex flex-col relative overflow-x-hidden shadow-xs">
          {/* Navigation List */}
          <nav className="pt-4 pb-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {isAdmin ? (
            /* ADMIN ONLY NAVIGATION */
            <>
              <div className="px-7 pt-3.5 pb-2 text-[12px] font-poppins font-bold uppercase tracking-[0.8px] text-white">
                Menu Administrator
              </div>

              {renderNavItem(
                'admin-users',
                'Pengguna & Sesi',
                null,
                Users,
                activeNav === 'admin' && adminTab === 'users',
                () => {
                  setActiveNav('admin');
                  setAdminTab('users');
                }
              )}

              {renderNavItem(
                'admin-moderation',
                'Moderasi Website',
                null,
                ShieldAlert,
                activeNav === 'admin' && adminTab === 'moderation',
                () => {
                  setActiveNav('admin');
                  setAdminTab('moderation');
                }
              )}

              {renderNavItem(
                'admin-announcements',
                'Broadcast Pengumuman',
                null,
                Megaphone,
                activeNav === 'admin' && adminTab === 'announcements',
                () => {
                  setActiveNav('admin');
                  setAdminTab('announcements');
                }
              )}

              {renderNavItem(
                'admin-export',
                'Ekspor Laporan (Excel)',
                null,
                FileSpreadsheet,
                activeNav === 'admin' && adminTab === 'export',
                () => {
                  setActiveNav('admin');
                  setAdminTab('export');
                }
              )}

              {renderNavItem(
                'admin-audit',
                'Log Aktivitas (Audit)',
                null,
                History,
                activeNav === 'admin' && adminTab === 'audit',
                () => {
                  setActiveNav('admin');
                  setAdminTab('audit');
                }
              )}

              <div className="pt-5 pb-2 px-7 text-[12px] font-poppins font-bold uppercase tracking-[0.8px] text-white">
                Pengaturan
              </div>

              {renderNavItem(
                'settings',
                'Pengaturan Akun',
                iconSettingTab,
                null,
                activeNav === 'settings',
                () => setActiveNav('settings')
              )}
            </>
          ) : (
            /* REGULAR CLIENT NAVIGATION */
            <>
              <div className="px-7 pt-3.5 pb-2 text-[12px] font-poppins font-bold uppercase tracking-[0.8px] text-white">
                Menu Utama
              </div>

              {renderNavItem(
                'websites',
                'Website Saya',
                iconWebsiteGlobe,
                null,
                activeNav === 'websites',
                () => setActiveNav('websites'),
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeNav === 'websites'
                      ? 'bg-[#425B9A]/15 text-[#425B9A]'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {websites.length}
                </span>
              )}

              {renderNavItem(
                'leads',
                'Kotak Masuk Leads',
                iconInboxTab,
                null,
                activeNav === 'leads',
                () => setActiveNav('leads'),
                unreadLeadsCount > 0 ? (
                  <span
                    className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeNav === 'leads'
                        ? 'bg-[#425B9A] text-white'
                        : 'bg-white text-[#425B9A]'
                    }`}
                  >
                    {unreadLeadsCount}
                  </span>
                ) : null
              )}

              {renderNavItem(
                'analytics',
                'Analitik & Trafik',
                iconAnalyticsTab,
                null,
                activeNav === 'analytics',
                () => setActiveNav('analytics')
              )}

              {renderNavItem(
                'marketing',
                'Promosi & QR Meja',
                iconQrTab,
                null,
                activeNav === 'marketing',
                () => setActiveNav('marketing')
              )}

              {renderNavItem(
                'templates',
                'Galeri Template',
                iconTemplateGrid,
                null,
                activeNav === 'templates',
                () => setActiveNav('templates'),
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeNav === 'templates'
                      ? 'bg-[#425B9A]/15 text-[#425B9A]'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {PRESET_TEMPLATES.length}
                </span>
              )}

              <div className="pt-5 pb-2 px-7 text-[12px] font-poppins font-bold uppercase tracking-[0.8px] text-white">
                Akun & Bisnis
              </div>

              {renderNavItem(
                'settings',
                'Pengaturan Akun',
                iconSettingTab,
                null,
                activeNav === 'settings',
                () => setActiveNav('settings')
              )}

              {/* PRO Subscription Card (Figma Node 41:206) */}
              <div className="px-5 pt-4 pb-2">
                <div
                  className="relative rounded-[16px] p-4 text-center overflow-hidden border border-white/60 shadow-lg shadow-sky-950/20"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 30%, #ffffff 0%, #ceedff 100%)',
                  }}
                >
                  {/* Decorative Sparkle Stars */}
                  <img
                    src={star4}
                    alt=""
                    className="absolute left-3 top-8 w-3.5 h-3.5 pointer-events-none opacity-80"
                  />
                  <img
                    src={star2}
                    alt=""
                    className="absolute left-10 top-2 w-3 h-3 pointer-events-none opacity-70"
                  />
                  <img
                    src={star2}
                    alt=""
                    className="absolute right-10 bottom-10 w-3 h-3 pointer-events-none opacity-70"
                  />
                  <img
                    src={star3}
                    alt=""
                    className="absolute right-3 top-3 w-4 h-4 pointer-events-none opacity-80"
                  />

                  {/* Crown Icon */}
                  <div className="w-9 h-9 mx-auto mb-1 flex items-center justify-center">
                    <img
                      src={iconCrownCard}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Title */}
                  <p className="font-poppins font-semibold text-[12.5px] text-[#556473] leading-snug mb-2.5">
                    Paket Langganan PRO
                  </p>

                  {/* Upgrade Button */}
                  <button
                    type="button"
                    onClick={() => setIsPricingModalOpen(true)}
                    className="w-full max-w-[120px] mx-auto py-1.5 px-4 bg-[#fc9900] hover:bg-[#ea8c00] active:scale-95 text-white font-poppins font-semibold text-[11px] rounded-[12px] shadow-sm transition-all cursor-pointer block"
                  >
                    {user?.plan === 'pro' ? 'Aktif' : 'Upgrade'}
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* User Profile Card Footer (Figma Node 41:153) */}
        <div className="p-4 shrink-0">
          <div className="bg-white rounded-[14px] p-2.5 shadow-md shadow-sky-950/10 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="bg-[#def3ff] text-[#425B9A] font-poppins font-bold text-base size-9 rounded-[8px] flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="min-w-0 pr-1">
                <p className="text-[12px] font-poppins font-semibold text-[#3a3a3a] truncate leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] font-poppins text-[#556473] truncate leading-tight mt-0.5">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
              title="Keluar"
            >
              <img
                src={iconLogoutTab}
                alt="Logout"
                className="w-5 h-5 object-contain"
              />
            </button>
          </div>
        </div>
      </aside>
      </div>

      {/* Main Content Area (Independent Scroll Container) */}
      <div className="flex-1 h-full min-h-0 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Figma Node 41:219 Solid Navy #425B9A with rounded-bl-[28px]) */}
        <header className="h-[56px] bg-[#425B9A] px-6 sm:px-8 flex items-center justify-between shrink-0 z-20 rounded-bl-[20px] shadow-sm">
          {/* Left: Mobile Brand & Desktop Title */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-white px-2 py-1 rounded-lg shadow-xs flex items-center">
                <img src={logoLokaFigma} alt="Loka" className="h-5 w-auto object-contain" />
              </div>
              {isAdmin && (
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white">
                  Admin
                </span>
              )}
            </div>
            <div className="hidden md:block">
              <h1 className="font-poppins font-semibold text-sm sm:text-base text-white tracking-tight">
                {isAdmin
                  ? activeNav === 'settings'
                    ? 'Pengaturan Akun'
                    : adminTab === 'users'
                    ? 'Monitoring Pengguna & Sesi Client'
                    : adminTab === 'moderation'
                    ? 'Moderasi Website Pengguna'
                    : adminTab === 'announcements'
                    ? 'Broadcast Pengumuman Sistem'
                    : adminTab === 'export'
                    ? 'Ekspor Laporan Data Platform'
                    : 'Log Aktivitas (Audit Trail)'
                  : activeNav === 'websites'
                  ? 'Kelola Website'
                  : activeNav === 'leads'
                  ? 'Kotak Masuk & Leads Pelanggan'
                  : activeNav === 'analytics'
                  ? 'Analitik & Performa Bisnis'
                  : activeNav === 'marketing'
                  ? 'Kit Promosi & QR Stand Meja Kasir'
                  : activeNav === 'templates'
                  ? 'Galeri Template Siap Pakai'
                  : 'Pengaturan Akun'}
              </h1>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* PRO BADGE / UPGRADE BUTTON (Client Only) */}
            {!isAdmin && (
              user?.plan === 'pro' ? (
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 h-[34px] bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 rounded-[10px] text-white text-xs font-poppins font-semibold shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
                  title="Klik untuk melihat status langganan & seluruh benefit PRO Anda"
                >
                  <img src={iconCrownHeader} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                  <span>PRO PLAN</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 h-[34px] bg-gradient-to-r from-[#fc9900] to-[#fe6a00] hover:brightness-105 rounded-[10px] text-white text-xs font-poppins font-semibold shadow-md shadow-orange-500/20 active:scale-95 transition cursor-pointer"
                >
                  <img src={iconCrownHeader} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                  <span>Upgrade ke Pro</span>
                </button>
              )
            )}

            {/* BUAT WEBSITE (Client Only) */}
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-3.5 h-[34px] bg-[#76C0EC] hover:bg-[#5eb5e7] text-white rounded-[10px] text-xs font-poppins font-semibold shadow-md shadow-[#76C0EC]/30 active:scale-95 transition cursor-pointer"
              >
                <img src={iconPlusWhite} alt="" className="w-3.5 h-3.5 object-contain" />
                <span>Buat Website</span>
              </button>
            )}

            {/* ADMIN BADGE (Admin Only) */}
            {isAdmin && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/20 text-white text-xs font-poppins font-medium shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Akses Administrator</span>
              </div>
            )}
          </div>
        </header>

        {/* Body Content (Only this scrolls smoothly) */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 scroll-smooth">
          <div
            key={isAdmin ? `admin-${adminTab}-${activeNav}` : activeNav}
            className="animate-content-fall space-y-8"
          >
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
                    const publicUrl = getPublicSiteUrl(site.slug);
                    const displayUrl = getPublicSiteDisplayUrl(site.slug);

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
                              {displayUrl}
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
                                href={publicUrl}
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

          {/* TAB: KOTAK MASUK LEADS (CLIENT ONLY) */}
          {!isAdmin && activeNav === 'leads' && (
            <MerchantLeadsView websites={websites} />
          )}

          {/* TAB: ANALITIK & PERFORMA (CLIENT ONLY) */}
          {!isAdmin && activeNav === 'analytics' && (
            <MerchantAnalyticsView
              websites={websites}
              onOpenEditor={onOpenEditor}
              onOpenPublicSite={onOpenPublicSite}
            />
          )}

          {/* TAB: PROMOSI & QR STAND MEJA KASIR (CLIENT ONLY) */}
          {!isAdmin && activeNav === 'marketing' && (
            <MerchantMarketingView
              websites={websites}
              onOpenPublicSite={onOpenPublicSite}
            />
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
                {PRESET_TEMPLATES.map((tpl) => {
                  const isLocked = tpl.isPro && user?.plan !== 'pro' && !isAdmin;
                  return (
                    <div
                      key={tpl.id}
                      className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group ${
                        tpl.isPro ? 'border-amber-300/80 ring-1 ring-amber-200/50' : 'border-slate-200'
                      }`}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={tpl.previewImage}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-sm">
                            {tpl.category}
                          </span>
                          {tpl.isPro && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md flex items-center gap-1 border border-amber-300">
                              <Crown className="w-3 h-3 fill-current" />
                              <span>PRO EXCLUSIVE</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-2 flex-1">
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                          <span>{tpl.name}</span>
                          {tpl.isPro && <Crown className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />}
                        </h3>
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
                          {tpl.isPro && (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                              Clean Domain & No Watermark
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        {isLocked ? (
                          <button
                            type="button"
                            onClick={() => setIsPricingModalOpen(true)}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Crown className="w-3.5 h-3.5 fill-current" />
                            <span>Upgrade PRO untuk Gunakan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPresetTemplate(tpl);
                              setIsCreateModalOpen(true);
                            }}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {tpl.isPro && <Crown className="w-3.5 h-3.5 text-amber-300 fill-current" />}
                            <span>Gunakan Template Ini</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS (RESPONSIVE FULL-WIDTH DUAL-COLUMN LAYOUT) */}
          {activeNav === 'settings' && (
            <div className="w-full space-y-6">
              {/* Header Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isAdmin ? 'Pengaturan Akun Administrator' : 'Profil & Pengaturan Akun'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isAdmin
                      ? 'Kelola profil administrator sistem LOKA dan status otorisasi monitoring.'
                      : 'Informasi identitas akun merchant dan status paket langganan Anda.'}
                  </p>
                </div>
              </div>

              {/* 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Column (2 cols): Profil & Detail Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-[#425B9A]/10 text-[#425B9A] border border-[#425B9A]/20 flex items-center justify-center font-black text-xl shrink-0 shadow-2xs">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900">
                          {user?.name || 'Pengguna LOKA'}
                        </h2>
                        {isAdmin ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#425B9A]/10 text-[#425B9A] border border-[#425B9A]/20">
                            {user?.role === 'admin' ? 'Super Administrator' : 'Support Specialist'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Merchant Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Form Grid 2 Kolom untuk Nama & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        disabled
                        value={user?.name || ''}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Alamat Email</label>
                      <input
                        type="text"
                        disabled
                        value={user?.email || ''}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* Tingkatan Akses (Role) - HANYA DITAMPILKAN UNTUK ADMIN */}
                  {isAdmin && (
                    <div className="text-xs">
                      <label className="block font-semibold text-slate-700 mb-1.5">Tingkatan Akses (Role)</label>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="w-10 h-10 rounded-xl bg-[#425B9A] text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
                          <ShieldCheck className="w-5 h-5 text-[#76C0EC]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 uppercase">
                              {user?.role} — {user?.role === 'admin' ? 'Akses Penuh Seluruh Sistem' : 'Akses Dukungan Pelanggan'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Memiliki izin untuk memonitor pengguna, moderasi website merchant, dan menerbitkan pengumuman.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Paket Khusus Merchant */}
                  {!isAdmin && (
                    <div className="text-xs">
                      <label className="block font-semibold text-slate-700 mb-1.5">Status Paket Langganan</label>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            user?.plan === 'pro'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            <Crown className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {user?.plan === 'pro' ? 'LOKA PRO PLAN (Aktif)' : 'LOKA FREE PLAN (Standar)'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {user?.plan === 'pro'
                                ? 'Akses penuh tanpa batas, custom domain, dan tanpa watermark'
                                : 'Batas 1 website bisnis dan fitur katalog dasar'}
                            </p>
                          </div>
                        </div>
                        {user?.plan !== 'pro' && (
                          <button
                            type="button"
                            onClick={() => setIsPricingModalOpen(true)}
                            className="px-4 py-2 bg-[#425B9A] hover:bg-[#354a7d] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
                          >
                            Upgrade ke Pro
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (1 col): Keamanan Sesi & Logout */}
                <div className="space-y-6">
                  {/* Status Keamanan & Sesi */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Status Keamanan & Sesi
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800">Sesi Terenkripsi</p>
                          <p className="text-[11px] text-slate-500">Token JWT aman aktif untuk browser ini.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#425B9A] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800">Status Autentikasi</p>
                          <p className="text-[11px] text-slate-500">Terverifikasi sebagai {isAdmin ? 'Administrator' : 'Merchant'}.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keluar dari Akun */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Sesi Login
                      </h3>
                      <p className="text-xs text-slate-500">
                        Akhiri sesi jika Anda ingin berganti akun atau selesai menggunakan perangkat ini.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 border border-red-200/60"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN MONITORING (KHUSUS ROLE ADMIN/SUPPORT) */}
          {(isAdmin || activeNav === 'admin') && activeNav !== 'settings' && (
            <AdminMonitoringPanel
              activeTab={adminTab}
              onTabChange={setAdminTab}
              hideNav={true}
            />
          )}
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Figma Themed) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#425B9A]/95 backdrop-blur-md border-t border-white/20 px-2 py-1.5 z-40 shadow-lg text-white">
        {isAdmin ? (
          <div className="flex items-center gap-1 overflow-x-auto w-full py-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setActiveNav('admin');
                setAdminTab('users');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'admin' && adminTab === 'users' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pengguna</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('admin');
                setAdminTab('moderation');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'admin' && adminTab === 'moderation' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Moderasi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('admin');
                setAdminTab('announcements');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'admin' && adminTab === 'announcements' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('admin');
                setAdminTab('export');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'admin' && adminTab === 'export' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('admin');
                setAdminTab('audit');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'admin' && adminTab === 'audit' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition shrink-0 cursor-pointer ${
                activeNav === 'settings' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Akun</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold text-white/70 hover:text-red-300 transition shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-around w-full">
            <button
              type="button"
              onClick={() => setActiveNav('websites')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'websites' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Website</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('leads')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition relative cursor-pointer ${
                activeNav === 'leads' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Leads</span>
              {unreadLeadsCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-400 ring-2 ring-[#425B9A]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('analytics')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'analytics' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analitik</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('marketing')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'marketing' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Meja</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('templates')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'templates' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Template</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                activeNav === 'settings' ? 'text-[#425B9A] bg-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Akun</span>
            </button>
          </div>
        )}
      </nav>

      {/* Create Website Modal (Khusus Client Pengguna Saja) */}
      {!isAdmin && (
        <>
          <CreateWebsiteModal
            isOpen={isCreateModalOpen}
            initialTemplate={selectedPresetTemplate}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onClose={() => {
              setIsCreateModalOpen(false);
              setSelectedPresetTemplate(null);
            }}
            onWebsiteCreated={(newWebsiteId) => {
              setIsCreateModalOpen(false);
              setSelectedPresetTemplate(null);
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

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Konfirmasi Keluar
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-800">{user?.name || 'ini'}</strong>? Anda harus login kembali untuk mengakses dashboard Anda.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Website Confirmation Modal */}
      {websiteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-center animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Hapus Website?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Yakin ingin menghapus website <strong className="text-slate-800">"{websiteToDelete.name}"</strong>? Seluruh data halaman dan konfigurasi akan dihapus secara permanen.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeletingWebsite}
                onClick={() => setWebsiteToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingWebsite}
                onClick={confirmDeleteWebsite}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeletingWebsite ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
