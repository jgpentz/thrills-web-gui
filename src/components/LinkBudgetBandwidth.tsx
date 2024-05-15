import { Box, Checkbox, Heading, SimpleGrid, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { LinkBudgetSelections } from './LinkBudget'

interface LinkBudgetBandwidthProps {
    setLinkBudgetSelections: React.Dispatch<React.SetStateAction<LinkBudgetSelections>>;
}

export default function LinkBudgetBandwidth({setLinkBudgetSelections}: LinkBudgetBandwidthProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')

    const toggleBandwidth = (bandwidth: string) => {
        setLinkBudgetSelections((prevSelections) => {
            const bandwidthSelections = new Set(prevSelections.bandwidthSelections)

            if (bandwidthSelections.has(bandwidth)) {
                // Remove channel if it already exists
                bandwidthSelections.delete(bandwidth)
            }
            else {
                // Add channel if it's not in the set
                bandwidthSelections.add(bandwidth)
            }

            return {
                ...prevSelections,
                bandwidthSelections
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
            width={['375px']} 
            borderWidth='1px' 
            borderRadius='xl'
        >
            <Heading m="3" color={text_color} fontSize={['2xl']}>Bandwidth</Heading>
            <SimpleGrid m='3' columns={2} spacing={1}>
                <Checkbox color={text_color} onChange={() => toggleBandwidth('full')}>Full: 1760 MHz</Checkbox>
                <Tooltip label="This bandwidth is not supported by the current hardware" shouldWrapChildren>
                    <Checkbox color='gray.500' onChange={() => toggleBandwidth('eighth')}>*Eighth: 220 MHz</Checkbox>
                </Tooltip>
                <Checkbox color={text_color} onChange={() => toggleBandwidth('half')}>Half: 880 MHz</Checkbox>
                <Tooltip label="This bandwidth is not supported by the current hardware" shouldWrapChildren>
                    <Checkbox color='gray.500' onChange={() => toggleBandwidth('sixteenth')}>*Sixteenth: 110 MHz</Checkbox>
                </Tooltip>
                <Checkbox color={text_color} onChange={() => toggleBandwidth('quarter')} defaultChecked>Quarter: 440 MHz</Checkbox>
            </SimpleGrid>
        </Box>
    )
}
