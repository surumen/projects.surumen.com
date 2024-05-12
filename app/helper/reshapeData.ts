import * as _ from 'lodash';
import { timeParse } from "d3";



/**
Reshapes the data by the first column (from csv):
(one row per contender and per date) => (one row per date (ordered) and one column per contender.)
*/
export const groupDataByFirstColumn = (data: any[]) => {
    const column_names = new Set(data.map(x => x[Object.keys(x)[1]]));
    const grouped_by_date = _.groupBy(data, (e) => e[Object.keys(e)[0]]);
    return Object.keys(grouped_by_date).sort().map((k) => {
        const item = {'date': k};
        column_names.forEach((n) => item[n] = 0);
        grouped_by_date[k].forEach((e) => item[e[Object.keys(e)[1]]] = e[Object.keys(e)[2]]);
        return item;
    });
}

export const reshapeData = (data: any[], groupByIndex: number, nameIndex: number, valueIndex: number) => {
    const columnNames = new Set(data.map(x => x[Object.keys(x)[nameIndex]]));
    const parseTime = timeParse('%Y-%m-%d');
    const groupedByColumn = _.groupBy(data, (e) => parseTime(e[Object.keys(e)[groupByIndex]]));
    return Object.keys(groupedByColumn).sort().map((k) => {
        const item = {'date': k};
        columnNames.forEach((n) => item[n] = 0);

        groupedByColumn[k].forEach((e) => item[e[Object.keys(e)[1]]] = e[Object.keys(e)[valueIndex]]);
        return item;
    });
}