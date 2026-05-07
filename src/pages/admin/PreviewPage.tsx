import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import '../Home.css';
import '../Produtos.css';

/* ── Banner fixo ── */
function PreviewBanner({ page }: { page: string }) {

  const PAGE_LABEL: Record<string, string> = {
    home:     'Home',
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
const STATS = [
  { value: '18+',  label: 'Anos de Experiência' },
  { value: '500+', label: 'Clientes Atendidos'  },
  { value: '98%',  label: 'Satisfação'           },
  { value: 'ANAC', label: 'Homologado'           },
];

function PreviewHome() {
  const { content } = useContent();
  const { carouselImages, companyDescription } = content.draft.home;

  return (
    <div className="page-wrapper" style={{ paddingTop: 0 }}>
      <Carousel images={carouselImages} />
      <section className="section home__sobre" style={{ background: '#fff' }}>
        <div className="container">
          <p className="section-label">Quem Somos</p>
          <h2 className="section-title">Sobre a AeroTech Brasil</h2>
          <div className="section-divider" />
          <div className="home__sobre-grid">
            <div className="home__sobre-text">
              <p className="home__description">{companyDescription}</p>
            </div>
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
      <Footer />
    </div>
  );
}

/* ── Preview: Produtos — layout idêntico à página publicada ── */
function PreviewProdutos() {
  const { content } = useContent();
  const { headline, subheadline, products } = content.draft.products;
  const categories = content.categories;

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