import Footer from '@/components/Footer';
import './Noticias.css';

const NOTICIAS = [
  { date: 'Maio 2025',      title: 'AeroTech recebe nova certificação ANAC para operações noturnas', excerpt: 'A empresa amplia seu portfólio com certificação para voos noturnos agrícolas, tornando-se uma das poucas operadoras habilitadas no Sul do Brasil.', categoria: 'Certificação' },
  { date: 'Abril 2025',     title: 'Nova frota amplia capacidade operacional em 40%',                 excerpt: 'Investimento de R$ 8 milhões em três novas aeronaves Ipanema e dois drones agrícolas de última geração reforçam o compromisso com modernização.',  categoria: 'Frota'        },
  { date: 'Março 2025',     title: 'Parceria com 12 cooperativas agrícolas do Paraná',                excerpt: 'Acordo firmado garante cobertura aérea para mais de 400 mil hectares de soja, milho e trigo na próxima safra na região Oeste do Paraná.',           categoria: 'Parceria'     },
  { date: 'Fevereiro 2025', title: 'AeroTech na Agrishow 2025 — Ribeirão Preto',                    excerpt: 'A empresa marcou presença na maior feira de tecnologia agrícola da América Latina, apresentando soluções de pulverização aérea de precisão.',        categoria: 'Evento'       },
];

export default function Noticias() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Novidades</p>
        <h1 className="page-hero__title">Notícias & Atualizações</h1>
        <p className="page-hero__subtitle">Fique por dentro das últimas novidades da AeroTech Brasil.</p>
      </div>
      <section className="section">
        <div className="container">
          <div className="noticias__grid">
            {NOTICIAS.map((n) => (
              <article key={n.title} className="noticia-card">
                <span className="noticia-card__cat">{n.categoria}</span>
                <p className="noticia-card__date">{n.date}</p>
                <h2 className="noticia-card__title">{n.title}</h2>
                <p className="noticia-card__excerpt">{n.excerpt}</p>
                <span className="noticia-card__read">Leia mais →</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
