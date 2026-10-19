import { HStack, Icon, Box } from "@chakra-ui/react";
import { LuStar } from "react-icons/lu";

const RatingStar = ({ rating, max = 5, ...props }) => {
  const value = typeof rating === "string" ? parseFloat(rating) : rating;
  return (
    <HStack gap={0.25} alignItems="center" {...props}>
      {Array.from({ length: max }).map((_, i) => {
        if (i + 1 <= value) {
          return (
            <Icon key={i} color="orange.400" boxSize={5} asChild>
              <LuStar fill="currentColor" />
            </Icon>
          );
        } else if (i < value && value < i + 1) {
          return (
            <Box key={i} position="relative" boxSize={5} display="inline-block">
              <Icon
                color="orange.400"
                boxSize={5}
                position="absolute"
                left={0}
                zIndex={1}
                style={{ clipPath: "inset(0 50% 0 0)" }}
                asChild
              >
                <LuStar fill="currentColor" />
              </Icon>
              <Icon
                color="gray.300"
                boxSize={5}
                position="absolute"
                left={0}
                zIndex={0}
                asChild
              >
                <LuStar fill="currentColor" />
              </Icon>
            </Box>
          );
        } else {
          return (
            <Icon key={i} color="gray.300" boxSize={5} asChild>
              <LuStar fill="currentColor" />
            </Icon>
          );
        }
      })}
    </HStack>
  );
};

export default RatingStar;
