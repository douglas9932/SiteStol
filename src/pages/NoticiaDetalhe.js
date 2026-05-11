import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getNews } from '@/lib/contentService';
import './NoticiaDetalhe.css';
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    }
    catch {
        return dateStr;
    }
}
export default function NoticiaDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);
    useEffect(() => {
        getNews().then(all => {
            const found = all.find(n => n.id === id && n.active);
            setNews(found ?? null);
            setLoading(false);
        });
    }, [id]);
    if (loading)
        return (_jsxs("div", { className: "page-wrapper", children: [_jsx("div", { style: { textAlign: 'center', padding: '6rem', color: 'var(--gray-400)' }, children: "Carregando..." }), _jsx(Footer, {})] }));
    if (!news)
        return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { style: { textAlign: 'center', padding: '6rem', color: 'var(--gray-400)' }, children: [_jsx("p", { style: { fontSize: 48 }, children: "\uD83D\uDCF0" }), _jsx("p", { children: "Not\u00EDcia n\u00E3o encontrada." }), _jsx("button", { className: "btn btn-primary", style: { marginTop: 16 }, onClick: () => navigate('/noticias'), children: "\u2190 Voltar para Not\u00EDcias" })] }), _jsx(Footer, {})] }));
    const extras = Array.isArray(news.extra_images) ? news.extra_images : [];
    return (_jsxs("div", { className: "page-wrapper", children: [news.image_url ? (_jsxs("div", { className: "noticia-detalhe__hero", children: [_jsx("img", { src: news.image_url, alt: news.title, className: "noticia-detalhe__hero-img" }), _jsx("div", { className: "noticia-detalhe__hero-overlay" }), _jsxs("div", { className: "noticia-detalhe__hero-content", children: [_jsxs("div", { className: "noticia-detalhe__meta", children: [news.category && _jsx("span", { className: "noticia-detalhe__cat", children: news.category }), _jsx("span", { className: "noticia-detalhe__date", children: formatDate(news.published_at) })] }), _jsx("h1", { className: "noticia-detalhe__title", children: news.title }), news.author && _jsxs("p", { className: "noticia-detalhe__author", children: ["Por ", news.author] })] })] })) : (_jsxs("div", { className: "page-hero", children: [_jsxs("div", { className: "noticia-detalhe__meta", style: { justifyContent: 'center', marginBottom: 12 }, children: [news.category && _jsx("span", { className: "noticia-detalhe__cat", children: news.category }), _jsx("span", { className: "noticia-detalhe__date", children: formatDate(news.published_at) })] }), _jsx("h1", { className: "page-hero__title", children: news.title }), news.author && _jsxs("p", { style: { color: 'rgba(255,255,255,0.6)', marginTop: 8 }, children: ["Por ", news.author] })] })), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "noticia-detalhe__body", children: [_jsx("nav", { className: "noticia-detalhe__breadcrumb", children: _jsx("button", { onClick: () => navigate('/noticias'), children: "\u2190 Voltar para Not\u00EDcias" }) }), news.summary && (_jsx("p", { className: "noticia-detalhe__summary", children: news.summary })), news.summary && news.content && (_jsx("div", { className: "noticia-detalhe__divider" })), news.content && (_jsx("div", { className: "noticia-detalhe__content", children: news.content })), extras.length > 0 && (_jsxs("div", { className: "noticia-detalhe__gallery-section", children: [_jsx("h3", { className: "noticia-detalhe__gallery-title", children: "\uD83D\uDCF7 Galeria de Fotos" }), _jsx("div", { className: "noticia-detalhe__gallery", children: extras.map((url, i) => (_jsxs("div", { className: "noticia-detalhe__gallery-item", onClick: () => setLightbox(url), children: [_jsx("img", { src: url, alt: `Foto ${i + 1}` }), _jsx("div", { className: "noticia-detalhe__gallery-overlay", children: "\uD83D\uDD0D" })] }, i))) })] })), _jsxs("div", { className: "noticia-detalhe__footer-bar", children: [_jsxs("span", { className: "noticia-detalhe__footer-date", children: ["\uD83D\uDCC5 Publicado em ", formatDate(news.published_at), news.author && ` · Por ${news.author}`] }), _jsx("button", { className: "btn btn-outline", onClick: () => navigate('/noticias'), children: "\u2190 Voltar para Not\u00EDcias" })] })] }) }) }), lightbox && (_jsxs("div", { className: "noticia-lightbox", onClick: () => setLightbox(null), children: [_jsx("img", { src: lightbox, alt: "Ampliado", className: "noticia-lightbox__img", onClick: e => e.stopPropagation() }), _jsx("button", { className: "noticia-lightbox__close", onClick: () => setLightbox(null), children: "\u2715" })] })), _jsx(Footer, {})] }));
}
