import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PublicSitePage } from './pages/PublicSitePage';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { getPublicSiteUrl } from './utils/url.utils';

function MainApp() {
  const { user, loading, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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

  // 1. PRIORITY 1: Direct Path URL (Local & Fallback: /sites/:slug)
  const siteMatch = currentPath.match(/^\/sites\/([a-zA-Z0-9_-]+)/);
  if (siteMatch) {
    const slug = siteMatch[1];
    const host = window.location.hostname.toLowerCase();
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);

    // Di subdomain toko sendiri (misal: paw-tail-care.ruuby.my.id/sites/paw-tail-care),
    // hapus path /sites/:slug agar URL bersih tanpa loop
    const parts = host.split('.');
    const isAlreadyOnSubdomain =
      !isLocalhost &&
      /\.(my|co|web|ac|sch|or|biz|go|mil)\.[a-z]{2,3}$/.test(host) &&
      parts.length >= 4 &&
      parts[0] === slug;

    if (isAlreadyOnSubdomain) {
      window.history.replaceState({}, '', '/');
      return <PublicSitePage slug={slug} />;
    }

    // Jika di root domain production (ruuby.my.id / *.web.app)
    if (!isLocalhost && (host === 'ruuby.my.id' || host === 'www.ruuby.my.id' || host.endsWith('.web.app') || host.endsWith('.firebaseapp.com'))) {
      const targetUrl = getPublicSiteUrl(slug);
      // Cegah reload jika URL tujuan sama persis dengan URL saat ini
      if (window.location.href !== targetUrl) {
        window.location.replace(targetUrl);
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#425B9A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Mengarahkan ke subdomain resmi https://{slug}.ruuby.my.id...</p>
            </div>
          </div>
        );
      }
    }

    return <PublicSitePage slug={slug} />;
  }

  // 2. Query Parameter Fallback (misal: http://localhost:5173/?site=kopi-senja)
  const queryParams = new URLSearchParams(window.location.search);
  const querySlug = queryParams.get('site') || queryParams.get('slug');
  if (querySlug) {
    return <PublicSitePage slug={querySlug} />;
  }

  // 3. PRIORITY 2: Wildcard Subdomain Detection (misal: kopi-senja.loka.id atau kopi-senja.ruubia.my.id)
  const host = window.location.hostname.toLowerCase();
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);

  if (!isIpAddress) {
    const parts = host.split('.');

    // Helper: Ekstraksi subdomain yang akurat dengan mempertimbangkan ccTLD (.my.id, .co.id) dan platform domain (*.web.app)
    let subdomainCandidate: string | null = null;

    if (parts.length === 2 && parts[1] === 'localhost') {
      subdomainCandidate = parts[0];
    } else if (
      host.endsWith('.web.app') ||
      host.endsWith('.firebaseapp.com') ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.pages.dev')
    ) {
      // Pada *.web.app, root domain adalah "project.web.app" (3 part). Subdomain toko butuh 4 part (toko.project.web.app)
      if (parts.length >= 4) {
        subdomainCandidate = parts[0];
      }
    } else if (/\.(my|co|web|ac|sch|or|biz|go|mil)\.[a-z]{2,3}$/.test(host)) {
      // Pada domain 2 tingkat seperti *.my.id (contoh: ruubia.my.id = 3 part), subdomain butuh 4 part (toko.ruubia.my.id)
      if (parts.length >= 4) {
        subdomainCandidate = parts[0];
      }
    } else if (parts.length >= 3) {
      // Pada domain biasa seperti *.id / *.com (contoh: loka.id = 2 part), subdomain butuh 3 part (toko.loka.id)
      subdomainCandidate = parts[0];
    }

    const isSystemSubdomain =
      subdomainCandidate && ['www', 'app', 'admin', 'api', 'localhost'].includes(subdomainCandidate);

    if (subdomainCandidate && !isSystemSubdomain) {
      return <PublicSitePage slug={subdomainCandidate} />;
    }
  }

  // Auth Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#425B9A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memeriksa sesi pengguna...</p>
        </div>
      </div>
    );
  }

  const isAdminRoute = currentPath === '/admin';
  const isLoginRoute = currentPath === '/login';

  // 1. JIKA BELUM LOGIN:
  if (!user) {
    // Jika user mengakses /admin -> Tampilkan Halaman Login Khusus Admin
    if (isAdminRoute) {
      return (
        <AdminLoginPage
          onNavigateHome={() => navigate('/')}
          onNavigateUserLogin={() => navigate('/login')}
        />
      );
    }
    // Jika user mengakses /login -> Tampilkan Halaman Login Merchant / UMKM
    if (isLoginRoute) {
      return (
        <AuthPage
          initialMode={authMode}
          onNavigateHome={() => navigate('/')}
          onNavigateAdmin={() => navigate('/admin')}
        />
      );
    }
    // Default di / -> Tampilkan Landing Page Utama Profesional LOKA
    return (
      <LandingPage
        onTryNow={() => {
          setAuthMode('register');
          navigate('/login');
        }}
        onLogin={() => {
          setAuthMode('login');
          navigate('/login');
        }}
        onAdminLogin={() => navigate('/admin')}
      />
    );
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
              className="w-full py-2.5 bg-[#425B9A] hover:bg-[#354a7d] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
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
        const publicUrl = getPublicSiteUrl(slug);
        const host = window.location.hostname.toLowerCase();
        const isLocal = host === 'localhost' || host === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
        if (!isLocal) {
          window.open(publicUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.history.pushState({}, '', `/sites/${slug}`);
          setCurrentPath(`/sites/${slug}`);
        }
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
