import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Sobre.css';
export default function Sobre() {
    const { content } = useContent();
    const { companyDescription } = content.published.home;
    const { heroTitle, heroSubtitle, especialidades, timelineTitle, timeline, } = content.published.sobre ?? {
        heroTitle: 'Sobre a AeroTech Brasil',
        heroSubtitle: 'Quase duas décadas de excelência em serviços aeronáuticos e aviação agrícola.',
        especialidades: [],
        timelineTitle: 'Uma história de crescimento',
        timeline: [],
    };
    return (_jsxs("div", { className: "page-wrapper", children: [_jsxs("div", { className: "page-hero", children: [_jsx("p", { className: "page-hero__label", children: "Nossa Hist\u00F3ria" }), _jsx("h1", { className: "page-hero__title", children: heroTitle }), _jsx("p", { className: "page-hero__subtitle", children: heroSubtitle })] }), _jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "sobre__grid", children: [_jsx("div", { className: "sobre__text", children: companyDescription.split('\n\n').filter(Boolean).map((para, i) => (_jsx("p", { children: para }, i))) }), especialidades.length > 0 && (_jsx("div", { className: "sobre__sidebar", children: _jsxs("div", { className: "sobre__especialidades", children: [_jsx("h3", { children: "Nossas Especialidades" }), especialidades.map((e, i) => (_jsxs("div", { className: "sobre__esp-item", children: [_jsx("div", { className: "sobre__esp-dot" }), _jsx("span", { children: e })] }, i)))] }) }))] }) }) }), timeline.length > 0 && (_jsx("section", { className: "sobre__timeline-section", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Nossa Jornada" }), _jsx("h2", { className: "section-title", children: timelineTitle }), _jsx("div", { className: "section-divider" }), _jsx("div", { className: "sobre__timeline", children: timeline.map((t, i) => (_jsxs("div", { className: `sobre__timeline-item ${i % 2 === 0 ? '' : 'sobre__timeline-item--right'}`, children: [_jsxs("div", { className: "sobre__timeline-card", children: [_jsx("span", { className: "sobre__timeline-year", children: t.year }), _jsx("h4", { children: t.title }), _jsx("p", { children: t.desc })] }), _jsx("div", { className: "sobre__timeline-dot" })] }, i))) })] }) })), _jsx(Footer, {})] }));
}
