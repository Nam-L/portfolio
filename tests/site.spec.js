// @ts-check
const { test, expect } = require('@playwright/test');

// Fail on any script error or any broken same-origin request (missing image, CSS, PDF...).
test.beforeEach(async ({ page }) => {
  const problems = [];
  page.on('pageerror', e => problems.push(`page error: ${e.message}`));
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
  return page.evaluate(() => window.PROJECTS);
}

test('page loads with all main sections', async ({ page }) => {
  await page.goto('./');
  for (const id of ['about', 'skills', 'projects', 'experience', 'education', 'contact']) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }
  await expect(page.locator('.btn', { hasText: 'Download CV' })).toBeVisible();
});

test('every nav link points at a section that exists', async ({ page }) => {
  await page.goto('./');
  const hrefs = await page.locator('.site-nav a').evaluateAll(as => as.map(a => a.getAttribute('href')));
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

test('project data is well formed and its files exist', async ({ page, request }) => {
  await page.goto('./');
  const list = await projects(page);
  expect(list.length).toBeGreaterThan(0);

  const ids = list.map(p => p.id);
  expect(new Set(ids).size, 'project ids are unique').toBe(ids.length);

  for (const p of list) {
    expect(p.id, 'id is URL-safe').toMatch(/^[a-z0-9-]+$/);
    expect(typeof p.title).toBe('string');
    expect(typeof p.summary).toBe('string');
    const files = [p.cover, ...(p.images || []).map(i => i.src)];
    if (p.video && !/^https?:/.test(p.video)) files.push(p.video);
    for (const f of files.filter(Boolean)) {
      if (/^https?:/.test(f)) continue;
      expect((await request.get(f)).status(), `${p.id}: ${f}`).toBe(200);
    }
    for (const url of [p.github, ...(p.links || []).map(l => l.url)].filter(Boolean)) {
      expect(url, `${p.id}: link is absolute`).toMatch(/^https?:\/\//);
    }
  }
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

test('video URLs become embeds', async ({ page }) => {
  await page.goto('./');
  const embeds = await page.evaluate(() => {
    const out = {};
    for (const url of ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ', 'https://vimeo.com/76979871', 'assets/clip.mp4']) {
      const el = videoEmbed(url, 't');
      out[url] = el.tagName + ' ' + el.getAttribute('src');
    }
    return out;
  });
  expect(embeds['https://www.youtube.com/watch?v=dQw4w9WgXcQ']).toBe('IFRAME https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
  expect(embeds['https://youtu.be/dQw4w9WgXcQ']).toBe('IFRAME https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0');
  expect(embeds['https://vimeo.com/76979871']).toBe('IFRAME https://player.vimeo.com/video/76979871');
  expect(embeds['assets/clip.mp4']).toBe('VIDEO assets/clip.mp4');
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
