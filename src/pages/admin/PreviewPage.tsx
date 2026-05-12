import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { useState, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import ProdutosLayout from '../ProdutosLayout';
import { NewsItem, getCalibrationTables, applyCompanyColors } from '@/lib/contentService';
import type { Contact } from '@/lib/contentService';
import '../Home.css';
import '../Produtos.css';
import '../Sobre.css';
import '../Noticias.css';
import '../NoticiaDetalhe.css';
import '../TabelaCalibracao.css';
import '../Contatos.css';

/* ── Banner fixo ── */
function PreviewBanner({ page }: { page: string }) {
  const PAGE_LABEL: Record<string, string> = {
    home:       'Home',
    sobre:      'Sobre',
    produtos:   'Produtos',
    noticias:   'Notícias',
    calibracao: 'Calibração',
    contatos:   'Contatos',
    empresa:    'Empresa',
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
        onClick={() => window.location.href = page === 'home' ? '/' : `/${page === 'calibracao' ? 'calibracao' : page}`}
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
        disableNavigation
      />
      <Footer />
    </div>
  );
}

/* ── Preview: Notícias ── */
function PreviewNoticias() {
  const [news,     setNews]     = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem('news_preview_draft') ?? '[]');
      const active = draft.filter((n: NewsItem) => n.active);
      setNews(active);
      if (active.length > 0) setSelected(active[0]);
    } catch { setNews([]); }
  }, []);

  function formatDate(d: string) {
    try { return new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' }); }
    catch { return d; }
  }

  if (news.length === 0) return (
    <div style={{ textAlign:'center', padding:'6rem', color:'var(--gray-400)' }}>
      <p style={{ fontSize:48 }}>📰</p>
      <p>Nenhuma notícia ativa no rascunho.</p>
    </div>
  );

  const n = selected ?? news[0];
  const extras = Array.isArray(n?.extra_images) ? n.extra_images : [];

  return (
    <>
      {/* Seletor de notícias — só aparece se houver mais de uma */}
      {news.length > 1 && (
        <div style={{
          background:'var(--navy)', borderBottom:'1px solid rgba(255,255,255,0.1)',
          padding:'8px 1.5rem', display:'flex', gap:8, overflowX:'auto', alignItems:'center',
          position:'sticky', top:0, zIndex:10,
        }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, whiteSpace:'nowrap' }}>Ver notícia:</span>
          {news.map(item => (
            <button key={item.id} onClick={() => setSelected(item)} style={{
              background: (selected?.id ?? news[0].id) === item.id ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
              color: (selected?.id ?? news[0].id) === item.id ? 'var(--navy)' : 'rgba(255,255,255,0.7)',
              border:'none', borderRadius:20, padding:'4px 14px',
              fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s',
            }}>{item.title.length > 35 ? item.title.slice(0,35)+'…' : item.title}</button>
          ))}
        </div>
      )}

      {/* ── Página idêntica à real ── */}

      {/* Hero com imagem de capa */}
      {n.image_url ? (
        <div className="noticia-detalhe__hero">
          <img src={n.image_url} alt={n.title} className="noticia-detalhe__hero-img" />
          <div className="noticia-detalhe__hero-overlay" />
          <div className="noticia-detalhe__hero-content">
            <div className="noticia-detalhe__meta">
              {n.category && <span className="noticia-detalhe__cat">{n.category}</span>}
              <span className="noticia-detalhe__date">{formatDate(n.published_at)}</span>
            </div>
            <h1 className="noticia-detalhe__title">{n.title}</h1>
            {n.author && <p className="noticia-detalhe__author">Por {n.author}</p>}
          </div>
        </div>
      ) : (
        <div className="page-hero">
          <div className="noticia-detalhe__meta" style={{ justifyContent:'center', marginBottom:12 }}>
            {n.category && <span className="noticia-detalhe__cat">{n.category}</span>}
            <span className="noticia-detalhe__date">{formatDate(n.published_at)}</span>
          </div>
          <h1 className="page-hero__title">{n.title}</h1>
          {n.author && <p style={{ color:'rgba(255,255,255,0.6)', marginTop:8 }}>Por {n.author}</p>}
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="noticia-detalhe__body">

            {/* Breadcrumb */}
            <nav className="noticia-detalhe__breadcrumb">
              <span style={{ color:'var(--gold)', fontSize:13, fontWeight:700 }}>← Notícias</span>
            </nav>

            {/* Resumo */}
            {n.summary && <p className="noticia-detalhe__summary">{n.summary}</p>}
            {n.summary && n.content && <div className="noticia-detalhe__divider" />}

            {/* Conteúdo */}
            {n.content && <div className="noticia-detalhe__content">{n.content}</div>}

            {/* Galeria extras */}
            {extras.length > 0 && (
              <div className="noticia-detalhe__gallery-section">
                <h3 className="noticia-detalhe__gallery-title">📷 Galeria de Fotos</h3>
                <div className="noticia-detalhe__gallery">
                  {extras.map((url: string, i: number) => (
                    <div key={i} className="noticia-detalhe__gallery-item" onClick={() => setLightbox(url)}>
                      <img src={url} alt={`Foto ${i+1}`} />
                      <div className="noticia-detalhe__gallery-overlay">🔍</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rodapé */}
            <div className="noticia-detalhe__footer-bar">
              <span className="noticia-detalhe__footer-date">
                📅 Publicado em {formatDate(n.published_at)}{n.author && ` · Por ${n.author}`}
              </span>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <div className="noticia-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Ampliado" className="noticia-lightbox__img" onClick={e => e.stopPropagation()} />
          <button className="noticia-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </>
  );
}

/* ── Preview: Calibração ── */
function PreviewCalibracao() {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem('calib_preview_draft') ?? '[]');
      setTables(draft.filter((t: any) => t.active));
    } catch {
      getCalibrationTables().then(data => setTables(data.filter((t: any) => t.active)));
    }
  }, []);

  return (
    <div className="page-wrapper" style={{ paddingTop:0 }}>
      <div className="page-hero">
        <p className="page-hero__label">Técnico</p>
        <h1 className="page-hero__title">Tabela de Calibração</h1>
        <p className="page-hero__subtitle">Referências técnicas para calibração de instrumentos aeronáuticos.</p>
      </div>
      <section className="section">
        <div className="container">
          {tables.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
              <p style={{ fontSize:40 }}>📊</p>
              <p>Nenhuma tabela de calibração ativa.</p>
            </div>
          ) : (
            <div className="calib__list">
              {tables.map((t: any) => (
                <div key={t.id} className="calib__block">
                  <div className="calib__block-header">
                    <h2 className="calib__block-title">{t.title}</h2>
                    {t.description && <p className="calib__block-desc">{t.description}</p>}
                  </div>
                  {t.columns.length > 0 && (
                    <div className="calib__table-wrap">
                      <table className="calib__table">
                        <thead>
                          <tr>
                            {(t.row_headers ?? []).some((h: string) => h) && (
                              <th className="calib__table-row-header-col"></th>
                            )}
                            {t.columns.map((col: string, ci: number) => <th key={ci}>{col}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {t.rows.map((row: string[], ri: number) => (
                            <tr key={ri}>
                              {(t.row_headers ?? []).some((h: string) => h) && (
                                <td className="calib__table-row-header">{(t.row_headers ?? [])[ri] ?? ''}</td>
                              )}
                              {t.columns.map((_: any, ci: number) => <td key={ci}>{row[ci] ?? ''}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ── Preview: Contatos ── */
function PreviewContatos() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem('contacts_preview_draft') ?? '[]');
      setContacts(draft.filter((c: Contact) => c.active));
    } catch { setContacts([]); }
  }, []);

  return (
    <div className="page-wrapper" style={{ paddingTop:0 }}>
      <div className="page-hero">
        <p className="page-hero__label">Fale Conosco</p>
        <h1 className="page-hero__title">Contatos</h1>
        <p className="page-hero__subtitle">Nossa equipe está pronta para atendê-lo da melhor forma.</p>
      </div>
      <section className="section">
        <div className="container">
          {contacts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
              <p>Nenhum contato ativo no rascunho.</p>
            </div>
          ) : (
            <div className="contatos__grid">
              {contacts.map((c) => {
                const initials = c.name.split(' ').slice(0,2).map(w=>w[0]).join('');
                return (
                  <div key={c.id} className="contato-card">
                    <div className="contato-card__header">
                      <div className="contato-card__avatar">{initials}</div>
                      <div>
                        <h2 className="contato-card__name">{c.name}</h2>
                        {c.role && <p className="contato-card__role">{c.role}</p>}
                      </div>
                    </div>
                    <ul className="contato-card__list">
                      {c.email   && <li><span>✉</span><span>{c.email}</span></li>}
                      {c.phone   && <li><span>☎</span><span>{c.phone}</span></li>}
                      {c.mobile  && <li><span>📱</span><span>{c.mobile}</span></li>}
                      {c.address && <li><span>📍</span><span>{c.address}</span></li>}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ── Preview: Empresa ── */
function PreviewEmpresa() {
  const { content } = useContent();

  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem('empresa_preview_draft') ?? '{}');
      if (draft.color_primary || draft.color_secondary) {
        applyCompanyColors(draft);
      }
      if (draft.name) document.title = `[Preview] ${draft.name}`;
    } catch {}
  }, []);

  const {
    carouselImages = [], companyDescription = '',
    carouselTagline, carouselTitle, carouselSubtitle,
    sobreTitle, stats, featuresTitle, features,
  } = content.published.home ?? {};
  const safeStats    = stats    ?? [];
  const safeFeatures = features ?? [];

  return (
    <div className="page-wrapper" style={{ paddingTop:0 }}>
      <Carousel images={carouselImages} tagline={carouselTagline ?? ''} title={carouselTitle ?? ''} subtitle={carouselSubtitle ?? ''} />
      <section className="section home__sobre" style={{ background:'#fff' }}>
        <div className="container">
          <p className="section-label">Quem Somos</p>
          <h2 className="section-title">{sobreTitle ?? ''}</h2>
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

const PAGE_MAP: Record<string, JSX.Element> = {
  home:       <PreviewHome />,
  sobre:      <PreviewSobre />,
  produtos:   <PreviewProdutos />,
  noticias:   <PreviewNoticias />,
  calibracao: <PreviewCalibracao />,
  contatos:   <PreviewContatos />,
  empresa:    <PreviewEmpresa />,
};

/* ── Componente principal ── */
export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? 'home';

  return (
    <div>
      <PreviewBanner page={page} />
      {page === 'noticias'
        ? <div className="page-wrapper" style={{ paddingTop:0 }}><PreviewNoticias /></div>
        : (PAGE_MAP[page] ?? <PreviewHome />)
      }
    </div>
  );
}