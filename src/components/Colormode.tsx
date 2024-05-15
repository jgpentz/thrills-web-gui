import { Button, Icon, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { LuSun, LuMoonStar } from "react-icons/lu";

interface ColormodeProps {
    navSize: string
}

export default function Colormode ({ navSize }: ColormodeProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <>
            {navSize === 'large' ? 
                <Button
                    color={text_color}
                    bg='none'
                    mt="1"
                    mb="2"
                    fontWeight='normal'
                    onClick={() => {
                        toggleColorMode() 
                    }}
                >
                    {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                    <Icon ml={3} as={colorMode === 'light' ? LuMoonStar : LuSun} boxSize="6" /> 
                </Button> :
                <IconButton
                    aria-label="Toggle menu"
                    background="none"
                    color={text_color}
                    fontSize="2xl" 
                    mt="1"
                    mb="2"
                    icon={colorMode === 'light' ? <LuMoonStar/> : <LuSun/>}
                    onClick={() => {
                        toggleColorMode()
                    }}
                />
            }
        </>
    )
} 
