import React, { useState, useEffect } from 'react';
import { Website } from '../types/schema';
import { websiteService } from '../services/website.service';
import { WebsiteRenderer } from '../components/renderer/WebsiteRenderer';
import { ArrowLeft, Globe, ShieldAlert } from 'lucide-react';
import mascotImg from '../assets/not-published/mascot.png';
import blobShapeImg from '../assets/not-published/group320.svg';

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
      <div
        className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(244deg, #E1F4FF 0%, #FFFFFF 100%)' }}
      >
        {/* Large Decorative Ellipse — bottom-left blob glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 869,
            height: 869,
            left: -216,
            bottom: -300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #BFE6FF 0%, transparent 70%)',
            opacity: 0.5,
          }}
        />

        {/* Main center column */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">

          {/* Mascot + Blob Illustration */}
          <div className="relative flex items-center justify-center w-full mb-6" style={{ height: 380 }}>
            {/* Organic blob background shape */}
            <img
              src={blobShapeImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{ transform: 'scale(1.08)' }}
            />

            {/* Mascot */}
            <div style={{ width: 300, height: 300 }}>
              <img
                src={mascotImg}
                alt="Maskot Loka"
                className="w-full h-full object-contain drop-shadow-2xl select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Text & CTA */}
          <div className="flex flex-col items-center gap-5 text-center px-4">
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#1E293B] leading-tight">
              Website Belum Dipublikasikan!
            </h1>

            <p className="font-poppins text-base sm:text-lg text-[#101010]/75 leading-relaxed max-w-[520px]">
              Halaman ini masih dalam status draft oleh pemilik bisnis.<br className="hidden sm:block" />
              Silahkan periksa kembali nanti atau hubungi pemilik usaha secara langsung.
            </p>

            <a
              href="/"
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#425B9A] hover:bg-[#354a7d] active:scale-95 text-white font-poppins font-medium text-[15px] rounded-[8px] shadow-md shadow-[#425B9A]/30 transition-all duration-200 cursor-pointer mt-1"
            >
              <ArrowLeft className="w-[14px] h-[12px] shrink-0" />
              <span>Ke Beranda Loka</span>
            </a>
          </div>
        </div>

        {/* Float keyframe injected via style tag */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
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
