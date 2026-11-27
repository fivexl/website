// Webinar forms -> Attio and Brevo: registration for an upcoming webinar, and the recording of a past one.
//
// Registration (kind "registration", the default): the form still goes to the webinar's Brevo form first,
// so Brevo keeps sending its confirmation email. Once Brevo accepts it, the page POSTs the same details here.
// Recording (kind "recording"): on a past webinar, people give their name and email to get the recording.
// This endpoint returns the link, and the page shows it with Watch and Copy buttons.
//
// The Worker:
// 1. checks the Cloudflare Turnstile token (when TURNSTILE_SECRET_KEY is set) and the honeypot,
// 2. looks up the webinar in /webinars/index.json, which Hugo builds from the webinar pages
//    (webinar_name, event_date, recording_url), so a new webinar needs no code changes,
// 3. Brevo: adds the contact to the shared webinar list (BREVO_WEBINAR_LIST) with FIRSTNAME, LASTNAME, the UTM
//    tags and WEBINAR_NAME + WEBINAR_DATE (registration) or WEBINAR_RECORDING (recording); these text
//    attributes hold the latest webinar. Also adds them to the newsletter list if they ticked the box,
// 4. Attio: finds or creates the person by email and sets
//      Webinar name (multi-select)       registration: this webinar is added to the ones they registered for,
//      Webinar date (date)               registration: the date of the latest webinar they registered for,
//      Webinar recordings (multi-select) recording: this webinar is added to the recordings they asked for,
//      Newsletter subscribed / Newsletter subscribed at, if they ticked the newsletter box,
// 5. adds a note with the date, page, UTM tags and newsletter choice.
// Failures in steps 3-5 are only logged: a registration is already in Brevo, and a recording request still
// gets its link.
//
// Attio (People > Attributes): webinar_name and webinar_recordings (multi-select), webinar_date (date).
// The Worker adds each webinar as an option of those multi-selects the first time it is needed; that needs
// the Attio key to have Object Configuration set to read-write. Without it, add the options in Attio by hand.
// Secrets: ATTIO_API_KEY, TURNSTILE_SECRET_KEY, BREVO_API_KEY. Variables: BREVO_NEWSLETTER_LIST, BREVO_WEBINAR_LIST.
// Brevo (Contacts > Settings > attributes, type Text): WEBINAR_NAME, WEBINAR_RECORDING; WEBINAR_DATE (Date).

import { EMAIL_PATTERN, json, verifyTurnstile, attio, brevoUpsert, findOrCreatePersonRecord, addNote, addToMultiselect } from "./form_api.js";

const NAME_ATTRIBUTE = "webinar_name";
const DATE_ATTRIBUTE = "webinar_date";
const RECORDINGS_ATTRIBUTE = "webinar_recordings";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
const MAX_FIELD = 200;

// The webinars Hugo published: { "/webinars/aws-agentcore/": { name, date, recording_url }, ... }
async function webinars(env, request) {
  const res = await env.ASSETS.fetch(new Request(new URL("/webinars/index.json", request.url)));
  if (!res.ok) throw new Error(`webinars/index.json ${res.status}`);
  return res.json();
}

function field(form, name) {
  return String(form.get(name) || "").trim().replace(/\s+/g, " ").slice(0, MAX_FIELD);
}

