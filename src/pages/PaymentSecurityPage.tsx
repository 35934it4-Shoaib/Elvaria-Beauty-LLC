import React from 'react';
import { CreditCard, ShieldCheck, Lock, AlertCircle, HelpCircle } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/config';

export const PaymentSecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Transactions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Payment & Security</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            How you can pay, and exactly what happens to your card details when you do.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Last updated: August 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#4E6155]" />
              Accepted Payment Methods
            </h2>
            <p className="text-[#555C56] mb-3">
              We accept the following credit and debit card networks:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56] mb-3">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>Discover</li>
            </ul>
            <p className="text-[#555C56] mb-3">
              Digital wallets supported by our processor — including Apple Pay and Google Pay — are offered on the payment page where your device and browser support them.
            </p>
            <p className="text-[#555C56] mb-3">
              We do not currently accept bank transfer, ACH, cash on delivery, cryptocurrency, cheque or purchase orders for online orders. If we add a method, it will be listed here first.
            </p>
            <p className="text-[#555C56]">
              All transactions are charged in USD ($).
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              How Payment Works
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li>You enter your delivery details on our checkout page. No card details are requested here.</li>
              <li>You are taken to a payment page hosted by Stripe, our payment processor, over an encrypted TLS connection.</li>
              <li>You enter your card number, expiry and security code directly into Stripe's form. That data goes to Stripe, not to us.</li>
              <li>Stripe authorises the payment with your bank and returns only a success or failure result, the amount, and a reference identifier.</li>
              <li>We record the order against that reference and begin fulfilment.</li>
            </ul>
            <p className="text-[#555C56] mt-3 font-medium">
              {BRAND_IDENTITY.name} never receives, processes, transmits or stores your full card number, expiry date or card security code (CVV/CVC). Our database stores only your order details, the payment status and Stripe's reference identifier.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#4E6155]" />
              PCI-DSS Compliance
            </h2>
            <p className="text-[#555C56] mb-3">
              The Payment Card Industry Data Security Standard (PCI-DSS) is the security standard the card networks require of anyone handling card data.
            </p>
            <p className="text-[#555C56] mb-3">
              Payments are processed by Stripe, which is certified as a PCI Service Provider Level 1 — the most stringent level of certification in the payments industry. Because card data is entered directly into Stripe's hosted payment page and never touches our servers, our own scope under PCI-DSS is minimised accordingly.
            </p>
            <p className="text-[#555C56] mb-2">Independently of the processor, this storefront:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56]">
              <li>Serves every page over HTTPS/TLS, with HSTS enabled in production.</li>
              <li>Never logs, stores or transmits card data in any form.</li>
              <li>Applies a strict Content-Security-Policy and related browser security headers.</li>
              <li>Protects every form with CSRF tokens and server-side validation.</li>
              <li>Uses HTTP-only, same-site, secure session cookies.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              Fraud and Card-Testing Protection
            </h2>
            <p className="text-[#555C56] mb-3">
              “Card testing” is an attack where stolen card numbers are validated by attempting many small transactions against a merchant. We take active measures against it:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56]">
              <li>Rate limiting on checkout, contact and newsletter endpoints, per client, with automatic blocking above the threshold.</li>
              <li>Automated bot filtering on every public form.</li>
              <li>Server-side amount verification — every payment is checked against the order total before an order is marked paid, so a manipulated client cannot change the price.</li>
              <li>Signed webhooks — payment confirmations are verified cryptographically before they are trusted.</li>
              <li>Order value and quantity ceilings on online orders.</li>
              <li>Stripe Radar machine-learning fraud scoring on the processor side, which analyses card, device, address and behavioural signals.</li>
            </ul>
            <p className="text-[#555C56] mt-3 text-xs">
              Data from declined and failed transactions is used for these purposes, as described in the privacy notice.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#4E6155]" />
              Currency and Pricing
            </h2>
            <p className="text-[#555C56] mb-2">
              All prices on this site are displayed and charged in USD ($) — United States Dollars. The currency code is shown alongside every total.
            </p>
            <p className="text-[#555C56] mb-2">
              If your card is denominated in another currency, your bank or card issuer will convert the amount at its own exchange rate and may add a foreign transaction fee. That conversion and any such fee are between you and your card issuer; we charge only the USD amount shown.
            </p>
            <p className="text-[#555C56]">
              Prices include any applicable sales tax only where shown at checkout. Shipping is calculated and displayed before you pay.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#4E6155]" />
              What Appears on Your Statement
            </h2>
            <p className="text-[#555C56] mb-2">
              Charges from this store appear on your card or bank statement as <strong>ELVARIA BEAUTY</strong>.
            </p>
            <p className="text-[#555C56]">
              If you see a charge you do not recognise, please contact us before disputing it with your bank — we can usually identify and resolve it the same day, which is faster than a formal dispute.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#4E6155]" />
              If a Payment Fails
            </h2>
            <p className="text-[#555C56] mb-3">Cards are most often declined for reasons we cannot see, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56] mb-3">
              <li>Insufficient funds or a card limit.</li>
              * <li>A billing address that does not match the card issuer's records.</li>
              <li>An expired card or a mistyped security code.</li>
              <li>Your bank's own fraud check on an unfamiliar merchant.</li>
            </ul>
            <p className="text-[#555C56]">
              We receive only “declined” and not the reason. Check the details, try another card, or contact your bank. If a payment fails but you see a pending charge, it is an authorisation hold that your bank will release — typically within a few business days.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-[#4E6155]" />
              Disputes and Chargebacks
            </h2>
            <p className="text-[#555C56] mb-3">
              If something is wrong with your order, contact us first at <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a> or <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a>. Almost every problem — a wrong item, a damaged parcel, a late delivery — can be resolved directly and far more quickly than through a card dispute.
            </p>
            <p className="text-[#555C56]">
              If you do raise a dispute with your card issuer, we will respond to it with the order record, delivery evidence and our correspondence with you, in line with the rules of the relevant card network.
            </p>
          </section>

          {/* Footer Contact Section */}
          <section className="border-t border-[#E8E4DC] pt-6">
            <h2 className="font-serif text-lg text-[#1C201D] mb-2">Questions About Payment</h2>
            <p className="text-[#555C56]">
              Email <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a>, call <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a>, or use the contact form. Monday–Friday, 9:00 AM – 5:00 PM Eastern. We reply within 1 business day.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
