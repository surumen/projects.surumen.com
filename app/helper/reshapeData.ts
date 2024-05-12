import * as _ from 'lodash';



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