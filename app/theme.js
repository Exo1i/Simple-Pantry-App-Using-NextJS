import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Ensure the default mode is dark
    primary: {
      main: "#0a2744",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1d1d1d", // Dark paper background
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
      color: "#ffffff",
    },
    h3: {
      color: "#ffffff",
    },
    body2: {
      color: "#b0b0b0",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d1d1d",
          color: "#ffffff",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
        },
      },
    },
  },
});

export default theme;
