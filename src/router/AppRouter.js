import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Sobre from '@/pages/Sobre';
import Produtos from '@/pages/Produtos';
import Noticias from '@/pages/Noticias';
import TabelaCalibracao from '@/pages/TabelaCalibracao';
import TestesStol from '@/pages/TestesStol';
import Contatos from '@/pages/Contatos';
import AdminHome from '@/pages/admin/AdminHome';
import PreviewPage from '@/pages/admin/PreviewPage';
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
    return null;
}
function Layout({ children }) {
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), children] }));
}
function AdminLayout({ children }) {
    return _jsx(_Fragment, { children: children });
}
export default function AppRouter() {
    return (_jsxs(_Fragment, { children: [_jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Layout, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/sobre", element: _jsx(Layout, { children: _jsx(Sobre, {}) }) }), _jsx(Route, { path: "/produtos", element: _jsx(Layout, { children: _jsx(Produtos, {}) }) }), _jsx(Route, { path: "/noticias", element: _jsx(Layout, { children: _jsx(Noticias, {}) }) }), _jsx(Route, { path: "/calibracao", element: _jsx(Layout, { children: _jsx(TabelaCalibracao, {}) }) }), _jsx(Route, { path: "/stol", element: _jsx(Layout, { children: _jsx(TestesStol, {}) }) }), _jsx(Route, { path: "/contatos", element: _jsx(Layout, { children: _jsx(Contatos, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(AdminLayout, { children: _jsx(AdminHome, {}) }) }), _jsx(Route, { path: "/preview", element: _jsx(AdminLayout, { children: _jsx(PreviewPage, {}) }) })] })] }));
}
