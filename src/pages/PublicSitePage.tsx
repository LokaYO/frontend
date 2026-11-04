import React, { useState, useEffect } from 'react';
import { Website } from '../types/schema';
import { websiteService } from '../services/website.service';
import { WebsiteRenderer } from '../components/renderer/WebsiteRenderer';
import { AlertCircle, ArrowLeft, Globe, ShieldAlert } from 'lucide-react';

interface Props {
  slug: string;
}

export const PublicSitePage: React.FC<Props> = ({ slug }) => {
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspendReason, setSuspendReason] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicSite() {
      try {
        setLoading(true);
        setErrorMsg(null);
        setIsDraft(false);
        setIsSuspended(false);
        setSuspendReason(null);

        const data = await websiteService.getPublicWebsite(slug);
        setWebsite(data);

        // Track view analitik publik otomatis
        fetch(`/api/public/sites/${slug}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'view' }),
        }).catch(() => {});
        websiteService.trackPublicEvent(slug, 'view');
      } catch (err: any) {
        console.error('Fetch public site failed:', err);
        const isSuspendedError =
          Boolean(err.details?.isSuspended) ||
          Boolean(err.isSuspended) ||
          (typeof err.message === 'string' && (
            err.message.toLowerCase().includes('ditangguhkan') ||
            err.message.toLowerCase().includes('suspended')
          ));

        if (isSuspendedError) {
          setIsSuspended(true);
          setSuspendReason(
            err.details?.suspendReason ||
            err.suspendReason ||
            err.message ||
            'Website ini dinonaktifkan sementara oleh Administrator karena melanggar ketentuan layanan platform LOKA.'
          );
        } else if (err.details?.isDraft || err.isDraft || err.status === 403) {
          setIsDraft(true);
        }
        setErrorMsg(err.message || 'Halaman tidak dapat diakses.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPublicSite();
    }
  }, [slug]);

  // Dynamically update document title and meta OpenGraph tags for SEO
  useEffect(() => {
    if (!website) return;

    const info = (website.businessInfo || {}) as any;
    const title = info.seoTitle || info.name || website.name || 'Website Resmi';
    const description = info.seoDescription || info.tagline || info.description || 'Selamat datang di website resmi kami.';
    const imageUrl = info.ogImageUrl || info.logo || '';

    document.title = title;

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', window.location.href);
    if (imageUrl) {
      setMeta('property', 'og:image', imageUrl);
      setMeta('name', 'twitter:image', imageUrl);
    }
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }, [website]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Memuat landing page...</p>
        </div>
      </div>
    );
  }

  if (isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-2xl border border-red-500/30 text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800/60 inline-block">
              Tindakan Administrator
            </span>
            <h2 className="text-xl font-black text-white">Website Telah Ditangguhkan</h2>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Alasan Penangguhan:</span>
            <p className="text-xs text-red-300 font-medium leading-relaxed">
              {suspendReason || 'Website ini dinonaktifkan sementara oleh Administrator karena melanggar ketentuan layanan platform LOKA.'}
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jika Anda adalah pemilik website ini dan merasa ada kekeliruan, silakan hubungi tim administrator platform untuk klarifikasi dan verifikasi akun.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </a>
        </div>
      </div>
    );
  }

  if (isDraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Website Belum Dipublikasikan</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Halaman ini masih dalam status draft oleh pemilik bisnis. Silakan periksa kembali nanti atau hubungi pemilik usaha secara langsung.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Beranda LOKA</span>
          </a>
        </div>
      </div>
    );
  }

  if (errorMsg || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Halaman Tidak Ditemukan (404)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {errorMsg || 'Alamat website yang Anda tuju tidak ditemukan atau telah dipindahkan.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
          >
            <span>Buka LOKA</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <WebsiteRenderer
        sections={website.sections || []}
        theme={website.theme}
        businessInfo={website.businessInfo}
        slug={slug}
        isEditor={false}
        ownerPlan={website.ownerPlan}
      />
    </div>
  );
};
