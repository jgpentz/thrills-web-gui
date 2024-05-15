import { Box, Center, Flex, Icon, Heading, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import * as d3 from 'd3'
import { useEffect, useRef } from "react";
import { MdLeakAdd } from "react-icons/md";
import { MultipathData } from './Multipath';

interface MultipathGraphProps {
    data: MultipathData;
}

export default function MultipathGraph({data}: MultipathGraphProps) {
    const ref = useRef(null)
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
        {base: '300px', sm: '400px', md: '500px', lg: '500px', xl: '500px', '2xl': '700px',},
        {ssr: false}
    )
    const titleHeight = useBreakpointValue({base: '30px',  xl: '50px'}, {ssr: false})

    const svg_width = width ? parseInt(width, 10) : defaultWidth
    const svg_height = (height ? parseInt(height, 10) : defaultHeight) - ((titleHeight ? parseInt(titleHeight, 10) : 50) + (2 * titleMargin))

    useEffect(() => {
        const svg = d3.select(ref.current)
        .attr('width', svg_width)
        .attr('height', svg_height);

        // clear existing content
        svg.selectAll('*').remove();

        // Define the center of each square
        const squareCenterX1 = svg_width / 4; // Center of the first square
        const squareCenterX2 = (3 * svg_width) / 4; // Center of the second square
        const squareCenterY = svg_height / 2; // Center of the SVG height

        // Define square coordinates
        const squareCoordinates = [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100],
        ];

        // Define triangles coordinates (opposite vertices)
        const trianglesCoordinates = [
        [0, 0, 50, 50, 0, 100],
        [0, 0, 100, 0, 50, 50],
        [100, 0, 100, 25, 125, 50, 100, 75, 100, 100, 50, 50],
        [0, 100, 50, 50, 100, 100],
        ];

        // Calculate offset based on face
        const faceOffsets: number[] = []
        for (let i = 0; i < 2; i++) {
            const node = i === 0 ? data.node1 : data.node2

            if (node.face === "N") { 
                faceOffsets.push(0)
            } else if (node.face === 'E') {
                faceOffsets.push(270)
            } else if (node.face === 'S') {
                faceOffsets.push(180)
            } else if (node.face === 'W') {
                faceOffsets.push(90)
            }
        }

        // Define colors for each triangle
        const colorScale = ['#f71a1a', '#f55221', '#f87e1a', '#faa912', '#fdd40b', '#feea07', '#ffff03', '#e6fa15', '#cdf427', '#c2f233', '#99e636', '#6fd938', '#6fd938']
        const colors = ['#e2e8f0', '#a0aec0'];

        // Append text label above square1
        svg.append('text')
            .attr('x', squareCenterX1)
            .attr('y', squareCenterY - 185) // Offset by 100px above the center
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', '700')
            .text(data.node1.node);

        // Create the first square
        svg.selectAll('polygon.square1')
            .data([squareCoordinates])
            .enter().append('polygon')
            .attr('class', 'square1')
            .attr('points', d => d.join(' '))
            .style('fill', 'none')
            .style('stroke', 'black')
            .attr('transform', `translate(${svg_width / 4 - 50}, ${svg_height / 2 - 50})`); // Offset the first square to the left by one-fourth of the SVG width

        // Append text label above square1
        svg.append('text')
            .attr('x', squareCenterX2)
            .attr('y', squareCenterY - 185) // Offset by 100px above the center
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', '700')
            .text(data.node2.node);

        // Create the second square
        svg.selectAll('polygon.square2')
            .data([squareCoordinates])
            .enter().append('polygon')
            .attr('class', 'square2')
            .attr('points', d => d.join(' '))
            .style('fill', 'none')
            .style('stroke', 'black')
            .attr('transform', `translate(${(3 * svg_width) / 4 - 50}, ${svg_height / 2 - 50})`); // Offset the second square to the right by three-fourths of the SVG width

        // Create triangles for the first square
        svg.selectAll('polygon.triangle1')
            .data(trianglesCoordinates)
            .enter().append('polygon')
            .attr('class', 'triangle1')
            .attr('points', d => d.join(' '))
            .style('fill', (_, i) => data.node1_modes[i] === "STA" ? colors[0] : colors[1])
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .attr('transform', `translate(${svg_width / 4 - 50}, ${svg_height / 2 - 50})`); // Offset the first triangles to the left by one-fourth of the SVG width

        // Create triangles for the second square
        svg.selectAll('polygon.triangle2')
            .data(trianglesCoordinates)
            .enter().append('polygon')
            .attr('class', 'triangle2')
            .attr('points', d => d.join(' '))
            .style('fill', (_, i) => data.node2_modes[i] === "STA" ? colors[0] : colors[1])
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .attr('transform', `translate(${(3 * svg_width) / 4 - 50}, ${svg_height / 2 - 50})`); // Offset the second triangles to the right by three-fourths of the SVG width


        // Apply rotation transformations for the first square and triangles
        d3.select(ref.current)
            .selectAll('.square1, .triangle1')
            .attr('transform', `translate(${squareCenterX1 - 50}, ${squareCenterY - 50}) rotate(${faceOffsets[0] + data.node1.offset}, 50, 50)`);

        // Apply rotation transformations for the second square and triangles
        d3.select(ref.current)
            .selectAll('.square2, .triangle2')
            .attr('transform', `translate(${squareCenterX2 - 50}, ${squareCenterY - 50}) rotate(${180 + faceOffsets[1] + data.node2.offset}, 50, 50)`);
        
        // Append lines for connections from node1
        data.node1_data.forEach((connection, index) => {
            const length = 100 * connection.length;
            const angle_rad = (Math.PI / 180) * (connection.angle_deg + faceOffsets[0] + data.node1.offset); // Convert angle to radians
            const x2 = squareCenterX1 + length * Math.cos(angle_rad); // Calculate x2 coordinate
            const y2 = squareCenterY + length * Math.sin(angle_rad); // Calculate y2 coordinate

            svg.append('line')
                .attr('x1', squareCenterX1)
                .attr('y1', squareCenterY)
                .attr('x2', x2)
                .attr('y2', y2)
                .style('stroke', colorScale[connection.mcs_min_tx_rx])
                .style('stroke-width', (connection.capacity_mbps_tx + connection.capacity_mbps_rx) / 200)

            // add text at the end of the line
            svg.append('text')
                .attr('x', x2 + 10) // adjust x position for the text
                .attr('y', y2) // adjust y position for the text
                .attr('text-anchor', 'start') // align to the start
                .style('font-size', '12px')
                .text(`${connection.fwd_label}`); // replace 'text' with actual text content

            // add text at the end of the line
            svg.append('text')
                .attr('x', x2 + 10) // adjust x position for the text
                .attr('y', y2 + 15) // adjust y position for the text
                .attr('text-anchor', 'start') // align to the start
                .style('font-size', '12px')
                .text(`${connection.rev_label}`); // replace 'text' with actual text content
        });

        // Append lines for connections from node2
        data.node2_data.forEach((connection, index) => {
            const length = 100 * connection.length;
            const angle_rad = (Math.PI / 180) * (connection.angle_deg + 180 + faceOffsets[1] + data.node2.offset); // Convert angle to radians
            const x2 = squareCenterX2 + length * Math.cos(angle_rad); // Calculate x2 coordinate
            const y2 = squareCenterY + length * Math.sin(angle_rad); // Calculate y2 coordinate

            svg.append('line')
                .attr('x1', squareCenterX2)
                .attr('y1', squareCenterY)
                .attr('x2', x2)
                .attr('y2', y2)
                .style('stroke', colorScale[connection.mcs_min_tx_rx])
                .style('stroke-width', (connection.capacity_mbps_tx + connection.capacity_mbps_rx) / 200)

            // add text at the end of the line
            svg.append('text')
                .attr('x', x2 + 10) // adjust x position for the text
                .attr('y', y2) // adjust y position for the text
                .attr('text-anchor', 'start') // align to the start
                .style('font-size', '12px')
                .text(`${connection.fwd_label}`); // replace 'text' with actual text content

            // add text at the end of the line
            svg.append('text')
                .attr('x', x2 + 10) // adjust x position for the text
                .attr('y', y2 + 15) // adjust y position for the text
                .attr('text-anchor', 'start') // align to the start
                .style('font-size', '12px')
                .text(`${connection.rev_label}`); // replace 'text' with actual text content
        });
    
        // Append legend for STA in the bottom left corner
        svg.append('text')
            .attr('x', 50) // Adjust x position for the left margin
            .attr('y', svg_height - 55) // Offset from the bottom
            .attr('text-anchor', 'start') // Align to the start (left)
            .text('STA')
            .style('font-size', '14px')

        // Append legend for AP in the bottom left corner
        svg.append('text')
            .attr('x', 50) // Adjust x position for the left margin
            .attr('y', svg_height - 20) // Offset from the bottom
            .attr('text-anchor', 'start') // Align to the start (left)
            .text('AP')
            .style('font-size', '14px')

        // Append colored triangle for STA
        svg.append('polygon')
            .attr('points', '25,' + (svg_height - 70) + ' 40,' + (svg_height - 45) + ' 10,' + (svg_height - 45))
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('fill', colors[0]);

        // Append colored triangle for AP
        svg.append('polygon')
            .attr('points', '25,' + (svg_height - 35) + ' 40,' + (svg_height - 10) + ' 10,' + (svg_height - 10))
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('fill', colors[1]);
    }, [data, svg_width, svg_height]); // Trigger effect on svgWidth and svgHeight change

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
                    <Icon as={MdLeakAdd} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Multipath</Heading>
                </Center>
            </Flex>
            <svg ref={ref} />
        </Box>
    )
}