import { Flex, Wrap, WrapItem } from "@chakra-ui/react";
import LinkBudgetBandwidth from "./LinkBudgetBandwidth";
import LinkBudgetChannel from "./LinkBudgetChannel";
import LinkBudgetPower from "./LinkBudgetPower";
import LinkBudgetGraph from "./LinkBudgetGraph";
import { useState } from "react";

export interface LinkBudgetSelections {
    powerSelections: Set<string>;
    bandwidthSelections: Set<string>;
    channelSelections: Set<string>;
}

const initializeSelections = (): LinkBudgetSelections => ({
    powerSelections: new Set(["auto0"]),
    bandwidthSelections: new Set(["quarter"]),
    channelSelections: new Set(["ch2", "ch5"]),
})

export default function LinkBudget() {
    const [linkBudgetSelections, setLinkBudgetSelections] = useState<LinkBudgetSelections>(initializeSelections())

    return(
        <Flex 
            flexDir="column" 
        >
            <Wrap>
                <WrapItem>
                    <LinkBudgetChannel setLinkBudgetSelections={setLinkBudgetSelections}/>
                </WrapItem>
                <WrapItem>
                    <LinkBudgetBandwidth setLinkBudgetSelections={setLinkBudgetSelections}/>
                </WrapItem>
                <WrapItem>
                    <LinkBudgetPower setLinkBudgetSelections={setLinkBudgetSelections}/>
                </WrapItem>
            </Wrap>
            <LinkBudgetGraph linkBudgetSelections={linkBudgetSelections}/>
        </Flex>

    )
}
