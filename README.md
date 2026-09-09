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

## GitHub Pages

The repository includes a Pages deployment workflow and pull-request checks. No GitHub remote was configured when this setup was prepared.

1. Create a GitHub repository and push this project with `main` as the default branch.
2. In the repository's **Settings → Pages**, select **GitHub Actions** as the source.
3. Run **Deploy to GitHub Pages** from the Actions tab, or push a change to `main`.
4. The deployment job reports the published URL.

The workflow installs dependencies from the lockfile, checks the source, exports the site, verifies its assets, and uploads only `dist/client`. Deployment uses the built-in GitHub token. Configure Pages before running the workflow; its configuration step reads the existing Pages settings.

The workflow reads the base path from Pages automatically. This supports repository sites such as `https://username.github.io/repository/`, account sites, and custom domains. If you add or change a custom domain in Pages settings, run the workflow again so asset paths are rebuilt for that URL. The workflow deploys only `main`; update both branch conditions in `.github/workflows/pages.yml` if your default branch differs.

Pull requests run the checks and export verification for both `/` and `/preview` without publishing.

See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for repository availability, permissions, and publishing settings.

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
- `scripts/verify-export.mjs`: static deployment smoke checks.
- `scripts/prepare-export.mjs`: automatically normalizes Vinext's prefixed asset directories after each build so repository-hosted assets resolve correctly.

The current single-page site uses fragment navigation. Its hosting prefix is applied to framework assets and public images rather than the prerendered route; this avoids Vinext's repository-path export issue. Revisit route handling if adding additional pages or client-side router navigation.

The responsive hero images are pre-generated and committed, so CI needs no image conversion service. Keep the source PNG as the original asset. If replacing the hero, provide WebP variants at 480, 960, and 1448 pixels wide and update its alternative text.

## Lint decisions

The UI library retains valid ARIA group, region, and disabled-link patterns; the semantic-tag preference rule is disabled only for that library. Input-group addons offer optional click-to-focus behavior; keyboard users can focus the actual input normally, so the two click-handler rules are disabled only for that wrapper. Labels and pagination explicitly forward their accessible content and associations.

The homepage intentionally uses a native responsive image with optimized, pre-generated WebP assets. The Next.js image-component rule is disabled only on that page because the static site has no image optimization server. Other lint checks remain enabled.
