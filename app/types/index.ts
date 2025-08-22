// app/types/index.ts
// Centralized type exports

// ========================
// PROJECT TYPES
// ========================
export type {
    // Project types
    Project
} from './project/project';

// ========================
// FORM TYPES
// ========================
export type {
    // Basic form field types
    Option,
    FieldType,
    
    // Advanced form types (current)
    FieldConfig,
    FormTemplate,
    FormDraft,
    FormSubmission,
    ValidationRule,
    AsyncValidationRule,
    ConditionalLogic,
    SmartFormProps,
    FormConfig,
    FormActions,
    FormState,
    
    // Advanced field configurations
    DateFieldConfig,
    FileUploadFieldConfig,
    TagInputFieldConfig,
    InputFieldConfig,
    SelectFieldConfig,
    TextareaFieldConfig,
    SwitchFieldConfig
} from './forms';

// ========================
// FORM STYLING SYSTEM
// ========================
export type {
    FieldStyling,
    InputGroupConfig,
    InputGroupAddon,
    FieldState,
    ClassMap,
    FieldTemplate,
    TemplateConfig
} from './forms/styling';

// ========================
// CMS TYPES
// ========================
export type {
    BlogPost,
    CustomComponent,
    ParsedComponent
} from './cms';

// ========================
// FANTASY PREMIER LEAGUE
// ========================
export type {
    // Team & Player types
    PremierLeagueTeam,
    PremierLeaguePlayer,
    
    // Strategy & Transfer types
    UpcomingFixture,
    Fixture,
    CandidateBase,
    TransferInCandidate,
    TransferOutCandidate,
    ManagerStrategy,
    ManagerHistoryEntry
} from './fpl/fpl';

// ========================
// TOURNAMENT BRACKETS
// ========================
export type {
    // Core tournament types
    Team,
    GameDefinition,
    Round,
    RegionDefinition,
    AdvancementRule,
    TournamentDefinition,
    GamePick,
    BracketUserState,
    BracketGameView,
    BracketRegionView,
    BracketView,
    TournamentConfig,
    RegionConfig,
    FinalConfig,
    SeedingStrategy,
    DrawRule,
    BracketEvent,
    ValidationResult,
    TournamentValidation,
    TournamentType,
    RegionType,
    
    // Component prop types
    BracketProps,
    RegionProps,
    RoundProps,
    GameProps,
    TeamProps,
    ConnectorProps,
    FinalProps
} from './brackets/brackets';