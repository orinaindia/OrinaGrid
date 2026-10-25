# Orina Grid website

The public site for Orina Grid: rooftop solar through one partner in each district (homes, housing
societies, businesses), and the partnership for solar installers. Next.js 16 (App Router, TypeScript),
Tailwind 4, GSAP with ScrollTrigger and SplitText, and Lenis for smooth scrolling.

## Run it

```sh
pnpm install
pnpm dev --port 3100
```

| Script        | What it does                                                    |
| ------------- | --------------------------------------------------------------- |
| `pnpm build`  | Production build                                                |
| `pnpm lint`   | ESLint                                                          |
| `pnpm format` | Prettier (same settings as OrinaFrontend)                       |
| `pnpm geo`    | Rebuild `src/data` (states, districts, PIN codes)               |
| `pnpm images` | Make any missing photograph in `src/assets/photos` with MiniMax |

## Environment (`.env.local`, never committed)

| Variable               | Needed for                                                                        |
| ---------------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Links in the sitemap, robots and share cards. Defaults to `http://localhost:3100` |
| `GRID_WEBHOOK_URL`     | Survey requests: Orina Grid's `POST /api/v1/webhooks/orina/campaign-leads`        |
| `GRID_WEBHOOK_SECRET`  | The bearer secret for that webhook                                                |
| `PARTNER_WEBHOOK_URL`  | Partner applications (no endpoint in Grid yet)                                    |
| `MINIMAX_API_KEY`      | `pnpm images` only                                                                |

Until a webhook is set, its form says it could not send and gives the phone number. It never shows a
false "sent".

## Deploy on Vercel

1. Import this repository in Vercel. It reads `vercel.json`: pnpm, `pnpm build`, and functions in Mumbai
   (`bom1`), next to Orina Grid's database.
2. Add the environment variables above under Project Settings → Environment Variables
   (`NEXT_PUBLIC_SITE_URL` is the site's own address, for example `https://grid.orina.in`).
3. Deploy. Every page is prerendered; only `/api/enquiry` and `/api/pin/[pin]` run as functions.

Vercel's free Hobby plan is for personal, non-commercial projects only. A business site belongs on Pro.

### Built for traffic

- Every page is static HTML, served from the CDN. Functions run only for a form being sent and a PIN
  being looked up (and `/api/pin` answers are cached for a day by browsers and a week by the CDN).
- Photos are static imports: content-hashed URLs, cached for good, with blur placeholders; optimised
  sizes are kept for 31 days, and only five widths are made (`next.config.ts`).
- The enquiry popup and its form load after the page; the mono font is not preloaded.
- `/api/enquiry` reads at most 8 KB, limits each address to 8 tries in 10 minutes, and keeps that memory
  bounded. The limit is per server instance: put Vercel's firewall rate limiting in front for more.
- Security headers on every response (no framing, no sniffing, HSTS); no `x-powered-by`.

## How a survey request travels

1. The form (the popup, `/contact`, `/find-a-partner`, the end of most pages) asks for the PIN code (it
   finds the district), the kind of place, the bill (if they give it), a name and a mobile.
2. `/api/enquiry` checks it again, makes sure the PIN is in the chosen district, drops bots (a hidden
   field) and limits each address to 8 tries in 10 minutes.
3. It sends Grid a campaign lead (`campaign: "Website"`). Grid finds the district from the PIN and gives the
   lead to that district's partner, and there to the salesperson with the fewest open leads.

## Sources

- **PIN codes, districts, states:** India Post's All India Pincode Directory, from data.gov.in, under the
  Government Open Data Licence – India. `pnpm geo` reads the same CSV Orina Grid imports
  (`../OrinaBackend/data/pincodes.csv`).
- **Photographs:** made with MiniMax `image-01` (`scripts/generate-images.mjs`), in `src/assets/photos`. None of them shows a
  real Orina Grid installation, and the site does not say they do. Replace them with partners' own photos
  as those come in.
- **Logo:** the Orina Grid lockup from `OrinaFrontend/public/assets/logo` (see its `LOGO-USAGE.md`).
