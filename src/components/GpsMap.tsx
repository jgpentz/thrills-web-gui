import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Box, Flex, Icon, Heading, Center, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { MdGpsFixed } from 'react-icons/md';

export default function GpsMap() {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    const defaultWidth = 300
    const defaultHeight = 300
    const titleMargin = 15 
    const width = useBreakpointValue(
        {base: '300px', sm: '400px', md: '500px', lg: '700px', xl: '1050px', '2xl': '1300px',},
        {ssr: false}
    )
    const height = useBreakpointValue(
        {base: '300px', sm: '400px', md: '500px', lg: '700px', xl: '700px', '2xl': '900px',},
        {ssr: false}
    )
    const titleHeight = useBreakpointValue({base: '30px',  xl: '50px'}, {ssr: false})

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
                    <Icon as={MdGpsFixed} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>GPS Map</Heading>
                </Center>
            </Flex>
            <div id='gpsGraph'>
                <GpsGraph 
                    width={width ? parseInt(width, 10) : defaultWidth} 
                    height={(height ? parseInt(height, 10) : defaultHeight) - ((titleHeight ? parseInt(titleHeight, 10) : 50) + (2 * titleMargin))}
                />
            </div>
        </Box>
    )
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
    fixed_x: number;
    fixed_y: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node | string | number; // Use your custom Node interface here
    target: Node | string | number; // Use your custom Node interface here
    data_rate: number;
    weight: number;
    weight_label_fwd: string;
    weight_label_rev: string;
    mcs: number;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface NodePosition {
    [nodeId: string]: [number, number];
}

interface DataRateStats {
    dataRateMbpsForward: number;
    capacityMbpsForward: number;
    dataRateMbpsReverse: number;
    capacityMbpsReverse: number;
}

export interface GpsMapData {
    node_pair_list: [string, string][];
    min_mcs_list: number[];
    min_mcs_list_averaged: number[];
    total_data_rate_stats: DataRateStats[];
    fixed_positions: NodePosition;
    mean_lat: number;
    mean_lon: number;
}

