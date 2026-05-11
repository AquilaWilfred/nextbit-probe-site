# NextBit Probe — Next.js Project

A production-grade Next.js 15 + TypeScript site for the NextBit Probe hardware diagnostic tool.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: CSS Modules + global design tokens
- **Fonts**: Space Grotesk + JetBrains Mono (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # File-based routing (Next.js App Router)
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── globals.css         # Design tokens + shared utility classes
│   ├── page.tsx            # Home — Hero, ReportCard, FeatureGrid
│   ├── docs/page.tsx       # Docs — Sidebar + CodeBlock sections
│   ├── downloads/page.tsx  # Downloads — DownloadTile + ChangelogList
│   ├── privacy/page.tsx    # Privacy — data table + security cards
│   └── contact/page.tsx    # Contact — channels + ContactForm
│
├── components/
│   ├── layout/             # Navbar, Footer, Sidebar, SectionWrapper
│   ├── sections/           # Hero, ReportCard, FeatureGrid, DownloadTile, ChangelogList
│   ├── forms/              # ContactForm, SuccessModal
│   └── ui/                 # Input, TextArea, SubmitButton, CodeBlock, InfoCallout
│
├── constants/index.ts      # Features, downloads, changelog, nav links, site meta
├── lib/utils.ts            # Score calculator, formatters
└── types/index.ts          # Full TypeScript interfaces for ProbeReport + UI props
```

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Homepage with live ReportCard from sample JSON |
| `/docs` | Client | Interactive docs with sidebar navigation |
| `/downloads` | Server | Platform tiles + version changelog |
| `/privacy` | Server | Data policy, never-list, security cards |
| `/contact` | Mixed | Channel links + interactive feedback form |

## Key Design Decisions

- **Server Components by default** for SEO pages (Home, Downloads, Privacy)
- **Client Components** only where interactivity is needed (Docs sidebar, ContactForm)
- **CSS Modules** per component for scoped styles — no CSS-in-JS overhead
- **Design tokens** in `globals.css` `:root` — consistent theming with zero runtime cost
- **`ProbeReport` type** in `src/types/index.ts` mirrors the JSON output exactly

## Connecting the Contact Form

In `ContactForm.tsx`, replace the `console.log` with your API call:

```ts
// Example: send to a Next.js API route
await fetch("/api/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

## Adding an API Route (optional)

Create `src/app/api/feedback/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Forward to email / database / webhook
  console.log("Feedback:", body);
  return NextResponse.json({ ok: true });
}
```
