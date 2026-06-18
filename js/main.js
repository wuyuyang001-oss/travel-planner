/**
 * TravelSite — Shared JavaScript
 * Navigation rendering, page utilities
 */

(function() {
  'use strict';

  // ── Navigation Component ──────────────────────────────
  // Call renderNav() with current page identifier to inject nav.
  // Page identifiers: 'home', 'dest-sgmy', 'sitemap'

  window.TravelSite = window.TravelSite || {};

  var PAGES = [
    { id: 'home',       label: '首页',    href: 'index.html' },
    { id: 'dest-sgmy',  label: '新马泰',  href: 'destinations/singapore-malaysia-thailand.html' },
    { id: 'sitemap',    label: '站点地图', href: 'sitemap.html' }
  ];

  function renderNav(activePageId) {
    var el = document.getElementById('site-nav');
    if (!el) return;

    var linksHTML = PAGES.map(function(p) {
      var cls = (p.id === activePageId) ? 'nav-link active' : 'nav-link';
      return '<a href="' + p.href + '" class="' + cls + '">' + p.label + '</a>';
    }).join('');

    el.innerHTML =
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-brand">' +
          '<span class="nav-brand-icon">🗺️</span> 旅行规划站' +
        '</a>' +
        '<div class="nav-links">' +
          linksHTML +
        '</div>' +
      '</div>';
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;

    el.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-brand">🗺️ TravelSite · 静态旅游规划平台</div>' +
        '<div class="footer-links">' +
          '<a href="index.html" class="footer-link">首页</a>' +
          '<a href="sitemap.html" class="footer-link">站点地图</a>' +
          '<a href="https://github.com" class="footer-link" target="_blank" rel="noopener">GitHub</a>' +
        '</div>' +
      '</div>';
  }

  // ── API ───────────────────────────────────────────────
  window.TravelSite.renderNav = renderNav;
  window.TravelSite.renderFooter = renderFooter;

  // ── Auto-init on DOM ready ────────────────────────────
  function init() {
    // Read active page from <body data-page="xxx">
    var pageId = document.body.getAttribute('data-page') || '';
    renderNav(pageId);
    renderFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
