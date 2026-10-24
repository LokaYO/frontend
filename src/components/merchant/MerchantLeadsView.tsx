import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { websiteService } from '../../services/website.service';
import { Website } from '../../types/schema';
import { useToast } from '../../context/ToastContext';
import {
  Inbox,
  Search,
  MessageCircle,
  Phone,
  Trash2,
  CheckCircle2,
  Calendar,
  Download,
  Filter,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Mail,
  User,
  Tag,
} from 'lucide-react';

export interface LeadItem {
  id: string;
  websiteId: string;
  websiteName?: string;
  websiteSlug?: string;
  name: string;
  phone: string;
  message: string;
  serviceInterest?: string;
  status: 'unread' | 'read';
  createdAt: string;
}

interface Props {
  websites: Website[];
}

export const MerchantLeadsView: React.FC<Props> = ({ websites }) => {
  const toast = useToast();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await websiteService.getAllUserLeads();
      setLeads(data);
    } catch (err: any) {
      console.error('Failed to load user leads:', err);
      toast.error('Gagal Memuat Pesan', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleMarkRead = async (websiteId: string, leadId: string) => {
    try {
      setActionLoading(leadId);
      await websiteService.markLeadRead(websiteId, leadId);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: 'read' } : l))
      );
      toast.success('Pesan Ditandai Telah Dibaca');
    } catch (err: any) {
      toast.error('Gagal Memperbarui Status', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLead = async (websiteId: string, leadId: string) => {
    if (!window.confirm('Hapus pesan kontak ini dari kotak masuk Anda?')) return;
    try {
      setActionLoading(leadId);
      await websiteService.deleteLead(websiteId, leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      toast.success('Pesan Berhasil Dihapus');
    } catch (err: any) {
      toast.error('Gagal Menghapus Pesan', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplyWhatsApp = (lead: LeadItem) => {
    let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    const businessName = lead.websiteName || 'Layanan Kami';
    const text = `Halo Kak ${lead.name}, terima kasih sudah menghubungi ${businessName} melalui formulir website kami.\n\nMengenai pesan Anda: "${lead.message}"\n\nAda yang bisa kami bantu lebih lanjut Kak?`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');

    // Automatically mark as read when replied
    if (lead.status === 'unread') {
      handleMarkRead(lead.websiteId, lead.id);
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Nama Pelanggan', 'Nomor Telepon/WA', 'Layanan Diminati', 'Website Asal', 'Isi Pesan', 'Status', 'Tanggal Masuk'];
    const rows = filteredLeads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${(l.serviceInterest || '-').replace(/"/g, '""')}"`,
      `"${(l.websiteName || '-').replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.status === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}"`,
      `"${new Date(l.createdAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_pelanggan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('File CSV Berhasil Diunduh', `${filteredLeads.length} data kontak siap digunakan.`);
  };

  const unreadCount = leads.filter((l) => l.status === 'unread').length;

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      const matchSite =
        selectedSiteFilter === 'all' || l.websiteId === selectedSiteFilter;
      const matchStatus =
        statusFilter === 'all' || l.status === statusFilter;
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.serviceInterest && l.serviceInterest.toLowerCase().includes(q)) ||
        l.message.toLowerCase().includes(q) ||
        (l.websiteName && l.websiteName.toLowerCase().includes(q));

      return matchSite && matchStatus && matchSearch;
    });
  }, [leads, selectedSiteFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Inbox className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kotak Masuk & Leads Pelanggan
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white animate-pulse">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Semua pesan, pertanyaan konsultasi, dan nomor kontak yang dikirim oleh pengunjung melalui formulir website bisnis Anda terkumpul di sini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLeads}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer disabled:opacity-50"
            title="Segarkan pesan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            title="Unduh data kontak pelanggan ke format Excel/CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Pesan Masuk</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{leads.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Dari seluruh website Anda</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Belum Ditindaklanjuti</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{unreadCount}</p>
          <span className="text-[10px] text-blue-500 font-semibold mt-1 block">Prioritas follow-up WA</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sudah Dihubungi</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{leads.filter((l) => l.status === 'read').length}</p>
          <span className="text-[10px] text-emerald-600/80 mt-1 block">Telah dibuka/dibalas</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Website Sumber</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{websites.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Landing page aktif</span>
        </div>
      </div>

      {/* ── Table & Filters Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({leads.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('unread')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'unread'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('read')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'read'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sudah Dibaca ({leads.filter((l) => l.status === 'read').length})
              </button>
            </div>

            {/* Website Selector Dropdown */}
            {websites.length > 1 && (
              <select
                value={selectedSiteFilter}
                onChange={(e) => setSelectedSiteFilter(e.target.value)}
                className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 cursor-pointer"
              >
                <option value="all">Semua Website</option>
                {websites.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, nomor WA, atau pesan..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Leads Content List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Memuat pesan pelanggan...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 px-6 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <Inbox className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Belum Ada Pesan Masuk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Saat pengunjung mengisi formulir pada seksi Kontak & Lokasi di landing page Anda, pesan mereka akan otomatis muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => {
              const isUnread = lead.status === 'unread';

              return (
                <div
                  key={lead.id}
                  className={`p-5 sm:p-6 transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 ${
                    isUnread ? 'bg-blue-50/25 hover:bg-blue-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Lead Info & Message */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        isUnread
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lead.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {lead.name}
                        </span>

                        {isUnread ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                            Baru
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                            Dibaca
                          </span>
                        )}

                        {lead.serviceInterest && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                            <Tag className="w-2.5 h-2.5" />
                            {lead.serviceInterest}
                          </span>
                        )}

                        {lead.websiteName && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            via <strong className="text-slate-600">{lead.websiteName}</strong>
                          </span>
                        )}
                      </div>

                      {/* Phone & Date */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {lead.phone}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(lead.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Message Content Bubble */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed max-w-3xl">
                        &ldquo;{lead.message}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center md:flex-col items-end gap-2 shrink-0 self-end md:self-start">
                    {/* Primary Reply WhatsApp Button */}
                    <button
                      type="button"
                      onClick={() => handleReplyWhatsApp(lead)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-sm active:scale-95 transition cursor-pointer"
                      title="Buka chat WhatsApp langsung ke nomor pelanggan ini"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Balas via WA</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(lead.websiteId, lead.id)}
                          disabled={actionLoading === lead.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Tandai sudah dibaca"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.websiteId, lead.id)}
                        disabled={actionLoading === lead.id}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Hapus pesan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>
            Menampilkan <strong>{filteredLeads.length}</strong> dari {leads.length} pesan
          </span>
        </div>
      </div>
    </div>
  );
};

