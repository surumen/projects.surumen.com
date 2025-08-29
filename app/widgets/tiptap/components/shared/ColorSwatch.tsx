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
  color: BootstrapColor | 'default'
  variant: 'text' | 'highlight'
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
}

/**
 * Generic ColorSwatch component that handles both text and highlight color variants
 */
export const ColorSwatch = React.memo<ColorSwatchProps>(({ 
  color, 
  variant,
  isActive,
  onToggle, 
  disabled = false 
}) => {
  // Default color swatch styling
  if (color === 'default') {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={variant === 'text' ? "Default text color" : "Default highlight (remove)"}
        title={variant === 'text' ? "Default text color" : "Remove highlight"}
        className={`
          btn btn-sm p-1 position-relative border border-2 border-secondary
          bg-light text-dark fw-bold
          ${isActive ? 'border-primary bg-primary-subtle' : ''}
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
        <span 
          style={{ fontSize: '0.75rem', lineHeight: 1 }}
        >
          {variant === 'text' ? 'A' : '×'}
        </span>
      </button>
    )
  }

  // Regular color swatch
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