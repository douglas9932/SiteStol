import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getCalibrationTables } from '@/lib/contentService';
import './TabelaCalibracao.css';
export default function TabelaCalibracao() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getCalibrationTables()
            .then(data => setTables(data.filter(t => t.active)))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "T\u00E9cnico" }), _jsx("h1", { className: "page-hero__title", children: "Tabela de Calibra\u00E7\u00E3o" }), _jsx("p", { className: "page-hero__subtitle", children: "Refer\u00EAncias t\u00E9cnicas para calibra\u00E7\u00E3o de instrumentos aeron\u00E1uticos." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: loading ? (_jsx("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: "Carregando..." })) : tables.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: [_jsx("p", { style: { fontSize: 40 }, children: "\uD83D\uDCCA" }), _jsx("p", { children: "Nenhuma tabela de calibra\u00E7\u00E3o dispon\u00EDvel no momento." })] })) : (_jsx("div", { className: "calib__list", children: tables.map((t) => (_jsxs("div", { className: "calib__block", children: [_jsxs("div", { className: "calib__block-header", children: [_jsx("h2", { className: "calib__block-title", children: t.title }), t.description && _jsx("p", { className: "calib__block-desc", children: t.description })] }), t.columns.length > 0 && (_jsx("div", { className: "calib__table-wrap", children: _jsxs("table", { className: "calib__table", children: [_jsx("thead", { children: _jsxs("tr", { children: [(t.row_headers ?? []).some(h => h) && (_jsx("th", { className: "calib__table-row-header-col" })), t.columns.map((col, ci) => (_jsx("th", { children: col }, ci)))] }) }), _jsx("tbody", { children: t.rows.map((row, ri) => (_jsxs("tr", { children: [(t.row_headers ?? []).some(h => h) && (_jsx("td", { className: "calib__table-row-header", children: (t.row_headers ?? [])[ri] ?? '' })), t.columns.map((_, ci) => (_jsx("td", { children: row[ci] ?? '' }, ci)))] }, ri))) })] }) }))] }, t.id))) })) }) }), _jsx(Footer, {})] }));
}
