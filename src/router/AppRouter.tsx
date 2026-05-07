import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar      from '@/components/Navbar';
import Home        from '@/pages/Home';
import Sobre       from '@/pages/Sobre';
import Produtos    from '@/pages/Produtos';
import Noticias    from '@/pages/Noticias';
import TabelaCalibracao from '@/pages/TabelaCalibracao';
import TestesStol  from '@/pages/TestesStol';
import Contatos    from '@/pages/Contatos';
import AdminHome   from '@/pages/admin/AdminHome';
import PreviewPage from '@/pages/admin/PreviewPage';

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

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Public pages (with Navbar) ── */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/sobre"      element={<Layout><Sobre /></Layout>} />
        <Route path="/produtos"   element={<Layout><Produtos /></Layout>} />
        <Route path="/noticias"   element={<Layout><Noticias /></Layout>} />
        <Route path="/calibracao" element={<Layout><TabelaCalibracao /></Layout>} />
        <Route path="/stol"       element={<Layout><TestesStol /></Layout>} />
        <Route path="/contatos"   element={<Layout><Contatos /></Layout>} />

        {/* ── Admin (without Navbar) ── */}
        <Route path="/admin"   element={<AdminLayout><AdminHome /></AdminLayout>} />
        <Route path="/preview" element={<AdminLayout><PreviewPage /></AdminLayout>} />
      </Routes>
    </>
  );
}
