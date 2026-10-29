# projects.tanmoybh.com

Hub for Tanmoy Bhattacharjee's personal projects.

- `public/index.html` – the hub page: one card per project
- `functions/_middleware.js` – routes `/<slug>/*` to the Cloudflare Pages project that hosts each app, so every app keeps its own repo and deploy pipeline

| Path | Repo | Pages project |
| --- | --- | --- |
| `/` | this repo | `tanmoybh-projects` |
| `/bobia/` | [tanmoy-bh/bobia](https://github.com/tanmoy-bh/bobia) | `tanmoybh-bobia` |

## Add a project

1. In the project's repo, deploy to its own Pages project (copy `bobia/.github/workflows/deploy-cloudflare.yml` and change `PROJECT_NAME`). Use relative asset paths; for Vite that is `base: './'`.
2. Add its slug and `https://<project>.pages.dev` origin to `APPS` in `functions/_middleware.js`.
3. Add a card to `public/index.html`.

## Run locally

```bash
npx wrangler pages dev public
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which deploys `public/` and `functions/` to Cloudflare Pages. It reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the `tanmoy-bh` organization secrets.
