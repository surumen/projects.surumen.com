import * as d3 from "d3";
import Papa, { ParseResult } from 'papaparse';


export const fetchDataD3 = async(dataUrl: string, mask: any) => {
    const fullData = await d3.csv(dataUrl, mask);
    return fullData.slice(0, 10);
};


export const fetchCsvData = (fileUrl: string): any[] => {
    let data;
    Papa.parse(fileUrl, {
        header: true,
        download: true,
        skipEmptyLines: true,
        delimiter: ',',
        complete: (results: ParseResult<any>) => {
            data = results.data;
        },
    });
    return data;
}

