# Talk Feedback Worker

Cloudflare Worker that receives talk feedback submissions and stores them in a Notion database.

## Setup

```bash
cd worker
yarn install   # or npm install
wrangler login
```

## Configure secrets (one-time)

```bash
wrangler secret put NOTION_TOKEN
# paste the Notion integration token when prompted

wrangler secret put TURNSTILE_SECRET
# paste the Turnstile secret key when prompted
```

Get the Turnstile keys at https://dash.cloudflare.com → Turnstile → Add site.
You will receive:
- **Site key** (public) — goes in the frontend
- **Secret key** (private) — goes here

## Deploy

```bash
wrangler deploy
```

After deploy, copy the Worker URL (e.g. `https://tiagodanin-feedback.<account>.workers.dev`)
and set it in the frontend env: `NEXT_PUBLIC_FEEDBACK_API_URL`.

## Local dev

Create a `.dev.vars` file (gitignored) with the secrets:

```
NOTION_TOKEN=ntn_xxx
TURNSTILE_SECRET=0x4AAA...
```

Then:

```bash
yarn dev
```

## Endpoint

`POST /` — JSON body:

```json
{
  "talk": "Talk title",
  "ratings": {
    "geral": 5,
    "slides": 4,
    "fala": 5,
    "conteudo": 5,
    "aplicabilidade": 4
  },
  "liked": "optional",
  "improve": "optional",
  "suggestions": "optional",
  "email": "optional@example.com",
  "turnstileToken": "<from Turnstile widget>"
}
```

Responses:
- `200 { "ok": true }` — saved
- `400 { "error": "..." }` — invalid payload
- `403 { "error": "Captcha failed" }` — Turnstile rejected
- `502 { "error": "Failed to save feedback" }` — Notion API error
