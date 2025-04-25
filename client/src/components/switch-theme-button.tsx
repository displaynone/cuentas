import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

const ThemeSwitchButton = () => {
  const { colorScheme, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => {
        setMode(colorScheme === "light" ? "dark" : "light");
      }}
    >
      {colorScheme === "light" && <LightModeIcon />}
      {colorScheme === "dark" && <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeSwitchButton;
