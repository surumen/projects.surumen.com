// import node module libraries
import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as JSOG from 'jsog';
import * as _ from 'underscore';

import useWindowSize from '@/hooks/useWindowSize';
import Bracket from '@/widgets/brackets/Bracket';

import { WorldCup2018, SemiFinal1, SemiFinal2 } from './worldCup';
import useMounted from "@/hooks/useMounted";
import { useMediaQuery } from "react-responsive";


const tournament = JSOG.decode(WorldCup2018);

const MarchMadness = () => {

    const { width, height } = useWindowSize();
    const wrapperRef: MutableRefObject<any> = useRef();
    const hasMounted = useMounted();
    const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

    const bracketDimensions: any = {
        width: isMobile ? Math.abs(wrapperRef?.current?.offsetWidth) : Math.abs(wrapperRef?.current?.offsetWidth) / 2,
        height: height
    }

    return (
        <div className='svg-wrapper' ref={wrapperRef}>
            <div className='d-flex'>
                <Bracket game={tournament} bracketDimensions={bracketDimensions} alignment={'left'} homeOnTop={true}/>
                <Bracket game={tournament} bracketDimensions={bracketDimensions} alignment={'right'} homeOnTop={true}/>
            </div>
            <div className='d-flex'>
                <Bracket game={tournament} bracketDimensions={bracketDimensions} alignment={'left'} homeOnTop={true}/>
                <Bracket game={tournament} bracketDimensions={bracketDimensions} alignment={'right'} homeOnTop={true}/>
            </div>
        </div>
    )
};

export default MarchMadness;
