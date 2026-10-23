/**
 * Utility to guarantee stable, persistent IDs for @dnd-kit sortable lists.
 * When items are reordered via arrayMove, their IDs must travel with them
 * so that @dnd-kit's internal position cache and drop animations properly settle
 * instead of snapping back to index-based keys.
 */
export function ensureItemIds<T extends Record<string, any>>(
  items: T[] | undefined,
  prefix: string
): (T & { id: string })[] {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item, idx) => {
    if (item && item.id) {
      return item as T & { id: string };
    }

    const titleSeed = (
      item.title ||
      item.name ||
      item.caption ||
      item.question ||
      'item'
    )
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const generatedId = `${prefix}-${titleSeed || 'el'}-${idx}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      ...item,
      id: generatedId,
    };
  });
}

