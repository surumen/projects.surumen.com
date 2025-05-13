import React, { Fragment, useMemo, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import DynamicBracket from '@/components/brackets/DynamicBracket';
import { FieldConfig } from '@/widgets/forms/DynamicForm';
import { CursorFill } from 'react-bootstrap-icons';
import DynamicForm from '@/widgets/forms/DynamicForm';

const TournamentAssistant: React.FC = () => {
    const years = useMemo(() => [2022, 2023, 2024, 2025], []);
    const tournaments = useMemo(() => ['ncaa', 'nba', 'ucl'], []);

    const yearOptions = years.map(y => ({ value: y, label: `${y}` }));
    const tournamentOptions = tournaments.map(t => ({ value: t, label: t.toUpperCase() }));

    const [tournament, setTournament] = useState<string>('ncaa');
    const [year, setYear] = useState<number>(2025);

    const formFields: FieldConfig[] = [
        {
            name: 'tournament',
            label: 'Tournament',
            type: 'select',
            options: tournamentOptions,
            required: true,
            initialValue: tournament,
            groupClassName: 'd-flex flex-fill align-items-center gap-3',
        },
        {
            name: 'year',
            label: 'Year',
            type: 'select',
            options: yearOptions,
            required: true,
            initialValue: year,
            groupClassName: 'd-flex flex-fill align-items-center gap-3',
        },
    ];

    return (
        <Fragment>
            <Card className="border-0 shadow-none">
                <Card.Header className="border-0 card-header-content-sm-between mb-4">
                    <h4 className="fw-semibold text-muted card-header-title mb-2 mb-sm-0">
                        {tournament.toUpperCase()} — {year}
                    </h4>
                    <DynamicForm
                        formClassName="d-flex gap-3 align-items-end"
                        fields={formFields}
                        onFieldChange={vals => {
                            setTournament(vals.tournament as string);
                            setYear(Number(vals.year));
                        }}
                        submitLabel={null}
                        onSubmit={() => {}}
                    />
                </Card.Header>

                <DynamicBracket
                    tournamentType={tournament as 'ncaa' | 'nba' | 'ucl'}
                    year={year}
                    regionsPerRow={2}
                />
            </Card>
        </Fragment>
    );
};

export default TournamentAssistant;
