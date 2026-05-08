import Footer from '@/components/Footer';
import { useContent } from '@/hooks/useContent';
import ProdutosLayout from './ProdutosLayout';
import './Produtos.css';

export default function Produtos() {
  const { content } = useContent();
  const { headline = '', subheadline = '', products = [] } = content.published.products ?? {};
  const categories = content.categories ?? [];

  return (
    <div className="page-wrapper">
      <ProdutosLayout
        headline={headline}
        subheadline={subheadline}
        products={products}
        categories={categories}
      />

      {/* Diferenciais */}
      <section className="produtos__diff">
        <div className="container">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Por que a AeroTech</p>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>Tecnologia e experiência juntas</h2>
          <div className="section-divider" />
          <div className="produtos__diff-grid">
            {[
              ['Frota Moderna',      'Aeronaves atualizadas com os últimos avanços tecnológicos do setor.'],
              ['Equipe Certificada', 'Pilotos e técnicos com certificações nacionais e internacionais.'],
              ['Suporte 24/7',       'Atendimento dedicado a qualquer hora para emergências operacionais.'],
              ['Relatórios Online',  'Acesso a todos os relatórios técnicos diretamente pela plataforma.'],
            ].map(([t, d]) => (
              <div key={t} className="produtos__diff-item">
                <div className="produtos__diff-dot" />
                <div><h4>{t}</h4><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}