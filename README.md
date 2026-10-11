# Portfolio

Nam Le's portfolio, live at [nam-le.dev](https://nam-le.dev). Plain HTML, CSS and JavaScript modules with no build step, served by GitHub Pages from `main`.

## Structure

```
├── index.html               # the page
├── data/projects.js         # projects and showreel link: edit this to change content
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── boot.js          # runs before first paint: theme, 320px minimum width
│   │   ├── main.js          # entry point, imports the modules below
│   │   ├── ui.js            # theme toggle, header and menu
│   │   ├── projects.js      # project cards, filters, detail dialog, showreel
│   │   └── contact.js       # contact form
│   ├── images/              # icons.svg sprite and project images
│   └── cv/Nam-Le-CV.pdf     # "Download CV" target
└── tests/site.spec.js       # Playwright tests
```

## Run locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` straight from disk won't work, because browsers block JavaScript modules on `file://`.

## Projects

Each project is one object in `data/projects.js`. Copy a block to add one and delete a block to remove one; the order in the file is the order on the page. Filter chips are built from the projects' `tags`. Only `id`, `title` and `summary` are required.

```js
{
  id: 'my-project',                  // shareable link: /#project/my-project
  title: 'My project',
  summary: 'Shown on the card.',
  description: ['Paragraph one.', 'Paragraph two.'],
  year: '2025',
  tags: ['Unreal Engine', 'C++'],
  featured: true,                    // large card at the top of the grid
  role: 'Gameplay programmer',
  team: 'Team of 4',
  engine: 'Unreal Engine 5',
  platform: 'PC',
  highlights: ['Built the combat system'],  // "What I built", what recruiters look for
  cover: 'assets/images/projects/my-project.jpg', // defaults to the first image
  images: [{ src: 'assets/images/projects/my-project-2.jpg', alt: 'Boss fight' }],
  video: 'https://www.youtube.com/watch?v=VIDEO_ID', // YouTube, Vimeo or .mp4/.webm
  github: 'https://github.com/Nam-L/my-project',
  links: [{ label: 'Play on itch.io', url: 'https://example.itch.io/my-project' }]
}
```

Set `showreel` at the top of the same file to a video link to show a showreel under the intro.

## Contact form

Until `FORM_ENDPOINT` in `assets/js/contact.js` is set (for example to a [Formspree](https://formspree.io) endpoint), sending opens the visitor's email app with the message filled in.

## Checks

`.github/workflows/ci.yml` runs on every push and pull request: a [gitleaks](https://github.com/gitleaks/gitleaks) secret scan, HTML validation, a JS syntax check and the Playwright tests on desktop and mobile. The tests fail on any script error or missing file, and click through the filters, project details, CV link and contact form. They also check that the layout never overflows, the header never overlaps from 320px to 1400px, and narrower windows scale the page down.

```sh
npm install
npx playwright install chromium
npm run check
```

Pushing a `claude/*` branch runs `.github/workflows/auto-pr.yml`, which opens the pull request from the commit message so nothing else lands in its description. It needs **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**.

If you add a video host or form service other than YouTube, Vimeo or Formspree, add its domain to the `Content-Security-Policy` meta tag in `index.html`.
