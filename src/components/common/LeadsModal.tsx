import React, { useEffect, useState } from 'react';
import {
  X,
  MessageSquare,
  Search,
  CheckCircle2,
  Trash2,
  Phone,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Inbox,
  User,
  Tag,
} from 'lucide-react';
import { Website, Lead } from '../../types/schema';
import { websiteService } from '../../services/website.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  website: Website | null;
}

export const LeadsModal: React.FC<Props> = ({ isOpen, onClose, website }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async () => {
    if (!website) return;
    try {
      setLoading(true);
      const data = await websiteService.getWebsiteLeads(website.id);
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && website) {
      fetchLeads();
    }
  }, [isOpen, website]);

  if (!isOpen || !website) return null;

  const handleMarkRead = async (leadId: string) => {
    try {
      await websiteService.markLeadRead(website.id, leadId);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: 'read' as const } : l))
      );
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!window.confirm('Hapus pesan ini dari buku tamu?')) return;
    try {
      await websiteService.deleteLead(website.id, leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      console.error('Delete lead failed:', err);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = leads.filter((l) => l.status === 'unread').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Kotak Masuk Leads & Buku Tamu
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Pesan dari formulir kontak website &ldquo;{website.name}&rdquo;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor telepon, atau kata kunci..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">
            Total {leads.length} pesan
          </span>
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Memuat pesan masuk...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Belum Ada Pesan Masuk</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Ketika calon pelanggan mengisi formulir kontak di website Anda, pesan akan otomatis tersimpan di sini.
                </p>
              </div>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isUnread = lead.status === 'unread';
              let cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
              if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
              const waReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Halo ${lead.name}, terima kasih telah menghubungi ${website.name}. Menanggapi pesan Anda: "${lead.message.slice(0, 80)}..."`
              )}`;

              return (
                <div
                  key={lead.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 bg-white ${
                    isUnread
                      ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-xs'
                      : 'border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-500">{lead.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(lead.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {lead.serviceInterest && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                      <Tag className="w-3 h-3" />
                      <span>Minat: {lead.serviceInterest}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    &ldquo;{lead.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(lead.id)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Sudah Dibaca</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleMarkRead(lead.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Balas WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

