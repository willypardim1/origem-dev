import re,urllib.request,sys
B='http://localhost:8765';exp={'/':'en','/pt/':'pt-PT','/fr/':'fr','/es/':'es'}
bad=0;seen=set()
for p,hl in exp.items():
  for page in ['','thank-you.html']:
    u=p+page;s=urllib.request.urlopen(B+u).read().decode()
    ok=f'<html lang="{hl}"' in s and s.count('hreflang="')>=5 and 'x-default' in s and f'canonical" href="https://origem.dev{u}"' in s and s.count('class="lang-sel"')==(2 if page=='' else 1) and '{{' not in s
    cur=('$' if hl=='en' else '€')
    if page=='': ok=ok and f'{cur}490' in s and (hl=='en') == ('$590' in s) and 'origem.devs@gmail.com' in s
    else: ok=ok and 'https://tally.so/r/e5MJWq' in s
    print(u,'OK' if ok else 'FAIL');bad+=not ok
    for r in re.findall(r'(?:src|href)="(/[^"#]*)"',s):
      if r in seen: continue
      seen.add(r)
      try: urllib.request.urlopen(B+r)
      except Exception as e: print(' broken',r,e);bad+=1
print('assets checked:',len(seen));sys.exit(bad)
