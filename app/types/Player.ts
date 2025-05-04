export interface Player {
    id: number;
    first_name: string;
    second_name: string;
    web_name: string;
    full_name: string;
    team: number;
    element_type: number; // 1 = GK, 2 = DEF, 3 = MID, 4 = FWD
    now_cost: number;
    total_points: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    form: string;
    points_per_game: string;
    selected_by_percent: string;
    minutes: number;
    bonus: number;
    transfers_in: number;
    transfers_out: number;
    status: string; // e.g. "a", "i", etc.
    chance_of_playing_next_round: number | null;
    chance_of_playing_this_round: number | null;
    value_form: string;
    value_season: string;
    cost_change_start: number;
    cost_change_event: number;
}
