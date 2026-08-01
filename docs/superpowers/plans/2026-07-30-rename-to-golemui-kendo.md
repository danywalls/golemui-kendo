# Rename repo/directory to `golemui-kendo` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename GitHub repo and local directory from `golemui-kendo-schematics` to `golemui-kendo`, updating all internal references.

**Architecture:** Single-pass rename: update file references while directory is still named `golemui-kendo-schematics`, then rename the directory and reconfigure git remote.

**Tech Stack:** git, GitHub, markdown

---

### Task 1: Update internal file references

**Files:**
- Modify: `package.json:21,24`
- Modify: `CONTRIBUTING.md:13,14,39`
- Modify: `.github/ISSUE_TEMPLATE/bug_report.md:3,24`

- [ ] **Step 1: Update `package.json` repository URLs**

Replace `golemui-kendo-schematics` → `golemui-kendo` in `repository.url` and `bugs.url`.

```json
"repository": {
  "url": "git+https://github.com/danywalls/golemui-kendo.git"
},
"bugs": {
  "url": "https://github.com/danywalls/golemui-kendo/issues"
}
```

- [ ] **Step 2: Update `CONTRIBUTING.md` references**

Replace `golemui-kendo-schematics` → `golemui-kendo` in:
- Line 13: clone URL
- Line 14: `cd` command
- Line 39: directory reference in step 1

- [ ] **Step 3: Fix stale scope in `bug_report.md`**

Replace `@golemui/kendo` → `@danywalls/golemui-kendo` in title and version line.

```markdown
about: Create a report to help us improve @danywalls/golemui-kendo
- `@danywalls/golemui-kendo` Version:
```

- [ ] **Step 4: Verify changes**

Run: `rg "golemui-kendo-schematics" --glob '!.git' --glob '!node_modules' --glob '!dist'`
Expected: no matches (all updated)

- [ ] **Step 5: Commit**

```bash
git add package.json CONTRIBUTING.md .github/ISSUE_TEMPLATE/bug_report.md
git commit -m "chore: update references for repo rename to golemui-kendo"
```

---

### Task 2: Rename GitHub repo and local directory

**Note:** This task requires GitHub credentials (`gh` CLI) and will change the working directory.

- [ ] **Step 1: Rename repo on GitHub**

Run: `gh repo edit danywalls/golemui-kendo-schematics --name golemui-kendo --default-branch main`
Expected: Repo renamed successfully

- [ ] **Step 2: Rename local directory and update remote**

```bash
cd /Users/danyparedes/Documents/projects
mv golemui-kendo-schematics golemui-kendo
cd golemui-kendo
git remote set-url origin https://github.com/danywalls/golemui-kendo.git
git remote -v
```
Expected: origin points to `danywalls/golemui-kendo`
