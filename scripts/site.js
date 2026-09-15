(() => {
  'use strict';
  // Resolve from this script, not the current page depth or the domain root.
  const root = new URL('../', document.currentScript.src);
  const language = document.documentElement.lang;
  const languageRoot = new URL(`${language}/`, root);
  const messages = window.WWM_MESSAGES;
  const pages = window.WWM_PAGES;
  const currentId = document.body.dataset.page;
  const current = pages[currentId];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const pageUrl = id => new URL(pages[id].path, languageRoot).href;
  const resolveLink = link => {
    if (link.startsWith('#')) {
      const key = link.slice(1);
      const id = Object.hasOwn(window.WWM_LEGACY_PAGES, key) ? window.WWM_LEGACY_PAGES[key] : null;
      return id ? pageUrl(id) : link;
    }
    return new URL(link, languageRoot).href;
  };
  window.WWM_SITE = { pageUrl, resolveLink, escapeHtml };

  const header = document.querySelector('.site-header');
  header.innerHTML = `
    <a class="brand" href="${pageUrl('checklist')}" aria-label="${escapeHtml(messages.home)}">
      <img src="${new URL('assets/cat-goose-logo.png', root).href}" alt="" width="44" height="44">
      <span><strong>${escapeHtml(messages.brand)}</strong><small>${escapeHtml(messages.subtitle)}</small></span>
    </a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">${escapeHtml(messages.menu)}</button>
    <nav id="main-nav" aria-label="${escapeHtml(messages.navigation)}">${Object.entries(window.WWM_FEATURES).map(([feature, details]) =>
      `<a href="${pageUrl(details.defaultPage)}"${current.feature === feature ? ' class="active" aria-current="true"' : ''}>${escapeHtml(messages.features[feature])}</a>`
    ).join('')}</nav>`;
  const menu = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('#main-nav');
  menu.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', String(navigation.classList.toggle('open')));
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      navigation.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.focus();
    }
  });

  const sidebar = document.querySelector('.knowledge-tree');
  if (sidebar) {
    let category;
    sidebar.innerHTML = `<h2>${escapeHtml(messages.features[current.feature] + messages.directory)}</h2>` +
      Object.entries(pages).filter(([, page]) => page.feature === current.feature).map(([id, page]) => {
        const heading = page.category && page.category !== category
          ? `<div class="tree-item">${escapeHtml(messages.categories[page.category])}</div>` : '';
        category = page.category;
        return heading + `<a class="tree-child${id === currentId ? ' active' : ''}" href="${pageUrl(id)}"${id === currentId ? ' aria-current="page"' : ''}>${escapeHtml(messages.pages[id])}</a>`;
      }).join('');
  }
  document.querySelector('footer').textContent = messages.disclaimer;

  const lightbox = document.querySelector('#image-lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('#lightbox-caption');
    const close = lightbox.querySelector('.lightbox-close');
    close.setAttribute('aria-label', messages.closeImage);
    document.querySelectorAll('.merchant-gallery img,[data-zoomable]').forEach(thumbnail => {
      thumbnail.tabIndex = 0;
      thumbnail.setAttribute('role', 'button');
      thumbnail.title = thumbnail.dataset.zoomable === 'click' ? messages.zoomClick : messages.zoomDouble;
      const open = () => {
        image.src = thumbnail.currentSrc || thumbnail.src;
        image.alt = thumbnail.alt;
        caption.textContent = thumbnail.alt;
        lightbox.showModal();
      };
      thumbnail.addEventListener(thumbnail.dataset.zoomable === 'click' ? 'click' : 'dblclick', open);
      thumbnail.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
    close.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('close', () => image.removeAttribute('src'));
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-scroll-target]');
    if (button) document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
