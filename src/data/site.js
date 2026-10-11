// Everything on the page apart from projects (those are in src/content/projects).

export const email = 'Nam.NL@protonmail.com';
export const cv = '/cv/Nam-Le-CV.pdf';
export const github = 'https://github.com/Nam-L';
export const linkedin = 'https://linkedin.com/in/namnl';

// YouTube/Vimeo URL or a video file in public/. Leave empty to hide the showreel.
export const showreel = '';

// The strip of facts under the intro: [value, label]
export const stats = [
  ['6+ years', 'Writing code in test automation and CI/CD'],
  ['First Class', 'BSc Games Design and Development'],
  ['Unreal Engine 4', 'Solo VR final project'],
  ['London', 'Open to relocation']
];

export const about = [
  "I have a First Class Honours degree in Games Design and Development and more than six years of professional experience writing code as a software developer in test, building automation suites and CI/CD pipelines. I'm passionate about games and systems programming, and I bring a strong foundation in engineering discipline: delivery pipelines, code quality and collaborative development.",
  "I'm now pursuing a move into the games industry as a gameplay or systems programmer, and I'm learning C++ to get there.",
  "Outside work I play a lot of JRPGs, MMOs, rhythm games and retro games. I'm an active Final Fantasy XIV and Destiny 2 player with a real interest in game systems design and player experience. I also run a self-hosted homelab of containerised services in Docker."
];

export const skills = {
  Languages: ['C#', 'Python', 'TypeScript', 'JavaScript', 'Java', 'Bash', 'SQL', 'C++ (learning)'],
  'Game development': ['Unreal Engine 4', 'VR development', 'Game systems design', 'Game engine architecture'],
  'Tools & pipelines': ['Git', 'GitHub Actions', 'CircleCI', 'Docker', 'AWS', 'Code review'],
  Systems: ['Unix/Linux', 'Networking', 'Storage', 'Self-hosted services']
};

export const experience = [
  {
    role: 'Software Developer in Test', company: 'Lavanda', dates: 'June 2022 — July 2026',
    points: [
      'Owned and migrated CI/CD infrastructure from CircleCI to GitHub Actions, taking end-to-end ownership of the delivery pipeline.',
      'Contributed directly to the production React / Next.js codebase, fixing frontend bugs beyond a single engineering discipline.',
      'Drove framework evaluation and tooling adoption across the engineering team, applying systematic technical decision making to real production systems.',
      'Worked with containerised environments in Docker, including Dockerfile authoring for consistent execution across CI and local environments.'
    ]
  },
  {
    role: 'Test Engineer', company: 'Vidsy', dates: 'Sept 2021 — May 2022',
    points: [
      'Extended and maintained delivery pipelines (CircleCI) and browser automation suites (TypeScript, WebdriverIO) in a fast-moving startup.',
      'Improved API test data generation for GraphQL and RPC integrations, reducing false signal in integration results.'
    ]
  },
  {
    role: 'Automation Test Engineer', company: 'Companies House', dates: 'Sept 2019 — Sept 2021',
    points: [
      'Built automation suites across multiple government digital projects in Java (Selenium, Cucumber) with direct pipeline integration.',
      'Ran systematic technical evaluations of multiple frameworks, building prototype implementations to inform the decision.'
    ]
  }
];

export const education = {
  degree: 'BSc Games Design and Development', school: 'Manchester Metropolitan University',
  dates: '2016 — 2018', grade: 'First Class Honours',
  note: 'Final project: a solo-developed stereoscopic VR game in Unreal Engine 4 for Oculus Rift and motion controllers, from concept through delivery.',
  modules: ['Game Engine Architecture', 'Web Development', 'UX Design', 'Agile Project Management']
};
