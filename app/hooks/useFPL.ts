// app/hooks/useFPL.ts
import { useFPLStore } from '@/store/store';

const useFPL = () => {
    const {
        // Data state
        league,
        standings,
        entry,
        managerInfo,
        managerHistory,
        managerTransfers,
        managerTeam,
        allManagerHistories,
        allPlayers,
        strategy,
        
        // Loading states
        loading,
        error,
        strategyLoading,
        strategyError,
        
        // Actions
        fetchLeagueData,
        fetchManagerData,
        fetchManagerTeam,
        fetchAllManagerHistories,
        planManagerStrategy,
        setAllPlayers,
        reset
    } = useFPLStore();

    return {
        // Data (same interface as Redux version)
        league,
        standings,
        entry,
        managerInfo,
        managerHistory,
        managerTransfers,
        managerTeam,
        allManagerHistories,
        allPlayers,
        strategy,
        
        // Loading states
        loading,
        error,
        strategyLoading,
        strategyError,
        
        // Actions (now available directly, no dispatch needed!)
        fetchLeagueData,
        fetchManagerData,
        fetchManagerTeam,
        fetchAllManagerHistories,
        planManagerStrategy,
        setAllPlayers,
        reset
    };
};

export default useFPL;
