import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const text =
    settings?.announcementText ||
    'Complimentary Standard Delivery on orders over $50.00 • 30-Day Skin Comfort Guarantee';

  return (
    <div
      id="announcement-bar"
      className="bg-[#202420] text-[#F7F5F0] text-[11px] py-2 px-4 tracking-wider uppercase font-medium border-b border-[#383D39]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-[#DDE5DF]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A5B5A8]" />
          <span>Dermatology-Inspired Body Care</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-[#A5B5A8]" />
          <span>{text}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] tracking-wider text-[#DDE5DF]">
          <Sparkles className="w-3 h-3 text-[#A5B5A8]" />
          <span>Worldwide Shipping</span>
        </div>
      </div>
    </div>
  );
};
