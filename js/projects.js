/*
 * Projects shown in the Projects section.
 *
 * To add a project, copy one of the blocks below and edit it.
 * To remove a project, delete its block. Order here is the order on the page.
 *
 * Fields (only id, title and summary are required):
 *   id          Unique, URL-safe slug. Used for the shareable link (#project/<id>).
 *   title       Card and detail heading.
 *   summary     One or two sentences shown on the card.
 *   description Array of paragraphs shown in the expanded view.
 *   year        Shown next to the title, e.g. '2024' or '2023 — 2024'.
 *   tags        Used for the filter chips. Keep spelling consistent across projects.
 *   cover       Card image. Falls back to the first entry of `images`.
 *   images      [{ src, alt }] gallery for the expanded view.
 *   video       YouTube or Vimeo URL, or a path to an .mp4/.webm file.
 *               e.g. 'https://www.youtube.com/watch?v=VIDEO_ID'
 *                    'https://vimeo.com/123456789'
 *                    'assets/projects/my-showreel.mp4'
 *   github      Repository URL.
 *   links       [{ label, url }] any extra links (live demo, write-up, store page...).
 */
window.PROJECTS = [
  {
    id: 'ci-migration',
    title: 'CircleCI to GitHub Actions migration',
    summary: 'Moved multiple automation suites to GitHub Actions, cutting pipeline costs and improving build reliability.',
    description: [
      'Placeholder write-up. Describe the problem, what you owned, and the outcome.',
      'For example: reusable workflows, caching strategy, matrix builds across web and mobile suites, and how cost and flakiness were measured before and after.'
    ],
    year: '2023',
    tags: ['CI/CD', 'GitHub Actions', 'Docker'],
    cover: 'assets/projects/ci-migration.svg',
    images: [
      { src: 'assets/projects/ci-migration.svg', alt: 'Pipeline overview (placeholder)' }
    ],
    video: '',
    github: '',
    links: []
  },
  {
    id: 'homelab',
    title: 'Self-hosted homelab',
    summary: 'Containerised services on a home server, covering networking, storage and service reliability.',
    description: [
      'Placeholder write-up. List the services you run, how they are deployed (Docker Compose, K3s), and how you handle backups, updates and monitoring.'
    ],
    year: '2021 — Present',
    tags: ['Docker', 'Kubernetes', 'Linux'],
    cover: 'assets/projects/homelab.svg',
    images: [
      { src: 'assets/projects/homelab.svg', alt: 'Homelab dashboard (placeholder)' },
      { src: 'assets/projects/homelab-2.svg', alt: 'Service layout (placeholder)' }
    ],
    video: '',
    github: 'https://github.com/Nam-L',
    links: []
  },
  {
    id: 'portfolio',
    title: 'This site',
    summary: 'This portfolio, hosted for free on GitHub Pages.',
    description: [
      'Plain HTML, CSS and JavaScript with no build step. Every push to main is published automatically by GitHub Pages.'
    ],
    year: '2026',
    tags: ['JavaScript', 'GitHub Pages'],
    cover: 'assets/projects/portfolio.svg',
    images: [],
    video: '',
    github: 'https://github.com/Nam-L/portfolio',
    links: []
  },
  {
    id: 'vr-game',
    title: 'Stereoscopic VR game',
    summary: 'Solo-developed VR game in Unreal Engine 4 for my final-year university project.',
    description: [
      'Placeholder write-up. Describe the concept, the technical challenges of stereoscopic rendering and comfort, and what you would do differently.',
      'Add a showreel by setting the video field to a YouTube or Vimeo link.'
    ],
    year: '2019',
    tags: ['Unreal Engine', 'Game Dev'],
    cover: 'assets/projects/vr-game.svg',
    images: [
      { src: 'assets/projects/vr-game.svg', alt: 'Gameplay (placeholder)' },
      { src: 'assets/projects/vr-game-2.svg', alt: 'Level design (placeholder)' }
    ],
    video: '',
    github: '',
    links: []
  },
  {
    id: 'game-mod',
    title: 'Game mod plugin',
    summary: 'A plugin built with the BepInEx and Harmony modding frameworks.',
    description: [
      'Placeholder write-up. What the mod does, which game it targets, and anything interesting about patching with Harmony.'
    ],
    year: '2024',
    tags: ['C#', 'Game Dev'],
    cover: 'assets/projects/game-mod.svg',
    images: [
      { src: 'assets/projects/game-mod.svg', alt: 'Mod in game (placeholder)' }
    ],
    video: '',
    github: '',
    links: []
  }
];
