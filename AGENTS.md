# WP Definitivo release policy

- This repository is the only editable source for the distributable WP Definitivo theme.
- Edit theme files only under `wp-definitivo/` in this repository.
- Run `npm run release:check` before producing a package.
- Keep the current submission ZIP only at `C:\Users\leand\Documents\WP Definitivo\submission`.
- Use only `C:\Users\leand\Local Sites\staging-tema-defaul` to install and validate the distributable package.
- Treat `staging-2` as an integration test site only. Never copy theme changes from it and do not synchronize releases to it.
- Treat `C:\Users\leand\Documents\WP Definitivo\artifacts\archive` as read-only historical material.
- `C:\Users\leand\Documents\WP Definitivo\theme-source` is a junction to this repository, not another source copy.
