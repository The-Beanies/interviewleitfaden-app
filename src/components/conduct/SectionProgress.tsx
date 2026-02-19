export function SectionProgress({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const active = index === currentIndex
        const done = index < currentIndex
        return (
          <span
            key={index}
            className={`h-2 rounded-full transition-all ${
              active ? 'w-8 bg-botanical-green' : done ? 'w-3 bg-botanical-green/60' : 'w-3 bg-terrazzo-grey'
            }`}
          />
        )
      })}
    </div>
  )
}
