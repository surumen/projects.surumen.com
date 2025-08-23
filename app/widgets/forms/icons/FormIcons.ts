// app/widgets/forms/icons/FormIcons.ts
// Centralized React Bootstrap Icons for forms

import {
  // User & Profile Icons
  Person,
  PersonFill,
  PersonCircle,
  
  // Communication Icons
  EnvelopeOpen,
  EnvelopeFill,
  Envelope,
  Telephone,
  TelephoneFill,
  
  // Security Icons
  Lock,
  LockFill,
  Key,
  KeyFill,
  Eye,
  EyeSlash,
  
  // Navigation & Actions
  Search,
  Calendar,
  CalendarDate,
  CalendarDateFill,
  
  // Financial Icons
  CurrencyDollar,
  CreditCard,
  CreditCardFill,
  
  // Content Icons
  FileText,
  FileTextFill,
  Image,
  ImageFill,
  Clipboard,
  ClipboardFill,
  
  // Location Icons
  GeoAlt,
  GeoAltFill,
  House,
  HouseFill,
  
  // Business Icons
  Building,
  BuildingFill,
  Briefcase,
  BriefcaseFill,
  
  // Utility Icons
  Plus,
  PlusCircle,
  Dash,
  X,
  Check,
  CheckCircle,
  ExclamationTriangle,
  InfoCircle,
  QuestionCircle,
  
  // Social Icons
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  
  // Technical Icons
  Code,
  CodeSlash,
  Terminal,
  Gear,
  GearFill
} from 'react-bootstrap-icons';

// ========================
// ORGANIZED ICON GROUPS
// ========================

export const FormIcons = {
  // User & Identity
  person: Person,
  personFill: PersonFill,
  personCircle: PersonCircle,
  
  // Communication
  email: EnvelopeOpen,
  emailFill: EnvelopeFill,
  envelope: Envelope,
  phone: Telephone,
  phoneFill: TelephoneFill,
  
  // Security & Privacy
  lock: Lock,
  lockFill: LockFill,
  key: Key,
  keyFill: KeyFill,
  show: Eye,
  hide: EyeSlash,
  
  // Search & Discovery
  search: Search,
  calendar: Calendar,
  calendarDate: CalendarDate,
  calendarDateFill: CalendarDateFill,
  
  // Financial
  dollar: CurrencyDollar,
  creditCard: CreditCard,
  creditCardFill: CreditCardFill,
  
  // Content & Media
  text: FileText,
  textFill: FileTextFill,
  image: Image,
  imageFill: ImageFill,
  clipboard: Clipboard,
  clipboardFill: ClipboardFill,
  
  // Location & Address
  location: GeoAlt,
  locationFill: GeoAltFill,
  home: House,
  homeFill: HouseFill,
  
  // Business & Work
  building: Building,
  buildingFill: BuildingFill,
  briefcase: Briefcase,
  briefcaseFill: BriefcaseFill,
  
  // Actions & States
  add: Plus,
  addCircle: PlusCircle,
  remove: Dash,
  close: X,
  check: Check,
  checkCircle: CheckCircle,
  warning: ExclamationTriangle,
  info: InfoCircle,
  help: QuestionCircle,
  
  // Social & Web
  website: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  
  // Technical & Development
  code: Code,
  codeSlash: CodeSlash,
  terminal: Terminal,
  settings: Gear,
  settingsFill: GearFill
} as const;

// ========================
// ICON CATEGORIES FOR EASY DISCOVERY
// ========================

export const IconCategories = {
  identity: ['person', 'personFill', 'personCircle'],
  communication: ['email', 'emailFill', 'envelope', 'phone', 'phoneFill'],
  security: ['lock', 'lockFill', 'key', 'keyFill', 'show', 'hide'],
  financial: ['dollar', 'creditCard', 'creditCardFill'],
  location: ['location', 'locationFill', 'home', 'homeFill'],
  business: ['building', 'buildingFill', 'briefcase', 'briefcaseFill'],
  content: ['text', 'textFill', 'image', 'imageFill', 'clipboard', 'clipboardFill'],
  actions: ['add', 'addCircle', 'remove', 'close', 'check', 'checkCircle'],
  feedback: ['warning', 'info', 'help'],
  social: ['website', 'linkedin', 'twitter', 'facebook', 'instagram'],
  technical: ['code', 'codeSlash', 'terminal', 'settings', 'settingsFill'],
  datetime: ['calendar', 'calendarDate', 'calendarDateFill'],
  search: ['search']
} as const;

// ========================
// COMMON ICON PRESETS
// ========================

export const CommonFieldIcons = {
  email: FormIcons.email,
  password: FormIcons.lock,
  search: FormIcons.search,
  phone: FormIcons.phone,
  name: FormIcons.person,
  address: FormIcons.location,
  website: FormIcons.website,
  company: FormIcons.building,
  date: FormIcons.calendar,
  price: FormIcons.dollar,
  settings: FormIcons.settings
} as const;

// ========================
// TYPE EXPORTS
// ========================

export type FormIconKey = keyof typeof FormIcons;
export type IconCategoryKey = keyof typeof IconCategories;
export type CommonIconKey = keyof typeof CommonFieldIcons;
