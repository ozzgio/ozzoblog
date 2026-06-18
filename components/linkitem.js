import NextLink from "next/link";
import { useColorModeValue } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray.600", "gray.400");
  const activeColor = useColorModeValue("gray.900", "white");

  return (
    <Link
      as={NextLink}
      href={href}
      scroll={false}
      p={2}
      px={3}
      borderRadius="md"
      color={active ? activeColor : inactiveColor}
      target={target}
      position="relative"
      sx={{
        fontWeight: active ? "semibold" : "medium",
        transition: "color 0.15s ease-in-out, transform 0.15s ease-in-out",
        ...(active
          ? {
              _before: {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: "2px",
                bg: "orange.500",
                borderRadius: "full",
              },
            }
          : {}),
      }}
      _hover={{
        color: activeColor,
        textDecoration: "none",
        transform: "translateY(-1px)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkItem;
