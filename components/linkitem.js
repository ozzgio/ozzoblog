import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const LinkItem = ({ href, path, target, children, ...props }) => {
  const currentPath = path.split(/[?#]/)[0];
  const active = currentPath === href || currentPath.startsWith(`${href}/`);

  return (
    <Link
      p={2}
      px={3}
      minH="44px"
      display="inline-flex"
      alignItems="center"
      borderRadius="md"
      color={active ? "fg" : "fg.muted"}
      position="relative"
      css={{
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
        color: "fg",
        textDecoration: "none",
        transform: "translateY(-1px)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      {...props}
      asChild
    >
      <NextLink
        href={href}
        scroll={false}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </NextLink>
    </Link>
  );
};

export default LinkItem;