interface GpsGraphProps {
    width: number;
    height: number;
}
const GpsGraph = ({width, height}: GpsGraphProps) => {
    const text_color = useColorModeValue('black', 'dark_text')
    const ref = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

    // Converts the raw json data from the api into the shape that
    // the graph wants
    const ShapeData = (json_data: GpsMapData) => {
        setData(prevData => {
            const updatedData = { ...prevData };

            // Store all of the nodes
            for (let i = 0; i < json_data.node_pair_list.length; i++) {
                const source = json_data.node_pair_list[i][0];
                const target = json_data.node_pair_list[i][1];
                const data_rate = json_data.total_data_rate_stats[i].dataRateMbpsForward + json_data.total_data_rate_stats[i].dataRateMbpsReverse
                const weight = json_data.total_data_rate_stats[i].capacityMbpsForward + json_data.total_data_rate_stats[i].capacityMbpsReverse;
                const weight_label_fwd = `fwd: ${json_data.total_data_rate_stats[i].dataRateMbpsForward}/${json_data.total_data_rate_stats[i].capacityMbpsForward}`
                const weight_label_rev = `rev: ${json_data.total_data_rate_stats[i].dataRateMbpsReverse}/${json_data.total_data_rate_stats[i].capacityMbpsReverse}`
                const mcs = json_data.min_mcs_list_averaged[i]

                // Ensure that there exists a fixed position for both the source and the target before creating any data for this link
                if(source in json_data.fixed_positions && target in json_data.fixed_positions) {
                    // Check if source node already exists
                    let sourceNodeIndex = updatedData.nodes.findIndex(node => node.id === source);
                    if (sourceNodeIndex === -1) {
                        updatedData.nodes.push({ 
                            id: source,
                            fixed_x: json_data.fixed_positions[source][0],
                            fixed_y: json_data.fixed_positions[source][1],
                        });
                        sourceNodeIndex = updatedData.nodes.length - 1;
                    }
                    else {
                        updatedData.nodes[sourceNodeIndex].fixed_x = json_data.fixed_positions[source][0]
                        updatedData.nodes[sourceNodeIndex].fixed_y = json_data.fixed_positions[source][1]
                    }

                    // Check if target node already exists
                    let targetNodeIndex = updatedData.nodes.findIndex(node => node.id === target);
                    if (targetNodeIndex === -1) {
                        updatedData.nodes.push({ 
                            id: target,
                            fixed_x: json_data.fixed_positions[source][0],
                            fixed_y: json_data.fixed_positions[source][1],
                        });
                        targetNodeIndex = updatedData.nodes.length - 1;
                    }
                    else {
                        updatedData.nodes[targetNodeIndex].fixed_x = json_data.fixed_positions[target][0]
                        updatedData.nodes[targetNodeIndex].fixed_y = json_data.fixed_positions[target][1]
                    }

                    let linkIndex = -1
                    for (let i = 0; i < updatedData.links.length; i++) {
                        if ((updatedData.links[i].source as any).id === source && (updatedData.links[i].target as any).id === target) {
                            linkIndex = i
                            break
                        }
                    }

                    if (linkIndex !== -1) {
                        // If the link already exists, update its weight
                        updatedData.links[linkIndex].data_rate = data_rate;
                        updatedData.links[linkIndex].weight = weight;
                        updatedData.links[linkIndex].weight_label_fwd = weight_label_fwd;
                        updatedData.links[linkIndex].weight_label_rev = weight_label_rev;
                        updatedData.links[linkIndex].mcs = mcs;
                    } else {
                        // If the link doesn't exist, add it to the links array
                        updatedData.links.push({
                            source: {id: updatedData.nodes[sourceNodeIndex].id} as Node,
                            target: {id: updatedData.nodes[targetNodeIndex].id} as Node,
                            data_rate: data_rate,
                            weight: weight,
                            weight_label_fwd: weight_label_fwd, 
                            weight_label_rev: weight_label_rev,
                            mcs: mcs,
                        });
                    }
                }
            }

            return updatedData;
        });
    };

    // Fetch the radio list from the backend at a 1 Hz interval
    useEffect(() => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/link_map`;

        const fetchData = async () => {
            fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                ShapeData(json);
            })
            .catch(error => {
                console.error(error);
            });
        }

        // Fetch data initially when the component mounts
        fetchData()

        // Set up interval to fetch data every second
        const intervalId = setInterval(fetchData, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty array ensures this only runs on mount

    useEffect(() => {
        if (!data) return

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)

        // Clear existing content
        svg.selectAll('*').remove();

        // Set up dimensions for SVG container
        const margin = { top: 20, right: 70, bottom: 70, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Color scale for lines
        const colorScale = ['#f71a1a', '#f55221', '#f87e1a', '#faa912', '#fdd40b', '#feea07', '#ffff03', '#e6fa15', '#cdf427', '#c2f233', '#99e636', '#6fd938', '#6fd938']

        // Create scale for x-axis, finding the min/max values in the dataset,
        // then add some space on both ends
        const minX = d3.min(data.nodes, (node: Node) => node.fixed_x) || (-1 * 500);
        const maxX = d3.max(data.nodes, (node: Node) => node.fixed_x) || 500;
        const xScale = d3.scaleLinear<number>()
            .domain([minX - 10, maxX + 10])
            .range([0, innerWidth])

        // Create scale for y-axis, finding the min/max values in the dataset,
        // then add some space on both ends
        const minY = d3.min(data.nodes, (node: Node) => node.fixed_y) || (-1 * 500);
        const maxY = d3.max(data.nodes, (node: Node) => node.fixed_y) || 500;
        const yScale = d3.scaleLinear<number>()
            .domain([minY - 10 , maxY + 10])
            .range([innerHeight, 0])

        // Add x-axis grid
        const xAxisGrid = d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => '').ticks(10)
        svg.append('g')
            .attr('class', 'axis-grid')
            .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
            .attr('color', '#EDF2F7')
            .call(xAxisGrid)

        // Add y-axis grid
        const yAxisGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '').ticks(10)
        svg.append('g')
            .attr('class', 'axis-grid')
            .attr('color', '#EDF2F7')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(yAxisGrid)

        // Create x-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
            .style('font-size', '12px')
            .call(d3.axisBottom(xScale))
        
        // Add x-axis title
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', (innerWidth + margin.left + margin.right) / 2)
            .attr('y', innerHeight + margin.top + 40)
            .text('E/W (m)')

        // Create y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .style('font-size', '12px')
            .call(d3.axisLeft(yScale))

        // Add y-axis title
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -1 * ((innerHeight + margin.top) / 2))
            .attr('y', margin.left - 45)
            .text('N/S (m)')

        // Add lines for data rate
        svg.append('g')
            .selectAll(".blue-link")
            .data(data.links)
            .enter()
            .append("line")
                .attr('class', 'blue-link')
                .attr('x1', (link) => margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_x))
                .attr('y1', (link) => margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_y))
                .attr('x2', (link) => margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_x))
                .attr('y2', (link) => margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_y))
                .attr('stroke', (d) => d.data_rate > 0 ? '#3a86ff' : 'transparent')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-linecap', 'round') // Make the strokes rounded
                .attr('stroke-width', (d) => {
                    // Set the maximum stroke width for blue lines
                    const maxWidth = 23; // Adjust this value as needed
                    return d.data_rate > 0 ? Math.min(d.data_rate / 15, maxWidth) + 'px' : '0px';
                })

        // Add lines between the dots
        svg.append('g')
            .selectAll(".original-link")
            .data(data.links)
            .enter()
            .append("line")
                .attr('class', 'original-link')
                .attr('x1', (link) => margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_x))
                .attr('y1', (link) => margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_y))
                .attr('x2', (link) => margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_x))
                .attr('y2', (link) => margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_y))
                .attr('stroke', (_, i) => colorScale[data.links[i].mcs])
                .attr('stroke-width', (d) => d.weight / 200)

        // Add data dots with labels
        svg.append('g')
            .selectAll("dot")
            .data(data.nodes)
            .enter()
            .append("g")
                .attr("class", "node")
                .attr('transform', (d) => `translate(${margin.left + xScale(d.fixed_x)}, ${margin.top + yScale(d.fixed_y)})`)
            .append("circle")
                .attr('r', 5)
                .attr('fill', '#cbd5e0')
                .attr('stroke', '#000000')
                .attr('stroke-width', '2px');

        // Add labels to dots
        svg.selectAll(".node")
            .append("text")
                .attr("y", -10) // Adjust label position as needed
                .attr('text-anchor', 'middle') // Center the text horizontally
                .text((d: any) => d.id)
                .style("font-size", "14px") // Adjust font size as needed
                .style("fill", text_color === 'black' ? 'black' : '#cdd6f4'); // Adjust text color as needed

        // Add fwd link labels in the middle of the lines
        svg.append('g')
            .selectAll(".label_middle")
            .data(data.links)
            .enter()
            .append("text")
                .attr('class', 'label_middle')
                .attr('x', link => {
                    const sourceX = margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_x);
                    const targetX = margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_x);
                    return (sourceX + targetX) / 2;
                })
                .attr('y', link => {
                    const sourceY = margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_y);
                    const targetY = margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_y);
                    return (sourceY + targetY) / 2 - 5;
                })
                .text(d => d.weight_label_fwd) // Display weight with 2 decimal places
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle') // Center the text horizontally
                .attr('alignment-baseline', 'middle') // Center the text vertically
                .attr('fill', '#333'); // Set text color

        // Add rev link labels in the middle of the lines
        svg.append('g')
            .selectAll(".label_middle")
            .data(data.links)
            .enter()
            .append("text")
                .attr('class', 'label_middle')
                .attr('x', link => {
                    const sourceX = margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_x);
                    const targetX = margin.left + xScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_x);
                    return (sourceX + targetX) / 2;
                })
                .attr('y', link => {
                    const sourceY = margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.source as any).id)].fixed_y);
                    const targetY = margin.top + yScale(data.nodes[data.nodes.findIndex(node => node.id === (link.target as any).id)].fixed_y);
                    return (sourceY + targetY) / 2 + 10;
                })
                .text(d => d.weight_label_rev) // Display weight with 2 decimal places
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle') // Center the text horizontally
                .attr('alignment-baseline', 'middle') // Center the text vertically
                .attr('fill', '#333'); // Set text color
    }, [width, height, data, text_color]);

    return (
        <svg ref={ref}> {/* Adjusted height */}
        {/* You can add axes, labels, or other elements here if needed */}
        </svg>
    );
}