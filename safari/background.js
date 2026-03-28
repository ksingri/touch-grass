var BLOCKED_DOMAINS = [
  'linkedin.com',
  'instagram.com',
  'threads.net',
  'threads.com',
  'drudgereport.com',
  'reddit.com'
];

var REDDIT_ALLOWED_PATHS = ['/r/formula1', '/r/formuladank'];

function getDomain(url) {
  try {
    var hostname = new URL(url).hostname;
    var parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (e) {
    return '';
  }
}

function isRedditAllowed(url) {
  try {
    var path = new URL(url).pathname.toLowerCase();
    return REDDIT_ALLOWED_PATHS.some(function (allowed) {
      return path === allowed || path.startsWith(allowed + '/');
    });
  } catch (e) {
    return false;
  }
}

function isRedditPostUrl(url) {
  try {
    var path = new URL(url).pathname.toLowerCase();
    return /^\/r\/[^/]+\/comments\/[^/]+/.test(path);
  } catch (e) {
    return false;
  }
}

function isOverrideActive(overrides, domain) {
  var expiry = overrides[domain];
  return expiry && Date.now() < expiry;
}

function cleanExpiredOverrides() {
  browser.storage.local.get(['overrides']).then(function (data) {
    var overrides = data.overrides || {};
    var changed = false;
    for (var domain in overrides) {
      if (Date.now() >= overrides[domain]) {
        delete overrides[domain];
        changed = true;
      }
    }
    if (changed) {
      browser.storage.local.set({ overrides: overrides });
    }
  });
}

function incrementBlockedCount() {
  return browser.storage.local.get(['blockedToday']).then(function (data) {
    var today = new Date().toISOString().split('T')[0];
    var blockedToday = data.blockedToday || { date: '', count: 0 };
    if (blockedToday.date !== today) {
      blockedToday = { date: today, count: 0 };
    }
    blockedToday.count++;
    return browser.storage.local.set({ blockedToday: blockedToday });
  });
}

// Handle messages from content scripts
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'checkBlock') {
    var url = message.url;
    var domain = getDomain(url);

    if (!BLOCKED_DOMAINS.includes(domain)) {
      sendResponse({ blocked: false });
      return;
    }

    // Allow whitelisted Reddit paths and individual post pages
    if (domain === 'reddit.com' && (isRedditAllowed(url) || isRedditPostUrl(url))) {
      sendResponse({ blocked: false });
      return;
    }

    // Check overrides from storage (async)
    browser.storage.local.get(['overrides']).then(function (data) {
      var overrides = data.overrides || {};
      if (isOverrideActive(overrides, domain)) {
        sendResponse({ blocked: false });
      } else {
        incrementBlockedCount().then(function () {
          sendResponse({ blocked: true, domain: domain });
        });
      }
    });

    // Return true to indicate async response
    return true;
  }

  if (message.type === 'setOverride') {
    browser.storage.local.get(['overrides']).then(function (data) {
      var overrides = data.overrides || {};
      overrides[message.domain] = Date.now() + (message.duration || 300000);
      return browser.storage.local.set({ overrides: overrides });
    }).then(function () {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'getStats') {
    browser.storage.local.get(['blockedToday']).then(function (data) {
      sendResponse({ blockedToday: data.blockedToday || { date: '', count: 0 } });
    });
    return true;
  }

  if (message.type === 'clearOverrides') {
    browser.storage.local.set({ overrides: {} }).then(function () {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Clean expired overrides periodically
setInterval(cleanExpiredOverrides, 60000);

// Also clean on startup
cleanExpiredOverrides();
