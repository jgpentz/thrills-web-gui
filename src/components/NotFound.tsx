import { Heading, LinkBox, LinkOverlay, useColorModeValue } from "@chakra-ui/react";

export default function NotFound() {
    const text_color = useColorModeValue('black', 'dark_text')
    const bg_color = useColorModeValue('light_bg', 'dark_bg')

    return (
        <LinkBox 
            mt='7'
            ml='7'
            boxShadow='base'
            maxH='md'
            height='sm'
            maxW='xl' 
            width={['sm', 'sm', 'sm', 'md', 'lg', 'xl']} 
            borderWidth='1px' 
            borderRadius='xl'
            bg={bg_color}
        >
            <LinkOverlay href='/'>
                <Heading m='25px' size='lg' color={text_color}>
                    🚨 404 🚨 Uh oh, this was not the page you were looking for...<br/><br/>
                    Try using the sidebar navigation, or click anywhere in this box to navigate back to the dashboard.
                </Heading>
            </LinkOverlay>
        </LinkBox>
    )
}