<!--
## Sync Impact Report

**Version Change**: (none) → 1.0.0
**Constitution Status**: Initial ratification — all placeholders filled for the first time.

### Principles Established
- I. SEO-First (new)
- II. Code Quality & Type Safety (new)
- III. Performance by Default (new)
- IV. Component Architecture (new)
- V. Accessibility & Semantic Markup (new)

### Sections Added
- Technology Standards
- Development Workflow

### Templates Reviewed
- `.specify/templates/plan-template.md` ✅ aligned — Performance Goals / Constraints fields map directly to Principle III; Constitution Check gate preserved
- `.specify/templates/spec-template.md` ✅ aligned — Success Criteria section supports measurable SEO/performance metrics
- `.specify/templates/tasks-template.md` ✅ aligned — Phase N "Performance optimization" and "Security hardening" tasks map to Principles II and III
- `.specify/templates/commands/` ✅ N/A — no command template files present

### Deferred Items
- `RATIFICATION_DATE` set to today (2026-04-27) as this is the initial adoption; adjust if backfilling a prior date.
-->

# i-manager-frontend Constitution

## Core Principles

### I. SEO-First

Every page and route MUST be designed with search engine discoverability as a primary
requirement, not an afterthought. This means:

- All pages MUST export a `generateMetadata` function (or static `metadata` object)
  supplying `title`, `description`, `openGraph`, and `twitter` fields.
- HTML MUST use semantic elements (`<main>`, `<article>`, `<nav>`, `<header>`, `<section>`,
  `<h1>`–`<h6>`) in correct hierarchical order. One `<h1>` per page, maximum.
- Dynamic routes MUST implement `generateStaticParams` where content is known at build time
  to enable static generation and crawler access.
- Images MUST include descriptive `alt` text. Use Next.js `<Image>` with explicit `width`
  and `height` to prevent layout shift (CLS).
- Canonical URLs MUST be declared for any page that can be reached via multiple paths.
- Structured data (JSON-LD) MUST be added for any page representing an entity type
  (product, article, organization, etc.).

**Rationale**: SEO drives organic discoverability. Retrofitting metadata and semantic
markup is expensive and error-prone; building it in from the start costs almost nothing.

### II. Code Quality & Type Safety

The codebase MUST be consistently formatted, statically typed, and free of quality
regressions at every commit. Specifically:

- TypeScript strict mode MUST remain enabled. The `any` type is PROHIBITED except in
  vendored/generated code where no alternative exists — and MUST be accompanied by a comment
  explaining why.
- All code MUST pass ESLint (`eslint-config-next`) and Prettier without errors before
  merging. Lint-staged enforces this on commit; CI enforces it on push.
- Component props MUST be typed with explicit interfaces or Zod-inferred types. No implicit
  `object` or untyped function signatures.
- Dead code, commented-out blocks, and `console.log` statements MUST be removed before
  merge (use proper logging utilities if runtime diagnostics are needed).
- Code reviews MUST verify: type correctness, no lint suppressions without justification,
  and no logic duplicated across files when a shared utility exists.

**Rationale**: A frontend app with a weak type boundary becomes unmaintainable as it
scales. Quality gates at commit time are cheaper than debugging at runtime.

### III. Performance by Default

Every feature MUST be evaluated against Core Web Vitals targets before shipping:

- **LCP** (Largest Contentful Paint): MUST be ≤ 2.5 s on a simulated mobile connection.
- **INP** (Interaction to Next Paint): MUST be ≤ 200 ms.
- **CLS** (Cumulative Layout Shift): MUST be ≤ 0.1.

Implementation rules:

- Server Components MUST be the default; Client Components (`'use client'`) MUST only be
  used when interactivity or browser-only APIs are required.
- Third-party scripts MUST be loaded via Next.js `<Script>` with `strategy="lazyOnload"`
  or `"afterInteractive"` unless the script is render-critical.
