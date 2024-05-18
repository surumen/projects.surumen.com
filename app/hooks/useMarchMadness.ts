// import node module libraries
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { ParseResult } from "papaparse";
import { timeParse } from "d3";
import { readRemoteFile } from "react-papaparse";

const useMarchMadness = () => {
    const regions = useSelector((state: any) => state.matchMadness.regions);
    const rounds = useSelector((state: any) => state.matchMadness.rounds);
    const [predictions, setPredictions] = useState<any[]>([]);

    const predictionsUrl: string = 'https://raw.githubusercontent.com/surumen/college-basketball/main/Data/predictions/predictions_2024.csv';

    useEffect(() => {
        readRemoteFile(predictionsUrl, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<any>) => {
                setPredictions(results.data);
            }
        });
    }, [predictionsUrl]);

    return {
        regions,
        rounds,
        predictions
    };
};

export default useMarchMadness;
