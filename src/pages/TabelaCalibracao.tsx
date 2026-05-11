import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getCalibrationTables, CalibrationTable } from '@/lib/contentService';
import './TabelaCalibracao.css';

export default function TabelaCalibracao() {
  const [tables,  setTables]  = useState<CalibrationTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalibrationTables()
      .then(data => setTables(data.filter(t => t.active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Técnico</p>
        <h1 className="page-hero__title">Tabela de Calibração</h1>
        <p className="page-hero__subtitle">Referências técnicas para calibração de instrumentos aeronáuticos.</p>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>Carregando...</div>
          ) : tables.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
              <p style={{ fontSize:40 }}>📊</p>
              <p>Nenhuma tabela de calibração disponível no momento.</p>
            </div>
          ) : (
            <div className="calib__list">
              {tables.map((t) => (
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
                            {t.columns.map((col, ci) => (
                              <th key={ci}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {t.rows.map((row, ri) => (
                            <tr key={ri}>
                              {t.columns.map((_, ci) => (
                                <td key={ci}>{row[ci] ?? ''}</td>
                              ))}
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