"use client";
import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import { RoleEnum } from "@/services/api/types/role";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useTranslation } from "@/services/i18n/client";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SellIcon from "@mui/icons-material/Sell";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { darken, SxProps, Theme, useColorScheme } from "@mui/material/styles";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import LogoIcon from "./icons/LogoIcon";
import Importer from "./importer";

const NavigationTypes = ["section", "link", "icon", "theme"] as const;
type NavigationType = (typeof NavigationTypes)[number];

type Navigation = {
  type: NavigationType;
  title: string;
  path?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

type ResponsiveAppBarProps = {
  children?: ReactNode;
};

const buttonStyles = (collapse: boolean): SxProps<Theme> => ({
  color: (theme) => theme.palette.primary.contrastText,
  my: 1,
  textTransform: "none",
  display: "flex",
  flexDirection: "row",
  gap: 1,
  minWidth: 0,
  justifyContent: collapse ? "center" : "flex-start",
  ":hover": {
    background: (theme) => darken(theme.palette.primary.light, 0.2),
  },
});

const menuStyles: SxProps<Theme> = {
  textTransform: "uppercase",
  fontSize: "0.8em",
  color: (theme) => theme.palette.primary.contrastText,
  ":not(:first-of-type)": {
    mt: 3,
  },
};

const ResponsiveAppLayout: FC<ResponsiveAppBarProps> = ({ children }) => {
  const { t } = useTranslation("common");
  const { colorScheme, setMode } = useColorScheme();
  const router = useRouter();
  const segment = useSelectedLayoutSegment() || "";
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();

  const [collapse, setCollapse] = useState(false);

  const isAdmin =
    !!user?.role && [RoleEnum.ADMIN].includes(Number(user?.role?.id));

  const topNavigation: Navigation[] = [
    {
      type: "section",
      title: t("common:navigation.header.sections"),
    },
    {
      type: "link",
      title: t("common:navigation.dashboard"),
      path: "/",
      icon: <DashboardIcon />,
    },
    ...((!!user
      ? [
          {
            type: "link",
            title: t("common:navigation.transactions"),
            path: "/transactions",
            icon: <AccountBalanceIcon />,
          },
          {
            type: "link",
            title: t("common:navigation.categories"),
            path: "/categories",
            icon: <SellIcon />,
          },
        ]
      : []) as Navigation[]),

    ...((isAdmin
      ? [
          {
            type: "section",
            title: t("common:navigation.header.admin"),
          },
          {
            type: "link",
            title: t("common:navigation.users"),
            path: "/admin-panel/users",
            icon: <PeopleAltIcon />,
          },
        ]
      : []) as Navigation[]),
  ];

  const footerNavigation: Navigation[] = [
    {
      type: "icon",
      title: t("common:navigation.theme"),
      icon: (
        <>
          {colorScheme === "light" && <LightModeIcon />}
          {colorScheme === "dark" && <DarkModeIcon />}
        </>
      ),
      onClick: () => setMode(colorScheme === "light" ? "dark" : "light"),
    },
    ...((!!user
      ? [
          {
            type: "icon",
            title: t("common:navigation.profile"),
            path: "/profile",
            icon: (
              <Avatar
                alt={user?.firstName + " " + user?.lastName}
                src={user.photo?.path}
              />
            ),
          },
          {
            type: "icon",
            title: t("common:navigation.logout"),
            onClick: logOut,
            icon: <LogoutIcon />,
          },
        ]
      : []) as Navigation[]),
  ];

  const renderNavigation = (item: Navigation, index: number) => {
    const isSelected = () => {
      if (item.path === "/" && item.path === `/${segment}`) {
        return true;
      }
      if (segment !== "" && item.path?.indexOf(`/${segment}`) === 0) {
        return true;
      }
      return false;
    };
    switch (item.type) {
      case "link":
        return (
          <Button
            key={index}
            sx={buttonStyles(collapse)}
            component={Link}
            href={item.path}
            className={isSelected() ? "menuSelected" : ""}
          >
            {item.icon}
            <Collapse orientation="horizontal" in={!collapse}>
              <span>{item.title}</span>
            </Collapse>
          </Button>
        );
      case "section":
        return (
          <Collapse orientation="horizontal" in={!collapse} key={index}>
            <Typography sx={menuStyles}>{item.title}</Typography>
          </Collapse>
        );
      case "icon":
        if (!user) {
          return null;
        }
        return (
          <Box key={index}>
            <Tooltip title={item.title} placement="top" arrow>
              <IconButton
                onClick={() =>
                  item.onClick ? item.onClick() : router.push(item.path || "")
                }
                sx={buttonStyles(collapse)}
                data-testid="profile-menu-item"
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          </Box>
        );
      case "theme":
        return <ThemeSwitchButton key={index} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Grid2 container spacing={0} height="100vh">
        <Grid2
          sx={{ background: (theme) => theme.palette.primary.main }}
          m={1}
          p={1}
          borderRadius={2}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              height: "100%",
            }}
            position="relative"
          >
            <Grid2
              gap={1}
              display="flex"
              direction="row"
              alignItems="center"
              py={2}
              mb={2}
            >
              <LogoIcon
                color="var(--mui-palette-primary-contrastText)"
                size={48}
              />
              <Collapse orientation="horizontal" in={!collapse}>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    color: (theme) => theme.palette.primary.contrastText,
                    textDecoration: "none",
                  }}
                >
                  {t("common:app-name")}
                </Typography>
              </Collapse>
            </Grid2>
            <Box
              position="absolute"
              sx={{
                top: 60,
                right: -19,
              }}
            >
              <IconButton
                className="menuCollapser"
                onClick={() => setCollapse(!collapse)}
              >
                {collapse && <NavigateNextIcon />}
                {!collapse && <NavigateBeforeIcon />}
              </IconButton>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              flexGrow={1}
            >
              {isLoaded && (
                <>
                  <Box>{topNavigation.map(renderNavigation)}</Box>
                  <Box
                    key="navigation-footer"
                    sx={{
                      display: "flex",
                      flexDirection: collapse ? "column" : "row",
                      alignItems: "center",
                    }}
                  >
                    {footerNavigation.map(renderNavigation)}
                  </Box>
                </>
              )}
              {!isLoaded && (
                <CircularProgress
                  sx={{ color: (theme) => theme.palette.primary.contrastText }}
                />
              )}
            </Box>
          </Box>
        </Grid2>
        <Grid2
          size="grow"
          flexDirection="column"
          height="100vh"
          display="flex"
          py={2}
        >
          <Box flexGrow={1} overflow="auto">
            {children}
          </Box>
        </Grid2>
        <Importer />
      </Grid2>
    </>
  );
};
export default ResponsiveAppLayout;
