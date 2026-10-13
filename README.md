# Portfolio

Nam Le's game development portfolio, live at [nam-le.dev](https://nam-le.dev). Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com) into a static site, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

## Structure

```
├── src/
│   ├── content/projects/    # one Markdown file per project: edit these to change projects
│   ├── data/site.js         # contact links, about, skills, experience, education, showreel
│   ├── components/          # one .astro file per page section
│   ├── layouts/Base.astro   # <head>, fonts and Content-Security-Policy
│   ├── pages/index.astro    # puts the sections together
│   ├── styles/global.css    # Tailwind theme, light and dark colours, shared classes
│   └── content.config.js    # the fields a project can have
├── public/                  # copied as-is: CV PDF, project images, CNAME, boot.js
└── tests/site.spec.js       # Playwright tests
```

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321, reloads on save
```

## Projects

Each project is a Markdown file in `src/content/projects/`. Copy one to add a project and delete one to remove it. The file name is the project's link (`/#project/vr-game`), `order` sets its place on the page, and the text under the front matter is the overview shown in its detail view. The filters are the `discipline` values (Gameplay, Systems & C++, Tools & CI, Game jams; the list is in `src/content.config.js`). Only `title`, `summary` and `discipline` are required. The featured project (or the first one) is also shown in the intro on wide screens.

```md
---
title: My project
summary: Shown on the card.
order: 1
featured: true                 # large card at the top of the grid
discipline: Gameplay
status: Prototype              # stamp on the card: Prototype, Jam build, Shipped...
year: '2025'
tags: [Unreal Engine, C++]
role: Gameplay programmer
team: Team of 4
engine: Unreal Engine 5
platform: PC
duration: 3 months
highlights:                    # "My contribution", what recruiters look for
  - Built the combat system
challenge:                     # one problem you solved and how
  problem: Enemies clipped through walls at high speed.
  solution: Swept collision for fast movers, which fixed it at no frame cost.
code:                          # a short excerpt shown in the details
  file: CombatComponent.cpp
  source: |
    void UCombatComponent::Attack() { ... }
cover: /images/projects/my-project.jpg   # defaults to the first image
images:
  - { src: /images/projects/my-project-2.jpg, alt: Boss fight }
video: https://www.youtube.com/watch?v=VIDEO_ID   # YouTube, Vimeo or a file in public/
clip: /videos/my-project.mp4   # short muted loop that plays on the card on hover
github: https://github.com/Nam-L/my-project
links:
  - { label: Play on itch.io, url: https://example.itch.io/my-project }
---

Write-up paragraphs go here.
```

Put images in `public/images/projects/`. Set `showreel` in `src/data/site.js` to a video link to show a showreel under the intro.

## Contact form

Until `FORM_ENDPOINT` in `src/components/Contact.astro` is set (for example to a [Formspree](https://formspree.io) endpoint), sending opens the visitor's email app with the message filled in.

## Checks

`.github/workflows/ci.yml` runs on every push and pull request: a [gitleaks](https://github.com/gitleaks/gitleaks) secret scan, the build, HTML validation of the built page and the Playwright tests on desktop and mobile. The tests fail on any script error or missing file, and click through the filters, project details, CV link and contact form. They also check that the layout never overflows, the header never overlaps from 320px to 1400px, and narrower windows scale the page down.

```sh
npx playwright install chromium
npm run check
```

`.github/workflows/review.yml` runs on every `claude/*` push: a separate Claude agent, defined in `.claude/agents/reviewer.md`, reviews the branch against the rules in `AGENTS.md` and fails the `review` check unless it approves. It takes the reviewer and the agent instructions from `main`, so a branch can't loosen its own review. `.github/CODEOWNERS` makes changes to CI, `.claude/` and the agent instructions wait for Nam's approval. Setup: add an `ANTHROPIC_API_KEY` repository secret, and in the branch protection for `main` add `review` as a required status check next to `check` and turn on **Require review from Code Owners** (with 0 required approvals, so other PRs still merge on their own).

## Deploying

Merging to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`. It needs **Settings → Pages → Source** set to **GitHub Actions**.

Pushing a `claude/*` branch runs `.github/workflows/auto-pr.yml`, which opens the pull request from the commit message so nothing else lands in its description. It needs **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**.

If you add a video host or form service other than YouTube, Vimeo or Formspree, add its domain to the Content-Security-Policy in `src/layouts/Base.astro`.
