import Logo from "./logo";
import LinkItem from "./linkitem";
import NextLink from "next/link";
import {
  Container,
  Box,
  HStack,
  Flex,
  Menu,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import ThemeToggleButton from "./themebutton";

const links = [
  ["/articles", "Articles"],
  ["/books", "Books"],
  ["/projects", "Projects"],
  ["/contacts", "Contacts"],
  ["/about", "About"],
];

const NavBar = ({ path }) => (
  <Box
    as="nav"
    aria-label="Main navigation"
    position="fixed"
    w="100%"
    zIndex={10}
    top={0}
    left={0}
    bg="rgba(247, 245, 242, 0.88)"
    _dark={{ bg: "rgba(26, 26, 30, 0.88)" }}
    backdropFilter="blur(16px)"
    borderBottomWidth="1px"
    borderColor="border"
  >
    <Container maxW="64rem" px={{ base: 4, md: 6 }} py={3}>
      <Flex align="center" justify="space-between" gap={2}>
        <Logo />
        <HStack display={{ base: "none", md: "flex" }} gap={0}>
          {links.map(([href, label]) => (
            <LinkItem
              key={href}
              href={href}
              path={path}
              target={href.startsWith("https:") ? "_blank" : undefined}
            >
              {label}
            </LinkItem>
          ))}
        </HStack>
        <HStack gap={2}>
          <ThemeToggleButton />
          <Box display={{ base: "block", md: "none" }}>
            <Menu.Root lazyMount unmountOnExit id="navbar-menu">
              <Menu.Trigger asChild>
                <IconButton
                  variant="ghost"
                  aria-label="Options"
                  colorPalette="orange"
                  minH="44px"
                  minW="44px"
                >
                  <LuMenu />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content bg="bg.panel" borderColor="border" minW="200px">
                    {links.map(([href, label]) => (
                      <Menu.Item
                        key={href}
                        value={href}
                        asChild
                        minH="44px"
                        color={path.startsWith(href) ? "fg" : "fg.muted"}
                      >
                        <NextLink
                          href={href}
                          target={
                            href.startsWith("https:") ? "_blank" : undefined
                          }
                          rel={
                            href.startsWith("https:")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {label}
                        </NextLink>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Box>
        </HStack>
      </Flex>
    </Container>
  </Box>
);

export default NavBar;
