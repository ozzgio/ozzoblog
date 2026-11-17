// Forwards free-sample-edit requests from /edit to the n8n webhook on the NUC.
// The webhook URL and secret stay server-side; missing config fails closed.
const FIELDS = {
  name: 100,
  email: 200,
  channel: 300,
  episodes: 50,
  trigger: 1000,
  footage: 1000,
  publishBy: 100,
  utmSource: 50,
  utmMedium: 50,
};

const isUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export function validate(body) {
  const data = {};
  for (const [key, max] of Object.entries(FIELDS)) {
    const value = typeof body?.[key] === "string" ? body[key].trim() : "";
    if (value.length > max) return { error: `${key} is too long` };
    data[key] = value;
  }
  if (!data.name || !data.trigger || !data.episodes || !data.publishBy) {
    return { error: "Please answer every question" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { error: "Email is not valid" };
  }
  if (!isUrl(data.channel) || !isUrl(data.footage)) {
    return { error: "Channel and footage must be links (https://…)" };
  }
  if (body?.consent !== true) return { error: "Consent is required" };
  return { data };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Honeypot: bots fill the hidden field; pretend success and drop it.
  if (req.body?.website) return res.status(200).json({ ok: true });

  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ error });

  const url = process.env.N8N_SAMPLE_WEBHOOK_URL;
  const secret = process.env.N8N_SAMPLE_WEBHOOK_SECRET;
  if (!url || !secret) {
    return res.status(503).json({ error: "Requests are closed right now" });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sample-Secret": secret,
      },
      body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`n8n ${response.status}`);
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Request failed, try again" });
  }
}
