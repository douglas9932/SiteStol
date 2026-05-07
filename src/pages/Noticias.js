import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import './Noticias.css';
const NOTICIAS = [
    { date: 'Maio 2025', title: 'AeroTech recebe nova certificação ANAC para operações noturnas', excerpt: 'A empresa amplia seu portfólio com certificação para voos noturnos agrícolas, tornando-se uma das poucas operadoras habilitadas no Sul do Brasil.', categoria: 'Certificação' },
    { date: 'Abril 2025', title: 'Nova frota amplia capacidade operacional em 40%', excerpt: 'Investimento de R$ 8 milhões em três novas aeronaves Ipanema e dois drones agrícolas de última geração reforçam o compromisso com modernização.', categoria: 'Frota' },
    { date: 'Março 2025', title: 'Parceria com 12 cooperativas agrícolas do Paraná', excerpt: 'Acordo firmado garante cobertura aérea para mais de 400 mil hectares de soja, milho e trigo na próxima safra na região Oeste do Paraná.', categoria: 'Parceria' },
    { date: 'Fevereiro 2025', title: 'AeroTech na Agrishow 2025 — Ribeirão Preto', excerpt: 'A empresa marcou presença na maior feira de tecnologia agrícola da América Latina, apresentando soluções de pulverização aérea de precisão.', categoria: 'Evento' },
];
export default function Noticias() {
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Novidades" }), _jsx("h1", { className: "page-hero__title", children: "Not\u00EDcias & Atualiza\u00E7\u00F5es" }), _jsx("p", { className: "page-hero__subtitle", children: "Fique por dentro das \u00FAltimas novidades da AeroTech Brasil." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsx("div", { className: "noticias__grid", children: NOTICIAS.map((n) => (_jsxs("article", { className: "noticia-card", children: [_jsx("span", { className: "noticia-card__cat", children: n.categoria }), _jsx("p", { className: "noticia-card__date", children: n.date }), _jsx("h2", { className: "noticia-card__title", children: n.title }), _jsx("p", { className: "noticia-card__excerpt", children: n.excerpt }), _jsx("span", { className: "noticia-card__read", children: "Leia mais \u2192" })] }, n.title))) }) }) }), _jsx(Footer, {})] }));
}
