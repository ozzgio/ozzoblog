// Disable body parsing so we can read the raw bytes for JSON parsing.
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  // Authenticate via a shared secret in the URL query string.
  // Buttondown's signing-key feature is not usable via their API,
  // so we embed the secret in the webhook URL instead and check it here.
  // Fail closed: missing env var = reject, not skip, to prevent an
  // unconfigured deployment from becoming an open email/job trigger.
  const secret = process.env.BUTTONDOWN_WEBHOOK_SECRET;
  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rawBody = await readRawBody(req);

  let body;
  try {
    body = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Only act on opt-in confirmations; silently ack everything else.
  // Buttondown's event for a confirmed subscription is subscriber.confirmed,
  // and subscriber fields live under data, not payload.
  if (body?.event_type !== "subscriber.confirmed") {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const email = body?.data?.email_address;
  if (!email) {
    return res.status(400).json({ error: "Missing email in payload" });
  }

  const n8nUrl = process.env.N8N_NEWSLETTER_WEBHOOK_URL;
  if (!n8nUrl) {
    console.error("N8N_NEWSLETTER_WEBHOOK_URL is not set");
    return res.status(500).json({ error: "Relay not configured" });
  }

  try {
    const relay = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        subscriber_id: body.data?.id ?? null,
      }),
    });

    if (!relay.ok) {
      console.error("n8n relay returned", relay.status);
      return res.status(502).json({ error: "Relay failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Failed to reach n8n:", err);
    return res.status(502).json({ error: "Relay failed" });
  }
}
