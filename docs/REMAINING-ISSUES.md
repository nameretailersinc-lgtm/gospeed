# Launch requirements and measured limits

The application is implemented locally. It has not been deployed under the user's instruction to wait for authorization.

## Operator-owned launch requirements

1. The user-supplied contact address `info@nameretailer.com` is configured in `.env.local` and `.env.example`. Set `NEXT_PUBLIC_CONTACT_EMAIL=info@nameretailer.com` in the hosting build environment too. The contact page offers an email draft through the visitor's mail application and a downloadable report; it does not send email from the server. Mailbox delivery and monitoring have not been independently verified.
2. Supply actual operator/legal identity and hosting-provider details, log retention and a rights-request process. Review privacy and terms for the intended operation and jurisdictions before public launch. Current policies describe the implemented data behavior and identify pending details; no legal sign-off is claimed.
3. VPS target `root@5.189.158.75:22` is selected. GitHub Actions and health-checked Docker deployment files are prepared; configure key-based SSH authentication, a verified host identity, the deployment secrets and current server/proxy details before enabling the VPS job. Configure domain DNS and HTTPS, then verify status codes, headers and caching on the live origin. See `CI-CD.md`. No VPS changes have been made.

## Verification and ongoing work

- Review the actual executed checks in `QA-REPORT.md`; a passing formula test is not vehicle or component certification.
- Independent professional motorsport review, manufacturer-specific validation and physical track testing have not been conducted. The tools do not invent those claims. Empirical and user-assumption worksheets are labeled accordingly.
- Real-user LCP/INP/CLS at the 75th percentile cannot be measured before deployment and traffic. Local lab data, where available, does not establish field Core Web Vitals.
- Chromium desktop, tablet and mobile-emulation checks do not establish actual iOS Safari, Firefox or assistive-technology compatibility. Broaden platform verification before claiming full WCAG 2.2 AA conformance.
- The 30 guides now include additional explanations and topic-specific FAQs; all 10 reference detail pages include reading instructions and worked examples. Further expansion should use actual reviewed field measurements and named authorship only when those materials exist.
- No analytics or ad scripts load. Environment IDs are only reserved. Future tracking/advertising requires actual provider selection, purpose disclosure, consent/withdrawal behavior and policy updates. [ICO guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/) confirms that storage/access rules also cover similar device technologies; the exact future integration needs its own review.
- No traffic statistics exist. Homepage picks are explicitly editorial, not claimed popularity rankings. Monitor real query/landing-page evidence before changing topic clusters.
- Google software rich results require genuine rating/review information. The Schema.org WebApplication markup deliberately omits invented ratings and makes no rich-result promise. The live Google validator remains a deployment follow-up.
- The current CSP permits inline script/style needed by this static-plus-SSR Next.js setup. A stricter nonce strategy is possible with host-specific rendering trade-offs. No database or application write endpoint is exposed.
- Supplied small crops are preserved; active photographic sections use 13 newly generated illustrative assets, 1672×941 or 1983×793, served responsively by Next.js. They are not manufacturer photos or precise engineering references. A genuine brand photography library can replace them later without changing page components.
