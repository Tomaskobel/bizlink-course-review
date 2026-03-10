# Content Validator

## Vision
AI-powered course content validation tool. AI generates feedback on course content, human reviewers validate, classify, and resolve each feedback item.

## Tech Stack
- **Framework:** Next.js 16 + React 19 + TypeScript 5
- **UI:** shadcn/ui (new-york style) + Radix UI + Tremor v3
- **Styling:** Tailwind CSS v4 (OKLCh color space) + dark mode
- **Icons:** Google Material Symbols Outlined
- **State:** React local state (Supabase + TanStack Query ready)

## Pages
1. **Dashboard** (`/`) — Stats overview + lesson list with progress
2. **Validation Workspace** (`/validate?lesson=id`) — Split-panel: original content + AI feedback cards

## Workflow
1. AI generates feedback items with severity (critical/major/minor/suggestion) and category
2. Reviewer sees original content (left) + feedback cards (right)
3. Per feedback item: Accept / Reject / Edit
4. Edit opens resolution dialog with reclassification + text correction

## Keyboard Shortcuts
- `A` accept, `R` reject, `E` edit selected feedback
- `J/K` or arrows: navigate feedback items

## Running
```bash
pnpm install
pnpm dev
```

## Current State
- [x] Project scaffolded
- [x] UI components from Marco Car stack
- [x] Dashboard page with stats + lesson list
- [x] Validation workspace with split panel
- [x] Feedback cards with accept/reject/edit
- [x] Resolution dialog with reclassification
- [x] Filter bar (severity + status)
- [x] Keyboard shortcuts
- [x] Mock data (PLC course)
- [x] Section-level navigation (prev/next lesson)
- [ ] Supabase persistence
