import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggleButton = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle theme"
      colorScheme={colorMode === "light" ? "purple" : "orange"}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      size="lg"
    />
  );
};

export default ThemeToggleButton;
