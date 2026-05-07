import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Home.css';
const STATS = [
    { value: '18+', label: 'Anos de Experiência' },
    { value: '500+', label: 'Clientes Atendidos' },
    { value: '98%', label: 'Satisfação' },
    { value: 'ANAC', label: 'Homologado' },
];
const FEATURES = [
    { icon: '🛡️', title: 'Segurança Certificada', desc: 'Operações homologadas pela ANAC com os mais rígidos padrões de segurança aeronáutica.' },
    { icon: '🎯', title: 'Precisão GPS', desc: 'Tecnologia de posicionamento de última geração para aplicações com erro inferior a 30 cm.' },
    { icon: '⚡', title: 'Alta Produtividade', desc: 'Cobertura de até 3.000 hectares por dia com nossa frota de aeronaves modernas.' },
    { icon: '🌱', title: 'Sustentabilidade', desc: 'Redução de até 40% no consumo de defensivos com aplicação aérea de precisão.' },
];
export default function Home() {
    const { content } = useContent();
    const { carouselImages, companyDescription } = content.published.home;
    return (_jsxs("div", { className: "page-wrapper", children: [_jsx(Carousel, { images: carouselImages }), _jsx("section", { className: "section home__sobre", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", children: "Quem Somos" }), _jsx("h2", { className: "section-title", children: "Sobre a AeroTech Brasil" }), _jsx("div", { className: "section-divider" }), _jsxs("div", { className: "home__sobre-grid", children: [_jsx("div", { className: "home__sobre-text", children: _jsx("p", { className: "home__description", children: companyDescription }) }), _jsx("div", { className: "home__stats", children: STATS.map((s) => (_jsxs("div", { className: "home__stat-card", children: [_jsx("span", { className: "home__stat-value", children: s.value }), _jsx("span", { className: "home__stat-label", children: s.label })] }, s.label))) })] })] }) }), _jsx("section", { className: "home__features", children: _jsxs("div", { className: "container", children: [_jsx("p", { className: "section-label", style: { color: 'var(--gold-light)' }, children: "Por que nos escolher" }), _jsx("h2", { className: "section-title", style: { color: 'var(--white)' }, children: "Diferenciais que fazem a diferen\u00E7a" }), _jsx("div", { className: "section-divider", style: { background: 'var(--gold)' } }), _jsx("div", { className: "home__features-grid", children: FEATURES.map((f) => (_jsxs("div", { className: "home__feature-card", children: [_jsx("div", { className: "home__feature-icon", children: f.icon }), _jsx("h3", { className: "home__feature-title", children: f.title }), _jsx("p", { className: "home__feature-desc", children: f.desc })] }, f.title))) })] }) }), _jsx("section", { className: "section home__cta", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "home__cta-box", children: [_jsxs("div", { className: "home__cta-text", children: [_jsx("h2", { children: "Pronto para elevar seus resultados?" }), _jsx("p", { children: "Entre em contato com nossa equipe e descubra a solu\u00E7\u00E3o ideal para sua opera\u00E7\u00E3o." })] }), _jsx("a", { href: "/contatos", className: "btn btn-primary home__cta-btn", children: "Fale com um Especialista \u2192" })] }) }) }), _jsx(Footer, {})] }));
}
