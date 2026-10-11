// Theme toggle, sticky header and the section menu.

export function initTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-btn');
  const sync = () => btn.setAttribute('aria-label',
    html.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');

  btn.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', html.dataset.theme); } catch { /* storage blocked */ }
    sync();
  });
  sync();
}

export function initNav() {
  const header = document.getElementById('nav-bar');
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');

  const setOpen = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the menu link for the section in the middle of the screen
  const links = nav.querySelectorAll('a[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries.filter(e => e.isIntersecting)) {
      links.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}
