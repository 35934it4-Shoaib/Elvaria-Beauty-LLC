import React from 'react';
import { BookOpen, ShieldCheck, Scale, MessageSquare } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Store Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Terms & Conditions</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            Please read these terms carefully before purchasing or interacting with Elvaria Beauty.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Effective Date: November 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#4E6155]" />
              1. General Use & Acceptance
            </h2>
            <p className="text-[#555C56]">
              By accessing, browsing, or purchasing from Elvaria Beauty, operated by Elvaria Beauty LLC ("the Company", "the Site"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services.
            </p>
          </section>

          {/* Section 2: SMS & Information Messaging Consent */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#4E6155]" />
              2. SMS & Information Messaging Consent
            </h2>
            <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2] text-sm text-[#464D47] space-y-2">
              <p>
                You agree to receive information messages (appointment reminders, account notifications, order updates, etc.) from Elvaria Beauty LLC. Message frequency varies. Message and data rates may apply.
              </p>
              <p>
                For help, reply <strong>HELP</strong> or email us at <a href="mailto:contact@elvariabeautyllc.com" className="text-[#4E6155] underline font-medium">contact@elvariabeautyllc.com</a>.
              </p>
              <p>
                You can opt out at any time by replying <strong>STOP</strong>.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              3. Pricing, Orders & Payments
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li>All product prices are listed in USD ($) unless explicitly toggled otherwise, excluding applicable local customs or regional sales taxes at checkout.</li>
              <li>We reserve the right to cancel or adjust orders placed with erroneous pricing, suspected fraudulent activity, or unexpected inventory depletion. In such events, prompt refunds will be issued.</li>
              <li>Payment methods include major credit/debit cards processed securely via encrypted payment providers.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3">4. Intellectual Property</h2>
            <p className="text-[#555C56]">
              All brand names, product titles, photography, descriptions, typography layouts, and logo graphics are the proprietary intellectual property of Elvaria Beauty. Unauthorized reproduction or commercial use without prior written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3">5. Governing Law</h2>
            <p className="text-[#555C56]">
              These terms shall be governed by and construed in accordance with applicable consumer protection and commercial laws. For any legal inquiries, please contact <a href="mailto:contact@elvariabeautyllc.com" className="text-[#4E6155] underline font-medium">contact@elvariabeautyllc.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;
