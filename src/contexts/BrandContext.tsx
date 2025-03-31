
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Local storage keys
const BRAND_NAME_KEY = 'brand_name';
const WEBSITE_URL_KEY = 'website_url';
const LOGO_URL_KEY = 'logo_url';
const SETUP_COMPLETE_KEY = 'initial_setup_complete';

interface BrandContextType {
  brandName: string;
  websiteUrl: string;
  logoUrl: string | null;
  isSetupComplete: boolean;
}

const defaultContext: BrandContextType = {
  brandName: 'ROSCH.UK', // Default value
  websiteUrl: 'https://rosch.uk',
  logoUrl: null,
  isSetupComplete: false,
};

const BrandContext = createContext<BrandContextType>(defaultContext);

export const useBrand = () => useContext(BrandContext);

interface BrandProviderProps {
  children: ReactNode;
}

export const BrandProvider: React.FC<BrandProviderProps> = ({ children }) => {
  const [brandInfo, setBrandInfo] = useState<BrandContextType>(defaultContext);

  useEffect(() => {
    const isSetupComplete = localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
    const brandName = localStorage.getItem(BRAND_NAME_KEY) || defaultContext.brandName;
    const websiteUrl = localStorage.getItem(WEBSITE_URL_KEY) || defaultContext.websiteUrl;
    const logoUrl = localStorage.getItem(LOGO_URL_KEY) || null;

    setBrandInfo({
      brandName,
      websiteUrl,
      logoUrl,
      isSetupComplete,
    });
  }, []);

  return (
    <BrandContext.Provider value={brandInfo}>
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContext;
