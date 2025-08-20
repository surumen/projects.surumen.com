/**
 * Technology Color Mapping Utility
 * 
 * Provides consistent, automatic color assignment for technologies using hash-based allocation.
 * No manual maintenance required - works with any technology name.
 */

// Available accent colors from your design system
const ACCENT_COLORS = [
  'ocean',
  'crimson', 
  'rust',
  'canopy',
  'navy',
  'plum',
  'magenta',
  'gold',
  'zen',
  'sunset',
  'tangerine',
  'lime',
  'cloud',
  'orchid',
  'pink',
  'banana',
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
 * @returns Accent color name from your design system
 * 
 * @example
 * getTechnologyColor("TypeScript") // Always returns same color, e.g., "ocean"
 * getTechnologyColor("React") // Always returns same color, e.g., "crimson"
 */
export function getTechnologyColor(technology: string): string {
  // Normalize input for consistency
  const normalizedTech = technology.toLowerCase().trim();
  
  // Generate hash and map to color index
  const hash = hashString(normalizedTech);
  const colorIndex = hash % ACCENT_COLORS.length;
  
  return ACCENT_COLORS[colorIndex];
}

/**
 * Get accent color scheme for a technology (legacy compatibility)
 * 
 * @param technology - Technology name
 * @returns Accent color scheme name
 */
export function getTechnologyScheme(technology: string): string {
  return getTechnologyColor(technology);
}

/**
 * Batch get colors for multiple technologies
 * Useful for getting all colors at once for performance
 */
export function getTechnologyColors(technologies: string[]): Record<string, string> {
  const colorMap: Record<string, string> = {};
  
  technologies.forEach(tech => {
    colorMap[tech] = getTechnologyColor(tech);
  });
  
  return colorMap;
}

/**
 * Get color distribution statistics (useful for debugging)
 */
export function getColorDistribution(technologies: string[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  technologies.forEach(tech => {
    const color = getTechnologyColor(tech);
    distribution[color] = (distribution[color] || 0) + 1;
  });
  
  return distribution;
}

// Export the legacy function name for backward compatibility
export const getLanguageScheme = getTechnologyScheme;
