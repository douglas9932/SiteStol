import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Sobre.css';

export default function Sobre() {
  const { content } = useContent();
  const { companyDescription = '' } = content.published.home ?? {};
  const {
    heroTitle = '', heroSubtitle = '', especialidades = [], timelineTitle = '', timeline = [],
  } = content.published.sobre ?? {};

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Nossa História</p>
        <h1 className="page-hero__title">{heroTitle}</h1>
        <p className="page-hero__subtitle">{heroSubtitle}</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="sobre__grid">
            <div className="sobre__text">
              {companyDescription.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {especialidades.length > 0 && (
              <div className="sobre__sidebar">
                <div className="sobre__especialidades">
                  <h3>Nossas Especialidades</h3>
                  {especialidades.map((e, i) => (
                    <div key={i} className="sobre__esp-item">
                      <div className="sobre__esp-dot" />
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="sobre__timeline-section">
          <div className="container">
            <p className="section-label">Nossa Jornada</p>
            <h2 className="section-title">{timelineTitle}</h2>
            <div className="section-divider" />
            <div className="sobre__timeline">
              {timeline.map((t, i) => (
                <div key={i} className={`sobre__timeline-item ${i % 2 === 0 ? '' : 'sobre__timeline-item--right'}`}>
                  <div className="sobre__timeline-card">
                    <span className="sobre__timeline-year">{t.year}</span>
                    <h4>{t.title}</h4>
                    <p>{t.desc}</p>
                  </div>
                  <div className="sobre__timeline-dot" />
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