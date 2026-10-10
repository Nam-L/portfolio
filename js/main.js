function syncThemeButton() {
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  document.getElementById('theme-btn').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch { /* storage blocked */ }
  syncThemeButton();
}

function setNavOpen(open) {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function initNav() {
  const nav = document.getElementById('site-nav');
  document.getElementById('nav-toggle').addEventListener('click', () =>
    setNavOpen(!nav.classList.contains('open')));
  // Picking a section on the mobile menu closes it
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNavOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNavOpen(false); });
}

function initStickyNav() {
  const header = document.getElementById('nav-bar');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
  }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}

/* ── Projects ── */

// Small DOM helper: el('a', { href, class: 'x' }, child, 'text', ...)
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
}

function externalLink(href, label, className) {
  return el('a', { href, class: className, target: '_blank', rel: 'noopener' }, label);
}

// Turns a YouTube/Vimeo URL or a video file path into an embeddable element.
function videoEmbed(url, title) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  let src = null;
  if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  else if (vimeo) src = `https://player.vimeo.com/video/${vimeo[1]}`;

  if (src) {
    return el('iframe', {
      src, title: `${title} video`, loading: 'lazy',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowfullscreen: true
    });
  }
  return el('video', { src: url, controls: true, preload: 'metadata', playsinline: true });
}

function projectCover(project) {
  return project.cover || (project.images && project.images[0] && project.images[0].src) || '';
}

function renderProjectCard(project) {
  const cover = projectCover(project);
  const badges = [
    project.video && el('span', { class: 'badge' }, 'Video'),
    project.github && el('span', { class: 'badge' }, 'Code'),
    project.images && project.images.length > 1 && el('span', { class: 'badge' }, `${project.images.length} images`)
  ];
  const byline = [project.role, project.engine].filter(Boolean).join(' · ');

  return el('button', {
      class: 'project-card' + (project.featured ? ' is-featured' : ''), type: 'button', 'data-id': project.id,
      'aria-haspopup': 'dialog', 'aria-label': `Open details for ${project.title}`
    },
    el('div', { class: 'project-thumb' + (cover ? '' : ' is-empty') },
      cover ? el('img', { src: cover, alt: '', loading: 'lazy' }) : el('span', {}, project.title.charAt(0)),
      project.featured && el('span', { class: 'featured-label' }, 'Featured')
    ),
    el('div', { class: 'project-card-body' },
      el('div', { class: 'project-card-head' },
        el('h3', { class: 'project-title' }, project.title),
        project.year && el('span', { class: 'project-year' }, project.year)
      ),
      byline && el('p', { class: 'project-byline' }, byline),
      el('p', { class: 'project-summary' }, project.summary),
      project.featured && project.highlights && project.highlights.length && el('ul', { class: 'plain-list project-highlights' },
        project.highlights.slice(0, 3).map(h => el('li', {}, h))),
      el('div', { class: 'project-card-foot' },
        el('ul', { class: 'tag-list' }, (project.tags || []).map(t => el('li', { class: 'tag' }, t))),
        el('div', { class: 'badges' }, badges)
      )
    )
  );
}

