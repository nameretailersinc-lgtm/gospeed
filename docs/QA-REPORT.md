# Local QA report

Verified October 18, 2026. Production preview: local Next.js standalone server on port 3107. Browser: installed Google Chrome through Playwright, with desktop, tablet and iPhone-size Chromium emulation. No deployment was performed.

## Executed checks

| Check | Result | Scope |
| --- | --- | --- |
| Production build | Passed | Next.js compilation, TypeScript and generated routes; guide pagination also renders on the server. |
| ESLint | Passed | `npm run lint`. |
| Unit tests | 260 passed in 5 files | Calculation fixtures, validation, conversions, content integrity, assets and expanded guide/reference coverage. |
| Earlier full browser baseline | 178 passed, 2 skipped, 0 failures | All calculator workflows and the then-current shared layouts; retained separately from later targeted results. |
| Navigation and layout regression | 29 passed, 4 skipped, 0 failures | All four explorers, keyboard navigation, intermediate widths, new library filters/pagination, homepage finder, reference controls, page images and automated accessibility checks across three viewport projects. |
| Final library and SEO follow-up | 10 passed, 2 skipped, 0 failures | Final topic-balanced card order, combined filters, accessible library, pagination with and without JavaScript, illustrated menus and all 94 public pages' metadata/internal links across three viewport projects. |

The skipped browser cases exercise desktop dropdowns. Smaller viewports use mobile navigation instead. Counts above describe separate runs with overlapping checks; they are not added together as unique coverage. The full baseline predates the final guide-library and menu refinements. Those changes received targeted regression checks.

## Evidence

- `evidence/sprint-1-full-browser-results.json`: earlier full browser baseline.
- `evidence/sprint-1-navigation-library-results.json`: navigation and layout regression.
- `evidence/sprint-1-final-library-audit-results.json`: final library and 94-page metadata/link audit.
- `evidence/guide-library-*.png`: final library at desktop, tablet and mobile sizes.
- `evidence/resource-explorer-*.png`: Guides, Reference Charts and Tools explorers.
- `evidence/navigation-calculators.png`: calculator explorer.
- `evidence/reference-drivetrain-detail-*.png`: live reference-table layout.
- `evidence/finder-*.png`: homepage finder.
- `evidence/guide-content-inventory.json`: all 30 article bodies contain an example image, a comparison table and at least four FAQs; 748–1,793 words per article in the saved inventory.

## Findings resolved

The calculator navbar icon caused a narrow overflow at 1024px. Compact search/action spacing now keeps the desktop header within its viewport. Menu image requests now account for tall crops rather than stretching small landscape sources. The finder's decorative flag stays within its scrollable bounds. Numeric overflow regions are keyboard-focusable, and native FAQ disclosures remain usable without JavaScript. Guide pagination has real server-rendered destinations; both pages together expose all 30 articles.

## Limits and follow-up

Automated accessibility checks are not a claim of complete WCAG conformance. Chromium device emulation does not establish actual iOS Safari, Firefox or screen-reader behavior. Local rendering metrics do not establish field Core Web Vitals. Professional engineering review, manufacturer-specific validation, physical testing and Docker execution were not performed. The Docker runtime now explicitly includes public assets, but a target hosting environment must still be tested.

Operator contact details, policy information, hosting selection and deployment authorization remain recorded in `REMAINING-ISSUES.md`.

## Contact email and favicon update

The user supplied `info@nameretailer.com`. It is configured in `.env.local`, `.env.example` and the Docker build argument. A production-build check confirmed the contact page contains the correct `mailto:` link and email-report action, with the unconfigured-address notice removed. The existing desktop privacy/correction workflow passed (one targeted browser test); evidence is in `evidence/contact-email-browser-results.json`. No email was sent and mailbox delivery was not tested.

The favicon now uses the navbar's blue-and-white checkered mark on navy. `app/icon.svg` is the source; `scripts/generate-icons.mjs` produces the multi-size ICO and 180px Apple icon. Production requests for `/icon.svg`, `/favicon.ico` and `/apple-icon.png` returned HTTP 200 with the expected image content types. Build and lint passed for this update.

## Repository and CI/CD setup

The initial GitHub Actions workflow passed actionlint 1.7.12 validation, YAML parsing and Bash syntax checking. TypeScript and lint passed. The unit suite now has **266 passing tests in six files**, including six isolated deployment tests using a fake Docker CLI: first release, replacement, readiness failure with rollback, first-release failure, foreign-container refusal and immutable-image enforcement. These do not establish that a real VPS has been deployed.

The workflow will execute the production build, browser matrix and actual container smoke checks on GitHub. Local browser evidence is excluded from Git to avoid committing generated reports; the content inventory remains tracked and future workflow evidence is retained as Actions artifacts. The VPS job is disabled until configured. See `CI-CD.md` for required SSH details and secrets.
