// app/utils/formatting.ts
// Formatting utilities for tables and other components

import type { ColumnFormat, FormatConfig, FormatType } from '@/types';

/**
 * Format a value based on the provided format configuration
 */
export function formatValue(value: any, format: ColumnFormat): string {
  if (value === null || value === undefined) {
    return '—';
  }

  // Handle function formatters
  if (typeof format === 'function') {
    return format(value);
  }

  // Handle string format types
  if (typeof format === 'string') {
    return formatByType(value, format);
  }

  // Handle object format configs
  if (typeof format === 'object') {
    return formatByConfig(value, format);
  }

  // Fallback to string conversion
  return String(value);
}

/**
 * Format value by simple string type
 */
function formatByType(value: any, type: FormatType): string {
  switch (type) {
    case 'date':
      return formatDate(value, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
    case 'datetime':
      return formatDate(value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
    case 'time':
      return formatDate(value, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
    case 'currency':
      return formatCurrency(value);
      
    case 'number':
      return formatNumber(value);
      
    case 'relative':
      return formatRelativeTime(value);
      
    default:
      return String(value);
  }
}

/**
 * Format value by detailed config object
 */
function formatByConfig(value: any, config: FormatConfig): string {
  const { type, options = {}, locale = 'en-US' } = config;
  
  switch (type) {
    case 'date':
    case 'datetime':
    case 'time':
      return formatDate(value, options as Intl.DateTimeFormatOptions, locale);
      
    case 'currency':
    case 'number':
      return formatNumber(value, options as Intl.NumberFormatOptions, locale);
      
    case 'relative':
      return formatRelativeTime(value);
      
    default:
      return String(value);
  }
}

/**
 * Format date values
 */
function formatDate(
  value: any, 
  options: Intl.DateTimeFormatOptions, 
  locale: string = 'en-US'
): string {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    return String(value);
  }
}

/**
 * Format number/currency values
 */
function formatNumber(
  value: any,
  options: Intl.NumberFormatOptions = {},
  locale: string = 'en-US'
): string {
  try {
    const num = Number(value);
    if (isNaN(num)) {
      return String(value);
    }
    return num.toLocaleString(locale, options);
  } catch (error) {
    return String(value);
  }
}

/**
 * Format currency with default USD formatting
 */
function formatCurrency(value: any, currency: string = 'USD', locale: string = 'en-US'): string {
  return formatNumber(value, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }, locale);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(value: any): string {
  try {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // If future date, show as regular date
    if (diffMs < 0) {
      return formatDate(value, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
    
  } catch (error) {
    return String(value);
  }
}