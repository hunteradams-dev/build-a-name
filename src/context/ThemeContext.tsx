import {
  createContext,
  useState,
  useMemo,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  type PaletteMode,
  CssBaseline,
} from "@mui/material";

const THEME_COLORS = {
  light: {
    primary: "#5e35b1", // Deep Purple
    secondary: "#d81b60", // Pink
    background: "#f3e5f5", // Very light purple
    paper: "#ffffff",
    switchThumb: "#4caf50",
    switchTrack: "#4caf50",
  },
  dark: {
    primary: "#e0e1dd", // Light Purple
    secondary: "#f48fb1", // Light Pink
    background: "#0d1b2a",
    paper: "#1b263b",
    switchThumb: "#8888f3ff",
    switchTrack: "#444b92ff",
  },
};

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      return savedMode as PaletteMode;
    }
    return prefersDarkMode ? "dark" : "light";
  });

  useEffect(() => {
    if (!localStorage.getItem("themeMode")) {
      setMode(prefersDarkMode ? "dark" : "light");
    }
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // palette values for light mode
                primary: {
                  main: THEME_COLORS.light.primary,
                },
                secondary: {
                  main: THEME_COLORS.light.secondary,
                },
                background: {
                  default: THEME_COLORS.light.background,
                  paper: THEME_COLORS.light.paper,
                },
              }
            : {
                // palette values for dark mode
                primary: {
                  main: THEME_COLORS.dark.primary,
                },
                secondary: {
                  main: THEME_COLORS.dark.secondary,
                },
                background: {
                  default: THEME_COLORS.dark.background,
                  paper: THEME_COLORS.dark.paper,
                },
              }),
        },
        components: {
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                "&.Mui-checked": {
                  color:
                    mode === "light"
                      ? THEME_COLORS.light.switchThumb
                      : THEME_COLORS.dark.switchThumb,
                },
                "&.Mui-checked + .MuiSwitch-track": {
                  backgroundColor:
                    mode === "light"
                      ? THEME_COLORS.light.switchTrack
                      : THEME_COLORS.dark.switchTrack,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