async function handleWebinar(request, env) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  const form = await request.formData().catch(() => null);
  if (!form) return json(400, { error: "Invalid request" });

  // Honeypot: a field people never see. Bots that fill it get a normal-looking reply and nothing is saved.
  if (field(form, "website")) return json(200, { ok: true });

  const recording = form.get("kind") === "recording";
  const email = field(form, "email").toLowerCase();
  const first = field(form, "first_name");
  const last = field(form, "last_name");
  const page = field(form, "page");
  const newsletter = form.get("newsletter") === "1";
  if (!EMAIL_PATTERN.test(email)) return json(400, { error: "Please enter a valid email address." });
  if (recording) {
    if (!first || !last) return json(400, { error: "Please enter your first and last name." });
    if (form.get("consent") !== "1") return json(400, { error: "Please accept the Privacy Policy." });
  }
  if (!recording && !env.ATTIO_API_KEY) return json(503, { error: "" });

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(env, String(form.get("cf-turnstile-response") || ""), request.headers.get("cf-connecting-ip"));
    if (!ok) return json(400, { error: "We couldn't verify you're not a bot. Please try again." });
  }

  let webinar;
  try {
    webinar = (await webinars(env, request))[page];
  } catch (err) {
    console.error("Webinar: list of webinars", err && err.stack);
    return json(502, { error: "", ref: "webinars" });
  }
  if (!webinar || !webinar.name) return json(400, { error: "Unknown webinar" });
  if (recording && !webinar.recording_url) return json(400, { error: "Unknown webinar" });

  // Brevo first, so Attio only says subscribed when Brevo has them on the newsletter list.
  // Everyone goes on the shared webinar list (BREVO_WEBINAR_LIST) with the webinar's name, and on the
  // newsletter list too if they ticked the box.
  const newsletterList = Number(env.BREVO_NEWSLETTER_LIST);
  const webinarList = Number(env.BREVO_WEBINAR_LIST);
  let subscribed = false;
  if (env.BREVO_API_KEY) {
    const listIds = [webinarList, newsletter && newsletterList].filter(Boolean);
    const attributes = { FIRSTNAME: first, LASTNAME: last };
    if (recording) attributes.WEBINAR_RECORDING = webinar.name;
    else Object.assign(attributes, { WEBINAR_NAME: webinar.name, WEBINAR_DATE: webinar.date || undefined });
    // Only the tags in this link, so a link without them doesn't clear what Brevo already has.
    for (const name of UTM_FIELDS) if (field(form, name)) attributes[name.toUpperCase()] = field(form, name);
    for (const key of Object.keys(attributes)) if (!attributes[key]) delete attributes[key];
    if (listIds.length) {
      try {
        await brevoUpsert(env, email, { listIds, attributes, resubscribe: newsletter });
        subscribed = newsletter && Boolean(newsletterList);
      } catch (err) {
        console.error("Webinar: Brevo", err && (err.ref || err.stack));
      }
    }
  }

  const done = recording ? json(200, { ok: true, url: webinar.recording_url }) : json(200, { ok: true });
  if (!env.ATTIO_API_KEY) return done;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  try {
    const fullName = [first, last].filter(Boolean).join(" ");
    const person = await findOrCreatePersonRecord(env, email, fullName, fullName ? { first, last } : undefined);
    const values = {};

    if (recording) {
      Object.assign(values, await addToMultiselect(env, person, RECORDINGS_ATTRIBUTE, webinar.name));
    } else {
      Object.assign(values, await addToMultiselect(env, person, NAME_ATTRIBUTE, webinar.name));
      // Keep the latest webinar's date, even if someone signs up for an earlier one afterwards.
      const currentDate = person.values[DATE_ATTRIBUTE] && person.values[DATE_ATTRIBUTE][0] && person.values[DATE_ATTRIBUTE][0].value;
      if (webinar.date && !(currentDate && currentDate >= webinar.date)) values[DATE_ATTRIBUTE] = webinar.date;
    }

    if (subscribed) Object.assign(values, { newsletter_subscribed: true, newsletter_subscribed_at: today });

    if (Object.keys(values).length) {
      await attio(env, "attributes", "PATCH", `/objects/people/records/${person.id}`, { data: { values } });
    }

    const utm = UTM_FIELDS.map((name) => [name, field(form, name)]).filter(([, value]) => value);
    const lines = [
      `Webinar: ${webinar.name}${webinar.date ? ` (${webinar.date})` : ""}`,
      `${recording ? "Recording requested" : "Registered"}: ${now.toISOString().slice(0, 16).replace("T", " ")} UTC`,
      `Source: https://fivexl.io${page}`,
      ...utm.map(([name, value]) => `${name}: ${value}`),
      `Newsletter: ${newsletter ? (subscribed ? "subscribed" : "ticked, but the Brevo subscription failed") : "not ticked"}`,
    ];
    const title = `${recording ? "Webinar recording requested" : "Webinar registration"}: ${webinar.name}`;
    await addNote(env, person.id, title, lines.join("\n"));
  } catch (err) {
    console.error("Webinar: Attio", err && (err.ref || err.stack));
    // The recording link is what the visitor asked for, so they get it even when Attio fails.
    if (!recording) return json(502, { error: "", ref: (err && err.ref) || "worker" });
  }

  return done;
}

export async function handleWebinarRequest(request, env, url) {
  if (url.pathname === "/api/webinar") return handleWebinar(request, env);
  return null;
}
