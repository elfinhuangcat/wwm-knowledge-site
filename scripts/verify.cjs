// Dependency-free checks for page paths, local links, shared scripts, and redirects.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('scripts/pages.js'), context);
vm.runInContext(read('scripts/locales/zh-Hans.js'), context);
const { WWM_PAGES: pages, WWM_MESSAGES: messages, WWM_LEGACY_PAGES: legacy } = context.window;
const paths = Object.values(pages).map(page => page.path);
assert.equal(new Set(paths).size, paths.length, 'Page paths must be unique');
let links = 0;
for (const [id, page] of Object.entries(pages)) {
  assert.match(page.path, /^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/);
  assert.ok(messages.pages[id], `Missing label for ${id}`);
  const file = 'zh-Hans/' + page.path;
  const html = read(file);
  assert.ok(html.includes('lang="zh-Hans"'));
  assert.ok(html.includes(`data-page="${id}"`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One main heading: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate element ID: ${file}`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = new URL(match[1], 'https://example.test/project/' + file);
    if (url.origin !== 'https://example.test') continue;
    assert.ok(url.pathname.startsWith('/project/'), `Escaped project prefix: ${match[1]}`);
    const target = decodeURIComponent(url.pathname.slice('/project/'.length));
    assert.ok(fs.existsSync(path.join(root, target)), `${file}: missing ${target}`);
    if (url.hash && target.endsWith('.html')) {
      assert.ok(read(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${match[1]}`);
    }
    links++;
  }
  for (const match of html.matchAll(/data-scroll-target="([^"]+)"/g)) {
    assert.ok(ids.includes(match[1]), `Missing table-of-contents target: ${match[1]}`);
  }
  assert.equal(html.includes('scripts/checklist.js'), id === 'checklist');
  assert.equal(html.includes('data/activities.js'), id === 'checklist');
  assert.ok(!html.includes('app.js'));
}
for (const [feature, details] of Object.entries(context.window.WWM_FEATURES)) {
  assert.equal(pages[details.defaultPage].feature, feature);
}
vm.runInContext(read('data/activities.js'), context);
const activities = JSON.parse(read('data/activities.json'));
const records = Array.isArray(activities) ? activities : activities.activities;
assert.ok(Array.isArray(records), 'Expected activity records');
for (const recordsToCheck of [records, context.window.WWM_ACTIVITIES]) {
  for (const activity of recordsToCheck) {
    if (activity.link && !/^https?:\/\//.test(activity.link)) {
      assert.ok(paths.includes(activity.link), `Unknown activity link: ${activity.link}`);
    }
  }
}
for (const prefix of ['', '/project']) {
  for (const [hash, id] of Object.entries({ ...legacy, '': 'checklist', missing: 'checklist', 'guild/missing': 'activity-guide', toString: 'checklist' })) {
    let result;
    vm.runInNewContext(read('scripts/redirect.js'), {
      window: context.window, URL,
      document: { currentScript: { src: `https://example.test${prefix}/scripts/redirect.js` } },
      location: { hash: hash ? '#' + hash : '', search: '?source=bookmark', replace: url => { result = url; } }
    });
    assert.equal(result, `https://example.test${prefix}/zh-Hans/${pages[id].path}?source=bookmark`);
  }
}
for (const file of ['pages.js', 'site.js', 'redirect.js', 'checklist.js', 'locales/zh-Hans.js']) {
  new vm.Script(read('scripts/' + file), { filename: file });
}
console.log(`Verified ${paths.length} pages, ${links} local references, activity links, and root/project-prefix redirects.`);
