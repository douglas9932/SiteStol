import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { CarouselImage, Product, Category } from '@/context/ContentContext';
import './AdminHome.css';

type Tab = 'home' | 'produtos' | 'categorias';

/* ─── Toast ── */
function Toast({ msg }: { msg: string }) {
  return <div className="toast">{msg}</div>;
}

/* ─── Modal de confirmação ── */
function PublishModal({ page, onConfirm, onCancel }: { page: string; onConfirm: () => void; onCancel: () => void }) {
  const PAGE_LABEL: Record<string, string> = {
    home:     'Home (carrossel + descrição)',
    produtos: 'Produtos (cards + cabeçalho)',
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__icon">🚀</div>
        <h2 className="modal__title">Publicar alterações?</h2>
        <p className="modal__desc">O conteúdo de <strong>{PAGE_LABEL[page] ?? page}</strong> será imediatamente visível para todos os visitantes.</p>
        <p className="modal__desc modal__desc--sub">Esta ação substitui o conteúdo publicado atual.</p>
        <div className="modal__actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" onClick={onConfirm}>✅ Confirmar Publicação</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Image Card ── */
function ImageCard({ img, onRemove, onAltChange }: { img: CarouselImage; onRemove: (id: number) => void; onAltChange: (id: number, alt: string) => void }) {
  return (
    <div className="admin-img-card">
      <div className="admin-img-card__thumb">
        <img src={img.url} alt={img.alt} />
        <button className="admin-img-card__remove" onClick={() => onRemove(img.id)}>✕</button>
      </div>
      <input className="form-input admin-img-card__alt" placeholder="Texto alternativo..." value={img.alt} onChange={(e) => onAltChange(img.id, e.target.value)} />
    </div>
  );
}

/* ─── Multi-Category Selector (chips) ── */
function CategorySelector({ selected, categories, onChange }: { selected: number[]; categories: Category[]; onChange: (ids: number[]) => void; }) {
  if (categories.length === 0) {
    return <p className="cat-selector__empty">Nenhuma categoria cadastrada. Crie na aba <strong style={{ color: 'var(--gold)' }}>Categorias</strong>.</p>;
  }
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  return (
    <div className="cat-selector">
      {categories.map((cat) => {
        const active = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            className={`cat-selector__chip ${active ? 'cat-selector__chip--active' : ''}`}
            style={active ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.color, color: cat.color }}
            onClick={() => toggle(cat.id)}
          >
            {active ? '✓ ' : ''}{cat.name}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Product Row ── */
function ProductRow({ product, categories, onChange, onCategoriesChange, onRemove }: {
  product: Product;
  categories: Category[];
  onChange: (id: number, field: keyof Product, value: string) => void;
  onCategoriesChange: (id: number, ids: number[]) => void;
  onRemove: (id: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(product.id, 'image', ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="admin-product-row">
      {/* Header: ícone, título, tag, remover */}
      <div className="admin-product-row__top">
        <input className="form-input admin-product-row__icon" placeholder="🔧" value={product.icon} onChange={(e) => onChange(product.id, 'icon', e.target.value)} maxLength={4} />
        <input className="form-input admin-product-row__title" placeholder="Título..." value={product.title} onChange={(e) => onChange(product.id, 'title', e.target.value)} />
        <input className="form-input admin-product-row__tag" placeholder="Tag (ex: Principal)" value={product.tag ?? ''} onChange={(e) => onChange(product.id, 'tag', e.target.value)} />
        <button className="btn btn-danger admin-product-row__del" onClick={() => onRemove(product.id)}>✕</button>
      </div>

      {/* Corpo: imagem + descrição lado a lado */}
      <div className="admin-product-row__body">

        {/* Coluna da imagem */}
        <div className="admin-product-row__img-col">
          <span className="admin-product-row__cats-label">Foto do Produto</span>
          <div className="admin-product-row__img-preview">
            {product.image
              ? <img src={product.image} alt={product.title} />
              : <span>{product.icon || '📦'}</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
          <button className="btn admin__upload-btn" style={{ fontSize: '11px', padding: '6px 10px' }} onClick={() => fileRef.current?.click()}>
            📁 Carregar foto
          </button>
          {product.image && (
            <button className="btn btn-danger" style={{ fontSize: '11px', padding: '5px 10px', marginTop: 4 }} onClick={() => onChange(product.id, 'image', '')}>
              🗑 Remover
            </button>
          )}
          <input
            className="form-input"
            style={{ fontSize: '11px', marginTop: 6 }}
            placeholder="Ou cole URL da imagem..."
            value={product.image?.startsWith('data:') ? '' : (product.image ?? '')}
            onChange={(e) => onChange(product.id, 'image', e.target.value)}
          />
        </div>

        {/* Coluna da descrição */}
        <div className="admin-product-row__desc-col">
          <span className="admin-product-row__cats-label">Descrição</span>
          <textarea className="form-textarea admin-product-row__desc" placeholder="Descrição do produto..." value={product.description} onChange={(e) => onChange(product.id, 'description', e.target.value)} rows={5} />
          <div className="admin-product-row__cats" style={{ marginTop: 12 }}>
            <span className="admin-product-row__cats-label">Categorias:</span>
            <CategorySelector selected={product.categoryIds ?? []} categories={categories} onChange={(ids) => onCategoriesChange(product.id, ids)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Category Manager ── */
const PRESET_COLORS = ['#16a34a','#2563eb','#9333ea','#ea580c','#dc2626','#0891b2','#ca8a04','#be185d','#475569','#0a1628'];

function CategoryManager({ categories, onAdd, onUpdate, onRemove, showToast }: {
  categories: Category[];
  onAdd: (name: string, color: string) => void;
  onUpdate: (id: number, name: string, color: string) => void;
  onRemove: (id: number) => void;
  showToast: (msg: string) => void;
}) {
  const [newName,   setNewName]   = useState('');
  const [newColor,  setNewColor]  = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName,  setEditName]  = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName, newColor);
    setNewName(''); setNewColor(PRESET_COLORS[0]);
    showToast('✅ Categoria criada!');
  };

  const startEdit = (cat: Category) => { setEditingId(cat.id); setEditName(cat.name); setEditColor(cat.color); };
  const saveEdit  = () => {
    if (!editName.trim() || editingId === null) return;
    onUpdate(editingId, editName, editColor);
    setEditingId(null);
    showToast('✅ Categoria atualizada!');
  };

  return (
    <div className="cat-manager">
      {/* ── Nova categoria ── */}
      <div className="admin__section">
        <h2 className="admin__section-title">➕ Nova Categoria</h2>
        <div className="cat-manager__add-row">
          <input
            className="form-input"
            placeholder="Nome da categoria (ex: Aviação Agrícola)..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="cat-manager__color-pick">
            <span className="form-label" style={{ marginBottom: 0 }}>Cor:</span>
            <div className="cat-manager__presets">
              {PRESET_COLORS.map((c) => (
                <button key={c} type="button"
                  className={`cat-manager__preset-dot ${newColor === c ? 'cat-manager__preset-dot--active' : ''}`}
                  style={{ background: c }} onClick={() => setNewColor(c)} />
              ))}
            </div>
            <input type="color" className="cat-manager__color-input" value={newColor} onChange={(e) => setNewColor(e.target.value)} title="Cor personalizada" />
          </div>
          <div className="cat-manager__preview-chip" style={{ background: newColor }}>
            {newName || 'Prévia'}
          </div>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!newName.trim()}>+ Criar</button>
        </div>
      </div>

      {/* ── Lista de categorias ── */}
      <div className="admin__section">
        <div className="admin__section-header">
          <div>
            <h2 className="admin__section-title">🏷 Categorias Cadastradas</h2>
            <p className="admin__section-desc">Edite nome e cor, ou remova. Ao remover, produtos são desvinculados automaticamente.</p>
          </div>
          <span className="admin__count">{categories.length} categoria{categories.length !== 1 ? 's' : ''}</span>
        </div>

        {categories.length === 0 ? (
          <div className="admin__empty"><span>🏷</span><p>Nenhuma categoria. Crie a primeira acima!</p></div>
        ) : (
          <div className="cat-manager__list">
            {categories.map((cat) => (
              <div key={cat.id} className="cat-manager__row">
                {editingId === cat.id ? (
                  <div className="cat-manager__edit">
                    <input className="form-input cat-manager__edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} autoFocus />
                    <div className="cat-manager__presets">
                      {PRESET_COLORS.map((c) => (
                        <button key={c} type="button"
                          className={`cat-manager__preset-dot ${editColor === c ? 'cat-manager__preset-dot--active' : ''}`}
                          style={{ background: c }} onClick={() => setEditColor(c)} />
                      ))}
                    </div>
                    <input type="color" className="cat-manager__color-input" value={editColor} onChange={(e) => setEditColor(e.target.value)} />
                    <button className="btn btn-primary" onClick={saveEdit}>✓ Salvar</button>
                    <button className="btn btn-outline" onClick={() => setEditingId(null)}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <div className="cat-manager__chip" style={{ background: cat.color }}>{cat.name}</div>
                    <div className="cat-manager__row-actions">
                      <button className="btn cat-manager__btn-edit" onClick={() => startEdit(cat)}>✏ Editar</button>
                      <button className="btn btn-danger" onClick={() => { onRemove(cat.id); showToast('🗑 Categoria removida.'); }}>🗑 Remover</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────────────────────────────────────── */
export default function AdminHome() {
  const [searchParams] = useSearchParams();
  const { content, updateDraft, publishDirect, discardDraft, addCategory, updateCategory, removeCategory } = useContent();

  const [homeImages,   setHomeImages]   = useState<CarouselImage[]>(structuredClone(content.draft.home.carouselImages));
  const [homeText,     setHomeText]     = useState(content.draft.home.companyDescription);
  const [products,     setProducts]     = useState<Product[]>(structuredClone(content.draft.products.products));
  const [prodHeadline, setProdHeadline] = useState(content.draft.products.headline);
  const [prodSubline,  setProdSubline]  = useState(content.draft.products.subheadline);
  const [newImageUrl,  setNewImageUrl]  = useState('');
  const [toast,        setToast]        = useState('');
  const [showModal,    setShowModal]    = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const t = searchParams.get('tab') as Tab | null;
    return (t === 'produtos' || t === 'categorias') ? t : 'home';
  });

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t === 'home' || t === 'produtos' || t === 'categorias') setActiveTab(t);
  }, [searchParams]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }, []);

  const isDirty = (() => {
    if (activeTab === 'home') {
      const pub = content.published.home;
      return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages) || homeText !== pub.companyDescription;
    }
    if (activeTab === 'produtos') {
      const pub = content.published.products;
      return JSON.stringify(products) !== JSON.stringify(pub.products) || prodHeadline !== pub.headline || prodSubline !== pub.subheadline;
    }
    return false;
  })();

  const handlePreview = () => {
    if (activeTab === 'home') updateDraft('home', { carouselImages: homeImages, companyDescription: homeText });
    else if (activeTab === 'produtos') updateDraft('products', { products, headline: prodHeadline, subheadline: prodSubline });
    const page = activeTab === 'categorias' ? 'produtos' : activeTab;
    window.open(`/preview?page=${page}`, '_blank');
  };

  const confirmPublish = () => {
    setShowModal(false);
    if (activeTab === 'home') publishDirect('home', { carouselImages: homeImages, companyDescription: homeText });
    else if (activeTab === 'produtos') publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
    showToast('✅ Publicado! O site já exibe o novo conteúdo.');
  };

  const handleDiscard = () => {
    if (activeTab === 'home') {
      const pub = content.published.home;
      setHomeImages(structuredClone(pub.carouselImages));
      setHomeText(pub.companyDescription);
      discardDraft('home');
    } else if (activeTab === 'produtos') {
      const pub = content.published.products;
      setProducts(structuredClone(pub.products));
      setProdHeadline(pub.headline);
      setProdSubline(pub.subheadline);
      discardDraft('products');
    }
    showToast('↩ Alterações descartadas.');
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setHomeImages((prev) => [...prev, { id: Date.now() + Math.random(), url, alt: file.name.replace(/\.[^.]+$/, '') }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // reset input
    showToast(`🖼 ${files.length} imagem${files.length > 1 ? 'ns' : ''} adicionada${files.length > 1 ? 's' : ''}!`);
  };

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setHomeImages((prev) => [...prev, { id: Date.now(), url, alt: 'Imagem do carrossel' }]);
    setNewImageUrl('');
    showToast('🖼 Imagem adicionada.');
  };

  const removeImage = (id: number) => setHomeImages((prev) => prev.filter((img) => img.id !== id));
  const updateAlt   = (id: number, alt: string) => setHomeImages((prev) => prev.map((img) => img.id === id ? { ...img, alt } : img));

  const addProduct    = () => setProducts((prev) => [...prev, { id: Date.now(), icon: '⭐', title: 'Novo Produto', description: 'Descrição...', categoryIds: [] }]);
  const updateProduct = (id: number, field: keyof Product, value: string) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  const updateProductCategories = (id: number, categoryIds: number[]) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, categoryIds } : p));
  const removeProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const showPublishBtn = activeTab !== 'categorias';

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'home',       label: 'Home',       icon: '🏠' },
    { key: 'categorias', label: 'Categorias', icon: '🏷' },
    { key: 'produtos',   label: 'Produtos',   icon: '📦' },
  ];

  return (
    <div className="admin">
      {showModal && <PublishModal page={activeTab} onConfirm={confirmPublish} onCancel={() => setShowModal(false)} />}

      {/* ── Layout: sidebar + content ── */}
      <div className="admin__layout">

        {/* ── Sidebar ── */}
        <aside className="admin__sidebar">

          {/* Logo panel */}
          <div className="admin__sidebar-brand">
            <div className="admin__logo">AT</div>
            <div>
              <p className="admin__title">AeroTech Brasil</p>
              <p className="admin__subtitle">Painel de Administração</p>
            </div>
          </div>

          <nav className="admin__sidebar-nav">
            <p className="admin__sidebar-section-label">Conteúdo</p>
            {TABS.map(({ key, label, icon }) => {
              const hasDot = key !== 'categorias' && key !== activeTab && (() => {
                const pub = key === 'home' ? content.published.home : content.published.products;
                const local = key === 'home'
                  ? { carouselImages: homeImages, companyDescription: homeText }
                  : { products, headline: prodHeadline, subheadline: prodSubline };
                return JSON.stringify(local) !== JSON.stringify(pub);
              })();
              return (
                <button
                  key={key}
                  className={`admin__sidebar-item ${activeTab === key ? 'admin__sidebar-item--active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <span className="admin__sidebar-item-icon">{icon}</span>
                  <span className="admin__sidebar-item-label">{label}</span>
                  {hasDot && <span className="admin__sidebar-dot" />}
                </button>
              );
            })}
          </nav>

          <div className="admin__sidebar-footer">
            <a href="/" className="admin__sidebar-site-link" target="_blank" rel="noreferrer">
              🌐 Ver site publicado
            </a>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="admin__content">

          {/* Barra de ações — alinhada à esquerda, no topo da área de conteúdo */}
          <div className="admin__actionbar">
            {activeTab === 'categorias' ? (
              <span className="admin__cat-notice">✓ Categorias salvas automaticamente</span>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={handleDiscard} disabled={!isDirty}>
                  ↩ Descartar
                </button>
                <button className="btn btn-outline-gold" onClick={handlePreview}>
                  👁 Preview
                </button>
                <button
                  className={`btn btn-primary ${isDirty ? 'btn-primary--pulse' : ''}`}
                  onClick={() => setShowModal(true)}
                >
                  🚀 Publicar
                </button>
              </>
            )}
          </div>

          {isDirty && (
            <div className="admin__dirty-bar">
              ✏️ Alterações não publicadas — clique em <strong>Publicar</strong> para torná-las visíveis.
            </div>
          )}

          <div className="admin__scroll">
          <main className="admin__body">

            {/* ═══ HOME ═══ */}
            {activeTab === 'home' && (
              <>
                <div className="admin__section">
                  <div className="admin__section-header">
                    <div>
                      <h2 className="admin__section-title">🖼 Imagens do Carrossel</h2>
                      <p className="admin__section-desc">Adicione imagens pela URL. Recomendado: 1400×800px.</p>
                    </div>
                    <span className="admin__count">{homeImages.length} imagem{homeImages.length !== 1 ? 'ns' : ''}</span>
                  </div>
                  {homeImages.length > 0 ? (
                    <div className="admin__img-grid">
                      {homeImages.map((img) => <ImageCard key={img.id} img={img} onRemove={removeImage} onAltChange={updateAlt} />)}
                    </div>
                  ) : (
                    <div className="admin__empty"><span>📷</span><p>Nenhuma imagem adicionada.</p></div>
                  )}
                  <div className="admin__add-url">
                    <input className="form-input" type="url" placeholder="Cole a URL da imagem aqui..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addImage()} />
                    <button className="btn btn-primary" onClick={addImage}>+ URL</button>
                  </div>

                  <div className="admin__upload-divider"><span>ou</span></div>

                  <div className="admin__upload-file">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <button className="btn admin__upload-btn" onClick={() => fileInputRef.current?.click()}>
                      📁 Escolher do computador / celular
                    </button>
                    <p className="admin__hint" style={{ margin: 0 }}>Aceita JPG, PNG, WebP. Múltiplos arquivos permitidos.</p>
                  </div>
                  <p className="admin__hint">💡 Use <strong>unsplash.com</strong> para imagens gratuitas por URL.</p>
                </div>

                <div className="admin__section">
                  <div className="admin__section-header">
                    <div>
                      <h2 className="admin__section-title">📝 Descrição da Empresa</h2>
                      <p className="admin__section-desc">Texto da seção "Sobre" na Home.</p>
                    </div>
                    <span className="admin__count">{homeText.length} chars</span>
                  </div>
                  <textarea className="form-textarea" value={homeText} onChange={(e) => setHomeText(e.target.value)} rows={10} placeholder="Digite a descrição..." />
                </div>
              </>
            )}

            {/* ═══ PRODUTOS ═══ */}
            {activeTab === 'produtos' && (
              <>
                <div className="admin__section">
                  <h2 className="admin__section-title">📌 Cabeçalho da Página</h2>
                  <div className="admin__field">
                    <label className="form-label">Título principal</label>
                    <input className="form-input" value={prodHeadline} onChange={(e) => setProdHeadline(e.target.value)} />
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Subtítulo</label>
                    <input className="form-input" value={prodSubline} onChange={(e) => setProdSubline(e.target.value)} />
                  </div>
                </div>

                <div className="admin__section">
                  <div className="admin__section-header">
                    <div>
                      <h2 className="admin__section-title">📦 Lista de Produtos / Serviços</h2>
                      <p className="admin__section-desc">Vincule categorias clicando nos chips coloridos.</p>
                    </div>
                    <button className="btn btn-primary" onClick={addProduct}>+ Novo Produto</button>
                  </div>
                  {products.length > 0 ? (
                    <div className="admin__products-list">
                      {products.map((p) => (
                        <ProductRow key={p.id} product={p} categories={content.categories}
                          onChange={updateProduct} onCategoriesChange={updateProductCategories} onRemove={removeProduct} />
                      ))}
                    </div>
                  ) : (
                    <div className="admin__empty"><span>📦</span><p>Nenhum produto. Clique em "+ Novo Produto".</p></div>
                  )}
                </div>
              </>
            )}

            {/* ═══ CATEGORIAS ═══ */}
            {activeTab === 'categorias' && (
              <CategoryManager
                categories={content.categories}
                onAdd={addCategory}
                onUpdate={updateCategory}
                onRemove={removeCategory}
                showToast={showToast}
              />
            )}

          </main>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
}