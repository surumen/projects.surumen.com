// app/types/fplRecommender.ts

export interface UpcomingFixture {
    gw: number;
    turf: 'Home' | 'Away';
    opponent_id: number;
    opponent_name: string;
    opponent_short_name: string;
    difficulty: number;
    double_gw: boolean;
}

export interface Fixture {
    id: number;
    code: number;
    team_h: number;
    team_h_score: number | null;
    team_a: number;
    team_a_score: number | null;
    event: number;
    finished: boolean;
    minutes: number;
    provisional_start_time: boolean;
    kickoff_time: string;
    event_name: string;
    is_home: boolean;
    difficulty: number;
}

export interface CandidateBase {
    id: number;
    first_name: string;
    second_name: string;
    web_name: string;
    full_name: string;
    team: number;
    element_type: number;
    now_cost: number;
    total_points: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    form: number;
    points_per_game: number;
    selected_by_percent: number;
    minutes: number;
    bonus: number;
    transfers_in: number;
    transfers_out: number;
    status: string;
    chance_of_playing_next_round: number | null;
    chance_of_playing_this_round: number | null;
    value_form: number;
    value_season: number;
    cost_change_start: number;
    cost_change_event: number;
    history: unknown[];                // you can tighten this up if you ever use it
    fixtures: Fixture[];
    expected_points: {
        simple: number;
        mc: number;
    };
    upcoming: UpcomingFixture[];
}

export interface TransferOutCandidate extends CandidateBase {
    cons: Array<{
        code: string;
        detail: string;
    }>;
}

export interface TransferInCandidate extends CandidateBase {
    pros: Array<{
        code: string;
        detail: string;
    }>;
}

export interface ManagerStrategy {
    manager_id: number;
    current_gameweek: number;
    bank: number;
    transfer_out_candidates: TransferOutCandidate[];
    transfer_in_candidates: TransferInCandidate[];
}
