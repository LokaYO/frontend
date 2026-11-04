/**
 * Utility untuk menghasilkan URL publik website client / merchant.
 * Menggunakan format path resmi yang didukung penuh oleh Firebase Hosting & SSL:
 * Contoh: https://ruuby.my.id/sites/kopi-senja-2907
 * Utility untuk menghasilkan URL publik website client / merchant dalam format Subdomain:
 * Contoh: https://kopi-senja-2907.ruuby.my.id
 */

export function getBaseDomain(): string {
  if (typeof window === 'undefined') return 'ruuby.my.id';
  const host = window.location.hostname.toLowerCase();

  // Localhost atau raw IP address
  if (host === 'localhost' || host === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    return host;
  }

  // Jika di domain utama ruuby.my.id atau subdomainnya
  if (host.includes('ruuby.my.id')) {
    return 'ruuby.my.id';
  }

  // Jika di domain platform Firebase
  if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
    return 'ruuby.my.id';
  }

  // Ekstraksi domain untuk multi-part ccTLD (.my.id, .co.id, dll.)
  const parts = host.split('.');
  if (/\.(my|co|web|ac|sch|or|biz|go|mil)\.[a-z]{2,3}$/.test(host) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }

  return 'ruuby.my.id';
}

/**
 * Menghasilkan Full URL untuk website publik client.
 * Di production menghasilkan format subdomain: https://<slug>.ruuby.my.id
 * Di localhost fallback ke: http://localhost:5173/sites/<slug>
 */
export function getPublicSiteUrl(slug: string): string {
  if (!slug) return '';

  if (typeof window === 'undefined') {
    return `/sites/${slug}`;
    return `https://${slug}.ruuby.my.id`;
  }

  const { origin } = window.location;
  return `${origin}/sites/${slug}`;
  const host = window.location.hostname.toLowerCase();

  // Fallback localhost development
  if (host === 'localhost' || host === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    return `${window.location.origin}/sites/${slug}`;
  }

  const baseDomain = getBaseDomain();
  return `https://${slug}.${baseDomain}`;
}

/**
 * Menghasilkan tampilan label URL yang rapi untuk ditampilkan di UI / kartu website.
 * Contoh: "/sites/kopi-senja-2907"
 * Contoh: "kopi-senja-2907.ruuby.my.id"
 */
export function getPublicSiteDisplayUrl(slug: string): string {
  if (!slug) return '';
  return `/sites/${slug}`;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
      return `/sites/${slug}`;
    }
  }

  const baseDomain = typeof window !== 'undefined' ? getBaseDomain() : 'ruuby.my.id';
  return `${slug}.${baseDomain}`;
}

