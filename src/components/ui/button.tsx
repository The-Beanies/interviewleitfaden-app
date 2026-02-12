"use client"

import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClassMap: Record<ButtonVariant, string> = {
  default: 'bg-botanical-green text-studio-white hover:bg-botanical-green/90',
  secondary: 'bg-terrazzo-grey/30 text-carbon-black hover:bg-terrazzo-grey',
  outline: 'border border-terrazzo-grey bg-studio-white text-carbon-black hover:bg-terrazzo-grey/20',
  ghost: 'bg-transparent text-carbon-black/70 hover:bg-terrazzo-grey/30',
  destructive: 'bg-error text-studio-white hover:bg-error/90',
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-11 px-5 text-base',
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-card font-medium transition disabled:pointer-events-none disabled:opacity-50',
        variantClassMap[variant],
        sizeClassMap[size],
        className,
      )}
      {...props}
    />
  )
}
