import React, { useState, useEffect, useCallback } from 'react';
import { adminService, AdminAnnouncement } from '../../services/admin.service';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Power,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminAnnouncementsTab: React.FC = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [annToDelete, setAnnToDelete] = useState<AdminAnnouncement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');
  const [showForm, setShowForm] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Fetch announcements error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.warning('Form Belum Lengkap', 'Judul dan isi pengumuman wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminService.createAnnouncement({
        title: title.trim(),
        message: message.trim(),
        type,
      });
      setAnnouncements((prev) => [res.announcement, ...prev]);
      setTitle('');
      setMessage('');
      setType('info');
      setShowForm(false);
      toast.success(
        'Pengumuman Berhasil Disiarkan!',
        `Banner "${res.announcement.title}" kini otomatis tampil di dashboard seluruh client.`
      );
    } catch (err: any) {
      toast.error('Gagal Membuat Pengumuman', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (ann: AdminAnnouncement) => {
    try {
      setActionLoading(ann.id);
      const res = await adminService.toggleAnnouncement(ann.id);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === ann.id ? { ...a, isActive: res.isActive } : a))
      );
      if (res.isActive) {
        toast.success('Pengumuman Diaktifkan', `"${ann.title}" kembali tayang.`);
      } else {
        toast.info('Pengumuman Dimatikan', `"${ann.title}" disembunyikan dari dashboard client.`);
      }
    } catch (err: any) {
      toast.error('Gagal Mengubah Status', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (ann: AdminAnnouncement) => {
    setAnnToDelete(ann);
  };

  const confirmDelete = async () => {
    if (!annToDelete) return;
    try {
      setIsDeleting(true);
      await adminService.deleteAnnouncement(annToDelete.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== annToDelete.id));
      toast.info('Pengumuman Dihapus', `"${annToDelete.title}" telah dihapus.`);
      setAnnToDelete(null);
    } catch (err: any) {
      toast.error('Gagal Menghapus', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = announcements.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      {/* ── Top Header & Action ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Megaphone className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Broadcast Pengumuman Sistem
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kirimkan banner notifikasi penting (maintenance, promo, update template) yang otomatis muncul di dashboard seluruh client.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadAnnouncements}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
            title="Segarkan pengumuman"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Tutup Formulir' : 'Buat Pengumuman Baru'}</span>
          </button>
        </div>
      </div>

      {/* ── Create Announcement Form Card ── */}
      {showForm && (
        <form
          onSubmit={handleCreateAnnouncement}
          className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Form Pengumuman Baru</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Maintenance Server Pukul 02:00 WIB"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipe / Urgensi Pengumuman
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('info')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      type === 'info'
                        ? 'bg-blue-50 border-blue-400 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Info Biasa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('warning')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      type === 'warning'
                        ? 'bg-amber-50 border-amber-400 text-amber-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Perhatian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('alert')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      type === 'alert'
                        ? 'bg-red-50 border-red-400 text-red-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Penting (Alert)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('success')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      type === 'success'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rilis Baru</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pesan Lengkap
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Jelaskan detail pengumuman yang ingin disampaikan ke seluruh client UMKM..."
                  className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white resize-none"
                  required
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pratinjau di Dashboard Client
              </span>
              <div
                className={`p-4 rounded-2xl border shadow-xs space-y-1.5 ${
                  type === 'alert'
                    ? 'bg-red-50/90 border-red-200 text-red-900'
                    : type === 'warning'
                    ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                    : type === 'success'
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                    : 'bg-blue-50/90 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      type === 'alert'
                        ? 'bg-red-600 text-white'
                        : type === 'warning'
                        ? 'bg-amber-600 text-white'
                        : type === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {type === 'alert' ? 'PENTING' : type === 'warning' ? 'PERHATIAN' : 'PENGUMUMAN'}
                  </span>
                  <h4 className="text-xs font-bold truncate">
                    {title || 'Judul Pengumuman Anda'}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed opacity-90 line-clamp-3">
                  {message || 'Isi detail pesan broadcast pengumuman akan tampil di sini bagi seluruh pengunjung dashboard...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Menyimpan...' : 'Siarkan Pengumuman Sekarang'}
            </button>
          </div>
        </form>
      )}

      {/* ── Announcements List ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Daftar Pengumuman Aktif & Arsip
            </h3>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md">
              {activeCount} Aktif
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Memuat pengumuman...
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada pengumuman yang dibuat. Klik tombol di atas untuk membuat broadcast pertama.
            </div>
          ) : (
            announcements.map((ann) => {
              const typeBadge = {
                alert: 'bg-red-100 text-red-700 border-red-200',
                warning: 'bg-amber-100 text-amber-700 border-amber-200',
                success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                info: 'bg-blue-100 text-blue-700 border-blue-200',
              }[ann.type] || 'bg-blue-100 text-blue-700 border-blue-200';

              return (
                <div
                  key={ann.id}
                  className={`p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    ann.isActive ? 'bg-white' : 'bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${typeBadge}`}>
                        {ann.type}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {ann.title}
                      </h4>
                      {ann.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Tayang Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {ann.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(ann.createdAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {ann.authorName && (
                        <span>Oleh: <strong className="text-slate-600">{ann.authorName}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(ann)}
                      disabled={actionLoading === ann.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        ann.isActive
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                      title={ann.isActive ? 'Nonaktifkan broadcast' : 'Aktifkan kembali broadcast'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{ann.isActive ? 'Matikan' : 'Aktifkan'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(ann)}
                      disabled={actionLoading === ann.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Hapus pengumuman permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Announcement Modal */}
      <ConfirmModal
        isOpen={!!annToDelete}
        title="Hapus Pengumuman Siaran?"
        message={
          annToDelete ? (
            <span>
              Yakin ingin menghapus pengumuman <strong className="text-slate-800">"{annToDelete.title}"</strong>? Pengumuman ini akan ditarik permanen dari seluruh dashboard pengguna.
            </span>
          ) : ''
        }
        confirmText="Ya, Hapus Pengumuman"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setAnnToDelete(null)}
      />
    </div>
  );
};
