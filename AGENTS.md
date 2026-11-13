<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Future ("Coming soon") module scope lives only in `src/config/module-blueprints.ts`; `/modules` pages render it and `future-modules-baseline.md` is generated from it via `bun scripts/generate-module-baseline.ts` — never hand-edit the markdown, so app and document cannot drift.
- Navigation reads from the module registry in `src/config/modules.ts`; a module moves `soon` → `preview` (interactive prototype on mock data, keeps its blueprint, still under "Coming soon") → `live` (blueprint removed), changing only `status` and `path`, so the shell never needs redesign.
- Preview modules keep their own mock data and access in `src/data/<id>-mock.ts` + `src/data/<id>-repository.ts` and `src/lib/<id>-access.ts`, so parallel module work never collides in the shared mock files.
