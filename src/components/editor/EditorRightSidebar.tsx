import React, { useState, useMemo } from 'react';
import { Section } from '../../types/schema';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { ensureItemIds } from '../../utils/dndUtils';
import {
  Plus,
  Trash2,
  X,
  Sliders,
  Image,
  Link,
  Type,
  LayoutGrid,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSidebarItemProps {
  id: string;
  children: (handleProps: { attributes: any; listeners: any }) => React.ReactNode;
}

const SortableSidebarItem: React.FC<SortableSidebarItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
};

interface SortableSidebarListProps {
  items: any[];
  idPrefix: string;
  onReorder: (oldIndex: number, newIndex: number) => void;
  renderItem: (item: any, idx: number, handleProps: { attributes: any; listeners: any }) => React.ReactNode;
}

const SortableSidebarList: React.FC<SortableSidebarListProps> = ({
  items,
  idPrefix,
  onReorder,
  renderItem,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const safeItems = useMemo(() => ensureItemIds(items, idPrefix), [items, idPrefix]);
  const ids = useMemo(() => safeItems.map((it) => it.id), [safeItems]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = safeItems.findIndex((it) => it.id === active.id);
      const newIndex = safeItems.findIndex((it) => it.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {safeItems.map((item, idx) => (
            <SortableSidebarItem key={item.id} id={item.id}>
              {(handleProps) => renderItem(item, idx, handleProps)}
            </SortableSidebarItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface Props {
  section: Section | null;
  onUpdateContent: (newContent: any) => void;
  onClose: () => void;
}

export const EditorRightSidebar: React.FC<Props> = ({
  section,
  onUpdateContent,
  onClose,
}) => {
  if (!section) {
    return (
      <aside className="w-88 bg-white border-l border-slate-200 flex flex-col shrink-0 h-full z-20 p-6 items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">Pilih Section</h4>
        <p className="text-xs text-slate-500 max-w-[200px]">
          Klik salah satu section di kanvas atau di sidebar kiri untuk mengedit teks, gambar, dan tombolnya.
        </p>
      </aside>
    );
  }

  const content = (section.content || {}) as any;

  const handleChange = (field: string, value: any) => {
    onUpdateContent({
      ...content,
      [field]: value,
    });
  };

  const moveItemToIndex = (field: string, fromIndex: number, toIndex: number) => {
    const list = [...(content[field] || [])];
    if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) return;
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);
    handleChange(field, list);
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'navbar': return 'Pengaturan Navbar';
      case 'hero': return 'Pengaturan Hero Banner';
      case 'about': return 'Pengaturan Tentang Kami';
      case 'services': return 'Pengaturan Layanan / Menu';
      case 'features': return 'Pengaturan Keunggulan';
      case 'gallery': return 'Pengaturan Galeri';
      case 'testimonials': return 'Pengaturan Testimoni';
      case 'cta': return 'Pengaturan Call to Action';
      case 'faq': return 'Pengaturan Tanya Jawab (FAQ)';
      case 'contact': return 'Pengaturan Kontak';
      case 'footer': return 'Pengaturan Footer';
      default: return 'Pengaturan Section';
    }
  };

  return (
    <aside className="w-88 bg-white border-l border-slate-200 flex flex-col shrink-0 h-full z-20 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            {getSectionTitle(section.type)}
          </h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Tipe: {section.type}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Tutup Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* TATA LETAK & GRID (LAYOUT GRID SYSTEM) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>Tata Letak Grid & Spasi</span>
          </div>

          {/* Grid Columns Setting (for multi-item sections like services, features, gallery, testimonials) */}
          {['services', 'features', 'gallery', 'testimonials'].includes(section.type) && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Jumlah Kolom Grid:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: '2', label: '2 Kolom' },
                  { val: '3', label: '3 Kolom' },
                  { val: '4', label: '4 Kolom' },
                ].map((colOpt) => (
                  <button
                    key={colOpt.val}
                    type="button"
                    onClick={() => handleChange('columns', colOpt.val)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                      (content.columns || (section.type === 'testimonials' ? '2' : section.type === 'features' ? '3' : '4')) === colOpt.val
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {colOpt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spacing / Vertical Padding */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Spasi Vertikal (Padding):
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: 'compact', label: 'Rapat' },
                { val: 'normal', label: 'Normal' },
                { val: 'spacious', label: 'Lapang' },
              ].map((padOpt) => (
                <button
                  key={padOpt.val}
                  type="button"
                  onClick={() => handleChange('padding', padOpt.val)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    (content.padding || 'normal') === padOpt.val
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {padOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* COMMON: Badge */}
        {'badge' in content && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Badge / Label Atas
            </label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => handleChange('badge', e.target.value)}
              placeholder="Contoh: ✨ Promo Spesial"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* COMMON: Title */}
        {'title' in content && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Utama (Title)
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>
        )}

        {/* COMMON: Subtitle / Description */}
        {'description' in content && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Teks
            </label>
            <textarea
              rows={3}
              value={content.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {'subtitle' in content && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subjudul (Subtitle)
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* HERO SPECIFIC */}
        {section.type === 'hero' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Tombol Utama (WhatsApp)
              </label>
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Link URL Tombol Utama
              </label>
              <input
                type="text"
                value={content.buttonUrl || ''}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                placeholder="https://wa.me/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Tombol Sekunder
              </label>
              <input
                type="text"
                value={content.secondaryButtonText || ''}
                onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                placeholder="Lihat Layanan"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Link URL Tombol Sekunder
              </label>
              <input
                type="text"
                value={content.secondaryButtonUrl || ''}
                onChange={(e) => handleChange('secondaryButtonUrl', e.target.value)}
                placeholder="#services"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <ImageUploadInput
                label="Foto / Gambar Hero Banner"
                value={content.imageUrl || ''}
                onChange={(url) => handleChange('imageUrl', url)}
                placeholder="https://... atau upload langsung dari laptop"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Tata Letak & Posisi Gambar Hero
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { val: 'image-right', label: 'Gambar Kanan' },
                  { val: 'image-left', label: 'Gambar Kiri' },
                  { val: 'center', label: 'Tengah / Center' },
                  { val: 'background', label: 'Background Cover' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => {
                      handleChange('layoutVariant', opt.val);
                      if (opt.val === 'center') {
                        handleChange('alignment', 'center');
                      } else {
                        handleChange('alignment', 'left');
                      }
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition text-center ${
                      ((content.layoutVariant || (content.alignment === 'center' ? 'center' : 'image-right')) === opt.val)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NAVBAR SPECIFIC */}
        {section.type === 'navbar' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Brand / Judul Navbar
              </label>
              <input
                type="text"
                value={content.brandName || ''}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Tombol CTA
              </label>
              <input
                type="text"
                value={content.ctaText || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Link URL Tombol CTA
              </label>
              <input
                type="text"
                value={content.ctaUrl || ''}
                onChange={(e) => handleChange('ctaUrl', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={content.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* ABOUT SPECIFIC */}
        {section.type === 'about' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Posisi Tata Letak Gambar
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 'left', label: 'Gambar Kiri' },
                  { val: 'right', label: 'Gambar Kanan' },
                  { val: 'bottom', label: 'Gambar Bawah' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleChange('imagePosition', opt.val)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition text-center ${
                      ((content.imagePosition || 'left') === opt.val)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cerita / Narasi Bisnis
              </label>
              <textarea
                rows={4}
                value={content.story || ''}
                onChange={(e) => handleChange('story', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <ImageUploadInput
                label="Foto Profil / Cerita Utama"
                value={content.imageUrl || ''}
                onChange={(url) => handleChange('imageUrl', url)}
                placeholder="https://... atau upload langsung"
              />
            </div>

            <div>
              <ImageUploadInput
                label="Foto Sekunder (Kolase Foto #2 - Opsional)"
                value={content.secondaryImageUrl || ''}
                onChange={(url) => handleChange('secondaryImageUrl', url)}
                placeholder="https://... atau upload langsung"
              />
            </div>
          </div>
        )}

        {/* SERVICES SPECIFIC */}
        {section.type === 'services' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Daftar Layanan & Foto</label>
              <button
                type="button"
                onClick={() => {
                  const items = content.items || [];
                  handleChange('items', [
                    ...items,
                    {
                      title: 'Layanan Baru',
                      description: 'Deskripsi lengkap layanan...',
                      price: 'Rp 50.000',
                      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
                      icon: 'check',
                    },
                  ]);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Item
              </button>
            </div>

            <SortableSidebarList
              items={content.items || []}
              idPrefix="service-item"
              onReorder={(from, to) => moveItemToIndex('items', from, to)}
              renderItem={(item, idx, { attributes, listeners }) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 rounded transition"
                        title="Tarik (drag) untuk geser urutan"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-700 text-[11px]">Item #{idx + 1}</span>

                      {/* Urutan / Index Selector */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium">Index:</span>
                        <select
                          value={idx + 1}
                          onChange={(e) => moveItemToIndex('items', idx, parseInt(e.target.value) - 1)}
                          className="text-[10px] font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                        >
                          {(content.items || []).map((_: any, optIdx: number) => (
                            <option key={optIdx} value={optIdx + 1}>
                              Ke-{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Up and Down Buttons */}
                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItemToIndex('items', idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (content.items || []).length - 1}
                          onClick={() => moveItemToIndex('items', idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const items = [...content.items];
                        items.splice(idx, 1);
                        handleChange('items', items);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail & Image Upload */}
                  <ImageUploadInput
                    label="Foto Layanan / Menu"
                    value={item.imageUrl || ''}
                    onChange={(url) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], imageUrl: url };
                      handleChange('items', items);
                    }}
                    placeholder="Upload foto produk/menu..."
                  />

                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], title: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Nama Layanan / Menu"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    value={item.price || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], price: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Harga / Tarif"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], description: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Deskripsi singkat..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-[11px]"
                  />
                </div>
              )}
            />
          </div>
        )}

        {/* FEATURES SPECIFIC */}
        {section.type === 'features' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Daftar Keunggulan</label>
              <button
                type="button"
                onClick={() => {
                  const items = content.items || [];
                  handleChange('items', [
                    ...items,
                    { title: 'Keunggulan Baru', description: 'Keterangan keunggulan...', icon: 'shield' },
                  ]);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Poin
              </button>
            </div>

            <div className="space-y-3">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px]">Poin #{idx + 1}</span>

                      {/* Urutan / Index Selector */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium">Index:</span>
                        <select
                          value={idx + 1}
                          onChange={(e) => moveItemToIndex('items', idx, parseInt(e.target.value) - 1)}
                          className="text-[10px] font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                        >
                          {(content.items || []).map((_: any, optIdx: number) => (
                            <option key={optIdx} value={optIdx + 1}>
                              Ke-{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItemToIndex('items', idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.items.length - 1}
                          onClick={() => moveItemToIndex('items', idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const items = [...content.items];
                        items.splice(idx, 1);
                        handleChange('items', items);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], title: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Judul Keunggulan"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], description: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Deskripsi keunggulan..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS SPECIFIC */}
        {section.type === 'testimonials' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Daftar Testimoni</label>
              <button
                type="button"
                onClick={() => {
                  const items = content.items || [];
                  handleChange('items', [
                    ...items,
                    {
                      name: 'Nama Pelanggan',
                      role: 'Pelanggan Setia',
                      comment: 'Pelayanan sangat bagus dan memuaskan!',
                      rating: 5,
                    },
                  ]);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Review
              </button>
            </div>

            <div className="space-y-3">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px]">Ulasan #{idx + 1}</span>

                      {/* Urutan / Index Selector */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium">Index:</span>
                        <select
                          value={idx + 1}
                          onChange={(e) => moveItemToIndex('items', idx, parseInt(e.target.value) - 1)}
                          className="text-[10px] font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                        >
                          {(content.items || []).map((_: any, optIdx: number) => (
                            <option key={optIdx} value={optIdx + 1}>
                              Ke-{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItemToIndex('items', idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.items.length - 1}
                          onClick={() => moveItemToIndex('items', idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const items = [...content.items];
                        items.splice(idx, 1);
                        handleChange('items', items);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], name: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Nama Pelanggan"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], role: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Profesi / Domisili"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <textarea
                    rows={2}
                    value={item.comment || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], comment: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Komentar review..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY SPECIFIC */}
        {section.type === 'gallery' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Bentuk / Rasio Foto Galeri
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { val: 'square', label: 'Kotak (1:1)' },
                  { val: 'landscape', label: 'Wide (16:9)' },
                  { val: 'portrait', label: 'Tinggi (3:4)' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleChange('aspectRatio', opt.val)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition text-center ${
                      ((content.aspectRatio || 'square') === opt.val)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Foto Galeri & Urutan Index</label>
              <button
                type="button"
                onClick={() => {
                  const images = content.images || [];
                  handleChange('images', [
                    ...images,
                    {
                      imageUrl:
                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                      caption: 'Foto Baru',
                    },
                  ]);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Foto
              </button>
            </div>

            <div className="space-y-3">
              {(content.images || []).map((img: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px]">Foto #{idx + 1}</span>

                      {/* Urutan / Index Selector */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium">Index:</span>
                        <select
                          value={idx + 1}
                          onChange={(e) => moveItemToIndex('images', idx, parseInt(e.target.value) - 1)}
                          className="text-[10px] font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                        >
                          {(content.images || []).map((_: any, optIdx: number) => (
                            <option key={optIdx} value={optIdx + 1}>
                              Ke-{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItemToIndex('images', idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.images.length - 1}
                          onClick={() => moveItemToIndex('images', idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const images = [...content.images];
                        images.splice(idx, 1);
                        handleChange('images', images);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail & Image Upload */}
                  <ImageUploadInput
                    label="File Foto Galeri"
                    value={img.imageUrl || ''}
                    onChange={(url) => {
                      const images = [...content.images];
                      images[idx] = { ...images[idx], imageUrl: url };
                      handleChange('images', images);
                    }}
                    placeholder="Upload foto galeri..."
                  />

                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={(e) => {
                      const images = [...content.images];
                      images[idx] = { ...images[idx], caption: e.target.value };
                      handleChange('images', images);
                    }}
                    placeholder="Keterangan Caption Foto"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA SPECIFIC */}
        {section.type === 'cta' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Tombol CTA
              </label>
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Link URL Tombol CTA
              </label>
              <input
                type="text"
                value={content.buttonUrl || ''}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                placeholder="https://wa.me/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Bawah (Note)
              </label>
              <input
                type="text"
                value={content.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Respon cepat dalam 5 menit"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* FAQ SPECIFIC */}
        {section.type === 'faq' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Daftar Tanya Jawab (FAQ)</label>
              <button
                type="button"
                onClick={() => {
                  const items = content.items || [];
                  handleChange('items', [
                    ...items,
                    {
                      question: 'Pertanyaan baru seputar layanan?',
                      answer: 'Jawaban detail untuk pertanyaan tersebut...',
                    },
                  ]);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah FAQ
              </button>
            </div>

            <div className="space-y-3">
              {(content.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px]">FAQ #{idx + 1}</span>

                      {/* Urutan / Index Selector */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-medium">Index:</span>
                        <select
                          value={idx + 1}
                          onChange={(e) => moveItemToIndex('items', idx, parseInt(e.target.value) - 1)}
                          className="text-[10px] font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
                        >
                          {(content.items || []).map((_: any, optIdx: number) => (
                            <option key={optIdx} value={optIdx + 1}>
                              Ke-{optIdx + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItemToIndex('items', idx, idx - 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.items.length - 1}
                          onClick={() => moveItemToIndex('items', idx, idx + 1)}
                          className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const items = [...content.items];
                        items.splice(idx, 1);
                        handleChange('items', items);
                      }}
                      className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.question || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], question: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Pertanyaan (misal: Apakah menerima pembayaran QRIS?)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-900"
                  />
                  <textarea
                    rows={3}
                    value={item.answer || ''}
                    onChange={(e) => {
                      const items = [...content.items];
                      items[idx] = { ...items[idx], answer: e.target.value };
                      handleChange('items', items);
                    }}
                    placeholder="Tuliskan jawaban yang ramah dan jelas..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT SPECIFIC */}
        {section.type === 'contact' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={content.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={content.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={content.operatingHours || ''}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                placeholder="Senin - Minggu: 08.00 - 22.00 WIB"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="text"
                value={content.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        )}

        {/* FOOTER SPECIFIC */}
        {section.type === 'footer' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tagline Footer
              </label>
              <input
                type="text"
                value={content.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Hak Cipta
              </label>
              <input
                type="text"
                value={content.copyrightText || ''}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
