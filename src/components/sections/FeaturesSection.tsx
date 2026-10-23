import React, { useMemo } from 'react';
import { FeaturesContent, ThemeConfig } from '../../types/schema';
import { Shield, Clock, Smile, Award, Wifi, Truck, Wrench, CheckCircle, GripVertical } from 'lucide-react';
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
  content: FeaturesContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  onUpdateContent?: (newContent: FeaturesContent) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  clock: <Clock className="w-6 h-6" />,
  smile: <Smile className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  wifi: <Wifi className="w-6 h-6" />,
  truck: <Truck className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
};

interface FeatureCardProps {
  id: string;
  item: any;
  idx: number;
  isEditor?: boolean;
  primaryColor: string;
}

const SortableFeatureCard: React.FC<FeatureCardProps> = ({ id, item, idx, isEditor, primaryColor }) => {
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
      className={`p-8 rounded-2xl border transition-all space-y-4 text-center sm:text-left relative select-none ${
        isDragging
          ? 'shadow-2xl ring-2 ring-blue-500 scale-[1.03] opacity-90 z-50 bg-blue-50/40 border-blue-400'
          : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md'
      }`}
    >
      {/* Visual Index Badge + Drag Handle in Editor */}
      {isEditor && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs cursor-grab active:cursor-grabbing transition"
          title="Tahan dan geser (drag) untuk memindahkan keunggulan ini"
        >
          <GripVertical className="w-3.5 h-3.5 opacity-70" />
          <span>#{idx + 1}</span>
        </div>
      )}

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto sm:mx-0 shadow-xs"
        style={{ backgroundColor: primaryColor }}
      >
        {ICON_MAP[item.icon || 'shield'] || <CheckCircle className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        {item.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};

export const FeaturesSection: React.FC<Props> = ({ content, theme, isEditor, onUpdateContent }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const columns = (content as any).columns || '3';
  const padding = (content as any).padding || 'normal';

  const paddingClass =
    padding === 'compact'
      ? 'py-10 sm:py-14'
      : padding === 'spacious'
      ? 'py-24 sm:py-32'
      : 'py-16 sm:py-24';

  const gridClass =
    columns === '2'
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === '4'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-3';

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

  const items = useMemo(() => ensureItemIds(content.items, 'feat'), [content.items]);
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
    <section id="features" className={`${paddingClass} bg-white`}>
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
              <div className={`grid ${gridClass} gap-8`}>
                {items.map((item, idx) => (
                  <SortableFeatureCard
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
          <div className={`grid ${gridClass} gap-8`}>
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all space-y-4 text-center sm:text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto sm:mx-0 shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {ICON_MAP[item.icon || 'shield'] || <CheckCircle className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
