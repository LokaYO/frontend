import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PublicSitePage } from './pages/PublicSitePage';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

function MainApp() {
  const { user, loading, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check if public site URL: /sites/:slug
  const siteMatch = currentPath.match(/^\/sites\/([a-zA-Z0-9_-]+)/);
  if (siteMatch) {
    const slug = siteMatch[1];
    return <PublicSitePage slug={slug} />;
  }

  // Auth Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memeriksa sesi pengguna...</p>
        </div>
      </div>
    );
  }

  const isAdminRoute = currentPath === '/admin';

  // 1. JIKA BELUM LOGIN:
  if (!user) {
    // Jika user mengakses /admin -> Tampilkan Halaman Login Khusus Admin (Dark/Security theme)
    if (isAdminRoute) {
      return <AdminLoginPage onNavigateHome={() => navigate('/')} />;
    }
    // Jika di / -> Tampilkan Halaman Login Pengguna Biasa / Client
    return <AuthPage onNavigateAdmin={() => navigate('/admin')} />;
  }

  // 2. JIKA SUDAH LOGIN TAPI DIA USER BIASA MENCOBA MASUK KE /admin:
  if (isAdminRoute && user.role !== 'admin' && user.role !== 'support') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Akses Terbatas Administrator</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Akun Anda (<strong className="text-slate-200">{user.email}</strong>) terdaftar sebagai{' '}
              <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-bold uppercase text-[10px]">
                {user.role}
              </span>
              . Anda tidak memiliki otoritas untuk mengakses dashboard monitoring admin.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard Website Saya</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Ganti Akun)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'support';

  // 3. JIKA USER SEDANG EDIT WEBSITE (Hanya Role 'user' yang bisa membuka editor)
  if (editingWebsiteId && !isAdmin) {
    return (
      <EditorPage
        websiteId={editingWebsiteId}
        onBackToDashboard={() => setEditingWebsiteId(null)}
      />
    );
  }

  // 4. TAMPILKAN DASHBOARD UTAMA
  return (
    <DashboardPage
      initialNav={isAdmin ? 'admin' : undefined}
      onOpenEditor={(websiteId) => {
        if (isAdmin) return; // Admin purely monitoring
        setEditingWebsiteId(websiteId);
      }}
      onOpenPublicSite={(slug) => {
        window.history.pushState({}, '', `/sites/${slug}`);
        setCurrentPath(`/sites/${slug}`);
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
