var BLOCKED_SITES = [
  { domain: 'linkedin.com', name: 'LinkedIn' },
  { domain: 'instagram.com', name: 'Instagram' },
  { domain: 'threads.net', name: 'Threads' },
  { domain: 'drudgereport.com', name: 'Drudge Report' },
  {
    domain: 'reddit.com',
    name: 'Reddit',
    exceptions: ['r/formula1', 'r/formuladank']
  }
];

function formatTimeRemaining(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = Math.floor((ms % 60000) / 1000);
  return minutes + 'm ' + seconds + 's';
}

function updatePopup() {
  // Build site list
  var siteList = document.getElementById('site-list');
  siteList.innerHTML = '';
  BLOCKED_SITES.forEach(function (site) {
    var li = document.createElement('li');
    li.textContent = site.name;
    siteList.appendChild(li);
    if (site.exceptions) {
      var ex = document.createElement('li');
      ex.className = 'site-exception';
      ex.textContent = 'Allowed: ' + site.exceptions.join(', ');
      siteList.appendChild(ex);
    }
  });

  // Load stats and overrides
  browser.storage.local.get(['blockedToday', 'overrides']).then(function (data) {
    var today = new Date().toISOString().split('T')[0];
    var stats = data.blockedToday || {};
    document.getElementById('block-count').textContent =
      stats.date === today ? stats.count : 0;

    var overrides = data.overrides || {};
    var activeOverrides = Object.entries(overrides)
      .filter(function (entry) { return Date.now() < entry[1]; });

    var section = document.getElementById('overrides-section');
    var list = document.getElementById('override-list');

    if (activeOverrides.length > 0) {
      section.style.display = 'block';
      list.innerHTML = '';
      activeOverrides.forEach(function (entry) {
        var domain = entry[0];
        var expiry = entry[1];
        var li = document.createElement('li');
        var remaining = expiry - Date.now();
        li.innerHTML =
          '<span>' + domain + '</span>' +
          '<span class="override-time">' + formatTimeRemaining(remaining) + '</span>';
        list.appendChild(li);
      });
    } else {
      section.style.display = 'none';
    }
  });
}

document.getElementById('clear-overrides').addEventListener('click', function () {
  browser.storage.local.set({ overrides: {} }).then(updatePopup);
});

updatePopup();
setInterval(updatePopup, 1000);
