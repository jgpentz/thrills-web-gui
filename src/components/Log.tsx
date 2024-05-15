import { Box, Center, Divider, Flex, Heading, Icon, IconButton, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdOpenInFull, MdOutlineStickyNote2 } from "react-icons/md";
import React, { ReactNode } from "react"

interface LogEntry {
    time: string;
    msg: string;
}

export default function Log() {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    const log_bg_color = useColorModeValue('gray.50', '#cdd6f4')
    const log_text_color = useColorModeValue('black', '#585b70')
    const textSize = ['sm', 'sm','sm','md','lg','lg']
    const [entries, setEntries] = useState<LogEntry[]>([])

    const { isOpen, onOpen, onClose } = useDisclosure()

    // Fetch the radio list from the backend at a 1 Hz interval
    useEffect(() => {
        const hostname = window.location.hostname;
        const apiUrl = `http://${hostname}:3001/log`;

        const fetchData = async () => {
            fetch(apiUrl)
            .then(response => response.json())
            .then(json => {
                setEntries(json);
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

    const preprocessMessage = (msg: string): ReactNode[] => {
        const words: string[] = msg.split(' ');
        const processedWords: ReactNode[] = [];
        const snPattern: RegExp = /SN\d+[AB]/; // Regular expression pattern for SN followed by number and A or B
        words.forEach((word, index) => {
            // Applying different styles based on the content of the word
            if (word.startsWith('success')) {
                processedWords.push(
                    <span key={index} style={{ color: 'green', fontWeight: 'bold' }}>
                        {word}
                    </span>
                );
            } else if (word.startsWith('error')) {
                processedWords.push(
                    <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>
                        {word}
                    </span>
                );
            } else if (snPattern.test(word)) {
                processedWords.push(
                    <span key={index} style={{ fontWeight: 'bold' }}>
                        {word}
                    </span>
                );
            } else {
                // Default case, no special formatting
                processedWords.push(<span key={index}>{word}</span>);
            }
            // Add space after each word except the last one
            if (index !== words.length - 1) {
                processedWords.push(' ');
            }
        });
        return processedWords;
    };

    return(
        <Box 
            mt='7'
            ml='7'
            mr='7'
            boxShadow='base'
            bg={bg_color}
            maxH='md'
            maxW='4xl' 
            height='sm'
            width={['sm', 'sm', 'md', 'xl', '2xl', '4xl']} 
            borderWidth='1px' 
            borderRadius='xl'
        >
            <Flex m="3">
                <Center>
                    <Icon alignContent='center' as={MdOutlineStickyNote2} color={text_color}  boxSize='8'/>
                    <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Log</Heading>
                </Center>
                <Spacer />
                <Center>
                    <IconButton 
                        bg='none' 
                        fontSize='3xl' 
                        color={text_color} 
                        aria-label='Expand log' 
                        icon={<MdOpenInFull />} 
                        onClick={onOpen}
                    />
                </Center>
            </Flex>
            <Divider/>
            <Box m={3} maxH="75%" borderRadius="xl" bg={log_bg_color} overflowY='auto'>
                <List m='3' spacing={3}>
                    {entries.slice().reverse().map((entry) => (
                        <ListItem key={entry.time}>
                            <Flex fontSize={textSize}>
                                <Text minW='165px' color='gray.500'>{entry.time}</Text>
                                <Text ml='2' color={log_text_color}>{preprocessMessage(entry.msg)}</Text>
                            </Flex>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Modal size='full' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />   
                <ModalContent bg={bg_color}>
                    <ModalHeader>
                        <Flex>
                            <Center>
                                <Icon alignContent='center' as={MdOutlineStickyNote2} color={text_color}  boxSize='8'/>
                                <Heading ml="3" color={text_color} fontSize={['2xl', '2xl', '2xl', '3xl', '4xl']}>Log</Heading>
                            </Center>
                            <Spacer />
                            <ModalCloseButton />
                        </Flex>
                        <Divider mt={3} />
                    </ModalHeader>
                    <ModalBody>
                        <Box maxW='100%' m={3} borderRadius="xl" bg={log_bg_color} overflowY='auto'>
                            <List m='3' spacing={3}>
                                {entries.slice().reverse().map((entry) => (
                                    <ListItem key={entry.time}>
                                        <Flex fontSize={textSize}>
                                            <Text minW='165px' color='gray.500'>{entry.time}</Text>
                                            <Text ml='2' color={log_text_color}>{preprocessMessage(entry.msg)}</Text>
                                        </Flex>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}
