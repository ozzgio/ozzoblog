import { ClientOnly, IconButton } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { LuMoon, LuSun } from "react-icons/lu";

const ThemeToggleButton = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle theme"
      variant="ghost"
      colorPalette="orange"
      onClick={toggleColorMode}
      minH="44px"
      minW="44px"
    >
      <ClientOnly fallback={<LuMoon />}>
        {() => (colorMode === "light" ? <LuMoon /> : <LuSun />)}
      </ClientOnly>
    </IconButton>
  );
};

export default ThemeToggleButton;
