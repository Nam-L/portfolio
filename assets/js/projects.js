// Project cards, tag filters, the project detail dialog and the showreel.

// el('a', { href, class: 'x' }, child, 'text') → <a href class="x">child text</a>
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat().filter(c => c != null && c !== false && c !== '' && c !== 0));
  return node;
}

// YouTube/Vimeo URL → privacy-friendly iframe; anything else → <video>
export function videoEmbed(url, title) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`
    : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
  return src
    ? el('iframe', { src, title: `${title} video`, loading: 'lazy', allowfullscreen: true,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' })
    : el('video', { src: url, controls: true, preload: 'metadata', playsinline: true });
}

const tagList = tags => el('ul', { class: 'tag-list' }, (tags || []).map(t => el('li', { class: 'tag' }, t)));
const link = (href, label, cls) => el('a', { href, class: cls, target: '_blank', rel: 'noopener' }, label);

function card(p) {
  const cover = p.cover || p.images?.[0]?.src;
  return el('button', { class: `project-card${p.featured ? ' is-featured' : ''}`, type: 'button',
      'data-id': p.id, 'aria-haspopup': 'dialog', 'aria-label': `Open details for ${p.title}` },
    el('div', { class: 'project-thumb' },
      cover ? el('img', { src: cover, alt: '', loading: 'lazy' }) : el('span', {}, p.title[0]),
      p.featured && el('span', { class: 'featured-label' }, 'Featured')),
    el('div', { class: 'project-card-body' },
      el('div', { class: 'project-card-head' },
        el('h3', {}, p.title), p.year && el('span', { class: 'mono' }, p.year)),
      (p.role || p.engine) && el('p', { class: 'project-byline' }, [p.role, p.engine].filter(Boolean).join(' · ')),
      el('p', { class: 'muted' }, p.summary),
      p.featured && p.highlights && el('ul', { class: 'plain-list' }, p.highlights.slice(0, 3).map(h => el('li', {}, h))),
      el('div', { class: 'project-card-foot' },
        tagList(p.tags),
        el('div', { class: 'badges' },
          p.video && el('span', { class: 'badge' }, 'Video'),
          p.github && el('span', { class: 'badge' }, 'Code'),
          p.images?.length > 1 && el('span', { class: 'badge' }, `${p.images.length} images`)))));
}

function gallery(p) {
  const items = [...(p.video ? [{ video: p.video }] : []), ...(p.images || [])];
  if (!items.length) return null;
  const stage = el('div', { class: 'pd-stage' });
  const show = item => stage.replaceChildren(item.video
    ? videoEmbed(item.video, p.title) : el('img', { src: item.src, alt: item.alt || p.title }));
  show(items[0]);
  if (items.length === 1) return el('div', { class: 'pd-media' }, stage);

  const thumbs = items.map((item, i) => el('button', { class: 'pd-thumb', type: 'button',
      'aria-label': item.video ? 'Play video' : item.alt || `Image ${i + 1}`, 'aria-current': String(i === 0) },
    item.video ? el('span', { 'aria-hidden': 'true' }, '▶') : el('img', { src: item.src, alt: '', loading: 'lazy' })));
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.setAttribute('aria-current', String(t === thumb)));
    show(items[i]);
  }));
  return el('div', { class: 'pd-media' }, stage, el('div', { class: 'pd-thumbs', role: 'group', 'aria-label': 'Media' }, thumbs));
}

function details(p) {
  const facts = [['Role', p.role], ['Team', p.team], ['Engine', p.engine], ['Platform', p.platform]].filter(f => f[1]);
  const links = [p.github && link(p.github, 'View on GitHub', 'btn btn-primary'),
    ...(p.links || []).filter(l => l?.url).map(l => link(l.url, l.label || l.url, 'btn'))].filter(Boolean);
  return [
    gallery(p),
    el('div', { class: 'pd-body' },
      el('div', { class: 'pd-meta' }, p.year && el('span', { class: 'mono' }, p.year), tagList(p.tags)),
      el('h2', { id: 'pd-title' }, p.title),
      facts.length && el('dl', { class: 'pd-facts' }, facts.map(([k, v]) => el('div', {}, el('dt', {}, k), el('dd', {}, v)))),
      p.highlights?.length && el('div', { class: 'pd-highlights' },
        el('h3', { class: 'label' }, 'What I built'),
        el('ul', { class: 'plain-list' }, p.highlights.map(h => el('li', {}, h)))),
      [].concat(p.description || p.summary).map(text => el('p', { class: 'muted' }, text)),
      links.length && el('div', { class: 'pd-links' }, links))
  ];
}

export function initProjects(projects) {
  const grid = document.getElementById('project-grid');
  const filters = document.getElementById('project-filters');
  const empty = document.getElementById('project-empty');
  const dialog = document.getElementById('project-dialog');
  const content = document.getElementById('pd-content');
  const byId = new Map(projects.map(p => [p.id, p]));
  const cards = projects.map(card);
  grid.append(...cards);

  // Filter chips, most-used tags first
  const counts = new Map();
  projects.flatMap(p => p.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1));
  const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));
  const chip = (tag, count) => el('button', { class: 'filter-chip', type: 'button', 'data-tag': tag,
    'aria-pressed': String(tag === 'All') }, tag, el('span', { class: 'chip-count' }, String(count)));
  if (tags.length) filters.append(chip('All', projects.length), ...tags.map(t => chip(t, counts.get(t))));

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    filters.querySelectorAll('.filter-chip').forEach(c => c.setAttribute('aria-pressed', String(c === btn)));
    cards.forEach(c => { c.hidden = btn.dataset.tag !== 'All' && !byId.get(c.dataset.id).tags?.includes(btn.dataset.tag); });
    empty.hidden = cards.some(c => !c.hidden);
  });

  let lastFocus = null;
  const open = (id, updateHash = true) => {
    const p = byId.get(id);
    if (!p) return;
    content.replaceChildren(...details(p).filter(Boolean));
    if (updateHash) history.replaceState(null, '', `#project/${encodeURIComponent(id)}`);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
    dialog.scrollTop = 0;
  };

  grid.addEventListener('click', e => { const c = e.target.closest('.project-card'); if (c) open(c.dataset.id); });
  document.getElementById('pd-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); // backdrop
  dialog.addEventListener('close', () => {
    content.replaceChildren(); // stops any playing video
    document.body.classList.remove('dialog-open');
    if (location.hash.startsWith('#project/')) history.replaceState(null, '', '#projects');
    lastFocus?.focus({ preventScroll: true });
  });

  const fromHash = () => {
    const m = location.hash.match(/^#project\/(.+)$/);
    if (m) open(decodeURIComponent(m[1]), false);
  };
  addEventListener('hashchange', fromHash);
  fromHash();
}

export function initShowreel(url) {
  if (!url) return;
  document.getElementById('showreel-frame').append(videoEmbed(url, 'Showreel'));
  document.getElementById('showreel').hidden = false;
}
