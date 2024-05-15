import { Box, Center, Tooltip, Flex, Icon, Heading, Divider, Table, TableContainer, Tr, Thead, Text, Th, Tbody, Td, Tag, useColorModeValue, Spacer, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOutlinePodcasts } from "react-icons/md";
import { TbPlug } from "react-icons/tb";

interface RadioListItem {
    node: string;
    last_updated: string;
    radio_temp: string;
    npu_temp: string;
    sector: string[];
    pcp: string[];
    connected_radios: string[]
    snr: string;
    mcs: string[];
    distance_m: string[];
    face_0: string | undefined;
    face_1: string | undefined;
    mrc: string;
    role: string;
    power: string;
    config: string;
    status: string;
    version_frf_mender: string;
}

interface RadioListItems {
    [key: string]: RadioListItem;
}

export default function RadioList() {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    const textSize = ['sm', 'sm','sm','md','lg','lg']
    const [radioList, setRadioList] = useState<RadioListItems>({})
    const [hostname, setHostname] = useState<string>("")

    // Store the SN of the radio we're conneted to
    useEffect(() => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/hostname`;

        const fetchData = async () => {
            fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                const sn = json["hostname"]
                setHostname(sn);
            })
            .catch(error => {
                console.error(error);
            });
        }

        // Fetch data initially when the component mounts
        fetchData()
    }, []);

    // Fetch the radio list from the backend at a 1 Hz interval
    useEffect(() => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/radio_list`;

        const fetchData = async () => {
            fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                setRadioList(json);
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

    const DATE_FORMAT = "%Y-%m-%d %H:%M:%S";

    function formatDate(dateString: string, format: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return date.toLocaleString('en-GB', options).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1').replace(/,/g, '');
    }

    function getLastUpdatedTime(): string {
        let latestTime = ""; // Initialize with an empty string

        // Iterate over each RadioListItem
        for (const key in radioList) {
            if (radioList.hasOwnProperty(key)) {
                const item = radioList[key];
                // Check if last_updated time of this item is later than the current latestTime
                if (item.last_updated > latestTime) {
                    latestTime = item.last_updated;
                }
            }
        }

        return formatDate(latestTime, DATE_FORMAT);
    }

    // Helper function for wrapping the text in the 'connected radios' column
    // to a new line when the list gets too long
    function columnOverflow(entry: string[]) {
        if (!entry || entry.length === 0) {
            return []
        }
        const rows = []
        let row = []
        let i = 0
        for (; i < entry.length; i++) {
            row.push(entry[i])
            if ((i + 1) % 3 === 0) {
                rows.push(row.join(', '))
                rows.push(<br />)
                row = []
            }
        }
        if (i % 4) {
            rows.push(row.join(', '))
        }

        return rows
    }

    return (
        <Box 
            m="7" 
            boxShadow='base'
            bg={bg_color}
            height='xl'
            maxH='100%'
            borderWidth='1px' 
            borderRadius='xl'
        >
            <Flex m="3">
                <Center>
                    <Icon as={MdOutlinePodcasts} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Radio List</Heading>
                </Center>
                <Spacer />
                <Text mt='20px' mr='10px'>Last updated: {getLastUpdatedTime()}</Text>
            </Flex>
            <Divider />
            <TableContainer m={4} overflowY='auto' maxHeight='80%' fontSize={textSize}>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Status</Th>
                            <Th>Connected Radios</Th>    
                            <Th>Config</Th>    
                            <Th>Power</Th>    
                            <Th>
                                <Tooltip 
                                    label={
                                        <Stack>
                                            <Text>Normal: &lt; 85° C</Text>
                                            <Text>Warning: 85° C &lt; radio_temp &lt; 105° C</Text>
                                            <Text>Error: &gt; 105° C</Text>
                                        </Stack>
                                    }
                                >
                                    Radio temp (°C)
                                </Tooltip>
                            </Th>    
                            <Th>
                                <Tooltip 
                                    label={
                                        <Stack>
                                            <Text>Normal: &lt; 95° C</Text>
                                            <Text>Warning: 95° C &lt; radio_temp &lt; 100° C</Text>
                                            <Text>Error: &gt; 100° C</Text>
                                        </Stack>
                                    }
                                >
                                    NPU temp (°C)
                                </Tooltip>
                            </Th>    
                            <Th>THRILLS Version</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {Object.values(radioList).map((entry: RadioListItem) => (
                        <Tr key={entry.node}>
                            <Td>
                                <Text as='b'>
                                    {entry.node}
                                </Text>
                                {entry.node.toLowerCase() === hostname.toLowerCase() ? (
                                    <Tooltip label={`Connected to ${hostname}`}>
                                        <span>
                                            <Icon as={TbPlug} ml={2} color={text_color} boxSize='5'/>
                                        </span>
                                    </Tooltip>
                                ) : null}
                            </Td>
                            <Td> 
                                {entry.status !== "Connected" ? (
                                    <Tag size='lg' colorScheme='red' key={entry.status}>
                                        {entry.status}
                                    </Tag>
                                ) : (
                                    <Tag size='lg' colorScheme='green' key={entry.status}>
                                        {entry.status}
                                    </Tag>
                                )
                                
                            }
                            </Td>
                            <Td textAlign='start' maxW='225px' w='225px '>
                                {columnOverflow(entry.connected_radios)}
                            </Td>
                            <Td>{entry.config}</Td>
                            <Td>{entry.power}</Td>
                            <Td>
                                {parseInt(entry.radio_temp) < 85 ? (
                                    <Tooltip label="< 85° C: Normal">
                                        {entry.radio_temp}
                                    </Tooltip>
                                ) : parseInt(entry.radio_temp) < 105 ? (
                                    <Tooltip label="> 85° C: Warning">
                                        <Tag size='lg' colorScheme='orange' key={entry.radio_temp}>
                                            {entry.radio_temp}
                                        </Tag>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="> 105° C: Over max temperature">
                                        <Tag size='lg' colorScheme='red' key={entry.radio_temp}>
                                            {entry.radio_temp}
                                        </Tag>
                                    </Tooltip>
                                )}
                            </Td>
                            <Td>
                                 {parseInt(entry.npu_temp) < 95 ? (
                                    <Tooltip label="< 95° C: Normal">
                                        {entry.npu_temp}
                                    </Tooltip>
                                ) : parseInt(entry.npu_temp) < 100 ? (
                                    <Tooltip label="> 95° C: Warning">
                                        <Tag size='lg' colorScheme='orange' key={entry.npu_temp}>
                                            {entry.npu_temp}
                                        </Tag>
                                    </Tooltip>
                                ) : (
                                    <Tooltip label="> 100° C: Error">
                                        <Tag size='lg' colorScheme='red' key={entry.npu_temp}>
                                            {entry.npu_temp}
                                        </Tag>
                                    </Tooltip>
                                )}
                            </Td>
                            <Td>{entry.version_frf_mender}</Td>
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}
