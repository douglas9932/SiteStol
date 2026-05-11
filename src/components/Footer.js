import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { getContacts } from '@/lib/contentService';
import './Footer.css';
export default function Footer() {
    const year = new Date().getFullYear();
    const company = useCompany();
    const name = company.name || 'AeroTech Brasil';
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        getContacts().then(data => setContacts(data.filter(c => c.active)));
    }, []);
    return (_jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer__inner container", children: [_jsxs("div", { className: "footer__top", children: [_jsxs("div", { className: "footer__brand", children: [_jsxs("div", { className: "footer__brand-logo", children: [company.icon_url
                                            ? _jsx("img", { src: company.icon_url, alt: name, className: "footer__brand-icon-img" })
                                            : _jsx("div", { className: "footer__brand-icon", children: initials.slice(0, 2) }), _jsx("span", { className: "footer__brand-name", children: name })] }), company.description && (_jsx("p", { className: "footer__brand-desc", children: company.description }))] }), contacts.length > 0 && (_jsxs("div", { className: "footer__contacts", children: [_jsx("h3", { className: "footer__contacts-title", children: "Fale Conosco" }), _jsx("div", { className: "footer__contacts-grid", children: contacts.map((c) => {
                                        const ini = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                                        return (_jsxs("div", { className: "footer__contact", children: [_jsxs("div", { className: "footer__contact-header", children: [_jsx("div", { className: "footer__contact-avatar", children: ini }), _jsxs("div", { children: [_jsx("p", { className: "footer__contact-name", children: c.name }), c.role && _jsx("p", { className: "footer__contact-role", children: c.role })] })] }), _jsxs("ul", { className: "footer__contact-list", children: [c.email && _jsxs("li", { children: [_jsx("span", { children: "\u2709" }), c.email] }), c.phone && _jsxs("li", { children: [_jsx("span", { children: "\u260E" }), c.phone] }), c.mobile && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCF1" }), c.mobile] }), c.address && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCCD" }), c.address] })] })] }, c.id));
                                    }) })] }))] }), _jsxs("div", { className: "footer__bottom", children: [_jsxs("p", { children: ["\u00A9 ", year, " ", name, ". Todos os direitos reservados."] }), company.cnpj && _jsx("p", { children: company.cnpj })] })] }) }));
}
