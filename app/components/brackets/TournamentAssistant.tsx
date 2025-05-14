import React, { useMemo } from 'react';
import { Card, Image } from 'react-bootstrap';
import DynamicBracket from '@/components/brackets/DynamicBracket';
import DynamicForm, { FieldConfig } from '@/widgets/forms/DynamicForm';
import { GameData } from '@/types';
import GameSelector from '@/widgets/brackets/GameSelector';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLeague, setYear } from '@/store/bracketSlice';

const logos: Record<string, string> = {
    ncaa: '/images/svg/ncaa.svg',
    nba:  '/images/svg/nba.svg',
    ucl:  '/images/svg/ucl.svg',
};

const TournamentAssistant: React.FC = () => {
    const dispatch = useAppDispatch();

    const league = useAppSelector((state) => state.bracket.currentLeague);
    const year   = useAppSelector((state) => state.bracket.currentYear);

    const years   = useMemo(() => [2022, 2023, 2024, 2025], []);
    const leagues = useMemo(() => ['ncaa', 'nba', 'ucl'], []);
    const yearOptions   = years.map((y) => ({ value: y, label: `${y}` }));
    const leagueOptions = leagues.map((l) => ({ value: l, label: l.toUpperCase() }));

    const formFields: FieldConfig[] = [
        {
            name:         'league',
            label:        'League',
            type:         'select',
            options:      leagueOptions,
            required:     true,
            initialValue: league,
        },
        {
            name:         'year',
            label:        'Year',
            type:         'select',
            options:      yearOptions,
            required:     true,
            initialValue: year,
        },
    ];

    const Logo = logos[league];

    const renderRegionHeader = (name: string) => {
        if (league === 'ucl') return null;
        return (
            <h2
                className="position-absolute text-uppercase text-muted"
                style={{
                    top:           '50%',
                    left:          '50%',
                    transform:     'translate(-50%, -50%)',
                    zIndex:        1,
                    pointerEvents: 'none',
                }}
            >
                {name}
            </h2>
        );
    };

    const renderGameFooter = (_game: GameData, _type: string) => {
        if (league !== 'nba') return null;

        const winner = _game.winnerSeed;
        const cls = winner ? `bg-accent-${winner.color} text-${winner.color}` : ''
        return (
            <GameSelector
                type={_type}
                className={cls}
            />
        );
    };

    return (
        <Card className="border-0 shadow-none">
            <Card.Header className="border-0 card-header-content-sm-between mb-4 px-0 px-md-2">
                <Image className="avatar avatar-lg" src={Logo} alt={league} />

                <DynamicForm
                    formClassName="d-flex gap-3 align-items-end"
                    fields={formFields}
                    onFieldChange={({ league: l, year: y }) => {
                        // 3) dispatch into Redux
                        dispatch(setLeague(l));
                        dispatch(setYear(Number(y)));
                    }}
                    submitLabel={null}
                    onSubmit={() => {}}
                />
            </Card.Header>

            <DynamicBracket
                tournamentType={league}
                year={year}
                regionsPerRow={2}
                renderRegionHeader={renderRegionHeader}
                renderGameFooter={renderGameFooter}
            />
        </Card>
    );
};

export default TournamentAssistant;
