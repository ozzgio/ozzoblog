import { Text } from "@chakra-ui/react";

const Paragraph = ({ children, ...props }) => (
  <Text textAlign="left" fontSize="1.125rem" lineHeight="1.7" {...props}>
    {children}
  </Text>
);

export default Paragraph;
