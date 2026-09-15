(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const requested = location.hash.slice(1);
  const legacy = window.WWM_LEGACY_PAGES;
  const defaults = { 'must-do': 'hexi-glazed-tiles', guild: 'activity-guide', knowledge: 'energy-well-spent' };
  const id = Object.hasOwn(legacy, requested) ? legacy[requested]
    : Object.hasOwn(defaults, requested.split('/')[0]) ? defaults[requested.split('/')[0]] : 'checklist';
  const destination = new URL(`zh-Hans/${window.WWM_PAGES[id].path}`, root);
  destination.search = location.search;
  location.replace(destination.href);
})();
