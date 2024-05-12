// import node module libraries
import { useEffect, useState } from 'react';
import { ParseResult } from 'papaparse';
import { usePapaParse } from 'react-papaparse';
import { RacingBarChart } from '@/widgets';
import { timeParse } from "d3";


const FantasyPremierLeague = () => {

    const [data, setData] = useState<any>(null);
    const [tickDuration, setTickDuration] = useState<number>(500);
    const [isLoading, setLoading] = useState(true);
    const [topN, setTopN] = useState<number>(10);
    const { readRemoteFile } = usePapaParse();

    useEffect(() => {
        readRemoteFile('https://raw.githubusercontent.com/FabDevGit/barchartrace/master/datasets/stackoverflow.csv', {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<any>) => {
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
    });

    if (isLoading) return <p>Loading...</p>

    return (
        <div className='px-4'>
            <RacingBarChart topN={topN} data={data} tickDuration={tickDuration} />
        </div>
    )
};

export default FantasyPremierLeague;
