import { Box, Flex, Center, Icon, Heading, useColorModeValue, useBreakpointValue} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MdCellTower } from "react-icons/md";
import * as d3 from 'd3'

export default function NetworkMap() {
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
                    <Icon as={MdCellTower} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Network Map</Heading>
                </Center>
            </Flex>
            <NetworkGraph 
                width={width ? parseInt(width, 10) : defaultWidth} 
                height={(height ? parseInt(height, 10) : defaultHeight) - ((titleHeight ? parseInt(titleHeight, 10) : 50) + (2 * titleMargin))}
            />
        </Box>
    )
}

interface NetworkGraphProps {
    width: number;
    height: number;
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: Node | string | number; // Use your custom Node interface here
    target: Node | string | number; // Use your custom Node interface here
    data_rate: number,
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

interface LinkMapData {
    node_pair_list: [string, string][];
    min_mcs_list: number[];
    min_mcs_list_averaged: number[];
    total_data_rate_stats: DataRateStats[];
    fixed_positions: NodePosition;
    mean_lat: number;
    mean_lon: number;
}

const NetworkGraph = ({width, height}: NetworkGraphProps) => {
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
    const ref = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState(false); // State to track dragging

    // Converts the raw json data from the api into the shape that
    // the graph wants
    const ShapeData = (json_data: LinkMapData) => {
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

                // Check if source node already exists
                let sourceNodeIndex = updatedData.nodes.findIndex(node => node.id === source);
                if (sourceNodeIndex === -1) {
                    updatedData.nodes.push({ id: source });
                    sourceNodeIndex = updatedData.nodes.length - 1;
                }

                // Check if target node already exists
                let targetNodeIndex = updatedData.nodes.findIndex(node => node.id === target);
                if (targetNodeIndex === -1) {
                    updatedData.nodes.push({ id: target });
                    targetNodeIndex = updatedData.nodes.length - 1;
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
                        source: updatedData.nodes[sourceNodeIndex].id,
                        target: updatedData.nodes[targetNodeIndex].id,
                        data_rate: data_rate,
                        weight: weight,
                        weight_label_fwd: weight_label_fwd, 
                        weight_label_rev: weight_label_rev,
                        mcs: mcs,
                    });
                }
            }

            return updatedData;
        });
    };


    // Fetch data function
    const hostname = window.location.hostname;
    const apiUrl = `http://${hostname}:3001/link_map`;
    console.log("HELLO")
    console.log(apiUrl)

    const fetchData = async () => {
        fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
            ShapeData(json);
        })
        .catch(error => {
            console.error(error);
        });
    };

    // Fetch data at an interval
    useEffect(() => {
        // Fetch data initially when the component mounts
        fetchData();

        // Set up interval to fetch data every second
        const intervalId = setInterval(() => {
            // Only fetch data if not dragging
            if (!dragging) {
                fetchData();
            }
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [dragging]); // Fetch data when dragging state changes

    // Functions for dragging nodes around the graph
    const drag = (simulation: any) => {
        let offsetX: number | undefined;
        let offsetY: number | undefined;

        function dragstarted(event: any, d: Node) {
            setDragging(true); // Set dragging state to true
            if (!event.active) simulation.alphaTarget(0.3).restart();
            // Get the position of the SVG container relative to the document
            const container = ref.current;
            if (!container) return; // Exit early if ref.current is null
            const containerRect = container.getBoundingClientRect();
            // Calculate the offsets to adjust for the container's position
            offsetX = containerRect.left;
            offsetY = containerRect.top;
            // Set the initial position of the node being dragged
            d.fx = null;
            d.fy = null;
        }

        function dragged(event: any, d: Node) {
            if (offsetX === undefined || offsetY === undefined) {
            return; // Exit early if offsets are not yet calculated
        }
            // Update the node's fixed position with the adjustments
            d.fx = event.x - offsetX;
            d.fy = event.y - offsetY;
        }

        function dragended(event: any, d: Node) {
            setDragging(false); // Set dragging state to false
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag<SVGCircleElement, Node, any>()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    };


    useEffect(() => {
        if (!data) return // Exit early if data is undefined

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height);

        // Clear existing content for window resizing
        svg.selectAll('*').remove();

        // Shared radius for node size
        const node_radius = 10

        // Color scale for lines
        const colorScale = ['#f71a1a', '#f55221', '#f87e1a', '#faa912', '#fdd40b', '#feea07', '#ffff03', '#e6fa15', '#cdf427', '#c2f233', '#99e636', '#6fd938', '#6fd938']

        const simulation = d3.forceSimulation<Node, Link>(data.nodes)
            .force('link', d3.forceLink<Node, Link>(data.links).id((d) => d.id).strength((d) => 1 / d.weight))
            .force('charge', d3.forceManyBody().strength(-2500)) // Increase charge strength significantly
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Set initial positions of nodes to be more spread out
        simulation.force('x', d3.forceX(width / 2).strength(0.2));
        simulation.force('y', d3.forceY(height / 2).strength(0.2));

        // Add blue outline for data rates
        const blueLines = svg.selectAll('.blue-line')
            .data(data.links)
            .enter()
            .append('line')
            .attr('class', 'blue-line')
            .attr('stroke', (d) => d.data_rate > 0 ? '#3a86ff' : 'transparent')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-linecap', 'round') // Make the strokes rounded
            .attr('stroke-width', (d) => {
                // Set the maximum stroke width for blue lines
                const maxWidth = 25; // Adjust this value as needed
                return d.data_rate > 0 ? Math.min(d.data_rate / 15, maxWidth) + 'px' : '0px';
            });

        // Select all lines representing links and join with data
        const link = svg.selectAll('.original-link')
            .data(data.links)
            .enter()
            .append('line')
            .attr('class', 'original-link') // Assign a class to the original links
            .attr('stroke', (_, i) => colorScale[data.links[i].mcs])
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', (d) => d.weight / 100); // Adjust stroke width based on weight

        // Select all circles representing nodes and join with data
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(data.nodes)
            .enter()
            .append('circle')
            .attr('r', node_radius)
            .attr('fill', '#cbd5e0')
            .attr('stroke', '#000000')
            .attr('stroke-width', '2px')
            // Currently disable the dragging: when you are dragging, at the 1 second
            // update tick it messes up the mouse
            .call(drag(simulation))

        // Select all text labels and join with data
        const labels = svg.selectAll('text')
            .data(data.nodes)
            .enter()
            .append('text')
            .text((d) => d.id)
            .attr('x', (d) => (d.x || 0) + 10) // Provide a fallback value if d.x is undefined
            .attr('y', (d) => (d.y || 0) + 5) // Provide a fallback value if d.y is undefined
            .style('user-select', 'none'); // Prevent text selection

        // Select all text labels for link weights and join with data
        const weightLabels = svg.selectAll('.label_weight_fwd')
            .data(data.links)
            .enter()
            .append('text')
            .attr('class', 'label_weight_fwd')
            .text(d => d.weight_label_fwd) // Display weight with 2 decimal places
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle') // Center the text horizontally
            .attr('alignment-baseline', 'middle') // Center the text vertically
            .attr('fill', '#333') // Set text color
            .style('user-select', 'none'); // Prevent text selection

        // Select all text labels for link weights and join with data
        const secondWeightLabels = svg.selectAll('.label_weight_rev')
            .data(data.links)
            .enter()
            .append('text')
            .attr('class', 'label_weight_rev')
            .text(d => d.weight_label_rev) // Display weight with 2 decimal places
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle') // Center the text horizontally
            .attr('alignment-baseline', 'middle') // Center the text vertically
            .attr('fill', '#333') // Set text color
            .style('user-select', 'none'); // Prevent text selection

        simulation.nodes(data.nodes).on('tick', () => {
            link.attr('x1', (d: any) => (d.source as any).x)
                .attr('y1', (d: any) => (d.source as any).y)
                .attr('x2', (d: any) => (d.target as any).x)
                .attr('y2', (d: any) => (d.target as any).y);

            blueLines
                .attr('x1', (d: any) => (d.source as any).x)
                .attr('y1', (d: any) => (d.source as any).y)
                .attr('x2', (d: any) => (d.target as any).x)
                .attr('y2', (d: any) => (d.target as any).y);

            node.attr('cx', (d: any) => Math.max(node_radius, Math.min(width - node_radius, d.x)))
                .attr('cy', (d: any) => Math.max(node_radius, Math.min(height - node_radius, d.y)))

            labels.attr('x', (d: any) => d.x + 15)
                .attr('y', (d: any) => d.y + 10);

            weightLabels.attr('x', (d: any) => ((d.source as any).x + (d.target as any).x) / 2)
                .attr('y', (d: any) => ((d.source as any).y + (d.target as any).y) / 2);

            secondWeightLabels.attr('x', (d: any) => ((d.source as any).x + (d.target as any).x) / 2)
                .attr('y', (d: any) => (((d.source as any).y + (d.target as any).y) / 2) + 15);
        });

        return () => {
            simulation.stop();
        };
    }, [data, width, height]);

     
    return (
        <svg ref={ref} />
    )
}

