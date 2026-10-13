# AGENTS.md

Instructions for AI coding agents working on this repo. Humans: see [README.md](README.md).

## What this is

Nam Le's game development portfolio, live at [nam-le.dev](https://nam-le.dev). A static [Astro](https://astro.build) 7 site styled with [Tailwind CSS](https://tailwindcss.com) 4, deployed to GitHub Pages.

The audience is **game development recruiters** hiring gameplay and systems programmers. Write every word for them.

## Layout

| Path | What it holds |
| --- | --- |
| `src/content/projects/*.md` | One Markdown file per project (front matter + write-up) |
| `src/content.config.js` | The project schema and the `disciplines` filter list |
| `src/data/site.js` | All other page text: contact links, stats, about, skills, experience, education, showreel |
| `src/components/*.astro` | One component per page section |
| `src/layouts/Base.astro` | `<head>`, fonts and the Content-Security-Policy |
| `src/pages/index.astro` | Puts the sections together |
| `src/styles/global.css` | Tailwind theme, light/dark colours, shared classes (`.panel`, `.viewport`, `.stamp`, `.specs`) |
| `public/` | Copied as-is: CV PDF, project images, `CNAME`, `boot.js` |
| `tests/site.spec.js` | Playwright tests |
| `.claude/agents/reviewer.md` | The review agent that approves or blocks each branch before it auto-merges |

## Commands

```sh
npm install
npm run dev       # http://localhost:4321, reloads on save
npm run build     # static site into dist/
npm run preview   # serve dist/
npm run check     # build + html-validate + Playwright, the same as CI
```

Playwright needs Chromium (`npx playwright install chromium`; in cloud sandboxes set `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` instead). Run `npm run check` before every push.

## Common tasks

- **Add or remove a project:** add or delete a file in `src/content/projects/`. Only `title`, `summary` and `discipline` are required; the full field list is in the README and `src/content.config.js`. See `.claude/skills/add-project/SKILL.md`.
- **Change page text** (about, skills, experience, stats, contact links, showreel): edit `src/data/site.js`, not the components.
- **Add an embed or form host:** add its domain to the CSP in `src/layouts/Base.astro`, or it will be blocked.

## Rules

- **Never commit secrets or personal info** beyond the intended public contact details (email, GitHub, LinkedIn). No phone numbers, home address, API keys or tokens. CI runs a gitleaks scan. Nam's original CV contains a phone number and must never be committed.
- **Keep experience wording honest.** Nam's background is writing code in test automation and CI/CD (Software Developer in Test). Never describe it as general "software engineering", and never invent engines, skills or projects Nam hasn't stated.
- **Design: clean, not flashy.** Keep the existing "engine editor" look (dark by default, amber accent). No gimmicky effects.
- **Keep code compact.** Small diffs, no new dependencies or abstractions unless needed.
- **Keep paths relative to the site root** (`/images/...`) and make sure the layout works from 320px wide.
- **Placeholders are expected.** Projects, the CV PDF and the form endpoint are placeholders Nam will fill in; don't flag them.

## Git and pull requests

- Work on a `claude/*` branch and push it. `.github/workflows/auto-pr.yml` opens the PR from the last commit message, so write the subject as the PR title and the body as **Before:** / **After:** / **How:** paragraphs.
- **No Claude session or chat links** (`claude.ai/code/...`) in commit messages or PR descriptions. A `Co-Authored-By` trailer is fine.
- Before pushing, commit and run the `reviewer` subagent (`.claude/agents/reviewer.md`) on your branch. Fix everything it marks `BLOCK`; it judges the commit message too.
- CI (`.github/workflows/ci.yml`, check name `check`) and the same reviewer in `.github/workflows/review.yml` (check name `review`) must pass. PRs squash-merge automatically once both are green; there is no human review step, except that the reviewer blocks, and `.github/CODEOWNERS` holds, changes to workflows, `.claude/` and these instructions until Nam approves them. Merging to `main` deploys via `.github/workflows/deploy.yml`.
