import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Home.css';

export default function Home() {
  const { content } = useContent();
  const {
    carouselImages = [], companyDescription = '',
    carouselTagline = '', carouselTitle = '', carouselSubtitle = '',
    sobreTitle = '', stats = [], featuresTitle = '', features = [],
  } = content.published.home ?? {};

  const safeStats    = stats    ?? [];
  const safeFeatures = features ?? [];

  return (
    <div className="page-wrapper">
      <Carousel images={carouselImages ?? []} tagline={carouselTagline ?? ''} title={carouselTitle ?? ''} subtitle={carouselSubtitle ?? ''} />

      {/* ── Sobre ── */}
      <section className="section home__sobre">
        <div className="container">
          <p className="section-label">Quem Somos</p>
          <h2 className="section-title">{sobreTitle ?? 'Sobre a AeroTech Brasil'}</h2>
          <div className="section-divider" />
          <div className="home__sobre-grid">
            <div className="home__sobre-text">
              <p className="home__description">{companyDescription}</p>
            </div>
            <div className="home__stats">
              {safeStats.map((s, i) => (
                <div key={i} className="home__stat-card">
                  <span className="home__stat-value">{s.value}</span>
                  <span className="home__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      {safeFeatures.length > 0 && (
        <section className="home__features">
          <div className="container">
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Por que nos escolher</p>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>{featuresTitle ?? 'Diferenciais que fazem a diferença'}</h2>
            <div className="section-divider" style={{ background: 'var(--gold)' }} />
            <div className="home__features-grid">
              {safeFeatures.map((f, i) => (
                <div key={i} className="home__feature-card">
                  <div className="home__feature-icon">{f.icon}</div>
                  <h3 className="home__feature-title">{f.title}</h3>
                  <p className="home__feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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