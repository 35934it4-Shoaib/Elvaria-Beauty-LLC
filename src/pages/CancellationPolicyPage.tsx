import React from 'react';
import { Ban, ShieldAlert, Clock, Mail, Phone, CheckCircle } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/config';

export const CancellationPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Ban className="w-3.5 h-3.5" />
            <span>Order Guidelines</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Order Cancellation Policy</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            Learn about our order cancellation timeframes, guidelines, and how we handle changes before your package is dispatched.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#4E6155]" />
              1. Cancellation Timeframe & Window
            </h2>
            <p className="text-[#555C56]">
              You can cancel your order free of charge within <strong>60 minutes</strong> of placing your order, or at any time before it has been dispatched — whichever is later. We move quickly to pick, pack, and ship your items, so reaching out as early as possible ensures a smooth cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#4E6155]" />
              2. How to Request a Cancellation
            </h2>
            <div className="space-y-3 text-[#555C56]">
              <p>
                To cancel your order, please contact our support concierge immediately with your order number:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Email us at: <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a></li>
                <li>Call us at: <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a></li>
              </ul>
              <p className="pt-2">
                We will confirm your cancellation in writing and issue a full refund back to your original payment method.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#4E6155]" />
              3. After Dispatch
            </h2>
            <p className="text-[#555C56]">
              Once an order has been successfully picked, packed, and dispatched from our facility, it cannot be cancelled. However, you are still welcome to return the unopened and unused items under our standard 30-day Return & Refund Policy once they arrive.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#4E6155]" />
              4. Subscriptions & Memberships
            </h2>
            <p className="text-[#555C56]">
              {BRAND_IDENTITY.name} does not sell recurring subscriptions, automatic memberships, or ongoing replenishment plans. Every order is a standalone purchase, meaning you never have to worry about cancelling recurring charges or unwanted ongoing shipments.
            </p>
          </section>

          <section className="border-t border-[#E8E4DC] pt-6">
            <h2 className="font-serif text-lg text-[#1C201D] mb-2">Need Immediate Assistance?</h2>
            <p className="text-[#555C56]">
              Reach out to our team at <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a> or call <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a>. We reply within 1 business day.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
