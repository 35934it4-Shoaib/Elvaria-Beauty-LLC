import React, { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import { api } from '../services/api';
import { Search, Sparkles, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

interface IngredientsPageProps {
  onNavigate: (path: string) => void;
}

export const IngredientsPage: React.FC<IngredientsPageProps> = ({ onNavigate }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('all');

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const res = await api.getIngredients();
        if (res.success) {
          setIngredients(res.ingredients);
        }
      } catch (e) {
        console.error('Failed to load ingredients:', e);
      }
    };
    loadIngredients();
  }, []);

  const functions = ['all', 'Hydrator', 'Barrier Support', 'Soothing & Hydration', 'Emollient', 'Antioxidant'];

  const filtered = ingredients.filter((ing) => {
    if (selectedFunction !== 'all' && ing.function !== selectedFunction) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        ing.name.toLowerCase().includes(q) ||
        (ing.shortDescription && ing.shortDescription.toLowerCase().includes(q)) ||
        (ing.detailedExplanation && ing.detailedExplanation.toLowerCase().includes(q)) ||
        ing.function.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="ingredients-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-8 sm:p-12 text-left space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Formulation Transparency
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#202420]">
          Thoughtful Ingredients. Purposeful Care.
        </h1>
        <p className="text-sm text-[#68706B] max-w-2xl leading-relaxed">
          At ELVARIA BEAUTY, we believe you should know exactly what touches your skin every day. Our formulations are rooted in dermatological science, balancing proven hydrators and skin-identical lipids with daily comfort.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#DCDDD8] p-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#68706B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ingredients or benefits..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F5F0] border border-[#DCDDD8] text-[#202420] focus:outline-none focus:border-[#62756A]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#68706B] font-medium shrink-0">Filter by:</span>
          {functions.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFunction(f)}
              className={`px-3 py-1.5 text-xs rounded-xs border transition-colors shrink-0 ${
                selectedFunction === f
                  ? 'bg-[#62756A] text-[#F7F5F0] border-[#62756A]'
                  : 'bg-[#F7F5F0] text-[#202420] border-[#DCDDD8] hover:border-[#68706B]'
              }`}
            >
              {f === 'all' ? 'All Ingredients' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ing) => (
          <div
            key={ing.id}
            className="bg-white border border-[#DCDDD8] p-6 space-y-4 hover:border-[#62756A] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-[#EFEAE2] text-[#62756A] px-2 py-0.5 rounded border border-[#DCDDD8]">
                  {ing.function}
                </span>
                {ing.isFeatured && (
                  <span className="text-[10px] text-[#62756A] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Core Hydrator
                  </span>
                )}
              </div>

              <h3 className="font-heading text-lg font-bold text-[#202420]">{ing.name}</h3>

              <p className="text-xs text-[#68706B] leading-relaxed">
                {ing.detailedExplanation || ing.shortDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-[#EFEAE2] flex justify-between items-center text-xs">
              <span className="text-[#62756A] font-medium">Included in Body Lotion</span>
              <button
                onClick={() => onNavigate('/product/elvaria-medicated-body-lotion')}
                className="text-[#202420] hover:text-[#62756A] font-semibold flex items-center gap-1"
              >
                <span>View Product</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer Section */}
      <div className="bg-[#F7F5F0] border border-[#DCDDD8] p-6 text-center space-y-2 max-w-3xl mx-auto">
        <h4 className="font-heading text-xs uppercase tracking-widest font-semibold text-[#62756A]">
          Transparency & Safety Standards
        </h4>
        <p className="text-xs text-[#68706B] leading-relaxed">
          ELVARIA BEAUTY formulations are formulated for general cosmetic care and daily hydration of dry-feeling skin. They do not treat, cure, or diagnose medical conditions. Always patch-test new skincare products on a small patch of skin prior to widespread use.
        </p>
      </div>
    </div>
  );
};
