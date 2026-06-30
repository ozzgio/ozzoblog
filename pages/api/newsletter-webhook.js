import crypto from "crypto";

// Disable body parsing so we can read the raw bytes for HMAC verification.
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function verifySignature(rawBody, secret, header) {
  // Buttondown sends the header as "sha256=<hex>"; strip the prefix before comparing.
  const sig = header?.startsWith("sha256=") ? header.slice(7) : (header ?? "");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const rawBody = await readRawBody(req);

  // Verify Buttondown HMAC signature when the secret is configured.
  const secret = process.env.BUTTONDOWN_WEBHOOK_SECRET;
  if (secret) {
    const sig =
      req.headers["x-buttondown-signature"] ??
      req.headers["x-buttondown-signature-v1"];
    if (!verifySignature(rawBody, secret, sig)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

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
