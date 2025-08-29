"use client"

import * as React from "react"

export type BootstrapColor = 
  | "primary"
  | "secondary" 
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"

export interface ColorSwatchProps {
  color: BootstrapColor
  variant: 'text' | 'highlight'
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
}

/**
 * ColorSwatch component for displaying individual colors
 */
export const ColorSwatch = React.memo<ColorSwatchProps>(({ 
  color, 
  variant,
  isActive,
  onToggle, 
  disabled = false 
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={`${color} ${variant} color`}
      title={`Apply ${color} ${variant} color`}
      className={`
        btn btn-sm p-1 position-relative border-0
        bg-soft-${color}
        ${isActive ? 'border border-2 border-primary' : ''}
        ${disabled ? 'opacity-50' : 'hover:scale-110'}
      `}
      style={{ 
        minWidth: variant === 'text' ? '1.75rem' : '1.5rem',
        minHeight: variant === 'text' ? '1.75rem' : '1.5rem',
        borderRadius: '50%',
        transition: 'transform 0.1s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {variant === 'text' && (
        <span 
          className={`fw-bold text-${color}`}
          style={{ fontSize: '0.75rem', lineHeight: 1 }}
        >
          A
        </span>
      )}
    </button>
  )
})

ColorSwatch.displayName = 'ColorSwatch'

export default ColorSwatch