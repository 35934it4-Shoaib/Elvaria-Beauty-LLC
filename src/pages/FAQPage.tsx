import React, { useState, useEffect } from 'react';
import { FAQ } from '../types';
import { api } from '../services/api';
import { Search, ChevronDown, HelpCircle, MessageCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await api.getFaqs();
        if (res.success) {
          setFaqs(res.faqs.filter((f) => f.isPublished));
        }
      } catch (e) {
        console.error('Failed to load faqs:', e);
      }
    };
    loadFaqs();
  }, []);

  const categories = ['all', 'General', 'Product', 'Usage', 'Orders & Shipping', 'Safety'];

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const cleanPhone = (settings?.whatsappPhone || '+18005553376').replace(/[^\d+]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    'Hi ELVARIA BEAUTY, I have a question not covered in the FAQs.'
  )}`;

  return (
    <div id="faq-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
          Help & Support
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#202420]">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#68706B] max-w-xl mx-auto">
          Find transparent answers about ELVARIA BEAUTY formulation, daily usage, skin types, Cash on Delivery, and delivery across Pakistan.
        </p>
      </div>

      {/* Regulatory Health Notice */}
      <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-5 rounded-xs flex items-start gap-3 text-xs text-[#68706B] leading-relaxed">
        <AlertCircle className="w-5 h-5 text-[#62756A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#202420] block mb-0.5">Medical & Cosmetic Information Notice</strong>
          <span>
            ELVARIA BEAUTY products are formulated for cosmetic hydration and comfort of dry, tight, and sensitive-feeling skin. They do not claim to treat, cure, or replace prescribed clinical therapies for eczema, psoriasis, or dermatitis. For specific skin conditions, please consult a qualified healthcare professional or dermatologist.
          </span>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white border border-[#DCDDD8] p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#68706B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F5F0] border border-[#DCDDD8] text-[#202420] focus:outline-none focus:border-[#62756A]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xs border transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#62756A] text-[#F7F5F0] border-[#62756A]'
                  : 'bg-[#F7F5F0] text-[#202420] border-[#DCDDD8] hover:border-[#68706B]'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-[#DCDDD8] p-8 text-center text-xs text-[#68706B]">
            No questions matched your search query. Try typing another keyword.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-white border border-[#DCDDD8]">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading text-sm font-semibold text-[#202420] hover:text-[#62756A] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#68706B] shrink-0 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#62756A]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#68706B] leading-relaxed border-t border-[#F7F5F0]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Unanswered questions CTA */}
      <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-8 text-center space-y-3">
        <h3 className="font-heading text-base font-bold text-[#202420]">
          Still have a question?
        </h3>
        <p className="text-xs text-[#68706B] max-w-sm mx-auto">
          Our friendly customer support team in Lahore is ready to assist you on WhatsApp with any product or delivery inquiry.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 text-xs font-semibold rounded hover:bg-[#1EBE5D] transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
