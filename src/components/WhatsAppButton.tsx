import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  const phone = settings?.whatsappPhone || '+18005553376';
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const message = encodeURIComponent(
    settings?.whatsappDefaultMessage || 'Hi ELVARIA BEAUTY, I need help with my order.'
  );

  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${message}`;

  return (
    <div id="whatsapp-floating-container" className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Tooltip on hover or preview */}
      {showTooltip && (
        <div className="hidden sm:flex items-center bg-[#202420] text-[#F7F5F0] text-xs py-2 px-3.5 rounded-lg shadow-lg mr-3 border border-[#62756A] animate-in fade-in slide-in-from-right-2">
          <span>Need help? Chat with ELVARIA BEAUTY Care</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="ml-2 text-[#DDE5DF] hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <a
        id="whatsapp-chat-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Chat with ELVARIA BEAUTY Customer Support on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};
