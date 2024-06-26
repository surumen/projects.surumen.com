// import node module libraries
import React, { Fragment, useEffect, useState } from "react";
import { ParseResult } from 'papaparse';
import { usePapaParse } from 'react-papaparse';
import { RacingBarChart } from '@/widgets';
import { timeParse } from 'd3';
import * as d3 from 'd3';
import { groupDataByFirstColumn, reshapeData } from "@/helpers/reshapeData";

// import bootstrap icons
import { Col, Row } from 'react-bootstrap';
import { ArrowRepeat, CaretRight, Play, PlayCircle, PlayCircleFill } from "react-bootstrap-icons";


const FantasyPremierLeague = () => {

    const [data, setData] = useState<any[]>([]);
    const [tickDuration, setTickDuration] = useState<number>(500);
    const [isLoading, setLoading] = useState(true);
    const [topN, setTopN] = useState<number>(10);
    const { readRemoteFile } = usePapaParse();
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const stackOverflow: string = 'https://raw.githubusercontent.com/FabDevGit/barchartrace/master/datasets/stackoverflow.csv';
    const co2emissions: string = 'https://raw.githubusercontent.com/surumen/football-video-analysis/main/owid-co2-data.csv';

    const monthDayYear: string = '%B %d, %Y';
    const Year: string = '%Y';
    const monthYear: string = '%B, %Y';

    const dataUrl = co2emissions;
    const dateFormat = Year;

    const dataSetTitle: string = 'Global CO₂ Emissions'

    useEffect(() => {
        readRemoteFile(dataUrl, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<any>) => {
                results.data = reshapeData(results.data, 0, 1, 3)
                const columnNames = Object.keys(results.data[0]).slice(1, );
                const timeIndex = Object.keys(results.data[0])[0];
                results.data.forEach((d: any) => {
                    // first column : YYYY-MM-DD
                    const parseTime = timeParse(dateFormat);
                    d[timeIndex] = parseTime(d[timeIndex]);
                    // convert other columns to numbers
                    columnNames.forEach((k: any) => d[k] = Number(d[k]))
                });
                setData(results.data);
                setLoading(false);
            }
        });
    }, [dataUrl, dateFormat, readRemoteFile]);

    if (isLoading) return <p>Loading...</p>

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
    )
};

export default FantasyPremierLeague;
