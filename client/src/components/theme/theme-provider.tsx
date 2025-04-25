"use client";

import {
  createTheme,
  lighten,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import { colors, themeOptions } from "./palette";
import "@fontsource/inter";

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
        },
        colorSchemes: { light: true, dark: true },
        ...themeOptions,
        typography: {
          fontFamily: "Inter, Arial, sans-serif",
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                variants: [
                  {
                    style: {
                      backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
                    },
                  },
                ],
              }),
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                "&.menuSelected:before": {
                  display: "block",
                  width: "5px",
                  left: "-8px",
                  content: '""',
                  height: "100%",
                  position: "absolute",
                  background: lighten(colors.primary, 0.7),
                  borderRadius: "0 5px 5px 0",
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                "&.menuCollapser": {
                  padding: 0,
                  background: lighten(colors.primary, 0.7),
                  color: colors.primary,

                  "&:hover": {
                    background: lighten(colors.primary, 0.5),
                  },
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              h1: {
                fontWeight: 300,
                fontSize: "3em",
                letterSpacing: "-2px",
              },
            },
          },
        },
      }),
    []
  );

  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}

export default ThemeProvider;
