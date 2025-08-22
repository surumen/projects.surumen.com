// app/widgets/forms/utils/index.ts
// Form utilities barrel exports

export {
  buildGroupClasses,
  buildLabelClasses,
  buildControlClasses,
  buildInputGroupClasses,
  buildHelpTextClasses,
  buildCheckboxRadioClasses,
  buildFieldClasses,
  buildInputGroupTemplateClasses,
  buildSwitchTemplateClasses,
  buildCheckboxRadioTemplateClasses
} from './classBuilders';

export {
  selectFieldTemplate,
  shouldUseInputGroup,
  shouldUseInlineLayout,
  hasCustomStyling
} from './templateSelector';

export {
  renderAddon,
  generateFieldId,
  buildAriaDescribedBy,
  shouldShowOptionalText,
  getFieldPlaceholder,
  sanitizeFieldValue,
  isFieldValidating,
  getValidationStateClasses,
  getCommonControlProps
} from './templateHelpers';
