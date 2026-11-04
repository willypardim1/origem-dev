/* origem.dev locale detection + language selector (vanilla JS, no deps). */
(function (root) {
  'use strict';
  var LANGS = ['en', 'pt', 'fr', 'es'];
  var PREFIX = { en: '/', pt: '/pt/', fr: '/fr/', es: '/es/' };
  // Country (ISO 3166-1 alpha-2) -> site language. Anything not listed -> null (fall through).
  var COUNTRY_LANG = {
    PT: 'pt',
    // French-speaking (Canada deliberately NOT included)
    FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr',
    SN: 'fr', CI: 'fr', CM: 'fr', CD: 'fr', MG: 'fr', HT: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
    TG: 'fr', BJ: 'fr', GA: 'fr', CG: 'fr', GN: 'fr', TD: 'fr', CF: 'fr', DJ: 'fr', KM: 'fr',
    // Spain + every Spanish-speaking country
    ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es', CL: 'es', EC: 'es', GT: 'es',
    CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
    UY: 'es', PR: 'es', GQ: 'es',
    US: 'en'
  };
  var BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit/i;

  function langFromCountry(cc) {
    if (!cc || typeof cc !== 'string') return null;
    return COUNTRY_LANG[cc.trim().toUpperCase()] || null;
  }
  function langFromBrowser(list) {
    list = list || [];
    for (var i = 0; i < list.length; i++) {
      var base = String(list[i] || '').toLowerCase().split('-')[0];
      if (LANGS.indexOf(base) !== -1) return base;
    }
    return null;
  }
  function isBot(ua) { return BOT_RE.test(ua || ''); }
  function langFromPath(path) {
    var m = /^\/(pt|fr|es)(\/|$)/.exec(path || '/');
    return m ? m[1] : 'en';
  }
  function pageOf(path) { // "index.html" | "thank-you.html" ...
    var rest = (path || '/').replace(/^\/(pt|fr|es)(\/|$)/, '/').replace(/^\//, '');
    return rest === '' ? '' : rest.replace(/^index\.html$/, '');
  }
  function urlFor(lang, path) { return PREFIX[lang] + pageOf(path); }
  /** Decide auto language. saved > country > browser > en */
  function decide(saved, country, browserLangs) {
    if (LANGS.indexOf(saved) !== -1) return saved;
    return langFromCountry(country) || langFromBrowser(browserLangs) || 'en';
  }

  var api = { LANGS: LANGS, COUNTRY_LANG: COUNTRY_LANG, langFromCountry: langFromCountry,
    langFromBrowser: langFromBrowser, isBot: isBot, langFromPath: langFromPath, urlFor: urlFor, decide: decide };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }

  // ---------- browser-only ----------
  var GEO = ['https://api.country.is/', 'https://get.geojs.io/v1/ip/country.json'];
  function getSaved() {
    var m = document.cookie.match(/(?:^|;\s*)lang=(en|pt|fr|es)(?:;|$)/);
    if (m) return m[1];
    try { var v = localStorage.getItem('lang'); if (LANGS.indexOf(v) !== -1) return v; } catch (e) {}
    return null;
  }
  function save(lang) {
    document.cookie = 'lang=' + lang + '; max-age=31536000; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  function autoDone() { try { return localStorage.getItem('lang_auto_done') === '1' || sessionStorage.getItem('lang_auto_done') === '1'; } catch (e) { return false; } }
  function markAuto() { try { localStorage.setItem('lang_auto_done', '1'); sessionStorage.setItem('lang_auto_done', '1'); } catch (e) {} }
  function fetchCountry(url, ms) {
    if (!root.fetch) return Promise.reject();
    var ctl = root.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { signal: ctl ? ctl.signal : undefined, credentials: 'omit' })
      .then(function (r) { return r.json(); })
      .then(function (j) { clearTimeout(t); if (!j || !j.country) throw 0; return j.country; });
  }
  function lookupCountry() { // primary then fallback, total ~1.5 s budget
    return fetchCountry(GEO[0], 900).catch(function () { return fetchCountry(GEO[1], 600); }).catch(function () { return null; });
  }
  function go(lang) {
    var target = urlFor(lang, location.pathname) + location.hash;
    if (target !== location.pathname + location.hash) location.replace(target);
  }

  var path = location.pathname, here = langFromPath(path), saved = getSaved();
  var isRootIndex = path === '/' || path === '/index.html';
  if (!isBot(navigator.userAgent)) {
    if (saved && saved !== here && here === 'en' && pageOf(path) !== '' ) {
      go(saved); // e.g. Stripe returns to /thank-you.html -> user's saved language
    } else if (isRootIndex) {
      if (saved) { if (saved !== 'en') go(saved); }
      else if (!autoDone()) {
        markAuto();
        lookupCountry().then(function (cc) {
          var l = decide(null, cc, navigator.languages || [navigator.language]);
          if (l !== 'en') go(l);
        });
      }
    }
  }
  function closeAll(except) {
    var bs = document.querySelectorAll('.lang-btn[aria-expanded="true"]');
    for (var i = 0; i < bs.length; i++) if (bs[i] !== except) setOpen(bs[i], false);
  }
  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    if (list) list.hidden = !open;
  }
  function links(btn) { var l = document.getElementById(btn.getAttribute('aria-controls')); return l ? l.querySelectorAll('a') : []; }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.lang-btn');
    if (btn) { var o = btn.getAttribute('aria-expanded') !== 'true'; closeAll(btn); setOpen(btn, o); return; }
    var a = e.target.closest && e.target.closest('.lang-sel a[data-lang]');
    closeAll(null);
    if (!a) return;
    e.preventDefault();
    save(a.getAttribute('data-lang')); markAuto();
    location.href = urlFor(a.getAttribute('data-lang'), location.pathname) + location.hash;
  });
  document.addEventListener('keydown', function (e) {
    var sel = e.target.closest && e.target.closest('.lang-sel');
    if (e.key === 'Escape') {
      var open = document.querySelector('.lang-btn[aria-expanded="true"]');
      if (open) { setOpen(open, false); open.focus(); }
      return;
    }
    if (!sel) return;
    var btn = sel.querySelector('.lang-btn'), as = links(btn), idx = Array.prototype.indexOf.call(as, e.target);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (e.target === btn) { setOpen(btn, true); (e.key === 'ArrowDown' ? as[0] : as[as.length - 1]).focus(); }
      else if (idx !== -1) as[(idx + (e.key === 'ArrowDown' ? 1 : as.length - 1)) % as.length].focus();
    } else if (e.key === 'Tab' && idx === as.length - 1 && !e.shiftKey) { setOpen(btn, false); }
  });
})(this);
