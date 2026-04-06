# BizLink Course Review Dashboard

## Vision
SME review dashboard for the BizLink LSH3 Dresspack training course. Three domain experts (Hendrik, Jens, Knut) left 64 comments on a 9-lesson course. AI processed the comments into structured, prioritized actions. This dashboard lets the SMEs validate each action: accept, skip, or modify.

## Live
**https://bizlink-course-review.vercel.app**

## Tech Stack
- **Framework:** Next.js 16 + React 19 + TypeScript 5
- **UI:** shadcn/ui (new-york) + Radix UI + Tremor v3
- **Styling:** Tailwind CSS v4 + dark mode
- **Icons:** Google Material Symbols Outlined
- **Data:** Supabase (PostgreSQL) + TanStack React Query
- **Hosting:** Vercel

## Data Flow
```
Raw Comments (cr_raw_comments, 64) → AI Processing →
  Global Rules (cr_global_rules, 7) +
  Slide Actions (cr_slide_actions, 56) +
  Conflicts (cr_conflicts, 4) →
  Dashboard (read) + Validate (read/write)
```

## Data Model (Supabase)
4 tables in project `mowcdrhwdaifxpndulfo`:

| Table | Rows | Purpose |
|-------|------|---------|
| `cr_raw_comments` | 64 | Original reviewer comments (immutable audit trail) |
| `cr_global_rules` | 7 | Course-wide terminology & style rules |
| `cr_slide_actions` | 56 | Lesson-specific changes to review (status + reviewer_note + decided_at persisted) |
| `cr_conflicts` | 4 | Conflicting reviewer opinions needing resolution |

### Classification — 2 Dimensions
- **Type:** TERMINOLOGY, TECHNICAL, CONTENT, TONE, VISUAL
- **Priority:** P1 Critical, P2 High, P3 Medium, P4 Low

## Pages

### Dashboard (`/`)
- Stats: total issues, pending, resolved, critical open
- "How Your Comments Were Processed" — educational methodology section
- Classification explainer (type + priority)
- **Course-Wide Rules** split into two groups:
  - Product Definition & Terminology (G-02..G-05) — concrete find-and-replace
  - Language & Description Style (G-06, G-07) — general writing guidelines
- Open Conflicts with Option A / Option B + recommendation
- Module 1 lesson list with per-lesson stats

### Validation Workspace (`/validate?lesson=N`)
- Dismissible "How to review" guide banner
- Filter bar: type, priority, status
- Feedback cards with clear sections: Reviewer Comment, Affected Text, Proposed Replacement
- Actions: Apply this change / Skip / Modify
- Resolution panel for editing replacement text
- Progress tracking: "X of Y reviewed / Z remaining"
- Lesson navigation (prev/next)

## Key Files
```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   └── validate/page.tsx     # Validation workspace
├── components/validation/
│   ├── FeedbackCard.tsx      # Individual action card
│   ├── FilterBar.tsx         # Type/priority/status filters
│   ├── LessonList.tsx        # Lesson cards with stats
│   ├── ResolutionPanel.tsx   # "Modify" dialog
│   └── StatsBar.tsx          # Summary stat boxes
├── hooks/
│   ├── useReviewData.ts            # Fetches all cr_ tables
│   └── useSlideActionMutations.ts  # Accept/reject/edit → cr_slide_actions
├── lib/
│   ├── review-adapter.ts     # Maps cr_ data → UI types
│   └── supabase.ts           # Supabase client
└── types/
    ├── review.types.ts       # GlobalRule, SlideAction, Conflict types + configs
    └── validation.types.ts   # FeedbackItem, stats helpers
```

## Running Locally
```bash
pnpm install
pnpm dev
```
Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Deployment
Hosted on Vercel. Push to `main` or run `vercel --prod`.
Env vars configured in Vercel project settings.
