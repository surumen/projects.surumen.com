import { useSelector } from 'react-redux';

const useFPL = () => {
    const league = useSelector((state: any) => state.fpl.league);
    const standings = useSelector((state: any) => state.fpl.standings);
    const entry = useSelector((state: any) => state.fpl.entry);
    const managerInfo = useSelector((state: any) => state.fpl.managerInfo);
    const managerHistory = useSelector((state: any) => state.fpl.managerHistory);
    const managerTransfers = useSelector((state: any) => state.fpl.managerTransfers);
    const managerTeam = useSelector((state: any) => state.fpl.managerTeam);
    const allManagerHistories = useSelector((state: any) => state.fpl.allManagerHistories);
    const allPlayers = useSelector((state: any) => state.fpl.allPlayers);
    const loading = useSelector((state: any) => state.fpl.loading);
    const error = useSelector((state: any) => state.fpl.error);

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
        error
    };
};

export default useFPL;
