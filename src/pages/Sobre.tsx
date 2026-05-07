import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import './Sobre.css';

const ESPECIALIDADES = [
  'Aviação Agrícola de Precisão',
  'Calibração de Instrumentos Aeronáuticos',
  'Testes STOL Certificados',
  'Inspeções Técnicas Completas',
  'Consultoria Aeronáutica',
  'Operações de Pulverização Aérea',
  'Monitoramento Aéreo por Drones',
  'Transporte Aéreo Executivo',
];

const TIMELINE = [
  { year: '2005', title: 'Fundação',        desc: 'Criada por pilotos e engenheiros apaixonados por aviação no Paraná.' },
  { year: '2009', title: 'Homologação ANAC', desc: 'Obtemos as primeiras certificações junto à Agência Nacional de Aviação Civil.' },
  { year: '2014', title: 'Expansão Regional', desc: 'Ampliamos operações para MS, MT e GO, atendendo grandes produtores rurais.' },
  { year: '2019', title: 'Modernização da Frota', desc: 'Investimento de R$ 15M em aeronaves de última geração com GPS de alta precisão.' },
  { year: '2023', title: 'Drones Agrícolas',  desc: 'Incorporamos drones de alta capacidade à nossa frota operacional.' },
];

export default function Sobre() {
  const { content } = useContent();
  const { companyDescription } = content.published.home;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Nossa História</p>
        <h1 className="page-hero__title">Sobre a AeroTech Brasil</h1>
        <p className="page-hero__subtitle">
          Quase duas décadas de excelência em serviços aeronáuticos e aviação agrícola.
        </p>
      </div>

      {/* Main content */}
      <section className="section">
        <div className="container">
          <div className="sobre__grid">
            <div className="sobre__text">
              {companyDescription.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="sobre__sidebar">
              <div className="sobre__especialidades">
                <h3>Nossas Especialidades</h3>
                {ESPECIALIDADES.map((e) => (
                  <div key={e} className="sobre__esp-item">
                    <div className="sobre__esp-dot" />
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sobre__timeline-section">
        <div className="container">
          <p className="section-label">Nossa Jornada</p>
          <h2 className="section-title">Uma história de crescimento</h2>
          <div className="section-divider" />
          <div className="sobre__timeline">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`sobre__timeline-item ${i % 2 === 0 ? '' : 'sobre__timeline-item--right'}`}>
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

      <Footer />
    </div>
  );
}