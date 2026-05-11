import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import '../Home.css';
import '../Produtos.css';
import '../Sobre.css';

/* ── Banner fixo ── */
function PreviewBanner({ page }: { page: string }) {
  const PAGE_LABEL: Record<string, string> = {
    home:     'Home',
    sobre:    'Sobre',
    produtos: 'Produtos',
  };

  return (
    <div className="preview-banner">
      <span>
        👁 MODO PREVIEW — <strong>{PAGE_LABEL[page] ?? page}</strong> — Alterações ainda NÃO publicadas
      </span>
      <button onClick={() => window.close()}>
        ← Voltar ao Admin
      </button>
      <button
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)' }}
        onClick={() => window.location.href = page === 'home' ? '/' : `/${page}`}
      >
        Ver Versão Publicada →
      </button>
    </div>
  );
}

/* ── Preview: Home ── */
function PreviewHome() {
  const { content } = useContent();
  const {
    carouselImages = [], companyDescription = '',
    carouselTagline, carouselTitle, carouselSubtitle,
    sobreTitle, stats, featuresTitle, features,
  } = content.draft.home;

  const safeStats    = stats    ?? [];
  const safeFeatures = features ?? [];

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      <Carousel images={carouselImages} tagline={carouselTagline ?? ''} title={carouselTitle ?? ''} subtitle={carouselSubtitle ?? ''} />
      <section className="section home__sobre" style={{ background: '#fff' }}>
        <div className="container">
          <p className="section-label">Quem Somos</p>
          <h2 className="section-title">{sobreTitle ?? 'Sobre a Empresa'}</h2>
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

      {safeFeatures.length > 0 && (
        <section className="home__features">
          <div className="container">
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Por que nos escolher</p>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>{featuresTitle ?? 'Diferenciais'}</h2>
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
      <Footer />
    </div>
  );
}

/* ── Preview: Sobre ── */
function PreviewSobre() {
  const { content } = useContent();
  const { companyDescription = '' } = content.draft.home ?? {};
  const {
    heroTitle = '', heroSubtitle = '',
    especialidades = [], timelineTitle = '', timeline = [],
  } = content.draft.sobre ?? {};

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      <div className="page-hero">
        <p className="page-hero__label">Nossa História</p>
        <h1 className="page-hero__title">{heroTitle}</h1>
        {heroSubtitle && <p className="page-hero__subtitle">{heroSubtitle}</p>}
      </div>

      <section className="section">
        <div className="container sobre__grid">
          <div className="sobre__text">
            <p className="section-label">Quem Somos</p>
            <div className="section-divider" />
            <p className="sobre__desc">{companyDescription}</p>
          </div>
          {especialidades.length > 0 && (
            <div className="sobre__especialidades">
              <h3 className="sobre__esp-title">Especialidades</h3>
              <ul className="sobre__esp-list">
                {especialidades.map((e: string, i: number) => (
                  <li key={i} className="sobre__esp-item">
                    <span className="sobre__esp-dot" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="section sobre__timeline-section">
          <div className="container">
            <p className="section-label">Jornada</p>
            <h2 className="section-title">{timelineTitle}</h2>
            <div className="section-divider" />
            <div className="sobre__timeline">
              {timeline.map((t: any, i: number) => (
                <div key={i} className={`sobre__timeline-item ${i % 2 === 0 ? 'sobre__timeline-item--left' : 'sobre__timeline-item--right'}`}>
                  <div className="sobre__timeline-dot" />
                  <div className="sobre__timeline-card">
                    <span className="sobre__timeline-year">{t.year}</span>
                    <h3 className="sobre__timeline-title">{t.title}</h3>
                    <p className="sobre__timeline-desc">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

/* ── Preview: Produtos ── */
function PreviewProdutos() {
  const { content } = useContent();
  const { headline = '', subheadline = '', products = [] } = content.draft.products ?? {};
  const categories = content.categories ?? [];

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      <ProdutosLayout
        headline={headline}
        subheadline={subheadline}
        products={products}
        categories={categories}
      />
      <Footer />
    </div>
  );
}

/* ── Mapa de páginas ── */
const PAGE_MAP: Record<string, JSX.Element> = {
  home:     <PreviewHome />,
  sobre:    <PreviewSobre />,
  produtos: <PreviewProdutos />,
};

/* ── Componente principal ── */
export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? 'home';

  return (
    <div>
      <PreviewBanner page={page} />
      {PAGE_MAP[page] ?? <PreviewHome />}
    </div>
  );
}