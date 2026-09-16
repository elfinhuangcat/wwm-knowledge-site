// Paths are relative to a language folder. Ask the owner for a path before adding a page.
window.WWM_PAGES = {
  checklist: { path: 'checklist.html', feature: 'checklist', legacy: 'checklist' },
  changelog: { path: 'changelog.html', feature: 'meta', legacy: 'changelog' },
  'hexi-glazed-tiles': { path: 'no-miss/hexi-glazed-tiles.html', feature: 'no-miss', legacy: 'must-do/hexi-glass' },
  merchants: { path: 'no-miss/merchants.html', feature: 'no-miss', legacy: 'must-do/merchants' },
  'activity-guide': { path: 'guild/activity-guide.html', feature: 'guild', legacy: 'guild/activity' },
  'perk-guide': { path: 'guild/perk-guide.html', feature: 'guild', legacy: 'guild/perks' },
  divinecraft: { path: 'wiki/develop/divinecraft.html', feature: 'wiki', category: 'develop', legacy: 'knowledge/craft' },
  'stores-must-buy': { path: 'wiki/develop/stores-must-buy.html', feature: 'wiki', category: 'develop', legacy: 'knowledge/shop' },
  'energy-well-spent': { path: 'wiki/develop/energy-well-spent.html', feature: 'wiki', category: 'develop', legacy: 'knowledge/energy' },
  'fire-oil-farming': { path: 'wiki/farm/fire-oil-farming.html', feature: 'wiki', category: 'farm', legacy: 'knowledge/fire-oil' },
  'mohist-blueprint': { path: 'wiki/farm/mohist-blueprint.html', feature: 'wiki', category: 'farm', legacy: 'knowledge/moshan' },
  'trading-guide': { path: 'wiki/jianghu/trading-guide.html', feature: 'wiki', category: 'jianghu', legacy: 'knowledge/market' }
};

window.WWM_FEATURES = {
  checklist: { defaultPage: 'checklist' },
  'no-miss': { defaultPage: 'hexi-glazed-tiles' },
  guild: { defaultPage: 'activity-guide' },
  wiki: { defaultPage: 'energy-well-spent' }
};

// Enable a locale only after its pages and interface translations are ready.
window.WWM_LANGUAGES = { 'zh-Hans': { enabled: true }, 'zh-Hant': { enabled: false }, en: { enabled: false } };

window.WWM_LEGACY_PAGES = Object.fromEntries(
  Object.entries(window.WWM_PAGES).map(([id, page]) => [page.legacy, id])
);
Object.assign(window.WWM_LEGACY_PAGES, {
  'must-do': 'hexi-glazed-tiles', guild: 'activity-guide', knowledge: 'energy-well-spent'
});
