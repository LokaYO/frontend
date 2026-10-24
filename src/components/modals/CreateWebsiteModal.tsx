import React, { useState } from 'react';
import { PRESET_TEMPLATES, PresetTemplate } from '../../templates/presetTemplates';
import { BusinessInfo, SectionType } from '../../types/schema';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/ai.service';
import { websiteService } from '../../services/website.service';
import {
  X,
  Sparkles,
  LayoutTemplate,
  ArrowRight,
  ArrowLeft,
  Check,
  Coffee,
  Scissors,
  Wrench,
  Utensils,
  ShoppingBag,
  Store,
  Layers,
  MapPin,
  MessageCircle,
  Crown,
  Palette,
  PenTool,
  Sliders,
} from 'lucide-react';

const createStarterScratchSections = (
  businessName: string,
  category: string,
  whatsapp: string,
  primaryColor: string
) => {
  const cleanPhone = whatsapp.replace(/\D/g, '') || '6281234567890';
  return [
    {
      type: 'navbar' as SectionType,
      content: {
        brandName: businessName,
        logoUrl: '',
        links: [
          { label: 'Beranda', href: '#hero' },
          { label: 'Tentang Kami', href: '#about' },
          { label: 'Layanan', href: '#services' },
          { label: 'Kontak', href: '#contact' },
        ],
        ctaText: 'Hubungi WhatsApp',
        ctaUrl: `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(businessName)},%20saya%20tertarik%20dengan%20layanan%20Anda`,
        phone: whatsapp || '0812-3456-7890',
      },
    },
    {
      type: 'hero' as SectionType,
      content: {
        title: `Selamat Datang di ${businessName}`,
        headline: `Selamat Datang di ${businessName}`,
        description: `Solusi profesional terpercaya untuk kebutuhan ${category.toLowerCase()} Anda. Siap melayani dengan produk & layanan terbaik.`,
        subheadline: `Solusi profesional terpercaya untuk kebutuhan ${category.toLowerCase()} Anda. Siap melayani dengan produk & layanan terbaik.`,
        badge: 'Usaha Lokal Terverifikasi',
        badgeText: 'Usaha Lokal Terverifikasi',
        buttonText: 'Hubungi Kami via WhatsApp',
        ctaText: 'Hubungi Kami via WhatsApp',
        buttonUrl: `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(businessName)},%20saya%20ingin%20tanya-tanya`,
        ctaUrl: `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(businessName)},%20saya%20ingin%20tanya-tanya`,
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
        layoutVariant: 'image-right',
      },
    },
    {
      type: 'services' as SectionType,
      content: {
        title: 'Layanan & Produk Pilihan',
        subtitle: 'Kustomisasi daftar produk, katalog harga, dan deskripsi layanan Anda di visual editor.',
        items: [
          {
            name: 'Layanan / Produk Utama',
            description: 'Penjelasan singkat mengenai keunggulan produk atau layanan unggulan bisnis Anda.',
            price: 'Hubungi Kami',
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          },
          {
            name: 'Paket / Layanan Populer',
            description: 'Pilihan favorit pelanggan dengan penawaran terbaik dan kualitas terjamin.',
            price: 'Hubungi Kami',
            imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
          },
          {
            name: 'Layanan Khusus & Kustom',
            description: 'Layanan khusus yang dapat disesuaikan langsung dengan kebutuhan pelanggan Anda.',
            price: 'Hubungi Kami',
            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
    },
    {
      type: 'contact' as SectionType,
      content: {
        title: 'Hubungi Kami Langsung',
        subtitle: 'Kunjungi lokasi kami atau langsung terhubung dengan admin kami via WhatsApp.',
        address: 'Alamat lengkap lokasi bisnis atau toko Anda',
        phone: whatsapp || '0812-3456-7890',
        whatsapp: cleanPhone,
        workingHours: 'Senin - Minggu: 09:00 - 21:00 WIB',
        mapEmbedUrl: '',
      },
    },
    {
      type: 'footer' as SectionType,
      content: {
        brandName: businessName,
        tagline: 'Kepuasan dan kenyamanan pelanggan adalah komitmen utama kami.',
        copyrightText: `© ${new Date().getFullYear()} ${businessName}. Seluruh hak cipta dilindungi.`,
      },
    },
  ];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onWebsiteCreated: (websiteId: string) => void;
  initialTemplate?: PresetTemplate | null;
  onOpenPricing?: () => void;
}

export const CreateWebsiteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onWebsiteCreated,
  initialTemplate,
  onOpenPricing,
}) => {
  const { token, user } = useAuth();
  const [step, setStep] = useState<'choose_method' | 'ai_form' | 'template_gallery' | 'custom_scratch'>('choose_method');
  const [selectedTemplate, setSelectedTemplate] = useState<PresetTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initialTemplate if opened directly from template gallery
  React.useEffect(() => {
    if (isOpen && initialTemplate) {
      setStep('template_gallery');
      setSelectedTemplate(initialTemplate);
      setTemplateSiteName(initialTemplate.name);
    }
  }, [isOpen, initialTemplate]);

  // AI Form State
  const [aiForm, setAiForm] = useState<BusinessInfo>({
    name: '',
    category: 'Coffee Shop & Kafe',
    description: '',
    location: '',
    whatsapp: '',
    instagram: '',
    services: '',
    targetCustomer: '',
    preferredStyle: 'modern',
  });

  // Template Form State
  const [templateSiteName, setTemplateSiteName] = useState('');

  // Scratch Form State
  const [scratchForm, setScratchForm] = useState({
    name: '',
    category: 'Coffee Shop & Kafe',
    whatsapp: '',
    primaryColor: '#425B9A',
    font: 'sans' as 'sans' | 'serif' | 'mono',
  });

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('choose_method');
    setSelectedTemplate(null);
    setLoading(false);
    setErrorMsg(null);
    setScratchForm({
      name: '',
      category: 'Coffee Shop & Kafe',
      whatsapp: '',
      primaryColor: '#425B9A',
      font: 'sans',
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Submit Custom Build from Scratch
  const handleCreateFromScratch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchForm.name.trim()) {
      setErrorMsg('Nama website atau bisnis wajib diisi');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setLoadingStatus('Menyiapkan kanvas website custom...');

      const initialSections = createStarterScratchSections(
        scratchForm.name.trim(),
        scratchForm.category,
        scratchForm.whatsapp.trim(),
        scratchForm.primaryColor
      );

      const created = await websiteService.createWebsite({
        name: scratchForm.name.trim(),
        businessInfo: {
          name: scratchForm.name.trim(),
          category: scratchForm.category,
          description: `Website resmi untuk ${scratchForm.name.trim()}.`,
          location: 'Indonesia',
          whatsapp: scratchForm.whatsapp.trim() || '6281234567890',
        },
        theme: {
          primaryColor: scratchForm.primaryColor,
          secondaryColor: '#0f172a',
          font: scratchForm.font,
          accentColor: '#76C0EC',
          backgroundColor: '#ffffff',
        },
        sections: initialSections,
      });

      handleClose();
      onWebsiteCreated(created.websiteId);
    } catch (err: any) {
      console.error('Scratch creation error:', err);
      setErrorMsg(err.message || 'Gagal membuat website baru');
    } finally {
      setLoading(false);
    }
  };

  // Submit AI Website Generation
  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiForm.name || !aiForm.description || !aiForm.location || !aiForm.whatsapp) {
      setErrorMsg('Harap lengkapi semua field bertanda bintang (*)');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setLoadingStatus('Gemini AI sedang menganalisis profil bisnis Anda...');

      setTimeout(() => {
        setLoadingStatus('Menyusun copywriting headline, value proposition & CTA...');
      }, 1500);

      setTimeout(() => {
        setLoadingStatus('Membangun struktur 9 section dan palet warna responsif...');
      }, 3000);

      const aiRes = await aiService.generateWebsite(aiForm);
      setLoadingStatus('Menyimpan ke database...');

      // Save as new website
      const created = await websiteService.createWebsite({
        name: aiForm.name,
        businessInfo: aiForm,
        theme: aiRes.data.theme,
        sections: aiRes.data.sections,
      });

      handleClose();
      onWebsiteCreated(created.websiteId);
    } catch (err: any) {
      console.error('AI generate failed:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat membuat website dengan AI.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Website from Template
  const handleSelectTemplateSubmit = async (template: PresetTemplate) => {
    const finalName = templateSiteName.trim() || template.name;
    try {
      setLoading(true);
      setErrorMsg(null);

      const created = await websiteService.createWebsite({
        name: finalName,
        templateId: template.id,
      });

      handleClose();
      onWebsiteCreated(created.websiteId);
    } catch (err: any) {
      console.error('Template create failed:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step !== 'choose_method' && (
              <button
                type="button"
                onClick={() => setStep('choose_method')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-base font-bold text-slate-900">
              {step === 'choose_method' && 'Buat Website Baru'}
              {step === 'ai_form' && '✨ Buat dengan Gemini AI'}
              {step === 'template_gallery' && '🎨 Pilih dari Template Siap Pakai'}
              {step === 'custom_scratch' && '🛠️ Kustomisasi Mandiri (Build from Scratch)'}
            </h3>
            {user?.plan === 'pro' && (
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>PRO: Clean URL</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: CHOOSE METHOD */}
          {step === 'choose_method' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h4 className="text-lg font-bold text-slate-900">Bagaimana Anda ingin memulainya?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pilih AI untuk dibuatkan copywriting & section otomatis, pilih template siap pakai, atau bangun dari nol dengan kustomisasi mandiri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Option A: AI */}
                <button
                  type="button"
                  onClick={() => setStep('ai_form')}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#425B9A] hover:bg-[#425B9A]/5 text-left transition-all group space-y-4 flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-[#425B9A] text-white flex items-center justify-center shadow-md shadow-[#425B9A]/20 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-6 h-6 text-[#76C0EC]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#425B9A] transition">
                        Generate dengan AI
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Cukup isi info bisnis Anda. AI akan meracik copywriting headline, deskripsi, layanan, dan section otomatis.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#425B9A] gap-1.5 pt-2">
                    <span>Mulai dengan AI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#76C0EC] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option B: Template */}
                <button
                  type="button"
                  onClick={() => setStep('template_gallery')}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#425B9A] hover:bg-[#76C0EC]/10 text-left transition-all group space-y-4 flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#425B9A] to-[#76C0EC] text-white flex items-center justify-center shadow-md shadow-[#76C0EC]/20 group-hover:scale-105 transition-transform">
                      <LayoutTemplate className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#425B9A] transition">
                        Gunakan Template
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Pilih dari 5 template bisnis lokal terpopuler: Coffee Shop, Barbershop, Laundry, Restoran, atau Bengkel.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#425B9A] gap-1.5 pt-2">
                    <span>Lihat Galeri Template</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#76C0EC] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option C: Build from Scratch / Custom */}
                <button
                  type="button"
                  onClick={() => setStep('custom_scratch')}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#425B9A] hover:bg-slate-50 text-left transition-all group space-y-4 flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                      <Palette className="w-6 h-6 text-[#76C0EC]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#425B9A] transition">
                        Kustomisasi Mandiri
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        Mulai dari nol atau kanvas bersih. Rancang bebas susunan komponen, warna, teks, dan section langsung di visual editor.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#425B9A] gap-1.5 pt-2">
                    <span>Build from Scratch</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#76C0EC] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2A: AI FORM */}
          {step === 'ai_form' && (
            <form onSubmit={handleGenerateAI} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Bisnis / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={aiForm.name}
                    onChange={(e) => setAiForm({ ...aiForm, name: e.target.value })}
                    placeholder="Contoh: Kopi Senja Roastery"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Bisnis *
                  </label>
                  <select
                    value={aiForm.category}
                    onChange={(e) => setAiForm({ ...aiForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A] bg-white"
                  >
                    <option value="Coffee Shop & Kafe">Coffee Shop & Kafe</option>
                    <option value="Barbershop & Grooming">Barbershop & Salon</option>
                    <option value="Laundry & Dry Clean">Laundry & Cuci Pakaian</option>
                    <option value="Restoran & Kuliner">Restoran & Rumah Makan</option>
                    <option value="Bengkel & Servis Otomotif">Bengkel & Servis Otomotif</option>
                    <option value="Klinik & Kesehatan">Klinik & Kesehatan</option>
                    <option value="Jasa & UMKM Lokal">Jasa & UMKM Lokal Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Bisnis & Keunggulan Utama *
                </label>
                <textarea
                  required
                  rows={3}
                  value={aiForm.description}
                  onChange={(e) => setAiForm({ ...aiForm, description: e.target.value })}
                  placeholder="Ceritakan apa yang Anda jual, apa keunggulannya, dan suasana tempat Anda..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi / Kota *
                  </label>
                  <input
                    type="text"
                    required
                    value={aiForm.location}
                    onChange={(e) => setAiForm({ ...aiForm, location: e.target.value })}
                    placeholder="Contoh: Jl. Sudirman, Bandar Lampung"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Pemesanan *
                  </label>
                  <input
                    type="text"
                    required
                    value={aiForm.whatsapp}
                    onChange={(e) => setAiForm({ ...aiForm, whatsapp: e.target.value })}
                    placeholder="Contoh: 6281234567890"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Layanan / Produk Utama
                  </label>
                  <input
                    type="text"
                    value={aiForm.services || ''}
                    onChange={(e) => setAiForm({ ...aiForm, services: e.target.value })}
                    placeholder="Contoh: Espresso, Manual Brew, Pastry"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gaya Desain yang Diinginkan
                  </label>
                  <select
                    value={aiForm.preferredStyle}
                    onChange={(e) => setAiForm({ ...aiForm, preferredStyle: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A] bg-white"
                  >
                    <option value="modern">Modern & Clean (Biru)</option>
                    <option value="warm">Warm & Cozy (Cokelat Amber)</option>
                    <option value="bold">Bold & Energetic (Merah Dinamis)</option>
                    <option value="minimalist">Minimalist (Monochrome)</option>
                    <option value="elegant">Elegant (Emerald / Teal)</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#425B9A] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-900">{loadingStatus}</p>
                  <p className="text-[11px] text-slate-500">Mohon tunggu beberapa detik...</p>
                </div>
              ) : (
                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('choose_method')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#425B9A] hover:bg-[#354a7d] text-xs font-bold text-white shadow-sm flex items-center gap-2 active:scale-95 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#76C0EC]" />
                    <span>Generate Landing Page Sekarang</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* STEP 2B: TEMPLATE GALLERY */}
          {step === 'template_gallery' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESET_TEMPLATES.map((tpl) => {
                  const isLocked = tpl.isPro && user?.plan !== 'pro';
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        if (isLocked) {
                          setErrorMsg(`Template "${tpl.name}" adalah fitur eksklusif LOKA PRO. Silakan upgrade paket akun Anda untuk menggunakan template ini.`);
                          return;
                        }
                        setSelectedTemplate(tpl);
                        setTemplateSiteName(tpl.name);
                      }}
                      className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition flex flex-col justify-between group relative ${
                        isLocked
                          ? 'border-amber-200/90 bg-amber-50/20 hover:border-amber-400'
                          : selectedTemplate?.id === tpl.id
                          ? 'border-[#425B9A] ring-2 ring-[#76C0EC]/40 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={tpl.previewImage}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-xs">
                            {tpl.category}
                          </span>
                          {tpl.isPro && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs flex items-center gap-1 border border-amber-300">
                              <Crown className="w-3 h-3 fill-current" />
                              <span>PRO</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-1">
                        <h5 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            {tpl.name}
                            {tpl.isPro && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                          </span>
                          {selectedTemplate?.id === tpl.id && (
                            <Check className="w-4 h-4 text-[#425B9A]" />
                          )}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {tpl.description}
                        </p>
                        {isLocked && (
                          <div className="pt-1.5 flex items-center justify-between text-[10px]">
                            <span className="text-amber-700 font-bold">Khusus Member PRO</span>
                            {onOpenPricing && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                  onOpenPricing();
                                }}
                                className="text-amber-800 font-bold hover:underline"
                              >
                                Upgrade Sekarang &rarr;
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedTemplate && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Website / Bisnis Anda:
                    </label>
                    <input
                      type="text"
                      value={templateSiteName}
                      onChange={(e) => setTemplateSiteName(e.target.value)}
                      placeholder={selectedTemplate.name}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#425B9A]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectTemplateSubmit(selectedTemplate)}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-[#425B9A] hover:bg-[#354a7d] text-xs font-bold text-white shadow-sm flex items-center gap-2 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                    >
                      <span>{loading ? 'Menyiapkan...' : `Gunakan Template ${selectedTemplate.name}`}</span>
                      <ArrowRight className="w-4 h-4 text-[#76C0EC]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2C: CUSTOM BUILD FROM SCRATCH */}
          {step === 'custom_scratch' && (
            <form onSubmit={handleCreateFromScratch} className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#425B9A]/5 border border-[#425B9A]/20 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#425B9A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Palette className="w-5 h-5 text-[#76C0EC]" />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-900">Kanvas Siap Kustomisasi</p>
                  <p className="text-slate-500 leading-relaxed">
                    Website Anda akan disiapkan dengan komponen dasar (Navbar, Hero, Layanan, Kontak WhatsApp, & Footer) yang 100% bebas Anda ubah, susun ulang, atau tambahkan section baru di visual editor drag & drop.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Website / Bisnis *
                  </label>
                  <input
                    type="text"
                    required
                    value={scratchForm.name}
                    onChange={(e) => setScratchForm({ ...scratchForm, name: e.target.value })}
                    placeholder="Contoh: Toko Berkah Mandiri"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Bisnis
                  </label>
                  <select
                    value={scratchForm.category}
                    onChange={(e) => setScratchForm({ ...scratchForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A] bg-white"
                  >
                    <option value="Coffee Shop & Kafe">Coffee Shop & Kafe</option>
                    <option value="Barbershop & Grooming">Barbershop & Salon</option>
                    <option value="Laundry & Dry Clean">Laundry & Cuci Pakaian</option>
                    <option value="Restoran & Kuliner">Restoran & Kuliner</option>
                    <option value="Bengkel & Servis Otomotif">Bengkel & Otomotif</option>
                    <option value="Klinik & Kesehatan">Klinik & Kesehatan</option>
                    <option value="Toko & Retail Lokal">Toko & Retail Lokal</option>
                    <option value="Jasa & UMKM Lokal">Jasa & UMKM Lokal Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Pemesanan
                  </label>
                  <input
                    type="text"
                    value={scratchForm.whatsapp}
                    onChange={(e) => setScratchForm({ ...scratchForm, whatsapp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gaya Font Utama
                  </label>
                  <select
                    value={scratchForm.font}
                    onChange={(e) => setScratchForm({ ...scratchForm, font: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#425B9A]/30 focus:border-[#425B9A] bg-white"
                  >
                    <option value="sans">Inter (Modern & Bersih)</option>
                    <option value="serif">Playfair Display (Elegan & Mewah)</option>
                    <option value="mono">JetBrains Mono (Teknis & Minimalis)</option>
                  </select>
                </div>
              </div>

              {/* Pilihan Warna Primer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Pilih Warna Primer Dasar:
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: 'LOKA Blue', color: '#425B9A' },
                    { label: 'Emerald', color: '#059669' },
                    { label: 'Warm Amber', color: '#d97706' },
                    { label: 'Slate Dark', color: '#0f172a' },
                    { label: 'Crimson', color: '#dc2626' },
                    { label: 'Royal Purple', color: '#7c3aed' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setScratchForm({ ...scratchForm, primaryColor: c.color })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer active:scale-95 ${
                        scratchForm.primaryColor === c.color
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#425B9A] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-900">{loadingStatus}</p>
                  <p className="text-[11px] text-slate-500">Mempersiapkan editor website...</p>
                </div>
              ) : (
                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep('choose_method')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#425B9A] hover:bg-[#354a7d] text-xs font-bold text-white shadow-sm flex items-center gap-2 active:scale-95 transition cursor-pointer"
                  >
                    <span>Buka Visual Editor Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-[#76C0EC]" />
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
