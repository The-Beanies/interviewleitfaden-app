import type { ChecklistItem } from '@/types'

import { SectionWrapper } from '@/components/summary/SectionWrapper'

interface ChecklistPreviewProps {
  checklist: ChecklistItem[]
}

export function ChecklistPreview({ checklist }: ChecklistPreviewProps) {
  if (checklist.length === 0) return null

  return (
    <SectionWrapper id="checklist" title="Checkliste">
      <ul className="space-y-1">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm text-carbon-black/80">
            <span className={item.checked ? 'text-botanical-green' : 'text-carbon-black/30'}>
              {item.checked ? '✓' : '○'}
            </span>
            <span className={item.checked ? '' : 'text-carbon-black/50'}>{item.label}</span>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  )
}
