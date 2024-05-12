// import node module libraries
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import useWindowSize from '@/hooks/useWindowSize';
import * as d3 from 'd3';
import useInterval from '@/hooks/useInterval';


const getRowData = (data: any[], columNames: any, rowIndex: number) => {
    const row = rowIndex < data.length - 1 ? data[rowIndex] : data[0];
    let newData = columNames.map((name) => {
        return {name: name, value: row[name]}
    });
    newData = newData.sort((a, b) => b.value - a.value);
    newData.forEach((d, i) => {
        d.rank = i;
        d.lastValue = (rowIndex > 0) ? data[rowIndex - 1][d.name] : d.value;
    });
    return [row[Object.keys(row)[0]], newData]
}

const getColors = (columnNames: string[]) => {
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    const colors = {};
    columnNames.forEach((name: any, i: any) => {
        colors[name] = colorScale(i)
    });
    return colors;
}


const RacingBarChart = ({data, topN, tickDuration}) => {
    const svgRef: MutableRefObject<any> = useRef();
    const wrapperRef: MutableRefObject<any> = useRef();
    const timelineRef: MutableRefObject<any> = useRef();
    const dimensions = useWindowSize();
    const [iteration, setIteration] = useState<number>(0);

    const [columnNames, setColumnNames] = useState<string[]>(Object.keys(data[0]).slice(1, ));
    const [timeIndex, setTimeIndex] = useState<string>(Object.keys(data[0])[0]);

    // Draw initial frame
    const [initialTime, initialRowData] = getRowData(data, columnNames, 0);
    const [rowData, setRowData] = useState<any>(initialRowData);
    const [time, setTime] = useState<any>(initialTime);

    const startDate: any = d3.min(data, (d: any) => d[timeIndex]);
    const endDate: any = d3.max(data, (d: any) => d[timeIndex]);

    const barPadding = (dimensions.height - (dimensions.marginBottom + dimensions.marginTop)) / (10 * 5);

    // initialize color scheme set
    const colors = useMemo(() => getColors(columnNames), [columnNames]);


    const t: any = d3.scaleTime()
        .domain([startDate, endDate])
        .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight]);

    const timeAxis: any = d3.axisBottom(t)
        .ticks(5)
        .scale(t);

    const endValue: any = d3.max(rowData, (entry: any) => entry.value);
    const x = d3.scaleLinear()
        .domain([0, endValue])
        .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight]);

    const y = d3.scaleLinear()
        .domain([topN, 0])
        .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop]);

    const xAxis: any = d3.axisTop(x)
        .scale(x)
        .ticks(5)
        .tickSize(-(dimensions.height - dimensions.marginTop - dimensions.marginBottom))
        .tickFormat(d => d3.format(',')(d));


    const svg = d3.select(svgRef.current)
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const timelineSvg = d3.select(timelineRef.current)
        .attr('width', dimensions.width)
        .attr('height', 50);

    svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${dimensions.marginTop})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d === 0);

    svg.selectAll('rect.bar')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', (entry: any) => x(entry.value) - x(0))
        .attr('y', (entry: any) => y(entry.rank) + barPadding / 2)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', (entry: any) => colors[entry.name]);


    svg.selectAll('text.label')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (entry: any) => x(entry.value) - 8)
        .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html((entry: any) => entry.name);

    svg.selectAll('text.valueLabel')
        .data(rowData, (entry: any) => entry.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', (entry: any) => x(entry.value) + 5)
        .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1)
        .text((entry: any) => d3.format(',.0f')(entry.lastValue));

    svg.selectAll('.tick').selectAll('line').remove();

    timelineSvg.append('g')
        .attr('class', 'axis tAxis')
        .attr('transform', `translate(0, 20)`)
        .call(timeAxis);

    timelineSvg.append('rect')
        .attr('class', 'progressBar')
        .attr('transform', `translate(${0}, 20)`)
        .attr('height', 2)
        .attr('width', 0);


    // will be called initially and on every data change
    useEffect(() => {
        // update xAxis with new domain
        const endValue: any = d3.max(rowData, (entry: any) => entry.value);
        x.domain([0, endValue]);
        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);
        svg.selectAll('.tick').selectAll('line').remove();

        // update bars
        const bars = svg.selectAll('.bar').data(rowData, (entry: any) => entry.name);

        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', x(0) + 1)
            .attr('width', (entry: any) => x(entry.value) - x(0))
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
            .attr('width', (entry: any) => x(entry.value) - x(0))
            .attr('y', (entry: any) => y(entry.rank) + barPadding / 2);

        bars.exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', (entry: any) => x(entry.value) - x(0))
            .attr('y', d => y(topN + 1) + barPadding / 2)
            .remove();

        // update labels
        const labels = svg.selectAll('.label').data(rowData, (entry: any) => entry.name);

        labels.enter().append('text')
            .attr('class', 'label')
            .attr('x', (entry: any) => x(entry.value) - 8)
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
            .attr('x', (entry: any) => x(entry.value) - 8)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1);

        labels.exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', (entry: any) => x(entry.value) - 8)
            .attr('y', (entry: any) => y(topN + 1)).remove();

        // update value labels

        const valueLabels = svg.selectAll('.valueLabel').data(rowData, (entry: any) => entry.name);

        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', (entry: any) => x(entry.value) + 5)
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
            .attr('x', (entry: any) => x(entry.value) + 5)
            .attr('y', (entry: any) => y(entry.rank) + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', (entry: any) => x(entry.value) + 5)
            .attr('y', (entry: any) => y(topN + 1)).remove();

        // update time label and progress bar
        d3.select('.progressBar')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', t(time));


        svg.selectAll('.timeText').remove();
        svg.append('text')
            .attr('class', 'timeText')
            .attr('x', dimensions.width - dimensions.marginRight)
            .attr('y', dimensions.height - dimensions.marginBottom - 5)
            .style('text-anchor', 'end')
            .html(d3.timeFormat('%B %d, %Y')(time))

    }, [iteration, barPadding, colors, rowData, svg, t, tickDuration, time, topN, x, xAxis, y, dimensions.width, dimensions.marginRight, dimensions.height, dimensions.marginBottom]);


    useInterval(() => {
        setIteration(iteration + 1);
        if (iteration == data.length) {
            setIteration(0);
        }
        const [time, nextRowData] = getRowData(data, columnNames, iteration);
        setRowData(nextRowData);
        setTime(time);
    }, tickDuration);

    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef}></svg>
            <svg ref={timelineRef}></svg>
        </div>
    )
};

export default RacingBarChart;
