# SEO, answer content and technical implementation

Implementation date: October 18, 2026. Production origin: `https://gospeedraceway.com`. The site has not been deployed.

## Public structure

94 canonical content pages: homepage, calculator directory, guide index, reference index, nine application/category hubs, 36 tools, 30 focused guides, ten reference tables and five information pages. Sitemap URLs omit query variants and use a real initial content date rather than the time of each request. Important pages are linked by normal HTML anchors in the homepage, navigation, category hubs, tool pages and content indexes.

Tools and the searchable directory render on the server so shared query-string inputs can be read safely. Explanations, examples, methods, limitations and links are in server HTML. Guides, category pages and reference-page content are prerendered. Interactive controls are React islands. Reference row data is initially server-rendered through the client component, then configurable locally.

## Metadata and keyword intent

`data/seo/keyword-map.ts` records the primary phrase, supporting terms, intent, canonical, title, description, H1, useful headings and related tool/guide links for every content page. Keywords come from the supplied brief; no volumes, trends, organic difficulty or popularity metrics have been invented. A single page serves each URL/keyword cluster. All metadata helpers emit canonicals, Open Graph and Twitter summary cards with a locally generated social image.

The requested application pages reuse tested mathematical families while giving context-specific inputs, descriptions and related guides. Close application-specific ratio/speed intents can still overlap in search. Monitor actual Search Console query and landing-page data; consolidate only if evidence supports it, rather than adding more exact-match variants.

## Structured data

- Homepage: `WebSite`.
- Every non-home content page: `BreadcrumbList` reflecting visible breadcrumbs.
- Functional tools: `WebApplication` (a SoftwareApplication subtype), actual name and description, browser requirements, zero-price offer and no ratings.
- Guides: `Article`, real content date, headline, description and mainEntityOfPage. Author is omitted because no verified named author was supplied.

JSON-LD is serialized with `<` escaping. No Organization profile, fabricated experts, reviews, AggregateRating, FAQPage rich-result claim or invented GEO properties are added. Vocabulary and property choices were checked against [Schema.org WebApplication](https://schema.org/WebApplication) and [Google's software-app documentation](https://developers.google.com/search/docs/appearance/structured-data/software-app). Google requires genuine review/rating data for its software rich-result eligibility; none exists here, so this implementation makes **no software-rich-result eligibility claim**. No deployed URL was submitted to Google's Rich Results Test or Search Console.

## Answer and generative-search usefulness

Pages give a direct explanation before the interactive tool. Formula variables, unit conversions, worked examples, caveats and technical references make the result inspectable. Guides address focused questions rather than filler introductions. Comparison tables use HTML headers and captions; on-demand Recharts plots have text descriptions and exact-value tables. Formula content remains readable without JavaScript. These are content and accessibility practices, not AI-search ranking guarantees.

## Caching and errors

Next.js prerendering handles static content; framework static assets use content-addressed caching. Tool and directory responses with query parameters are rendered per request; no shared HTML cache is forced across user input variants. Invalid tool, category, guide and reference paths use `notFound()`/route allowlists and actual HTTP 404 responses. The visible 404 links back to the directory. `robots.ts` permits public crawling and points to the production sitemap. Local files do not control an eventual host's access restrictions.

## Launch follow-up

After an authorized deployment, verify HTTPS, canonical origin and status codes at the real domain; configure Search Console ownership and submit the sitemap; validate applicable structured data using live tooling; inspect robots and any CDN rules; measure Core Web Vitals with real-user data. No ranking, indexing, traffic, ad approval or revenue guarantee is made.
