import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Sobre from '@/pages/Sobre';
import Produtos from '@/pages/Produtos';
import ProdutoDetalhe from '@/pages/ProdutoDetalhe';
import Noticias from '@/pages/Noticias';
import NoticiaDetalhe from '@/pages/NoticiaDetalhe';
import TabelaCalibracao from '@/pages/TabelaCalibracao';
import Contatos from '@/pages/Contatos';
import Login from '@/pages/Login';
import AdminHome from '@/pages/admin/AdminHome';
import PreviewPage from '@/pages/admin/PreviewPage';
import PrivateRoute from '@/components/PrivateRoute';
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
    return null;
}
function Layout({ children }) {
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), children] }));
}
function Standalone({ children }) {
    return _jsx(_Fragment, { children: children });
}
export default function AppRouter() {
    return (_jsxs(_Fragment, { children: [_jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Layout, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/sobre", element: _jsx(Layout, { children: _jsx(Sobre, {}) }) }), _jsx(Route, { path: "/produtos", element: _jsx(Layout, { children: _jsx(Produtos, {}) }) }), _jsx(Route, { path: "/produtos/:id", element: _jsx(Layout, { children: _jsx(ProdutoDetalhe, {}) }) }), _jsx(Route, { path: "/noticias", element: _jsx(Layout, { children: _jsx(Noticias, {}) }) }), _jsx(Route, { path: "/noticias/:id", element: _jsx(Layout, { children: _jsx(NoticiaDetalhe, {}) }) }), _jsx(Route, { path: "/calibracao", element: _jsx(Layout, { children: _jsx(TabelaCalibracao, {}) }) }), _jsx(Route, { path: "/contatos", element: _jsx(Layout, { children: _jsx(Contatos, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Standalone, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(PrivateRoute, { children: _jsx(Standalone, { children: _jsx(AdminHome, {}) }) }) }), _jsx(Route, { path: "/preview", element: _jsx(PrivateRoute, { children: _jsx(Standalone, { children: _jsx(PreviewPage, {}) }) }) })] })] }));
}
