import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const NewsletterSubscribe = (props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);

  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  // red.500 is 3.79:1 against the light page bg and 4.21:1 against the dark
  // bg -- both fail WCAG AA (4.5:1). Same fix pattern already used for
  // orange.500 in pages/articles/[slug].js.
  const errorColor = useColorModeValue("red.600", "red.300");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === STATUS.LOADING) return;

    setStatus(STATUS.LOADING);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      setStatus(STATUS.SUCCESS);
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  if (status === STATUS.SUCCESS) {
    return (
      <Box
        borderTopWidth="1px"
        borderTopColor={borderColor}
        pt={8}
        mt={8}
        {...props}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="orange.700"
          _dark={{ color: "orange.300" }}
        >
          You&apos;re in. First article lands in your inbox Sunday.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      borderTopWidth="1px"
      borderTopColor={borderColor}
      pt={8}
      mt={8}
      {...props}
    >
      <Text fontSize="sm" color={mutedText} mb={3}>
        Weekly articles on building systems for autonomy. No noise.
      </Text>
      <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          isDisabled={status === STATUS.LOADING}
          size="md"
          maxW={{ base: "100%", sm: "320px" }}
        />
        <Button
          type="submit"
          colorScheme="orange"
          isDisabled={status === STATUS.LOADING}
          size="md"
          flexShrink={0}
        >
          {status === STATUS.LOADING ? "Subscribing…" : "Subscribe"}
        </Button>
      </Stack>
      {status === STATUS.ERROR && (
        <Text fontSize="sm" color={errorColor} mt={2}>
          Something went wrong. Try again.
        </Text>
      )}
    </Box>
  );
};

export default NewsletterSubscribe;
