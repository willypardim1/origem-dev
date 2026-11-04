// ===== STRIPE PAYMENT LINKS — PLACEHOLDERS: paste your real links (https://buy.stripe.com/...) =====
const STRIPE_LINKS = {
  social: 'https://buy.stripe.com/4gM28rcGNb2P6DDeTYds400',       // Social Media $390/mo
  unlimited: 'https://buy.stripe.com/3cIfZhgX35Ive65bHMds401', // Unlimited Graphics $490/mo
  pro: 'https://buy.stripe.com/4gM7sLdKRgn92nn6nsds402'              // Pro $590/mo
};
document.querySelectorAll('[data-plan]').forEach(a=>{
  const url=STRIPE_LINKS[a.dataset.plan];
  if(url && /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(url)){a.href=url;a.rel='noopener'}
  else a.href='#contact'; // placeholder → scroll to consultation form
});
const b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
if(b){b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b.setAttribute('aria-expanded',false)}));}
const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

const nv=document.querySelector('.nav');const sc=()=>nv.classList.toggle('scrolled',scrollY>30);addEventListener('scroll',sc,{passive:true});sc();
