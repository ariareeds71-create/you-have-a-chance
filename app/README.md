# C.A.N. — Charmaine Anna Ncube

A React + Vite application containing the existing cinematic landing page and
the C.A.N. workspace. The workspace is the social/product surface for people,
projects, learning, opportunities, events, mentorship, services, and creator
workflows.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## What's here

- `src/App.jsx` — assembles the full landing page from section components, in
  the order specified in the brief (Hero → Problem → Founder → Door → Vision
  → What we do → Journey → Builders → Mentors → Collaborators →
  Opportunities → Funding → AI → Global access → Trust → MVP → Roadmap →
  Business model → Principles → Closing).
- `src/sections/` — one file per landing-page section. Sections compose
  reusable components from `src/components/` and pull their copy from
  `src/data/`.
- `src/components/` — reusable UI primitives: `Button`, `SectionHeading`,
  `RoleCard`, `JourneyStep`, `OpportunityCard`, `MentorCard`, `ProjectCard`,
  `FeatureCard`, `VerificationStep`, `RoadmapItem`, `Navbar`, `MobileMenu`,
  `Footer`, `CTASection`, `CountrySelector`.
- `src/data/content.js` — all real landing-page copy and structured demo data
  (journey steps, roles, demo opportunities, demo mentors, a demo Builder
  project, AI modules, verification stages, MVP scope, roadmap, business
  model, principles). Edit this file to change copy without touching markup.
- `src/data/countries.js` — the full country list backing the country
  selector, reflecting the "every country belongs" architecture principle.
- `src/styles/tokens.css` — centralized design tokens (color, type, spacing,
  radius, shadow). Swap the accent/brand colors here once the final brand is
  chosen; components don't hard-code colors.
- `src/styles/global.css` — base styles, layout primitives, accessibility
  (focus states, reduced-motion support), and the single reveal-on-scroll
  motion pattern used across sections.
- `src/hooks/useReveal.js` — an IntersectionObserver hook available for
  wiring up scroll reveals on additional elements as the page grows.
- `src/lib/intelligence.js` — a local, bounded recommendation foundation for
  intent signals and practical next steps. It is not a medical or psychological
  system and does not claim to be a hosted AI provider.
- `supabase/schema.sql` — additive schema for profiles, roles, projects,
  resources, videos, learning paths, courses, events, mentorship, services,
  opportunities, messaging, notifications, transactions, payouts, and RLS.
- `public/founder.jpg` — the founder photo used in the Founder section.
  Replace this file (keep the same name, or update the `src` in
  `src/sections/Founder.jsx`) when a different image is ready.

## Brand name

The final company name has not been chosen. The navbar, footer, and page
`<title>` currently use a neutral "PROJECT NAME" placeholder and an abstract
mark (a small rotated square) rather than a real logo, by design — see
`nav.brand` in `src/data/content.js` and the `__brand-mark` elements in
`Navbar.jsx` / `Footer.jsx`. When the name is finalized, update `nav.brand`
and swap the mark for a real logo; no structural changes are required.

## Integration status

The frontend deliberately stays truthful when external services are not
configured:

- Supabase Auth and the existing browser client use only public environment
  variables. Apply `supabase/schema.sql` to provision the additive product
  tables and RLS policies.
- Payments, payout onboarding, identity verification, and YouTube ingestion
  require server-side provider integrations. No fake balances, card data, KYC
  documents, or fabricated transaction records are created by the app.
- Seed content in the workspace is for interface testing and is labeled as
  sample/demo content until trusted source ingestion is connected.

## Future routes

The app is a single page today, but structured so routes can be added later
without reorganizing: `/login`, `/signup`, `/onboarding`, `/dashboard`,
`/projects`, `/projects/:id`, `/opportunities`, `/opportunities/:id`,
`/mentors`, `/mentors/:id`, `/community`, `/profile`, `/settings`,
`/verification`, `/admin`. When ready, add `react-router-dom` (or your
preferred router) and move `App.jsx`'s current contents into a `/` route,
keeping the existing section/component structure intact.
