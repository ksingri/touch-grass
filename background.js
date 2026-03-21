const BLOCKED_DOMAINS = [
  'linkedin.com',
  'instagram.com',
  'threads.net',
  'threads.com',
  'drudgereport.com',
  'reddit.com'
];

const REDDIT_ALLOWED_PATHS = ['/r/formula1', '/r/formuladank'];

function isRedditPostUrl(url) {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return /^\/r\/[^/]+\/comments\/[^/]+/.test(path);
  } catch (e) {
    return false;
  }
}

// In-memory cache for synchronous access in blocking listener
let overrides = {};
let blockedToday = { date: '', count: 0 };

// Load from storage on startup
browser.storage.local.get(['overrides', 'blockedToday']).then(data => {
  overrides = data.overrides || {};
  blockedToday = data.blockedToday || { date: '', count: 0 };
  cleanExpiredOverrides();
});

// Keep in-memory cache in sync
browser.storage.onChanged.addListener((changes) => {
  if (changes.overrides) {
    overrides = changes.overrides.newValue || {};
  }
  if (changes.blockedToday) {
    blockedToday = changes.blockedToday.newValue || { date: '', count: 0 };
  }
});

function getDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (e) {
    return '';
  }
}

function isRedditAllowed(url) {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return REDDIT_ALLOWED_PATHS.some(allowed =>
      path === allowed || path.startsWith(allowed + '/')
    );
  } catch (e) {
    return false;
  }
}

function isOverrideActive(domain) {
  const expiry = overrides[domain];
  return expiry && Date.now() < expiry;
}

function cleanExpiredOverrides() {
  let changed = false;
  for (const [domain, expiry] of Object.entries(overrides)) {
    if (Date.now() >= expiry) {
      delete overrides[domain];
      changed = true;
    }
  }
  if (changed) {
    browser.storage.local.set({ overrides });
  }
}

function incrementBlockedCount() {
  const today = new Date().toISOString().split('T')[0];
  if (blockedToday.date !== today) {
    blockedToday = { date: today, count: 0 };
  }
  blockedToday.count++;
  browser.storage.local.set({ blockedToday });
}

function handleRequest(details) {
  const url = details.url;
  const domain = getDomain(url);

  if (!BLOCKED_DOMAINS.includes(domain)) {
    return {};
  }

  // Allow whitelisted Reddit subreddits and individual post pages
  if (domain === 'reddit.com' && (isRedditAllowed(url) || isRedditPostUrl(url))) {
    return {};
  }

  // Allow if override is active
  if (isOverrideActive(domain)) {
    return {};
  }

  // Block and redirect
  incrementBlockedCount();
  const redirectUrl = browser.runtime.getURL('blocked.html') +
    '?url=' + encodeURIComponent(url) +
    '&domain=' + encodeURIComponent(domain);

  return { redirectUrl };
}

browser.webRequest.onBeforeRequest.addListener(
  handleRequest,
  {
    urls: [
      "*://*.linkedin.com/*",
      "*://*.instagram.com/*",
      "*://*.threads.net/*",
      "*://*.threads.com/*",
      "*://*.drudgereport.com/*",
      "*://*.reddit.com/*"
    ],
    types: ["main_frame"]
  },
  ["blocking"]
);

// Periodically clean expired overrides
setInterval(cleanExpiredOverrides, 60000);
