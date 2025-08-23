// app/widgets/tables/cellRenderers/index.ts
// Cell renderers barrel exports

export { default as TextCell } from './TextCell';
export { default as LinkCell } from './LinkCell';
export { default as BadgeCell } from './BadgeCell';
export { default as CustomCell } from './CustomCell';

// Cell renderer mapping
import TextCell from './TextCell';
import LinkCell from './LinkCell';
import BadgeCell from './BadgeCell';
import CustomCell from './CustomCell';

export const CELL_RENDERERS = {
  text: TextCell,
  link: LinkCell,
  badge: BadgeCell,
  custom: CustomCell
} as const;
