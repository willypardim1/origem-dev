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

def selector(page, code, label):
    items = []
    for c, hl, p, flag, name, short in LANGS:
        cur = ' aria-current="true"' if c == code else ""
        items.append(f'<a href="{url(p, page)}" data-lang="{c}" hreflang="{hl}" lang="{hl}" aria-label="{name}" title="{name}"{cur}>'
                     f'<span class="flag" aria-hidden="true">{flag}</span><span class="lc" aria-hidden="true">{short}</span></a>')
    return f'<div class="lang-sel" role="group" aria-label="{label}">' + "".join(items) + "</div>"

def main():
    en = json.load(open(os.path.join(ROOT, "locales", "en.json"), encoding="utf-8"))
    for code, hl, prefix, *_ in LANGS:
        t = json.load(open(os.path.join(ROOT, "locales", f"{code}.json"), encoding="utf-8"))
        missing = set(en) - set(t)
        if missing: sys.exit(f"{code}.json missing keys: {sorted(missing)}")
        for page in PAGES:
            s = open(os.path.join(ROOT, "src", page), encoding="utf-8").read()
            s = s.replace("{{@htmllang}}", hl).replace("{{@head}}", head(page, code))
            s = s.replace("{{@selector}}", selector(page, code, t["lang.label"])).replace("{{@home}}", prefix)
            s = re.sub(r"\{\{([a-z0-9._]+)\}\}", lambda m: t[m.group(1)], s)
            if "{{" in s: sys.exit(f"unresolved placeholder in {code}/{page}")
            outdir = os.path.join(ROOT, prefix.strip("/"))
            os.makedirs(outdir, exist_ok=True)
            open(os.path.join(outdir, page), "w", encoding="utf-8").write(s)
            print("wrote", os.path.relpath(os.path.join(outdir, page), ROOT))

if __name__ == "__main__":
    main()
