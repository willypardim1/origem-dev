const p=require('puppeteer-core');
const U={USD:['https://buy.stripe.com/4gM28rcGNb2P6DDeTYds400','https://buy.stripe.com/3cIfZhgX35Ive65bHMds401','https://buy.stripe.com/4gM7sLdKRgn92nn6nsds402'],
EUR:['https://buy.stripe.com/4gMeVd5eldaXbXXdPUds403','https://buy.stripe.com/6oUbJ18qxdaX0ffdPUds404','https://buy.stripe.com/00w5kDeOV5Ivgedh26ds405']};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let bad=0;
for(const [path,cc,cur] of [['/','US','USD'],['/','BR','USD'],['/','DE','EUR'],['/','GB','EUR'],['/','PL','EUR'],['/',null,'USD'],['/pt/','BR','EUR'],['/fr/','US','EUR'],['/es/','MX','EUR'],['/es/','ES','EUR']]){
 const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setRequestInterception(true);
 pg.on('request',r=>{const u=r.url();if(/country\.is|geojs/.test(u))return cc?r.respond({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({country:cc})}):r.abort();r.continue()});
 await pg.evaluateOnNewDocument(()=>{localStorage.setItem('lang_auto_done','1')});
 await pg.goto('http://localhost:8765'+path,{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,500));
 const h=await pg.$$eval('[data-plan]',a=>a.map(x=>x.href));const amt=await pg.$$eval('.plan .amt',a=>a.map(x=>x.textContent));const sec=await pg.$eval('.secure',x=>x.textContent);
 const ok=JSON.stringify(h)===JSON.stringify(U[cur])&&amt[0].startsWith(cur==='EUR'?'€':'$');
 console.log(path,cc,cur,ok?'OK':'FAIL',amt.join(' '),path==='/'?sec.match(/in \w+/)[0]:'');bad+=!ok;await ctx.close();}
await b.close();process.exit(bad)})();
