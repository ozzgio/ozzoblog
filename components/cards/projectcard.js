import { Box, Text, Tag, Wrap, WrapItem } from "@chakra-ui/react";
import NextLink from "next/link";
import BaseCard from "../basecard";
import Image from "next/image";

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

const ProjectCard = ({
  children,
  id,
  title,
  thumbnail,
  stack,
  date,
  compact = false,
}) => {
  const tagBgColor = "accent.subtle";
  const tagTextColor = "accent.link";
  const headingTextColor = "fg";
  const bodyTextColor = "fg.muted";
  const dateColor = "fg.muted";
  const thumbBg = "bg.subtle";

  return (
    <NextLink href={`/projects/${id}`} passHref scroll={false}>
      <BaseCard
        p={0}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        textAlign="center"
        role="group"
        h="100%"
      >
        <Box
          w="100%"
          h={compact ? "90px" : undefined}
          aspectRatio={compact ? undefined : 16 / 9}
          position="relative"
          bg={thumbBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          p={compact ? 2 : 4}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={/\.(png|svg|gif)$/i.test(thumbnail ?? "")}
          />
        </Box>
        <Box p={compact ? 3 : 5} flex={1} display="flex" flexDirection="column">
          <Text
            fontSize={compact ? "sm" : ["lg", "xl"]}
            fontWeight="bold"
            color={headingTextColor}
            mb={1}
            lineHeight="tight"
          >
            {title}
          </Text>
          {date && (
            <Text
              fontSize="xs"
              color={dateColor}
              mb={compact ? 2 : 3}
              fontWeight="medium"
            >
              {formatDate(date)}
            </Text>
          )}
          <Text
            fontSize="xs"
            color={bodyTextColor}
            mb={compact ? 2 : 4}
            textAlign="left"
            flex={1}
            lineHeight="tall"
            lineClamp={compact ? 3 : undefined}
          >
            {children}
          </Text>
          {stack && stack.length > 0 && (
            <Wrap gap={1} mt="auto" justify="flex-start">
              {(compact ? stack.slice(0, 3) : stack).map((tag, idx) => (
                <WrapItem key={idx}>
                  <Tag.Root
                    size="sm"
                    colorPalette="orange"
                    bg={tagBgColor}
                    color={tagTextColor}
                    borderRadius="full"
                    px={compact ? 2 : 3}
                    py={1}
                    fontWeight="semibold"
                    fontSize={compact ? "10px" : undefined}
                  >
                    {tag}
                  </Tag.Root>
                </WrapItem>
              ))}
              {compact && stack.length > 3 && (
                <WrapItem>
                  <Text fontSize="10px" color={dateColor} alignSelf="center">
                    +{stack.length - 3}
                  </Text>
                </WrapItem>
              )}
            </Wrap>
          )}
        </Box>
      </BaseCard>
    </NextLink>
  );
};

export default ProjectCard;
