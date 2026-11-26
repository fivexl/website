// Helpers shared by the website's form endpoints (src/contact.js, src/subscribe.js):
// JSON replies, the Turnstile check, and Attio people records.

const ATTIO_API = "https://api.attio.com/v2";

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

// Attio's Name attribute from a form's Full name. Attio shows it as one Name field, but its API
// needs the first and last parts too: "Ada King Lovelace" -> first "Ada", last "King Lovelace".
export function personalName(fullName) {
  const [first, ...rest] = fullName.split(" ");
  return [{ first_name: first, last_name: rest.join(" "), full_name: fullName }];
}

// Find the person by email, or create them. A name (optional) is only filled in when Attio has
// none, so a typo in a form never overwrites what the team has entered.
export async function findOrCreatePerson(env, email, fullName) {
  const found = await attio(env, "find", "POST", "/objects/people/records/query", {
    filter: { email_addresses: email },
    limit: 1,
  });
  const person = found.data && found.data[0];

  if (person) {
    const id = person.id.record_id;
    const currentName = person.values && person.values.name && person.values.name[0];
    if (fullName && !(currentName && currentName.full_name)) {
      await attio(env, "name", "PATCH", `/objects/people/records/${id}`, { data: { values: { name: personalName(fullName) } } });
    }
    return id;
  }

  const values = { email_addresses: [email] };
  if (fullName) values.name = personalName(fullName);
  const created = await attio(env, "create", "POST", "/objects/people/records", { data: { values } });
  return created.data.id.record_id;
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
