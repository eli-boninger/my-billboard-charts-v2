import { createTheme } from "@mui/material/styles";

export const theme = (rootElement: HTMLElement) => createTheme({
    palette: {
        primary: {
            light: "#77a0a9",
            main: "#6F7D8C",
            dark: "#6C596E",
        },
        secondary: {
            light: "#F3e0ec",
            main: "#4b2e39",
            dark: "#32021f",
        },
        error: {
            main: "#fe654f",
        },
        warning: {
            main: "#ffc100",
        },
        info: {
            main: "#37ff8b",
        },
        success: {
            main: "#0b6e4f",
        },
    },
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiModal: {
            defaultProps: {
                container: rootElement,
            },
        },
    },
    typography: {
        fontFamily: ["Nunito", "Arial", "sans-serif"].join(","),
        h1: {
            fontSize: '2.5rem'
        }
    },
});