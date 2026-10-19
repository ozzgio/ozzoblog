import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
};

const NewsletterSubscribe = (props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const router = useRouter();

  const mutedText = "fg.muted";
  const borderColor = "border";
  const errorColor = "status.error";

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

      router.push("/newsletter/pending");
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  return (
    <Box
      borderTopWidth="1px"
      borderTopColor={borderColor}
      pt={8}
      mt={8}
      containerType="inline-size"
      {...props}
      asChild
    >
      <form onSubmit={handleSubmit}>
        <Text fontSize="sm" color={mutedText} mb={3}>
          A weekly note on what I&apos;m building, reading, and learning.
        </Text>
        <Stack
          display="grid"
          gridTemplateColumns="minmax(0, 1fr)"
          gap={3}
          css={{
            "@container (min-width: 28rem)": {
              gridTemplateColumns: "minmax(0, 1fr) auto",
            },
          }}
        >
          <Input
            aria-label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === STATUS.LOADING}
            size="md"
            minH="44px"
            w="100%"
            minW={0}
          />
          <Button
            type="submit"
            colorPalette="gray"
            disabled={status === STATUS.LOADING}
            size="md"
            minH="44px"
            flexShrink={0}
          >
            {status === STATUS.LOADING ? "Subscribing…" : "Subscribe"}
          </Button>
        </Stack>
        {status === STATUS.ERROR && (
          <Text role="alert" fontSize="sm" color={errorColor} mt={2}>
            Something went wrong. Try again.
          </Text>
        )}
      </form>
    </Box>
  );
};

export default NewsletterSubscribe;
