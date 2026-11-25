// Sign-ups (newsletter now; webinar and guide downloads next) -> Brevo and Attio.
//
// The page POSTs the form to /api/subscribe with a `source`. The Worker:
// 1. checks the Cloudflare Turnstile token (when TURNSTILE_SECRET_KEY is set) and the honeypot,
// 2. adds or updates the contact in Brevo and puts them on the source's Brevo list
//    (Brevo is for marketing emails and campaigns),
// 3. finds or creates the person in Attio and sets the source's attributes on them, e.g.
//    Newsletter subscribed (checkbox) and Newsletter subscribed at (date of this sign-up).
//    Attio is for sales. If Attio fails, the sign-up still counts: the error is only logged.
//
// Secrets (dashboard > Runtime variables and secrets, type Secret):
//   BREVO_API_KEY         Brevo API key with Contacts read/write.
//   ATTIO_API_KEY         The same Attio key as the contact form.
//   TURNSTILE_SECRET_KEY  The same Turnstile secret as the contact form.
// Variables (wrangler.toml [vars]):
//   BREVO_NEWSLETTER_LIST ID of the Brevo newsletter list (Contacts > Lists, e.g. 2).

import { EMAIL_PATTERN, json, verifyTurnstile, serviceError, attio, findOrCreatePerson } from "./form_api.js";

const BREVO_API = "https://api.brevo.com/v3";

// One entry per kind of sign-up. `list` is the Brevo list ID; `attio(today)` gives the values set on
// the person in Attio (People > Attributes; the slugs must match).
function sources(env) {
  return {
    newsletter: {
      list: Number(env.BREVO_NEWSLETTER_LIST),
      attio: (today) => ({ newsletter_subscribed: true, newsletter_subscribed_at: today }),
    },
  };
}

// Create the contact in Brevo, or update an existing one, and add them to the list.
async function brevoSubscribe(env, email, listId) {
  const path = "/contacts";
  const res = await fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    // emailBlacklisted: false lifts the block Brevo keeps after an earlier unsubscribe: the person has
    // just ticked the consent box again, and without this they would be on the list but get nothing.
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true, emailBlacklisted: false }),
  });
  if (res.ok) return; // 201 created, 204 updated
  const data = await res.json().catch(() => ({}));
  throw serviceError("Brevo", "brevo", "POST", path, res.status, data);
}

async function handleSubscribe(request, env) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  const form = await request.formData().catch(() => null);
  if (!form) return json(400, { error: "Invalid request" });

  // Honeypot: a field people never see. Bots that fill it get a normal-looking reply and nothing is saved.
  if (String(form.get("website") || "").trim()) return json(200, { ok: true });

  const source = sources(env)[String(form.get("source") || "")];
  if (!source) return json(400, { error: "Invalid request" });
  if (!env.BREVO_API_KEY || !source.list) return json(503, { error: "" });

  const email = String(form.get("email") || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return json(400, { error: "Please enter a valid email address." });
  if (form.get("consent") !== "1") return json(400, { error: "Please tick the box to confirm you want the newsletter." });

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(env, String(form.get("cf-turnstile-response") || ""), request.headers.get("cf-connecting-ip"));
    if (!ok) return json(400, { error: "We couldn't verify you're not a bot. Please try again." });
  }

  // Brevo first: that is the subscription itself, so a failure there is shown to the visitor.
  try {
    await brevoSubscribe(env, email, source.list);
  } catch (err) {
    console.error("Subscribe", err && err.stack);
    return json(502, { error: "", ref: (err && err.ref) || "worker" });
  }

  // Attio for sales: logged if it fails, but the visitor is subscribed either way.
  if (env.ATTIO_API_KEY) {
    try {
      const recordId = await findOrCreatePerson(env, email, "");
      // The date is the latest sign-up through our form (YYYY-MM-DD, UTC).
      const today = new Date().toISOString().slice(0, 10);
      await attio(env, "attributes", "PATCH", `/objects/people/records/${recordId}`, { data: { values: source.attio(today) } });
    } catch (err) {
      console.error("Subscribe: Attio failed, Brevo succeeded", err && (err.ref || err.stack));
    }
  }

  return json(200, { ok: true });
}

export async function handleSubscribeRequest(request, env, url) {
  if (url.pathname === "/api/subscribe") return handleSubscribe(request, env);
  return null;
}
