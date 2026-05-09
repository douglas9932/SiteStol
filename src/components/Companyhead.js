import { useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { applyCompanyColors } from '@/lib/contentService';
export default function CompanyHead() {
    const company = useCompany();
    useEffect(() => {
        if (company.name)
            document.title = company.name;
    }, [company.name]);
    useEffect(() => {
        if (company.icon_url) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = company.icon_url;
        }
    }, [company.icon_url]);
    useEffect(() => {
        // Aplica cores assim que carregam do Supabase
        if (company.color_primary || company.color_secondary) {
            applyCompanyColors(company);
        }
    }, [company.color_primary, company.color_secondary]);
    return null;
}
