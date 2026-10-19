import { Tag, Wrap, WrapItem, Image, Box } from "@chakra-ui/react";
import technologyData from "../libs/technologyData";

const TechStack = ({ stack }) => {
  const tagBgColor = "accent.subtle";
  const tagTextColor = "accent.link";

  if (!stack || stack.length === 0) {
    return null;
  }

  // Flatten all technologies from technologyData into a single array for easier lookup
  const allTechnologies = Object.values(technologyData).flatMap(
    (category) => category.technologies,
  );

  return (
    <Wrap gap={1} justify="flex-start">
      {stack.map((techName, idx) => {
        const tech = allTechnologies.find((t) => t.name === techName);
        return (
          <WrapItem key={idx}>
            <Tag.Root
              size="md"
              colorPalette="orange"
              bg={tagBgColor}
              color={tagTextColor}
              borderRadius="full"
              px={3}
              py={1}
              fontWeight="semibold"
            >
              {tech?.image && (
                <Box mr={2} display="flex" alignItems="center">
                  <Image src={tech.image} alt={tech.name} boxSize="16px" />
                </Box>
              )}
              {techName}
            </Tag.Root>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default TechStack;
