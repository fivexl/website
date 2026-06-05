const PERMANENT_REDIRECTS = new Map([
  ["/blog/overture-case-study/", "/case-studies/ovrture-case-study/"],
  ["/blog/qameta-case-study-/", "/case-studies/qameta-case-study/"],
  ["/blog/qameta-case-study/", "/case-studies/qameta-case-study/"],
  ["/blog/new-stream-case-study/", "/case-studies/new-stream-case-study/"],
  ["/blog/firi-case-study/", "/case-studies/firi-case-study/"],
  ["/blog/ovrture-case-study/", "/case-studies/ovrture-case-study/"],
  ["/tags/ecs-service-conncet/", "/tags/ecs-service-connect/"],
  ["/tags/", "/blog/"],
]);

const GONE_PATHS = new Set([
  "/blog/mvp-on-aws-part-1-duplicate/",
  "/blog/mvp-on-aws-part-1-duplicate-2/",
  "/hello-world/",
]);

function withOriginalQuery(targetPath, requestUrl) {
  const target = new URL(targetPath, requestUrl.origin);
  target.search = requestUrl.search;
  return target.toString();
}

function permanentRedirect(targetPath, requestUrl) {
  return Response.redirect(withOriginalQuery(targetPath, requestUrl), 301);
}

async function gone(env, request) {
  const notFoundUrl = new URL("/404.html", request.url);
  const response = await env.ASSETS.fetch(new Request(notFoundUrl.toString(), {
    headers: request.headers,
    method: "GET",
  }));
  return new Response(response.body, {
    status: 410,
    statusText: "Gone",
    headers: response.headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.fivexl.io") {
      url.hostname = "fivexl.io";
      return Response.redirect(url.toString(), 301);
    }

    const redirectTarget = PERMANENT_REDIRECTS.get(url.pathname);
    if (redirectTarget) {
      return permanentRedirect(redirectTarget, url);
    }

    if (url.pathname.startsWith("/author/")) {
      return permanentRedirect(url.pathname.replace(/^\/author\//, "/specialist/"), url);
    }

    if (GONE_PATHS.has(url.pathname)) {
      return gone(env, request);
    }

    return env.ASSETS.fetch(request);
  },
};
