// app/types/index.ts
// Centralized type exports

// ========================
// PROJECT & FORMS
// ========================
export type {
    // Project types
    Project,
    
    // Form types
    Option,
    FieldType,
    FieldConfig,
    DynamicFormProps
} from './project/project';

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
