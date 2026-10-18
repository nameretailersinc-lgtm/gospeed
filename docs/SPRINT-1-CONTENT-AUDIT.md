# Sprint 1 detail-page content audit

Review date: October 18, 2026. Local implementation; no deployment performed.

## Findings and changes

| Detail template | Pages reviewed | Gap | Result |
| --- | ---: | --- | --- |
| Engineering guide | 30 | One explanatory section, one short worked example, no topic-specific FAQs or contents navigation | Every guide now has at least five explanatory sections, a formula walkthrough, comparison table, worked-example image, limitations, at least four topic-specific FAQs, calculator links and related reading. |
| Reference table | 10 | Formula and assumptions were present, but there was no explanation of how to read the comparison or a worked default-input example | Added table-specific reading instructions, a numerical example, FAQs and linked explanatory guides to every table detail page. |
| Calculator | 36 | The guide-template gap does not apply: methods, example, interpretation, limitations, mistakes and FAQs already exist | Preserved the topic-specific calculator content and enriched linked guides. Made overflowing numeric tables keyboard-focusable. Further equipment-specific examples need actual equipment data. |

## Sprocket pitch-diameter guide

The expanded guide explains pitch, outside and root diameter; derives the chord relationship; gives degree/radian and metric/imperial steps; compares 12, 15, 20, 30 and 60 teeth at half-inch pitch; distinguishes polygon advance from circular circumference; and explains measuring pitch across multiple pin intervals. Seven FAQs answer practical long-tail questions without adding unsupported chain compatibility or manufacturing claims.

The 12-tooth example is approximately 1.93185165 in / 49.06903198 mm. The 20-tooth example is approximately 3.19622661 in / 81.18415591 mm. Every comparison-table row is checked against the independent polygon formula in the content regression test.

## Full-library expansion

`data/guide-workshops.ts` supplies a distinct workshop for each of the 30 topics: named inputs, formula, ordered calculation steps, a dimensioned comparison table, interpretation, an input check and an additional specific FAQ. The dirt-bike guide covers trail/track context, complete reduction, reciprocal speed changes, shift placement, wheelspin and chain-path checks. Its worked pairs compare 14/49, 14/52 and 13/49.

The final prerendered article inventory contains 748–1,793 words per guide, including each article's related reading and method content. Dirt-bike gearing contains 958 words. These counts document the output rather than set an SEO word-count target. All 30 article bodies include an example image, at least one comparison table and at least four FAQs. The exact per-page inventory is saved in `docs/evidence/guide-content-inventory.json`.

Reference detail pages now share a photographic hero, live input/result summaries, compact controls, named results, formula panel, explanation/example cards, calculator CTA and related guides. The drivetrain-loss summary reports the actual 0–30% comparison range: at 400 engine hp it is 280–400 estimated wheel hp. Switching units preserves the physical scenario; every table column keeps its stated output unit.

## Design and navigation

The sprocket and torque/power guide pages use the supplied images from `public/sprocket_geometry` and `public/torque_horsepower`. All guide pages share a photo hero, numbered sections, accessible native FAQ disclosures, a contents list and relevant links. The pitch-center diagram is an SVG with descriptive text; it describes geometry rather than a manufacturing tooth profile.

The calculator, guide, reference and tools dropdowns provide topic tabs, descriptive links and a featured destination. Names and counts reflect implemented content. Text wraps inside the panels; topic tabs support arrow keys, Home and End. Escape closes a panel and returns focus to its trigger. The mobile menu exposes the destinations directly.

Final font choices follow the latest request: locally bundled Inter for body, forms and navigation; Sora 600–700 for headings; Rajdhani for statistics, results and number tables with tabular digits. `next/font/local` preloads the files and supplies adjusted fallback metrics.

## SEO and verification scope

Expanded content and FAQ answers are present in server HTML, with normal anchor links and semantic table headers. The keyword map now records the visible FAQ questions as supporting long-tail intents and includes the new headings. Existing URLs, page titles and canonicals are retained. No search volumes, named experts, ratings or FAQ rich-result eligibility are invented.

See `QA-REPORT.md` for executed checks and results. External sources are retained with their original scope. Renold's PDF rejected the automated fetch with HTTP 403 during this pass, so this report does not claim that its external availability was verified. Sprocket pitch-circle values are independently derived from polygon geometry rather than attributed as a manufacturing specification.