function initProjects() {
  const projects = (window.PROJECTS || []).filter(p => p && p.id && p.title);
  const grid = document.getElementById('project-grid');
  const filters = document.getElementById('project-filters');
  const empty = document.getElementById('project-empty');
  const dialog = document.getElementById('project-dialog');
  if (!grid) return;

  const byId = new Map(projects.map(p => [p.id, p]));
  const cards = projects.map(renderProjectCard);
  grid.append(...cards);

  // Filter chips, ordered by how many projects use each tag
  const counts = new Map();
  projects.forEach(p => (p.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
  const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));
  let activeTag = 'All';

  const chip = (tag, count) => el('button', {
    class: 'filter-chip', type: 'button', 'data-tag': tag, 'aria-pressed': tag === activeTag ? 'true' : 'false'
  }, tag, el('span', { class: 'chip-count' }, String(count)));

  if (tags.length) {
    filters.append(chip('All', projects.length), ...tags.map(t => chip(t, counts.get(t))));
  }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    filters.querySelectorAll('.filter-chip').forEach(c =>
      c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'));
    let shown = 0;
    cards.forEach(card => {
      const match = activeTag === 'All' || (byId.get(card.dataset.id).tags || []).includes(activeTag);
      card.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  });

  // Detail dialog
  const media = document.getElementById('pd-media');
  const meta = document.getElementById('pd-meta');
  const facts = document.getElementById('pd-facts');
  const highlights = document.getElementById('pd-highlights');
  const title = document.getElementById('pd-title');
  const desc = document.getElementById('pd-desc');
  const links = document.getElementById('pd-links');
  let lastFocus = null;

  function renderMedia(project) {
    const items = [];
    if (project.video) items.push({ type: 'video', src: project.video });
    (project.images || []).forEach(img => items.push({ type: 'image', ...img }));
    media.replaceChildren();
    media.hidden = items.length === 0;
    if (!items.length) return;

    const stage = el('div', { class: 'pd-stage' });
    const show = item => {
      stage.replaceChildren(item.type === 'video'
        ? videoEmbed(item.src, project.title)
        : el('img', { src: item.src, alt: item.alt || project.title }));
    };
    show(items[0]);
    media.append(stage);

    if (items.length > 1) {
      const strip = el('div', { class: 'pd-thumbs', role: 'group', 'aria-label': 'Media' });
      items.forEach((item, i) => {
        const thumb = el('button', {
            class: 'pd-thumb' + (item.type === 'video' ? ' is-video' : ''), type: 'button',
            'aria-label': item.type === 'video' ? 'Play video' : (item.alt || `Image ${i + 1}`),
            'aria-current': i === 0 ? 'true' : 'false'
          },
          item.type === 'video'
            ? el('span', { 'aria-hidden': 'true' }, '▶')
            : el('img', { src: item.src, alt: '', loading: 'lazy' })
        );
        thumb.addEventListener('click', () => {
          strip.querySelectorAll('.pd-thumb').forEach(t => t.setAttribute('aria-current', t === thumb ? 'true' : 'false'));
          show(item);
        });
        strip.append(thumb);
      });
      media.append(strip);
    }
  }

  function openProject(id, { updateHash = true } = {}) {
    const project = byId.get(id);
    if (!project) return;
    renderMedia(project);
    meta.replaceChildren(
      project.year && el('span', { class: 'project-year' }, project.year),
      el('ul', { class: 'tag-list' }, (project.tags || []).map(t => el('li', { class: 'tag' }, t)))
    );
    title.textContent = project.title;

    const factEls = [['Role', project.role], ['Team', project.team], ['Engine', project.engine], ['Platform', project.platform]]
      .filter(([, value]) => value)
      .map(([label, value]) => el('div', {}, el('dt', {}, label), el('dd', {}, value)));
    facts.replaceChildren(...factEls);
    facts.hidden = factEls.length === 0;

    const built = project.highlights || [];
    highlights.replaceChildren(...(built.length ? [
      el('h3', { class: 'mini-label' }, 'What I built'),
      el('ul', { class: 'plain-list' }, built.map(h => el('li', {}, h)))
    ] : []));
    highlights.hidden = built.length === 0;
    const paragraphs = [].concat(project.description || project.summary || []);
    desc.replaceChildren(...paragraphs.map(p => el('p', {}, p)));

    const linkEls = [];
    if (project.github) linkEls.push(externalLink(project.github, 'View on GitHub', 'btn btn-primary'));
    (project.links || []).forEach(l => l && l.url && linkEls.push(externalLink(l.url, l.label || l.url, 'btn')));
    links.replaceChildren(...linkEls);
    links.hidden = linkEls.length === 0;

    if (updateHash) history.replaceState(null, '', `#project/${encodeURIComponent(id)}`);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
    dialog.scrollTop = 0;
  }

  function onClose() {
    media.replaceChildren(); // stops any playing video
    document.body.classList.remove('dialog-open');
    if (location.hash.startsWith('#project/')) {
      history.replaceState(null, '', location.pathname + location.search + '#projects');
    }
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.project-card');
    if (card) openProject(card.dataset.id);
  });
  document.getElementById('pd-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', onClose);
  // Click on the backdrop (outside the panel) closes
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  const fromHash = () => {
    const m = location.hash.match(/^#project\/(.+)$/);
    if (m) openProject(decodeURIComponent(m[1]), { updateHash: false });
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
}

/* ── Showreel ── */

function initShowreel() {
  const url = window.SHOWREEL;
  const section = document.getElementById('showreel');
  if (!url || !section) return;
  document.getElementById('showreel-frame').append(videoEmbed(url, 'Showreel'));
  section.hidden = false;
}

/* ── Contact form ── */

// Create a free form at https://formspree.io and paste its endpoint here,
// e.g. 'https://formspree.io/f/abcdwxyz'. Any endpoint that accepts a
// form POST and returns JSON will work.
const CONTACT_FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'Nam.NL@protonmail.com';

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind || '';
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      setStatus('Please fill in your name, a valid email and a message.', 'error');
      form.querySelector(':invalid').focus();
      return;
    }

    const data = new FormData(form);
    if (data.get('_gotcha')) return; // bot

    if (!CONTACT_FORM_ENDPOINT) {
      // No endpoint yet: hand off to the visitor's mail client
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} <${data.get('email')}>`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus('Opening your email app…', '');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    setStatus('Sending…', '');
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      form.classList.remove('was-validated');
      setStatus('Thanks, your message has been sent.', 'success');
    } catch {
      setStatus(`Something went wrong. Please email ${CONTACT_EMAIL} instead.`, 'error');
    } finally {
      button.disabled = false;
    }
  });
}

document.getElementById('theme-btn').addEventListener('click', toggleTheme);
syncThemeButton();
initNav();
initStickyNav();
initNavHighlight();
initShowreel();
initProjects();
initContactForm();
