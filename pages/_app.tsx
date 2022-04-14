import "../styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { darkTheme } from "../themes";
import { UIProvider } from "../context/ui";
import { USERProvider } from "../context/user";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <USERProvider>
      <UIProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </UIProvider>
    </USERProvider>
  );
}

export default MyApp;
