// Runs in <head>, before first paint.
(function () {
  var html = document.documentElement;

  // Theme: the visitor's saved choice, otherwise their system setting.
  var theme = null;
  try { theme = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  html.setAttribute('data-theme', theme);

  // Minimum width: the layout never gets narrower than MIN_WIDTH. In a window
  // narrower than that, the whole page is scaled down to fit instead, so the
  // header and content keep their 320px layout rather than squashing or
  // scrolling sideways. Browsers without CSS zoom fall back to sideways scroll.
  var MIN_WIDTH = 320;
  function fit() {
    html.style.zoom = '';
    var width = html.clientWidth;
    if (width > 0 && width < MIN_WIDTH) html.style.zoom = String(width / MIN_WIDTH);
  }
  fit();
  document.addEventListener('DOMContentLoaded', fit);
  window.addEventListener('resize', fit);
})();
