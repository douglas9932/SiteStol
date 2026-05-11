import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getNews, NewsItem } from '@/lib/contentService';
import './NoticiaDetalhe.css';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function NoticiaDetalhe() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const [news,     setNews]     = useState<NewsItem | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    getNews().then(all => {
      const found = all.find(n => n.id === id && n.active);
      setNews(found ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div style={{ textAlign:'center', padding:'6rem', color:'var(--gray-400)' }}>Carregando...</div>
      <Footer />
    </div>
  );

  if (!news) return (
    <div className="page-wrapper">
      <div style={{ textAlign:'center', padding:'6rem', color:'var(--gray-400)' }}>
        <p style={{ fontSize:48 }}>📰</p>
        <p>Notícia não encontrada.</p>
        <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => navigate('/noticias')}>
          ← Voltar para Notícias
        </button>
      </div>
      <Footer />
    </div>
  );

  const extras = Array.isArray(news.extra_images) ? news.extra_images : [];

  return (
    <div className="page-wrapper">
      {/* Hero com imagem de capa */}
      {news.image_url ? (
        <div className="noticia-detalhe__hero">
          <img src={news.image_url} alt={news.title} className="noticia-detalhe__hero-img" />
          <div className="noticia-detalhe__hero-overlay" />
          <div className="noticia-detalhe__hero-content">
            <div className="noticia-detalhe__meta">
              {news.category && <span className="noticia-detalhe__cat">{news.category}</span>}
              <span className="noticia-detalhe__date">{formatDate(news.published_at)}</span>
            </div>
            <h1 className="noticia-detalhe__title">{news.title}</h1>
            {news.author && <p className="noticia-detalhe__author">Por {news.author}</p>}
          </div>
        </div>
      ) : (
        <div className="page-hero">
          <div className="noticia-detalhe__meta" style={{ justifyContent:'center', marginBottom:12 }}>
            {news.category && <span className="noticia-detalhe__cat">{news.category}</span>}
            <span className="noticia-detalhe__date">{formatDate(news.published_at)}</span>
          </div>
          <h1 className="page-hero__title">{news.title}</h1>
          {news.author && <p style={{ color:'rgba(255,255,255,0.6)', marginTop:8 }}>Por {news.author}</p>}
        </div>
      )}

      <section className="section">
        <div className="container">
          <div className="noticia-detalhe__body">

            {/* Breadcrumb */}
            <nav className="noticia-detalhe__breadcrumb">
              <button onClick={() => navigate('/noticias')}>← Voltar para Notícias</button>
            </nav>

            {/* Resumo em destaque */}
            {news.summary && (
              <p className="noticia-detalhe__summary">{news.summary}</p>
            )}

            {/* Linha dourada divisória */}
            {news.summary && news.content && (
              <div className="noticia-detalhe__divider" />
            )}

            {/* Conteúdo completo */}
            {news.content && (
              <div className="noticia-detalhe__content">
                {news.content}
              </div>
            )}

            {/* Galeria de imagens extras */}
            {extras.length > 0 && (
              <div className="noticia-detalhe__gallery-section">
                <h3 className="noticia-detalhe__gallery-title">📷 Galeria de Fotos</h3>
                <div className="noticia-detalhe__gallery">
                  {extras.map((url, i) => (
                    <div key={i} className="noticia-detalhe__gallery-item"
                      onClick={() => setLightbox(url)}>
                      <img src={url} alt={`Foto ${i + 1}`} />
                      <div className="noticia-detalhe__gallery-overlay">🔍</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rodapé da notícia */}
            <div className="noticia-detalhe__footer-bar">
              <span className="noticia-detalhe__footer-date">
                📅 Publicado em {formatDate(news.published_at)}
                {news.author && ` · Por ${news.author}`}
              </span>
              <button className="btn btn-outline" onClick={() => navigate('/noticias')}>
                ← Voltar para Notícias
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="noticia-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Ampliado" className="noticia-lightbox__img"
            onClick={e => e.stopPropagation()} />
          <button className="noticia-lightbox__close" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}

      <Footer />
    </div>
  );
}