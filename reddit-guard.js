(function () {
  var ALLOWED_PATHS = ['/r/formula1', '/r/formuladank'];

  function isAllowedPath(path) {
    var lower = path.toLowerCase();
    return ALLOWED_PATHS.some(function (allowed) {
      return lower === allowed || lower.startsWith(allowed + '/');
    });
  }

  function checkAndRedirect() {
    var path = window.location.pathname;

    if (isAllowedPath(path)) return;

    // Check for active override before redirecting
    browser.storage.local.get(['overrides']).then(function (data) {
      var overrides = data.overrides || {};
      var expiry = overrides['reddit.com'];
      if (expiry && Date.now() < expiry) return;

      // Redirect to blocked page
      var blockedUrl = browser.runtime.getURL('blocked.html') +
        '?url=' + encodeURIComponent(window.location.href) +
        '&domain=reddit.com';
      window.location.href = blockedUrl;
    });
  }

  // Monitor for SPA-style navigation (Reddit uses client-side routing)
  var lastUrl = location.href;

  function startObserving() {
    var observer = new MutationObserver(function () {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        checkAndRedirect();
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
  }

  if (document.body) {
    startObserving();
  } else {
    document.addEventListener('DOMContentLoaded', startObserving);
  }

  // Handle back/forward navigation
  window.addEventListener('popstate', function () {
    setTimeout(checkAndRedirect, 0);
  });
})();
