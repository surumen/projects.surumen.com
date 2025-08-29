"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   */
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-danger" | "outline-warning" | "outline-info" | "outline-light" | "outline-dark" | "link" | "ghost"
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg"
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Icon to display before children
   */
  icon?: React.ComponentType<{ style?: React.CSSProperties }>
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md", 
      loading = false,
      icon: Icon,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || disabled) return
        onClick?.(event)
      },
      [onClick, loading, disabled]
    )

    const buttonClass = cn(
      // Base Bootstrap classes
      "btn",
      // Variant classes
      variant === "ghost" 
        ? "btn-link text-body-secondary hover:text-body hover:bg-body-tertiary border-0"
        : `btn-${variant}`,
      // Size classes
      size === "sm" && "btn-sm",
      size === "lg" && "btn-lg",
      // Loading state
      loading && "opacity-75",
      // Custom classes
      className
    )

    return (
      <button
        ref={ref}
        className={buttonClass}
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        )}
        {Icon && !loading && (
          <Icon style={{ width: '1rem', height: '1rem', marginRight: children ? '0.5rem' : 0 }} />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button