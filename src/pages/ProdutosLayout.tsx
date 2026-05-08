import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Category, ProductAccordionItem } from '@/context/ContentContext';
import Footer from '@/components/Footer';
import './Produtos.css';

interface Props {
  headline: string;
  subheadline: string;
  products: Product[];
  categories: Category[];
}

export default function ProdutosLayout({ headline, subheadline, products, categories }: Props) {
  const [search,         setSearch]         = useState('');
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
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
  const navigate  = useNavigate();
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
                      <button className="produto-card__saiba-mais" onClick={() => navigate('/produtos/' + p.id)}>Saiba mais</button>
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