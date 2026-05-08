import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { ProductAccordionItem, DemoImage } from '@/context/ContentContext';
import Footer from '@/components/Footer';
import './ProdutoDetalhe.css';

/* ── Accordion ── */
function AccordionSection({ label, items }: { label: string; items: ProductAccordionItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="detalhe-accordion">
      <button className="detalhe-accordion__trigger" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <span className={`detalhe-accordion__chevron ${open ? 'detalhe-accordion__chevron--open' : ''}`}>›</span>
      </button>
      {open && (
        <div className="detalhe-accordion__body">
          {items.map((item, i) => (
            <div key={i} className="detalhe-accordion__item">
              {item.label && <strong className="detalhe-accordion__label">{item.label}</strong>}
              <p className="detalhe-accordion__content">{item.content}</p>
            </div>
          ))}
        </div>
      )}
      <div className="detalhe-accordion__line" />
    </div>
  );
}

export default function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content } = useContent();

  const product = (content.published.products?.products ?? []).find(
    (p) => String(p.id) === id
  );

  const allImages = product
    ? [...(product.image ? [product.image] : []), ...(product.images ?? [])]
    : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox,  setLightbox]  = useState<string | null>(null);

  if (!product) {
    return (
      <div className="page-wrapper detalhe-not-found">
        <p>📦</p>
        <p>Produto não encontrado.</p>
        <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
          ← Voltar aos Produtos
        </button>
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % allImages.length);

  const accordions = [
    { label: 'Especificações:', items: product.specifications ?? [] },
    { label: 'Informações:',    items: product.info ?? [] },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="detalhe__breadcrumb-bar">
        <div className="container detalhe__breadcrumb-inner">
          <span className="detalhe__breadcrumb-link" onClick={() => navigate('/produtos')}>
            Produtos
          </span>
          <span className="detalhe__breadcrumb-sep">›</span>
          <span className="detalhe__breadcrumb-cur">{product.title}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <section className="section">
        <div className="container">
          <div className="detalhe__grid">

            {/* Galeria */}
            <div className="detalhe__gallery">
              <div className="detalhe__main-img" onClick={() => allImages.length > 0 && setLightbox(allImages[activeIdx])} style={{ cursor: allImages.length > 0 ? 'zoom-in' : 'default' }}>
                {allImages.length > 1 && (
                  <button className="detalhe__arrow detalhe__arrow--prev" onClick={prev}>‹</button>
                )}
                {allImages.length > 0
                  ? <img src={allImages[activeIdx]} alt={product.title} />
                  : <div className="detalhe__placeholder">{product.icon || '📦'}</div>
                }
                {allImages.length > 1 && (
                  <button className="detalhe__arrow detalhe__arrow--next" onClick={next}>›</button>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="detalhe__thumbs">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      className={`detalhe__thumb ${i === activeIdx ? 'detalhe__thumb--active' : ''}`}
                      onClick={() => setActiveIdx(i)}
                    >
                      <img src={img} alt={`${product.title} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="detalhe__info">
              {product.tag && <span className="detalhe__tag">{product.tag}</span>}
              <h1 className="detalhe__title">{product.title}</h1>
              <div className="detalhe__divider" />
              <p className="detalhe__desc">{product.description}</p>

              {accordions.map((s) => (
                <AccordionSection key={s.label} label={s.label} items={s.items} />
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* ── Demonstrativo ── */}
      {(product.demoImages ?? []).length > 0 && (
        <section className="section detalhe__demo-section">
          <div className="container">
            <h2 className="detalhe__demo-title">Demonstrativo:</h2>
            <div className="detalhe__demo-track-wrap">
              <button className="detalhe__demo-arrow detalhe__demo-arrow--prev" onClick={() => {
                const el = document.getElementById('demo-track');
                if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
              }}>‹</button>

              <div className="detalhe__demo-track" id="demo-track">
                {(product.demoImages ?? []).map((d, i) => (
                  <div key={i} className="detalhe__demo-item">
                    <div className="detalhe__demo-img" onClick={() => setLightbox(d.url)} style={{ cursor: 'zoom-in' }}>
                      <img src={d.url} alt={d.caption || `Demonstrativo ${i + 1}`} />
                    </div>
                    {d.caption && <p className="detalhe__demo-caption">{d.caption}</p>}
                  </div>
                ))}
              </div>

              <button className="detalhe__demo-arrow detalhe__demo-arrow--next" onClick={() => {
                const el = document.getElementById('demo-track');
                if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
              }}>›</button>
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="detalhe__lightbox" onClick={() => setLightbox(null)}>
          <button className="detalhe__lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="Imagem ampliada" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </div>
  );
}