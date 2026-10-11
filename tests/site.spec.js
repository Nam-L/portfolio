// @ts-check
import { test, expect } from '@playwright/test';
import { embedUrl } from '../src/lib/video.js';

// Fail on any script error or any broken same-origin request (missing image, CSS, PDF...).
test.beforeEach(async ({ page }) => {
  const problems = [];
  page.on('pageerror', e => problems.push(`page error: ${e.message}`));
  page.on('console', m => {
    if (m.text().includes('Content Security Policy')) problems.push(`CSP: ${m.text()}`);
  });
  page.on('response', r => {
    if (r.url().startsWith('http://localhost') && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });
  // Keep tests offline and deterministic: block third-party requests (fonts, video embeds).
  await page.route(url => !url.href.startsWith('http://localhost'), route => route.abort());
  page.problems = problems;
});

test.afterEach(async ({ page }) => {
  expect(page.problems, 'no script errors or broken local files').toEqual([]);
});

async function projects(page) {
  return page.locator('.project-card').evaluateAll(cards => cards.map(c => ({
    id: c.dataset.id, title: c.querySelector('h3').textContent, tags: JSON.parse(c.dataset.tags)
  })));
}

test('page loads with all main sections', async ({ page }) => {
  await page.goto('./');
  for (const id of ['projects', 'about', 'experience', 'contact']) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }
  await expect(page.locator('.btn', { hasText: 'Download CV' })).toBeVisible();
  for (const id of ['skills', 'education']) await expect(page.locator(`#${id}`)).toBeAttached();
});

test('every nav link points at a section that exists', async ({ page }) => {
  await page.goto('./');
  const hrefs = await page.locator('#site-nav a[href^="#"]').evaluateAll(as => as.map(a => a.getAttribute('href')));
  for (const href of hrefs) {
    await expect(page.locator(href), href).toBeAttached();
  }
});

