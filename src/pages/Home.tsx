import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Home.css';

const STATS = [
  { value: '18+',  label: 'Anos de Experiência' },
  { value: '500+', label: 'Clientes Atendidos'  },
  { value: '98%',  label: 'Satisfação'           },
  { value: 'ANAC', label: 'Homologado'           },
];

const FEATURES = [
  { icon: '🛡️', title: 'Segurança Certificada',  desc: 'Operações homologadas pela ANAC com os mais rígidos padrões de segurança aeronáutica.' },
  { icon: '🎯', title: 'Precisão GPS',            desc: 'Tecnologia de posicionamento de última geração para aplicações com erro inferior a 30 cm.' },
  { icon: '⚡', title: 'Alta Produtividade',      desc: 'Cobertura de até 3.000 hectares por dia com nossa frota de aeronaves modernas.' },
  { icon: '🌱', title: 'Sustentabilidade',        desc: 'Redução de até 40% no consumo de defensivos com aplicação aérea de precisão.' },
];

export default function Home() {
  const { content } = useContent();
  const { carouselImages, companyDescription } = content.published.home;

  return (
    <div className="page-wrapper">
      {/* ── Carousel ── */}
      <Carousel images={carouselImages} />

      {/* ── Sobre section ── */}
      <section className="section home__sobre">
        <div className="container">
          <p className="section-label">Quem Somos</p>
          <h2 className="section-title">Sobre a AeroTech Brasil</h2>
          <div className="section-divider" />

          <div className="home__sobre-grid">
            {/* Description */}
            <div className="home__sobre-text">
              <p className="home__description">{companyDescription}</p>
            </div>

            {/* Stats */}
            <div className="home__stats">
              {STATS.map((s) => (
                <div key={s.label} className="home__stat-card">
                  <span className="home__stat-value">{s.value}</span>
                  <span className="home__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home__features">
        <div className="container">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Por que nos escolher</p>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>Diferenciais que fazem a diferença</h2>
          <div className="section-divider" style={{ background: 'var(--gold)' }} />
          <div className="home__features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="home__feature-card">
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section home__cta">
        <div className="container">
          <div className="home__cta-box">
            <div className="home__cta-text">
              <h2>Pronto para elevar seus resultados?</h2>
              <p>Entre em contato com nossa equipe e descubra a solução ideal para sua operação.</p>
            </div>
            <a href="/contatos" className="btn btn-primary home__cta-btn">
              Fale com um Especialista →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
