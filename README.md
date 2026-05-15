# GTV Fit Check

A polished demo of a **UK Global Talent Visa self-assessment tool** for artists, creative professionals, founders and researchers. Designed to feel premium, calm and high-trust — not like a government form.

> **Important.** GTV Fit Check is an **educational self-assessment tool**. It does **not** provide legal or immigration advice and cannot guarantee visa approval, endorsement, or eligibility. Always consult a qualified immigration adviser before applying.

---

## What's in the demo

- **Landing page** with editorial hero, three feature cards, sample result preview, and disclaimer
- **Route chooser** — Arts & Culture (interactive), Digital Technology and Research & Academia (coming soon)
- **Arts & Culture assessment** — 4-step guided form with progress indicator
  - A. Career profile
  - B. Recognition (awards, exhibitions, residencies, press)
  - C. Evidence strength (proof, recommenders, international footprint)
  - D. UK career plan
- **Result dashboard** with:
  - Animated score meter (0–100)
  - Tier badge (Strong fit / Possible fit / Needs more evidence / Weak fit)
  - Route suggestion (Exceptional Talent or Exceptional Promise)
  - Three strength cards and three gap cards
  - Prioritised next steps
  - Evidence checklist
  - Mock "Download report" (exports a JSON file)
- **"Fill with demo answers"** button for instant testing
- **Demo result preview** when arriving at `/result` without completing the form

## Tech stack

- **Next.js 14** App Router
- **React 18** + **TypeScript**
- **Tailwind CSS** with CSS variables and design tokens
- **shadcn/ui-style** primitives built directly on Radix UI
- **lucide-react** icons
- No backend, no payments, no database — `localStorage` carries result state between pages.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# Then open http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Deploying to Vercel

This project is Vercel-ready. Push to GitHub and import in Vercel — no environment variables, no build configuration required.

```bash
# or, with the Vercel CLI
npx vercel
```

## Design direction

- **Background:** warm off-white (`hsl(36 30% 97%)`)
- **Primary accent:** deep navy (`hsl(222 47% 18%)`)
- **Highlight accent:** muted gold (`hsl(36 50% 50%)`)
- **Success / warning:** muted green and warm amber
- **Typography:** modern sans + editorial serif headings (`Cormorant Garamond`)
- **Shape:** generous rounded corners (`--radius: 1rem`), soft layered shadows
- **Motion:** subtle fade-ins, animated score meter, no flashy transitions

## Project structure

```
.
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                          # Landing
│   ├── not-found.tsx
│   ├── assessment/
│   │   ├── page.tsx                      # Route chooser
│   │   └── arts-culture/page.tsx         # Multi-step form
│   └── result/page.tsx                   # Result dashboard
├── components/
│   ├── ui/                               # shadcn-style primitives
│   ├── LandingHero.tsx
│   ├── FeatureCard.tsx
│   ├── RouteSelector.tsx
│   ├── AssessmentStepper.tsx
│   ├── QuestionCard.tsx
│   ├── ResultDashboard.tsx
│   ├── ScoreMeter.tsx
│   ├── EvidenceChecklist.tsx
│   ├── DisclaimerBox.tsx
│   ├── CTAButton.tsx
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
├── lib/
│   ├── types.ts
│   ├── scoring.ts                        # rule-based scoring + route suggestion
│   └── utils.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Scoring logic

Rules in [`lib/scoring.ts`](./lib/scoring.ts):

| Signal | Weight |
| --- | --- |
| International awards | +20 (scaled by frequency) |
| Shortlisted awards | +10 |
| Solo exhibitions | +15 |
| Group exhibitions | +8 |
| Public performances / screenings | +8 |
| Residencies | +6 |
| Press / media coverage | +12 |
| Official proof of achievements | +8 |
| Press links / PDFs | +6 |
| Strong recommender sources | +8 (or −15 if none) |
| Senior recommenders | +7 |
| Evidence from multiple countries | +10 |
| Clear UK career plan | +6 |
| UK connections | +4 |
| Plan to build in the UK | +4 |
| Both proof and press missing | −10 |
| Years of experience | +3 (5+) / +6 (10+) |

Tiers:

| Score | Tier |
| --- | --- |
| 80–100 | Strong potential fit |
| 60–79 | Possible fit |
| 40–59 | Needs more evidence |
| 0–39 | Weak fit |

**Route suggestion**

- *Potential Exceptional Talent* — established stage **+** strong international awards/media **+** score ≥ 65
- *Potential Exceptional Promise* — emerging or mid-career **+** score ≥ 45
- Falls back to score-only logic if neither condition is met

## Wording policy

To stay honest and avoid implying legal advice, the app uses safer language:

- *"Your background may be suitable"* — not "you are eligible"
- *"This evidence may support your case"* — not "you qualify"
- *"This area may need strengthening"* — not "you fail to meet"
- *"Consider preparing…"* — not "you must…"
- *"Potential route"* — not "your route"

A persistent disclaimer is shown on every flow page.

## License

Demo project — not for production use.
