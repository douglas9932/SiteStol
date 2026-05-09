import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCompany } from '@/hooks/useCompany';
import './Footer.css';
const CONTACTS = [
    {
        name: 'João Carlos Mendes',
        role: 'Diretor Operacional',
        email: 'joao.mendes@aerotech.com.br',
        phone: '(45) 3224-1100',
        mobile: '(45) 99812-3456',
        address: 'Av. das Indústrias, 1420 — Palotina, PR',
    },
    {
        name: 'Fernanda Oliveira',
        role: 'Gerente Comercial',
        email: 'fernanda@aerotech.com.br',
        phone: '(45) 3224-1101',
        mobile: '(45) 99900-7788',
        address: 'Av. das Indústrias, 1420 — Palotina, PR',
    },
];
export default function Footer() {
    const year = new Date().getFullYear();
    const company = useCompany();
    const name = company.name || 'AeroTech Brasil';
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return (_jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer__inner container", children: [_jsxs("div", { className: "footer__top", children: [_jsxs("div", { className: "footer__brand", children: [_jsxs("div", { className: "footer__brand-logo", children: [company.icon_url
                                            ? _jsx("img", { src: company.icon_url, alt: name, className: "footer__brand-icon-img" })
                                            : _jsx("div", { className: "footer__brand-icon", children: initials.slice(0, 2) }), _jsx("span", { className: "footer__brand-name", children: name })] }), _jsx("p", { className: "footer__brand-desc", children: "Refer\u00EAncia nacional em avia\u00E7\u00E3o agr\u00EDcola e servi\u00E7os aeron\u00E1uticos desde 2005. Homologados pela ANAC, comprometidos com seguran\u00E7a e resultados de alto padr\u00E3o." }), _jsxs("div", { className: "footer__badges", children: [_jsx("span", { className: "footer__badge", children: "ANAC Homologado" }), _jsx("span", { className: "footer__badge", children: "ISO 9001" }), _jsx("span", { className: "footer__badge", children: "18+ Anos" })] })] }), _jsxs("div", { className: "footer__contacts", children: [_jsx("h3", { className: "footer__contacts-title", children: "Fale Conosco" }), _jsx("div", { className: "footer__contacts-grid", children: CONTACTS.map((c) => {
                                        const ini = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                                        return (_jsxs("div", { className: "footer__contact", children: [_jsxs("div", { className: "footer__contact-header", children: [_jsx("div", { className: "footer__contact-avatar", children: ini }), _jsxs("div", { children: [_jsx("p", { className: "footer__contact-name", children: c.name }), _jsx("p", { className: "footer__contact-role", children: c.role })] })] }), _jsxs("ul", { className: "footer__contact-list", children: [_jsxs("li", { children: [_jsx("span", { children: "\u2709" }), c.email] }), _jsxs("li", { children: [_jsx("span", { children: "\u260E" }), c.phone] }), _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCF1" }), c.mobile] }), _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCCD" }), c.address] })] })] }, c.email));
                                    }) })] })] }), _jsxs("div", { className: "footer__bottom", children: [_jsxs("p", { children: ["\u00A9 ", year, " ", name, ". Todos os direitos reservados."] }), _jsx("p", { children: "CNPJ: 12.345.678/0001-90 \u00B7 Palotina, Paran\u00E1 \u2014 Brasil" })] })] }) }));
}
