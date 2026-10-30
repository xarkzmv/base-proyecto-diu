<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep complete daily-menu presentation data in a browser-safe module separate from the subscription/reservation model; this lets availability evolve without changing those flows.
- Reuse shared stock for existing main dishes and independent mock stock for the second main option; locations must never share a single availability indicator.
