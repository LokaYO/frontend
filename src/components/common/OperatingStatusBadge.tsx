import React from 'react';
import { getOperatingStatus } from '../../utils/operatingHours';
import { Clock } from 'lucide-react';

interface Props {
  operatingHours?: string;
  openTime?: string;
  closeTime?: string;
  showDetail?: boolean;
  className?: string;
}

export const OperatingStatusBadge: React.FC<Props> = ({
  operatingHours,
  openTime,
  closeTime,
  showDetail = true,
  className = '',
}) => {
  const status = getOperatingStatus(operatingHours, openTime, closeTime);

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs ${status.badgeClass} ${className}`}
      title={`${status.statusLabel} (${status.detailLabel})`}
    >
      <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
      <span className="font-bold">{status.statusLabel}</span>
      {showDetail && (
        <span className="opacity-80 font-normal text-[11px] hidden sm:inline">
          &bull; {status.detailLabel}
        </span>
      )}
    </div>
  );
};
