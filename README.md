# Portfolio

Personal portfolio site. Static HTML/CSS/JS — no build step.

## Structure

```
├── index.html
├── css/styles.css
├── js/
│   ├── main.js          # theme, nav, projects grid + detail view, contact form
│   └── projects.js      # project data (edit this to add/remove projects)
├── assets/
│   ├── cv/Nam-Le-CV.pdf # "Download CV" target
│   └── projects/        # project images and videos
└── infra/               # Terraform: S3 bucket + upload
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
  tags: ['Docker', 'AWS'],
  cover: 'assets/projects/my-project.jpg',
  images: [{ src: 'assets/projects/my-project-2.jpg', alt: 'Dashboard' }],
  video: 'https://www.youtube.com/watch?v=VIDEO_ID', // YouTube, Vimeo, or an .mp4/.webm path
  github: 'https://github.com/Nam-L/my-project',
  links: [{ label: 'Live demo', url: 'https://example.com' }]
}
```

## Contact form

The site is static, so the form posts to a form service. Create a form at [formspree.io](https://formspree.io) and set `CONTACT_FORM_ENDPOINT` near the bottom of `js/main.js` to its endpoint (e.g. `https://formspree.io/f/abcdwxyz`). Until it's set, submitting opens the visitor's email app with the message pre-filled.

## Deploy

```sh
cd infra
terraform init
terraform apply
```

Uploads `*.html` plus everything under `css/`, `js/` and `assets/` with the right content types.
