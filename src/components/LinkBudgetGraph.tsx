import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Box, Flex, Icon, Heading, Center, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { MdAutoGraph } from 'react-icons/md';
import { useLinkBudgetData } from './LinkBudgetDataProvider'

import { LinkBudgetSelections } from './LinkBudget'

interface LinkBudgetGraphProps {
    linkBudgetSelections: LinkBudgetSelections;
}

interface XYPoint {
    x: number
    y: number
}

interface XYLine {
    title: string;
    color: string;
    XYPoints: XYPoint[]
}

interface PowerData {
    [key: string]: XYPoint[];
    auto0: XYPoint[];
    auto1: XYPoint[];
    auto2: XYPoint[];
    auto3: XYPoint[];
}

interface BandwidthData {
    [key: string]: PowerData;
    full: PowerData;
    half: PowerData;
    quarter: PowerData;
    eighth: PowerData;
    sixteenth: PowerData;
}

export interface LinkBudgetData {
    [key: string]: BandwidthData;
    ch1: BandwidthData;
    ch2: BandwidthData;
    ch3: BandwidthData;
    ch4: BandwidthData;
    ch5: BandwidthData;
    ch6: BandwidthData;
}

interface ColorMap {
  [key: string]: string;
}

export default function LinkBudgetGraph({linkBudgetSelections}: LinkBudgetGraphProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    const linkBudgetData: LinkBudgetData | null = useLinkBudgetData() || null;
    const [xyLines, setxyLines] = useState<XYLine[]>([])
    const defaultWidth = 300
    const defaultHeight = 300
    const titleMargin = 15 
    const width = useBreakpointValue(
        {base: '300px', sm: '400px', md: '500px', lg: '700px', xl: '1050px', '2xl': '1300px',},
        {ssr: false}
    )
    const height = useBreakpointValue(
        {base: '300px', sm: '400px', md: '500px', lg: '700px', xl: '700px', '2xl': '800px',},
        {ssr: false}
    )
    const titleHeight = useBreakpointValue({base: '30px',  xl: '50px'}, {ssr: false})

    const colorScale = d3.scaleOrdinal<string>(d3.schemeSet1);

    // Generate the color map once the backend data is fetched
    const colorMap = useMemo(() => {
        if (linkBudgetData) {
            const map: ColorMap = {};

            for (const ch of Object.keys(linkBudgetData)) {
                for (const bw of Object.keys(linkBudgetData[ch])) {
                    for (const p of Object.keys(linkBudgetData[ch][bw])) {
                        const key = `${ch}_${bw}_${p}`;
                        map[key] = colorScale(key)
                    }
                }
            }

            return map;
        }

        return {};
    }, [colorScale, linkBudgetData]);

    useEffect (() => {
        if (linkBudgetData) {
            const newXYLines: XYLine[] = []

            // Create an array that contains all the currently selected settings
            linkBudgetSelections.channelSelections.forEach((ch, chIndex, x) => {
                linkBudgetSelections.bandwidthSelections.forEach((bw, bwIndex) => {
                    linkBudgetSelections.powerSelections.forEach((p, pIndex) => {
                        const line: XYLine = {
                            title: `${ch}_${bw}_${p}`,
                            color: colorMap[`${ch}_${bw}_${p}`],
                            XYPoints: linkBudgetData[ch][bw][p]
                        };
                        newXYLines.push(line);
                    });
                });
            });

            // Store the new lines
            setxyLines(newXYLines)
        }
    }, [linkBudgetSelections, linkBudgetData, colorMap])

    return(
         <Box 
            mt='7'
            ml='7'
            w={width}
            h={height}
            boxShadow='base'
            borderWidth='1px' 
            borderRadius='xl'
            bg={bg_color}
        > 
            <Flex m="3" h={titleHeight} mt={`${titleMargin}px`} mb={`${titleMargin}px`}>
                <Center>
                    <Icon as={MdAutoGraph} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Link Budget</Heading>
                </Center>
            </Flex>
            <LineChart 
                xyLines={xyLines} 
                width={width ? parseInt(width, 10) : defaultWidth} 
                height={(height ? parseInt(height, 10) : defaultHeight) - ((titleHeight ? parseInt(titleHeight, 10) : 50) + (2 * titleMargin))}
            />
        </Box>
    )
}


interface LineChartProps {
    xyLines: XYLine[];
    width: number;
    height: number;
}

const LineChart = ({xyLines, width, height}: LineChartProps) => {
    const ref = useRef<SVGSVGElement>(null)

    useEffect(() => {
        const svgElement = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)

        // Clear existing content
        svgElement.selectAll('*').remove();

        // Set up dimensions for SVG container
        const margin = { top: 10, right: 70, bottom: 70, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create scale for x-axis
        const xScale = d3.scaleLinear<number>()
            .domain([0, d3.max(xyLines, line => Number(d3.max(line.XYPoints, d => d.x))) ?? 0])
            .range([0, innerWidth])

        // Create scale for y-axis
        const yScale = d3.scaleLinear<number>()
            .domain([0, d3.max(xyLines, line => Number(d3.max(line.XYPoints, d => d.y))) ?? 0])
            .range([innerHeight, 0])

        // Add x-axis grid
        const xAxisGrid = d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => '').ticks(10)
        svgElement.append('g')
            .attr('class', 'axis-grid')
            .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
            .attr('color', '#EDF2F7')
            .call(xAxisGrid)

        // Add y-axis grid
        const yAxisGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '').ticks(10)
        svgElement.append('g')
            .attr('class', 'axis-grid')
            .attr('color', '#EDF2F7')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(yAxisGrid)

        // Create x-axis
        svgElement.append('g')
            .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
            .style('font-size', '12px')
            .call(d3.axisBottom(xScale))
        
        // Add x-axis title
        svgElement.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', (innerWidth + margin.left + margin.right) / 2)
            .attr('y', innerHeight + margin.top + 40)
            .text('Range (m)')

        // Create y-axis
        svgElement.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .style('font-size', '12px')
            .call(d3.axisLeft(yScale))

        // Add y-axis title
        svgElement.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -1 * ((innerHeight + margin.top) / 2))
            .attr('y', margin.left - 45)
            .text('Datarate (Gbps)')
    
        // Create a line function
        const line = d3.line<XYPoint>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        // Draw each line stored in xyLines
        const lines = svgElement.selectAll<SVGPathElement, XYLine>('.line')
            .data(xyLines, (d: XYLine) => d.title);

        lines.enter()
            .append('path')
            .attr('class', 'line')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .attr('d', d => line(d.XYPoints) || '')
            .style('fill', 'none')
            .style('stroke', d => d.color)
            .style('stroke-width', 3)
            .merge(lines) // Merge enter and update selections
            .transition()
            .duration(500)
            .attr('d', d => line(d.XYPoints) || '');

        lines.exit()
            .transition()
            .duration(500)
            .attr('d', d => line([])) // Set 'd' attribute to an empty path during exit
            .remove();

        // Add legend
        const legend = svgElement.append('g')
            .attr('transform', `translate(${innerWidth + margin.left - 10}, ${margin.top + 10})`)
            .attr('text-anchor', 'end')
            .selectAll('.legend')
            .data(xyLines)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend.append('rect')
            .attr('x', 0)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', d => d.color);

        legend.append('text')
            .attr('x', -5)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text(d => d.title);
    }, [width, height, xyLines])

    return (
        <svg ref={ref} />
    )
}