test('CV download link resolves to a PDF', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.locator('a[download]').first().getAttribute('href');
  const res = await request.get(href);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('every project has a unique id and all its images exist', async ({ page, request }) => {
  await page.goto('./');
  const ids = (await projects(page)).map(p => p.id);
  expect(ids.length).toBeGreaterThan(0);
  expect(new Set(ids).size, 'project ids are unique').toBe(ids.length);
  // Card covers plus everything inside the (not yet opened) project details
  const srcs = await page.evaluate(() => [
    ...document.querySelectorAll('img[src]'),
    ...[...document.querySelectorAll('template')].flatMap(t => [...t.content.querySelectorAll('img[src], video[src]')])
  ].map(el => el.getAttribute('src')));
  for (const src of new Set(srcs)) expect((await request.get(src)).status(), src).toBe(200);
});

test('renders one card per project', async ({ page }) => {
  await page.goto('./');
  const list = await projects(page);
  await expect(page.locator('.project-card')).toHaveCount(list.length);
});

test('tag filters show only matching projects', async ({ page }) => {
  await page.goto('./');
  const list = await projects(page);
  const tag = list.flatMap(p => p.tags || [])[0];
  test.skip(!tag, 'no tags defined');
  const expected = list.filter(p => (p.tags || []).includes(tag)).length;

  await page.locator('.filter-chip', { hasText: tag }).first().click();
  await expect(page.locator('.project-card:visible')).toHaveCount(expected);

  await page.locator('.filter-chip[data-tag="All"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(list.length);
});

test('every project opens, shows its details and closes', async ({ page }) => {
  await page.goto('./');
  const dialog = page.locator('#project-dialog');
  for (const p of await projects(page)) {
    await page.locator(`.project-card[data-id="${p.id}"]`).click();
    await expect(dialog).toBeVisible();
    await expect(page.locator('#pd-title')).toHaveText(p.title);
    await expect(page).toHaveURL(new RegExp(`#project/${p.id}$`));
    if (p.github) await expect(dialog.locator(`a[href="${p.github}"]`)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test('a project link opens that project directly', async ({ page }) => {
  await page.goto('./');
  const [first] = await projects(page);
  await page.goto(`./#project/${first.id}`);
  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('#pd-title')).toHaveText(first.title);
});

test('video URLs become privacy-friendly embeds', () => {
  expect(embedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
  expect(embedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
  expect(embedUrl('https://vimeo.com/76979871')).toBe('https://player.vimeo.com/video/76979871');
  expect(embedUrl('/videos/clip.mp4')).toBeNull();
});

test('contact form validates before sending', async ({ page }) => {
  await page.goto('./');
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('#form-status')).toHaveAttribute('data-kind', 'error');
  await expect(page.locator('#cf-name')).toBeFocused();
});

test('theme toggle switches between light and dark', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.locator('#theme-btn').click();
  await expect(html).not.toHaveAttribute('data-theme', before);
});

test('no horizontal overflow on common phone widths', async ({ page }) => {
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('./');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `page overflows at ${width}px`).toBeLessThanOrEqual(0);
  }
});

test('narrow windows scale the 320px layout down instead of squashing or scrolling', async ({ page }) => {
  for (const width of [200, 260, 300]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('./');
    const r = await page.evaluate(() => ({
      layout: document.body.offsetWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      toggleRight: document.getElementById('nav-toggle').getBoundingClientRect().right,
      zoom: Number(document.documentElement.style.zoom)
    }));
    expect(r.layout, `layout width at ${width}px`).toBe(320);
    expect(r.zoom, `zoom at ${width}px`).toBeCloseTo(width / 320, 2);
    expect(r.overflow, `sideways scroll at ${width}px`).toBeLessThanOrEqual(0);
    expect(r.toggleRight * r.zoom, `menu button on screen at ${width}px`).toBeLessThanOrEqual(width);
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#site-nav a[href="#contact"]')).toBeInViewport();
    await page.keyboard.press('Escape');
  }
});

test('header never overlaps or wraps at any width', async ({ page }) => {
  await page.goto('./');
  for (let width = 320; width <= 1400; width += 10) {
    await page.setViewportSize({ width, height: 700 });
    const r = await page.evaluate(() => {
      const box = s => document.querySelector(s).getBoundingClientRect();
      const header = box('#nav-bar');
      const links = [...document.querySelectorAll('#site-nav a')].map(a => a.getBoundingClientRect());
      const inline = getComputedStyle(document.getElementById('site-nav')).position !== 'absolute';
      return {
        headerH: header.height, brandR: box('#nav-bar a[href="#top"]').right, actL: box('#theme-btn').left,
        actR: Math.max(box('#theme-btn').right, box('#nav-toggle').right), vw: document.documentElement.clientWidth, inline,
        navL: inline ? links[0].left : null, navR: inline ? links[links.length - 1].right : null,
        spread: inline ? Math.max(...links.map(l => l.top)) - Math.min(...links.map(l => l.top)) : 0
      };
    });
    const at = `at ${width}px`;
    expect(r.actR, `buttons on screen ${at}`).toBeLessThanOrEqual(r.vw);
    expect(r.brandR, `brand clear of buttons ${at}`).toBeLessThanOrEqual(r.actL);
    if (r.inline) {
      expect(r.spread, `nav on one line ${at}`).toBeLessThan(20);
      expect(r.navL, `nav clear of brand ${at}`).toBeGreaterThanOrEqual(r.brandR);
      expect(r.navR, `nav clear of buttons ${at}`).toBeLessThanOrEqual(r.actL);
    }
  }
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('./');
  const nav = page.locator('#site-nav');
  await expect(nav).toBeHidden();
  await page.locator('#nav-toggle').click();
  await expect(nav).toBeVisible();
  await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'true');
  await nav.locator('a[href="#contact"]').click();
  await expect(nav).toBeHidden();
});

test('theme choice is remembered', async ({ page }) => {
  await page.goto('./');
  const before = await page.locator('html').getAttribute('data-theme');
  await page.locator('#theme-btn').click();
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', before);
});
