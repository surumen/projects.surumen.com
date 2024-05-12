// import node module libraries
import { useEffect, useState } from 'react';
import { ParseResult } from 'papaparse';
import { usePapaParse } from 'react-papaparse';
import { RacingBarChart } from '@/widgets';
import { timeParse } from 'd3';
import * as d3 from 'd3';
import { groupDataByFirstColumn, reshapeData } from "@/helper/reshapeData";


const FantasyPremierLeague = () => {

    const [data, setData] = useState<any[]>([]);
    const [tickDuration, setTickDuration] = useState<number>(500);
    const [isLoading, setLoading] = useState(true);
    const [topN, setTopN] = useState<number>(10);
    const { readRemoteFile } = usePapaParse();
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const stackOverflow: string = 'https://raw.githubusercontent.com/FabDevGit/barchartrace/master/datasets/stackoverflow.csv';
    const co2emissions: string = 'https://raw.githubusercontent.com/FabDevGit/barchartrace/master/datasets/co2.csv';
    const co2emissionsTotal: string = 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv';

    const monthDayYear: string = '%B %d, %Y';
    const Year: string = '%Y';
    const monthYear: string = '%B, %Y';

    const dataUrl = stackOverflow;

    useEffect(() => {
        readRemoteFile(dataUrl, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<any>) => {
                if (Object.keys(results.data[0]).length === 3) {
                    results.data = groupDataByFirstColumn(results.data)
                }
                const columnNames = Object.keys(results.data[0]).slice(1, );
                const timeIndex = Object.keys(results.data[0])[0];
                results.data.forEach((d: any) => {
                    // first column : YYYY-MM-DD
                    const parseTime = timeParse('%Y-%m-%d');
                    d[timeIndex] = parseTime(d[timeIndex]);
                    // convert other columns to numbers
                    columnNames.forEach((k: any) => d[k] = Number(d[k]))

                });
                setData(results.data);
                setLoading(false);
            }
        });
    }, [dataUrl, readRemoteFile]);

    if (isLoading) return <p>Loading...</p>

    return (
        <div className='px-4'>
            <RacingBarChart
                topN={topN}
                data={data}
                tickDuration={tickDuration}
                colorScale={colorScale}
                dateFormat={monthYear}
            />
        </div>
    )
};

export default FantasyPremierLeague;
