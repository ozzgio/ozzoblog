import {
  Box,
  Text,
  Tag,
  Wrap,
  WrapItem,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NextLink from "next/link";
import BaseCard from "../basecard";
import Image from "next/image";

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

const ProjectCard = ({ children, id, title, thumbnail, stack, date, compact = false }) => {
  const tagBgColor = useColorModeValue("tagBg.default", "tagBg._dark");
  const tagTextColor = useColorModeValue("tagText.default", "tagText._dark");
  const { colors } = useTheme();
  const headingTextColor = useColorModeValue(
    colors.headingText.default,
    colors.headingText._dark
  );
  const bodyTextColor = useColorModeValue(
    colors.bodyText.default,
    colors.bodyText._dark
  );
  const dateColor = useColorModeValue("gray.500", "gray.400");
  const thumbBg = useColorModeValue("gray.50", "gray.700");

  return (
    <NextLink href={`/projects/${id}`} passHref scroll={false}>
      <BaseCard
        p={0}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        textAlign="center"
        role="group"
        tabIndex={0}
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
            <Text fontSize="xs" color={dateColor} mb={compact ? 2 : 3} fontWeight="medium">
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
            noOfLines={compact ? 3 : undefined}
          >
            {children}
          </Text>
          {stack && stack.length > 0 && (
            <Wrap spacing={1} mt="auto" justify="flex-start">
              {(compact ? stack.slice(0, 3) : stack).map((tag, idx) => (
                <WrapItem key={idx}>
                  <Tag
                    size="sm"
                    colorScheme="orange"
                    bg={tagBgColor}
                    color={tagTextColor}
                    borderRadius="full"
                    px={compact ? 2 : 3}
                    py={1}
                    fontWeight="semibold"
                    fontSize={compact ? "10px" : undefined}
                  >
                    {tag}
                  </Tag>
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
