import type { VideoStatus } from '../../types'
import { STATUS_LABELS, statusTone } from '../../utils/format'

export function StatusBadge({ status }: { status: VideoStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusTone(status)}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
