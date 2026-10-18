# Reference design implementation

Updated October 18, 2026 using the user's page references. After the user identified blur in the small supplied crops, 13 original high-resolution illustrative assets were generated with the built-in image tool and integrated through a shared image map. Original supplied files remain intact.

The shared visual system is in `app/racing.css`. The existing base layout styles remain in `app/globals.css`. Components share blue accents, dark racing heroes, local image assets, rounded control surfaces and responsive card grids.

| Page | Implemented reference elements |
| --- | --- |
| Homepage | Racing-car hero; real content counts; tabbed calculator finder; six image-led tool cards; eight discipline cards; latest guides; resource cards; CTA; guide-library banner; useful FAQs. |
| Category hubs | Full-width category photo; blue-highlighted title; floating illustrated tool grid; technical-library banner. Go-kart hub contains all six requested tools. |
| Calculators | Racing hero; floating live calculator; formula/example anchors; metric/imperial switch; icon input tiles; explicit calculate action alongside live updates; result tiles; copy/share; four engineering notes; FAQs and related tools. |
| Chain length | Dedicated kart photo and chain-drive diagram; pin-pitch inputs; fractional and even link outputs; chain length and revised center distance; documented two-sprocket approximation. |
| Engineering guides | Racing hero, floating search, topic chips, category/count sidebar, difficulty and content-type filters, sort control, image cards, dates and estimated reading time. Two real pages cover all 30 guides; the second page also renders on the server without JavaScript. |
| Reference Charts | Supplied sprocket hero; floating method notice; ten illustrated reference cards; technical-resource banner; existing configurable tables preserved. |
| About | Supplied kart hero; engineering mission illustration; blueprint scope panel; laptop correction section; community racing banner. |
| Calculator directory | Supplied kart hero and named tool thumbnails; instant keyword search; category counts; editorial/A–Z/category sorting; all 36 calculator links. |
| Methodology | Five numbered sections; explicit unit-conversion tiles; result-type explanations; chain-geometry figure; source cards and review policy. |
| Header/footer | Checkered vector wordmark; category dropdown; real tool search; working navigation; photographic footer; privacy controls. |

The reference's sign-in, newsletter subscription, social profiles, unimplemented calculator subjects and unsupported article counts were adapted to real existing features. No inert account buttons, fake subscriber forms, unsupported technical claims or fabricated popularity numbers were added.

Typography follows the final requested pairing: locally hosted Inter for body, forms and navigation; Sora 600/700 for headings; Rajdhani for statistical values and number tables with tabular digits. `next/font/local` preloads fonts and generates adjusted fallback metrics. `app/typography.css` increases labels, descriptions, buttons and secondary text across desktop and mobile. Font packages include their license files in `node_modules`; no Google Fonts runtime request is made.

Original images stay in their supplied folders. Active page images resolve through `lib/image-assets.ts` and `components/site-image.tsx` to `public/images/hd`. Ten generated images are 1672×941; three wide heroes are 1983×793. They replace the 190–550px mockup crops rather than pretending to recover missing original detail. Next.js serves responsive WebP versions at quality 85. Generated mechanical pictures are illustrations, not manufacturer drawings or evidence for engineering formulas. Exact mathematical diagrams remain SVG/code.

`docs/IMAGE-GENERATION.json` records the built-in workflow and prompt set. No image-generation API key or external stock-photo service was used. The shared header now uses topic-tab explorers for Calculators, Engineering Guides, Reference Charts and Tools, with descriptive destinations, featured cards and keyboard controls. Counts remain grounded in the nine implemented calculator categories.

Desktop, tablet and mobile screenshots are retained in `docs/evidence/redesign-*.png`. See the QA report for actual check results and limits. Deployment remains withheld under the user's instruction.

The illustrated Engineering Guides, Reference Charts and Tools dropdowns follow the supplied three-column references: topic tabs, six thumbnail cards and a feature panel. The calculator explorer uses the same panel width, card treatment, focus outlines and spacing. A calculator icon remains visible beside its navbar label at desktop widths. Resource photos request enough source pixels for their tall crops, avoiding the blur caused by stretching a small landscape thumbnail into a portrait panel. Resource counts, filters and links use implemented content; unsupported glossary, download and account destinations are not added.

Guide difficulty and content type are editorial browsing labels in `lib/guide-library.ts`. Reading-time labels estimate main-text length at 200 words per minute, and dates use each guide's actual update field. The homepage finder has icon tabs, keyboard controls, quick picks and an in-bounds CSS checkered decoration. Reference detail pages retain live units and results under the new explanation layout.

The latest homepage reference adds dark image-led calculator cards, cyan calls to action and blue-highlighted section headings. Guide detail pages have numbered sections, topic-specific expansions, native FAQ disclosures and contents navigation; the sprocket and torque guides use the newly supplied photos in `public/sprocket_geometry` and `public/torque_horsepower`. These sources are explicitly preserved by the shared image resolver. All reference table detail pages now include reading instructions and worked examples. See `SPRINT-1-CONTENT-AUDIT.md`.
