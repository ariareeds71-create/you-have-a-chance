# You Have a Chance — Landing Page

A React + Vite landing page and frontend foundation for the global opportunity
platform described in the project brief. Built to be opened directly in VS
Code and continued as the real product grows.

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

## Notes on scope

This build is the landing page and frontend foundation only:

- No real backend, authentication, or database is connected. Buttons that
  imply account creation (`Start building`, etc.) currently link to on-page
  sections; wire them to real `/signup`, `/login`, `/onboarding` routes as
  those are built.
- No payments, wallet, or investment functionality is implemented anywhere,
  per the brief. The Funding section explicitly shows this as a future
  readiness/preview UI, not live functionality.
- Opportunity and mentor data (`src/data/content.js`) is clearly-labeled demo
  data for UI purposes — not real programs or real people.
- Social links in the footer are placeholders (non-functional, `title="Coming
  soon"`) rather than pointing to accounts that don't exist yet.

## Future routes

The app is a single page today, but structured so routes can be added later
without reorganizing: `/login`, `/signup`, `/onboarding`, `/dashboard`,
`/projects`, `/projects/:id`, `/opportunities`, `/opportunities/:id`,
`/mentors`, `/mentors/:id`, `/community`, `/profile`, `/settings`,
`/verification`, `/admin`. When ready, add `react-router-dom` (or your
preferred router) and move `App.jsx`'s current contents into a `/` route,
keeping the existing section/component structure intact.
