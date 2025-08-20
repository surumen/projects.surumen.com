// import node module libraries
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import useWindowSize from '@/hooks/useWindowSize';
import * as d3 from 'd3';
import useInterval from '@/hooks/useInterval';


const getRowData = (data: any[], columNames: any, rowIndex: number, topN: number): [any, any[]] => {

    const row = data[rowIndex];
    let newData = columNames.map((name) => {
        return {name: name, value: row[name]}
    });
    newData = newData.sort((a, b) => b.value - a.value).slice(0, topN);
    newData.forEach((d, i) => {
        d.rank = i;
        d.lastValue = (rowIndex > 0) ? data[rowIndex - 1][d.name] : d.value;
    });
    return [row[Object.keys(row)[0]], newData]
}

const getColors = (columnNames: string[], colorScale: any) => {
    const colors = {};
    columnNames.forEach((name: any, i: any) => {
        colors[name] = colorScale(i)
    });
    return colors;
}

const capitalize = (s: string): string => {
    const parts = s.split(' ').map(p => {
        return p.length > 2 ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p.toLowerCase();
    });

    return parts.join(' ');
}


const RacingBarChart = ({data, topN, tickDuration, colorScale, dateFormat}) => {
    const svgRef: MutableRefObject<any> = useRef();
    const wrapperRef: MutableRefObject<any> = useRef();
    const timelineRef: MutableRefObject<any> = useRef();
    const windowDimensions = useWindowSize();
    const [iteration, setIteration] = useState<number>(0);

    const dimensions = useMemo(() => ({
        height: windowDimensions.height,
        width: Math.abs(wrapperRef?.current?.offsetWidth),
        marginTop: 20,
        marginLeft: 52,
        marginRight: 80,
        marginBottom: 0,
        marginTimeAxis: 30,
        valueLabelAdjust: 20
    }), [windowDimensions.height]); // Removed the problematic dependency

    const columnNames = useMemo(() => Object.keys(data[0]).slice(1, ), [data]);
    const timeIndex = useMemo(() => Object.keys(data[0])[0], [data]);

    // Draw initial frame
    const [initialTime, initialRowData] = getRowData(data, columnNames, 0, topN);
    const [rowData, setRowData] = useState<any>(initialRowData);
    const [time, setTime] = useState<any>(initialTime);

    const startDate: any = d3.min(data, (d: any) => d[timeIndex]);
    const endDate: any = d3.max(data, (d: any) => d[timeIndex]);

    const barPadding = (dimensions.height - (dimensions.marginBottom + dimensions.marginTop)) / (10 * 5);

    // initialize color scheme set
    const colors = useMemo(() => getColors(columnNames, colorScale), [columnNames, colorScale]);

    const isTime = data[0][timeIndex] instanceof Date; // MODIFIED

    const t = isTime
        ? d3.scaleTime().domain([startDate, endDate])
        : d3.scaleLinear().domain([+startDate, +endDate]);

    t.range([dimensions.marginLeft + dimensions.marginTimeAxis, dimensions.width - dimensions.marginRight]);

    const timeAxis: any = isTime
        ? d3.axisBottom(t).ticks(5)
        : d3.axisBottom(t).tickFormat(d3.format('d')).ticks(data.length);

    const endValue: any = d3.max(rowData, (entry: any) => entry.value);
    const x = d3.scaleLinear()
        .domain([0, endValue])
        .range([dimensions.marginLeft + dimensions.marginTimeAxis, dimensions.width - (dimensions.marginRight * 2)]);

    const y = d3.scaleLinear()
        .domain([topN, 0])
        .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop]);

    const xAxis: any = d3.axisTop(x)
        .ticks(5)
        .tickSize(-(dimensions.height - dimensions.marginTop - dimensions.marginBottom))
        .tickSizeOuter(0)
        .tickFormat(d => d3.format(',.0f')(d));


    const svg = d3.select(svgRef.current)
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    svg.selectAll('rect.bar')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + dimensions.marginLeft)
        .attr('width', (entry: any) => Math.max(0, x(entry.value) - x(0) - dimensions.marginLeft + dimensions.valueLabelAdjust))
        .attr('y', (entry: any) => y(entry.rank) + barPadding / 2)
        .attr('height', y(1) - y(0) - barPadding)
        //.attr('transform', `translate(${dimensions.marginLeft}, 0)`)
        .style('fill', (entry: any) => colors[entry.name]);


    svg.selectAll('text.label')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('text')
        .attr('class', 'label text-sm')
        //.attr('x', (entry: any) => dimensions.marginLeft)
        .attr('x', x(0) + dimensions.marginLeft - 5)
        .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html((entry: any) => capitalize(entry.name));

    svg.selectAll('text.valueLabel')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel text-sm')
        .attr('x', (entry: any) => x(entry.value) + dimensions.marginLeft)
        .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1)
        .text((entry: any) => d3.format(',.0f')(entry.lastValue));


    const timelineSvg = d3.select(timelineRef.current)
        .attr('width', dimensions.width)
        .attr('height', 50);

    timelineSvg
        .select('rect')
        .attr('transform', `translate(${dimensions.marginLeft + dimensions.marginTimeAxis}, 0)`)
        .attr('height', 4)
        .attr('width', 0);

    timelineSvg
        .select('.tAxis')
        //.attr('transform', `translate(0, 20)`)
        .call(timeAxis);


    // will be called initially and on every data change
    useEffect(() => {
        // update xAxis with new domain
        const endValue: any = d3.max(rowData, (entry: any) => entry.value);
        x.domain([0, endValue]);

        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.marginTop})`)
            .call(xAxis);

        // update bars
        const bars = svg.selectAll('.bar').data(rowData, (entry: any) => entry.name);

        bars.enter().select('rect')
            .attr('class', 'bar')
            .attr('x', x(0) + 1)
            .attr('width', (entry: any) => Math.max(0, x(entry.value) - x(0) - dimensions.marginLeft + dimensions.valueLabelAdjust))
            //enter from out of screen
            .attr('y', d => y(topN + 1))
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', (entry: any) => colors[entry.name])
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', (entry: any) => y(entry.rank) + barPadding / 2);


        bars.transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', (entry: any) => Math.max(0, x(entry.value) - x(0) - dimensions.marginLeft + dimensions.valueLabelAdjust))
            .attr('y', (entry: any) => y(entry.rank) + barPadding / 2);

        bars.exit().remove();

        // update labels
        const labels = svg.selectAll('.label').data(rowData, (entry: any) => entry.name);

        labels.enter().select('text')
            .attr('class', 'label text-sm')
            //.attr('x', (entry: any) => ps)
            .attr('y', entry => y(topN + 1) + ((y(1) - y(0)) / 2))
            .style('text-anchor', 'end')
            .html((entry: any) => entry.name)
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1);

        labels.transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            //.attr('x', (entry: any) => x(entry.value) - 8)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1);

        labels.exit().remove();

        // update value labels

        const valueLabels = svg.selectAll('.valueLabel').data(rowData, (entry: any) => entry.name);

        valueLabels
            .enter()
            .select('text')
            .attr('class', 'valueLabel text-sm')
            .attr('x', (entry: any) => x(entry.value) + dimensions.marginLeft - dimensions.valueLabelAdjust)
            .attr('y', (entry: any) => y(topN + 1))
            .text((entry: any) => d3.format(',.0f')(entry.lastValue))
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', (entry: any) => x(entry.value) + dimensions.marginLeft - dimensions.valueLabelAdjust)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1)
            .text((entry: any) => d3.format(',.0f')(entry.lastValue))

        valueLabels.exit().remove();

        // update time label and progress bar
        timelineSvg.select('.progressBar')
            .attr('x', dimensions.marginLeft)
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', Math.max(0, t(time) - dimensions.marginTimeAxis - dimensions.marginLeft))
            //.attr('x', dimensions.marginLeft)

        timelineSvg
            .select('.tAxis')
            .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
            .call(timeAxis);

        svg.select('.timeText')
            .attr('x', dimensions.width - dimensions.marginRight)
            .attr('y', dimensions.height - dimensions.marginBottom - 40)
            .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
            .html(isTime ? d3.timeFormat(dateFormat)(time) : `GW${time}`) // MODIFIED
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear);

    }, [iteration, barPadding, colors, rowData, svg, t, tickDuration, time, topN, x, xAxis, y, dimensions, timelineSvg, timeAxis, dateFormat, isTime]);


    useInterval(() => {
        if (iteration < data.length - 1) {
            setIteration(iteration + 1);
            if (iteration == data.length) {
                setIteration(0);
            }
            const [time, nextRowData] = getRowData(data, columnNames, iteration, topN);
            setRowData(nextRowData.slice(0, topN));
            setTime(time);
        }
    }, iteration < data.length ? tickDuration : null);

    return (
        <div className='live-charts' ref={wrapperRef}>
            <svg ref={svgRef} className='text-muted-charts' fill='var(--x-body-color)'>
                <g className='axis xAxis text-muted-charts'></g>
                <text className='timeText display-5 font-display fw-bolder'></text>
            </svg>
            <svg ref={timelineRef} fill='var(--x-body-color)'>
                <rect className='progressBar'></rect>
                <g className='axis tAxis'></g>
            </svg>
        </div>
    )
};

export default RacingBarChart;
