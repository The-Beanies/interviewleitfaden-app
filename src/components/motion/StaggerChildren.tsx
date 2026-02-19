'use client'

import { useEffect, useRef, useState, Children, type ReactNode } from 'react'

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
}

export default function StaggerChildren({ children, className }: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className ?? ''} ${visible ? 'stagger-children' : ''}`}>
      {Children.map(children, (child) => (
        <div style={{ opacity: visible ? undefined : 0 }}>{child}</div>
      ))}
    </div>
  )
}
