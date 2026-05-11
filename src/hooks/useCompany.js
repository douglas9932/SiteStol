import { useState, useEffect } from 'react';
import { getCompanySettings } from '@/lib/contentService';
const defaultCompany = {
    name: '', icon_url: '',
    color_primary: '#0a1628', color_secondary: '#c8972a',
    description: '', cnpj: '',
};
export function useCompany() {
    const [company, setCompany] = useState(defaultCompany);
    useEffect(() => {
        getCompanySettings().then(setCompany);
    }, []);
    return company;
}
