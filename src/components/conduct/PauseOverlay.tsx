export function PauseOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-carbon-black/20 backdrop-blur-[1px]">
      <div className="rounded-card border border-terrazzo-grey bg-studio-white px-5 py-3 shadow-level2">
        <p className="text-sm font-semibold text-carbon-black">Timer pausiert</p>
      </div>
    </div>
  )
}
