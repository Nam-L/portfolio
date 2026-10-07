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
    id: 'vr-game',
    title: 'Stereoscopic VR game',
    summary: 'Solo-developed VR game in Unreal Engine 4 for my final-year university project.',
    description: [
      'Placeholder write-up. Describe the concept and core loop, your role (design, programming, art), and the technical challenges of stereoscopic rendering and VR comfort.',
      'Add a showreel by setting the video field to a YouTube or Vimeo link.'
    ],
    year: '2019',
    tags: ['Unreal Engine', 'VR', 'Solo'],
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
    summary: 'A gameplay mod built with the BepInEx and Harmony modding frameworks.',
    description: [
      'Placeholder write-up. What the mod changes, which game it targets, and anything interesting about patching game code at runtime with Harmony.'
    ],
    year: '2024',
    tags: ['C#', 'Modding'],
    cover: 'assets/projects/game-mod.svg',
    images: [
      { src: 'assets/projects/game-mod.svg', alt: 'Mod in game (placeholder)' }
    ],
    video: '',
    github: '',
    links: []
  },
  {
    id: 'gameplay-prototype',
    title: 'Gameplay prototype',
    summary: 'Placeholder for a small prototype exploring a single mechanic.',
    description: [
      'Placeholder write-up. The mechanic you were testing, what you learned from playtesting, and how you iterated.'
    ],
    year: '2025',
    tags: ['Prototype', 'Gameplay'],
    cover: 'assets/projects/prototype.svg',
    images: [
      { src: 'assets/projects/prototype.svg', alt: 'Prototype (placeholder)' },
      { src: 'assets/projects/prototype-2.svg', alt: 'Level blockout (placeholder)' }
    ],
    video: '',
    github: '',
    links: []
  },
  {
    id: 'game-jam',
    title: 'Game jam entry',
    summary: 'Placeholder for a game built in a weekend jam.',
    description: [
      'Placeholder write-up. The jam theme, team size and your role, and what you shipped in the time limit.'
    ],
    year: '2025',
    tags: ['Game Jam', 'Gameplay'],
    cover: 'assets/projects/game-jam.svg',
    images: [],
    video: '',
    github: '',
    links: []
  },
  {
    id: 'build-tools',
    title: 'Automated build and test pipeline',
    summary: 'Placeholder for tooling that builds and tests a game project on every change.',
    description: [
      'Placeholder write-up. Draw on your CI and test automation experience: automated builds, smoke tests and how it sped up iteration for the team.'
    ],
    year: '2025',
    tags: ['Tools', 'C#'],
    cover: 'assets/projects/tools.svg',
    images: [],
    video: '',
    github: '',
    links: []
  }
];
