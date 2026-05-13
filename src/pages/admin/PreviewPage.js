import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import { getCalibrationTables, applyCompanyColors } from '@/lib/contentService';
import '../Home.css';
import '../Produtos.css';
import '../Sobre.css';
import '../Noticias.css';
import '../NoticiaDetalhe.css';
import '../TabelaCalibracao.css';
import '../Contatos.css';
/* ── Banner fixo ── */
function PreviewBanner({ page }) {
    const PAGE_LABEL = {
        home: 'Home',
        sobre: 'Sobre',
        produtos: 'Produtos',
        noticias: 'Notícias',
        calibracao: 'Calibração',
        contatos: 'Contatos',
        empresa: 'Empresa',
    };
    return (_jsxs("div", { className: "preview-banner", children: [_jsxs("span", { children: ["\uD83D\uDC41 MODO PREVIEW \u2014 ", _jsx("strong", { children: PAGE_LABEL[page] ?? page }), " \u2014 Altera\u00E7\u00F5es ainda N\u00C3O publicadas"] }), _jsx("button", { onClick: () => window.close(), children: "\u2190 Voltar ao Admin" }), _jsx("button", { style: { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)' }, onClick: () => window.location.href = page === 'home' ? '/' : `/${page === 'calibracao' ? 'calibracao' : page}`, children: "Ver Vers\u00E3o Publicada \u2192" })] }));
}
/* ── Preview: Home ── */
function PreviewHome() {
    const draft = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('home_preview_draft') ?? '{}');
        }
        catch {
            return {};
        }
    })();
    const carouselImages = draft.carouselImages ?? [];
    const companyDescription = draft.companyDescription ?? '';
    const carouselTagline = draft.carouselTagline ?? '';
    const carouselTitle = draft.carouselTitle ?? '';
    const carouselSubtitle = draft.carouselSubtitle ?? '';
    const sobreTitle = draft.sobreTitle ?? '';
    const safeStats = draft.stats ?? [];
    const featuresTitle = draft.featuresTitle ?? '';
    const safeFeatures = draft.features ?? [];
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(Carousel, { images: carouselImages, tagline: carouselTagline ?? '', title: carouselTitle ?? '', subtitle: carouselSubtitle ?? '' }), _jsx("section", { className: "section home__sobre", style: { background: '#fff' }, children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("h2", { className: "section-title", children: sobreTitle ?? 'Sobre a Empresa' }), _jsx("div", { className: "section-divider" }), _jsxs("div", { className: "home__sobre-grid", children: [_jsx("div", { className: "home__sobre-text", children: _jsx("p", { className: "home__description", children: companyDescription }) }), _jsx("div", { className: "home__stats", children: safeStats.map((s, i) => (_jsxs("div", { className: "home__stat-card", children: [_jsx("span", { className: "home__stat-value", children: s.value }), _jsx("span", { className: "home__stat-label", children: s.label })] }, i))) })] })] }) }), safeFeatures.length > 0 && (_jsx("section", { className: "home__features", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", style: { color: 'var(--gold-light)' }, children: "Por que nos escolher" }), _jsx("h2", { className: "section-title", style: { color: 'var(--white)' }, children: featuresTitle ?? 'Diferenciais' }), _jsx("div", { className: "section-divider", style: { background: 'var(--gold)' } }), _jsx("div", { className: "home__features-grid", children: safeFeatures.map((f, i) => (_jsxs("div", { className: "home__feature-card", children: [_jsx("div", { className: "home__feature-icon", children: f.icon }), _jsx("h3", { className: "home__feature-title", children: f.title }), _jsx("p", { className: "home__feature-desc", children: f.desc })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
/* ── Preview: Sobre ── */
function PreviewSobre() {
    const homeDraft = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('home_preview_draft') ?? '{}');
        }
        catch {
            return {};
        }
    })();
    const sobreDraft = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('sobre_preview_draft') ?? '{}');
        }
        catch {
            return {};
        }
    })();
    const companyDescription = homeDraft.companyDescription ?? '';
    const heroTitle = sobreDraft.heroTitle ?? '';
    const heroSubtitle = sobreDraft.heroSubtitle ?? '';
    const especialidades = sobreDraft.especialidades ?? [];
    const timelineTitle = sobreDraft.timelineTitle ?? '';
    const timeline = sobreDraft.timeline ?? [];
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Nossa Hist\u00F3ria" }), _jsx("h1", { className: "page-hero__title", children: heroTitle }), heroSubtitle && _jsx("p", { className: "page-hero__subtitle", children: heroSubtitle })] }), _jsx("section", { className: "section", children: _jsxs("div", { className: "container sobre__grid", children: [_jsxs("div", { className: "sobre__text", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("div", { className: "section-divider" }), _jsx("p", { className: "sobre__desc", children: companyDescription })] }), especialidades.length > 0 && (_jsxs("div", { className: "sobre__especialidades", children: [_jsx("h3", { className: "sobre__esp-title", children: "Especialidades" }), _jsx("ul", { className: "sobre__esp-list", children: especialidades.map((e, i) => (_jsxs("li", { className: "sobre__esp-item", children: [_jsx("span", { className: "sobre__esp-dot" }), e] }, i))) })] }))] }) }), timeline.length > 0 && (_jsx("section", { className: "section sobre__timeline-section", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Jornada" }), _jsx("h2", { className: "section-title", children: timelineTitle }), _jsx("div", { className: "section-divider" }), _jsx("div", { className: "sobre__timeline", children: timeline.map((t, i) => (_jsxs("div", { className: `sobre__timeline-item ${i % 2 === 0 ? 'sobre__timeline-item--left' : 'sobre__timeline-item--right'}`, children: [_jsx("div", { className: "sobre__timeline-dot" }), _jsxs("div", { className: "sobre__timeline-card", children: [_jsx("span", { className: "sobre__timeline-year", children: t.year }), _jsx("h3", { className: "sobre__timeline-title", children: t.title }), _jsx("p", { className: "sobre__timeline-desc", children: t.desc })] })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
/* ── Preview: Produtos ── */
function PreviewProdutos() {
    const { content } = useContent();
    const draft = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('produtos_preview_draft') ?? '{}');
        }
        catch {
            return {};
        }
    })();
    const headline = draft.headline ?? '';
    const subheadline = draft.subheadline ?? '';
    const products = Array.isArray(draft.products) ? draft.products : [];
    const categories = content.categories ?? [];
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx(ProdutosLayout, { headline: headline, subheadline: subheadline, products: products, categories: categories, disableNavigation: true }), _jsx(Footer, {})] }));
}
/* ── Preview: Notícias ── */
function PreviewNoticias() {
    const [news, setNews] = useState([]);
    const [selected, setSelected] = useState(null);
    const [lightbox, setLightbox] = useState(null);
    useEffect(() => {
        try {
            const draft = JSON.parse(sessionStorage.getItem('news_preview_draft') ?? '[]');
            const active = draft.filter((n) => n.active);
            setNews(active);
            if (active.length > 0)
                setSelected(active[0]);
        }
        catch {
            setNews([]);
        }
    }, []);
    function formatDate(d) {
        try {
            return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        }
        catch {
            return d;
        }
    }
    if (news.length === 0)
        return (_jsxs("div", { style: { textAlign: 'center', padding: '6rem', color: 'var(--gray-400)' }, children: [_jsx("p", { style: { fontSize: 48 }, children: "\uD83D\uDCF0" }), _jsx("p", { children: "Nenhuma not\u00EDcia ativa no rascunho." })] }));
    const n = selected ?? news[0];
    const extras = Array.isArray(n?.extra_images) ? n.extra_images : [];
    return (_jsxs(_Fragment, { children: [news.length > 1 && (_jsxs("div", { style: {
                    background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 1.5rem', display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center',
                    position: 'sticky', top: 0, zIndex: 10,
                }, children: [_jsx("span", { style: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, whiteSpace: 'nowrap' }, children: "Ver not\u00EDcia:" }), news.map(item => (_jsx("button", { onClick: () => setSelected(item), style: {
                            background: (selected?.id ?? news[0].id) === item.id ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
                            color: (selected?.id ?? news[0].id) === item.id ? 'var(--navy)' : 'rgba(255,255,255,0.7)',
                            border: 'none', borderRadius: 20, padding: '4px 14px',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                        }, children: item.title.length > 35 ? item.title.slice(0, 35) + '…' : item.title }, item.id)))] })), n.image_url ? (_jsxs("div", { className: "noticia-detalhe__hero", children: [_jsx("img", { src: n.image_url, alt: n.title, className: "noticia-detalhe__hero-img" }), _jsx("div", { className: "noticia-detalhe__hero-overlay" }), _jsxs("div", { className: "noticia-detalhe__hero-content", children: [_jsxs("div", { className: "noticia-detalhe__meta", children: [n.category && _jsx("span", { className: "noticia-detalhe__cat", children: n.category }), _jsx("span", { className: "noticia-detalhe__date", children: formatDate(n.published_at) })] }), _jsx("h1", { className: "noticia-detalhe__title", children: n.title }), n.author && _jsxs("p", { className: "noticia-detalhe__author", children: ["Por ", n.author] })] })] })) : (_jsxs("div", { className: "page-hero", children: [_jsxs("div", { className: "noticia-detalhe__meta", style: { justifyContent: 'center', marginBottom: 12 }, children: [n.category && _jsx("span", { className: "noticia-detalhe__cat", children: n.category }), _jsx("span", { className: "noticia-detalhe__date", children: formatDate(n.published_at) })] }), _jsx("h1", { className: "page-hero__title", children: n.title }), n.author && _jsxs("p", { style: { color: 'rgba(255,255,255,0.6)', marginTop: 8 }, children: ["Por ", n.author] })] })), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "noticia-detalhe__body", children: [_jsx("nav", { className: "noticia-detalhe__breadcrumb", children: _jsx("span", { style: { color: 'var(--gold)', fontSize: 13, fontWeight: 700 }, children: "\u2190 Not\u00EDcias" }) }), n.summary && _jsx("p", { className: "noticia-detalhe__summary", children: n.summary }), n.summary && n.content && _jsx("div", { className: "noticia-detalhe__divider" }), n.content && _jsx("div", { className: "noticia-detalhe__content", children: n.content }), extras.length > 0 && (_jsxs("div", { className: "noticia-detalhe__gallery-section", children: [_jsx("h3", { className: "noticia-detalhe__gallery-title", children: "\uD83D\uDCF7 Galeria de Fotos" }), _jsx("div", { className: "noticia-detalhe__gallery", children: extras.map((url, i) => (_jsxs("div", { className: "noticia-detalhe__gallery-item", onClick: () => setLightbox(url), children: [_jsx("img", { src: url, alt: `Foto ${i + 1}` }), _jsx("div", { className: "noticia-detalhe__gallery-overlay", children: "\uD83D\uDD0D" })] }, i))) })] })), _jsx("div", { className: "noticia-detalhe__footer-bar", children: _jsxs("span", { className: "noticia-detalhe__footer-date", children: ["\uD83D\uDCC5 Publicado em ", formatDate(n.published_at), n.author && ` · Por ${n.author}`] }) })] }) }) }), _jsx(Footer, {}), lightbox && (_jsxs("div", { className: "noticia-lightbox", onClick: () => setLightbox(null), children: [_jsx("img", { src: lightbox, alt: "Ampliado", className: "noticia-lightbox__img", onClick: e => e.stopPropagation() }), _jsx("button", { className: "noticia-lightbox__close", onClick: () => setLightbox(null), children: "\u2715" })] }))] }));
}
/* ── Preview: Calibração ── */
function PreviewCalibracao() {
    const [tables, setTables] = useState([]);
    useEffect(() => {
        try {
            const draft = JSON.parse(sessionStorage.getItem('calib_preview_draft') ?? '[]');
            setTables(draft.filter((t) => t.active));
        }
        catch {
            getCalibrationTables().then(data => setTables(data.filter((t) => t.active)));
        }
    }, []);
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "T\u00E9cnico" }), _jsx("h1", { className: "page-hero__title", children: "Tabela de Calibra\u00E7\u00E3o" }), _jsx("p", { className: "page-hero__subtitle", children: "Refer\u00EAncias t\u00E9cnicas para calibra\u00E7\u00E3o de instrumentos aeron\u00E1uticos." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: tables.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: [_jsx("p", { style: { fontSize: 40 }, children: "\uD83D\uDCCA" }), _jsx("p", { children: "Nenhuma tabela de calibra\u00E7\u00E3o ativa." })] })) : (_jsx("div", { className: "calib__list", children: tables.map((t) => (_jsxs("div", { className: "calib__block", children: [_jsxs("div", { className: "calib__block-header", children: [_jsx("h2", { className: "calib__block-title", children: t.title }), t.description && _jsx("p", { className: "calib__block-desc", children: t.description })] }), t.columns.length > 0 && (_jsx("div", { className: "calib__table-wrap", children: _jsxs("table", { className: "calib__table", children: [_jsx("thead", { children: _jsxs("tr", { children: [(t.row_headers ?? []).some((h) => h) && (_jsx("th", { className: "calib__table-row-header-col" })), t.columns.map((col, ci) => _jsx("th", { children: col }, ci))] }) }), _jsx("tbody", { children: t.rows.map((row, ri) => (_jsxs("tr", { children: [(t.row_headers ?? []).some((h) => h) && (_jsx("td", { className: "calib__table-row-header", children: (t.row_headers ?? [])[ri] ?? '' })), t.columns.map((_, ci) => _jsx("td", { children: row[ci] ?? '' }, ci))] }, ri))) })] }) }))] }, t.id))) })) }) }), _jsx(Footer, {})] }));
}
/* ── Preview: Contatos ── */
function PreviewContatos() {
    const [contacts, setContacts] = useState([]);
    useEffect(() => {
        try {
            const draft = JSON.parse(sessionStorage.getItem('contacts_preview_draft') ?? '[]');
            setContacts(draft.filter((c) => c.active));
        }
        catch {
            setContacts([]);
        }
    }, []);
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Fale Conosco" }), _jsx("h1", { className: "page-hero__title", children: "Contatos" }), _jsx("p", { className: "page-hero__subtitle", children: "Nossa equipe est\u00E1 pronta para atend\u00EA-lo da melhor forma." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: contacts.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: _jsx("p", { children: "Nenhum contato ativo no rascunho." }) })) : (_jsx("div", { className: "contatos__grid", children: contacts.map((c) => {
                            const initials = c.name.split(' ').slice(0, 2).map(w => w[0]).join('');
                            return (_jsxs("div", { className: "contato-card", children: [_jsxs("div", { className: "contato-card__header", children: [_jsx("div", { className: "contato-card__avatar", children: initials }), _jsxs("div", { children: [_jsx("h2", { className: "contato-card__name", children: c.name }), c.role && _jsx("p", { className: "contato-card__role", children: c.role })] })] }), _jsxs("ul", { className: "contato-card__list", children: [c.email && _jsxs("li", { children: [_jsx("span", { children: "\u2709" }), _jsx("span", { children: c.email })] }), c.phone && _jsxs("li", { children: [_jsx("span", { children: "\u260E" }), _jsx("span", { children: c.phone })] }), c.mobile && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCF1" }), _jsx("span", { children: c.mobile })] }), c.address && _jsxs("li", { children: [_jsx("span", { children: "\uD83D\uDCCD" }), _jsx("span", { children: c.address })] })] })] }, c.id));
                        }) })) }) }), _jsx(Footer, {})] }));
}
/* ── Preview: Empresa ── */
function PreviewEmpresa() {
    const { content } = useContent();
    // Lê do sessionStorage sincronamente para evitar render vazio
    const [draft] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('empresa_preview_draft') ?? '{}');
        }
        catch {
            return {};
        }
    });
    useEffect(() => {
        if (draft.color_primary || draft.color_secondary)
            applyCompanyColors(draft);
        if (draft.name)
            document.title = `[Preview] ${draft.name}`;
    }, [draft]);
    const { carouselImages = [], companyDescription = '', carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features, } = content.published.home ?? {};
    const safeStats = stats ?? [];
    const safeFeatures = features ?? [];
    const name = draft?.name || '';
    const iconUrl = draft?.icon_url || '';
    const desc = draft?.description || '';
    const cnpj = draft?.cnpj || '';
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    const firstWord = name.split(' ')[0];
    const rest = name.split(' ').slice(1).join(' ');
    return (_jsxs("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: [_jsx("nav", { className: "navbar", style: { position: 'relative' }, children: _jsxs("div", { className: "navbar__inner", children: [_jsxs("a", { href: "/", className: "navbar__logo", children: [iconUrl
                                    ? _jsx("img", { src: iconUrl, alt: name, className: "navbar__logo-img" })
                                    : _jsx("div", { className: "navbar__logo-icon", children: initials.slice(0, 2) || 'AT' }), _jsxs("div", { className: "navbar__logo-text", children: [_jsx("span", { className: "navbar__logo-name", children: firstWord || 'Empresa' }), rest && _jsx("span", { className: "navbar__logo-sub", children: rest })] })] }), _jsx("div", { className: "navbar__links", children: ['Sobre', 'Produtos', 'Notícias', 'Calibração', 'Contatos'].map(l => (_jsx("span", { className: "navbar__link", style: { cursor: 'default' }, children: l }, l))) })] }) }), _jsx(Carousel, { images: carouselImages, tagline: carouselTagline ?? '', title: carouselTitle ?? '', subtitle: carouselSubtitle ?? '' }), _jsx("section", { className: "section home__sobre", style: { background: '#fff' }, children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("h2", { className: "section-title", children: sobreTitle ?? '' }), _jsx("div", { className: "section-divider" }), _jsxs("div", { className: "home__sobre-grid", children: [_jsx("div", { className: "home__sobre-text", children: _jsx("p", { className: "home__description", children: companyDescription }) }), _jsx("div", { className: "home__stats", children: safeStats.map((s, i) => (_jsxs("div", { className: "home__stat-card", children: [_jsx("span", { className: "home__stat-value", children: s.value }), _jsx("span", { className: "home__stat-label", children: s.label })] }, i))) })] })] }) }), safeFeatures.length > 0 && (_jsx("section", { className: "home__features", children: _jsx("div", { className: "container", children: _jsx("div", { className: "home__features-grid", children: safeFeatures.map((f, i) => (_jsxs("div", { className: "home__feature-card", children: [_jsx("div", { className: "home__feature-icon", children: f.icon }), _jsx("h3", { className: "home__feature-title", children: f.title }), _jsx("p", { className: "home__feature-desc", children: f.desc })] }, i))) }) }) })), _jsx("footer", { className: "footer", children: _jsxs("div", { className: "footer__inner container", children: [_jsx("div", { className: "footer__top", children: _jsxs("div", { className: "footer__brand", children: [_jsxs("div", { className: "footer__brand-logo", children: [iconUrl
                                                ? _jsx("img", { src: iconUrl, alt: name, className: "footer__brand-icon-img" })
                                                : _jsx("div", { className: "footer__brand-icon", children: initials.slice(0, 2) || 'AT' }), _jsx("span", { className: "footer__brand-name", children: name || 'Empresa' })] }), desc && _jsx("p", { className: "footer__brand-desc", children: desc })] }) }), _jsxs("div", { className: "footer__bottom", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " ", name || 'Empresa', ". Todos os direitos reservados."] }), cnpj && _jsx("p", { children: cnpj })] })] }) })] }));
}
const PAGE_MAP = {
    home: _jsx(PreviewHome, {}),
    sobre: _jsx(PreviewSobre, {}),
    produtos: _jsx(PreviewProdutos, {}),
    noticias: _jsx(PreviewNoticias, {}),
    calibracao: _jsx(PreviewCalibracao, {}),
    contatos: _jsx(PreviewContatos, {}),
    empresa: _jsx(PreviewEmpresa, {}),
};
/* ── Componente principal ── */
export default function PreviewPage() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 'home';
    return (_jsxs("div", { children: [_jsx(PreviewBanner, { page: page }), page === 'noticias'
                ? _jsx("div", { className: "page-wrapper", style: { paddingTop: 0 }, children: _jsx(PreviewNoticias, {}) })
                : (PAGE_MAP[page] ?? _jsx(PreviewHome, {}))] }));
}
