import { Box, Button, Center, Divider, Flex, Heading, Icon, Select, Spacer, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoOptionsOutline } from "react-icons/io5";

interface ChannelSelectionAPI {
    bandwidth: string;
    channel: string;
    power: string;
    beacon_mode: string;
}

// Channel
export default function ChannelSelection() {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    const button_color = useColorModeValue('blue.400', 'dark_button')
    const button_text_color = useColorModeValue('white', 'dark_text')
    const button_hover_color = useColorModeValue('blue.500', 'dark_button_hover')
    const button_click_color = useColorModeValue('blue.600', 'dark_button_click')
    const textSize = ['sm', 'sm','sm','md','lg','lg']
    const selectSize = ['sm', 'sm', 'sm', 'md']
    const buttonTextSize = ['sm', 'sm', 'sm', 'sm', 'md']
    const [bandwidth, setBandwidth] = useState<string>("")
    const [channel, setChannel] = useState<string>("")
    const [power, setPower] = useState<string>("")
    const [applyingSettings, setApplyingSettings] = useState(false)
    const [applyDisabled, setApplyDisabled] = useState(true)
    const toast = useToast(); // Initialize useToast hook

    const handleBandwidthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setBandwidth(selectedValue);
    };

    const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setChannel(selectedValue);
    };

    const handlePowerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setPower(selectedValue);
    };

    useEffect(() => {
        if (bandwidth !== '' && channel !== '' && power !== '') {
            setApplyDisabled(false)
        } else {
            setApplyDisabled(true)
        }
    }, [bandwidth, channel, power])

    const sendChannelSelections = () => {
        setApplyingSettings(true)
        const requestData: ChannelSelectionAPI = {
            bandwidth: bandwidth,
            channel: channel,
            power: power,
            beacon_mode: "360 Deg",
        };

        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/channel_selections/`;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                setApplyingSettings(false)
                // Show error toast
                toast({
                    title: "Error",
                    description: "There was an error applying settings. Please try again later.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });

                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setApplyingSettings(false)
        })
        .catch(error => {
            console.error('Error:', error);
            // Show error toast
            setApplyingSettings(false)
            toast({
                title: "Error",
                description: "There was an error applying settings. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }

    return(
        <Box 
            mt='7'
            ml='7'
            boxShadow='base'
            maxH='md'
            height='sm'
            maxW='2xl' 
            width={['sm', 'sm', 'sm', 'sm', 'sm', 'sm']} 
            borderWidth='1px' 
            borderRadius='xl'
            bg={bg_color}
        >
            <Flex m="3">
                <Center>
                    <Icon as={IoOptionsOutline} color={text_color} boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Channel Selection</Heading>
                </Center>
            </Flex>
            <Divider/>
            <Flex m='6'>
                <VStack w='100%' h='full' spacing={3} align='stretch' >
                    <Flex alignItems='center'>
                        <Text w='30%' color={text_color} fontSize={textSize}>Bandwidth</Text>
                        <Select 
                            w='55%' 
                            ml='5' 
                            mr='5' 
                            onChange={handleBandwidthChange} 
                            placeholder='Select Bandwidth' 
                            size={selectSize} 
                            color={text_color}
                        >
                            <option value='full'>Full</option>
                            <option value='half'>Half</option>
                            <option value='quarter'>Quarter</option>
                        </Select>
                    </Flex>
                    <Spacer />
                    <Flex alignItems='center'>
                        <Text w='30%' color={text_color} fontSize={textSize}>Channel</Text>
                        <Select 
                            w='55%' 
                            ml='5' 
                            mr='5' 
                            onChange={handleChannelChange}
                            placeholder='Select Channel' 
                            size={selectSize} 
                            color={text_color}
                        >
                            <option value='2/3'>2/3</option>
                            <option value='5/6'>5/6</option>
                        </Select>
                    </Flex>
                    <Spacer />
                    <Flex alignItems='center'>
                        <Text w='30%' color={text_color} fontSize={textSize}>Power</Text>
                        <Select 
                            w='55%' 
                            ml='5' 
                            mr='5' 
                            onChange={handlePowerChange}
                            placeholder='Select Power' 
                            size={selectSize} 
                            color={text_color}
                        >
                            <option value='auto_0_43dBm'>Auto 0: 43 dBm</option>
                            <option value='auto_1_40dBm'>Auto 1: 40 dBm</option>
                            <option value='auto_2_36dBm'>Auto 2: 36 dBm</option>
                            <option value='auto_3_32dBm'>Auto 3: 32 dBm</option>
                        </Select>
                    </Flex>
                    <Spacer />
                    <Flex alignItems='center' mt='5'>
                        <Text w='30%' color={text_color} fontSize={textSize}></Text>
                        <Button 
                            w='55%' 
                            ml='5'
                            mr='5'
                            _hover={{ bg:button_hover_color }} 
                            _active={{ bg:button_click_color }}
                            bg={button_color} 
                            color={button_text_color}
                            fontSize={buttonTextSize}
                            isLoading={applyingSettings}
                            loadingText='Submitting'
                            isDisabled={applyDisabled}
                            onClick={() => sendChannelSelections()}
                        >
                            Apply Settings
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
        </Box>
    )
}
