import { ThemeOptions } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const colors = {
  primary: "#0097a7",
  secondary: "#ff4081",
  error: "#f44336",
  warning: "#ff9800",
  section: grey[200],
};

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
  },
};
