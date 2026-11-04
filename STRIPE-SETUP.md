# Stripe setup for origem.dev (Payment Links, no backend)

## Notes for a Brazilian Stripe account
- You can charge US churches in **USD** (presentment currency). Stripe converts and **pays out in BRL** to your Brazilian bank (conversion fee ~1–2% applies; check stripe.com/br/pricing).
- Cards (Visa/Mastercard/Amex), Apple Pay, Google Pay and Link work. **ACH Direct Debit is not available for BR accounts** — US customers pay by card.
- International cards incur an extra fee. Make sure your account is fully activated (business details, CPF/CNPJ, bank account) before going live.
- Use **Test mode** first; test links start with `https://buy.stripe.com/test_...`.

## 1. Create the 3 products (Dashboard → Product catalog → + Add product)
For each: Recurring, Monthly, Currency **USD** (change from BRL in the price currency dropdown).
| Product | Price |
|---|---|
| origem.dev — Social Media | $390.00 / month |
| origem.dev — Unlimited Graphics (includes free church website) | $490.00 / month |
| origem.dev — Pro (includes free church website) | $590.00 / month |

## 2. Create a Payment Link for each (Product → Create payment link, or Payment Links → + New)
- Select the product/price, quantity fixed at 1.
- Options: collect customer name, require phone (optional); add a custom field "Church name" (text).
- Optional: allow promotion codes.
- **After payment** → "Don't show confirmation page" → **Redirect customers to your website**: `https://origem.dev/thank-you.html`
- Create link and copy the URL (`https://buy.stripe.com/...`).

## 3. Paste links into the site
Open `script.js`, edit the top block:
```js
const STRIPE_LINKS = {
  social: 'https://buy.stripe.com/xxxx',
  unlimited: 'https://buy.stripe.com/yyyy',
  pro: 'https://buy.stripe.com/zzzz'
};
```
Any value still a placeholder makes that button scroll to the consultation form instead.

## 4. Recommended
- Settings → Billing → **Customer portal**: enable so clients can cancel/update cards; link it in your welcome email.
- Settings → Emails: turn on successful-payment receipts.
- 14-day guarantee: refund manually from Payments → Refund.
- Test each link in test mode with card 4242 4242 4242 4242, then switch to live mode and recreate products/links (test objects don't carry over).
- Never put secret keys (`sk_...`) in the site — Payment Links need none.

## EUR (created 2026-11-04)
EUR monthly prices on the same 3 products + Payment Links (same settings as USD: redirect to /thank-you.html, required "Church name" field):
- Social Media €390: price_1UYCAmHYCWahFYbEl2bPiXUR, plink_1UYCAvHYCWahFYbE8GfJ1fzm, https://buy.stripe.com/4gMeVd5eldaXbXXdPUds403
- Unlimited €490: price_1UYCAnHYCWahFYbElXyBuQy8, plink_1UYCB1HYCWahFYbE6w0zXsKY, https://buy.stripe.com/6oUbJ18qxdaX0ffdPUds404
- Pro €590: price_1UYCApHYCWahFYbEyiLzDxBR, plink_1UYCB5HYCWahFYbE1KIB6lwM, https://buy.stripe.com/00w5kDeOV5Ivgedh26ds405
Currency rule (script.js + lang.js EUROPE list): /pt/ /fr/ /es/ always EUR; English site switches to EUR when the visitor's IP country is in Europe.
E2E test: tests/checkout_links.e2e.js (needs puppeteer-core + Chrome, local server on :8765).
