import { useState, useEffect } from 'react';
import { getCompanySettings, CompanySettings } from '@/lib/contentService';

const defaultCompany: CompanySettings = {
  name: '', icon_url: '',
  color_primary: '#0a1628', color_secondary: '#c8972a',
};

export function useCompany() {
  const [company, setCompany] = useState<CompanySettings>(defaultCompany);

  useEffect(() => {
    getCompanySettings().then(setCompany);
  }, []);

  return company;
}