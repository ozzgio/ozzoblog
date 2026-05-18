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
    "rgba(255, 255, 255, 0.9)",
    "rgba(26, 26, 30, 0.9)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");
  const menuItemActiveBg = useColorModeValue("orange.50", "orange.900");
  const menuItemHoverBg = useColorModeValue("orange.50", "orange.800");
  
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
                  bg={path === "/articles" ? menuItemActiveBg : "transparent"}
                  color={path === "/articles" ? "orange.500" : "inherit"}
                  fontWeight={path === "/articles" ? "semibold" : "normal"}
                  _hover={{
                    bg: menuItemHoverBg,
                    color: "orange.500",
                  }}
                >
                  Articles
                </MenuItem>
                <MenuItem 
                  as={MenuLink} 
                  href="/books"
                  bg={path === "/books" ? menuItemActiveBg : "transparent"}
                  color={path === "/books" ? "orange.500" : "inherit"}
                  fontWeight={path === "/books" ? "semibold" : "normal"}
                  _hover={{
                    bg: menuItemHoverBg,
                    color: "orange.500",
                  }}
                >
                  Books
                </MenuItem>
                <MenuItem 
                  as={MenuLink} 
                  href="/projects"
                  bg={path === "/projects" ? menuItemActiveBg : "transparent"}
                  color={path === "/projects" ? "orange.500" : "inherit"}
                  fontWeight={path === "/projects" ? "semibold" : "normal"}
                  _hover={{
                    bg: menuItemHoverBg,
                    color: "orange.500",
                  }}
                >
                  Projects
                </MenuItem>
                <MenuItem 
                  as={MenuLink} 
                  href="/contacts"
                  bg={path === "/contacts" ? menuItemActiveBg : "transparent"}
                  color={path === "/contacts" ? "orange.500" : "inherit"}
                  fontWeight={path === "/contacts" ? "semibold" : "normal"}
                  _hover={{
                    bg: menuItemHoverBg,
                    color: "orange.500",
                  }}
                >
                  Contacts
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  href="https://github.com/ozzgio/portfolio/"
                _hover={{
                  bg: menuItemHoverBg,
                  color: "orange.500",
                }}
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
