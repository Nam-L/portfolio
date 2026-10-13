---
name: add-project
description: Add, edit or remove a project on the portfolio's Projects section (a Markdown file in src/content/projects/).
---

# Add a project

1. Ask Nam for anything you don't know. Never invent details: missing facts stay as clearly marked `'Placeholder: ...'` text.
2. Create `src/content/projects/<slug>.md`. The slug becomes the link (`/#project/<slug>`), so use short kebab-case.
3. Fill in the front matter. Required: `title`, `summary`, `discipline` (one of the `disciplines` in `src/content.config.js`). Useful for recruiters: `role`, `team`, `engine`, `platform`, `duration`, `highlights` (what Nam personally built), `challenge` (`problem` + `solution`). Media: `cover`, `images` (`{ src, alt }`), `video` (YouTube, Vimeo or a file in `public/`), `clip` (short muted loop), `github`, `links` (`{ label, url }`). The README has a full example.
4. Set `order` (lower comes first). Only one project should have `featured: true`.
5. Put images in `public/images/projects/` and videos in `public/videos/`, referenced as `/images/projects/<file>`.
6. Write the overview under the front matter: what the game is, Nam's part in it, and the result. Plain, specific, written for game dev recruiters.
7. Run `npm run check`. Schema errors show up in the build step.

To remove a project, delete its file and any images only it used. If it was `featured`, mark another one.
