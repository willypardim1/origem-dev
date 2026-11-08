const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const usd = [
  'https://buy.stripe.com/4gM28rcGNb2P6DDeTYds400',
  'https://buy.stripe.com/3cIfZhgX35Ive65bHMds401',
  'https://buy.stripe.com/4gM7sLdKRgn92nn6nsds402'
];
const eur = [
  'https://buy.stripe.com/4gMeVd5eldaXbXXdPUds403',
  'https://buy.stripe.com/6oUbJ18qxdaX0ffdPUds404',
  'https://buy.stripe.com/00w5kDeOV5Ivgedh26ds405'
];
for (const url of usd.concat(eur)) assert.ok(js.includes(url), url);
assert.ok(js.includes("social: '$390', unlimited: '$490', pro: '$590'"));
assert.ok(js.includes("social: '€390', unlimited: '€490', pro: '€590'"));
assert.ok(js.includes("document.documentElement.lang === 'en' ? 'USD' : 'EUR'"));
assert.ok(js.includes('origemGeo.isEurope'));
const prices = {
  en: ['$390', '$490', '$590', '/mo', 'in USD'],
  pt: ['€390', '€490', '€590', '/mês'],
  fr: ['€390', '€490', '€590', '/mois'],
  es: ['€390', '€490', '€590', '/mes']
};
for (const [code, bits] of Object.entries(prices)) {
  const t = JSON.parse(fs.readFileSync(path.join(root, 'locales', code + '.json'), 'utf8'));
  const blob = JSON.stringify(t);
  for (const bit of bits) assert.ok(blob.includes(bit), code + ' ' + bit);
  assert.strictEqual(t['price.social'].replace(/[$€]/, ''), '390');
  assert.strictEqual(t['price.unlimited'].replace(/[$€]/, ''), '490');
  assert.strictEqual(t['price.pro'].replace(/[$€]/, ''), '590');
}
console.log('commercial terms: unchanged');
