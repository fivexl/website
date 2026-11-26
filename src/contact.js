// Contact form (/contact/ and /retainer/) -> Attio.
//
// The page POSTs the form to /api/contact. The Worker:
// 1. checks the Cloudflare Turnstile token (when TURNSTILE_SECRET_KEY is set),
// 2. finds the person in Attio by email, or creates them,
// 3. adds the project description as a note on the person,
// 4. adds the person to the Attio list ATTIO_LIST (when set), once, filling the list's
//    project_description and source_page columns.
//
// Secrets (dashboard > Runtime variables and secrets, type Secret):
//   ATTIO_API_KEY         Attio access token with read-write access to People, Notes and Lists.
//   TURNSTILE_SECRET_KEY  Secret key of the Turnstile widget whose site key is in config.toml.
// Errors the visitor can fix come back as { error }; for the rest (empty error) the page shows its own
// message with the site's email address.
// Variable (wrangler.toml [vars]):
//   ATTIO_LIST            Slug or ID of the Attio list new leads go to ("inbound": the Inbound Leads list).

import { EMAIL_PATTERN, json, verifyTurnstile, findOrCreatePerson, addNote, assertListEntry } from "./form_api.js";

const MAX_NAME = 200;
const MAX_DESCRIPTION = 5000;

async function handleContact(request, env) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!env.ATTIO_API_KEY) return json(503, { error: "" });

  const form = await request.formData().catch(() => null);
  if (!form) return json(400, { error: "Invalid request" });

  // Honeypot: a field people never see. Bots that fill it get a normal-looking reply and nothing is saved.
  if (String(form.get("website") || "").trim()) return json(200, { ok: true });

  const fullName = String(form.get("full_name") || "").trim().replace(/\s+/g, " ");
  const email = String(form.get("email") || "").trim().toLowerCase();
  const description = String(form.get("project_description") || "").trim();
  const page = String(form.get("page") || "").slice(0, 200);

  if (!EMAIL_PATTERN.test(email) || email.length > 254) return json(400, { error: "Please enter a valid email address." });
  if (!fullName) return json(400, { error: "Please enter your full name." });
  if (!description) return json(400, { error: "Please describe your project." });
  if (fullName.length > MAX_NAME || description.length > MAX_DESCRIPTION) return json(400, { error: "That text is too long." });

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(env, String(form.get("cf-turnstile-response") || ""), request.headers.get("cf-connecting-ip"));
    if (!ok) return json(400, { error: "We couldn't verify you're not a bot. Please try again." });
  }

  try {
    const recordId = await findOrCreatePerson(env, email, fullName);

    await addNote(env, recordId, `Website contact form${page ? ` (${page})` : ""}`, description);

    if (env.ATTIO_LIST) {
      // The list's own columns (Inbound Leads > Attributes). A repeat submission updates them to the latest.
      const entryValues = { project_description: description };
      if (page) entryValues.source_page = page;
      await assertListEntry(env, env.ATTIO_LIST, recordId, entryValues);
    }
  } catch (err) {
    console.error("Contact form", err && err.stack);
    return json(502, { error: "", ref: (err && err.ref) || "worker" });
  }

  return json(200, { ok: true });
}

export async function handleContactRequest(request, env, url) {
  if (url.pathname === "/api/contact") return handleContact(request, env);
  return null;
}
