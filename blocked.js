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

  // Reset animations
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

  // Set background scene
  document.body.setAttribute('data-scene', msg.scene);
}

function getParams() {
  var params = new URLSearchParams(window.location.search);
  return {
    url: params.get('url') || '',
    domain: params.get('domain') || ''
  };
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

function init() {
  var params = getParams();
  var url = params.url;
  var domain = params.domain;

  showRandomMessage();
  createLeaves();

  // Show blocked site info
  if (domain) {
    document.getElementById('blocked-site').textContent = 'Blocked: ' + domain;
  }

  // Show today's block count
  browser.storage.local.get(['blockedToday']).then(function (data) {
    var stats = data.blockedToday;
    if (stats && stats.date === new Date().toISOString().split('T')[0]) {
      var plural = stats.count !== 1 ? 's' : '';
      document.getElementById('stats').textContent =
        'You\'ve been saved from yourself ' + stats.count + ' time' + plural + ' today.';
    }
  });

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
    if (!domain || !url) return;

    var OVERRIDE_DURATION = 5 * 60 * 1000; // 5 minutes

    browser.storage.local.get(['overrides']).then(function (data) {
      var overrides = data.overrides || {};
      overrides[domain] = Date.now() + OVERRIDE_DURATION;
      return browser.storage.local.set({ overrides: overrides });
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
          window.location.href = url;
        }
      }, 1000);
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
