import React, { useMemo, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import DynamicBracket from '@/components/brackets/DynamicBracket';
import DynamicForm, { FieldConfig } from '@/widgets/forms/DynamicForm';

const logos = {
    'ncaa': '/images/svg/ncaa.svg',
    'nba': '/images/svg/nba.svg',
    'ucl': '/images/svg/ucl.svg'
}


const TournamentAssistant: React.FC = () => {
    // constants
    const years = useMemo(() => [2022, 2023, 2024, 2025], []);
    const leagues = useMemo(() => ['ncaa', 'nba', 'ucl'], []);

    const yearOptions = years.map(y => ({ value: y, label: `${y}` }));
    const leagueOptions = leagues.map(l => ({ value: l, label: l.toUpperCase() }));

    // local state
    const [league, setLeague] = useState<string>('ncaa');
    const [year, setYear] = useState<number>(2025);

    // form configuration
    const formFields: FieldConfig[] = [
        {
            name: 'league',
            label: 'League',
            type: 'select',
            options: leagueOptions,
            required: true,
            initialValue: league,
        },
        {
            name: 'year',
            label: 'Year',
            type: 'select',
            options: yearOptions,
            required: true,
            initialValue: year,
        },
    ];

    // dynamic logo component for selected league
    const Logo = logos[league];

    return (
        <Card className="border-0 shadow-none">
            <Card.Header className="border-0 card-header-content-sm-between mb-4">
                <Image
                    className="avatar avatar-lg"
                    src={Logo}
                    alt={league}
                />
                <DynamicForm
                    formClassName="d-flex gap-3 align-items-end"
                    fields={formFields}
                    onFieldChange={({ league: l, year: y }) => {
                        setLeague(l);
                        setYear(Number(y));
                    }}
                    submitLabel={null}
                    onSubmit={() => {}}
                />
            </Card.Header>

            <DynamicBracket
                tournamentType={league}
                year={year}
                regionsPerRow={2}
            />
        </Card>
    );
};

export default TournamentAssistant;
