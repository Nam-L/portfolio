# Portfolio

Personal portfolio site. Static HTML/CSS/JS — no build step.

## Structure

```
├── index.html
├── css/styles.css
├── js/
│   ├── boot.js          # runs before first paint: light/dark theme, 320px minimum width
│   ├── main.js          # theme toggle, nav, projects grid + detail view, contact form
│   └── projects.js      # project data and showreel link (edit this to add/remove projects)
├── assets/
│   ├── cv/Nam-Le-CV.pdf # "Download CV" target
│   └── projects/        # project images and videos
└── .nojekyll            # tells GitHub Pages to serve files as-is
```

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Projects

Each project is one object in `js/projects.js`. Copy a block to add one, delete a block to remove one; the order in the file is the order on the page. Filter chips are built automatically from the `tags` of all projects.

```js
{
  id: 'my-project',                 // used for the shareable link: /#project/my-project
  title: 'My project',
  summary: 'Shown on the card.',
  description: ['Paragraph one.', 'Paragraph two.'],
  year: '2025',
  tags: ['Unreal Engine', 'VR'],
  cover: 'assets/projects/my-project.jpg',
  images: [{ src: 'assets/projects/my-project-2.jpg', alt: 'Dashboard' }],
  video: 'https://www.youtube.com/watch?v=VIDEO_ID', // YouTube, Vimeo, or an .mp4/.webm path
  github: 'https://github.com/Nam-L/my-project',
  links: [{ label: 'Play on itch.io', url: 'https://example.itch.io/my-project' }],
  featured: true,                   // large card at the top of the grid
  role: 'Gameplay programmer',      // shown on the card and in the details
  team: 'Team of 4',
  engine: 'Unreal Engine 5',
  platform: 'PC',
  highlights: ['Built the combat system', 'Wrote the save/load system'] // "What I built"
}
```

Put your strongest project first. Recruiters skim, so `role` and `highlights` (what you personally built) matter most.

## Showreel

Set `window.SHOWREEL` at the top of `js/projects.js` to a YouTube or Vimeo link (or an .mp4/.webm path) and a showreel section appears under the intro. Leave it empty to hide it.

## Contact form

The site is static, so the form posts to a form service. Create a form at [formspree.io](https://formspree.io) and set `CONTACT_FORM_ENDPOINT` near the bottom of `js/main.js` to its endpoint (e.g. `https://formspree.io/f/abcdwxyz`). Until it's set, submitting opens the visitor's email app with the message pre-filled.

## Checks

Every pull request runs `.github/workflows/ci.yml`: a [gitleaks](https://github.com/gitleaks/gitleaks) scan for committed secrets, HTML validation, a JS syntax check, and Playwright browser tests (desktop and mobile) that load the site under `/portfolio/` like GitHub Pages, fail on any script error or missing file, check every project's data and images, and click through filters, project details, the CV link and the contact form. They also check the layout never overflows on phone widths, the header never overlaps or wraps at any width from 320px to 1400px, and that windows narrower than 320px scale the page down instead of squashing it or scrolling sideways.

Run them locally:

```sh
npm install
npx playwright install chromium
npm run check
```

If you add a video host or a form service other than YouTube, Vimeo or Formspree, add its domain to the `Content-Security-Policy` meta tag in `index.html`, or the browser will block it.

## Deploy (GitHub Pages)

One-time setup: in the repo go to **Settings → Pages**, set **Source** to "Deploy from a branch", pick `main` and `/ (root)`, and save. The site is then published at https://nam-l.github.io/portfolio/ and updates on every push to `main`.

To use your own domain later, add it under Settings → Pages → Custom domain.
