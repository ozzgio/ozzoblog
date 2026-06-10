import Link from "next/link";
import { Text, useColorModeValue } from "@chakra-ui/react";
import ZIcon from "./icons/icon";
import styled from "@emotion/styled";

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 30px;
  line-height: 1;
  padding: 8px 10px;

  img {
    transition: 200ms ease;
    flex-shrink: 0;
  }

  &:hover img {
    transform: rotate(30deg);
  }
`;

const Logo = () => {
  return (
    <Link href="/" scroll={false}>
      <LogoBox>
        <ZIcon />
        <Text
          color={useColorModeValue("gray.800", "whiteAlpha.900")}
          fontFamily="'Raleway', sans-serif"
          fontWeight="700"
          as="span"
          display="inline-flex"
          alignItems="baseline"
          gap={{ base: 1.5, md: 2 }}
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing="-0.04em"
          whiteSpace="nowrap"
        >
          <Text as="span" color={useColorModeValue("gray.900", "whiteAlpha.900")}>
            Ozzo
          </Text>
        </Text>
      </LogoBox>
    </Link>
  );
};
export default Logo;
