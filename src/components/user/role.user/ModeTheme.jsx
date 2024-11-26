import { createContext, useContext, useState } from "react";
import { demoTheme } from "../../../service/service.component";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import IndexLayoutUser from "./MainLayout";

const ThemeContext = createContext({ toggleTheme: () => {}, mode: 'light' });

export const useThemeContext = () => useContext(ThemeContext);

export const ModeTheme = () => {
    const [mode, setMode] = useState('light');

    const toggleTheme = () => {
        setMode(preMode => preMode==='light'? 'dark': 'light');
    }

    const theme = createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: { default: "#f5f5f5", paper: "#fff" },
                text: { primary: "#000" },
              }
            : {
                background: { default: "#121212", paper: "#1d1d1d" },
                text: { primary: "#fff" },
              }),
        },
    });
    
    return(
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <IndexLayoutUser/>
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}