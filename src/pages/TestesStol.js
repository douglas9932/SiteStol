import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import './TestesStol.css';
const TESTES = [
    { num: '01', titulo: 'Decolagem Pista Seca', aeronave: 'PP-ATB — Ipanema 202A', data: '12/04/2025', distDec: '280m', distPou: '195m', velRot: '87 km/h', resultado: 'Aprovado' },
    { num: '02', titulo: 'Pouso Chuva Leve', aeronave: 'PP-ATC — Ipanema 202B', data: '15/04/2025', distDec: '310m', distPou: '220m', velRot: '90 km/h', resultado: 'Aprovado' },
    { num: '03', titulo: 'Pista Gramada Úmida', aeronave: 'PP-ATD — Cessna C172', data: '20/04/2025', distDec: '350m', distPou: '260m', velRot: '95 km/h', resultado: 'Condicional' },
    { num: '04', titulo: 'Alta Altitude (1.200m)', aeronave: 'PP-ATF — Ipanema 201A', data: '02/05/2025', distDec: '295m', distPou: '210m', velRot: '89 km/h', resultado: 'Aprovado' },
];
export default function TestesStol() {
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Certifica\u00E7\u00E3o Operacional" }), _jsx("h1", { className: "page-hero__title", children: "Testes STOL" }), _jsx("p", { className: "page-hero__subtitle", children: "Short Take-Off and Landing \u2014 avalia\u00E7\u00E3o certificada pela ANAC de desempenho em pista curta." })] }), _jsx("section", { className: "section", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "stol__intro", children: "Os Testes STOL (Short Take-Off and Landing) s\u00E3o procedimentos certificados que avaliam a capacidade de decolagem e pouso das aeronaves em dist\u00E2ncias reduzidas. Todos os testes s\u00E3o documentados e registrados junto \u00E0 ANAC, garantindo rastreabilidade e conformidade regulat\u00F3ria." }), _jsx("div", { className: "stol__grid", children: TESTES.map((t) => (_jsxs("div", { className: "stol-card", children: [_jsxs("div", { className: "stol-card__header", children: [_jsx("div", { className: "stol-card__num", children: t.num }), _jsxs("div", { children: [_jsx("h3", { className: "stol-card__title", children: t.titulo }), _jsxs("p", { className: "stol-card__meta", children: [t.aeronave, " \u00B7 ", t.data] })] }), _jsx("span", { className: `stol-card__result ${t.resultado === 'Aprovado' ? 'stol-card__result--ok' : 'stol-card__result--warn'}`, children: t.resultado })] }), _jsx("div", { className: "stol-card__metrics", children: [
                                            ['Dist. Decolagem', t.distDec],
                                            ['Dist. Pouso', t.distPou],
                                            ['Vel. Rotação', t.velRot],
                                        ].map(([label, value]) => (_jsxs("div", { className: "stol-card__metric", children: [_jsx("span", { className: "stol-card__metric-val", children: value }), _jsx("span", { className: "stol-card__metric-label", children: label })] }, label))) })] }, t.num))) })] }) }), _jsx(Footer, {})] }));
}
