import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import ProdutosLayout from './ProdutosLayout';
import './Produtos.css';
export default function Produtos() {
    const { content } = useContent();
    const { headline = '', subheadline = '', products = [] } = content.published.products ?? {};
    const categories = content.categories ?? [];
    return (_jsxs("div", { className: "page-wrapper", children: [_jsx(ProdutosLayout, { headline: headline, subheadline: subheadline, products: products, categories: categories }), _jsx("section", { className: "produtos__diff", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", style: { color: 'var(--gold-light)' }, children: "Por que a AeroTech" }), _jsx("h2", { className: "section-title", style: { color: 'var(--white)' }, children: "Tecnologia e experi\u00EAncia juntas" }), _jsx("div", { className: "section-divider" }), _jsx("div", { className: "produtos__diff-grid", children: [
                                ['Frota Moderna', 'Aeronaves atualizadas com os últimos avanços tecnológicos do setor.'],
                                ['Equipe Certificada', 'Pilotos e técnicos com certificações nacionais e internacionais.'],
                                ['Suporte 24/7', 'Atendimento dedicado a qualquer hora para emergências operacionais.'],
                                ['Relatórios Online', 'Acesso a todos os relatórios técnicos diretamente pela plataforma.'],
                            ].map(([t, d]) => (_jsxs("div", { className: "produtos__diff-item", children: [_jsx("div", { className: "produtos__diff-dot" }), _jsxs("div", { children: [_jsx("h4", { children: t }), _jsx("p", { children: d })] })] }, t))) })] }) }), _jsx(Footer, {})] }));
}
