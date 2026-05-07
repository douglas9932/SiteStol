import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import './Contatos.css';
const CONTACTS = [
    { name: 'João Carlos Mendes', role: 'Diretor Operacional', email: 'joao.mendes@aerotech.com.br', phone: '(45) 3224-1100', mobile: '(45) 99812-3456', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
    { name: 'Fernanda Oliveira', role: 'Gerente Comercial', email: 'fernanda@aerotech.com.br', phone: '(45) 3224-1101', mobile: '(45) 99900-7788', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
    { name: 'Roberto Cascavel', role: 'Suporte Técnico', email: 'roberto@aerotech.com.br', phone: '(45) 3224-1102', mobile: '(45) 99777-4433', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
];
export default function Contatos() {
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Fale Conosco" }), _jsx("h1", { className: "page-hero__title", children: "Contatos" }), _jsx("p", { className: "page-hero__subtitle", children: "Nossa equipe est\u00E1 pronta para atend\u00EA-lo da melhor forma." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsx("div", { className: "contatos__grid", children: CONTACTS.map((c) => {
                            const initials = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                            return (_jsxs("div", { className: "contato-card", children: [_jsxs("div", { className: "contato-card__header", children: [_jsx("div", { className: "contato-card__avatar", children: initials }), _jsxs("div", { children: [_jsx("h2", { className: "contato-card__name", children: c.name }), _jsx("p", { className: "contato-card__role", children: c.role })] })] }), _jsxs("ul", { className: "contato-card__list", children: [_jsxs("li", { children: [_jsx("span", { children: "\u2709" }), _jsx("span", { children: c.email })] }), _jsxs("li", { children: [_jsx("span", { children: "\u260E" }), _jsx("span", { children: c.phone })] }), _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCF1" }), _jsx("span", { children: c.mobile })] }), _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCCD" }), _jsx("span", { children: c.address })] })] })] }, c.email));
                        }) }) }) }), _jsx(Footer, {})] }));
}
