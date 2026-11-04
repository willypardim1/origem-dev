// ===== STRIPE PAYMENT LINKS — the ONE place to configure plan checkout URLs per currency =====
// USD links are used by the English site (/). EUR links are used by /pt/, /fr/ and /es/.
const STRIPE_LINKS_USD = {
  social: 'https://buy.stripe.com/4gM28rcGNb2P6DDeTYds400',       // Social Media $390/mo
  unlimited: 'https://buy.stripe.com/3cIfZhgX35Ive65bHMds401', // Unlimited Graphics $490/mo
  pro: 'https://buy.stripe.com/4gM7sLdKRgn92nn6nsds402'              // Pro $590/mo
};
// EUR links (€390/€490/€590 per month). Used on /pt/ /fr/ /es/ and for visitors in any European country.
const STRIPE_LINKS_EUR = {
  social: 'https://buy.stripe.com/4gMeVd5eldaXbXXdPUds403',     // Social Media €390/mo
  unlimited: 'https://buy.stripe.com/6oUbJ18qxdaX0ffdPUds404',  // Unlimited Graphics €490/mo
  pro: 'https://buy.stripe.com/00w5kDeOV5Ivgedh26ds405'         // Pro €590/mo
};
const PRICES = { USD: { social: '$390', unlimited: '$490', pro: '$590' }, EUR: { social: '€390', unlimited: '€490', pro: '€590' } };
function applyCurrency(cur) {
  const links = cur === 'EUR' ? STRIPE_LINKS_EUR : STRIPE_LINKS_USD;
  document.querySelectorAll('[data-plan]').forEach(a => {
    const url = links[a.dataset.plan];
    if (url && /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(url)) { a.href = url; a.rel = 'noopener'; }
    else a.href = '#contact'; // placeholder → scroll to consultation form
    const amt = a.closest('.plan') && a.closest('.plan').querySelector('.amt');
    if (amt && document.documentElement.lang === 'en') amt.textContent = PRICES[cur][a.dataset.plan];
  });
  const sec = document.querySelector('.secure');
  if (sec && document.documentElement.lang === 'en') sec.textContent = sec.textContent.replace(/in (USD|EUR)/, 'in ' + cur);
}
// Page default: English = USD, pt/fr/es = EUR. English visitors in Europe switch to EUR after the geo lookup.
applyCurrency(document.documentElement.lang === 'en' ? 'USD' : 'EUR');
if (document.documentElement.lang === 'en' && document.querySelector('[data-plan]') && window.origemGeo) {
  window.origemGeo.country().then(cc => { if (window.origemGeo.isEurope(cc)) applyCurrency('EUR'); }).catch(() => {});
}
const b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
if(b){b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.setAttribute('aria-expanded',false)}));}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

const nv=document.querySelector('.nav');if(nv){const sc=()=>nv.classList.toggle('scrolled',scrollY>30);addEventListener('scroll',sc,{passive:true});sc();}
