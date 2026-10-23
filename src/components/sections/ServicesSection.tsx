import React, { useMemo } from 'react';
import { ServicesContent, ThemeConfig } from '../../types/schema';
import { Sparkles, Utensils, Scissors, Coffee, Award, Shield, Check, Flame, Clock, GripVertical } from 'lucide-react';
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ensureItemIds } from '../../utils/dndUtils';

interface Props {
  content: ServicesContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  onUpdateContent?: (newContent: ServicesContent) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  coffee: <Coffee className="w-6 h-6" />,
  scissors: <Scissors className="w-6 h-6" />,
  utensils: <Utensils className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  check: <Check className="w-6 h-6" />,
  clock: <Clock className="w-6 h-6" />,
};

interface CardProps {
  id: string;
  item: any;
  idx: number;
  isEditor?: boolean;
  primaryColor: string;
}

const SortableServiceCard: React.FC<CardProps> = ({ id, item, idx, isEditor, primaryColor }) => {
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
      className={`bg-white rounded-2xl p-6 sm:p-7 border transition-all flex flex-col justify-between group relative select-none ${
        isDragging
          ? 'shadow-2xl ring-2 ring-blue-500 scale-[1.03] opacity-90 z-50 bg-blue-50/40 border-blue-400'
          : 'shadow-xs hover:shadow-md border-slate-200/80'
      }`}
    >
      {/* Visual Index Badge + Drag Handle in Editor */}
      {isEditor && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs cursor-grab active:cursor-grabbing transition"
          title="Tahan dan geser (drag) untuk memindahkan kartu ini"
        >
          <GripVertical className="w-3.5 h-3.5 opacity-70" />
          <span>#{idx + 1}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Image or Icon */}
        {item.imageUrl ? (
          <div className="overflow-hidden rounded-xl h-44 w-full mb-2 bg-slate-100">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            {ICON_MAP[item.icon || 'check'] || <Check className="w-6 h-6" />}
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {item.title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>
      </div>

      {item.price && (
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Tarif / Harga</span>
          <span className="text-sm sm:text-base font-bold text-slate-900" style={{ color: primaryColor }}>
            {item.price}
          </span>
        </div>
      )}
    </div>
  );
};

export const ServicesSection: React.FC<Props> = ({ content, theme, isEditor, onUpdateContent }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const columns = (content as any).columns || '4';
  const padding = (content as any).padding || 'normal';

  const paddingClass =
    padding === 'compact'
      ? 'py-10 sm:py-14'
      : padding === 'spacious'
      ? 'py-24 sm:py-32'
      : 'py-16 sm:py-24';

  const gridColsClass =
    columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === '3'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold to activate drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Guarantee persistent, stable item IDs that travel with each item during arrayMove
  const items = useMemo(() => ensureItemIds(content.items, 'srv'), [content.items]);
  const itemIds = useMemo(() => items.map((it) => it.id), [items]);

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
    <section id="services" className={`${paddingClass} bg-slate-50/60`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          {content.badge && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              {content.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Services Grid with DnD-Kit Support in Editor */}
        {isEditor && onUpdateContent ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
                {items.map((item, idx) => (
                  <SortableServiceCard
                    key={item.id}
                    id={item.id}
                    item={item}
                    idx={idx}
                    isEditor={isEditor}
                    primaryColor={primaryColor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between group relative"
              >
                <div className="space-y-4">
                  {item.imageUrl ? (
                    <div className="overflow-hidden rounded-xl h-44 w-full mb-2 bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {ICON_MAP[item.icon || 'check'] || <Check className="w-6 h-6" />}
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.price && (
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Tarif / Harga</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900" style={{ color: primaryColor }}>
                      {item.price}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
