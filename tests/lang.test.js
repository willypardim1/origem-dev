const assert=require('assert');const L=require('../lang.js');
const c=L.langFromCountry;
assert.equal(c('PT'),'pt');for(const x of ['FR','BE','CH','LU','MC','SN','ht'])assert.equal(c(x),'fr',x);
for(const x of 'ES MX AR CO PE VE CL EC GT CU BO DO HN PY SV NI CR PA UY PR GQ'.split(' '))assert.equal(c(x),'es',x);
assert.equal(c('US'),'en');assert.equal(c('CA'),null);assert.equal(c('BR'),null);assert.equal(c('DE'),null);assert.equal(c(''),null);assert.equal(c(null),null);
assert.equal(L.langFromBrowser(['de-DE','pt-BR']),'pt');assert.equal(L.langFromBrowser(['fr-CA']),'fr');assert.equal(L.langFromBrowser(['it']),null);
assert.equal(L.decide('fr','ES',['es']),'fr');assert.equal(L.decide(null,'MX',['en-US']),'es');assert.equal(L.decide(null,'US',['pt-PT']),'en');
assert.equal(L.decide(null,null,['es-419']),'es');assert.equal(L.decide(null,'DE',['de']),'en');assert.equal(L.decide(null,'BR',['pt-BR']),'pt');
assert(L.isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'));assert(L.isBot('facebookexternalhit/1.1'));assert(!L.isBot('Mozilla/5.0 (iPhone) Safari'));
assert.equal(L.urlFor('pt','/'),'/pt/');assert.equal(L.urlFor('en','/fr/'),'/');assert.equal(L.urlFor('es','/thank-you.html'),'/es/thank-you.html');assert.equal(L.urlFor('en','/pt/thank-you.html'),'/thank-you.html');assert.equal(L.urlFor('fr','/index.html'),'/fr/');
assert.equal(L.langFromPath('/pt/'),'pt');assert.equal(L.langFromPath('/'),'en');assert.equal(L.langFromPath('/press'),'en');
console.log('lang.js unit tests: all passed');
// Europe list
for(const x of 'PT ES FR DE IT NL BE IE AT GR PL SE NO IS CH LI GB UA RS BA AL MK ME XK MD RO BG HR SI SK CZ HU DK FI EE LV LT LU MT CY MC SM VA AD'.split(' '))assert(L.isEurope(x),x);
for(const x of ['US','BR','MX','AR','CA','CN','ZA','',null,undefined])assert(!L.isEurope(x),String(x));
assert(L.isEurope(' gb '));
console.log('Europe list tests: all passed');
