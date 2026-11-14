import React, { useState } from "react";
import { Section, ThemeConfig, BusinessInfo } from "../../types/schema";
import { useAuth } from "../../context/AuthContext";
import { getBaseDomain, getPublicSiteUrl, getPublicSiteDisplayUrl } from "../../utils/url.utils";
import { ImageUploadInput } from "../common/ImageUploadInput";
import { Layers, Palette, Briefcase, Plus, ChevronUp, ChevronDown, Trash2, GripVertical, Sliders, Share2, Globe, Search, MessageCircle, Crown, Sparkles, Save, Check } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  sections: Section[];
  activeSectionId: string | null;
  onSelectSection: (id: string) => void;
  onMoveSection: (index: number, direction: "up" | "down") => void;
  onDeleteSection: (id: string) => void;
  onOpenAddSection: () => void;
  onReorderSections?: (newSections: Section[]) => void;
  theme: ThemeConfig;
  onUpdateTheme: (theme: ThemeConfig) => void;
  businessInfo: BusinessInfo;
  onUpdateBusinessInfo: (info: BusinessInfo) => void;
  slug: string;
  onUpdateSlug: (slug: string) => void;
  onSave?: () => void;
  saving?: boolean;
}

interface SortableSectionRowProps {
  section: Section;
  idx: number;
  isActive: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
  getSectionLabel: (type: string) => string;
}

