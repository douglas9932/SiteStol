import Footer from '@/components/Footer';
import './TestesStol.css';

const TESTES = [
  { num: '01', titulo: 'Decolagem Pista Seca',   aeronave: 'PP-ATB — Ipanema 202A', data: '12/04/2025', distDec: '280m', distPou: '195m', velRot: '87 km/h', resultado: 'Aprovado'    },
  { num: '02', titulo: 'Pouso Chuva Leve',        aeronave: 'PP-ATC — Ipanema 202B', data: '15/04/2025', distDec: '310m', distPou: '220m', velRot: '90 km/h', resultado: 'Aprovado'    },
  { num: '03', titulo: 'Pista Gramada Úmida',     aeronave: 'PP-ATD — Cessna C172',  data: '20/04/2025', distDec: '350m', distPou: '260m', velRot: '95 km/h', resultado: 'Condicional' },
  { num: '04', titulo: 'Alta Altitude (1.200m)', aeronave: 'PP-ATF — Ipanema 201A', data: '02/05/2025', distDec: '295m', distPou: '210m', velRot: '89 km/h', resultado: 'Aprovado'    },
];

export default function TestesStol() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Certificação Operacional</p>
        <h1 className="page-hero__title">Testes STOL</h1>
        <p className="page-hero__subtitle">
          Short Take-Off and Landing — avaliação certificada pela ANAC de desempenho em pista curta.
        </p>
      </div>

      <section className="section">
        <div className="container">
          <p className="stol__intro">
            Os Testes STOL (Short Take-Off and Landing) são procedimentos certificados que avaliam a capacidade de decolagem e pouso das aeronaves em distâncias reduzidas. Todos os testes são documentados e registrados junto à ANAC, garantindo rastreabilidade e conformidade regulatória.
          </p>

          <div className="stol__grid">
            {TESTES.map((t) => (
              <div key={t.num} className="stol-card">
                <div className="stol-card__header">
                  <div className="stol-card__num">{t.num}</div>
                  <div>
                    <h3 className="stol-card__title">{t.titulo}</h3>
                    <p className="stol-card__meta">{t.aeronave} · {t.data}</p>
                  </div>
                  <span className={`stol-card__result ${t.resultado === 'Aprovado' ? 'stol-card__result--ok' : 'stol-card__result--warn'}`}>
                    {t.resultado}
                  </span>
                </div>
                <div className="stol-card__metrics">
                  {[
                    ['Dist. Decolagem', t.distDec],
                    ['Dist. Pouso',     t.distPou],
                    ['Vel. Rotação',    t.velRot],
                  ].map(([label, value]) => (
                    <div key={label} className="stol-card__metric">
                      <span className="stol-card__metric-val">{value}</span>
                      <span className="stol-card__metric-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
