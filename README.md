# Let's build a store

A single-page website for ecommerce design and development services. The site includes the agency introduction, approach, services, and an email contact link. The illustrated storefront is a concept; this project does not process orders or payments.

## Local development

Use Node.js 22.13 or newer (Node 22 is used in CI) and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by the development server.

```sh
npm run check          # Lint, TypeScript, and formatting
npm run build          # Generate the static site
npm run verify:export  # Check exported assets and links
```

`npm run format` applies the project's formatting rules. `npm start` runs the existing Cloudflare Worker preview after a build; production static hosts only need `dist/client`.

## Cloudflare Pages

This repository is prepared for Cloudflare Pages' Git integration. It produces a static export in `dist/client`; it does not need a Worker, database, or build secrets. The old GitHub Pages deployment workflow and `CNAME` file are not used.

When connecting the repository in Cloudflare, use these build settings:

| Setting | Value |
| --- | --- |
| Git repository | `letsbuildastore/landingpage` |
| Production branch | `main` |
| Root directory | `/` (repository root) |
| Build command | `npm run check && npm run build && npm run verify:export` |
| Build output directory | `dist/client` |
| Node.js | `22.13.0` (pinned in `.node-version`) |
| `NEXT_PUBLIC_BASE_PATH` | Leave unset for the custom domain root |

In **Workers & Pages**, create a **Pages** project, connect the GitHub repository, and enter the settings above. Do not use the stock Next.js output directory: this project uses Vinext's static export and writes to `dist/client`.

After the first deployment succeeds, open the project's **Custom domains** settings and add `letsbuilda.store`. Because this is an apex domain, the `letsbuilda.store` zone must be active in the same Cloudflare account. If Cloudflare asks you to change nameservers, use the nameservers Cloudflare provides at the domain registrar. Complete domain setup from the Pages dashboard so Cloudflare can attach the hostname and create its DNS record. Keep existing mail-related DNS records when making DNS changes.

GitHub Actions checks and verifies the root-path static export on pull requests and pushes to `main`. Cloudflare Pages Git integration deploys production from `main` and creates preview deployments for other branches.

## Other static hosting

- Install command: `npm ci`
- Build command: `npm run check && npm run build && npm run verify:export`
- Publish directory: `dist/client`
- No runtime server, database, or environment secrets are needed.
- Keep `NEXT_PUBLIC_BASE_PATH` unset for a domain-root deployment.
- For a subdirectory, set `NEXT_PUBLIC_BASE_PATH=/your-path` during both build and verification. Use a leading slash and no trailing slash.

The existing `.openai/hosting.json` and Vite configuration retain compatibility with Sites/Cloudflare. Do not publish the repository root or `dist/server` as static content.

## Project files

- `app/page.tsx`: page content, navigation, and contact address.
- `app/layout.tsx`: document metadata and favicon.
- `app/globals.css`: site theme and responsive styles.
- `lib/site.ts`: build-time prefix for public asset URLs.
- `public/`: favicon, responsive WebP images, and the original PNG.
- `components/ui/`: shared component library retained for future work.
- `.github/workflows/check.yml`: pull-request and main-branch checks for the static export.
- `scripts/verify-export.mjs`: static deployment smoke checks.
- `scripts/prepare-export.mjs`: automatically normalizes Vinext's prefixed asset directories after each build so repository-hosted assets resolve correctly.

The current single-page site uses fragment navigation. Its hosting prefix is applied to framework assets and public images rather than the prerendered route; this avoids Vinext's repository-path export issue. Revisit route handling if adding additional pages or client-side router navigation.

The responsive hero images are pre-generated and committed, so CI needs no image conversion service. Keep the source PNG as the original asset. If replacing the hero, provide WebP variants at 480, 960, and 1448 pixels wide and update its alternative text.

## Lint decisions

The UI library retains valid ARIA group, region, and disabled-link patterns; the semantic-tag preference rule is disabled only for that library. Input-group addons offer optional click-to-focus behavior; keyboard users can focus the actual input normally, so the two click-handler rules are disabled only for that wrapper. Labels and pagination explicitly forward their accessible content and associations.

The homepage intentionally uses a native responsive image with optimized, pre-generated WebP assets. The Next.js image-component rule is disabled only on that page because the static site has no image optimization server. Other lint checks remain enabled.
