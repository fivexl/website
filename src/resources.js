// Email-gated PDF downloads for /resources/.
//
// The PDFs live in a private R2 bucket (binding RESOURCES_BUCKET) and have no public URL.
// 1. The page POSTs the form to /api/resources/download.
// 2. The Worker checks the captcha, sends the contact to the Brevo form, and only if Brevo
//    accepts it returns a signed link to /api/resources/file/<key> that expires after a few minutes.
// 3. That link streams the PDF from R2.
//
// Configuration (wrangler.toml [vars] and secrets):
//   BREVO_FORM_ACTION     vars    Brevo form submit URL (the `action` of the Brevo embed form)
//   RESOURCE_FIELD        vars    Brevo hidden field / contact attribute for the resource, e.g. RESOURCE
//   DOWNLOAD_SIGNING_KEY  secret  Random string used to sign download links
//   TURNSTILE_SECRET      secret  Optional. Turnstile secret key; when set, the Worker checks the
//                                 captcha itself. When unset, the token is passed on to Brevo.

const LINK_TTL_SECONDS = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// R2 object keys we serve: a file name, optionally in folders, ending in .pdf
const KEY_PATTERN = /^[a-z0-9][a-z0-9._/-]*\.pdf$/i;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(env, key, expires) {
  const hmacKey = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(env.DOWNLOAD_SIGNING_KEY),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", hmacKey, new TextEncoder().encode(`${key}\n${expires}`));
  return base64url(mac);
}

// Constant-time string comparison, so the signature check leaks nothing through timing.
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyTurnstile(env, token, ip) {
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

// Same request Brevo's own embed script sends: the form action with ?isAjax=1, answered with JSON.
async function submitToBrevo(env, { firstName, lastName, email, resource, token }) {
  const body = new FormData();
  body.set("FIRSTNAME", firstName);
  body.set("LASTNAME", lastName);
  body.set("EMAIL", email);
  body.set("OPT_IN", "1");
  body.set(env.RESOURCE_FIELD || "RESOURCE", resource);
  body.set("email_address_check", "");
  body.set("locale", "en");
  // Without our own Turnstile secret, Brevo checks the captcha on its side.
  if (token && !env.TURNSTILE_SECRET) body.set("g-recaptcha-response", token);
  const res = await fetch(`${env.BREVO_FORM_ACTION}?isAjax=1`, { method: "POST", body });
  if (!res.ok) return false;
  const data = await res.json().catch(() => null);
  return Boolean(data) && data.success !== false;
}

async function handleDownloadRequest(request, env) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!env.RESOURCES_BUCKET || !env.BREVO_FORM_ACTION || !env.DOWNLOAD_SIGNING_KEY) {
    return json(503, { error: "Downloads are not configured" });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return json(400, { error: "Invalid request" });
  const firstName = String(form.get("first_name") || "").trim().slice(0, 100);
  const lastName = String(form.get("last_name") || "").trim().slice(0, 100);
  const email = String(form.get("email") || "").trim();
  const key = String(form.get("file") || "");
  const resource = String(form.get("resource") || "").slice(0, 200);
  const token = String(form.get("captcha") || "");

  if (!firstName || !lastName) return json(400, { error: "Please enter your first and last name." });
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return json(400, { error: "Please enter a valid email address." });
  if (form.get("consent") !== "1") return json(400, { error: "Please accept the Privacy Policy." });
  if (!KEY_PATTERN.test(key) || key.includes("..")) return json(400, { error: "Unknown resource" });

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(env, token, request.headers.get("cf-connecting-ip"));
    if (!ok) return json(403, { error: "The captcha check failed. Please try again." });
  }

  // Check the file exists before we put the contact in Brevo.
  const head = await env.RESOURCES_BUCKET.head(key);
  if (!head) return json(404, { error: "Unknown resource" });

  if (!(await submitToBrevo(env, { firstName, lastName, email, resource: resource || key, token }))) {
    return json(502, { error: "Something went wrong. Please try again." });
  }

  const expires = Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS;
  const sig = await sign(env, key, expires);
  const url = `/api/resources/file/${key.split("/").map(encodeURIComponent).join("/")}?exp=${expires}&sig=${sig}`;
  return json(200, { url });
}

async function handleFile(request, env, url) {
  if (!env.RESOURCES_BUCKET || !env.DOWNLOAD_SIGNING_KEY) return new Response("Not found", { status: 404 });

  const key = decodeURIComponent(url.pathname.slice("/api/resources/file/".length));
  const expires = Number(url.searchParams.get("exp"));
  const sig = url.searchParams.get("sig") || "";
  if (!KEY_PATTERN.test(key) || key.includes("..") || !Number.isInteger(expires)) {
    return new Response("Not found", { status: 404 });
  }
  if (expires < Date.now() / 1000 || !safeEqual(sig, await sign(env, key, expires))) {
    return new Response("This download link has expired. Please request the file again.", { status: 403 });
  }

  const object = await env.RESOURCES_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const filename = key.split("/").pop();
  return new Response(object.body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}

// Returns a Response for /api/resources/* requests, or null for everything else.
export async function handleResources(request, env, url) {
  if (url.pathname === "/api/resources/download") return handleDownloadRequest(request, env);
  if (url.pathname.startsWith("/api/resources/file/")) return handleFile(request, env, url);
  return null;
}
