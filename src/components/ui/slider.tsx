"use client"

import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: number
  onValueChange: (value: number) => void
}

export function Slider({ className, value, onValueChange, ...props }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(event) => onValueChange(Number(event.target.value))}
      className={cn('h-2 w-full cursor-pointer accent-botanical-green', className)}
      {...props}
    />
  )
}
