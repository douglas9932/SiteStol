import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { IS_APR } from './ApresentacaoBanner';
import './Navbar.css';
const NAV_ITEMS = [
    { path: '/sobre', label: 'Sobre' },
    { path: '/produtos', label: 'Produtos' },
    { path: '/noticias', label: 'Notícias' },
    { path: '/calibracao', label: 'Tabela de Calibração' },
    { path: '/contatos', label: 'Contatos' },
];
export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const company = useCompany();
    const isActive = (path) => location.pathname === path;
    const isAdmin = location.pathname.startsWith('/admin');
    const closeMenu = () => setMenuOpen(false);
    const companyName = company.name || 'AeroTech';
    const firstWord = companyName.split(' ')[0];
    const rest = companyName.split(' ').slice(1).join(' ');
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar__inner", children: [_jsxs(Link, { to: "/", className: "navbar__logo", onClick: closeMenu, children: [company.icon_url
                                    ? _jsx("img", { src: company.icon_url, alt: companyName, className: "navbar__logo-img" })
                                    : _jsx("div", { className: "navbar__logo-icon", children: companyName.slice(0, 2).toUpperCase() }), _jsxs("div", { className: "navbar__logo-text", children: [_jsx("span", { className: "navbar__logo-name", children: firstWord }), rest && _jsx("span", { className: "navbar__logo-sub", children: rest })] })] }), _jsx("div", { className: "navbar__links", children: NAV_ITEMS.map((item) => (_jsx(Link, { to: item.path, className: `navbar__link ${isActive(item.path) ? 'navbar__link--active' : ''}`, children: item.label }, item.path))) }), IS_APR && (_jsx("button", { className: "navbar__admin-btn", onClick: () => navigate('/login'), children: "\uD83D\uDD10 Administra\u00E7\u00E3o" })), _jsxs("button", { className: `navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`, onClick: () => setMenuOpen((v) => !v), "aria-label": "Abrir menu", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] })] }) }), _jsx("div", { className: `mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`, children: NAV_ITEMS.map((item) => (_jsx(Link, { to: item.path, className: `mobile-menu__link ${isActive(item.path) ? 'mobile-menu__link--active' : ''}`, onClick: closeMenu, children: item.label }, item.path))) })] }));
}
