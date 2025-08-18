// import node module libraries
import React, { Fragment, useEffect, useState } from "react";
import * as d3 from 'd3';

// import bootstrap icons
import { Col, Row } from 'react-bootstrap';
import { ArrowRepeat, CaretRight } from "react-bootstrap-icons";

import { RacingBarChart } from '@/widgets';
import useFPL from '@/hooks/useFPL';
import { useAppDispatch } from '@/store/hooks';
import {
    fetchLeagueData,
    fetchManagerData,
    fetchAllManagerHistories
} from '@/store/fplSlice';
import { reshapeFPLHistory } from '@/utils';

const DataVisualization = () => {
    const [data, setData] = useState<any[]>([]);
    const [tickDuration, setTickDuration] = useState<number>(1500);
    const [topN, setTopN] = useState<number>(10);
    const [isReady, setIsReady] = useState<boolean>(false);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    const dataSetTitle: string = 'Fantasy Premier League Standings';
    const leagueId: number = 392661;
    const managerId: number = 6888211;

    const dispatch = useAppDispatch();
    const {
        standings,
        allManagerHistories,
        loading
    } = useFPL();

    useEffect(() => {
        dispatch(fetchLeagueData(leagueId));
        dispatch(fetchManagerData(managerId));
    }, [dispatch, leagueId, managerId]);

    useEffect(() => {
        if (standings.length > 0) {
            dispatch(fetchAllManagerHistories(standings));
        }
    }, [dispatch, standings]);

    useEffect(() => {
        if (!loading && Array.isArray(allManagerHistories) && allManagerHistories.length > 0) {
            const reshaped = reshapeFPLHistory(allManagerHistories);
            if (Array.isArray(reshaped) && reshaped.length > 0) {
                setData(reshaped);
                setIsReady(true);
            }
        }
    }, [loading, allManagerHistories]);

    const dateFormat = '%Y'; // Or "%B %Y", or "GW%d" if using events

    if (!isReady) {
        return <p className="text-center mt-4">Loading chart data...</p>;
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <div className='hstack d-none justify-content-center align-items-center gap-2 mt-2 mb-4'>
                        <button disabled={true} className='btn btn-xs btn-neutral border-0'>
                            <CaretRight size={14} className='me-2' /> Start
                        </button>
                        <button disabled={true} className="btn btn-xs btn-neutral border-0">
                            <ArrowRepeat size={12} className='me-2' /> Replay
                        </button>
                    </div>
                    <div className='d-flex justify-content-center align-items-center mb-3'>
                        <div className='text-2xl text-muted opacity-50 fw-bolder ls-tight'>
                            {dataSetTitle}
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className='px-0 px-lg-4'>
                        <RacingBarChart
                            topN={topN}
                            data={data}
                            tickDuration={tickDuration}
                            colorScale={colorScale}
                            dateFormat={dateFormat}
                        />
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

export default DataVisualization;
