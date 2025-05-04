// import node module libraries
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { ParseResult } from "papaparse";
import { timeParse } from "d3";
import { readRemoteFile } from "react-papaparse";

const useMarchMadness = () => {
    const regions = useSelector((state: any) => state.marchMadness.regions);
    const rounds = useSelector((state: any) => state.marchMadness.rounds);
    const [predictions, setPredictions] = useState<any[]>([]);

    const eastBracket = useSelector((state: any) => state.marchMadness.regions.east);
    const westBracket = useSelector((state: any) => state.marchMadness.regions.west);
    const midWestBracket = useSelector((state: any) => state.marchMadness.regions.midWest);
    const southBracket = useSelector((state: any) => state.marchMadness.regions.south);
    const finalFour = useSelector((state: any) => state.marchMadness.finalFour);

    const numRounds = useSelector((state: any) => state.marchMadness.rounds.numRounds);
    const roundLabels = useSelector((state: any) => state.marchMadness.rounds.labels);

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
        predictions,
        eastBracket,
        westBracket,
        midWestBracket,
        southBracket,
        finalFour,
        numRounds,
        roundLabels
    };
};

export default useMarchMadness;
