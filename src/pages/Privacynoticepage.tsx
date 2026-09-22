import React from 'react';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/config';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Privacy Notice</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            What we collect, why we collect it, who we share it with and what you can ask us to do about it.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Last updated: August 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          
          {/* Who we are */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#4E6155]" />
              Who We Are
            </h2>
            <p className="text-[#555C56] mb-3">
              {BRAND_IDENTITY.legalName} (“{BRAND_IDENTITY.name}”, “we”, “us”) operates this online store and is the controller of the personal information described in this notice.
            </p>
            <div className="bg-[#F7F5F0] p-4 rounded-xl space-y-2 text-xs text-[#555C56]">
              <div className="font-medium text-[#1C201D]">{BRAND_IDENTITY.legalName}</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#4E6155]" />
                <span>{BRAND_IDENTITY.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#4E6155]" />
                <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline">{BRAND_IDENTITY.contactEmail}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#4E6155]" />
                <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline">{BRAND_IDENTITY.contactPhone}</a>
              </div>
            </div>
          </section>

          {/* What information we collect */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-[#4E6155]" />
              What Information We Collect
            </h2>
            <h3 className="font-semibold text-[#1C201D] text-xs uppercase tracking-wider mb-2">Information you give us</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56] mb-4">
              <li><strong>Order and delivery details:</strong> first and last name, email address, phone number, delivery street address, city, state and ZIP code.</li>
              <li><strong>Order contents:</strong> the products, quantities, prices, shipping method and any order note you add.</li>
              <li><strong>Payment details:</strong> entered directly into Stripe's payment form. We do not receive your full card number.</li>
              <li><strong>Messages:</strong> anything you send through the contact form, by email or by phone, including the order number and topic you select.</li>
              <li><strong>Marketing preferences:</strong> your email address and the fact that you consented, if you tick the marketing box.</li>
            </ul>

            <h3 className="font-semibold text-[#1C201D] text-xs uppercase tracking-wider mb-2">Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56]">
              <li><strong>Session data:</strong> a cookie that remembers your bag, saved items and cookie choice.</li>
              <li><strong>Technical and security logs:</strong> IP address, browser user agent, pages requested and timestamps, used to operate the site and detect abuse.</li>
            </ul>
          </section>

          {/* How we use your information */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#4E6155]" />
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li>To take, process, pack, ship and support your order.</li>
              <li>To send transactional messages: order confirmation, dispatch and tracking, refunds and problems with an order.</li>
              <li>To answer questions you send us.</li>
              <li>To prevent, detect and investigate fraud, card testing and abuse of the site.</li>
              <li>To meet our tax, accounting and consumer-law record-keeping obligations.</li>
              <li>To send marketing email, only where you have given consent, and only until you withdraw it.</li>
            </ul>
            <p className="text-[#555C56] mt-3 font-medium">
              We do not sell your personal information, and we do not share it with third parties for their own advertising.
            </p>
          </section>

          {/* Payments and Stripe */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#4E6155]" />
              Payments and Stripe
            </h2>
            <p className="text-[#555C56] mb-3">
              We use Stripe for payment processing. Stripe, Inc. acts as a data processor for the payment and as an independent controller for its own fraud-prevention and regulatory obligations.
            </p>
            <p className="text-[#555C56] mb-2">When you pay, the following is collected and shared with Stripe to complete the transaction:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555C56] mb-3">
              <li>Your name and email address.</li>
              <li>Your billing and delivery address.</li>
              <li>Your card details — card number, expiry date and security code — which you enter directly into Stripe's hosted payment page.</li>
              <li>The order contents, amount, currency and order number.</li>
              <li>Technical data about the device and session used to pay.</li>
            </ul>
            <p className="text-[#555C56]">
              {BRAND_IDENTITY.name} never receives, processes or stores your full card number, expiry date or card security code. Our systems store only the order details, the payment status and a reference identifier returned by Stripe. Payments are processed by Stripe, which is certified to PCI-DSS Level 1.
            </p>
          </section>

          {/* Fraud detection and prevention */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#4E6155]" />
              Fraud Detection and Prevention
            </h2>
            <p className="text-[#555C56] mb-3">
              Payment data — including data from declined and failed transactions — may be used by us and by Stripe to detect and prevent fraud, card testing and other misuse.
            </p>
            <p className="text-[#555C56]">
              We also apply rate limits and automated abuse checks to our checkout, contact and newsletter forms, recording your IP address and request timing for a short period.
            </p>
          </section>

          {/* Marketing and consent */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#4E6155]" />
              Marketing and Consent
            </h2>
            <p className="text-[#555C56] mb-3">
              We only send marketing email to people who have actively opted in — by ticking the consent box on the newsletter form, or the optional marketing box at checkout. Both are unticked by default.
            </p>
            <p className="text-[#555C56]">
              Every marketing email contains a one-click unsubscribe link. You can also withdraw consent at any time by emailing <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a>.
            </p>
          </section>

          {/* Your rights over your data */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#4E6155]" />
              Your Rights Over Your Data
            </h2>
            <p className="text-[#555C56] mb-3">Depending on where you live, you have the right to access, correct, delete, port, object, or withdraw consent.</p>
            <p className="text-[#555C56]">
              To make a request, email <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a> with the subject “Data rights request”. We will acknowledge within 1 business day and respond substantively within 45 days.
            </p>
          </section>

          {/* Footer Contact Section */}
          <section className="border-t border-[#E8E4DC] pt-6">
            <h2 className="font-serif text-lg text-[#1C201D] mb-2">Privacy Questions</h2>
            <p className="text-[#555C56]">
              Email <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a>, call <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a>, or use the contact form and select “Privacy or my data”.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
