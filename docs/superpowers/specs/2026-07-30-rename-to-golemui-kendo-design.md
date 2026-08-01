# Rename repo/directory from `golemui-kendo-schematics` to `golemui-kendo`

## Problem

The npm package is `@danywalls/golemui-kendo` but the repo and directory are `golemui-kendo-schematics`. This mismatch causes friction: someone searching GitHub for `golemui-kendo` won't find the repo, and the directory name doesn't match the package name.

## Scope

1. Rename GitHub repository from `golemui-kendo-schematics` to `golemui-kendo`
2. Rename local directory accordingly
3. Update internal file references to the old repo name

## Files to update

| File | What to change |
|------|---------------|
| `package.json` | `repository.url` and `bugs.url` — replace `golemui-kendo-schematics` with `golemui-kendo` |
| `CONTRIBUTING.md` | Clone URL, `cd` command, and directory reference in step 1 |
| `.github/ISSUE_TEMPLATE/bug_report.md` | `@golemui/kendo` → `@danywalls/golemui-kendo` (drive-by fix: stale scope) |

## Non-goals

- No changes to npm package name (stays `@danywalls/golemui-kendo`)
- No changes to source code or schematics logic
- No changes to published artifacts or collection.json

## Approach

1. Update file references in-place while directory is still `golemui-kendo-schematics`
2. Rename GitHub repo via web UI
3. Rename local directory to match
4. Update git remote URL to point to new repo name
