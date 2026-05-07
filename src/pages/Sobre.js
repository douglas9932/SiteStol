import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Sobre.css';
const ESPECIALIDADES = [
    'Aviação Agrícola de Precisão',
    'Calibração de Instrumentos Aeronáuticos',
    'Testes STOL Certificados',
    'Inspeções Técnicas Completas',
    'Consultoria Aeronáutica',
    'Operações de Pulverização Aérea',
    'Monitoramento Aéreo por Drones',
    'Transporte Aéreo Executivo',
];
const TIMELINE = [
    { year: '2005', title: 'Fundação', desc: 'Criada por pilotos e engenheiros apaixonados por aviação no Paraná.' },
    { year: '2009', title: 'Homologação ANAC', desc: 'Obtemos as primeiras certificações junto à Agência Nacional de Aviação Civil.' },
    { year: '2014', title: 'Expansão Regional', desc: 'Ampliamos operações para MS, MT e GO, atendendo grandes produtores rurais.' },
    { year: '2019', title: 'Modernização da Frota', desc: 'Investimento de R$ 15M em aeronaves de última geração com GPS de alta precisão.' },
    { year: '2023', title: 'Drones Agrícolas', desc: 'Incorporamos drones de alta capacidade à nossa frota operacional.' },
];
export default function Sobre() {
    const { content } = useContent();
    const { companyDescription } = content.published.home;
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Nossa Hist\u00F3ria" }), _jsx("h1", { className: "page-hero__title", children: "Sobre a AeroTech Brasil" }), _jsx("p", { className: "page-hero__subtitle", children: "Quase duas d\u00E9cadas de excel\u00EAncia em servi\u00E7os aeron\u00E1uticos e avia\u00E7\u00E3o agr\u00EDcola." })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "sobre__grid", children: [_jsx("div", { className: "sobre__text", children: companyDescription.split('\n\n').filter(Boolean).map((para, i) => (_jsx("p", { children: para }, i))) }), _jsx("div", { className: "sobre__sidebar", children: _jsxs("div", { className: "sobre__especialidades", children: [_jsx("h3", { children: "Nossas Especialidades" }), ESPECIALIDADES.map((e) => (_jsxs("div", { className: "sobre__esp-item", children: [_jsx("div", { className: "sobre__esp-dot" }), _jsx("span", { children: e })] }, e)))] }) })] }) }) }), _jsx("section", { className: "sobre__timeline-section", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Nossa Jornada" }), _jsx("h2", { className: "section-title", children: "Uma hist\u00F3ria de crescimento" }), _jsx("div", { className: "section-divider" }), _jsx("div", { className: "sobre__timeline", children: TIMELINE.map((t, i) => (_jsxs("div", { className: `sobre__timeline-item ${i % 2 === 0 ? '' : 'sobre__timeline-item--right'}`, children: [_jsxs("div", { className: "sobre__timeline-card", children: [_jsx("span", { className: "sobre__timeline-year", children: t.year }), _jsx("h4", { children: t.title }), _jsx("p", { children: t.desc })] }), _jsx("div", { className: "sobre__timeline-dot" })] }, t.year))) })] }) }), _jsx(Footer, {})] }));
}
