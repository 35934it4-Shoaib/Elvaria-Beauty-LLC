import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';
import { BRAND_IDENTITY } from '../data/config';

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: BRAND_IDENTITY.name,
  legalName: BRAND_IDENTITY.legalName,
  storeName: BRAND_IDENTITY.name,
  tagline: BRAND_IDENTITY.tagline,
  secondaryTagline: BRAND_IDENTITY.subtagline,
  announcementText: 'Complimentary Worldwide Shipping on All Orders Over $50',
  announcementEnabled: true,
  freeShippingThreshold: 50,
  standardShippingFee: 5.95,
  currency: 'USD',
  currencySymbol: '$',
  whatsappPhone: BRAND_IDENTITY.whatsappNumber,
  whatsappDefaultMessage: BRAND_IDENTITY.whatsappDefaultMsg,
  contactEmail: BRAND_IDENTITY.contactEmail,
  supportEmail: BRAND_IDENTITY.contactEmail,
  contactPhone: BRAND_IDENTITY.contactPhone,
  contactAddress: BRAND_IDENTITY.address,
  instagramUrl: 'https://instagram.com/elvariabeauty',
  facebookUrl: 'https://facebook.com/elvariabeauty',
  tiktokUrl: 'https://tiktok.com/@elvariabeauty',
  medicalDisclaimer:
    'Products are formulated for daily skin comfort and barrier support. Always review product labels and patch test prior to full application.',
  placeholderClaimsWarning:
    'ELVARIA BEAUTY body care formulations are inspired by dermatology principles.',
  stripeEnabled: true,
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await api.updateSettings(newSettings);
      if (res.success && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update settings:', e);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
