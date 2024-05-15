import { Flex, Link, Menu, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { To, NavLink as RouterLink } from "react-router-dom"

export interface NavItemProps {
    navSize: string;
    icon: IconType;
    title: string;
    to: To
}

export default function NavItem({ navSize, icon, title, to}: NavItemProps) {
    const text_color = useColorModeValue('black', 'dark_text')
    const highlight_color = useColorModeValue('blue.400', 'dark_highlight')
    const item_hover_color = useColorModeValue('gray.200', 'dark_hover_menu')
    return (
        <Flex
            mt={3}
            flexDir="column"
            w="100%"
            alignItems={navSize === "small" ? "center" : "flex-start"}
        >
            <Menu>
                <Link
                    maxH="40px"
                    as={RouterLink}
                    p={2}
                    color={text_color}
                    _hover={{ bg: item_hover_color }}
                    _activeLink={{ 
                        fontWeight: "bold", 
                        color: highlight_color, 
                        borderRight: navSize === "large" ? `solid #89b4fa` : "None"
                    }}
                    to={to}
                    w={navSize === "large" ? "100%" : undefined }
                >
                    <Flex>
                        <Icon as={icon} boxSize="6"/>
                        <Text color={text_color} ml="5" display={navSize === 'small' ? 'none' : 'flex'}>{title}</Text>
                    </Flex>
                </Link>
            </Menu>
        </Flex>
    )
}
