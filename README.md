# gospeed

A Next.js App Router motorsport calculator platform: 36 functional tools, 30 focused technical guides and 10 configurable engineering reference tables. Built locally for `https://gospeedraceway.com`; no deployment has been performed.

## CI / CD

GitHub Actions validates pull requests and `main` with lint, TypeScript, unit tests, production builds and browser checks at three screen sizes. Successful `main` builds publish a tested Docker image to GitHub Container Registry. The VPS release targets `root@5.189.158.75:22`, waits for health checks and attempts rollback on failure. Configure SSH key authentication, a verified host key and repository secrets before enabling deployment; see [CI/CD setup](docs/CI-CD.md). Deployment is initially disabled.

## Run locally

Requires Node.js 20.9+ (this checkout was tested with 20.20.2) and npm.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. Production:

```powershell
npm run build
npm run start
```

## Checks

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite starts a production server, so build first. To use an already installed compatible browser on Windows:

```powershell
$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:e2e
```

Browser projects cover desktop, 768px tablet and a 390px mobile viewport. Chromium mobile emulation is not Safari testing. HTML results are in `playwright-report/`; retained JSON and screenshots are in `docs/evidence/`. Tests do not certify real-world vehicle performance.

## Structure

- `lib/calculations.ts`: pure SI math; `lib/engine.ts`: Zod validation, unit adapters and calculator dispatch.
- `data/tools.ts`: 36 tools, typed input definitions, descriptions, methods and related content.
- `data/guides.ts` + `data/guide-details.ts`: 30 guides with topic-specific explanations, worked examples and FAQs.
- `data/references.ts`: 10 configurable comparison tables and derivations.
- `data/seo/keyword-map.ts`: page-level intent, metadata, canonicals, headings and link relationships.
- `app/[category]/[slug]/page.tsx`: server-rendered method, worked examples and calculator island.
- `components/ui/button.tsx`: locally maintained shadcn/Radix-style button; `components.json` supports future shadcn additions.
- `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`: SEO foundations and JSON-LD generators.
- `tests/unit`, `tests/e2e`: mathematics, invalid/boundary inputs, content integrity and browser regression checks.

## Engineering choices

Canonical units are meters, kilograms, kW, m/s and Nm. UI length inputs are inches or mm. Tire designations preserve the industry convention of section width in mm and rim diameter in inches. Mechanical hp is distinguished from metric horsepower. Calculator outputs state their units, and road-speed tools include both MPH and km/h.

Converter ratios represent a chosen operating point, not a constant transmission ratio. Optional jackshaft stages use `1/1` when absent. Chain-length approximation is for an open two-sprocket drive and rounds up to an even link count; physical fit and revised center distance must be checked. Drag models are empirical; eighth-mile factors and drivetrain loss are explicit user assumptions. The 0–60 tool uses entered average acceleration and constant-acceleration distance, not an unvalidated horsepower predictor.

No database, login, remote fonts, stock image dependencies, advertisements or analytics scripts are included. The generated Open Graph image is served locally. Charts load on request and include exact-value tables. Default calculations and method content are present in server HTML; interactive editing needs JavaScript.

## Sharing and privacy

Share links serialize numeric inputs in the URL query. Opening them sends the query to the server; they may appear in request logs and browser history. Do not enter sensitive data. Privacy choice is the only local-storage value. No optional tracking loads even when permission is selected.

`NEXT_PUBLIC_ANALYTICS_ID` is reserved only; setting it does not enable tracking. A future integration needs a disclosed provider, consent and withdrawal behavior, and updated policy review. Ad containers stay hidden until deliberately enabled, then reserve height outside controls.

## Deployment configuration

Next.js standalone output supports Node hosting, or import this repository into a Next.js-compatible host. A multistage Dockerfile runs as the unprivileged `node` user. No hosting account or secret is required for local use.

Configure `NEXT_PUBLIC_CONTACT_EMAIL` with a real monitored mailbox **before building**. Contact form reports otherwise remain local and are downloadable; no email address is invented. Supply the actual operator identity, hosting/log retention information and legal policy details before public launch. No organization or author credentials are fabricated in structured data.

Deploy only after authorization. After DNS and HTTPS are configured, verify status codes, canonicals, caching and headers on the actual origin. Enable HSTS at the HTTPS host; the app intentionally does not force it on local HTTP. The CSP permits Next.js inline scripts and React styles; nonce-based CSP can be added with a host-specific rendering strategy. Docker execution, host-level TLS and real-user Core Web Vitals require the target environment.

Read [design implementation](docs/DESIGN-IMPLEMENTATION.md), [SEO report](docs/SEO-REPORT.md), [QA report](docs/QA-REPORT.md), [formula register](docs/FORMULA-REGISTER.md) and [remaining work](docs/REMAINING-ISSUES.md) for implementation and verification status.
