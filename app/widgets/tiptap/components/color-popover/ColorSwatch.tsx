"use client"

import * as React from "react"
import type { BootstrapColor, ColorSwatchProps } from "../../types"

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
  // Handle default color case
  if (color === 'default') {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={`Default ${variant} color`}
        title={`Remove ${variant} color`}
        className={`
          btn btn-sm p-1 position-relative border border-2 border-secondary
          bg-light text-dark
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
        {variant === 'text' ? (
          <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>A</span>
        ) : (
          <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>×</span>
        )}
      </button>
    )
  }

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