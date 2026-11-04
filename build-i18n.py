#!/usr/bin/env python3
"""Generate static per-language pages for origem.dev.

Source of truth:
  src/index.html, src/thank-you.html  -> templates with {{key}} placeholders
  locales/en.json, pt.json, fr.json, es.json -> translations (same keys)
Output: /index.html, /thank-you.html (English) and /pt/, /fr/, /es/ copies.
Run:  python3 build-i18n.py   (no dependencies)
"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://origem.dev"
LANGS = [  # code, html lang / hreflang, path prefix, flag, label, short
    ("en", "en",    "/",    "🇺🇸", "English (United States)", "EN"),
    ("pt", "pt-PT", "/pt/", "🇵🇹", "Português (Portugal)",    "PT"),
    ("fr", "fr",    "/fr/", "🇫🇷", "Français (France)",       "FR"),
    ("es", "es",    "/es/", "🇪🇸", "Español (España)",        "ES"),
]
PAGES = ["index.html", "thank-you.html"]

def url(prefix, page):
    return prefix if page == "index.html" else prefix + page

def head(page, code):
    out = []
    cur = next(l for l in LANGS if l[0] == code)
    out.append(f'<link rel="canonical" href="{SITE}{url(cur[2], page)}">')
    for c, hl, p, *_ in LANGS:
        out.append(f'<link rel="alternate" hreflang="{hl}" href="{SITE}{url(p, page)}">')
    out.append(f'<link rel="alternate" hreflang="x-default" href="{SITE}{url("/", page)}">')
    return "\n".join(out)

FLAGS = {
    "en": '<svg class="flag" viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><path d="M0 0h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30v1.54H0zm0 3.08h30V20H0z" fill="#b22234"/><rect width="13" height="10.77" fill="#3c3b6e"/></svg>',
    "pt": '<svg class="flag" viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#f00"/><rect width="12" height="20" fill="#060"/><circle cx="12" cy="10" r="3.6" fill="#ff0"/><circle cx="12" cy="10" r="2.2" fill="#f00"/></svg>',
    "fr": '<svg class="flag" viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#ef4135"/><rect width="20" height="20" fill="#fff"/><rect width="10" height="20" fill="#0055a4"/></svg>',
    "es": '<svg class="flag" viewBox="0 0 30 20" width="20" height="14" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>',
}
NAMES = {"en": "United States (English)", "pt": "Portugal (Português)", "fr": "France (Français)", "es": "España (Español)"}
_n = [0]

def selector(page, code, label):
    _n[0] += 1
    lid = f"lang-list-{_n[0]}"
    cur = next(l for l in LANGS if l[0] == code)
    items = []
    for c, hl, p, flag, name, short in LANGS:
        ac = ' aria-current="true"' if c == code else ""
        items.append(f'<li><a href="{url(p, page)}" data-lang="{c}" hreflang="{hl}" lang="{hl}"{ac}>'
                     f'{FLAGS[c]}<span>{NAMES[c]}</span><span class="chk" aria-hidden="true">✓</span></a></li>')
    return (f'<div class="lang-sel">'
            f'<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-controls="{lid}" aria-label="{label}: {cur[4]}">'
            f'{FLAGS[code]}<span class="lc">{cur[5]}</span><span class="caret" aria-hidden="true">▾</span></button>'
            f'<ul class="lang-list" id="{lid}" hidden>' + "".join(items) + "</ul></div>")

def main():
    en = json.load(open(os.path.join(ROOT, "locales", "en.json"), encoding="utf-8"))
    for code, hl, prefix, *_ in LANGS:
        t = json.load(open(os.path.join(ROOT, "locales", f"{code}.json"), encoding="utf-8"))
        missing = set(en) - set(t)
        if missing: sys.exit(f"{code}.json missing keys: {sorted(missing)}")
        for page in PAGES:
            _n[0] = 0
            s = open(os.path.join(ROOT, "src", page), encoding="utf-8").read()
            s = s.replace("{{@htmllang}}", hl).replace("{{@head}}", head(page, code))
            while "{{@selector}}" in s:
                s = s.replace("{{@selector}}", selector(page, code, t["lang.label"]), 1)
            s = s.replace("{{@home}}", prefix)
            s = re.sub(r"\{\{([a-z0-9._]+)\}\}", lambda m: t[m.group(1)], s)
            if "{{" in s: sys.exit(f"unresolved placeholder in {code}/{page}")
            outdir = os.path.join(ROOT, prefix.strip("/"))
            os.makedirs(outdir, exist_ok=True)
            open(os.path.join(outdir, page), "w", encoding="utf-8").write(s)
            print("wrote", os.path.relpath(os.path.join(outdir, page), ROOT))

if __name__ == "__main__":
    main()
