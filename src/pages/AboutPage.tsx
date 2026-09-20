import React from 'react';
import { ShieldCheck, Heart, Sparkles, Droplets, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
          Our Philosophy & Story
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#202420] leading-tight">
          Better Body Care Starts With Better Attention.
        </h1>
        <p className="text-base text-[#68706B] leading-relaxed">
          ELVARIA BEAUTY was created around a simple idea: body care deserves the same thoughtful attention we give to facial skincare.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="bg-white border border-[#DCDDD8] p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-[#68706B] leading-relaxed">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#202420]">
              Why Most Body Lotions Fall Short
            </h2>
            <p>
              For years, body care has been treated as an afterthought—dominated either by heavily perfumed lotions that offer temporary fragrance without meaningful barrier care, or greasy petroleum-based pastes that stick to clothing and feel suffocating in warm weather.
            </p>
            <p>
              We wanted to build something different: a dermatology-inspired daily moisturizer that feels luxurious to apply, absorbs rapidly, and provides genuine, long-lasting relief to dry, tight, and sensitive-feeling skin.
            </p>
          </div>
          <div className="aspect-4/3 bg-[#EFEAE2] border border-[#DCDDD8] overflow-hidden flex items-center justify-center p-6">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
              alt="ELVARIA BEAUTY Philosophy"
              className="w-full h-full object-cover rounded shadow-inner"
            />
          </div>
        </div>

        <div className="border-t border-[#DCDDD8] pt-8 space-y-6">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#202420] text-center">
            Our Four Core Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#F7F5F0] p-6 border border-[#DCDDD8] space-y-2">
              <div className="flex items-center gap-2 text-[#62756A] font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>1. Dermatology-Inspired Formulation</span>
              </div>
              <p className="text-xs text-[#68706B] leading-relaxed">
                We prioritize proven ingredients like Ceramides, Glycerin, and Provitamin B5 that mimic your skin's natural lipid structure.
              </p>
            </div>

            <div className="bg-[#F7F5F0] p-6 border border-[#DCDDD8] space-y-2">
              <div className="flex items-center gap-2 text-[#62756A] font-semibold text-sm">
                <Droplets className="w-4 h-4" />
                <span>2. Non-Heavy Finish</span>
              </div>
              <p className="text-xs text-[#68706B] leading-relaxed">
                Formulated for our regional climate, providing deep hydration that absorbs completely without tackiness or greasiness.
              </p>
            </div>

            <div className="bg-[#F7F5F0] p-6 border border-[#DCDDD8] space-y-2">
              <div className="flex items-center gap-2 text-[#62756A] font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>3. Thoughtful Simplicity</span>
              </div>
              <p className="text-xs text-[#68706B] leading-relaxed">
                No gimmicks or misleading claims. We craft purposeful formulas intended for comfortable daily use by the whole family.
              </p>
            </div>

            <div className="bg-[#F7F5F0] p-6 border border-[#DCDDD8] space-y-2">
              <div className="flex items-center gap-2 text-[#62756A] font-semibold text-sm">
                <Heart className="w-4 h-4" />
                <span>4. Accessible Delivery in Pakistan</span>
              </div>
              <p className="text-xs text-[#68706B] leading-relaxed">
                Fast courier dispatch nationwide with reliable Cash on Delivery so premium skincare is within reach across all provinces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand CTA */}
      <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-heading text-2xl font-bold text-[#202420]">
          Ready to experience daily skin comfort?
        </h3>
        <p className="text-xs text-[#68706B] max-w-md mx-auto">
          Try ELVARIA BEAUTY Medicated Body Lotion today with reliable Cash on Delivery across Pakistan.
        </p>
        <button
          onClick={() => onNavigate('/product/elvaria-medicated-body-lotion')}
          className="bg-[#62756A] text-[#F7F5F0] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors inline-flex items-center gap-2"
        >
          <span>Shop ELVARIA BEAUTY Body Lotion</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
