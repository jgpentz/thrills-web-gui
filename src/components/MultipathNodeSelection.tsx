import { Box, Heading, useColorModeValue, Flex, Text, Select, Spacer, VStack, Input } from "@chakra-ui/react";
import { MultipathNode } from './Multipath';

interface MultipathNodeSelectionProps {
    name: string;
    node_list: string[];
    setNode: React.Dispatch<React.SetStateAction<MultipathNode>>;
}

export default function MultipathNodeSelection({name, node_list, setNode}: MultipathNodeSelectionProps) {
    const textSize = ['sm', 'sm','sm','md','lg','lg']
    const selectSize = ['sm', 'sm', 'sm', 'md']
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')


    const handleNodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNode((prevSelections) => {
            const node = { ...prevSelections }
            node.node = event.target.value;
            return node
        })       
    }

    const handleFaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNode((prevSelections) => {
            const node = { ...prevSelections }
            node.face = event.target.value;
            return node
        })       
    }

    const handleOffsetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNode((prevSelections) => {
            const node = { ...prevSelections }
            node.offset = parseInt(event.target.value);
            if (!node.offset) {
                node.offset = 0
            }
            return node
        })       
    }

    return (
        <Box
            mt='7'
            ml='7'
            boxShadow='base'
            bg={bg_color}
            maxH='md'
            maxW='sm'
            height='250px'
            width={['sm', 'sm', 'sm', 'md', 'lg', 'xl']} 
            borderWidth='1px' 
            borderRadius='xl'
        >
            <Heading m="3" color={text_color} fontSize={['2xl']}>{name}</Heading>
            <VStack w='100%'  spacing={3} align='stretch' >
                <Flex alignItems='center' ml='5' mr='5'>
                    <Text w='40%' color={text_color} fontSize={textSize}>Select Node</Text>
                    <Select 
                        w='60%' 
                        ml='5' 
                        mr='5' 
                        onChange={handleNodeChange} 
                        placeholder='None' 
                        size={selectSize} 
                        color={text_color}
                    >
                    {node_list.map((node, index) => (
                        <option key={index} value={node}>{node}</option>
                    ))}
                    </Select>
                </Flex>
                <Spacer />
                <Flex alignItems='center' ml='5' mr='5'>
                    <Text w='40%' color={text_color} fontSize={textSize}>Direct Face</Text>
                    <Select 
                        w='60%' 
                        ml='5' 
                        mr='5' 
                        onChange={handleFaceChange} 
                        size={selectSize} 
                        color={text_color}
                    >
                        <option value='N'>N</option>
                        <option value='E'>E</option>
                        <option value='S'>S</option>
                        <option value='W'>W</option>
                    </Select>
                </Flex>
                <Spacer />
                <Flex alignItems='center' ml='5' mr='5'>
                    <Text w='40%' color={text_color} fontSize={textSize}>Enter Offset (degrees)</Text>
                    <Input w='60%' ml='5' mr='5' placeholder='0' onChange={(ev: any) => handleOffsetChange(ev)} />
                </Flex>
            </VStack>
        </Box>
    )
}