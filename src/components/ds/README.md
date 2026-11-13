# Design System Foundation

This foundation extends the existing Football ID visual language. Reuse its tokens and shared components before introducing new styles or primitives. Product screens stay in their route or domain feature; shared UI does not contain domain business logic.

## Sources of Truth

- `src/styles.css` defines color, typography, radius, elevation, and visual utilities.
- `src/components/ui` contains low-level accessible controls and primitives.
- `src/components/ds` contains reusable product patterns such as page headers, filters, cards, tables, statuses, and states.
- `src/components/shell` owns application navigation and layout.

Do not hardcode a new color when a semantic token exists. Prefer `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `text-primary`, `text-success`, `text-warning`, `text-info`, and `text-error`/`text-destructive`. Use ink and signal tokens only for their established brand surfaces and identity emphasis.

## Type and Data Hierarchy

- `text-display`: rare, high-emphasis feature headings.
- `text-h1`: page title; `text-h2`: major section; `text-h3`: card or compact section title.
- `text-body`: primary explanatory copy; `text-small`: supporting information.
- `text-label`: compact metadata labels; `text-id`: Football IDs and other fixed identifiers.
- Use `tabular-nums` for counts, scores, dates, and standings values.

## Spacing and Layout

Tailwind's default spacing scale is the shared spacing scale (4px increments). Follow nearby patterns: `space-y-6` between page sections, `gap-4` for repeated items, `gap-6` for major columns, and `p-4`/`p-5` for component interiors. Prefer existing `surface`, `Section`, and page-header patterns over inventing new wrappers.

## Responsive Rules

Use mobile-first classes and add complexity at existing Tailwind breakpoints:

- Base/mobile: stack page headers and actions, use one-column layouts, keep controls full-width, and provide compact list rows where a table would overflow.
- `sm`: allow filters and repeated content to wrap into compact rows or two-column grids.
- `md`: introduce two-column page headers, desktop table layouts, and denser metadata when space permits.
- `lg`: use dashboard columns and multi-column data layouts.

Use the shared `DataTable` `mobileRow` option for responsive tables. Keep content readable without relying on horizontal scrolling for primary actions.

## Shared Components

- Actions: `Button` variants `default`, `outline`, `ghost`, `secondary`, and icon sizes.
- Forms: `Input`, Radix `Select`, `SearchInput`, and `FilterBar`.
- Navigation: `PageTabs`, `PageHeader`, and `Breadcrumbs`.
- Identity and records: `PersonAvatar`, `OrgCard`, `PlayerCard`, `TeamCrest`, and `FootballIdTag`.
- Data: `StatusBadge`, `DataTable`, `Section`, `InfoList`, and `StatCard`.
- Feedback: `EmptyState`, `LoadingState`, `SuccessState`, `ErrorState`, and `PermissionState`.
- Confirmation and notifications: `ConfirmDialog` and the root-mounted Sonner `Toaster`.

Use `StatusBadge` for domain lifecycle status. Use `SuccessState` for a completed screen-level action, `ErrorState` for a recoverable failure, and `PermissionState` when information is intentionally unavailable to the current user. These UI states do not replace authorization checks in future services or APIs.

## Accessibility

Use the existing control labels and focus styles, keep icon-only actions named with `aria-label`, announce loading politely and errors assertively, and do not communicate state by color alone. Dialogs and selects should continue using the existing Radix wrappers.