import React from 'react';
import { Truck, Clock, Globe, PackageCheck } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/config';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAE2] text-[#4E6155] text-xs font-semibold tracking-wider uppercase mb-4">
            <Truck className="w-3.5 h-3.5" />
            <span>Fast & Reliable Dispatch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Shipping & Delivery Policy</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to know about our packaging, handling times, and delivery partners.
          </p>
          <p className="text-xs text-[#828C84] mt-2">Free shipping on orders over $50.00</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#4E6155]" />
              1. Processing & Handling Times
            </h2>
            <p className="text-[#555C56] mb-3">
              Every bottle and body tool is inspected and securely packaged in our climate-controlled fulfillment centers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#555C56]">
              <li>Orders placed Monday through Friday before 2:00 PM EST are dispatched on the same or next business day.</li>
              <li>Orders placed on weekends or observed national holidays are processed on the following Monday morning.</li>
              <li>You will receive an automated dispatch notification email with your courier tracking link as soon as your parcel is scanned.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-4 flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#4E6155]" />
              2. Shipping Rates & Delivery Estimates
            </h2>
            <div className="overflow-hidden rounded-xl border border-[#E8E4DC]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F7F5F0] text-[#1C201D] border-b border-[#E8E4DC] font-medium">
                  <tr>
                    <th className="py-3.5 px-4">Tier / Destination</th>
                    <th className="py-3.5 px-4">Estimated Transit</th>
                    <th className="py-3.5 px-4">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEAE2] text-[#464D47]">
                  <tr>
                    <td className="py-3 px-4 font-medium">Domestic Standard (Over $50)</td>
                    <td className="py-3 px-4">3–5 Business Days</td>
                    <td className="py-3 px-4 text-[#2E6B48] font-semibold">FREE</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Domestic Standard (Under $50)</td>
                    <td className="py-3 px-4">3–5 Business Days</td>
                    <td className="py-3 px-4">$5.00 Flat Rate</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Domestic Priority Express</td>
                    <td className="py-3 px-4">1–2 Business Days</td>
                    <td className="py-3 px-4">$12.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">International Standard</td>
                    <td className="py-3 px-4">6–10 Business Days</td>
                    <td className="py-3 px-4">$15.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <PackageCheck className="w-5 h-5 text-[#4E6155]" />
              3. Secure Protective Packaging
            </h2>
            <p className="text-[#555C56]">
              All liquid and pump bottles are sealed with leak-prevention pump clips and packed with biodegradable cushion padding to prevent spills or transit shock. In the unlikely event that a parcel arrives with transit damage, please take a clear photograph and contact {BRAND_IDENTITY.contactEmail} within 48 hours for immediate replacement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
