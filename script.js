// ===== STRIPE PAYMENT LINKS — the ONE place to configure plan checkout URLs per currency =====
// USD links are used by the English site (/). EUR links are used by /pt/, /fr/ and /es/.
const STRIPE_LINKS_USD = {
  social: 'https://buy.stripe.com/4gM28rcGNb2P6DDeTYds400',       // Social Media $390/mo
  unlimited: 'https://buy.stripe.com/3cIfZhgX35Ive65bHMds401', // Unlimited Graphics $490/mo
  pro: 'https://buy.stripe.com/4gM7sLdKRgn92nn6nsds402'              // Pro $590/mo
};
// TODO(EUR): create EUR prices (€390/€490/€590 per month) + Payment Links in Stripe and paste them here.
// Until then, EUR plan buttons fall back to the #contact form (anything not https://buy.stripe.com/... is ignored).
const STRIPE_LINKS_EUR = {
  social: 'TODO_EUR_SOCIAL_LINK',       // Social Media €390/mo
  unlimited: 'TODO_EUR_UNLIMITED_LINK', // Unlimited Graphics €490/mo
  pro: 'TODO_EUR_PRO_LINK'              // Pro €590/mo
};
const STRIPE_LINKS = document.documentElement.lang === 'en' ? STRIPE_LINKS_USD : STRIPE_LINKS_EUR;
document.querySelectorAll('[data-plan]').forEach(a=>{
  const url=STRIPE_LINKS[a.dataset.plan];
  if(url && /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(url)){a.href=url;a.rel='noopener'}
  else a.href='#contact'; // placeholder → scroll to consultation form
});
const b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
if(b){b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.setAttribute('aria-expanded',false)}));}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

const nv=document.querySelector('.nav');if(nv){const sc=()=>nv.classList.toggle('scrolled',scrollY>30);addEventListener('scroll',sc,{passive:true});sc();}
