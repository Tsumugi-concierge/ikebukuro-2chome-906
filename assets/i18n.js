// Simple class-based i18n for 6 languages across all pages
// Usage: add elements with classes: lang-en, lang-ja, lang-zh, lang-ko, lang-fr, lang-es
// Only the selected language is shown; selection persists in localStorage (key: felizStayLang)

(function(){
  const SUPPORTED = ['en','ja','zh','ko','fr','es'];
  const STORAGE_KEY = 'felizStayLang';
  // Inject CSS based on script path
  (function injectCss(){
    try {
      const scripts = Array.from(document.getElementsByTagName('script'));
      const me = scripts.find(s => s.src && /\/assets\/i18n\.js(?:\?|$)/.test(s.src));
      const base = me ? me.src.replace(/i18n\.js(?:\?.*)?$/, '') : '';
      if (!document.querySelector('link[data-i18n-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = base + 'i18n.css';
        link.setAttribute('data-i18n-css','');
        document.head.appendChild(link);
      }
    } catch {}
  })();

  function detectInitial() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch {}
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const map = {
      en: 'en', 'en-us': 'en', 'en-gb': 'en',
      ja: 'ja', 'ja-jp': 'ja',
      zh: 'zh', 'zh-cn': 'zh', 'zh-hans': 'zh', 'zh-sg': 'zh',
      ko: 'ko', 'ko-kr': 'ko',
      fr: 'fr', 'fr-fr': 'fr', 'fr-ca': 'fr',
      es: 'es', 'es-es': 'es', 'es-mx': 'es',
    };
    return map[nav] || map[nav.split('-')[0]] || 'en';
  }

  function setActiveButton(lang) {
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-set-lang') === lang);
    });
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    setActiveButton(lang);

    // If the top page chat is present, sync UI strings when available
    if (window.LANG_DATA) {
      const t = window.LANG_DATA[lang] || window.LANG_DATA.en;
      const statusEl = document.getElementById('statusText');
      if (statusEl && t?.status) statusEl.textContent = t.status;
      const input = document.getElementById('chatInput');
      if (input && t?.placeholder) input.placeholder = t.placeholder;
      // Ensure global currentLang used by chat fetch is updated
      try { window.currentLang = lang; } catch {}
      // If first bot message exists, localize its text to welcome string
      const msgs = document.getElementById('chatMsgs');
      if (msgs && t?.welcome) {
        const firstBot = msgs.querySelector('.msg.bot');
        if (firstBot) firstBot.innerHTML = t.welcome;
      }
      // Localize quick chips if present
      const chips = document.getElementById('quickChips');
      if (chips && t) {
        chips.querySelectorAll('[data-chip]').forEach(ch => {
          const key = ch.getAttribute('data-chip');
          if (t[key]) ch.textContent = ch.textContent.replace(/^\p{Emoji_Presentation}?\s*/u,'');
          if (t[key]) ch.textContent = (ch.textContent.match(/^([\p{Emoji_Presentation}\p{Emoji}\ufe0f\u200d\u2640\u2642]+)\s*/u)?.[1] || '') + ' ' + t[key];
        });
      }
    }
  }

  function createSwitcher() {
    const labels = {
      en: 'EN',
      ja: '日本語',
      zh: '中文',
      ko: '한국어',
      fr: 'Français',
      es: 'Español',
    };
    const sw = document.createElement('nav');
    sw.className = 'lang-switcher';
    sw.setAttribute('aria-label','Language');
    SUPPORTED.forEach(code => {
      const b = document.createElement('button');
      b.className = 'lang-btn';
      b.type = 'button';
      b.setAttribute('data-set-lang', code);
      b.textContent = labels[code] || code.toUpperCase();
      b.addEventListener('click', () => applyLang(code));
      sw.appendChild(b);
    });
    // Prefer to place after .top-bar or .top if exists, else at top of <main> or <body>
    const anchor = document.querySelector('.top-bar') || document.querySelector('.top') || document.querySelector('main') || document.body;
    if (anchor === document.body) {
      document.body.insertBefore(sw, document.body.firstChild);
    } else {
      anchor.parentNode.insertBefore(sw, anchor.nextSibling);
    }
    return sw;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inject switcher if not already present
    if (!document.querySelector('.lang-switcher')) createSwitcher();
    const initial = detectInitial();
    applyLang(initial);
  });

  // Expose for other inline handlers if needed
  window.setManualLang = applyLang;
})();
