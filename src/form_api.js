// Helpers shared by the website's form endpoints (src/contact.js, src/subscribe.js, src/webinar.js):
// JSON replies, the Turnstile check, Brevo contacts and Attio people records.

const ATTIO_API = "https://api.attio.com/v2";
const BREVO_API = "https://api.brevo.com/v3";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function verifyTurnstile(env, token, ip) {
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

// Errors carry a short `ref` for the visitor's error message (step, status and the service's
// error code, never a key), and the full reply goes to Workers Logs.
export function serviceError(service, step, method, path, status, data) {
  console.error(service, step, method, path, status, JSON.stringify(data).slice(0, 500));
  const error = new Error(`${service} ${status}`);
  error.ref = [step, status, data && data.code].filter(Boolean).join(" ");
  return error;
}

// `step` names the call in error references: find, create, name, note or list.
export async function attio(env, step, method, path, body) {
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
  if (!res.ok) throw serviceError("Attio", step, method, path, res.status, data);
  return data;
}

// Create the contact in Brevo, or update an existing one, and add them to the list.
// Used for newsletter consent, so it also lifts an earlier unsubscribe (see brevoUpsert).
export async function brevoSubscribe(env, email, listId) {
  return brevoUpsert(env, email, { listIds: [listId], resubscribe: true });
}

// Create or update a Brevo contact: add them to `listIds` and set `attributes` (e.g. FIRSTNAME, LASTNAME).
// resubscribe: true sets emailBlacklisted: false, which lifts the block Brevo keeps after an earlier
// unsubscribe. Only for someone who has just ticked a newsletter consent box: without it they would be
// on the list but get nothing. Never for other sign-ups, so an unsubscribe stays an unsubscribe.
export async function brevoUpsert(env, email, { listIds = [], attributes, resubscribe = false } = {}) {
  const path = "/contacts";
  const body = { email, listIds, updateEnabled: true };
  if (attributes) body.attributes = attributes;
  if (resubscribe) body.emailBlacklisted = false;
  const res = await fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (res.ok) return; // 201 created, 204 updated
  const data = await res.json().catch(() => ({}));
  throw serviceError("Brevo", "brevo", "POST", path, res.status, data);
}

// Attio's Name attribute. Attio shows it as one Name field, but its API needs the first and last
// parts too. Forms with one Full name field are split at the first space:
// "Ada King Lovelace" -> first "Ada", last "King Lovelace". Forms with both fields pass them as `parts`.
export function personalName(fullName, parts) {
  if (parts) return [{ first_name: parts.first, last_name: parts.last, full_name: fullName }];
  const [first, ...rest] = fullName.split(" ");
  return [{ first_name: first, last_name: rest.join(" "), full_name: fullName }];
}

// Find the person by email, or create them. A name (optional) is only filled in when Attio has
// none, so a typo in a form never overwrites what the team has entered.
export async function findOrCreatePerson(env, email, fullName, parts) {
  return (await findOrCreatePersonRecord(env, email, fullName, parts)).id;
}

// The same, returning { id, values } so callers can read the person's current attribute values.
export async function findOrCreatePersonRecord(env, email, fullName, parts) {
  const found = await attio(env, "find", "POST", "/objects/people/records/query", {
    filter: { email_addresses: email },
    limit: 1,
  });
  const person = found.data && found.data[0];

  if (person) {
    const id = person.id.record_id;
    const currentName = person.values && person.values.name && person.values.name[0];
    if (fullName && !(currentName && currentName.full_name)) {
      await attio(env, "name", "PATCH", `/objects/people/records/${id}`, { data: { values: { name: personalName(fullName, parts) } } });
    }
    return { id, values: person.values || {} };
  }

  const values = { email_addresses: [email] };
  if (fullName) values.name = personalName(fullName, parts);
  const created = await attio(env, "create", "POST", "/objects/people/records", { data: { values } });
  return { id: created.data.id.record_id, values: created.data.values || {} };
}

export async function addNote(env, recordId, title, content) {
  return attio(env, "note", "POST", "/notes", {
    data: { parent_object: "people", parent_record_id: recordId, title, format: "plaintext", content },
  });
}

// Add the person to an Attio list once (PUT asserts the entry); `entryValues` fill the list's own
// columns, and a repeat submission updates them to the latest.
export async function assertListEntry(env, list, recordId, entryValues) {
  return attio(env, "list", "PUT", `/lists/${encodeURIComponent(list)}/entries`, {
    data: { parent_record_id: recordId, parent_object: "people", entry_values: entryValues || {} },
  });
}
