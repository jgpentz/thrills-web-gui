import { useEffect, useState } from "react";
import MultipathNodeSelection from './MultipathNodeSelection'
import { Flex, Wrap, WrapItem } from "@chakra-ui/react";
import MultipathGraph from "./MultipathGraph";

export interface MultipathNode {
    node: string;
    face: string;
    offset: number;
}

const initializeNode = (): MultipathNode => ({
    node: 'None',
    face: 'N',
    offset: 0
})

export interface MultipathNodeConnection {
    fwd_label: string;
    rev_label: string;
    length: number;
    angle_deg: number;
    mcs_min_tx_rx: number;
    data_rate_mbps_tx: number;
    data_rate_mbps_rx: number;
    capacity_mbps_tx: number;
    capacity_mbps_rx: number;
}

const initializeMultipathNodeData = (): MultipathNodeConnection => ({
    fwd_label: "",
    rev_label: "",
    length: 0,
    angle_deg: 0,
    mcs_min_tx_rx: 0,
    data_rate_mbps_tx: 0,
    data_rate_mbps_rx: 0,
    capacity_mbps_tx: 0,
    capacity_mbps_rx: 0,
})

export interface MultipathData {
    node1: MultipathNode;
    node1_modes: string[];
    node1_data: MultipathNodeConnection[];
    node2: MultipathNode;
    node2_modes: string[];
    node2_data: MultipathNodeConnection[];
}

const initializeData = (): MultipathData => ({
    node1: initializeNode(),
    node1_modes: [],
    node1_data: [],
    node2: initializeNode(),
    node2_modes: [],
    node2_data: [],
})

interface NodeLinkList {
  mcsTx: number[];
  mcsRx: number[];
  dataRateMbpsTx: number[];
  dataRateMbpsRx: number[];
  capacityMbpsTx: number[];
  capacityMbpsRx: number[];
  beamAngleDegTx: number[];
  mcs_min_tx_rx: number[];
  dest_node: string[];
  src_node: string[];
}

interface ModeList {
  [key: string]: string[];
}

interface MultipathApiData {
  node_link_list: NodeLinkList;
  mode_list: ModeList;
}

export default function Multipath() {
    const [data, setData] = useState<MultipathData>(initializeData())
    const [node1, setNode1] = useState<MultipathNode>(initializeNode())
    const [node2, setNode2] = useState<MultipathNode>(initializeNode())
    const [availableNodes, setAvailableNodes] = useState<string[]>([])

    const UpdateData = (json_data: MultipathApiData, node1: MultipathNode, node2: MultipathNode) => {
        const nodes: string[] = []
        const newData: MultipathData = initializeData() 

        // Store all of the nodes
        for (let i = 0; i < json_data.node_link_list.dest_node.length; i++) {
            const source = json_data.node_link_list.src_node[i];
            const target = json_data.node_link_list.dest_node[i];

            if(!nodes.find((name) => name === source)) {
                nodes.push(source)
            }
            if(!nodes.find((name) => name === target)) {
                nodes.push(target)
            }
        }

        // Unscramble the mode data, comes in from api as N, S, W, E
        // but the graph takes the inputs as S, W, N, E
        if (node1.node !== "None") {
            newData.node1_modes.push(json_data.mode_list[node1.node][1])
            newData.node1_modes.push(json_data.mode_list[node1.node][2])
            newData.node1_modes.push(json_data.mode_list[node1.node][0])
            newData.node1_modes.push(json_data.mode_list[node1.node][3])
        }
        if (node2.node !== "None") {
            newData.node2_modes.push(json_data.mode_list[node2.node][1])
            newData.node2_modes.push(json_data.mode_list[node2.node][2])
            newData.node2_modes.push(json_data.mode_list[node2.node][0])
            newData.node2_modes.push(json_data.mode_list[node2.node][3])
        }

        // Store all of the connections for each selected node
        for (let inode = 0; inode < 2; inode++) {
            let src_node: string;
            let dest_node: string;
            if (inode === 0) {
                src_node = node1.node
                dest_node = node2.node
            } else {
                src_node = node2.node
                dest_node = node1.node
            }

            for (let i = 0; i < json_data.node_link_list.mcs_min_tx_rx.length; i++) {
                // Node 1
                if(json_data.node_link_list.src_node[i] === src_node) {
                    const newNodeConnection: MultipathNodeConnection = initializeMultipathNodeData()

                    if(json_data.node_link_list.dest_node[i] === dest_node) {
                        newNodeConnection.length = 1.5
                    } else {
                        newNodeConnection.length = 0.75
                    }
                    newNodeConnection.fwd_label = `fwd: ${json_data.node_link_list.dataRateMbpsTx[i]}/${json_data.node_link_list.capacityMbpsTx[i]}`
                    newNodeConnection.rev_label = `rev: ${json_data.node_link_list.dataRateMbpsRx[i]}/${json_data.node_link_list.capacityMbpsRx[i]}`
                    newNodeConnection.angle_deg = json_data.node_link_list.beamAngleDegTx[i]
                    newNodeConnection.mcs_min_tx_rx = json_data.node_link_list.mcs_min_tx_rx[i]
                    newNodeConnection.capacity_mbps_rx = json_data.node_link_list.capacityMbpsRx[i]
                    newNodeConnection.capacity_mbps_tx = json_data.node_link_list.capacityMbpsTx[i]
                    newNodeConnection.data_rate_mbps_rx = json_data.node_link_list.dataRateMbpsRx[i]
                    newNodeConnection.data_rate_mbps_tx = json_data.node_link_list.dataRateMbpsTx[i]

                    if (inode === 0) {
                        newData.node1_data.push(newNodeConnection)
                    } else {
                        newData.node2_data.push(newNodeConnection)
                    }
                }
            }
        }

        newData.node1 = node1
        newData.node2 = node2

        setData(newData)

        setAvailableNodes(nodes)
    }

    // Fetch the radio list from the backend at a 1 Hz interval
    useEffect(() => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/multipath`;

        const fetchData = async () => {
            fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                UpdateData(json, node1, node2);
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
    }, [node1, node2]); // Empty array ensures this only runs on mount

    return(
        <Flex flexDir='column'>
            <Wrap>
                <WrapItem>
                    <MultipathNodeSelection name="Node 1" node_list={availableNodes} setNode={setNode1}/>
                </WrapItem>
                <WrapItem>
                    <MultipathNodeSelection name="Node 2" node_list={availableNodes} setNode={setNode2}/>
                </WrapItem>
            </Wrap>
            <MultipathGraph data={data}/>
        </Flex>
    )
}
