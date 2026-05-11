import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getContacts } from '@/lib/contentService';
import './Contatos.css';
export default function Contatos() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getContacts()
            .then(data => setContacts(data.filter(c => c.active)))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Fale Conosco" }), _jsx("h1", { className: "page-hero__title", children: "Contatos" }), _jsx("p", { className: "page-hero__subtitle", children: "Nossa equipe est\u00E1 pronta para atend\u00EA-lo da melhor forma." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: loading ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: "Carregando..." })) : contacts.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: _jsx("p", { children: "Nenhum contato dispon\u00EDvel no momento." }) })) : (_jsx("div", { className: "contatos__grid", children: contacts.map((c) => {
                            const initials = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                            return (_jsxs("div", { className: "contato-card", children: [_jsxs("div", { className: "contato-card__header", children: [_jsx("div", { className: "contato-card__avatar", children: initials }), _jsxs("div", { children: [_jsx("h2", { className: "contato-card__name", children: c.name }), c.role && _jsx("p", { className: "contato-card__role", children: c.role })] })] }), _jsxs("ul", { className: "contato-card__list", children: [c.email && _jsxs("li", { children: [_jsx("span", { children: "\u2709" }), _jsx("span", { children: c.email })] }), c.phone && _jsxs("li", { children: [_jsx("span", { children: "\u260E" }), _jsx("span", { children: c.phone })] }), c.mobile && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCF1" }), _jsx("span", { children: c.mobile })] }), c.address && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCCD" }), _jsx("span", { children: c.address })] })] })] }, c.id));
                        }) })) }) }), _jsx(Footer, {})] }));
}
