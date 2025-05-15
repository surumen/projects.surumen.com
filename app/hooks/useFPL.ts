// app/hooks/useFPL.ts
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const useFPL = () => {
    const league = useSelector((state: RootState) => state.fpl.league);
    const standings = useSelector((state: RootState) => state.fpl.standings);
    const entry = useSelector((state: RootState) => state.fpl.entry);
    const managerInfo = useSelector((state: RootState) => state.fpl.managerInfo);
    const managerHistory = useSelector((state: RootState) => state.fpl.managerHistory);
    const managerTransfers = useSelector((state: RootState) => state.fpl.managerTransfers);
    const managerTeam = useSelector((state: RootState) => state.fpl.managerTeam);
    const allManagerHistories = useSelector((state: RootState) => state.fpl.allManagerHistories);
    const allPlayers = useSelector((state: RootState) => state.fpl.allPlayers);
    const loading = useSelector((state: RootState) => state.fpl.loading);
    const error = useSelector((state: RootState) => state.fpl.error);

    // -> new selectors for strategy
    const strategy = useSelector((state: RootState) => state.fpl.strategy);
    const strategyLoading = useSelector(
        (state: RootState) => state.fpl.strategyLoading
    );
    const strategyError = useSelector(
        (state: RootState) => state.fpl.strategyError
    );

    return {
        league,
        standings,
        entry,
        managerInfo,
        managerHistory,
        managerTransfers,
        managerTeam,
        allManagerHistories,
        allPlayers,
        loading,
        error,
        // new
        strategy,
        strategyLoading,
        strategyError,
    };
};

export default useFPL;
