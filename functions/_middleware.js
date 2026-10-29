// Routes projects.tanmoybh.com/<slug>/* to the Cloudflare Pages project that
// hosts that app, so each app keeps its own repo and deploy pipeline.
// Everything else falls through to the hub page in public/.
//
// To add an app: deploy it to its own Pages project, add its slug here and
// add a card to public/index.html. The app must use relative asset paths
// (for Vite: base: './').
const APPS = {
  bobia: 'https://tanmoybh-bobia.pages.dev',
  'nature-risk': 'https://tanmoybh-nature-risk.pages.dev',
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const [, slug, ...rest] = url.pathname.split('/');
  const origin = APPS[slug];
  if (!origin) return context.next();

  // Relative asset paths only resolve correctly under a trailing slash.
  if (rest.length === 0) {
    url.pathname = `/${slug}/`;
    return Response.redirect(url.toString(), 301);
  }

  const upstream = new URL(`/${rest.join('/')}${url.search}`, origin);
  const res = await fetch(new Request(upstream, context.request));

  // Keep upstream redirects inside /<slug>/ instead of leaking the pages.dev host.
  const location = res.headers.get('Location');
  if (location) {
    const target = new URL(location, upstream);
    if (target.origin === origin) {
      const headers = new Headers(res.headers);
      headers.set('Location', `/${slug}${target.pathname}${target.search}`);
      return new Response(res.body, { status: res.status, headers });
    }
  }
  return res;
}
