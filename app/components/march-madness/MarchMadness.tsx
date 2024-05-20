// import node module libraries
import { forwardRef, Fragment, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import Link from 'next/link';

// import bootstrap icons
import { Dropdown } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';

import useWindowSize from '@/hooks/useWindowSize';
import Bracket from '@/widgets/brackets/Bracket';

import { useMediaQuery } from "react-responsive";
import { winningPathLength } from "@/utils/winningPathLength";
import { createBracket } from "@/utils/makeBrackets";
import { EAST_SEEDS, MIDWEST_SEEDS, SOUTH_SEEDS, WEST_SEEDS } from "@/data/march-madness/Seeds";
import { advanceTeam } from "@/utils/advanceTeam";
import { Game, SideInfo } from "@/types/Brackets";



const MarchMadness = () => {

    const [eastBracket, setEastBracket] = useState(createBracket(EAST_SEEDS));
    const [westBracket, setWestBracket] = useState(createBracket(WEST_SEEDS));
    const [midWestBracket, setMidWestBracket] = useState(createBracket(MIDWEST_SEEDS));
    const [southBracket, setSouthBracket] = useState(createBracket(SOUTH_SEEDS));

    const { height } = useWindowSize();
    const wrapperRef: MutableRefObject<any> = useRef();
    const [refVisible, setRefVisible] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [bracketDimensions, setBracketDimensions] = useState<any>({width: 160, height: height})

    const numRounds = useMemo(() => winningPathLength(eastBracket), [eastBracket]);

    const roundSeparatorWidth = 24 / 8;

    const rounds = useMemo(() => ['Round 1', 'Round 2', 'Sweet 16', 'Elite 8'], []);
    const years = useMemo(() => [2024, 2023, 2022, 2021], []);
    const mlModels = useMemo(() => [
        'Logistic Regression', 'Recurrent Neural Network'
    ], []);
    const [activeYear, setActiveYear] = useState<number>(2024);
    const [activeModel, setActiveModel] = useState<string>(mlModels[0]);


    useEffect(() => {
        if (!refVisible) {
            return
        }
        setBracketDimensions({
            width: isMobile ? wrapperRef.current.offsetWidth : Math.abs(wrapperRef.current.offsetWidth) / 2,
            height: height
        });
        setRefVisible(true);
    }, [height, isMobile, refVisible])


    const ToggleYear: any = forwardRef((props: any, ref: any) => (
        <Link
            href='#'
            ref={ref}
            onClick={(e: any) => {
                e.preventDefault();
                props.onClick(e);
            }}
        >
            {props.children}
        </Link>
    ));
    ToggleYear.displayName = 'ToggleFilter';

    const handleYearFilter = (year: number) => {
        setActiveYear(year);
    };

    const handleModelFilter = (model: string) => {
        setActiveModel(model);
    };

    const handleAdvanceTeam = (team: SideInfo, game: Game, bracket: Game, label: 'east' | 'west' | 'south' | 'midwest') => {
        const updatedBracket = advanceTeam(team, game, bracket);
        switch (label) {
            case 'east':
                setEastBracket(updatedBracket);
                break
            case 'west':
                setWestBracket(updatedBracket);
                break
            case 'south':
                setSouthBracket(updatedBracket);
                break
            default:
                setMidWestBracket(updatedBracket)
        }
    }

    return (
        <div className='svg-wrapper' ref={el => { wrapperRef.current = el; setRefVisible(!!el); }}>
            <div>
                <div className='row align-items-center g-6 mt-0'>
                    <div className='col-sm-6 mt-0'>
                        <div className='d-flex gap-2'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    as={ToggleYear}
                                    id='toggle-data-year'
                                >
                                    <button className='btn btn-sm btn-outline-secondary bg-light-hover text-primary-hover flex-none d-flex align-items-center gap-2 p-1'>
                                        <span className='ms-2'>Year:</span>
                                        <span className='ms-2'>{activeYear}</span>
                                        <ChevronDown size={8} className='text-xs me-1'/>
                                    </button>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as="ul">
                                    {years.map((item, index) => {
                                        return (
                                            <Dropdown.Item eventKey={index}
                                                           as="li" bsPrefix=" " key={index}
                                                           onClick={() => handleYearFilter(item)}
                                            >
                                                <Link href="#" className={`dropdown-item ${activeYear === item ? 'active' : ' '}`}>
                                                    {item}
                                                </Link>
                                            </Dropdown.Item>
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className='col-sm-6 mt-0'>
                        <div className='hstack justify-content-end gap-2'>
                            <div className='d-flex align-items-center justify-content-end gap-2'>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as={ToggleYear}
                                        id='toggle-model'
                                    >
                                        <button className='btn btn-sm btn-outline-secondary bg-light-hover text-primary-hover flex-none d-flex align-items-center gap-2 p-1'>
                                            <span className='ms-2'>Model:</span>
                                            <span className='ms-2'>{activeModel}</span>
                                            <ChevronDown size={8} className='text-xs me-1'/>
                                        </button>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as="ul">
                                        {mlModels.map((item, index) => {
                                            return (
                                                <Dropdown.Item eventKey={index} as="li" bsPrefix=" " key={index} onClick={() => handleModelFilter(item)}>
                                                    <Link href='#' className={`dropdown-item ${activeModel === item ? 'active' : ' '}`}>
                                                        {item}
                                                    </Link>
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='my-6'/>
                <ul className={`bg-body d-none d-md-flex nav nav-segment border p-0 nav-fill rounded-top-start rounded-bottom-start rounded-top-end rounded-bottom-end`}>
                    {rounds.slice(0, rounds.length - 1).map((round, i) => (
                        <li key={i} className={`nav-link border-radius-0 justify-content-center align-items-center px-3 py-1 text-center`}>
                            <div className='surtitle fw-semibold text-info'>{round}</div>
                            <div className='text-xxs fw-light text-opacity-75 text-muted'>March 16-20</div>
                        </li>
                    ))}
                    <li className={`nav-link w-25 border-radius-0 justify-content-center align-items-center px-3 py-1 text-center`}>
                        <div className='surtitle fw-semibold text-info'>{rounds[rounds.length - 1]}</div>
                        <div className='text-xxs fw-light text-opacity-75 text-muted'>March 16-20</div>
                    </li>
                    {rounds.slice(0, rounds.length - 1).reverse().map((round, i) => (
                        <li key={i} className={`nav-link border-radius-0 justify-content-center align-items-center px-3 py-1 text-center`}>
                            <div className='surtitle fw-semibold text-info'>{round}</div>
                            <div className='text-xxs fw-light text-opacity-75 text-muted'>March 16-20</div>
                        </li>
                    ))}
                </ul>
            </div>
            {refVisible ? (
                <Fragment>
                    <div className='d-flex'>
                        <Bracket
                            game={eastBracket}
                            numRounds={numRounds}
                            bracketDimensions={bracketDimensions}
                            roundSeparatorWidth={roundSeparatorWidth}
                            alignment={'left'}
                            onAdvanceTeam={(team, game) => handleAdvanceTeam(team, game, eastBracket, 'east')}
                        />
                        <Bracket
                            game={southBracket}
                            numRounds={numRounds}
                            bracketDimensions={bracketDimensions}
                            roundSeparatorWidth={roundSeparatorWidth}
                            alignment={'right'}
                            onAdvanceTeam={(team, game) => handleAdvanceTeam(team, game, southBracket, 'south')}
                        />
                    </div>
                    <div className='d-flex'>
                        <Bracket
                            game={westBracket}
                            numRounds={numRounds}
                            bracketDimensions={bracketDimensions}
                            roundSeparatorWidth={roundSeparatorWidth}
                            alignment={'left'}
                            onAdvanceTeam={(team, game) => handleAdvanceTeam(team, game, westBracket, 'west')}
                        />
                        <Bracket
                            game={midWestBracket}
                            numRounds={numRounds}
                            bracketDimensions={bracketDimensions}
                            roundSeparatorWidth={roundSeparatorWidth}
                            alignment={'right'}
                            onAdvanceTeam={(team, game) => handleAdvanceTeam(team, game, midWestBracket, 'midwest')}
                        />
                    </div>
                </Fragment>
            ) : (<span></span>)}
        </div>
    )
};

export default MarchMadness;
