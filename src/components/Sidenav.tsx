import { Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { MdAutoGraph, MdCellTower, MdGpsFixed, MdOutlineHome, MdLeakAdd } from "react-icons/md"
import CollapseButton from "./CollapseButton";
// import Colormode from "./Colormode";
import NavItem from "./NavItem";
import FrfLogo from "./FrfLogo"
import FrfLogoSmall from "./FrfLogoSmall"

export default function Sidebar() {
    const [navSize, changeNavSize] = useState("large")
    const bg_color = useColorModeValue('light_bg', 'dark_bg')
    return (
        <Flex
            pos="sticky"
            h="100vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            w={navSize === "small" ? "75px" : "200px"}
            minW={navSize === "small" ? "75px" : "200px"}
            flexDir="column"
            transition='0.25s'
            bg={bg_color}
        >   
            {navSize === "small" ? (
                <FrfLogoSmall width={75} height={75} /> 
            ) : ( 
                <FrfLogo width={190} height={75} /> 
            )}
            <Divider />
            <Flex
                p="5%"
                flexDir="column"
                alignItems={navSize === 'large' ? 'flex-end': 'none'}
                as="nav"
            >
                <NavItem navSize={navSize} icon={MdOutlineHome} title="Dashboard" to="/"/>
                <NavItem navSize={navSize} icon={MdAutoGraph} title="Link Budget" to="/link_budget"/>
                <NavItem navSize={navSize} icon={MdCellTower} title="Network Map" to="network_map"/>
                <NavItem navSize={navSize} icon={MdGpsFixed} title="GPS Map" to="gps_map"/>
                <NavItem navSize={navSize} icon={MdLeakAdd} title="Multipath" to="multipath"/>
                <Divider mt="5" mb="5" />
                {/* Removing light/dark mode until it's fully implemented */}
                {/* <Colormode navSize={navSize} /> */}
                <CollapseButton navSize={navSize} changeNavSize={changeNavSize} />
            </Flex>
        </Flex>
    )
}
