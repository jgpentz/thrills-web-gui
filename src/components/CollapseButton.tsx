import { Button, Icon, IconButton, useColorModeValue } from "@chakra-ui/react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Dispatch, SetStateAction } from "react";

interface CollapseProps {
  navSize: string;
  changeNavSize: Dispatch<SetStateAction<string>>;
}


export default function CollapseButton({ navSize, changeNavSize }: CollapseProps) {
    const text_color = useColorModeValue('black', 'dark_text')

    return(
        <>
            {navSize === 'large' ? 
                <Button
                    bg='none'
                    color={text_color}
                    fontWeight='normal'
                    onClick={() => {
                        changeNavSize("small")
                    }}
                >
                    Collapse
                    <Icon ml={3} as={TbLayoutSidebarLeftCollapse} boxSize="6" /> 
                </Button> :
                <IconButton
                    aria-label="Toggle menu"
                    background="none"
                    color={text_color}
                    fontSize="2xl" 
                    icon={navSize === 'small' ? <TbLayoutSidebarLeftExpand/> : <TbLayoutSidebarLeftCollapse />}
                    onClick={() => {
                        if (navSize === "small") {
                            changeNavSize("large")
                        }
                        else {
                            changeNavSize("small")
                        }
                    }}
                />
            }
        </>
    )
}
