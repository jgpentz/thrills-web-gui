// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
// const config: ThemeConfig = {
//   initialColorMode: 'dark',
//   useSystemColorMode: false,
// }

// 3. extend the theme
const theme = extendTheme(
    { 
        colors: {
            light_bg: 'white',
            dark_bg: '#1e1e2e',
            dark_space_bg: '#313244',
            dark_text: '#cdd6f4',
            light_highlight: 'blue.400',
            dark_highlight: '#89b4fa',
            light_hover_menu: 'black',
            dark_hover_menu: '#313244',
            dark_button: '#1976D2',
            dark_button_hover: '#1565C0',
            dark_button_click: '#0D47A1',
        }
    }
)

export default theme
