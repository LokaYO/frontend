import React, { useState, useEffect, useCallback } from 'react';
import { adminService, AuditLogItem } from '../../services/admin.service';
import { getPublicSiteDisplayUrl } from '../../utils/url.utils';
import {
  History,
  Search,
  RefreshCw,
  Clock,
  User,
  ShieldAlert,
  Globe,
  Megaphone,
  Laptop,
  CheckCircle,
  Filter,
} from 'lucide-react';

export const AdminAuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        limit: 100,
        action: actionFilter || undefined,
      });
      setLogs(res.logs);
      setTotal(res.total);
    } catch (err) {
      console.error('Fetch audit logs error:', err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const userName = (log.userName || '').toLowerCase();
    const userEmail = (log.userEmail || '').toLowerCase();
    const action = log.action.toLowerCase();
    const detailsStr = JSON.stringify(log.details || {}).toLowerCase();
    return (
      userName.includes(term) ||
      userEmail.includes(term) ||
      action.includes(term) ||
      detailsStr.includes(term)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'USER_REGISTER':
        return {
          label: 'Registrasi User',
          class: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'USER_LOGIN':
        return {
          label: 'Login Akun',
          class: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'WEBSITE_CREATE':
        return {
          label: 'Buat Website',
          class: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
      case 'WEBSITE_PUBLISH':
        return {
          label: 'Publikasi Live',
          class: 'bg-teal-100 text-teal-700 border-teal-200',
        };
      case 'WEBSITE_UNPUBLISH':
        return {
          label: 'Ubah ke Draft',
          class: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'WEBSITE_SUSPEND':
        return {
          label: 'Takedown / Suspend',
          class: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'WEBSITE_UNSUSPEND':
        return {
          label: 'Pulihkan Suspend',
          class: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
      case 'BROADCAST_CREATE':
        return {
          label: 'Buat Broadcast',
          class: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'BROADCAST_DELETE':
        return {
          label: 'Hapus Broadcast',
          class: 'bg-rose-100 text-rose-700 border-rose-200',
        };
      case 'BROADCAST_ACTIVATE':
      case 'BROADCAST_DEACTIVATE':
        return {
          label: 'Toggle Broadcast',
          class: 'bg-violet-100 text-violet-700 border-violet-200',
        };
      default:
        return {
          label: action,
          class: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const renderDetailsSummary = (log: AuditLogItem) => {
    const d = log.details || {};
    if (log.action === 'WEBSITE_SUSPEND') {
      return (
        <span className="text-red-700">
          Website: <strong>{d.name || d.websiteId}</strong> (Alasan: &ldquo;{d.reason}&rdquo;)
        </span>
      );
    }
    if (log.action === 'WEBSITE_CREATE' || log.action === 'WEBSITE_PUBLISH' || log.action === 'WEBSITE_UNPUBLISH') {
      return (
        <span>
          Website: <strong>{d.name || d.websiteId}</strong> {d.slug ? `(/sites/${d.slug})` : ''}
          Website: <strong>{d.name || d.websiteId}</strong> {d.slug ? `(${getPublicSiteDisplayUrl(d.slug)})` : ''}
        </span>
      );
    }
    if (log.action === 'USER_REGISTER') {
      return (
        <span>
          User baru: <strong>{d.name}</strong> ({d.email})
        </span>
      );
    }
    if (log.action === 'BROADCAST_CREATE') {
      return (
        <span>
          Pengumuman: <strong>&ldquo;{d.title}&rdquo;</strong> (Tipe: {d.type})
        </span>
      );
    }
    if (log.action === 'USER_LOGIN') {
      return (
        <span className="text-slate-500">
          Login berhasil sebagai role {d.role || 'user'}
        </span>
      );
    }
    return <span className="font-mono text-[10px] text-slate-500">{JSON.stringify(d)}</span>;
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <History className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Log Aktivitas Sistem (Audit Trail)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap aksi krusial: registrasi pengguna, publikasi website, takedown konten, dan broadcast pengumuman.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Log</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-purple-500 text-slate-700"
          >
            <option value="">Semua Jenis Aksi</option>
            <option value="USER_REGISTER">Registrasi User</option>
            <option value="USER_LOGIN">Login User</option>
            <option value="WEBSITE_CREATE">Pembuatan Website</option>
            <option value="WEBSITE_PUBLISH">Publikasi Live</option>
            <option value="WEBSITE_SUSPEND">Takedown / Suspend</option>
            <option value="WEBSITE_UNSUSPEND">Pemulihan Suspend</option>
            <option value="BROADCAST_CREATE">Broadcast Pengumuman</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user, aksi, atau detail..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
          />
        </div>
      </div>

      {/* ── Audit Logs Feed ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Waktu Terjadi</th>
                <th className="py-3 px-4">Pengguna / Pelaku</th>
                <th className="py-3 px-4">Jenis Aksi</th>
                <th className="py-3 px-4">Rincian Perubahan (Payload)</th>
                <th className="py-3 px-6 text-right">IP & Perangkat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Memuat log aktivitas...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada log aktivitas yang tercatat sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      {/* Time */}
                      <td className="py-3.5 px-6 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {new Date(log.createdAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.userName ? (
                          <div>
                            <span className="font-extrabold text-slate-900 block truncate max-w-[160px]">
                              {log.userName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                              {log.userEmail}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sistem / Anonim</span>
                        )}
                      </td>

                      {/* Action Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${badge.class}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-xs text-slate-700 leading-relaxed">
                          {renderDetailsSummary(log)}
                        </div>
                      </td>

                      {/* Device & IP */}
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="text-[11px] text-slate-400">
                          {log.ipAddress && (
                            <span className="font-mono block text-slate-600">IP: {log.ipAddress}</span>
                          )}
                          {log.userAgent && (
                            <span className="text-[10px] truncate max-w-[140px] inline-block text-slate-400" title={log.userAgent}>
                              {log.userAgent.slice(0, 30)}...
                            </span>
                          )}
                          {!log.ipAddress && !log.userAgent && <span>-</span>}
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
          <span>Menampilkan <strong>{filteredLogs.length}</strong> dari total <strong>{total}</strong> catatan log</span>
        </div>
      </div>
    </div>
  );
};
