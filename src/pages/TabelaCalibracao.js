import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import './TabelaCalibracao.css';
const ROWS = [
    { instrumento: 'Altímetro Principal', aeronave: 'PP-ATB — Ipanema 202A', ultima: '10/01/2025', proxima: '10/07/2025', status: 'ok', tecnico: 'Eng. Marcos Silva' },
    { instrumento: 'Velocímetro IAS', aeronave: 'PP-ATB — Ipanema 202A', ultima: '10/01/2025', proxima: '10/07/2025', status: 'ok', tecnico: 'Eng. Marcos Silva' },
    { instrumento: 'Transponder Mode-S', aeronave: 'PP-ATC — Ipanema 202B', ultima: '15/03/2025', proxima: '15/09/2025', status: 'warn', tecnico: 'Téc. Paulo Alves' },
    { instrumento: 'Altímetro Co-Piloto', aeronave: 'PP-ATD — Cessna C172', ultima: '20/11/2024', proxima: '20/05/2025', status: 'err', tecnico: 'Eng. Marcos Silva' },
    { instrumento: 'Variômetro', aeronave: 'PP-ATE — Cessna C172', ultima: '05/02/2025', proxima: '05/08/2025', status: 'ok', tecnico: 'Téc. Paulo Alves' },
    { instrumento: 'Bússola Magnética', aeronave: 'PP-ATD — Cessna C172', ultima: '20/11/2024', proxima: '20/05/2025', status: 'err', tecnico: 'Téc. Lima Rocha' },
    { instrumento: 'Radio Altímetro', aeronave: 'PP-ATF — Ipanema 201A', ultima: '12/04/2025', proxima: '12/10/2025', status: 'ok', tecnico: 'Eng. Marcos Silva' },
];
const STATUS_MAP = {
    ok: { label: 'Calibrado', cls: 'badge-success' },
    warn: { label: 'A Vencer', cls: 'badge-warning' },
    err: { label: 'Vencido', cls: 'badge-danger' },
};
export default function TabelaCalibracao() {
    const ok = ROWS.filter((r) => r.status === 'ok').length;
    const warn = ROWS.filter((r) => r.status === 'warn').length;
    const err = ROWS.filter((r) => r.status === 'err').length;
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Documenta\u00E7\u00E3o T\u00E9cnica" }), _jsx("h1", { className: "page-hero__title", children: "Tabela de Calibra\u00E7\u00E3o" }), _jsx("p", { className: "page-hero__subtitle", children: "Acompanhe o status de calibra\u00E7\u00E3o de todos os instrumentos aeron\u00E1uticos." })] }), _jsx("section", { className: "section", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "cal__summary", children: [_jsxs("div", { className: "cal__summary-card cal__summary-card--ok", children: [_jsx("span", { className: "cal__summary-num", children: ok }), _jsx("span", { className: "cal__summary-label", children: "Calibrados" })] }), _jsxs("div", { className: "cal__summary-card cal__summary-card--warn", children: [_jsx("span", { className: "cal__summary-num", children: warn }), _jsx("span", { className: "cal__summary-label", children: "A Vencer" })] }), _jsxs("div", { className: "cal__summary-card cal__summary-card--err", children: [_jsx("span", { className: "cal__summary-num", children: err }), _jsx("span", { className: "cal__summary-label", children: "Vencidos" })] })] }), _jsx("div", { className: "cal__table-wrap", children: _jsxs("table", { className: "cal__table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Instrumento" }), _jsx("th", { children: "Aeronave" }), _jsx("th", { children: "\u00DAltima Calibra\u00E7\u00E3o" }), _jsx("th", { children: "Pr\u00F3xima Calibra\u00E7\u00E3o" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Respons\u00E1vel" })] }) }), _jsx("tbody", { children: ROWS.map((r, i) => {
                                            const s = STATUS_MAP[r.status];
                                            return (_jsxs("tr", { className: r.status === 'err' ? 'cal__row--err' : r.status === 'warn' ? 'cal__row--warn' : '', children: [_jsx("td", { className: "cal__td-bold", children: r.instrumento }), _jsx("td", { children: r.aeronave }), _jsx("td", { children: r.ultima }), _jsx("td", { children: r.proxima }), _jsx("td", { children: _jsx("span", { className: `badge ${s.cls}`, children: s.label }) }), _jsx("td", { className: "cal__td-muted", children: r.tecnico })] }, i));
                                        }) })] }) })] }) }), _jsx(Footer, {})] }));
}
