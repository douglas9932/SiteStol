import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { getNews, NewsItem } from '@/lib/contentService';
import './Noticias.css';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

export default function Noticias() {
  const [news,    setNews]    = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNews()
      .then(data => setNews(data.filter(n => n.active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Novidades</p>
        <h1 className="page-hero__title">Notícias & Atualizações</h1>
        <p className="page-hero__subtitle">Fique por dentro das últimas novidades.</p>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>Carregando...</div>
          ) : news.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
              <p>Nenhuma notícia publicada no momento.</p>
            </div>
          ) : (
            <div className="noticias__grid">
              {news.map((n) => (
                <article key={n.id} className="noticia-card" onClick={() => navigate(`/noticias/${n.id}`)}>
                  {/* Imagem de capa */}
                  {n.image_url && (
                    <div className="noticia-card__img-wrap">
                      <img src={n.image_url} alt={n.title} className="noticia-card__img" />
                    </div>
                  )}

                  <div className="noticia-card__body">
                    {/* Meta */}
                    <div className="noticia-card__meta">
                      {n.category && <span className="noticia-card__cat">{n.category}</span>}
                      <p className="noticia-card__date">{formatDate(n.published_at)}</p>
                    </div>

                    {/* Título */}
                    <h2 className="noticia-card__title">{n.title}</h2>

                    {/* Resumo */}
                    {n.summary && <p className="noticia-card__excerpt">{n.summary}</p>}

                    {/* Leia mais */}
                    <span className="noticia-card__read">Leia mais →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}