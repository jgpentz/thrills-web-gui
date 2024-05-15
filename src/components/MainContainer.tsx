import { Flex, useColorModeValue } from "@chakra-ui/react"
import Dashboard from "./Dashboard"
import GpsMap from "./GpsMap"
import { HashRouter, Routes, Route } from "react-router-dom"
import LinkBudget from "./LinkBudget"
import Multipath from "./Multipath"
import NetworkMap from "./NetworkMap"
import Sidenav from "./Sidenav"
import { LinkBudgetDataProvider } from "./LinkBudgetDataProvider"
import NotFound from "./NotFound"

export default function MainContainer() {
    const bg_color = useColorModeValue('gray.100', 'dark_space_bg')

    return (
        <Flex bg={bg_color}>
            <LinkBudgetDataProvider>
                <HashRouter>
                    <Sidenav />
                    <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/link_budget' element={<LinkBudget />} />
                        <Route path='/network_map' element={<NetworkMap />} />
                        <Route path='/gps_map' element={<GpsMap />} />
                        <Route path='/multipath' element={<Multipath />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </HashRouter>
            </LinkBudgetDataProvider>
        </Flex>
    )
}
