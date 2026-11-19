// Dependency-free checks for page paths, local links, shared scripts, and redirects.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('scripts/pages.js'), context);
const { WWM_PAGES: pages, WWM_LEGACY_PAGES: legacy } = context.window;
const paths = Object.values(pages).map(page => page.path);
assert.equal(new Set(paths).size, paths.length, 'Page paths must be unique');
const originalCredits = {
  'activity-guide': ['@夜 from 镜花阙'],
  divinecraft: ['林恩恩恩恩恩恩'],
  'energy-well-spent': ['童聪']
};
let links = 0;
let pageCount = 0;
for (const language of Object.keys(context.window.WWM_LANGUAGES)) {
  vm.runInContext(read(`scripts/locales/${language}.js`), context);
  const messages = context.window.WWM_MESSAGES;
  assert.equal(messages.language, language);
  assert.ok(messages.languageLabel);
  assert.equal(messages.brand, '燕云行笺');
  for (const [id, page] of Object.entries(pages)) {
    assert.match(page.path, /^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/);
    assert.ok(messages.pages[id], `Missing label for ${id}`);
    const file = `gen_pages/${language}/${page.path}`;
    pageCount++;
    const html = read(file);
    assert.ok(html.includes(`<html lang="${language}">`));
    assert.ok(html.includes(`scripts/locales/${language}.js`));
    assert.ok(html.includes(`data-page="${id}"`));
    if (language === 'en') {
      assert.doesNotMatch(html, /available in Simplified Chinese/i, file);
      let visibleText = html.replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, '');
      visibleText = visibleText.replaceAll(messages.brand, '');
      for (const credit of originalCredits[id] || []) {
        assert.ok(visibleText.includes(credit), `Missing original credit: ${file}`);
        visibleText = visibleText.replace(credit, '');
      }
      assert.doesNotMatch(visibleText, /\p{Script=Han}/u, `Untranslated text: ${file}`);
    }
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
}
for (const [feature, details] of Object.entries(context.window.WWM_FEATURES)) {
  assert.equal(pages[details.defaultPage].feature, feature);
}
vm.runInContext(read('data/activities.js'), context);
const activities = JSON.parse(read('data/activities.json'));
const records = Array.isArray(activities) ? activities : activities.activities;
assert.ok(Array.isArray(records), 'Expected activity records');
const browserActivities = JSON.parse(JSON.stringify(context.window.WWM_ACTIVITIES));
assert.deepEqual(browserActivities.map(a => a.translations), records.map(a => a.translations));
const limited = JSON.parse(read('data/limited-events.json'));
vm.runInContext(read('data/limited-events.js'), context);
assert.deepEqual(JSON.parse(JSON.stringify(context.window.WWM_LIMITED_EVENTS)), limited);
assert.equal(new Set(limited.events.map(event => event.id)).size, limited.events.length);
for (const event of limited.events) {
  assert.ok(Number.isFinite(Date.parse(event.expirationDate)), event.id);
  const reset = event.completionReset;
  assert.ok(['once', 'daily', 'weekly'].includes(reset.type), event.id);
  if (reset.type === 'once') assert.equal(reset.at, event.expirationDate);
  if (reset.type === 'daily') assert.equal(reset.hour, 0);
  if (reset.type === 'weekly') assert.deepEqual([reset.weekday, reset.hour], [1, 5]);
  for (const language of ['zh-Hant', 'en']) {
    for (const field of ['name', 'category', 'rewards', 'guide', 'notes']) {
      assert.equal(typeof event.translations[language][field], 'string', `${event.id} ${language} ${field}`);
      if (event[field]) assert.ok(event.translations[language][field]);
    }
  }
}
for (const record of records) {
  const english = record.translations?.en;
  assert.ok(english, `Missing English translation: ${record.id}`);
  for (const field of ['name', 'category', 'rewards', 'guide', 'notes', 'timeNote']) {
    assert.equal(typeof english[field], 'string', `${record.id} ${field}`);
    assert.doesNotMatch(english[field], /\p{Script=Han}/u, `${record.id} ${field}`);
    if (record[field]) assert.ok(english[field], `${record.id} ${field}`);
  }
}
for (const recordsToCheck of [records, context.window.WWM_ACTIVITIES]) {
  for (const activity of recordsToCheck) {
    if (activity.link && !/^https?:\/\//.test(activity.link)) {
      assert.ok(paths.includes(activity.link), `Unknown activity link: ${activity.link}`);
    }
  }
}
const defaultPath = `gen_pages/zh-Hans/${pages.checklist.path}`;
const index = read('index.html');
assert.ok(index.includes(`href="${defaultPath}"`), 'Missing homepage fallback link');
assert.ok(index.includes(`content="0;url=${defaultPath}"`), 'Missing noscript redirect');
for (const prefix of ['', '/project']) {
  for (const [hash, id] of Object.entries({ ...legacy, '': 'checklist', missing: 'checklist', 'guild/missing': 'activity-guide', toString: 'checklist' })) {
    let result;
    vm.runInNewContext(read('scripts/redirect.js'), {
      window: context.window, URL,
      document: { currentScript: { src: `https://example.test${prefix}/scripts/redirect.js` } },
      location: { hash: hash ? '#' + hash : '', search: '?source=bookmark', replace: url => { result = url; } }
    });
    assert.equal(result, `https://example.test${prefix}/gen_pages/zh-Hans/${pages[id].path}?source=bookmark`);
  }
}
for (const file of ['pages.js', 'site.js', 'redirect.js', 'checklist.js', ...Object.keys(context.window.WWM_LANGUAGES).map(language => `locales/${language}.js`)]) {
  new vm.Script(read('scripts/' + file), { filename: file });
}
console.log(`Verified ${pageCount} localized pages, ${links} local references, activity data, and root/project-prefix redirects.`);
