import { FieldType } from '../types/field';

export const SUPPORTED_FIELD_TYPES: FieldType[] = [
  'text',
  'email', 
  'password',
  'number',
  'tel',
  'url',
  'textarea',
  'search',
  'date',
  'time',
  'color',
  'range'
];

export const INPUT_FIELD_TYPES: FieldType[] = [
  'text',
  'email',
  'password', 
  'number',
  'tel',
  'url',
  'search',
  'date',
  'time',
  'color',
  'range'
];

export const DEFAULT_FIELD_TYPE: FieldType = 'text';
