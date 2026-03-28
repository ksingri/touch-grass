(function () {
  var ALLOWED_PATHS = ['/r/formula1', '/r/formuladank'];

  function isAllowedPath(path) {
    var lower = path.toLowerCase();
    if (ALLOWED_PATHS.some(function (allowed) {
      return lower === allowed || lower.startsWith(allowed + '/');
    })) return true;
    // Allow individual post pages (e.g. from Google search results)
    return /^\/r\/[^/]+\/comments\/[^/]+/.test(lower);
  }

  function checkAndBlock() {
    var path = window.location.pathname;

    if (isAllowedPath(path)) return;

    // Ask background script whether to block
    browser.runtime.sendMessage({ type: 'checkBlock', url: window.location.href }).then(function (response) {
      if (response && response.blocked) {
        // Trigger a reload so blocker.js can take over at document_start
        window.location.reload();
      }
    }).catch(function () {});
  }

  // Monitor for SPA-style navigation (Reddit uses client-side routing)
  var lastUrl = location.href;

  function startObserving() {
    var observer = new MutationObserver(function () {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        checkAndBlock();
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
    setTimeout(checkAndBlock, 0);
  });
})();
