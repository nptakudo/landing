You are a senior staff engineer and design-minded frontend architect.

Build a polished personal documentation website that auto-publishes my local Obsidian notes to a production website.

## Product goal

Create a personal docs / knowledge-base website with a premium, minimal, modern UI. The site should feel like a hybrid of a docs site, digital garden, and personal wiki. It must be optimized for reading, browsing, search, backlinks, and elegant motion.

The source of truth is my local Obsidian vault(locate at '/Users/takudo/Documents/TakudoNotes'). The website must automatically update when I sync my Obsidian notes to GitHub.

## Core constraints

- This is a real implementation task, not a mockup.
- Build for local-first authoring with Obsidian Markdown files as content source.
- Auto-deployment pipeline must be included.
- Tech stack must use:
  - React
  - TypeScript
  - Base UI for accessible unstyled primitives
  - Motion for animations
  - Tailwind CSS
- Use a framework suitable for content-heavy sites and static deployment.
- Prefer Next.js App Router with MDX/content pipeline, unless you can justify Astro as a better fit.
- Everything should be deployable to Vercel, Netlify, or GitHub Pages / Cloudflare Pages with documented tradeoffs.
- Do not use a database unless absolutely required.
- Keep the content source local files from the Obsidian vault / synced repo.

## What to build

### 1) Content ingestion from Obsidian
Implement a content pipeline that reads Markdown / MDX files from a content directory synced from Obsidian.

Support:
- standard Markdown
- frontmatter
- Obsidian wikilinks
- callouts
- tags
- backlinks
- aliases
- attachments / image embeds where feasible
- folders as sections
- optional draft / private note filtering

If needed, create a normalization layer that converts Obsidian-style syntax into website-friendly rendering.

### 2) Site experience
Build a premium docs website with:
- homepage
- docs index / explorer
- nested sidebar navigation
- search
- note page template
- tag pages
- backlinks section
- recent notes
- graph / relationship view optional but preferred
- dark mode
- responsive mobile layout
- RSS feed optional but preferred
- sitemap and SEO metadata

### 3) UI system
Use Base UI primitives to create a custom design system.

Design language:
- minimal
- typography-led
- refined spacing
- subtle borders
- soft elevation
- tasteful animations
- high readability
- elegant hover / focus states
- accessible contrast

Build reusable components such as:
- sidebar
- top nav
- command menu / search dialog
- collapsible tree nav
- tabs
- callout blocks
- breadcrumbs
- table of contents
- theme switcher
- pager / prev-next nav

### 4) Motion and delight
Use Motion carefully and intentionally:
- page transitions
- sidebar expand / collapse
- search dialog transitions
- hover micro-interactions
- TOC highlight transitions
- note card entrance animations
- reduced-motion support

Animations should feel premium, not flashy.

### 5) Search and knowledge features
Implement:
- full-text search for notes
- backlinks
- bidirectional linking UX
- tag filtering
- “related notes” section
- breadcrumbs
- automatic TOC from headings
- reading time
- created / updated dates if available

### 6) Local authoring + auto deploy workflow
Set up a workflow where:
- I edit notes locally in Obsidian
- notes are synced to a Git repository
- pushes to main trigger an automatic production deploy

Document at least two workflow options:
1. Obsidian vault stored directly inside the site repo
2. Obsidian vault synced separately, then copied / mirrored into the site content directory

Include:
- GitHub Actions workflow
- build command
- deploy command
- environment requirements
- asset handling strategy
- how to ignore private notes
- how to preview locally

### 7) Engineering quality
Require:
- clean architecture
- strong typing for content models
- linting
- formatting
- typecheck
- production build
- reusable components
- clear folder structure
- comments only where useful
- no dead code
- no placeholder marketing copy unless clearly labeled

### 8) Deliverables
The repo must include:
- working website
- documented setup
- example content
- deployment workflow
- README with local dev and publishing instructions
- architecture.md explaining:
  - framework choice
  - content pipeline
  - Obsidian compatibility decisions
  - search approach
  - deployment strategy
- plans.md with milestones and implementation notes

## Decision-making rules

Before coding:
- first write a brief implementation plan
- explicitly choose between Next.js and Astro
- justify the choice based on this use case
- explain content parsing strategy
- explain deployment strategy
- explain search strategy
- explain how Obsidian-specific syntax will be handled

During implementation:
- work milestone by milestone
- after each milestone, list:
  - files created/updated
  - what works now
  - how to verify it
  - any tradeoffs

## Preferred architecture

Default to:
- Next.js App Router
- MDX / Markdown local content pipeline
- static generation where possible
- Tailwind for styling
- Base UI for primitives
- Motion for interactions

But if Astro is clearly superior for this content-first use case, you may choose Astro and explain why.

## Non-goals
- no CMS
- no user auth
- no comments system
- no unnecessary backend
- no overengineered plugin system unless needed

## Output format

Start with:
1. project architecture recommendation
2. framework choice with justification
3. folder structure
4. milestone plan
5. then implementation

When generating code:
- provide complete files, not partial snippets
- keep it production-quality
- prefer clarity over cleverness
