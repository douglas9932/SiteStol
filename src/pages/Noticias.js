import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getNews } from '@/lib/contentService';
import './Noticias.css';
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    catch {
        return dateStr;
    }
}
export default function Noticias() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        getNews()
            .then(data => setNews(data.filter(n => n.active)))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Novidades" }), _jsx("h1", { className: "page-hero__title", children: "Not\u00EDcias & Atualiza\u00E7\u00F5es" }), _jsx("p", { className: "page-hero__subtitle", children: "Fique por dentro das \u00FAltimas novidades." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: loading ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: "Carregando..." })) : news.length === 0 ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: _jsx("p", { children: "Nenhuma not\u00EDcia publicada no momento." }) })) : (_jsx("div", { className: "noticias__grid", children: news.map((n) => (_jsxs("article", { className: "noticia-card", onClick: () => navigate(`/noticias/${n.id}`), children: [n.image_url && (_jsx("div", { className: "noticia-card__img-wrap", children: _jsx("img", { src: n.image_url, alt: n.title, className: "noticia-card__img" }) })), _jsxs("div", { className: "noticia-card__body", children: [_jsxs("div", { className: "noticia-card__meta", children: [n.category && _jsx("span", { className: "noticia-card__cat", children: n.category }), _jsx("p", { className: "noticia-card__date", children: formatDate(n.published_at) })] }), _jsx("h2", { className: "noticia-card__title", children: n.title }), n.summary && _jsx("p", { className: "noticia-card__excerpt", children: n.summary }), _jsx("span", { className: "noticia-card__read", children: "Leia mais \u2192" })] })] }, n.id))) })) }) }), _jsx(Footer, {})] }));
}
