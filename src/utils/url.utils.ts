/**
 * Utility untuk menghasilkan URL publik website client / merchant.
 * Menggunakan format path resmi yang didukung penuh oleh Firebase Hosting & SSL:
 * Contoh: https://ruuby.my.id/sites/kopi-senja-2907
 */

export function getPublicSiteUrl(slug: string): string {
  if (!slug) return '';

  if (typeof window === 'undefined') {
    return `/sites/${slug}`;
  }

  const { origin } = window.location;
  return `${origin}/sites/${slug}`;
}

/**
 * Menghasilkan tampilan label URL yang rapi untuk ditampilkan di UI / kartu website.
 * Contoh: "/sites/kopi-senja-2907"
 */
export function getPublicSiteDisplayUrl(slug: string): string {
  if (!slug) return '';
  return `/sites/${slug}`;
}

