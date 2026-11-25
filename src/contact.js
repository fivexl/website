// Contact form (/contact/ and /retainer/) -> Attio.
//
// The page POSTs the form to /api/contact. The Worker:
// 1. checks the Cloudflare Turnstile token (when TURNSTILE_SECRET_KEY is set),
// 2. finds the person in Attio by email, or creates them,
// 3. adds the project description as a note on the person,
// 4. adds the person to the Attio list ATTIO_LIST (when set), once.
//
// Secrets (dashboard > Runtime variables and secrets, type Secret):
//   ATTIO_API_KEY         Attio access token with read-write access to People, Notes and Lists.
//   TURNSTILE_SECRET_KEY  Secret key of the Turnstile widget whose site key is in config.toml.
// Errors the visitor can fix come back as { error }; for the rest (empty error) the page shows its own
// message with the site's email address.
// Variable (wrangler.toml [vars]):
//   ATTIO_LIST            Slug or ID of the Attio list new leads go to, e.g. "inbound_leads".

const ATTIO_API = "https://api.attio.com/v2";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 200;
const MAX_DESCRIPTION = 5000;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function verifyTurnstile(env, token, ip) {
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

async function attio(env, method, path, body) {
  const res = await fetch(`${ATTIO_API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${env.ATTIO_API_KEY}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Logged for `wrangler tail` / Workers logs; the visitor only sees a generic message.
    console.error("Attio", method, path, res.status, JSON.stringify(data).slice(0, 500));
    throw new Error(`Attio ${res.status}`);
  }
  return data;
}

// Attio's Name attribute from the form's Full name. Attio shows it as one Name field, but its API
// needs the first and last parts too: "Ada King Lovelace" -> first "Ada", last "King Lovelace".
function personalName(fullName) {
  const [first, ...rest] = fullName.split(" ");
  return [{ first_name: first, last_name: rest.join(" "), full_name: fullName }];
}

// Find the person by email, or create them. An existing person's name is only filled in when
// Attio has none, so a typo in the form never overwrites what the team has entered.
async function findOrCreatePerson(env, email, fullName) {
  const found = await attio(env, "POST", "/objects/people/records/query", {
    filter: { email_addresses: email },
    limit: 1,
  });
  const person = found.data && found.data[0];

  if (person) {
    const id = person.id.record_id;
    const currentName = person.values && person.values.name && person.values.name[0];
    if (!(currentName && currentName.full_name)) {
      await attio(env, "PATCH", `/objects/people/records/${id}`, { data: { values: { name: personalName(fullName) } } });
    }
    return id;
  }

  const values = { email_addresses: [email], name: personalName(fullName) };
  const created = await attio(env, "POST", "/objects/people/records", { data: { values } });
  return created.data.id.record_id;
}

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

    await attio(env, "POST", "/notes", {
      data: {
        parent_object: "people",
        parent_record_id: recordId,
        title: `Website contact form${page ? ` (${page})` : ""}`,
        format: "plaintext",
        content: description,
      },
    });

    if (env.ATTIO_LIST) {
      // PUT asserts the entry: the person is added once, and a repeat submission doesn't duplicate it.
      await attio(env, "PUT", `/lists/${encodeURIComponent(env.ATTIO_LIST)}/entries`, {
        data: { parent_record_id: recordId, parent_object: "people", entry_values: {} },
      });
    }
  } catch {
    return json(502, { error: "" });
  }

  return json(200, { ok: true });
}

export async function handleContactRequest(request, env, url) {
  if (url.pathname === "/api/contact") return handleContact(request, env);
  return null;
}
