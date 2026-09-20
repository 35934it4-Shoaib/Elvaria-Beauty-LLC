import React from 'react';
import { RotateCcw, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/config';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>30-Day Skin Comfort Guarantee</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Return & Refund Policy</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            Your skin comfort is our highest commitment. If you are not completely satisfied, we make returns straightforward and stress-free.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Hassle-Free 30-Day Window</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              1. Our 30-Day Comfort Guarantee
            </h2>
            <p className="text-[#555C56]">
              Skincare is personal. If you try {BRAND_IDENTITY.name} and your skin does not find the comfort or moisturization you anticipated, you may request a return or product exchange within <strong>30 calendar days</strong> of receiving your delivery.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#4E6155]" />
              2. Eligibility & Guidelines
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li><strong>Bottled Formulas:</strong> Bottles must be at least 60% full to be eligible for standard returns.</li>
              <li><strong>Tools & Accessories:</strong> Must be in original packaging and unwashed/unused for hygiene reasons (unless arrived damaged).</li>
              <li><strong>Gift Bundles:</strong> Entire bundle or individual unopened units can be processed for partial or full refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#4E6155]" />
              3. How to Initiate a Return
            </h2>
            <div className="space-y-3 text-[#555C56]">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F0]">
                <div className="w-6 h-6 rounded-full bg-[#4E6155] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <div className="font-medium text-[#1C201D]">Email Our Support Concierge</div>
                  <div className="text-xs text-[#555C56]">Send an email to <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a> with your order number (e.g. ELV-102938) and the reason for your return.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F0]">
                <div className="w-6 h-6 rounded-full bg-[#4E6155] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <div className="font-medium text-[#1C201D]">Receive Your Prepaid Return Slip</div>
                  <div className="text-xs text-[#555C56]">Our customer team will reply within 24 business hours with simple return shipping instructions.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F0]">
                <div className="w-6 h-6 rounded-full bg-[#4E6155] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <div className="font-medium text-[#1C201D]">Prompt Refund Issuance</div>
                  <div className="text-xs text-[#555C56]">Once the return package is logged at our warehouse, your original payment method will be credited within 3–5 business days.</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
