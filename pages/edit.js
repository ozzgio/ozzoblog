import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  List,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Layout from "../components/layouts/layout";
import Section from "../components/section";
import YoutubeEmbed from "../components/youtube-embed";

// Before/after demos shown as proof. Add each new public demo here.
const DEMOS = [
  {
    url: "https://youtube.com/shorts/ARvYoVf_r6E",
    title: "Shop promo: edit from a seller's own screenshots",
  },
];

const QUESTIONS = [
  {
    name: "channel",
    label: "Your channel or podcast URL",
    type: "url",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    name: "episodes",
    label: "How many episodes do you publish a week?",
    placeholder: "1",
  },
  {
    name: "trigger",
    label: "Why now?",
    textarea: true,
    placeholder:
      "A missed upload, a backlog, an editor who left, a sponsor deadline…",
  },
  {
    name: "footage",
    label: "Link to the raw footage",
    type: "url",
    placeholder: "Google Drive, Dropbox or WeTransfer link",
  },
  {
    name: "publishBy",
    label: "When do you want it out?",
    placeholder: "Thursday 26 Nov",
  },
];

const EMPTY = {
  name: "",
  email: "",
  channel: "",
  episodes: "",
  trigger: "",
  footage: "",
  publishBy: "",
  website: "",
};

const Edit = () => {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const { utm_source = "", utm_medium = "" } = router.query;
      const response = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consent,
          utmSource: String(utm_source),
          utmMedium: String(utm_medium),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(body.error || "Request failed, try again");
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <Layout
      title="Free sample edit"
      description="Send one raw episode. Get it back edited, with captions and motion graphics, within 48 hours. Free."
      path="/edit"
    >
      <Container maxW="container.md">
        <Section delay={0.1}>
          <VStack gap={10} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" variant="page-title" mb={4}>
                Record Monday. Publish Thursday.
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="2xl" mx="auto" mb={6}>
                Send me one raw episode. I&apos;ll send it back edited (cuts,
                captions, motion graphics, clean sound) within 48 hours. Free,
                and you keep it either way.
              </Text>
              <Button colorPalette="orange" size="lg" minH="52px" asChild>
                <a href="#request">Get my free sample edit</a>
              </Button>
              <Text fontSize="sm" color="fg.muted" mt={2}>
                No call. 5 questions and a link to your footage.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3}>
                Every missed upload, the audience drifts.
              </Heading>
              <Text>
                You&apos;re editing at midnight to keep a streak alive, or
                waiting on a freelancer who went quiet again.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3}>
                What you get
              </Heading>
              <List.Root ps={5} gap={1}>
                <List.Item>
                  One episode (or a 10-minute section of it) edited
                  publish-ready, 16:9
                </List.Item>
                <List.Item>1 captioned clip cut from it</List.Item>
                <List.Item>
                  Delivered within 48 hours of your footage link, as a download
                  link
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={3}>
                The work, not claims
              </Heading>
              <Text mb={4}>
                No testimonials yet, so here are before/after demos instead.
                I&apos;m taking on my first creators and want real episodes to
                show. I&apos;ll ask before I show yours anywhere.
              </Text>
              {DEMOS.map((demo) => (
                <YoutubeEmbed
                  key={demo.url}
                  url={demo.url}
                  title={demo.title}
                />
              ))}
            </Box>

            <Box
              id="request"
              bg="bg.panel"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p={{ base: 4, md: 8 }}
            >
              {status === "sent" ? (
                <Box role="status" textAlign="center">
                  <Heading as="h2" size="lg" mb={2}>
                    Got it.
                  </Heading>
                  <Text>
                    I&apos;ll check your footage link and email you within a
                    day. The 48 hours start once the footage works.
                  </Text>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack gap={4}>
                    <Heading as="h2" size="lg">
                      Get my free sample edit
                    </Heading>
                    <Box asChild>
                      <label>
                        <Text fontWeight="medium" mb={1}>
                          Your name
                        </Text>
                        <Input
                          required
                          value={form.name}
                          onChange={set("name")}
                          autoComplete="name"
                        />
                      </label>
                    </Box>
                    <Box asChild>
                      <label>
                        <Text fontWeight="medium" mb={1}>
                          Email
                        </Text>
                        <Input
                          required
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          autoComplete="email"
                        />
                      </label>
                    </Box>
                    {QUESTIONS.map((q, i) => (
                      <Box key={q.name} asChild>
                        <label>
                          <Text fontWeight="medium" mb={1}>
                            {i + 1}. {q.label}
                          </Text>
                          {q.textarea ? (
                            <Textarea
                              required
                              rows={3}
                              value={form[q.name]}
                              onChange={set(q.name)}
                              placeholder={q.placeholder}
                            />
                          ) : (
                            <Input
                              required
                              type={q.type || "text"}
                              value={form[q.name]}
                              onChange={set(q.name)}
                              placeholder={q.placeholder}
                            />
                          )}
                        </label>
                      </Box>
                    ))}
                    {/* Honeypot: hidden from people, filled by bots. */}
                    <Box position="absolute" left="-9999px" aria-hidden="true">
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={set("website")}
                        name="website"
                      />
                    </Box>
                    <Box
                      as="label"
                      display="flex"
                      gap={2}
                      alignItems="flex-start"
                      fontSize="sm"
                    >
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        style={{ marginTop: 4 }}
                      />
                      <span>
                        Email me about my sample edit. Unsubscribe anytime. I
                        agree to the{" "}
                        <a
                          href="#terms"
                          style={{ textDecoration: "underline" }}
                        >
                          terms and privacy note
                        </a>
                        .
                      </span>
                    </Box>
                    <Button
                      type="submit"
                      colorPalette="orange"
                      size="lg"
                      minH="52px"
                      disabled={status === "loading"}
                    >
                      {status === "loading"
                        ? "Sending…"
                        : "Get my free sample edit"}
                    </Button>
                    {status === "error" && (
                      <Text role="alert" fontSize="sm" color="status.error">
                        {error}
                      </Text>
                    )}
                  </Stack>
                </form>
              )}
            </Box>

            <Box id="terms" fontSize="sm" color="fg.muted">
              <Heading as="h2" size="md" mb={2} color="fg">
                Terms and privacy
              </Heading>
              <List.Root as="ol" ps={5} gap={1}>
                <List.Item>
                  The sample edit is free. You owe nothing and you keep the
                  edit.
                </List.Item>
                <List.Item>
                  Delivery is within 48 hours of a working footage link. If the
                  link doesn&apos;t work or the footage is incomplete, the clock
                  starts when it does.
                </List.Item>
                <List.Item>
                  You keep all rights to your footage and the edit, and you
                  confirm you have the right to send me the footage, including
                  music and people in it.
                </List.Item>
                <List.Item>
                  I won&apos;t publish or show your edit anywhere without your
                  written yes.
                </List.Item>
                <List.Item>
                  I keep your name, email, channel, answers and footage link
                  only to deliver the edit and email you about it. I delete
                  them, and your footage, 12 months after our last contact or
                  sooner if you ask. This page has no analytics or tracking
                  cookies.
                </List.Item>
              </List.Root>
              <Text mt={3}>Giorgio Ozzola, Italy.</Text>
            </Box>
          </VStack>
        </Section>
      </Container>
    </Layout>
  );
};

export default Edit;
