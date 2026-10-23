import React, { useMemo } from 'react';
import { GalleryContent, ThemeConfig } from '../../types/schema';
import { GripVertical } from 'lucide-react';
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
  content: GalleryContent;
  theme: ThemeConfig;
  isEditor?: boolean;
  onUpdateContent?: (newContent: GalleryContent) => void;
}

interface ImageCardProps {
  id: string;
  img: any;
  idx: number;
  aspectClass: string;
  isEditor?: boolean;
}

const SortableGalleryImage: React.FC<ImageCardProps> = ({ id, img, idx, aspectClass, isEditor }) => {
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
      className={`group relative rounded-2xl overflow-hidden transition duration-300 bg-slate-100 select-none ${
        isDragging
          ? 'shadow-2xl ring-3 ring-blue-500 scale-[1.04] opacity-90 z-50'
          : 'shadow-xs hover:shadow-lg'
      }`}
    >
      {/* Visual Index Badge + Drag Handle in Editor */}
      {isEditor && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5 bg-slate-900/80 hover:bg-blue-600 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md cursor-grab active:cursor-grabbing transition"
          title="Tahan dan geser (drag) untuk memindahkan foto ini"
        >
          <GripVertical className="w-3.5 h-3.5 opacity-70" />
          <span>#{idx + 1}</span>
        </div>
      )}

      <img
        src={img.imageUrl}
        alt={img.caption || `Galeri foto ${idx + 1}`}
        className={`w-full ${aspectClass} object-cover group-hover:scale-105 transition duration-500`}
      />

      {img.caption && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 opacity-90 group-hover:opacity-100 transition">
          <span className="text-white text-sm font-medium">{img.caption}</span>
        </div>
      )}
    </div>
  );
};

export const GallerySection: React.FC<Props> = ({ content, theme, isEditor, onUpdateContent }) => {
  const primaryColor = theme.primaryColor || '#2563eb';
  const columns = (content as any).columns || '4';
  const padding = (content as any).padding || 'normal';
  const rawRatio = (content as any).aspectRatio || 'square';
  const aspectRatio = rawRatio as 'square' | 'landscape' | 'portrait';

  const paddingClass =
    padding === 'compact'
      ? 'py-10 sm:py-14'
      : padding === 'spacious'
      ? 'py-24 sm:py-32'
      : 'py-16 sm:py-24';

  const gridClass =
    columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === '3'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  const aspectClass =
    aspectRatio === 'landscape'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : 'aspect-square';

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

  const images = useMemo(() => ensureItemIds(content.images, 'gal'), [content.images]);
  const imageIds = useMemo(() => images.map((it) => it.id), [images]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((it) => it.id === active.id);
      const newIndex = images.findIndex((it) => it.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(images, oldIndex, newIndex);
        onUpdateContent?.({ ...content, images: reordered });
      }
    }
  };

  return (
    <section id="gallery" className={`${paddingClass} bg-slate-50/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {isEditor && onUpdateContent ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={imageIds} strategy={rectSortingStrategy}>
              <div className={`grid ${gridClass} gap-6`}>
                {images.map((img, idx) => (
                  <SortableGalleryImage
                    key={img.id}
                    id={img.id}
                    img={img}
                    idx={idx}
                    aspectClass={aspectClass}
                    isEditor={isEditor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className={`grid ${gridClass} gap-6`}>
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition duration-300 bg-slate-100"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || `Galeri foto ${idx + 1}`}
                  className={`w-full ${aspectClass} object-cover group-hover:scale-105 transition duration-500`}
                />

                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 opacity-90 group-hover:opacity-100 transition">
                    <span className="text-white text-sm font-medium">{img.caption}</span>
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