const SortableSectionRow: React.FC<SortableSectionRowProps> = ({ section, idx, isActive, onSelect, onMoveUp, onMoveDown, onDelete, isFirst, isLast, getSectionLabel }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none group ${
        isDragging ? "bg-[#425B9A]/20 border-[#425B9A] shadow-xl ring-2 ring-[#425B9A]/40 scale-[1.02] z-50" : isActive ? "bg-[#425B9A]/10 border-[#425B9A] ring-2 ring-[#425B9A]/20" : "bg-white border-slate-200/90 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div {...attributes} {...listeners} className="text-slate-400 hover:text-[#425B9A] p-0.5 cursor-grab active:cursor-grabbing rounded transition" title="Tarik (drag) untuk geser urutan section" onClick={(e) => e.stopPropagation()}>
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-slate-400 w-4 font-mono">{idx + 1}</span>
        <div className="truncate">
          <p className={`text-xs font-semibold truncate ${isActive ? "text-[#425B9A]" : "text-slate-800"}`}>{getSectionLabel(section.type)}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{section.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Move Up */}
        <button type="button" disabled={isFirst} onClick={onMoveUp} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition" title="Pindahkan ke atas">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        {/* Move Down */}
        <button type="button" disabled={isLast} onClick={onMoveDown} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 transition" title="Pindahkan ke bawah">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {/* Delete */}
        <button type="button" onClick={onDelete} className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Hapus section">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const COLOR_PRESETS = [
  { name: "Loka Signature", primary: "#425B9A", secondary: "#76C0EC", bg: "#ffffff" },
  { name: "Kopi / Amber", primary: "#78350f", secondary: "#1c1917", bg: "#fef3c7" },
  { name: "Royal Blue", primary: "#2563eb", secondary: "#0f172a", bg: "#f8fafc" },
  { name: "Emerald Green", primary: "#059669", secondary: "#064e3b", bg: "#f0fdf4" },
  { name: "Deep Crimson", primary: "#b91c1c", secondary: "#1c1917", bg: "#fef2f2" },
  { name: "Sky Cyan", primary: "#0284c7", secondary: "#0f172a", bg: "#f0f9ff" },
  { name: "Modern Dark", primary: "#18181b", secondary: "#27272a", bg: "#fafafa" },
];

const GOOGLE_FONT_PRESETS = [
  {
    id: "inter",
    name: "Inter (Rekomendasi)",
    niche: "Minimalis & Serba Guna",
    fontClass: "font-inter",
    sample: "Minimalis Rapi",
  },
  {
    id: "sans",
    name: "Plus Jakarta Sans",
    niche: "Modern Clean & Startup",
    fontClass: "font-jakarta",
    sample: "Modern Clean",
  },
  {
    id: "serif",
    name: "Playfair Display",
    niche: "Kafe, Luxury & Wedding",
    fontClass: "font-playfair",
    sample: "Elegan Mewah",
  },
  {
    id: "poppins",
    name: "Poppins",
    niche: "Kuliner, Ramah & Bakery",
    fontClass: "font-poppins",
    sample: "Hangat & Ramah",
  },
  {
    id: "oswald",
    name: "Oswald",
    niche: "Barbershop, Gym & Bengkel",
    fontClass: "font-oswald tracking-wide uppercase",
    sample: "BOLD & KUAT",
  },
  {
    id: "lora",
    name: "Lora",
    niche: "Klinik, Spa & Konsultan",
    fontClass: "font-lora",
    sample: "Anggun & Tenang",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    niche: "Arsitektur & Fotografi",
    fontClass: "font-montserrat",
    sample: "Geometric Urban",
  },
  {
    id: "cinzel",
    name: "Cinzel",
    niche: "Perhiasan & Salon Premium",
    fontClass: "font-cinzel uppercase",
    sample: "Klasik Mulia",
  },
];

export const EditorLeftSidebar: React.FC<Props> = ({
  sections,
  activeSectionId,
  onSelectSection,
  onMoveSection,
  onDeleteSection,
  onOpenAddSection,
  onReorderSections,
  theme,
  onUpdateTheme,
  businessInfo,
  onUpdateBusinessInfo,
  slug,
  onUpdateSlug,
  onSave,
  saving = false,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"sections" | "theme" | "business" | "seo">("sections");
  const [seoPreviewType, setSeoPreviewType] = useState<"whatsapp" | "google" | "social">("whatsapp");

  const getSectionLabel = (type: string) => {
    switch (type) {
      case "navbar":
        return "Navigation Bar";
      case "hero":
        return "Hero Banner";
      case "about":
        return "Tentang Usaha";
      case "services":
        return "Layanan / Menu";
      case "features":
        return "Keunggulan Kami";
      case "gallery":
        return "Galeri Foto";
      case "testimonials":
        return "Testimoni Klien";
      case "cta":
        return "Call to Action";
      case "faq":
        return "Tanya Jawab (FAQ)";
      case "contact":
        return "Kontak & Lokasi";
      case "footer":
        return "Footer";
      default:
        return type;
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.position - b.position);
  const sectionIds = sortedSections.map((s) => s.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(sortedSections, oldIndex, newIndex).map((s, idx) => ({
          ...s,
          position: idx,
        }));
        if (onReorderSections) {
          onReorderSections(reordered);
        } else {
          if (oldIndex < newIndex) {
            for (let i = oldIndex; i < newIndex; i++) onMoveSection(i, "down");
          } else {
            for (let i = oldIndex; i > newIndex; i--) onMoveSection(i, "up");
          }
        }
      }
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full z-20 overflow-hidden select-none">
      {/* Sidebar Tabs (4 Categories) */}
      <div data-tour="editor-tabs" className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition ${activeTab === "sections" ? "bg-white text-[#425B9A] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          title="Urutan Section"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Seksi</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition ${activeTab === "theme" ? "bg-white text-[#425B9A] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          title="Warna & Font"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tema</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("business")}
          className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition ${activeTab === "business" ? "bg-white text-[#425B9A] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          title="Profil & WhatsApp"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Bisnis</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition ${activeTab === "seo" ? "bg-white text-[#425B9A] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          title="SEO & Pratinjau Share Medsos/WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>SEO</span>
        </button>
      </div>

      {/* Tab 1: Sections Manager */}
      {activeTab === "sections" && (
        <div data-tour="editor-sections" className="flex-1 flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urutan Section</span>
            <button type="button" onClick={onOpenAddSection} className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#425B9A] bg-[#425B9A]/10 hover:bg-[#425B9A]/20 rounded-lg transition">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sortedSections.map((section, idx) => (
                    <SortableSectionRow
                      key={section.id}
                      section={section}
                      idx={idx}
                      isActive={activeSectionId === section.id}
                      onSelect={() => onSelectSection(section.id)}
                      onMoveUp={() => onMoveSection(idx, "up")}
                      onMoveDown={() => onMoveSection(idx, "down")}
                      onDelete={() => onDeleteSection(section.id)}
                      isFirst={idx === 0}
                      isLast={idx === sortedSections.length - 1}
                      getSectionLabel={getSectionLabel}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}

      {/* Tab 2: Theme Settings */}
      {activeTab === "theme" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Palet Preset</label>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    onUpdateTheme({
                      ...theme,
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                      backgroundColor: preset.bg,
                    })
                  }
                  className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-slate-300 transition group flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: preset.primary }} />
                  <span className="text-xs font-medium text-slate-800 truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warna Utama (Primary / Tombol)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.primaryColor || "#2563eb"} onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })} className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <input
                  type="text"
                  value={theme.primaryColor || "#2563eb"}
                  onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Warna Sekunder / Heading</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.secondaryColor || "#0f172a"} onChange={(e) => onUpdateTheme({ ...theme, secondaryColor: e.target.value })} className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <input
                  type="text"
                  value={theme.secondaryColor || "#0f172a"}
                  onChange={(e) => onUpdateTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Tipografi Google Fonts</label>
                <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">8 Pilihan</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5">Pilih font yang sesuai dengan persona & bidang usaha Anda:</p>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {GOOGLE_FONT_PRESETS.map((f) => {
                  const isSelected = (theme.font || "sans") === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onUpdateTheme({ ...theme, font: f.id })}
                      className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between ${
                        isSelected ? "border-[#425B9A] bg-[#425B9A]/5 ring-1 ring-[#425B9A] text-slate-900 shadow-xs" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold">{f.name}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#425B9A] inline-block" />}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{f.niche}</p>
                      </div>
                      <div className={`text-xs shrink-0 px-2 py-1 rounded bg-slate-100/90 border border-slate-200/50 ${f.fontClass}`}>{f.sample}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Business Information */}
      {activeTab === "business" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bisnis</label>
            <input
              type="text"
              value={businessInfo.name || ""}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, name: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subdomain URL Landing Page</label>
            <div className="flex items-center">
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-2 border border-r-0 border-slate-200 rounded-l-lg select-none">https://</span>
              <input type="text" value={slug} onChange={(e) => onUpdateSlug(e.target.value)} className="flex-1 text-xs px-2.5 py-2 border border-slate-200 outline-none font-mono focus:ring-1 focus:ring-blue-500" />
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-2 border border-l-0 border-slate-200 rounded-r-lg select-none font-mono">.{getBaseDomain()}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Hanya huruf kecil, angka, dan tanda hubung (-)</p>
            {user?.plan === "pro" ? (
              <div className="mt-2 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                  <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                  <span>Fitur PRO Aktif: Custom URL Bersih</span>
                </div>
                {/-\d{4}$/.test(slug) ? (
                  <button
                    type="button"
                    onClick={() => onUpdateSlug(slug.replace(/-\d{4}$/, ""))}
                    className="w-full py-1.5 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Hapus Angka Acak (Jadikan: /{slug.replace(/-\d{4}$/, "")})</span>
                  </button>
                ) : (
                  <p className="text-[10px] text-amber-800 leading-relaxed">URL Anda sudah rapi dan bersih tanpa akhiran angka acak sistem.</p>
                )}
              </div>
            ) : (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 space-y-0.5">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <span>ℹ️ Paket Gratis (Free)</span>
                </p>
                <p className="leading-relaxed">
                  URL website gratis otomatis disematkan 4 digit angka acak saat disimpan (misal: <span className="font-mono text-slate-700 bg-slate-200/70 px-1 rounded">/{slug || "toko"}-1234</span>). Upgrade ke PRO untuk custom URL bersih
                  &amp; hapus watermark.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Bisnis</label>
            <input
              type="text"
              value={businessInfo.whatsapp || ""}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, whatsapp: e.target.value })}
              placeholder="Contoh: 6281234567890"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Template Pesan Otomatis WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Template Pesan WhatsApp (Pre-filled)</label>
            <textarea
              rows={2}
              value={businessInfo.whatsappMessageTemplate || ""}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, whatsappMessageTemplate: e.target.value })}
              placeholder="Halo, saya melihat website Anda dan ingin menanyakan..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Pesan otomatis yang langsung terisi saat pengunjung klik tombol WA.</p>
          </div>

          {/* Toggle Floating WhatsApp */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Tombol WhatsApp Melayang</span>
              <span className="text-[10px] text-emerald-700">Tampilkan widget sticky di pojok kanan bawah</span>
            </div>
            <input
              type="checkbox"
              checked={businessInfo.enableFloatingWhatsapp !== false}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, enableFloatingWhatsapp: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* Jam Operasional & Status Buka/Tutup */}
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-800 block">Jam Operasional (Status Buka/Tutup)</span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Jam Buka</label>
                <input
                  type="text"
                  value={businessInfo.openTime || "08:00"}
                  onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, openTime: e.target.value })}
                  placeholder="08:00"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Jam Tutup</label>
                <input
                  type="text"
                  value={businessInfo.closeTime || "22:00"}
                  onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, closeTime: e.target.value })}
                  placeholder="22:00"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Teks Tampilan (Di Kontak)</label>
              <input
                type="text"
                value={businessInfo.operatingHours || "Setiap Hari: 08.00 - 22.00 WIB"}
                onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, operatingHours: e.target.value })}
                placeholder="Setiap Hari: 08.00 - 22.00 WIB"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi / Alamat</label>
            <input
              type="text"
              value={businessInfo.location || ""}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, location: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram Handle</label>
            <input
              type="text"
              value={businessInfo.instagram || ""}
              onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, instagram: e.target.value })}
              placeholder="@namabisnis"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* White-Label Watermark Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Watermark LOKA:</span>
              {user?.plan === "pro" ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">Dihapus (100% White-label)</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px] font-semibold">Tampil (Paket Free)</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {user?.plan === "pro" ? "Website Anda 100% white-label tanpa footer branding platform LOKA." : "Tingkatkan ke paket PRO untuk otomatis menghapus watermark di bagian bawah halaman."}
            </p>
          </div>

          {/* Tombol Simpan Informasi Bisnis */}
          {onSave && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="w-full py-2.5 px-4 bg-[#425B9A] hover:bg-[#354a7d] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-[#425B9A]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Menyimpan Informasi..." : "Simpan Informasi Bisnis"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pengaturan SEO & OpenGraph Preview */}
      {activeTab === "seo" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1">
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              SEO & Social Share Preview
            </h4>
            <p className="text-[11px] text-blue-700 leading-relaxed">Atur bagaimana website Anda tampil saat dibagikan ke WhatsApp, Google, atau media sosial lainnya.</p>
          </div>

          {/* Form Pengaturan */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Judul SEO / Share Link</label>
                <span className="text-[10px] text-slate-400 font-mono">{(businessInfo?.seoTitle || businessInfo?.name || "").length}/60</span>
              </div>
              <input
                type="text"
                value={businessInfo?.seoTitle ?? ""}
                onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, seoTitle: e.target.value })}
                placeholder={businessInfo?.name || "Contoh: Kopi Senja - Artisan Coffee & Roastery"}
                maxLength={70}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-1">Akan otomatis menggunakan nama bisnis jika dikosongkan.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Deskripsi Singkat (Meta Description)</label>
                <span className="text-[10px] text-slate-400 font-mono">{(businessInfo?.seoDescription || businessInfo?.tagline || "").length}/160</span>
              </div>
              <textarea
                rows={3}
                value={businessInfo?.seoDescription ?? ""}
                onChange={(e) => onUpdateBusinessInfo({ ...businessInfo, seoDescription: e.target.value })}
                placeholder={businessInfo?.tagline || "Katalog menu spesial, promo minggu ini, dan reservasi meja langsung lewat WhatsApp."}
                maxLength={180}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">Teks rangkuman yang menarik pengunjung untuk mengklik tautan.</p>
            </div>

            <div>
              <ImageUploadInput
                label="Foto Banner Thumbnail (OG Image)"
                value={businessInfo?.ogImageUrl || ""}
                onChange={(url) => onUpdateBusinessInfo({ ...businessInfo, ogImageUrl: url })}
                placeholder="Rekomendasi rasio 1.91:1 (contoh: 1200x630px)"
              />
              <p className="text-[10px] text-slate-400 mt-1">Jika kosong, sistem akan menggunakan logo bisnis atau gambar default.</p>
            </div>

            {/* Tombol Simpan Pengaturan SEO */}
            {onSave && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="w-full py-2.5 px-4 bg-[#425B9A] hover:bg-[#354a7d] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-[#425B9A]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Menyimpan Pengaturan..." : "Simpan Pengaturan SEO"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Simulator Preview */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Simulator</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setSeoPreviewType("whatsapp")}
                  className={`px-2 py-1 rounded-md transition ${seoPreviewType === "whatsapp" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                >
                  WhatsApp
                </button>
                <button type="button" onClick={() => setSeoPreviewType("google")} className={`px-2 py-1 rounded-md transition ${seoPreviewType === "google" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
                  Google
                </button>
                <button type="button" onClick={() => setSeoPreviewType("social")} className={`px-2 py-1 rounded-md transition ${seoPreviewType === "social" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>
                  Medsos
                </button>
              </div>
            </div>

            {/* WA PREVIEW CARD */}
            {seoPreviewType === "whatsapp" && (
              <div className="bg-[#e7fedb] border border-[#c4e6b5] p-2.5 rounded-xl text-slate-800 shadow-xs space-y-2">
                <div className="bg-white/90 rounded-lg overflow-hidden border border-slate-200/80 shadow-xs">
                  {businessInfo?.ogImageUrl || businessInfo?.logo ? (
                    <img src={businessInfo.ogImageUrl || businessInfo.logo} alt="Thumbnail Preview" className="w-full h-28 object-cover bg-slate-100" />
                  ) : (
                    <div className="w-full h-24 bg-emerald-50 flex items-center justify-center text-emerald-700 text-xs font-medium">Pratinjau Thumbnail Gambar</div>
                  )}
                  <div className="p-2 space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{businessInfo?.seoTitle || businessInfo?.name || "Website Usaha Anda"}</p>
                    <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">{businessInfo?.seoDescription || businessInfo?.tagline || "Pesan langsung dan jelajahi layanan online kami."}</p>
                    <p className="text-[9px] text-slate-400 font-mono pt-1 truncate">{getPublicSiteDisplayUrl(slug || "toko-anda")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span className="text-blue-600 underline font-mono truncate max-w-[200px]">{getPublicSiteUrl(slug || "toko-anda")}</span>
                  <span className="shrink-0 text-[9px] text-slate-400">10:42 WIB ✓✓</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = getPublicSiteUrl(slug || "toko-anda");
                    const text = `Halo! Kunjungi website kami: ${fullUrl}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Uji Coba Share ke WhatsApp</span>
                </button>
              </div>
            )}

            {/* GOOGLE PREVIEW CARD */}
            {seoPreviewType === "google" && (
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1 font-sans">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">L</div>
                  <span className="font-semibold text-slate-800 truncate">{getBaseDomain()}</span>
                  <span className="text-slate-400 text-[10px]">› sites › {slug || "toko-anda"}</span>
                </div>
                <h5 className="text-xs font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 pt-0.5">{businessInfo?.seoTitle || `${businessInfo?.name || "Website Resmi"} - Profil & Katalog Lengkap`}</h5>
                <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                  {businessInfo?.seoDescription || businessInfo?.tagline || "Kunjungi website resmi kami untuk informasi produk, galeri, daftar harga promo, dan pemesanan WhatsApp cepat."}
                </p>
                <div className="pt-2">
                  <a href={getPublicSiteUrl(slug || "toko-anda")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline font-medium">
                    <span>Buka Tautan Publik</span>
                    <Globe className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* SOCIAL / FB CARD */}
            {seoPreviewType === "social" && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                {businessInfo?.ogImageUrl || businessInfo?.logo ? (
                  <img src={businessInfo.ogImageUrl || businessInfo.logo} alt="Social Preview" className="w-full h-32 object-cover bg-slate-100" />
                ) : (
                  <div className="w-full h-28 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Banner Tautan (1200x630)</div>
                )}
                <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 block font-mono">{getBaseDomain().toUpperCase()}</span>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{businessInfo?.seoTitle || businessInfo?.name || "Website Usaha Anda"}</h5>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{businessInfo?.seoDescription || businessInfo?.tagline || "Katalog lengkap dan layanan resmi."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
