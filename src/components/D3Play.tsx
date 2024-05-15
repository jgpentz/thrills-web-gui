import { useState, useEffect, useRef } from "react"
import * as d3 from 'd3'
import { useInterval } from "@chakra-ui/react"

function generateDataset(): number[][] {
    let dataset = []
    for (let j = 0; j < 10; j++) {
        dataset.push([Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)])
    }
    return (dataset)
}

function D3Play() {
    const svgRef = useRef(null)
    const [dataset, setDataset] = useState<number[][]> (
        generateDataset()
    )

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('circle')
            .data(dataset)
            .join('circle')
                .attr('cx', d => d[0])
                .attr('cy', d => d[1])
                .attr('r', 30)
    }, [dataset]);
    
    useInterval(() => {
        setDataset(generateDataset())
    }, 1000)

    return (
        <svg
            ref={svgRef}
            width='800' height='800'
        />
    )
}

export default D3Play;