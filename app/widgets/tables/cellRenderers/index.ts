// app/widgets/tables/cellRenderers/index.ts
// Cell renderers barrel exports

export { default as TextCell } from './TextCell';
export { default as LinkCell } from './LinkCell';
export { default as BadgeCell } from './BadgeCell';
export { default as AvatarCell } from './AvatarCell';
export { default as PaymentMethodCell } from './PaymentMethodCell';
export { default as ActionsCell } from './ActionsCell';
export { default as CustomCell } from './CustomCell';
export { default as TechnologiesBadgeCell } from './TechnologiesBadgeCell';

// Cell renderer mapping
import TextCell from './TextCell';
import LinkCell from './LinkCell';
import BadgeCell from './BadgeCell';
import AvatarCell from './AvatarCell';
import PaymentMethodCell from './PaymentMethodCell';
import ActionsCell from './ActionsCell';
import CustomCell from './CustomCell';
import TechnologiesBadgeCell from './TechnologiesBadgeCell';

export const CELL_RENDERERS = {
  text: TextCell,
  link: LinkCell,
  badge: BadgeCell,
  avatar: AvatarCell,
  paymentMethod: PaymentMethodCell,
  actions: ActionsCell,
  custom: CustomCell,
  technologies: TechnologiesBadgeCell
} as const;
