// Site content you edit. See README.md for every project field.

// YouTube/Vimeo URL or an .mp4/.webm path. Leave empty to hide the showreel.
export const showreel = '';

// Order here is the order on the page. Only id, title and summary are required.
export const projects = [
  {
    id: 'vr-game',
    title: 'Stereoscopic VR game',
    summary: 'Solo-developed stereoscopic VR game in Unreal Engine 4 for Oculus Rift and motion controllers.',
    description: [
      'Final-year university project, taken through the full development lifecycle from concept to delivery.',
      'Placeholder write-up. Describe the concept and core loop, the systems you built, and the technical challenges of stereoscopic rendering, motion controls and VR comfort.'
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
    images: [
      { src: 'assets/images/projects/vr-game.svg', alt: 'Gameplay (placeholder)' },
      { src: 'assets/images/projects/vr-game-2.svg', alt: 'Level design (placeholder)' }
    ]
  },
  {
    id: 'cpp-systems',
    title: 'C++ systems project',
    summary: 'Placeholder for a C++ project built while learning the language, such as an engine subsystem or gameplay framework.',
    description: ['Placeholder write-up. What the system does, the design decisions behind it, and what you learned about memory, performance or architecture along the way.'],
    year: '2026',
    tags: ['C++', 'Systems'],
    role: 'Solo developer',
    team: 'Solo',
    images: [{ src: 'assets/images/projects/systems.svg', alt: 'System overview (placeholder)' }]
  },
  {
    id: 'gameplay-prototype',
    title: 'Gameplay prototype',
    summary: 'Placeholder for a small prototype exploring a single mechanic.',
    description: ['Placeholder write-up. The mechanic you were testing, what you learned from playtesting, and how you iterated.'],
    year: '2025',
    tags: ['Prototype', 'Gameplay'],
    role: 'Gameplay programmer',
    images: [
      { src: 'assets/images/projects/prototype.svg', alt: 'Prototype (placeholder)' },
      { src: 'assets/images/projects/prototype-2.svg', alt: 'Level blockout (placeholder)' }
    ]
  },
  {
    id: 'game-jam',
    title: 'Game jam entry',
    summary: 'Placeholder for a game built in a weekend jam.',
    description: ['Placeholder write-up. The jam theme, team size and your role, and what you shipped in the time limit.'],
    year: '2025',
    tags: ['Game Jam', 'Gameplay'],
    role: 'Programmer',
    cover: 'assets/images/projects/game-jam.svg'
  },
  {
    id: 'build-tools',
    title: 'Automated build and test pipeline',
    summary: 'Placeholder for tooling that builds and tests a game project on every change.',
    description: ['Placeholder write-up. Draw on your CI/CD and Docker experience: automated builds, smoke tests and how it sped up iteration for the team.'],
    year: '2025',
    tags: ['Tools', 'CI/CD'],
    role: 'Tools programmer',
    cover: 'assets/images/projects/tools.svg'
  }
];
