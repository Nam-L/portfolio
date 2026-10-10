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
 *   links       [{ label, url }] any extra links (playable build, itch.io, write-up...).
 *   featured    true to show the project as the large card at the top of the grid.
 *               Put your strongest project first and mark it featured.
 *   role        Your role, e.g. 'Gameplay programmer' or 'Solo developer'.
 *   team        Team size, e.g. 'Solo' or 'Team of 4'.
 *   engine      Engine or framework, e.g. 'Unreal Engine 4'.
 *   platform    e.g. 'PC', 'PC VR (Oculus Rift)'.
 *   highlights  Short list of the things you personally built. Shown as
 *               "What I built" in the expanded view; recruiters look for this.
 */

// Showreel shown under the intro. YouTube or Vimeo URL, or an .mp4/.webm path.
// Leave empty to hide the section. Aim for 60-90 seconds, best footage first.
window.SHOWREEL = '';

window.PROJECTS = [
  {
    id: 'vr-game',
    title: 'Stereoscopic VR game',
    summary: 'Solo-developed stereoscopic VR game in Unreal Engine 4 for Oculus Rift and motion controllers.',
    description: [
      'Final-year university project, taken through the full development lifecycle from concept to delivery.',
      'Placeholder write-up. Describe the concept and core loop, the systems you built, and the technical challenges of stereoscopic rendering, motion controls and VR comfort.',
      'Add a showreel by setting the video field to a YouTube or Vimeo link.'
    ],
    year: '2018',
    tags: ['Unreal Engine', 'VR', 'Solo'],
    featured: true,
    role: 'Solo developer',
    team: 'Solo',
    engine: 'Unreal Engine 4',
    platform: 'PC VR (Oculus Rift)',
    highlights: [
      'Placeholder: the systems you built, e.g. motion-controller interaction.',
      'Placeholder: a technical challenge you solved, e.g. VR comfort or performance.'
    ],
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
    id: 'cpp-systems',
    title: 'C++ systems project',
    summary: 'Placeholder for a C++ project built while learning the language, such as an engine subsystem or gameplay framework.',
    description: [
      'Placeholder write-up. What the system does, the design decisions behind it, and what you learned about memory, performance or architecture along the way.'
    ],
    year: '2026',
    tags: ['C++', 'Systems'],
    role: 'Solo developer',
    team: 'Solo',
    cover: 'assets/projects/systems.svg',
    images: [
      { src: 'assets/projects/systems.svg', alt: 'System overview (placeholder)' }
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
    role: 'Gameplay programmer',
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
    role: 'Programmer',
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
      'Placeholder write-up. Draw on your CI/CD and Docker experience: automated builds, smoke tests and how it sped up iteration for the team.'
    ],
    year: '2025',
    tags: ['Tools', 'CI/CD'],
    role: 'Tools programmer',
    cover: 'assets/projects/tools.svg',
    images: [],
    video: '',
    github: '',
    links: []
  }
];
