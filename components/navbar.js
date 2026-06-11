import { forwardRef } from "react";
import Logo from "./logo";
import LinkItem from "./linkitem";
import NextLink from "next/link";
import {
  Container,
  Box,
  Stack,
  Heading,
  Link,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ThemeToggleButton from "./themebutton";

const MenuLink = forwardRef((props, ref) => (
  <Link ref={ref} as={NextLink} {...props} />
));

const NavBar = (props) => {
  const { path } = props;
  const navBg = useColorModeValue(
    "rgba(247, 245, 242, 0.75)",
    "rgba(18, 18, 22, 0.65)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");
  const menuItemActiveColor = useColorModeValue("gray.900", "white");
  const menuItemInactiveColor = useColorModeValue("gray.600", "gray.300");
  const menuItemHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={navBg}
      style={{ 
        backdropFilter: "blur(16px) saturate(180%)", 
        WebkitBackdropFilter: "blur(16px) saturate(180%)" 
      }}
      zIndex={10}
      top={0}
      left={0}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      boxShadow={useColorModeValue(
        "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)"
      )}
      transition="all 0.2s ease-in-out"
      {...props}
    >
      <Container
        maxW="container.md"
        px={{ base: 4, md: 6 }}
        py={3}
      >
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={2}
        >
          <Flex align="center" flexShrink={0}>
            <Heading as="p" size="lg" letterSpacing={"tighter"}>
              <Logo />
            </Heading>
          </Flex>
          <Stack
            direction="row"
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            flexGrow={1}
            spacing={1}
            mx={4}
          >
            <LinkItem href="/articles" path={path}>
              Articles
            </LinkItem>
            <LinkItem href="/books" path={path}>
              Books
            </LinkItem>
            <LinkItem href="/projects" path={path}>
              Projects
            </LinkItem>
            <LinkItem href="/contacts" path={path}>
              Contacts
            </LinkItem>
            <LinkItem
              target="_blank"
              href="https://github.com/ozzgio/portfolio"
              path={path}
              display="inline-flex"
              alignItems="center"
              style={{ gap: 4 }}
              pl={2}
            >
              Source Code
            </LinkItem>
          </Stack>
          <Flex align="center" gap={2} flexShrink={0}>
            <ThemeToggleButton />
            <Box display={{ base: "inline-block", md: "none" }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="ghost"
                aria-label="Options"
                colorScheme="orange"
                _hover={{
                  bg: useColorModeValue("orange.50", "orange.800"),
                }}
                _active={{
                  bg: useColorModeValue("orange.100", "orange.700"),
                }}
              />
              <MenuList
                bg={menuBg}
                borderColor={borderColor}
                boxShadow="lg"
              >
                <MenuItem
                  as={MenuLink}
                  href="/articles"
                  bg="transparent"
                  color={path === "/articles" ? menuItemActiveColor : menuItemInactiveColor}
                  fontWeight={path === "/articles" ? "semibold" : "normal"}
                  _hover={{ bg: menuItemHoverBg, color: menuItemActiveColor }}
                >
                  Articles
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  href="/books"
                  bg="transparent"
                  color={path === "/books" ? menuItemActiveColor : menuItemInactiveColor}
                  fontWeight={path === "/books" ? "semibold" : "normal"}
                  _hover={{ bg: menuItemHoverBg, color: menuItemActiveColor }}
                >
                  Books
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  href="/projects"
                  bg="transparent"
                  color={path === "/projects" ? menuItemActiveColor : menuItemInactiveColor}
                  fontWeight={path === "/projects" ? "semibold" : "normal"}
                  _hover={{ bg: menuItemHoverBg, color: menuItemActiveColor }}
                >
                  Projects
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  href="/contacts"
                  bg="transparent"
                  color={path === "/contacts" ? menuItemActiveColor : menuItemInactiveColor}
                  fontWeight={path === "/contacts" ? "semibold" : "normal"}
                  _hover={{
                    bg: menuItemHoverBg,
                    color: menuItemActiveColor,
                  }}
                >
                  Contacts
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  href="https://github.com/ozzgio/portfolio/"
                  bg="transparent"
                  color={menuItemInactiveColor}
                  _hover={{ bg: menuItemHoverBg, color: menuItemActiveColor }}
                >
                  Source Code
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
