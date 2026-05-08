import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import '../Home.css';
import '../Produtos.css';
/* ── Banner fixo ── */
function PreviewBanner({ page }) {
    const PAGE_LABEL = {
        home: 'Home',
        produtos: 'Produtos',
    };
    return (_jsxs("div", { className: "preview-banner", children: [_jsxs("span", { children: ["\uD83D\uDC41 MODO PREVIEW \u2014 ", _jsx("strong", { children: PAGE_LABEL[page] ?? page }), " \u2014 Altera\u00E7\u00F5es ainda N\u00C3O publicadas"] }), _jsx("button", { onClick: () => window.close(), children: "\u2190 Voltar ao Admin" }), _jsx("button", { style: { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)' }, onClick: () => window.location.href = page === 'home' ? '/' : `/${page}`, children: "Ver Vers\u00E3o Publicada \u2192" })] }));
}
/* ── Preview: Home ── */
function PreviewHome() {
    const { content } = useContent();
    const { carouselImages = [], companyDescription = '', carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features, } = content.draft.home;
    const safeStats = stats ?? [];
    const safeFeatures = features ?? [];
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(Carousel, { images: carouselImages, tagline: carouselTagline ?? '', title: carouselTitle ?? '', subtitle: carouselSubtitle ?? '' }), _jsx("section", { className: "section home__sobre", style: { background: '#fff' }, children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("h2", { className: "section-title", children: sobreTitle ?? 'Sobre a AeroTech Brasil' }), _jsx("div", { className: "section-divider" }), _jsxs("div", { className: "home__sobre-grid", children: [_jsx("div", { className: "home__sobre-text", children: _jsx("p", { className: "home__description", children: companyDescription }) }), _jsx("div", { className: "home__stats", children: safeStats.map((s, i) => (_jsxs("div", { className: "home__stat-card", children: [_jsx("span", { className: "home__stat-value", children: s.value }), _jsx("span", { className: "home__stat-label", children: s.label })] }, i))) })] })] }) }), safeFeatures.length > 0 && (_jsx("section", { className: "home__features", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", style: { color: 'var(--gold-light)' }, children: "Por que nos escolher" }), _jsx("h2", { className: "section-title", style: { color: 'var(--white)' }, children: featuresTitle ?? 'Diferenciais que fazem a diferença' }), _jsx("div", { className: "section-divider", style: { background: 'var(--gold)' } }), _jsx("div", { className: "home__features-grid", children: safeFeatures.map((f, i) => (_jsxs("div", { className: "home__feature-card", children: [_jsx("div", { className: "home__feature-icon", children: f.icon }), _jsx("h3", { className: "home__feature-title", children: f.title }), _jsx("p", { className: "home__feature-desc", children: f.desc })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
/* ── Preview: Produtos — layout idêntico à página publicada ── */
function PreviewProdutos() {
    const { content } = useContent();
    const { headline, subheadline, products } = content.draft.products;
    const categories = content.categories;
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(ProdutosLayout, { headline: headline, subheadline: subheadline, products: products, categories: categories }), _jsx(Footer, {})] }));
}
/* ── Mapa de páginas ── */
const PAGE_MAP = {
    home: _jsx(PreviewHome, {}),
    produtos: _jsx(PreviewProdutos, {}),
};
/* ── Componente principal ── */
export default function PreviewPage() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 'home';
    return (_jsxs("div", { children: [_jsx(PreviewBanner, { page: page }), PAGE_MAP[page] ?? _jsx(PreviewHome, {})] }));
}
