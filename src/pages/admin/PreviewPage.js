import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import '../Home.css';
import '../Produtos.css';
import '../Sobre.css';
/* ── Banner fixo ── */
function PreviewBanner({ page }) {
    const PAGE_LABEL = {
        home: 'Home',
        sobre: 'Sobre',
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
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(Carousel, { images: carouselImages, tagline: carouselTagline ?? '', title: carouselTitle ?? '', subtitle: carouselSubtitle ?? '' }), _jsx("section", { className: "section home__sobre", style: { background: '#fff' }, children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("h2", { className: "section-title", children: sobreTitle ?? 'Sobre a Empresa' }), _jsx("div", { className: "section-divider" }), _jsxs("div", { className: "home__sobre-grid", children: [_jsx("div", { className: "home__sobre-text", children: _jsx("p", { className: "home__description", children: companyDescription }) }), _jsx("div", { className: "home__stats", children: safeStats.map((s, i) => (_jsxs("div", { className: "home__stat-card", children: [_jsx("span", { className: "home__stat-value", children: s.value }), _jsx("span", { className: "home__stat-label", children: s.label })] }, i))) })] })] }) }), safeFeatures.length > 0 && (_jsx("section", { className: "home__features", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", style: { color: 'var(--gold-light)' }, children: "Por que nos escolher" }), _jsx("h2", { className: "section-title", style: { color: 'var(--white)' }, children: featuresTitle ?? 'Diferenciais' }), _jsx("div", { className: "section-divider", style: { background: 'var(--gold)' } }), _jsx("div", { className: "home__features-grid", children: safeFeatures.map((f, i) => (_jsxs("div", { className: "home__feature-card", children: [_jsx("div", { className: "home__feature-icon", children: f.icon }), _jsx("h3", { className: "home__feature-title", children: f.title }), _jsx("p", { className: "home__feature-desc", children: f.desc })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
/* ── Preview: Sobre ── */
function PreviewSobre() {
    const { content } = useContent();
    const { companyDescription = '' } = content.draft.home ?? {};
    const { heroTitle = '', heroSubtitle = '', especialidades = [], timelineTitle = '', timeline = [], } = content.draft.sobre ?? {};
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Nossa Hist\u00F3ria" }), _jsx("h1", { className: "page-hero__title", children: heroTitle }), heroSubtitle && _jsx("p", { className: "page-hero__subtitle", children: heroSubtitle })] }), _jsx("section", { className: "section", children: _jsxs("div", { className: "container sobre__grid", children: [_jsxs("div", { className: "sobre__text", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("div", { className: "section-divider" }), _jsx("p", { className: "sobre__desc", children: companyDescription })] }), especialidades.length > 0 && (_jsxs("div", { className: "sobre__especialidades", children: [_jsx("h3", { className: "sobre__esp-title", children: "Especialidades" }), _jsx("ul", { className: "sobre__esp-list", children: especialidades.map((e, i) => (_jsxs("li", { className: "sobre__esp-item", children: [_jsx("span", { className: "sobre__esp-dot" }), e] }, i))) })] }))] }) }), timeline.length > 0 && (_jsx("section", { className: "section sobre__timeline-section", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Jornada" }), _jsx("h2", { className: "section-title", children: timelineTitle }), _jsx("div", { className: "section-divider" }), _jsx("div", { className: "sobre__timeline", children: timeline.map((t, i) => (_jsxs("div", { className: `sobre__timeline-item ${i % 2 === 0 ? 'sobre__timeline-item--left' : 'sobre__timeline-item--right'}`, children: [_jsx("div", { className: "sobre__timeline-dot" }), _jsxs("div", { className: "sobre__timeline-card", children: [_jsx("span", { className: "sobre__timeline-year", children: t.year }), _jsx("h3", { className: "sobre__timeline-title", children: t.title }), _jsx("p", { className: "sobre__timeline-desc", children: t.desc })] })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
/* ── Preview: Produtos ── */
function PreviewProdutos() {
    const { content } = useContent();
    const { headline = '', subheadline = '', products = [] } = content.draft.products ?? {};
    const categories = content.categories ?? [];
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(ProdutosLayout, { headline: headline, subheadline: subheadline, products: products, categories: categories }), _jsx(Footer, {})] }));
}
/* ── Mapa de páginas ── */
const PAGE_MAP = {
    home: _jsx(PreviewHome, {}),
    sobre: _jsx(PreviewSobre, {}),
    produtos: _jsx(PreviewProdutos, {}),
};
/* ── Componente principal ── */
export default function PreviewPage() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 'home';
    return (_jsxs("div", { children: [_jsx(PreviewBanner, { page: page }), PAGE_MAP[page] ?? _jsx(PreviewHome, {})] }));
}
