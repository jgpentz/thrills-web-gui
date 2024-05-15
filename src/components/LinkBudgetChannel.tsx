import { Box, Checkbox, Heading, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { LinkBudgetSelections } from './LinkBudget';

interface LinkBudgetChannelProps {
    setLinkBudgetSelections: React.Dispatch<React.SetStateAction<LinkBudgetSelections>>;
}

export default function LinkBudgetChannel({setLinkBudgetSelections}: LinkBudgetChannelProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')

    const toggleChannel = (channel: string) => {
        setLinkBudgetSelections((prevSelections) => {
            const channelSelections = new Set(prevSelections.channelSelections)

            if (channelSelections.has(channel)) {
                // Remove channel if it already exists
                channelSelections.delete(channel);
            }
            else {
                // Add channel if it's not in the set
                channelSelections.add(channel);
            }

            return {
                ...prevSelections,
                channelSelections
            }
        })
    }

    return (
        <Box
            mt='7'
            ml='7'
            boxShadow='base'
            bg={bg_color}
            maxH='sm'
            maxW='sm'
            height='150px'
            width={['325px']} 
            borderWidth='1px' 
            borderRadius='xl'
        >
            <Heading m="3" color={text_color} fontSize={['2xl']}>Channel</Heading>
            <SimpleGrid m='3' columns={2} spacing={1}>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch1')}>Ch 1: 58.32 GHz</Checkbox>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch4')}>Ch 4: 64.8 GHz</Checkbox>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch2')} defaultChecked>Ch 2: 60.48 GHz</Checkbox>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch5')} defaultChecked>Ch 5: 66.96 GHz</Checkbox>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch3')}>Ch 3: 62.64 GHz</Checkbox>
                <Checkbox color={text_color} onChange={() => toggleChannel('ch6')}>Ch 6: 69.12 GHz</Checkbox>
            </SimpleGrid>
        </Box>
    )
}