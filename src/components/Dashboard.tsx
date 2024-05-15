import { Flex } from "@chakra-ui/react";
import ChannelSelection from "./ChannelSelection";
import Log from "./Log";
import RadioList from "./RadioList";

// Test
export default function Dashboard() {
    return(
        <Flex flexDir="column">
            <Flex>
                <ChannelSelection />
                <Log />
            </Flex>
                <RadioList />
        </Flex>
    )
}
