import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import './Produtos.css';
export default function ProdutosLayout({ headline, subheadline, products, categories }) {
    const [search, setSearch] = useState('');
    const [selectedCatIds, setSelectedCatIds] = useState([]);
    const toggleCat = (id) => setSelectedCatIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    const clearFilters = () => { setSearch(''); setSelectedCatIds([]); };
    const filtered = products.filter((p) => {
        const matchName = p.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCatIds.length === 0
            || selectedCatIds.every((cid) => p.categoryIds?.includes(cid));
        return matchName && matchCat;
    });
    const hasFilter = search !== '' || selectedCatIds.length > 0;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Nossos Servi\u00E7os" }), _jsx("h1", { className: "page-hero__title", children: headline }), _jsx("p", { className: "page-hero__subtitle", children: subheadline })] }), _jsx("section", { className: "section", style: { padding: 0 }, children: _jsxs("div", { className: "produtos__layout", children: [_jsxs("aside", { className: "produtos__filters", children: [_jsxs("div", { className: "produtos__filters-header", children: [_jsx("h3", { className: "produtos__filters-title", children: "\uD83D\uDD0D Filtros" }), hasFilter && (_jsx("button", { className: "produtos__filters-clear", onClick: clearFilters, children: "Limpar" }))] }), _jsxs("div", { className: "produtos__filter-group", children: [_jsx("label", { className: "produtos__filter-label", children: "Nome" }), _jsx("input", { className: "form-input", type: "text", placeholder: "Buscar produto...", value: search, onChange: (e) => setSearch(e.target.value) })] }), categories.length > 0 && (_jsxs("div", { className: "produtos__filter-group", children: [_jsx("label", { className: "produtos__filter-label", children: "Categorias" }), _jsx("div", { className: "produtos__filter-cats", children: categories.map((cat) => {
                                                const active = selectedCatIds.includes(cat.id);
                                                return (_jsxs("button", { className: `produtos__filter-chip ${active ? 'produtos__filter-chip--active' : ''}`, style: active
                                                        ? { background: cat.color, borderColor: cat.color }
                                                        : { borderColor: cat.color, color: cat.color }, onClick: () => toggleCat(cat.id), children: [active ? '✓ ' : '', cat.name] }, cat.id));
                                            }) })] })), _jsxs("p", { className: "produtos__filter-count", children: [filtered.length, " resultado", filtered.length !== 1 ? 's' : ''] })] }), _jsx("div", { className: "produtos__grid-wrap", children: filtered.length > 0 ? (_jsx("div", { className: "produtos__grid", children: filtered.map((p) => (_jsxs("div", { className: "produto-card", children: [p.tag && _jsx("span", { className: "produto-card__tag", children: p.tag }), _jsx("div", { className: "produto-card__img-wrap", children: p.image
                                                ? _jsx("img", { src: p.image, alt: p.title, className: "produto-card__img" })
                                                : _jsx("div", { className: "produto-card__img-placeholder", children: p.icon || '📦' }) }), _jsxs("div", { className: "produto-card__body", children: [_jsx("h3", { className: "produto-card__title", children: p.title }), _jsx("p", { className: "produto-card__desc", children: p.description.length > 80
                                                        ? p.description.slice(0, 80).trimEnd() + '…'
                                                        : p.description }), _jsx("button", { className: "produto-card__saiba-mais", children: "Saiba mais" })] })] }, p.id))) })) : (_jsxs("div", { className: "produtos__empty", children: [_jsx("span", { children: "\uD83D\uDD0E" }), _jsx("p", { children: "Nenhum produto encontrado." }), _jsx("button", { className: "btn btn-outline", onClick: clearFilters, children: "Limpar filtros" })] })) })] }) })] }));
}
