import { Box, Checkbox, Heading, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { LinkBudgetSelections} from './LinkBudget';

interface LinkBudgetPowerProps {
    setLinkBudgetSelections: React.Dispatch<React.SetStateAction<LinkBudgetSelections>>;
}



export default function LinkBudgetPower({setLinkBudgetSelections}: LinkBudgetPowerProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')

    const togglePowers = (power: string) => {
        setLinkBudgetSelections((prevSelections) => {
            const powerSelections = new Set(prevSelections.powerSelections)

            if (powerSelections.has(power)) {
                // Remove power if exists in set
                powerSelections.delete(power)
            }
            else {
                // Add power if not in set
                powerSelections.add(power)
            }

            return {
                ...prevSelections,
                powerSelections
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
            <Heading m="3" color={text_color} fontSize={['2xl']}>Power</Heading>
            <SimpleGrid m='3' columns={2} spacing={1}>
                <Checkbox color={text_color} onChange={() => togglePowers('auto0')} defaultChecked>Auto 0: 43 dBm</Checkbox>
                <Checkbox color={text_color} onChange={() => togglePowers('auto1')}>Auto 1: 40 dBm</Checkbox>
                <Checkbox color={text_color} onChange={() => togglePowers('auto2')}>Auto 2: 36 dBm</Checkbox>
                <Checkbox color={text_color} onChange={() => togglePowers('auto3')}>Auto 3: 32 dBm</Checkbox>
            </SimpleGrid>
        </Box>
    )
}