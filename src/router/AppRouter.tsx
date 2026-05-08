import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar      from '@/components/Navbar';
import Home        from '@/pages/Home';
import Sobre       from '@/pages/Sobre';
import Produtos    from '@/pages/Produtos';
import ProdutoDetalhe from '@/pages/ProdutoDetalhe';
import Noticias    from '@/pages/Noticias';
import TabelaCalibracao from '@/pages/TabelaCalibracao';
import TestesStol  from '@/pages/TestesStol';
import Contatos    from '@/pages/Contatos';
import Login       from '@/pages/Login';
import AdminHome   from '@/pages/admin/AdminHome';
import PreviewPage from '@/pages/admin/PreviewPage';
import PrivateRoute from '@/components/PrivateRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Standalone({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Public pages (with Navbar) ── */}
        <Route path="/"           element={<Layout><Home /></Layout>} />
        <Route path="/sobre"      element={<Layout><Sobre /></Layout>} />
        <Route path="/produtos"      element={<Layout><Produtos /></Layout>} />
        <Route path="/produtos/:id"  element={<Layout><ProdutoDetalhe /></Layout>} />
        <Route path="/noticias"   element={<Layout><Noticias /></Layout>} />
        <Route path="/calibracao" element={<Layout><TabelaCalibracao /></Layout>} />
        <Route path="/stol"       element={<Layout><TestesStol /></Layout>} />
        <Route path="/contatos"   element={<Layout><Contatos /></Layout>} />

        {/* ── Login — sem Navbar, acessível apenas por URL direta ── */}
        <Route path="/login" element={<Standalone><Login /></Standalone>} />

        {/* ── Admin — protegido, exige login ── */}
        <Route path="/admin"   element={<PrivateRoute><Standalone><AdminHome /></Standalone></PrivateRoute>} />
        <Route path="/preview" element={<PrivateRoute><Standalone><PreviewPage /></Standalone></PrivateRoute>} />
      </Routes>
    </>
  );
}