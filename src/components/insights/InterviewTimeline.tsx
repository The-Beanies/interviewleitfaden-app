import { useMemo } from 'react'

import { useInterviewStore } from '@/stores/interview-store'
import { useInsightsStore } from '@/stores/insights-store'

export function InterviewTimeline() {
  const interviews = useInterviewStore((state) => state.interviews)
  const trend = useMemo(
    () => useInsightsStore.getState().getSteveInterestTrend(),
    [interviews],
  )

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">STEVE-Interesse im Zeitverlauf</h3>
      <div className="mt-3 space-y-2">
        {trend.length ? (
          trend.map((point) => (
            <div key={point.date} className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 p-2 text-sm text-carbon-black/80">
              <p className="font-medium">{point.date}</p>
              <p>
                stark: {point.stark} · höflich: {point.hoeflich} · skeptisch: {point.skeptisch}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-carbon-black/50">Noch keine Verlaufsdaten vorhanden.</p>
        )}
      </div>
    </div>
  )
}
