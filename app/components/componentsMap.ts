import FantasyPremierLeague from "@/components/standings/FantasyPremierLeague";
import Assistant from '@/components/fpl/Assistant'
import DynamicBracket from '@/components/brackets/DynamicBracket';
import TournamentAssistant from '@/components/brackets/TournamentAssistant';

export const COMPONENTS_MAP = {
    tournament: TournamentAssistant,
    fpl: FantasyPremierLeague,
    fplAssistant: Assistant
}
