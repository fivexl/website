// Email-gated PDF downloads for /resources/.
//
// The PDFs live in a private R2 bucket (binding RESOURCES_BUCKET) and have no public URL.
// 1. The page sends the form straight to Brevo, the same way as the webinar form.
// 2. When Brevo accepts it, the page POSTs to /api/resources/download, and the Worker returns
//    a signed link to /api/resources/file/<key> that expires after a few minutes.
// 3. That link streams the PDF from R2.
//
// Secret (Runtime variables and secrets): DOWNLOAD_SIGNING_KEY, a random string that signs the links.

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

async function handleDownloadRequest(request, env) {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!env.RESOURCES_BUCKET || !env.DOWNLOAD_SIGNING_KEY) {
    return json(503, { error: "Downloads are not configured" });
  }

  // The same fields the page has just sent to Brevo, plus the file name.
  const form = await request.formData().catch(() => null);
  if (!form) return json(400, { error: "Invalid request" });
  const email = String(form.get("EMAIL") || "").trim();
  const key = String(form.get("file") || "");

  if (!EMAIL_PATTERN.test(email) || email.length > 254) return json(400, { error: "Please enter a valid email address." });
  if (form.get("OPT_IN") !== "1") return json(400, { error: "Please accept the Privacy Policy." });
  if (!KEY_PATTERN.test(key) || key.includes("..")) return json(400, { error: "Unknown resource" });

  const head = await env.RESOURCES_BUCKET.head(key);
  if (!head) return json(404, { error: "Unknown resource" });

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
