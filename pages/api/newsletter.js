// Proxies subscriber signups to Buttondown so BUTTONDOWN_API_KEY stays
// server-side — Next.js only inlines NEXT_PUBLIC_-prefixed env vars into the
// browser bundle, and this key must never reach the client.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch(
      "https://api.buttondown.email/v1/subscribers",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address: email, tags: ["ozzo-blog"] }),
      },
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Subscription failed" });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Subscription failed" });
  }
}