- Fonts MUST be loaded via `next/font` with `display: 'swap'` and preloaded subsets only.
- Bundle size MUST be reviewed on every PR that adds a new dependency. Prefer tree-shakable
  packages; reject packages that add > 50 kB gzipped without documented justification.
- Dynamic `import()` MUST be used for components that are not needed on initial paint
  (modals, heavy charts, off-screen sections).

**Rationale**: Google's ranking algorithm factors Core Web Vitals. Performance and SEO are
inseparable goals for this project.

### IV. Component Architecture

- Components MUST be single-responsibility: one visual concern per component.
- Shadcn UI and Radix UI primitives MUST be used as the baseline for interactive elements
  (dialogs, dropdowns, forms). Do not reimplement accessible widget patterns from scratch.
- Form state MUST be managed with TanStack Form + Zod schemas. No uncontrolled forms,
  no ad-hoc `useState` chains for multi-field forms.
- Prop drilling MUST NOT exceed two component levels. Use React Context, server-side data
  passing, or URL state for deeper sharing.
- UI components MUST live in `components/` and MUST NOT import from `app/` directly,
  ensuring they remain reusable and independently testable.

**Rationale**: A consistent component model reduces cognitive overhead, prevents
accessibility regressions, and makes the design system maintainable.

### V. Accessibility & Semantic Markup

Accessibility is non-negotiable and directly amplifies SEO (semantic HTML benefits both):

- All interactive elements MUST be keyboard-navigable and MUST have visible focus
  indicators (do not set `outline: none` without a replacement).
- Color contrast MUST meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
- ARIA attributes MUST only be added when native HTML semantics are insufficient.
  Misused ARIA is worse than no ARIA.
- Images that convey meaning MUST have descriptive `alt` text. Decorative images MUST use
  `alt=""`.
- Error messages in forms MUST be associated with their inputs via `aria-describedby` or
  native `<label>` linkage.

**Rationale**: Accessible sites rank better, reach more users, and avoid legal exposure.
Semantic HTML is the shared foundation of SEO and accessibility.

## Technology Standards

This project's approved technology stack is fixed. Deviations require a constitution
amendment with documented rationale.

| Concern | Approved Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| UI Primitives | Shadcn UI + Radix UI |
| Forms | TanStack Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |
| Formatting | Prettier 3 |
| Linting | ESLint 9 + eslint-config-next |
| Package Manager | pnpm |

New dependencies MUST be evaluated for: bundle weight, maintenance status, license
compatibility, and whether an existing approved library already covers the need.

## Development Workflow

- **Feature branches**: All work MUST happen on a dedicated branch; direct commits to
  `main` are PROHIBITED.
- **Commit hygiene**: Commits MUST be atomic and pass lint-staged checks. Commit messages
  MUST follow Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, etc.).
- **PR requirements**: Every PR MUST include a description, reference the relevant spec
  or task, and pass CI (lint + type-check + build) before review.
- **Build verification**: `next build` MUST complete without errors. Type errors that only
  surface at build time MUST be fixed, not suppressed with `// @ts-ignore`.
- **Dependency updates**: Patch updates MAY be applied without review. Minor and major
  updates MUST be reviewed for breaking changes and bundle impact.

## Governance

This constitution supersedes all informal conventions, prior README guidance, and
verbal agreements. When a PR conflicts with a principle stated here, the constitution wins.

**Amendment procedure**:
1. Open a PR with the proposed change to this file.
2. State the principle being amended, the reason, and any migration impact.
3. Increment `CONSTITUTION_VERSION` per semantic versioning rules.
4. Update `LAST_AMENDED_DATE` to the merge date.
5. Propagate changes to affected templates in `.specify/templates/`.

**Versioning policy**:
- MAJOR: A principle is removed or its non-negotiable rules are weakened.
- MINOR: A new principle or mandatory section is added.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance review**: Constitution compliance MUST be verified during code review for
every PR. Violations MUST be documented in the Complexity Tracking section of the
relevant `plan.md` with explicit justification.

**Version**: 1.0.0 | **Ratified**: 2026-04-27 | **Last Amended**: 2026-04-27
