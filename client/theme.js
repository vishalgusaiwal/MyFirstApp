import { createTheme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';

const theme = createTheme({
    typography: {
        fontSize: 12,
        useNextVariants: true
    },
    spacing: 2,
    palette: {
        primary: {
            light: '#5c67a3',
            main: '#3f4771',
            dark: '#2e355b',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff79b0',
            main: '#ff4081',
            dark: '#c60055',
            contrastText: '#000'
        },
        openTitle: '#3f4771',
        projectTitle: pink['400'],
        type: 'light'
    },
    overrides: {
        /*MuiAppBar: {
            root: {
                minHeight: 40, // Adjust the height of AppBar
                maxWidth:700
            },
        },
        MuiTab: {
            root: {
                fontSize: 10, // Adjust the font size of Tabs
                maxWidth:700
            },
        },
        MuiPaper: {
            root: {
                maxWidth:700
            },
        },*/
       /* MuiTypography: {
            root: {
                maxWidth: 700
            },
        }*/
        // Add more overrides as needed
    }
});

export default theme;