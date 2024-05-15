import {
  ChakraProvider,
} from "@chakra-ui/react"
import MainContainer from "./components/MainContainer"
import theme from "./theme"

export const App = () => (
  <ChakraProvider theme={theme}>
    <MainContainer />
  </ChakraProvider>
)
