/**
 * Technology Color Mapping Utility
 * 
 * Provides consistent, automatic color assignment for technologies using hash-based allocation.
 * No manual maintenance required - works with any technology name.
 */

// Available accent colors from your design system
const ACCENT_COLORS = [
  'ocean',
  'gold',
  'plum',
  'crimson',
  'success',
  'info',
  'warning',
  'secondary',
  'rust',
  'canopy',
  'navy',
  'plum',
  'magenta',
  'primary'
] as const;

const SEMANTIC_COLORS = [
  'primary',
  'info',
  'dark',
  'warning',
  'success'
] as const;

/**
 * Simple hash function for consistent color assignment
 * Same input always produces same output
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent accent color for any technology
 * 
 * @param technology - Technology name (e.g., "TypeScript", "React", "OpenAI")
 * @param color_map - color map
 * @returns Accent color name from your design system
 * 
 * @example
 * getHashedColor("TypeScript") // Always returns same color, e.g., "ocean"
 * getHashedColor("React") // Always returns same color, e.g., "crimson"
 */
export function getHashedColor(technology: string, color_map): string {
  // Normalize input for consistency
  const normalizedTech = technology.toLowerCase().trim();
  
  // Generate hash and map to color index
  const hash = hashString(normalizedTech);
  const colorIndex = hash % color_map.length;
  
  return color_map[colorIndex];
}

/**
 * Get accent color scheme for a technology area
 * 
 * @param technology - Technology name
 * @returns Accent color scheme name
 */
export function getTechnologyScheme(technology: string): string {
  return getHashedColor(technology, ACCENT_COLORS);
}



/**
 * Get accent color scheme for a category
 */
export function getCategoryScheme(technology: string): string {
  return getHashedColor(technology, SEMANTIC_COLORS);
}

