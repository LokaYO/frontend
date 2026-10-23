import React, { useState, useMemo } from 'react';
import { FaqContent, ThemeConfig } from '../../types/schema';
import { ChevronDown, HelpCircle, Sparkles, GripVertical } from 'lucide-react';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ensureItemIds } from '../../utils/dndUtils';

interface Props {
  content: FaqContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  onUpdateContent?: (newContent: FaqContent) => void;
}

interface FaqItemProps {
  id: string;
  item: any;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  isEditor?: boolean;
}

const SortableFaqItem: React.FC<FaqItemProps> = ({ id, item, idx, isOpen, onToggle, isEditor }) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden select-none ${
        isDragging
          ? 'shadow-2xl ring-3 ring-blue-500 scale-[1.02] opacity-90 z-50 bg-blue-50/30 border-blue-400'
          : 'border-slate-200/90 shadow-2xs'
      }`}
    >
      <div className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Visual Index Badge + Drag Handle in Editor */}
          {isEditor && (
            <div
              {...attributes}
              {...listeners}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border border-slate-200 cursor-grab active:cursor-grabbing transition shrink-0"
              title="Tahan dan geser (drag) untuk memindahkan FAQ ini"
            >
              <GripVertical className="w-3.5 h-3.5 opacity-70" />
              <span>#{idx + 1}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="flex-1 text-left text-sm sm:text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-blue-600 transition"
          >
            {item.question}
          </button>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 cursor-pointer ${
            isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-in fade-in-50 duration-200">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

export const FaqSection: React.FC<Props> = ({ content, theme, isEditor, onUpdateContent }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // Default first item open

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const defaultItems = [
    {
      question: 'Bagaimana cara melakukan pemesanan atau reservasi?',
      answer: 'Anda dapat langsung menekan tombol WhatsApp di website ini untuk terhubung langsung dengan admin kami.',
    },
    {
      question: 'Apakah melayani pembayaran non-tunai (QRIS / Transfer)?',
      answer: 'Ya, kami menerima semua jenis pembayaran tunai, QRIS, dan transfer bank lokal.',
    },
    {
      question: 'Berapa lama estimasi pengerjaan / waktu layanan?',
      answer: 'Waktu layanan disesuaikan dengan jenis paket yang Anda pilih, rata-rata berkisar antara 30 hingga 60 menit.',
    },
  ];

  const rawItems = content.items && content.items.length > 0 ? content.items : defaultItems;
  const items = useMemo(() => ensureItemIds(rawItems, 'faq'), [rawItems]);
  const itemIds = useMemo(() => items.map((it) => it.id), [items]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((it) => it.id === active.id);
      const newIndex = items.findIndex((it) => it.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex);
        onUpdateContent?.({ ...content, items: reordered });
      }
    }
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          {content.badge && (
            <span
              className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              {content.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {content.title || 'Pertanyaan yang Sering Diajukan (FAQ)'}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Accordion List with DnD-Kit */}
        {isEditor && onUpdateContent ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3.5">
                {items.map((item, idx) => (
                  <SortableFaqItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    idx={idx}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() => toggleItem(idx)}
                    isEditor={isEditor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-3.5">
            {items.map((item, idx) => {
              const isOpen = openIndices.includes(idx);

              return (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.question}
                      </span>
                    </div>

                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-in fade-in-50 duration-200">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
