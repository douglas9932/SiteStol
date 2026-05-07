import { useState, useRef, useEffect } from 'react';
import { Product, Category } from '@/context/ContentContext';
import Footer from '@/components/Footer';
import './Produtos.css';

/* ── Página full-screen do produto ── */
function ProductPage({ product, onClose }: { product: Product; onClose: () => void }) {
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images ?? []),
  ];
  const [activeIdx, setActiveIdx] = useState(0);

  // Bloqueia scroll do body enquanto aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prev = () => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % allImages.length);

  return (
    <div className="prod-page">
      {/* Header */}
      <div className="prod-page__header">
        <button className="prod-page__back" onClick={onClose}>
          ← Voltar aos Produtos
        </button>
        <nav className="prod-page__breadcrumb">
          <span onClick={onClose} style={{ cursor: 'pointer' }}>Produtos</span>
          <span className="prod-page__breadcrumb-sep">›</span>
          <span className="prod-page__breadcrumb-cur">{product.title}</span>
        </nav>
      </div>

      {/* Body */}
      <div className="prod-page__body">

        {/* ── Galeria ── */}
        <div className="prod-page__gallery">
          <div className="prod-page__main-img">
            {allImages.length > 1 && (
              <button className="prod-page__arrow prod-page__arrow--prev" onClick={prev}>‹</button>
            )}
            {allImages.length > 0
              ? <img src={allImages[activeIdx]} alt={product.title} />
              : <div className="produto-card__img-placeholder" style={{ fontSize: '5rem' }}>{product.icon || '📦'}</div>
            }
            {allImages.length > 1 && (
              <button className="prod-page__arrow prod-page__arrow--next" onClick={next}>›</button>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="prod-page__thumbs">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`prod-page__thumb ${i === activeIdx ? 'prod-page__thumb--active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="prod-page__info">
          {product.tag && (
            <span className="prod-page__tag">{product.tag}</span>
          )}
          <h1 className="prod-page__title">{product.title}</h1>
          <div className="prod-page__divider" />
          <p className="prod-page__desc">{product.description}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

interface Props {
  headline: string;
  subheadline: string;
  products: Product[];
  categories: Category[];
}

export default function ProdutosLayout({ headline, subheadline, products, categories }: Props) {
  const [search,         setSearch]         = useState('');
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [modalProduct,   setModalProduct]   = useState<Product | null>(null);
  const [page,           setPage]           = useState(1);

  const ITEMS_PER_PAGE = 16; // 4 colunas × 4 linhas

  const toggleCat = (id: number) => {
    setPage(1);
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const clearFilters = () => { setSearch(''); setSelectedCatIds([]); setPage(1); };

  const filtered = products.filter((p) => {
    if (p.active === false) return false; // oculta inativos no site
    const matchName = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat  = selectedCatIds.length === 0
      || selectedCatIds.every((cid) => p.categoryIds?.includes(cid));
    return matchName && matchCat;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const gridRef = useRef<HTMLDivElement>(null);

  const goToPage = (n: number) => {
    setPage(n);
    setTimeout(() => {
      if (gridRef.current) {
        const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 0);
  };

  const hasFilter = search !== '' || selectedCatIds.length > 0;

  return (
    <>
      {modalProduct && <ProductPage product={modalProduct} onClose={() => setModalProduct(null)} />}
      {/* Hero */}
      <div className="page-hero">
        <p className="page-hero__label">Nossos Serviços</p>
        <h1 className="page-hero__title">{headline}</h1>
        <p className="page-hero__subtitle">{subheadline}</p>
      </div>

      <section className="section" style={{ padding: 0 }}>
        <div className="produtos__layout">

          {/* ── Sidebar de filtros ── */}
          <aside className="produtos__filters">
            <div className="produtos__filters-header">
              <h3 className="produtos__filters-title">🔍 Filtros</h3>
              {hasFilter && (
                <button className="produtos__filters-clear" onClick={clearFilters}>Limpar</button>
              )}
            </div>

            <div className="produtos__filter-group">
              <label className="produtos__filter-label">Nome</label>
              <input
                className="form-input"
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {categories.length > 0 && (
              <div className="produtos__filter-group">
                <label className="produtos__filter-label">Categorias</label>
                <div className="produtos__filter-cats">
                  {categories.map((cat) => {
                    const active = selectedCatIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        className={`produtos__filter-chip ${active ? 'produtos__filter-chip--active' : ''}`}
                        style={active
                          ? { background: cat.color, borderColor: cat.color }
                          : { borderColor: cat.color, color: cat.color }}
                        onClick={() => toggleCat(cat.id)}
                      >
                        {active ? '✓ ' : ''}{cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="produtos__filter-count">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` · pág. ${safePage}/${totalPages}`}
            </p>
          </aside>

          {/* ── Grid de produtos ── */}
          <div className="produtos__grid-wrap" ref={gridRef}>
            {filtered.length > 0 ? (
              <div className="produtos__grid">
                {paginated.map((p) => (
                  <div key={p.id} className="produto-card">
                    {p.tag && <span className="produto-card__tag">{p.tag}</span>}

                    <div className="produto-card__img-wrap">
                      {p.image
                        ? <img src={p.image} alt={p.title} className="produto-card__img" />
                        : <div className="produto-card__img-placeholder">{p.icon || '📦'}</div>
                      }
                    </div>

                    <div className="produto-card__body">
                      <h3 className="produto-card__title">{p.title}</h3>
                      <p className="produto-card__desc">
                        {p.description.length > 80
                          ? p.description.slice(0, 80).trimEnd() + '…'
                          : p.description}
                      </p>
                      <button className="produto-card__saiba-mais" onClick={() => setModalProduct(p)}>Saiba mais</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="produtos__empty">
                <span>🔎</span>
                <p>Nenhum produto encontrado.</p>
                <button className="btn btn-outline" onClick={clearFilters}>Limpar filtros</button>
              </div>
            )}

            {/* ── Paginação ── */}
            {totalPages > 1 && (
              <div className="produtos__pagination">
                <button
                  className="produtos__page-btn"
                  disabled={safePage === 1}
                  onClick={() => goToPage(safePage - 1)}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`produtos__page-btn ${n === safePage ? 'produtos__page-btn--active' : ''}`}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ))}

                <button
                  className="produtos__page-btn"
                  disabled={safePage === totalPages}
                  onClick={() => goToPage(safePage + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}