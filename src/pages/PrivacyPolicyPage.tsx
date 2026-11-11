import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Transparency & Trust</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Privacy Policy</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            How Elvaria Beauty collects, protects, and handles your personal information with care.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Last Updated: November 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-[#4E6155]" />
              1. Information We Collect
            </h2>
            <p className="mb-3 text-[#555C56]">
              When you visit or place an order through Elvaria Beauty, we collect personal details necessary to fulfill your purchases and provide a seamless shopping experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li><strong>Contact Information:</strong> Your name, delivery address, phone number, and email address.</li>
              <li><strong>Order Details:</strong> Items purchased, shipping preferences, and order history.</li>
              <li><strong>Payment Information:</strong> Processed through secure PCI-DSS compliant third-party payment gateways (e.g. Stripe). Elvaria Beauty never stores your full credit card number or CVV on our servers.</li>
              <li><strong>Technical Data:</strong> Anonymized browsing patterns, device type, and IP address collected via cookies to optimize website performance.</li>
            </ul>
          </section>

          {/* Section 2: Mobile & SMS Opt-In Privacy */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#4E6155]" />
              2. Mobile Information & SMS Privacy
            </h2>
            <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2] text-sm text-[#464D47] space-y-2">
              <p>
                Mobile opt-in information, including phone numbers and SMS consent, will not be shared with third parties for marketing purposes.
              </p>
              <p>
                We use your mobile information and SMS consent exclusively to send the informational and transactional messages you asked for (such as order updates, appointment reminders, and account notifications).
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#4E6155]" />
              3. How We Use Your Information
            </h2>
            <p className="mb-3 text-[#555C56]">Your information is used strictly for legitimate business and customer service purposes:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2]">
                <div className="font-medium text-[#1C201D] mb-1">Order Fulfillment</div>
                <div className="text-xs text-[#555C56]">Processing transactions, preparing dispatches, and sending delivery tracking updates.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2]">
                <div className="font-medium text-[#1C201D] mb-1">Customer Support</div>
                <div className="text-xs text-[#555C56]">Responding to inquiries regarding orders and notifications.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2]">
                <div className="font-medium text-[#1C201D] mb-1">Account Management</div>
                <div className="text-xs text-[#555C56]">Managing your profile, saved items, and order history.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#EFEAE2]">
                <div className="font-medium text-[#1C201D] mb-1">Consensual Updates</div>
                <div className="text-xs text-[#555C56]">Sending notifications only if you opt-in (you can unsubscribe anytime).</div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#4E6155]" />
              4. Data Security & Storage
            </h2>
            <p className="text-[#555C56]">
              We implement industry-standard 256-bit SSL encryption and strict administrative safeguards. We do not sell, rent, or trade your personal data to third parties for commercial marketing purposes. Data is retained only for as long as necessary to fulfill orders and meet legal compliance obligations.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#4E6155]" />
              5. Your Rights & Contact
            </h2>
            <p className="text-[#555C56] mb-3">
              You have the right to request access to your personal data, request corrections, or request deletion of your account at any time.
            </p>
            <p className="text-[#555C56]">
              For any privacy-related inquiries, please email us at{' '}
              <a href="mailto:contact@elvariabeautyllc.com" className="text-[#4E6155] underline font-medium">
                contact@elvariabeautyllc.com
              </a>{' '}
              or write to Elvaria Beauty LLC.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
