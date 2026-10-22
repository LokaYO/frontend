import React, { useState, useEffect, useCallback } from 'react';
import {
  adminService,
  MonitoringUser,
  PlatformStats,
  UserDetails,
  AdminWebsite,
} from '../../services/admin.service';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Globe,
  CheckCircle2,
  Activity,
  Search,
  RefreshCw,
  Trash2,
  Laptop,
  Clock,
  Eye,
  ArrowLeft,
  ExternalLink,
  Layers,
  FileText,
  Wifi,
  WifiOff,
  Phone,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  UserCheck,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';

// ─── Section Preview Component ─────────────────────────────────────────────────

interface SectionPreviewProps {
  section: AdminWebsite['sections'][0];
}

const SectionPreview: React.FC<SectionPreviewProps> = ({ section }) => {
  const [expanded, setExpanded] = useState(false);
  const c = section.content as Record<string, any>;

  const sectionTypeLabel: Record<string, string> = {
    hero: 'Hero Banner',
    about: 'Tentang Bisnis',
    services: 'Layanan',
    gallery: 'Galeri Foto',
    testimonials: 'Testimoni Pelanggan',
    contact: 'Kontak & WhatsApp',
    cta: 'Call to Action',
    faq: 'FAQ Tanya Jawab',
    map: 'Peta / Lokasi Toko',
    footer: 'Footer Website',
  };

  const sectionColor: Record<string, string> = {
    hero: 'bg-blue-50/80 border-blue-200 text-blue-700',
    about: 'bg-teal-50/80 border-teal-200 text-teal-700',
    services: 'bg-indigo-50/80 border-indigo-200 text-indigo-700',
    gallery: 'bg-pink-50/80 border-pink-200 text-pink-700',
    testimonials: 'bg-amber-50/80 border-amber-200 text-amber-700',
    contact: 'bg-emerald-50/80 border-emerald-200 text-emerald-700',
    cta: 'bg-orange-50/80 border-orange-200 text-orange-700',
    faq: 'bg-violet-50/80 border-violet-200 text-violet-700',
    map: 'bg-cyan-50/80 border-cyan-200 text-cyan-700',
    footer: 'bg-slate-100 border-slate-200 text-slate-600',
  };

  const colorClass = sectionColor[section.type] || 'bg-slate-50 border-slate-200 text-slate-600';
  const title = c.title || c.heading || c.name || null;
  const subtitle = c.subtitle || c.description || c.tagline || null;

  return (
    <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs text-xs">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center gap-3 px-4 py-3 ${colorClass} transition hover:opacity-90 cursor-pointer`}
      >
        <span className="w-6 h-6 rounded-lg bg-white/80 shadow-xs flex items-center justify-center text-[10px] font-black text-slate-800">
          {section.position + 1}
        </span>
        <div className="text-left min-w-0 flex-1">
          <span className="font-extrabold">{sectionTypeLabel[section.type] || section.type}</span>
          {title && (
            <span className="ml-2 font-normal opacity-80 truncate block sm:inline">
              &bull; &ldquo;{title}&rdquo;
            </span>
          )}
        </div>
        <span className="ml-auto shrink-0 text-slate-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {expanded && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
          {title && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Judul:</span>
              <span className="font-bold text-slate-900">{title}</span>
            </div>
          )}
          {subtitle && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Deskripsi:</span>
              <span className="text-slate-600 leading-relaxed">{subtitle}</span>
            </div>
          )}
          {c.buttonText && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Tombol:</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[11px]">
                {c.buttonText}
              </span>
            </div>
          )}
          {c.phone && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">No. WhatsApp:</span>
              <span className="font-mono text-emerald-700 font-bold">{c.phone}</span>
            </div>
          )}
          {c.address && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Alamat:</span>
              <span className="text-slate-700">{c.address}</span>
            </div>
          )}
          {Array.isArray(c.services) && c.services.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Item Layanan:</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {c.services.map((s: any, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-medium">
                    {s.title || s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(c.items) && c.items.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-slate-400 font-semibold w-20 shrink-0">Daftar Item:</span>
              <span className="text-slate-700 font-medium">{c.items.length} item terdaftar</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Website Detailed Card Component ──────────────────────────────────────────

interface WebsiteCardProps {
  website: AdminWebsite;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  const [sectionsExpanded, setSectionsExpanded] = useState(true);
  const isPublished = website.status === 'published';
  const publicUrl = `${window.location.origin}/sites/${website.slug}`;
  const bi = website.businessInfo || {};

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition hover:shadow-md">
      {/* Top Banner Header */}
      <div
        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: website.theme?.backgroundColor || '#f8fafc',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isPublished
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-amber-400 text-slate-900 shadow-xs'
              }`}
            >
              {isPublished ? '● LIVE' : 'DRAFT'}
            </span>
            {website.template && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border border-slate-200 text-slate-700">
                Template: {website.template}
              </span>
            )}
            <span className="text-slate-400 text-xs">
              Diperbarui: {new Date(website.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight">{website.name}</h3>
          <p className="text-xs text-blue-600 font-mono">/sites/{website.slug}</p>
        </div>

        {/* Action Link */}
        <div className="flex items-center gap-2">
          {isPublished && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Website Publik</span>
            </a>
          )}
        </div>
      </div>

      {/* Business Info Grid */}
      {bi && Object.keys(bi).length > 0 && (
        <div className="p-5 bg-slate-50/60 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {bi.category && (
            <div className="space-y-0.5">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Kategori Bisnis
              </span>
              <p className="font-bold text-slate-900">{bi.category}</p>
            </div>
          )}
          {bi.phone && (
            <div className="space-y-0.5">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Kontak
              </span>
              <p className="font-bold text-slate-900 font-mono">{bi.phone}</p>
            </div>
          )}
          {bi.address && (
            <div className="space-y-0.5 sm:col-span-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Alamat Fisik
              </span>
              <p className="font-bold text-slate-900">{bi.address}</p>
            </div>
          )}
          {bi.description && (
            <div className="sm:col-span-2 lg:col-span-4 pt-1">
              <span className="text-slate-400 font-semibold text-[11px] block mb-0.5">Deskripsi Singkat:</span>
              <p className="text-slate-600 leading-relaxed">{bi.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Sections Accordion Header */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Isi Konten & Sections ({website.sections?.length || 0})
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setSectionsExpanded((v) => !v)}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            {sectionsExpanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Sembunyikan Sections</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Tampilkan Sections</>
            )}
          </button>
        </div>

        {/* Sections List */}
        {sectionsExpanded && (
          <div className="space-y-2.5">
            {(!website.sections || website.sections.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 rounded-2xl">
                Client belum menambahkan section pada website ini.
              </p>
            ) : (
              website.sections.map((section) => (
                <SectionPreview key={section.id} section={section} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── DEDICATED FULL VIEW: CLIENT DETAIL ────────────────────────────────────────

interface ClientDetailViewProps {
  userId: string;
  onBack: () => void;
  currentAdminRole: string;
  onRoleChange: (userId: string, newRole: 'admin' | 'support' | 'user') => Promise<void>;
  onDelete: (userId: string, name: string) => Promise<void>;
  actionLoading: string | null;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  userId,
  onBack,
  currentAdminRole,
  onRoleChange,
  onDelete,
  actionLoading,
}) => {
  const [data, setData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminService
      .getUserDetails(userId)
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Fetch user detail error:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Belum pernah login';
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredWebsites =
    data?.websites.filter((w) => {
      if (filterStatus === 'all') return true;
      return w.status === filterStatus;
    }) || [];

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-12">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
        <p className="text-sm font-semibold text-slate-500">Memuat data client dan seluruh websitenya...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <p className="text-sm text-red-500">Gagal memuat detail pengguna.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const { user } = data;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const totalPublished = data.websites.filter((w) => w.status === 'published').length;
  const totalSections = data.websites.reduce((acc, w) => acc + (w.sectionCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Top Navigation Bar / Breadcrumb ───────────────── */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pengguna</span>
        </button>

        <div className="text-xs text-slate-400 hidden sm:block">
          Monitoring &bull; Detail Akun &bull; <strong className="text-slate-700">{user.name}</strong>
        </div>
      </div>

      {/* ── Client Profile Header Card ───────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              {initials || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'support'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role}
                </span>
                {data.activeSessions.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sedang Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">
                    Offline
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Role Change & Delete Controls for Super Admin */}
          {currentAdminRole === 'admin' && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Ubah Role
                </span>
                <select
                  value={user.role}
                  disabled={actionLoading === user.id}
                  onChange={(e) => onRoleChange(user.id, e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="user">User (Client UMKM)</option>
                  <option value="support">Support Team</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Tindakan
                </span>
                <button
                  type="button"
                  disabled={actionLoading === user.id}
                  onClick={() => onDelete(user.id, user.name)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title="Hapus user beserta websitenya"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Grid Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Tanggal Registrasi
            </span>
            <p className="font-bold text-slate-800">{formatDate(user.created_at)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Terakhir Kali Login
            </span>
            <p className="font-bold text-slate-800">{formatDate(user.last_login_at)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Website Dibuat
            </span>
            <p className="font-bold text-slate-800">
              {data.websites.length} Website ({totalPublished} Live)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Total Sections Konten
            </span>
            <p className="font-bold text-slate-800">{totalSections} Section</p>
          </div>
        </div>

        {/* Active Sessions & Devices */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-600" />
            <span>Sesi Perangkat & Browser Aktif ({data.activeSessions.length})</span>
          </h4>

          {data.activeSessions.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400 flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-slate-400" />
              <span>Tidak ada sesi aktif saat ini (pengguna sedang offline).</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.activeSessions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{s.user_agent || 'Unknown Browser'}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>IP: <strong className="text-slate-700">{s.ip_address || '-'}</strong></span>
                      <span>&bull;</span>
                      <span>Berakhir: {new Date(s.expires_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Client Websites & Content Section ────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Daftar Landing Page Milik Client</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                {data.websites.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau seluruh website, struktur section, profil bisnis, dan konten yang sudah dibuat oleh client ini.
            </p>
          </div>

          {/* Filter Status Website */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-semibold">Filter:</span>
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterStatus === st
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'published' ? 'Live' : 'Draft'}
              </button>
            ))}
          </div>
        </div>

        {/* Website Cards List */}
        {filteredWebsites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3">
            <Globe className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Website Ditemukan</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {data.websites.length === 0
                ? 'Client ini belum membuat website apapun.'
                : `Tidak ada website dengan status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredWebsites.map((site) => (
              <WebsiteCard key={site.id} website={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN ADMIN MONITORING PANEL ───────────────────────────────────────────────

export const AdminMonitoringPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<MonitoringUser[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'clients' | 'internal' | 'all'>('clients');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        adminService.getMonitoringUsers(),
        adminService.getStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load admin monitoring data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'support' | 'user') => {
    try {
      setActionLoading(userId);
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Yakin ingin menghapus user "${userName}" beserta seluruh websitenya?`)) return;
    try {
      setActionLoading(userId);
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUserId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus user');
    } finally {
      setActionLoading(null);
    }
  };

  // Kategorisasi User:
  const clientUsers = users.filter((u) => u.role === 'user');
  const internalUsers = users.filter((u) => u.role === 'admin' || u.role === 'support');

  const usersInActiveCategory =
    activeCategory === 'clients'
      ? clientUsers
      : activeCategory === 'internal'
      ? internalUsers
      : users;

  const filteredUsers = usersInActiveCategory.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatDate = (iso: string | null) => {
    if (!iso) return 'Belum login';
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onlineCount = users.filter((u) => u.isCurrentlyOnline).length;

  // JIKA SEDANG MEMBUKA DETAIL USER -> TAMPILKAN DEDICATED FULL VIEW
  if (selectedUserId) {
    return (
      <ClientDetailView
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
        currentAdminRole={user?.role || ''}
        onRoleChange={handleRoleChange}
        onDelete={handleDeleteUser}
        actionLoading={actionLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Monitoring Pengguna & Client
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau seluruh client UMKM, website buatan mereka, dan staf internal administrator secara terpisah.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 shrink-0 self-start sm:self-auto disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* ── Platform Stats Grid ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client UMKM</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{clientUsers.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Pemilik usaha lokal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tim Internal</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{internalUsers.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {stats?.totalAdmins || 0} Admin &bull; {stats?.totalSupports || 0} Support
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sedang Online</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-slate-900">{onlineCount}</p>
            {onlineCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Sesi aktif saat ini</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Website</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><Globe className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalWebsites ?? 0}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {stats?.totalPublished ?? 0} Berstatus Live
          </span>
        </div>
      </div>

      {/* ── CATEGORY TABS & TABLE ───────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Category Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl self-start">
            <button
              type="button"
              onClick={() => setActiveCategory('clients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === 'clients'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Client Pengguna (UMKM)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-black">
                {clientUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('internal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === 'internal'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tim Internal & Admin</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-black">
                {internalUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Semua</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-black">
                {users.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeCategory === 'clients'
                  ? 'Cari nama atau email client...'
                  : activeCategory === 'internal'
                  ? 'Cari admin / support...'
                  : 'Cari pengguna...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3.5 px-6">
                  {activeCategory === 'clients' ? 'Client' : activeCategory === 'internal' ? 'Staf Internal' : 'Pengguna'}
                </th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status Sesi</th>
                <th className="py-3.5 px-4">Terakhir Login</th>
                {activeCategory !== 'internal' && <th className="py-3.5 px-4">Website Dibuat</th>}
                <th className="py-3.5 px-4">Perangkat & IP</th>
                <th className="py-3.5 px-6 text-right">Rincian & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                    Memuat data pengguna dari PostgreSQL...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-xs">
                    Tidak ada data pengguna pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const userInitials = u.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : u.role === 'support'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {userInitials || 'U'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block truncate">{u.name}</span>
                            <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'support'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Online Status */}
                      <td className="py-4 px-4">
                        {u.isCurrentlyOnline ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Last Login Time */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11px]">{formatDate(u.lastLoginAt)}</span>
                        </div>
                      </td>

                      {/* Websites Count (Hidden for internal) */}
                      {activeCategory !== 'internal' && (
                        <td className="py-4 px-4">
                          <div className="text-[11px]">
                            <span className="font-black text-slate-900">{u.totalWebsites}</span>
                            <span className="text-slate-400"> website</span>
                            {u.publishedWebsites > 0 && (
                              <span className="text-emerald-600 font-bold block text-[10px]">
                                ({u.publishedWebsites} Live)
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Device & IP */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="text-[11px] truncate text-slate-500" title={u.lastDeviceInfo || '-'}>
                          {u.lastDeviceInfo ? (
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{u.lastDeviceInfo}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                          {u.lastIpAddress && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              IP: {u.lastIpAddress}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Detail View Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUserId(u.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 transition active:scale-95 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Detail &rarr;</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <p>
            Menampilkan <strong className="text-slate-700">{filteredUsers.length}</strong> pengguna dalam kategori ini
          </p>
        </div>
      </div>
    </div>
  );
};
