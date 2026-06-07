function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-btn');
  if (html.getAttribute('data-theme') === 'light') {
    html.setAttribute('data-theme', 'dark');
    btn.textContent = 'light';
  } else {
    html.setAttribute('data-theme', 'light');
    btn.textContent = 'dark';
  }
}

function toggleNav() {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const arrow = document.getElementById('nav-arrow');
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  arrow.textContent = open ? '▴' : '▾';
}

function initStickyNav() {
  const navBar = document.getElementById('nav-bar');
  const header = document.getElementById('site-header');

  const onScroll = () => {
    navBar.classList.toggle('is-scrolled', window.scrollY > header.offsetHeight * 0.6);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

async function updateVisitorCount() {
  try {
    const res = await fetch('https://YOUR_API_GATEWAY_URL/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    const count = data.count ?? data.visitor_count ?? '—';
    document.getElementById('visitor-count').textContent = Number(count).toLocaleString();
  } catch {
    document.getElementById('visitor-count').textContent = '—';
  }
}

function initNavHighlight() {
  const navLinks = document.querySelectorAll('.site-nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.site-nav a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-3.5rem 0px -40% 0px' });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}

document.getElementById('theme-btn').addEventListener('click', toggleTheme);
document.getElementById('nav-toggle').addEventListener('click', toggleNav);
initStickyNav();
updateVisitorCount();
initNavHighlight();
