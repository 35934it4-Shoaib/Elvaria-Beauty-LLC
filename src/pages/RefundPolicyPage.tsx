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
            <span>Return & Refund Policy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">Return & Refund Policy</h1>
          <p className="text-[#555C56] max-w-xl mx-auto text-sm sm:text-base">
            Review our return guidelines, eligibility, and refund process below.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-8 text-[#2D332F] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              Returns
            </h2>
            <p className="text-[#555C56]">
              Return any unopened, unused item in its original sealed packaging within 30 days of delivery for a full refund of the item price.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#4E6155]" />
              What Cannot Be Returned
            </h2>
            <p className="text-[#555C56] mb-3">
              For health, hygiene and safety reasons, we cannot accept the return of makeup once the seal is broken or the product has been used — this includes swatching a lipstick, pressing a shadow pan or using a gloss applicator. Brushes, sponges and bags may be returned only if unused and still sealed. This does not apply, and your rights are unaffected, where the item is faulty, damaged in transit or not what you ordered — see damaged or wrong items.
            </p>
            <p className="text-[#555C56]">
              The Essential Brush Set must be returned complete, with all eight brushes unused and the case included.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#4E6155]" />
              How to Return & Return Shipping Cost
            </h2>
            <div className="space-y-3 text-[#555C56]">
              <p>
                Email <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a> with your order number and which items you want to return. Please do this before sending anything back.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We reply within 1 business day with a return authorisation and the return address.</li>
                <li>Pack the items securely in their original packaging and include the authorisation number.</li>
                <li>Send the parcel with a tracked service and keep the receipt.</li>
              </ul>
              <p className="pt-2">
                <strong>Return shipping cost:</strong> We pay return shipping if the item is faulty, damaged in transit, or we sent the wrong thing. You pay return shipping if you have simply changed your mind. The original outbound shipping charge is not refunded in that case. Items lost or damaged on their way back to us remain your responsibility until they arrive, which is why we recommend a tracked service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#4E6155]" />
              Refunds
            </h2>
            <p className="text-[#555C56] space-y-2">
              Once your return arrives we inspect it and email you the outcome. Approved refunds are issued 7 business days after inspection, to the original payment method only — we cannot refund to a different card, to a bank account or as store credit unless you ask for credit specifically.<br/><br/>
              After we issue a refund, your bank or card issuer controls how quickly it appears on your statement; this typically takes a further 3–10 business days and is outside our control.<br/><br/>
              A refund covers the item price. Original outbound shipping is refunded only where the return is our error or the item was faulty. If a refund brings your order below the free-shipping threshold, the original shipping cost may be deducted.<br/><br/>
              If a return arrives opened, used, incomplete or outside the 30-day window, we will contact you. We can return it to you at your cost, but we cannot refund it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#1C201D] mb-3 flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#4E6155]" />
              Damaged, Faulty, or Wrong Items & Lost Parcels
            </h2>
            <p className="text-[#555C56] mb-3">
              Please check your order on arrival. If anything is damaged, faulty or not what you ordered, contact us within 7 days of delivery with your order number, clear photographs of the item and the outer packaging, and a short description of the problem. We will arrange a replacement or a full refund including all shipping, at your choice, and we cover the return postage.
            </p>
            <p className="text-[#555C56]">
              <strong>Lost or missing parcels:</strong> If tracking has not updated for 7 business days, or shows delivered but the parcel is not with you, contact us. We will open an investigation with the carrier — carriers typically require 7–14 days to complete one. Where a parcel is confirmed lost in transit we will replace or refund it in full.
            </p>
          </section>

          <section className="border-t border-[#E8E4DC] pt-6">
            <h2 className="font-serif text-lg text-[#1C201D] mb-2">Start a Return or Ask a Question</h2>
            <p className="text-[#555C56]">
              Email <a href={`mailto:${BRAND_IDENTITY.contactEmail}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactEmail}</a>, call <a href={`tel:${BRAND_IDENTITY.contactPhone}`} className="underline text-[#4E6155]">{BRAND_IDENTITY.contactPhone}</a>, or use the contact form. Monday–Friday, 9:00 AM – 5:00 PM Eastern. We reply within 1 business day.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
