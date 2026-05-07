import Footer from '@/components/Footer';
import './TabelaCalibracao.css';

const ROWS = [
  { instrumento: 'Altímetro Principal',  aeronave: 'PP-ATB — Ipanema 202A', ultima: '10/01/2025', proxima: '10/07/2025', status: 'ok',   tecnico: 'Eng. Marcos Silva' },
  { instrumento: 'Velocímetro IAS',      aeronave: 'PP-ATB — Ipanema 202A', ultima: '10/01/2025', proxima: '10/07/2025', status: 'ok',   tecnico: 'Eng. Marcos Silva' },
  { instrumento: 'Transponder Mode-S',   aeronave: 'PP-ATC — Ipanema 202B', ultima: '15/03/2025', proxima: '15/09/2025', status: 'warn', tecnico: 'Téc. Paulo Alves'  },
  { instrumento: 'Altímetro Co-Piloto',  aeronave: 'PP-ATD — Cessna C172',  ultima: '20/11/2024', proxima: '20/05/2025', status: 'err',  tecnico: 'Eng. Marcos Silva' },
  { instrumento: 'Variômetro',           aeronave: 'PP-ATE — Cessna C172',  ultima: '05/02/2025', proxima: '05/08/2025', status: 'ok',   tecnico: 'Téc. Paulo Alves'  },
  { instrumento: 'Bússola Magnética',    aeronave: 'PP-ATD — Cessna C172',  ultima: '20/11/2024', proxima: '20/05/2025', status: 'err',  tecnico: 'Téc. Lima Rocha'   },
  { instrumento: 'Radio Altímetro',      aeronave: 'PP-ATF — Ipanema 201A', ultima: '12/04/2025', proxima: '12/10/2025', status: 'ok',   tecnico: 'Eng. Marcos Silva' },
];

const STATUS_MAP = {
  ok:   { label: 'Calibrado', cls: 'badge-success' },
  warn: { label: 'A Vencer',  cls: 'badge-warning' },
  err:  { label: 'Vencido',   cls: 'badge-danger'  },
};

export default function TabelaCalibracao() {
  const ok   = ROWS.filter((r) => r.status === 'ok').length;
  const warn = ROWS.filter((r) => r.status === 'warn').length;
  const err  = ROWS.filter((r) => r.status === 'err').length;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Documentação Técnica</p>
        <h1 className="page-hero__title">Tabela de Calibração</h1>
        <p className="page-hero__subtitle">Acompanhe o status de calibração de todos os instrumentos aeronáuticos.</p>
      </div>

      <section className="section">
        <div className="container">
          {/* Summary */}
          <div className="cal__summary">
            <div className="cal__summary-card cal__summary-card--ok">
              <span className="cal__summary-num">{ok}</span>
              <span className="cal__summary-label">Calibrados</span>
            </div>
            <div className="cal__summary-card cal__summary-card--warn">
              <span className="cal__summary-num">{warn}</span>
              <span className="cal__summary-label">A Vencer</span>
            </div>
            <div className="cal__summary-card cal__summary-card--err">
              <span className="cal__summary-num">{err}</span>
              <span className="cal__summary-label">Vencidos</span>
            </div>
          </div>

          {/* Table */}
          <div className="cal__table-wrap">
            <table className="cal__table">
              <thead>
                <tr>
                  <th>Instrumento</th>
                  <th>Aeronave</th>
                  <th>Última Calibração</th>
                  <th>Próxima Calibração</th>
                  <th>Status</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => {
                  const s = STATUS_MAP[r.status as keyof typeof STATUS_MAP];
                  return (
                    <tr key={i} className={r.status === 'err' ? 'cal__row--err' : r.status === 'warn' ? 'cal__row--warn' : ''}>
                      <td className="cal__td-bold">{r.instrumento}</td>
                      <td>{r.aeronave}</td>
                      <td>{r.ultima}</td>
                      <td>{r.proxima}</td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td className="cal__td-muted">{r.tecnico}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
