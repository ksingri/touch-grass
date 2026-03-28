(function () {
  'use strict';

  var BLOCKED_DOMAINS = [
    'linkedin.com',
    'instagram.com',
    'threads.net',
    'threads.com',
    'drudgereport.com',
    'reddit.com'
  ];

  var REDDIT_ALLOWED_PATHS = ['/r/formula1', '/r/formuladank'];

  function getDomain(hostname) {
    var parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  }

  var domain = getDomain(window.location.hostname);

  // Quick exit if not a blocked domain
  if (BLOCKED_DOMAINS.indexOf(domain) === -1) return;

  // For Reddit, check allowed paths locally (no async needed)
  if (domain === 'reddit.com') {
    var path = window.location.pathname.toLowerCase();
    if (REDDIT_ALLOWED_PATHS.some(function (allowed) {
      return path === allowed || path.startsWith(allowed + '/');
    })) return;
    // Allow individual post pages
    if (/^\/r\/[^/]+\/comments\/[^/]+/.test(path)) return;
  }

  // Immediately hide the page to prevent flash of blocked content
  document.documentElement.style.display = 'none';

  // Ask background script whether to block
  browser.runtime.sendMessage({ type: 'checkBlock', url: window.location.href }).then(function (response) {
    if (!response || !response.blocked) {
      // Not blocked — show the page
      document.documentElement.style.display = '';
      return;
    }

    // Blocked — stop loading and replace with blocked page
    window.stop();
    showBlockedPage(response.domain, window.location.href);
  }).catch(function () {
    // If messaging fails (e.g. background not ready), show page rather than break it
    document.documentElement.style.display = '';
  });

  function showBlockedPage(blockedDomain, originalUrl) {
    // Replace the entire document
    document.documentElement.innerHTML = '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nope.</title><style>' + BLOCKED_CSS + '</style></head><body data-scene="forest">' + BLOCKED_HTML + '</body>';

    // Run blocked page logic after DOM is ready
    initBlockedPage(blockedDomain, originalUrl);
  }

  function initBlockedPage(blockedDomain, originalUrl) {
    var messages = [
      { emoji: "\u{1F33F}", text: "Touch grass.", sub: "It's free and surprisingly therapeutic.", scene: "forest",
        quote: "\u201CIn every walk with nature, one receives far more than he seeks.\u201D \u2014 John Muir" },
      { emoji: "\u{1F9E0}", text: "Your brain called.", sub: "It wants its dopamine receptors back.", scene: "ocean",
        quote: "\u201CThe earth has music for those who listen.\u201D \u2014 William Shakespeare" },
      { emoji: "\u2600\uFE0F", text: "Plot twist: The sun exists.", sub: "And it's outside waiting for you.", scene: "sunset",
        quote: "\u201CLive in the sunshine, swim the sea, drink the wild air.\u201D \u2014 Ralph Waldo Emerson" },
      { emoji: "\u{1F4F5}", text: "Nothing has changed.", sub: "Literally nothing new since you last checked.", scene: "mountain",
        quote: "\u201CI went to the woods because I wished to live deliberately.\u201D \u2014 Henry David Thoreau" },
      { emoji: "\u{1F6B6}", text: "This is your sign.", sub: "Close the browser. Take a walk.", scene: "forest",
        quote: "\u201CThe mountains are calling and I must go.\u201D \u2014 John Muir" },
      { emoji: "\u{1F4A7}", text: "Go drink some water.", sub: "Seriously. Right now. I'll wait.", scene: "ocean",
        quote: "\u201CThe world is full of magic things, patiently waiting for our senses to grow sharper.\u201D \u2014 W.B. Yeats" },
      { emoji: "\u{1F3AF}", text: "Remember your purpose.", sub: "It wasn't doom scrolling.", scene: "sunset",
        quote: "\u201CTell me, what is it you plan to do with your one wild and precious life?\u201D \u2014 Mary Oliver" },
      { emoji: "\u{1F305}", text: "Real life is happening.", sub: "Right now. Without you. Go join it.", scene: "sunset",
        quote: "\u201CAdopt the pace of nature: her secret is patience.\u201D \u2014 Ralph Waldo Emerson" },
      { emoji: "\u{1F4F0}", text: "Breaking news:", sub: "You're alive and that's pretty great.", scene: "mountain",
        quote: "\u201CLook deep into nature, and then you will understand everything better.\u201D \u2014 Albert Einstein" },
      { emoji: "\u{1F3CE}\uFE0F", text: "Lights out and away we go!", sub: "Away from this site. Box box box!", scene: "forest",
        quote: "\u201CThe clearest way into the Universe is through a forest wilderness.\u201D \u2014 John Muir" },
      { emoji: "\u{1F9D8}", text: "Breathe in. Breathe out.", sub: "Feel that? That's your anxiety leaving.", scene: "ocean",
        quote: "\u201CAdopt the pace of nature: her secret is patience.\u201D \u2014 Ralph Waldo Emerson" },
      { emoji: "\u23F0", text: "You were being productive.", sub: "Like 30 seconds ago. Keep that streak going.", scene: "mountain",
        quote: "\u201CNot all those who wander are lost.\u201D \u2014 J.R.R. Tolkien" },
      { emoji: "\u{1F30D}", text: "The world isn't ending.", sub: "But your free time is if you open this.", scene: "forest",
        quote: "\u201CKeep close to Nature\u2019s heart\u2026 climb a mountain or spend a week in the woods. Wash your spirit clean.\u201D \u2014 John Muir" },
      { emoji: "\u{1F3B5}", text: "Put on some music instead.", sub: "You'll thank yourself later.", scene: "sunset",
        quote: "\u201CThe earth has music for those who listen.\u201D \u2014 William Shakespeare" },
      { emoji: "\u{1F4DA}", text: "Remember books?", sub: "Those things with pages? They're wonderful.", scene: "mountain",
        quote: "\u201CI went to the woods because I wished to live deliberately.\u201D \u2014 Henry David Thoreau" },
      { emoji: "\u{1F3CB}\uFE0F", text: "Drop and give me 20.", sub: "Or just stretch. Movement is medicine.", scene: "ocean",
        quote: "\u201CLive in the sunshine, swim the sea, drink the wild air.\u201D \u2014 Ralph Waldo Emerson" },
      { emoji: "\u{1F373}", text: "Go cook something delicious.", sub: "Feed your body, not your anxiety.", scene: "sunset",
        quote: "\u201CTell me, what is it you plan to do with your one wild and precious life?\u201D \u2014 Mary Oliver" },
      { emoji: "\u{1F4A4}", text: "Is it late? Go to sleep.", sub: "Your body will love you for it.", scene: "ocean",
        quote: "\u201CThe world is full of magic things, patiently waiting for our senses to grow sharper.\u201D \u2014 W.B. Yeats" },
      { emoji: "\u{1F3AE}", text: "Play a video game instead.", sub: "At least that's interactive doom.", scene: "mountain",
        quote: "\u201CNot all those who wander are lost.\u201D \u2014 J.R.R. Tolkien" },
      { emoji: "\u{1F331}", text: "You're growing as a person.", sub: "But not by scrolling. Close this tab.", scene: "forest",
        quote: "\u201CIn every walk with nature, one receives far more than he seeks.\u201D \u2014 John Muir" },
      { emoji: "\u{1F415}", text: "A dog somewhere needs petting.", sub: "Go find that dog. Be a hero.", scene: "forest",
        quote: "\u201CThe clearest way into the Universe is through a forest wilderness.\u201D \u2014 John Muir" },
      { emoji: "\u2615", text: "Make yourself a nice cup of tea.", sub: "Warmth > doom scrolling. Always.", scene: "sunset",
        quote: "\u201CAdopt the pace of nature: her secret is patience.\u201D \u2014 Ralph Waldo Emerson" },
      { emoji: "\u{1F3A8}", text: "Create something instead.", sub: "Consuming content is the junk food of the mind.", scene: "ocean",
        quote: "\u201CLook deep into nature, and then you will understand everything better.\u201D \u2014 Albert Einstein" },
      { emoji: "\u{1F3D4}\uFE0F", text: "Go outside.", sub: "The graphics are incredible and the resolution is unmatched.", scene: "mountain",
        quote: "\u201CThe mountains are calling and I must go.\u201D \u2014 John Muir" }
    ];

    var currentMessage = null;

    function showRandomMessage() {
      var msg;
      do {
        msg = messages[Math.floor(Math.random() * messages.length)];
      } while (msg === currentMessage && messages.length > 1);

      currentMessage = msg;

      var emojiEl = document.getElementById('emoji');
      var messageEl = document.getElementById('message');
      var subEl = document.getElementById('sub-message');
      var quoteEl = document.getElementById('quote');

      emojiEl.style.animation = 'none';
      emojiEl.offsetHeight;
      emojiEl.style.animation = 'float 3s ease-in-out infinite';

      quoteEl.style.animation = 'none';
      quoteEl.offsetHeight;
      quoteEl.style.animation = 'quoteIn 1s ease 0.4s both';

      emojiEl.textContent = msg.emoji;
      messageEl.textContent = msg.text;
      subEl.textContent = msg.sub;
      quoteEl.textContent = msg.quote;

      document.body.setAttribute('data-scene', msg.scene);
    }

    function createLeaves() {
      var colors = [
        'rgba(76, 175, 80, 0.18)',
        'rgba(129, 199, 132, 0.14)',
        'rgba(255, 183, 77, 0.12)',
        'rgba(165, 214, 167, 0.12)',
        'rgba(200, 230, 201, 0.10)',
        'rgba(139, 195, 74, 0.14)'
      ];
      for (var i = 0; i < 25; i++) {
        var leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.background = colors[Math.floor(Math.random() * colors.length)];
        leaf.style.animationDuration = (10 + Math.random() * 15) + 's';
        leaf.style.animationDelay = Math.random() * 12 + 's';
        var size = 8 + Math.random() * 10;
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        document.body.appendChild(leaf);
      }
    }

    showRandomMessage();
    createLeaves();

    // Show blocked site info
    if (blockedDomain) {
      document.getElementById('blocked-site').textContent = 'Blocked: ' + blockedDomain;
    }

    // Show today's block count
    browser.runtime.sendMessage({ type: 'getStats' }).then(function (response) {
      var stats = response.blockedToday;
      if (stats && stats.date === new Date().toISOString().split('T')[0]) {
        var plural = stats.count !== 1 ? 's' : '';
        document.getElementById('stats').textContent =
          'You\'ve been saved from yourself ' + stats.count + ' time' + plural + ' today.';
      }
    }).catch(function () {});

    // Shuffle button
    document.getElementById('shuffle').addEventListener('click', showRandomMessage);

    // Override trigger
    document.getElementById('override-trigger').addEventListener('click', function () {
      document.getElementById('override-form').style.display = 'block';
      this.style.display = 'none';
      document.getElementById('override-input').focus();
    });

    // Override input validation
    var input = document.getElementById('override-input');
    var submit = document.getElementById('override-submit');

    input.addEventListener('input', function () {
      submit.disabled = input.value.toLowerCase().trim() !== 'let me through';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !submit.disabled) {
        submit.click();
      }
    });

    // Override submit
    submit.addEventListener('click', function () {
      if (!blockedDomain) return;

      browser.runtime.sendMessage({
        type: 'setOverride',
        domain: blockedDomain,
        duration: 5 * 60 * 1000
      }).then(function () {
        document.getElementById('override-form').style.display = 'none';
        document.getElementById('override-active').style.display = 'block';

        var countdown = 3;
        var countdownEl = document.getElementById('countdown');
        var timer = setInterval(function () {
          countdown--;
          countdownEl.textContent = countdown;
          if (countdown <= 0) {
            clearInterval(timer);
            window.location.reload();
          }
        }, 1000);
      }).catch(function () {
        // Fallback: reload anyway
        window.location.reload();
      });
    });
  }

  // ----- Inlined blocked page HTML -----
  var BLOCKED_HTML = '\
  <!-- Nature landscape silhouette -->\
  <svg class="landscape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none">\
    <!-- Far mountains -->\
    <path d="M0,400 L0,240 Q100,140 200,210 Q350,80 500,190 Q650,60 800,180 Q950,50 1100,170 Q1250,100 1440,200 L1440,400 Z" fill="rgba(255,255,255,0.025)"/>\
    <!-- Near mountains -->\
    <path d="M0,400 L0,280 Q80,180 180,260 Q280,150 400,240 Q520,130 640,250 Q760,160 880,240 Q1000,140 1120,250 Q1240,180 1360,260 Q1400,250 1440,270 L1440,400 Z" fill="rgba(255,255,255,0.04)"/>\
    <!-- Trees -->\
    <g fill="rgba(255,255,255,0.035)">\
      <polygon points="60,300 78,230 96,300"/>\
      <polygon points="75,300 88,250 101,300"/>\
      <polygon points="200,310 222,230 244,310"/>\
      <polygon points="220,310 235,260 250,310"/>\
      <polygon points="380,305 398,240 416,305"/>\
      <polygon points="540,300 560,225 580,300"/>\
      <polygon points="555,300 568,255 581,300"/>\
      <polygon points="720,305 742,235 764,305"/>\
      <polygon points="740,305 752,265 764,305"/>\
      <polygon points="900,300 918,240 936,300"/>\
      <polygon points="1050,310 1072,235 1094,310"/>\
      <polygon points="1070,310 1082,270 1094,310"/>\
      <polygon points="1220,305 1238,245 1256,305"/>\
      <polygon points="1380,300 1395,250 1410,300"/>\
    </g>\
    <!-- Ground line -->\
    <path d="M0,330 Q200,310 400,325 Q600,315 800,330 Q1000,318 1200,328 Q1350,320 1440,330 L1440,400 L0,400 Z" fill="rgba(255,255,255,0.02)"/>\
  </svg>\
  \
  <div class="container">\
    <div class="emoji" id="emoji"></div>\
    <h1 id="message"></h1>\
    <p class="sub" id="sub-message"></p>\
    <p class="quote" id="quote"></p>\
    \
    <div class="blocked-site" id="blocked-site"></div>\
    <div class="stats" id="stats"></div>\
    \
    <button class="shuffle-btn" id="shuffle" title="Show another message">&#x21bb;</button>\
    \
    <div class="override-section">\
      <button class="override-trigger" id="override-trigger">\
        I genuinely need to access this site\
      </button>\
      \
      <div class="override-form" id="override-form" style="display: none;">\
        <p class="override-warning">\
          Are you sure? Type <strong>"let me through"</strong> to get 5 minutes of access.\
        </p>\
        <input type="text" id="override-input" placeholder="Type the phrase..." autocomplete="off" spellcheck="false">\
        <button class="override-submit" id="override-submit" disabled>Override</button>\
      </div>\
      \
      <div class="override-active" id="override-active" style="display: none;">\
        <p>Override active! Redirecting in <span id="countdown">3</span>...</p>\
      </div>\
    </div>\
  </div>';

  // ----- Inlined blocked page CSS -----
  var BLOCKED_CSS = '\
* {\
  margin: 0;\
  padding: 0;\
  box-sizing: border-box;\
}\
\
body {\
  min-height: 100vh;\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
  background-size: 400% 400%;\
  animation: gradientShift 15s ease infinite;\
  color: #e0e0e0;\
  overflow: hidden;\
  transition: background 1.5s ease;\
}\
\
body, body[data-scene="forest"] {\
  background-image: linear-gradient(-45deg, #071a07, #0b3d1a, #1a472a, #0d2f1a);\
}\
\
body[data-scene="sunset"] {\
  background-image: linear-gradient(-45deg, #1a0a1e, #2d1b3d, #4a1942, #6b2737);\
}\
\
body[data-scene="ocean"] {\
  background-image: linear-gradient(-45deg, #0a1628, #0d2137, #0f3460, #164a5c);\
}\
\
body[data-scene="mountain"] {\
  background-image: linear-gradient(-45deg, #1a1a2e, #2a2a3e, #3a3a4e, #252535);\
}\
\
@keyframes gradientShift {\
  0% { background-position: 0% 50%; }\
  50% { background-position: 100% 50%; }\
  100% { background-position: 0% 50%; }\
}\
\
.landscape {\
  position: fixed;\
  bottom: 0;\
  left: 0;\
  width: 100%;\
  height: 45vh;\
  pointer-events: none;\
  z-index: 0;\
}\
\
.container {\
  text-align: center;\
  padding: 2rem;\
  max-width: 640px;\
  position: relative;\
  z-index: 1;\
}\
\
.emoji {\
  font-size: 6rem;\
  animation: float 3s ease-in-out infinite;\
  margin-bottom: 1.5rem;\
  user-select: none;\
}\
\
@keyframes float {\
  0%, 100% { transform: translateY(0); }\
  50% { transform: translateY(-20px); }\
}\
\
h1 {\
  font-size: 2rem;\
  font-weight: 700;\
  line-height: 1.3;\
  margin-bottom: 0.75rem;\
  color: #ffffff;\
  animation: fadeIn 0.8s ease;\
}\
\
.sub {\
  font-size: 1.1rem;\
  color: #b0bec5;\
  margin-bottom: 1.5rem;\
  animation: fadeIn 1.2s ease;\
}\
\
.quote {\
  font-size: 0.95rem;\
  font-style: italic;\
  color: #81c784;\
  line-height: 1.5;\
  margin-bottom: 2rem;\
  padding: 0 1rem;\
  opacity: 0;\
  animation: quoteIn 1s ease 0.4s both;\
}\
\
@keyframes quoteIn {\
  from {\
    opacity: 0;\
    transform: translateY(8px);\
  }\
  to {\
    opacity: 1;\
    transform: translateY(0);\
  }\
}\
\
@keyframes fadeIn {\
  from { opacity: 0; transform: translateY(10px); }\
  to { opacity: 1; transform: translateY(0); }\
}\
\
.blocked-site {\
  display: inline-block;\
  background: rgba(255, 255, 255, 0.05);\
  border: 1px solid rgba(255, 255, 255, 0.1);\
  border-radius: 8px;\
  padding: 0.5rem 1rem;\
  font-size: 0.85rem;\
  color: #757575;\
  margin-bottom: 1.5rem;\
}\
\
.stats {\
  font-size: 0.9rem;\
  color: #616161;\
  margin-bottom: 2rem;\
}\
\
.shuffle-btn {\
  position: absolute;\
  top: 1rem;\
  right: 1rem;\
  background: rgba(255, 255, 255, 0.05);\
  border: 1px solid rgba(255, 255, 255, 0.1);\
  color: #9e9e9e;\
  width: 40px;\
  height: 40px;\
  border-radius: 50%;\
  font-size: 1.2rem;\
  cursor: pointer;\
  transition: all 0.3s;\
}\
\
.shuffle-btn:hover {\
  background: rgba(255, 255, 255, 0.1);\
  color: #fff;\
  transform: rotate(180deg);\
}\
\
.override-section {\
  margin-top: 3rem;\
}\
\
.override-trigger {\
  background: none;\
  border: none;\
  color: #424242;\
  font-size: 0.8rem;\
  cursor: pointer;\
  text-decoration: underline;\
  transition: color 0.3s;\
}\
\
.override-trigger:hover {\
  color: #757575;\
}\
\
.override-form {\
  margin-top: 1.5rem;\
  animation: fadeIn 0.5s ease;\
}\
\
.override-warning {\
  font-size: 0.9rem;\
  color: #bdbdbd;\
  margin-bottom: 1rem;\
}\
\
.override-warning strong {\
  color: #ff8a65;\
}\
\
#override-input {\
  background: rgba(255, 255, 255, 0.05);\
  border: 1px solid rgba(255, 255, 255, 0.15);\
  border-radius: 8px;\
  padding: 0.75rem 1rem;\
  font-size: 1rem;\
  color: #fff;\
  width: 280px;\
  max-width: 100%;\
  outline: none;\
  transition: border-color 0.3s;\
}\
\
#override-input:focus {\
  border-color: rgba(255, 255, 255, 0.3);\
}\
\
.override-submit {\
  display: block;\
  margin: 1rem auto 0;\
  background: rgba(255, 138, 101, 0.15);\
  border: 1px solid rgba(255, 138, 101, 0.3);\
  color: #ff8a65;\
  padding: 0.5rem 1.5rem;\
  border-radius: 8px;\
  font-size: 0.9rem;\
  cursor: pointer;\
  transition: all 0.3s;\
}\
\
.override-submit:disabled {\
  opacity: 0.3;\
  cursor: not-allowed;\
}\
\
.override-submit:not(:disabled):hover {\
  background: rgba(255, 138, 101, 0.25);\
}\
\
.override-active {\
  margin-top: 1rem;\
  color: #81c784;\
  animation: fadeIn 0.5s ease;\
}\
\
.leaf {\
  position: fixed;\
  border-radius: 2px 50% 50% 50%;\
  pointer-events: none;\
  animation: drift linear infinite;\
  z-index: 0;\
}\
\
@keyframes drift {\
  from {\
    transform: translateY(100vh) rotate(0deg) scale(0);\
    opacity: 0;\
  }\
  8% {\
    opacity: 0.7;\
  }\
  50% {\
    opacity: 0.5;\
  }\
  92% {\
    opacity: 0.3;\
  }\
  to {\
    transform: translateY(-10vh) rotate(360deg) scale(1);\
    opacity: 0;\
  }\
}';

})();
