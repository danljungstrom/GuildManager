/**
 * AttendanceBadge Component
 *
 * Displays raid attendance status with color coding.
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceBadgeProps {
  status: AttendanceStatus;
  percentage?: number;
  showPercentage?: boolean;
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  present: {
    label: 'Present',
    className: 'bg-green-600 hover:bg-green-700 text-white',
  },
  absent: {
    label: 'Absent',
    className: 'bg-red-600 hover:bg-red-700 text-white',
  },
  late: {
    label: 'Late',
    className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  excused: {
    label: 'Excused',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

export function AttendanceBadge({
  status,
  percentage,
  showPercentage = false,
}: AttendanceBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className)}>
      {showPercentage && percentage !== undefined
        ? `${percentage}%`
        : config.label}
    </Badge>
  );
}
