export interface OperatingStatus {
  isOpen: boolean;
  statusLabel: string;
  detailLabel: string;
  badgeClass: string;
  dotClass: string;
}

/**
 * Menghitung status buka/tutup bisnis lokal berdasarkan jam operasional
 * Mendukung format:
 * - openTime ("08:00") & closeTime ("22:00")
 * - operatingHours string (misal: "08:00 - 22:00" atau "Setiap Hari: 09:00 - 21:00")
 */
export function getOperatingStatus(
  operatingHours?: string,
  openTime?: string,
  closeTime?: string
): OperatingStatus {
  // Default values jika belum diset
  let startHour = 8;
  let startMin = 0;
  let endHour = 22;
  let endMin = 0;

  let parsed = false;

  if (openTime && closeTime) {
    const [oh, om] = openTime.split(':').map((v) => parseInt(v, 10));
    const [ch, cm] = closeTime.split(':').map((v) => parseInt(v, 10));
    if (!isNaN(oh) && !isNaN(ch)) {
      startHour = oh;
      startMin = om || 0;
      endHour = ch;
      endMin = cm || 0;
      parsed = true;
    }
  }

  if (!parsed && operatingHours) {
    // Regex mencari pola "08:00 - 21:00" atau "08.00 - 21.00"
    const match = operatingHours.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/);
    if (match) {
      startHour = parseInt(match[1], 10);
      startMin = parseInt(match[2], 10);
      endHour = parseInt(match[3], 10);
      endMin = parseInt(match[4], 10);
      parsed = true;
    }
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = startHour * 60 + startMin;
  const closeMinutes = endHour * 60 + endMin;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const closeTimeFormatted = `${pad(endHour)}:${pad(endMin)}`;
  const openTimeFormatted = `${pad(startHour)}:${pad(startMin)}`;

  let isOpen = false;

  if (closeMinutes > openMinutes) {
    // Jam buka normal di hari yang sama (misal 08:00 s/d 22:00)
    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Jam buka melintasi tengah malam (misal 18:00 s/d 02:00)
    isOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  if (isOpen) {
    return {
      isOpen: true,
      statusLabel: 'Buka Sekarang',
      detailLabel: `Tutup pukul ${closeTimeFormatted}`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotClass: 'bg-emerald-500 animate-pulse',
    };
  } else {
    return {
      isOpen: false,
      statusLabel: 'Sedang Tutup',
      detailLabel: `Buka pukul ${openTimeFormatted}`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotClass: 'bg-rose-500',
    };
  }
}
