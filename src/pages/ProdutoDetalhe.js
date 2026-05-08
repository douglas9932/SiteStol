import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import Footer from '@/components/Footer';
import './ProdutoDetalhe.css';
/* ── Accordion ── */
function AccordionSection({ label, items }) {
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { className: "detalhe-accordion", children: [_jsxs("button", { className: "detalhe-accordion__trigger", onClick: () => setOpen(!open), children: [_jsx("span", { children: label }), _jsx("span", { className: `detalhe-accordion__chevron ${open ? 'detalhe-accordion__chevron--open' : ''}`, children: "\u203A" })] }), open && (_jsx("div", { className: "detalhe-accordion__body", children: items.map((item, i) => (_jsxs("div", { className: "detalhe-accordion__item", children: [item.label && _jsx("strong", { className: "detalhe-accordion__label", children: item.label }), _jsx("p", { className: "detalhe-accordion__content", children: item.content })] }, i))) })), _jsx("div", { className: "detalhe-accordion__line" })] }));
}
export default function ProdutoDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { content } = useContent();
    const product = (content.published.products?.products ?? []).find((p) => String(p.id) === id);
    const allImages = product
        ? [...(product.image ? [product.image] : []), ...(product.images ?? [])]
        : [];
    const [activeIdx, setActiveIdx] = useState(0);
    const [lightbox, setLightbox] = useState(null);
    if (!product) {
        return (_jsxs("div", { className: "page-wrapper detalhe-not-found", children: [_jsx("p", { children: "\uD83D\uDCE6" }), _jsx("p", { children: "Produto n\u00E3o encontrado." }), _jsx("button", { className: "btn btn-primary", onClick: () => navigate('/produtos'), children: "\u2190 Voltar aos Produtos" })] }));
    }
    const prev = () => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
    const next = () => setActiveIdx((i) => (i + 1) % allImages.length);
    const accordions = [
        { label: 'Especificações:', items: product.specifications ?? [] },
        { label: 'Informações:', items: product.info ?? [] },
    ].filter((s) => s.items.length > 0);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsx("div", { className: "detalhe__breadcrumb-bar", children: _jsxs("div", { className: "container detalhe__breadcrumb-inner", children: [_jsx("span", { className: "detalhe__breadcrumb-link", onClick: () => navigate('/produtos'), children: "Produtos" }), _jsx("span", { className: "detalhe__breadcrumb-sep", children: "\u203A" }), _jsx("span", { className: "detalhe__breadcrumb-cur", children: product.title })] }) }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "detalhe__grid", children: [_jsxs("div", { className: "detalhe__gallery", children: [_jsxs("div", { className: "detalhe__main-img", onClick: () => allImages.length > 0 && setLightbox(allImages[activeIdx]), style: { cursor: allImages.length > 0 ? 'zoom-in' : 'default' }, children: [allImages.length > 1 && (_jsx("button", { className: "detalhe__arrow detalhe__arrow--prev", onClick: prev, children: "\u2039" })), allImages.length > 0
                                                ? _jsx("img", { src: allImages[activeIdx], alt: product.title })
                                                : _jsx("div", { className: "detalhe__placeholder", children: product.icon || '📦' }), allImages.length > 1 && (_jsx("button", { className: "detalhe__arrow detalhe__arrow--next", onClick: next, children: "\u203A" }))] }), allImages.length > 1 && (_jsx("div", { className: "detalhe__thumbs", children: allImages.map((img, i) => (_jsx("button", { className: `detalhe__thumb ${i === activeIdx ? 'detalhe__thumb--active' : ''}`, onClick: () => setActiveIdx(i), children: _jsx("img", { src: img, alt: `${product.title} ${i + 1}` }) }, i))) }))] }), _jsxs("div", { className: "detalhe__info", children: [product.tag && _jsx("span", { className: "detalhe__tag", children: product.tag }), _jsx("h1", { className: "detalhe__title", children: product.title }), _jsx("div", { className: "detalhe__divider" }), _jsx("p", { className: "detalhe__desc", children: product.description }), accordions.map((s) => (_jsx(AccordionSection, { label: s.label, items: s.items }, s.label)))] })] }) }) }), (product.demoImages ?? []).length > 0 && (_jsx("section", { className: "section detalhe__demo-section", children: _jsxs("div", { className: "container", children: [_jsx("h2", { className: "detalhe__demo-title", children: "Demonstrativo:" }), _jsxs("div", { className: "detalhe__demo-track-wrap", children: [_jsx("button", { className: "detalhe__demo-arrow detalhe__demo-arrow--prev", onClick: () => {
                                        const el = document.getElementById('demo-track');
                                        if (el)
                                            el.scrollBy({ left: -320, behavior: 'smooth' });
                                    }, children: "\u2039" }), _jsx("div", { className: "detalhe__demo-track", id: "demo-track", children: (product.demoImages ?? []).map((d, i) => (_jsxs("div", { className: "detalhe__demo-item", children: [_jsx("div", { className: "detalhe__demo-img", onClick: () => setLightbox(d.url), style: { cursor: 'zoom-in' }, children: _jsx("img", { src: d.url, alt: d.caption || `Demonstrativo ${i + 1}` }) }), d.caption && _jsx("p", { className: "detalhe__demo-caption", children: d.caption })] }, i))) }), _jsx("button", { className: "detalhe__demo-arrow detalhe__demo-arrow--next", onClick: () => {
                                        const el = document.getElementById('demo-track');
                                        if (el)
                                            el.scrollBy({ left: 320, behavior: 'smooth' });
                                    }, children: "\u203A" })] })] }) })), lightbox && (_jsxs("div", { className: "detalhe__lightbox", onClick: () => setLightbox(null), children: [_jsx("button", { className: "detalhe__lightbox-close", onClick: () => setLightbox(null), children: "\u2715" }), _jsx("img", { src: lightbox, alt: "Imagem ampliada", onClick: (e) => e.stopPropagation() })] })), _jsx(Footer, {})] }));
}
