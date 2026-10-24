import React, { useMemo } from 'react';
import { TestimonialsContent, ThemeConfig } from '../../types/schema';
import { Star, Quote, GripVertical } from 'lucide-react';
import { useViewport } from '../../context/ViewportContext';
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
  content: TestimonialsContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  onUpdateContent?: (newContent: TestimonialsContent) => void;
}

interface TestimonialCardProps {
  id: string;
  item: any;
  idx: number;
  primaryColor: string;
  isEditor?: boolean;
}

const SortableTestimonialCard: React.FC<TestimonialCardProps> = ({ id, item, idx, primaryColor, isEditor }) => {
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
      className={`p-8 rounded-2xl border transition-all relative flex flex-col justify-between select-none ${
        isDragging
          ? 'shadow-2xl ring-3 ring-blue-500 scale-[1.03] opacity-90 z-50 bg-blue-50/40 border-blue-400'
          : 'border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Visual Index Badge + Drag Handle in Editor */}
      {isEditor && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs cursor-grab active:cursor-grabbing transition"
          title="Tahan dan geser (drag) untuk memindahkan testimoni ini"
        >
          <GripVertical className="w-3.5 h-3.5 opacity-70" />
          <span>#{idx + 1}</span>
        </div>
      )}

      <Quote className="w-8 h-8 text-slate-200 absolute top-6 right-6" />

      <div className="space-y-4 mb-6 pt-4">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        <p className="text-slate-700 text-base italic leading-relaxed">
          &ldquo;{item.comment}&rdquo;
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
        {item.avatarUrl ? (
          <img
            src={item.avatarUrl}
            alt={item.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {item.name?.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
          {item.role && <p className="text-xs text-slate-500">{item.role}</p>}
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC<Props> = ({ content, theme, isEditor, onUpdateContent }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const columns = (content as any).columns || '2';
  const padding = (content as any).padding || 'normal';

  const { isMobile, isTablet } = useViewport();

  const paddingClass =
    padding === 'compact'
      ? 'py-8 sm:py-14'
      : padding === 'spacious'
      ? 'py-16 sm:py-32'
      : 'py-12 sm:py-24';

  const gridClass = isMobile
    ? 'grid-cols-1 max-w-xl'
    : isTablet
    ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
    : columns === '3'
    ? 'grid-cols-1 md:grid-cols-3 max-w-7xl'
    : 'grid-cols-1 md:grid-cols-2 max-w-4xl';

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

  const items = useMemo(() => ensureItemIds(content.items, 'testi'), [content.items]);
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
    <section id="testimonials" className={`${paddingClass} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
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

        {isEditor && onUpdateContent ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div className={`grid ${gridClass} gap-8 mx-auto`}>
                {items.map((item, idx) => (
                  <SortableTestimonialCard
                    key={item.id}
                    id={item.id}
                    item={item}
                    idx={idx}
                    primaryColor={primaryColor}
                    isEditor={isEditor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className={`grid ${gridClass} gap-8 mx-auto`}>
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-8 rounded-2xl border border-slate-200/90 bg-slate-50/40 relative flex flex-col justify-between"
              >
                <Quote className="w-8 h-8 text-slate-200 absolute top-6 right-6" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-base italic leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {item.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    {item.role && <p className="text-xs text-slate-500">{item.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
