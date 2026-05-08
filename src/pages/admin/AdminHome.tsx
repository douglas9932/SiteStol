import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import { CarouselImage, Product, Category, HomeStat, HomeFeature, SobreTimelineItem, ProductAccordionItem, DemoImage } from '@/context/ContentContext';
import './AdminHome.css';

type Tab = 'home' | 'sobre' | 'produtos' | 'categorias';

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
function ProductRow({ product, categories, onChange, onCategoriesChange, onRemove, onGalleryChange, onSpecsChange, onInfoChange, onDemoImagesChange }: {
  product: Product;
  categories: Category[];
  onChange: (id: number, field: keyof Product, value: string) => void;
  onCategoriesChange: (id: number, ids: number[]) => void;
  onGalleryChange: (id: number, images: string[]) => void;
  onSpecsChange: (id: number, items: ProductAccordionItem[]) => void;
  onInfoChange:  (id: number, items: ProductAccordionItem[]) => void;
  onDemoImagesChange: (id: number, items: DemoImage[]) => void;
  onRemove: (id: number) => void;
}) {
  const fileRef    = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(product.id, 'image', ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const current = product.images ?? [];
    let loaded = 0;
    const results: string[] = [];
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        results[i] = ev.target?.result as string;
        loaded++;
        if (loaded === files.length) onGalleryChange(product.id, [...current, ...results]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeGalleryImg = (idx: number) => {
    onGalleryChange(product.id, (product.images ?? []).filter((_, i) => i !== idx));
  };

  const [galleryUrl, setGalleryUrl] = useState('');

  const addGalleryUrl = (url: string) => {
    if (!url.trim()) return;
    onGalleryChange(product.id, [...(product.images ?? []), url.trim()]);
  };

  const demoRef = useRef<HTMLInputElement>(null);
  const handleDemoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const current = product.demoImages ?? [];
    let loaded = 0;
    const results: DemoImage[] = new Array(files.length);
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        results[i] = { url: ev.target?.result as string, caption: '' };
        loaded++;
        if (loaded === files.length) onDemoImagesChange(product.id, [...current, ...results]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };
  const demoImages = product.demoImages ?? [];
  const updateDemoCaption = (idx: number, caption: string) =>
    onDemoImagesChange(product.id, demoImages.map((d, i) => i === idx ? { ...d, caption } : d));
  const removeDemoImg = (idx: number) =>
    onDemoImagesChange(product.id, demoImages.filter((_, i) => i !== idx));

  // Helpers para accordion items
  const updateAccordion = (
    list: ProductAccordionItem[],
    idx: number,
    field: 'label' | 'content',
    value: string
  ) => list.map((item, i) => i === idx ? { ...item, [field]: value } : item);

  const specs = product.specifications ?? [];
  const info  = product.info ?? [];

  const [activeInnerTab, setActiveInnerTab] = useState<'descricao'|'galeria'|'specs'|'demo'>('descricao');

  return (
    <div className="admin-product-row">

      {/* ── Título + Tag ── */}
      <div className="admin-prod-row__head">
        <input className="form-input" placeholder="Título do produto..." value={product.title} onChange={(e) => onChange(product.id, 'title', e.target.value)} />
        <input className="form-input admin-product-row__tag" placeholder="Tag (ex: Principal)" value={product.tag ?? ''} onChange={(e) => onChange(product.id, 'tag', e.target.value)} />
        <button className="btn btn-danger" style={{ padding: '8px 12px' }} onClick={() => onRemove(product.id)}>✕</button>
      </div>

      {/* ── Duas colunas ── */}
      <div className="admin-prod-row__cols">

        {/* Coluna esquerda — Foto + Categorias */}
        <div className="admin-prod-row__left">
          <span className="admin-product-row__cats-label" style={{ alignSelf: 'flex-start' }}>Foto Principal</span>
          <div className="admin-product-row__img-preview">
            {product.image
              ? <img src={product.image} alt={product.title} />
              : <span>📦</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
          <button className="btn admin__upload-btn" style={{ fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={() => fileRef.current?.click()}>
            📁 Carregar foto
          </button>
          {product.image && (
            <button className="btn btn-danger" style={{ fontSize: '11px', padding: '5px 10px', width: '100%' }} onClick={() => onChange(product.id, 'image', '')}>
              🗑 Remover foto
            </button>
          )}
          <input
            className="form-input"
            style={{ fontSize: '11px' }}
            placeholder="Ou cole URL..."
            value={product.image?.startsWith('data:') ? '' : (product.image ?? '')}
            onChange={(e) => onChange(product.id, 'image', e.target.value)}
          />
          <div style={{ width: '100%', borderTop: '1px solid var(--border-gray)', paddingTop: 12 }}>
            <span className="admin-product-row__cats-label">Categorias</span>
            <div style={{ marginTop: 8 }}>
              <CategorySelector selected={product.categoryIds ?? []} categories={categories} onChange={(ids) => onCategoriesChange(product.id, ids)} />
            </div>
          </div>
        </div>

        {/* Coluna direita — abas */}
        <div className="admin-prod-row__right">
          <div className="admin-prod-tabs">
            {([
              { key: 'descricao', label: '📝 Descrição'       },
              { key: 'galeria',   label: '🖼 Galeria'         },
              { key: 'specs',     label: '📋 Espec./Info.'    },
              { key: 'demo',      label: '📸 Demonstrativo'   },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                className={`admin-prod-tab ${activeInnerTab === key ? 'admin-prod-tab--active' : ''}`}
                onClick={() => setActiveInnerTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="admin-prod-tab-body">

            {/* ── Descrição ── */}
            {activeInnerTab === 'descricao' && (
              <textarea
                className="form-textarea"
                rows={12}
                placeholder="Descrição completa do produto..."
                value={product.description}
                onChange={(e) => onChange(product.id, 'description', e.target.value)}
              />
            )}

            {/* ── Galeria ── */}
            {activeInnerTab === 'galeria' && (
              <>
                {(product.images ?? []).length > 0 && (
                  <div className="admin__img-grid">
                    {(product.images ?? []).map((img, idx) => (
                      <div key={idx} className="admin-img-card">
                        <div className="admin-img-card__thumb">
                          <img src={img} alt={`galeria ${idx + 1}`} />
                          <button className="admin-img-card__remove" onClick={() => onGalleryChange(product.id, (product.images ?? []).filter((_, i) => i !== idx))}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="admin__add-url">
                  <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryFiles} />
                  <button className="btn admin__upload-btn" onClick={() => galleryRef.current?.click()}>📁 Carregar imagens</button>
                  <input className="form-input" style={{ fontSize: '12px', flex: 1 }} placeholder="Ou cole URL e Enter..."
                    value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { addGalleryUrl(galleryUrl); setGalleryUrl(''); } }} />
                  <button className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 14px' }}
                    onClick={() => { addGalleryUrl(galleryUrl); setGalleryUrl(''); }}>+ Add</button>
                </div>
              </>
            )}

            {/* ── Especificações + Informações ── */}
            {activeInnerTab === 'specs' && (
              <>
                <div>
                  <div className="admin-product-row__accordion-header">
                    <span className="admin-product-row__cats-label">📋 Especificações</span>
                    <button className="btn btn-primary" style={{ fontSize: '11px', padding: '5px 12px' }}
                      onClick={() => onSpecsChange(product.id, [...specs, { label: '', content: '' }])}>+ Adicionar</button>
                  </div>
                  {specs.map((item, idx) => (
                    <div key={idx} className="admin-accordion-row">
                      <input className="form-input" placeholder="Rótulo (ex: Material)" value={item.label}
                        onChange={(e) => onSpecsChange(product.id, updateAccordion(specs, idx, 'label', e.target.value))} />
                      <textarea className="form-textarea" rows={1} style={{ minHeight: 38, maxHeight: 80, resize: 'vertical' }} placeholder="Conteúdo..."
                        value={item.content}
                        onChange={(e) => onSpecsChange(product.id, updateAccordion(specs, idx, 'content', e.target.value))} />
                      <button className="btn btn-danger" style={{ padding: '6px 10px', alignSelf: 'flex-start' }}
                        onClick={() => onSpecsChange(product.id, specs.filter((_, i) => i !== idx))}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: 14 }}>
                  <div className="admin-product-row__accordion-header">
                    <span className="admin-product-row__cats-label">ℹ️ Informações</span>
                    <button className="btn btn-primary" style={{ fontSize: '11px', padding: '5px 12px' }}
                      onClick={() => onInfoChange(product.id, [...info, { label: '', content: '' }])}>+ Adicionar</button>
                  </div>
                  {info.map((item, idx) => (
                    <div key={idx} className="admin-accordion-row">
                      <input className="form-input" placeholder="Rótulo (ex: Compatibilidade)" value={item.label}
                        onChange={(e) => onInfoChange(product.id, updateAccordion(info, idx, 'label', e.target.value))} />
                      <textarea className="form-textarea" rows={1} style={{ minHeight: 38, maxHeight: 80, resize: 'vertical' }} placeholder="Conteúdo..."
                        value={item.content}
                        onChange={(e) => onInfoChange(product.id, updateAccordion(info, idx, 'content', e.target.value))} />
                      <button className="btn btn-danger" style={{ padding: '6px 10px', alignSelf: 'flex-start' }}
                        onClick={() => onInfoChange(product.id, info.filter((_, i) => i !== idx))}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Demonstrativo ── */}
            {activeInnerTab === 'demo' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p className="admin__hint" style={{ margin: 0 }}>Descrição é opcional — aparece no site só se preenchida.</p>
                  <input ref={demoRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleDemoFiles} />
                  <button className="btn admin__upload-btn" style={{ fontSize: '12px', padding: '7px 14px', flexShrink: 0 }}
                    onClick={() => demoRef.current?.click()}>📁 Adicionar Imagens</button>
                </div>
                {demoImages.length > 0 ? (
                  <div className="admin-demo-grid">
                    {demoImages.map((d, idx) => (
                      <div key={idx} className="admin-demo-item">
                        <div className="admin-demo-item__img">
                          <img src={d.url} alt={`demo ${idx + 1}`} />
                          <button className="admin-img-card__remove" onClick={() => removeDemoImg(idx)}>✕</button>
                        </div>
                        <input className="form-input" style={{ fontSize: '12px', marginTop: 6 }}
                          placeholder="Descrição (opcional)..."
                          value={d.caption ?? ''}
                          onChange={(e) => updateDemoCaption(idx, e.target.value)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>Nenhuma imagem demonstrativa. Clique em "Adicionar Imagens".</p>
                )}
              </>
            )}

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

  const [homeImages,       setHomeImages]       = useState<CarouselImage[]>(structuredClone(content.draft.home.carouselImages));
  const [homeText,         setHomeText]         = useState(content.draft.home.companyDescription);
  const [carouselTagline,  setCarouselTagline]  = useState(content.draft.home.carouselTagline  ?? '');
  const [carouselTitle,    setCarouselTitle]    = useState(content.draft.home.carouselTitle    ?? '');
  const [carouselSubtitle, setCarouselSubtitle] = useState(content.draft.home.carouselSubtitle ?? '');
  const [sobreTitle,       setSobreTitle]       = useState(content.draft.home.sobreTitle       ?? 'Sobre a AeroTech Brasil');
  const [stats,            setStats]            = useState<HomeStat[]>(structuredClone(content.draft.home.stats ?? []));
  const [featuresTitle,    setFeaturesTitle]    = useState(content.draft.home.featuresTitle    ?? 'Diferenciais que fazem a diferença');
  const [features,         setFeatures]         = useState<HomeFeature[]>(structuredClone(content.draft.home.features ?? []));
  const [products,     setProducts]     = useState<Product[]>(structuredClone(content.draft.products.products));
  const [prodHeadline, setProdHeadline] = useState(content.draft.products.headline);
  const [prodSubline,  setProdSubline]  = useState(content.draft.products.subheadline);
  const [newImageUrl,  setNewImageUrl]  = useState('');
  const [toast,        setToast]        = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodSearch,   setProdSearch]   = useState('');

  // ── Sobre state ──
  const [sobreHeroTitle,    setSobreHeroTitle]    = useState(content.draft.sobre?.heroTitle    ?? 'Sobre a AeroTech Brasil');
  const [sobreHeroSubtitle, setSobreHeroSubtitle] = useState(content.draft.sobre?.heroSubtitle ?? '');
  const [especialidades,    setEspecialidades]    = useState<string[]>(structuredClone(content.draft.sobre?.especialidades ?? []));
  const [timelineTitle,     setTimelineTitle]     = useState(content.draft.sobre?.timelineTitle ?? 'Uma história de crescimento');
  const [timeline,          setTimeline]          = useState<SobreTimelineItem[]>(structuredClone(content.draft.sobre?.timeline ?? []));

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
      return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages)
        || homeText !== pub.companyDescription
        || carouselTagline  !== (pub.carouselTagline  ?? '')
        || carouselTitle    !== (pub.carouselTitle    ?? '')
        || carouselSubtitle !== (pub.carouselSubtitle ?? '')
        || sobreTitle       !== (pub.sobreTitle       ?? '')
        || JSON.stringify(stats)    !== JSON.stringify(pub.stats    ?? [])
        || featuresTitle    !== (pub.featuresTitle    ?? '')
        || JSON.stringify(features) !== JSON.stringify(pub.features ?? []);
    }
    if (activeTab === 'sobre') {
      const pub = content.published.sobre ?? {};
      return sobreHeroTitle    !== ((pub as any).heroTitle    ?? '')
        || sobreHeroSubtitle !== ((pub as any).heroSubtitle ?? '')
        || JSON.stringify(especialidades) !== JSON.stringify((pub as any).especialidades ?? [])
        || timelineTitle    !== ((pub as any).timelineTitle ?? '')
        || JSON.stringify(timeline)       !== JSON.stringify((pub as any).timeline       ?? []);
    }
    if (activeTab === 'produtos') {
      const pub = content.published.products;
      return JSON.stringify(products) !== JSON.stringify(pub.products) || prodHeadline !== pub.headline || prodSubline !== pub.subheadline;
    }
    return false;
  })();

  const sobrePayload = () => ({
    heroTitle: sobreHeroTitle, heroSubtitle: sobreHeroSubtitle,
    especialidades, timelineTitle, timeline,
  });

  const handlePreview = () => {
    if (activeTab === 'home') updateDraft('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
    else if (activeTab === 'sobre') updateDraft('sobre', sobrePayload());
    else if (activeTab === 'produtos') updateDraft('products', { products, headline: prodHeadline, subheadline: prodSubline });
    const page = (activeTab === 'categorias' || activeTab === 'sobre') ? activeTab === 'sobre' ? 'sobre' : 'produtos' : activeTab;
    window.open(`/preview?page=${page}`, '_blank');
  };

  const confirmPublish = () => {
    setShowModal(false);
    if (activeTab === 'home') publishDirect('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
    else if (activeTab === 'sobre') publishDirect('sobre', sobrePayload());
    else if (activeTab === 'produtos') publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
    showToast('✅ Publicado! O site já exibe o novo conteúdo.');
  };

  const handleDiscard = () => {
    if (activeTab === 'home') {
      const pub = content.published.home;
      setHomeImages(structuredClone(pub.carouselImages));
      setHomeText(pub.companyDescription);
      setCarouselTagline(pub.carouselTagline   ?? '');
      setCarouselTitle(pub.carouselTitle       ?? '');
      setCarouselSubtitle(pub.carouselSubtitle ?? '');
      setSobreTitle(pub.sobreTitle             ?? '');
      setStats(structuredClone(pub.stats       ?? []));
      setFeaturesTitle(pub.featuresTitle       ?? '');
      setFeatures(structuredClone(pub.features ?? []));
      discardDraft('home');
    } else if (activeTab === 'sobre') {
      const pub = content.published.sobre ?? {} as any;
      setSobreHeroTitle(pub.heroTitle       ?? '');
      setSobreHeroSubtitle(pub.heroSubtitle ?? '');
      setEspecialidades(structuredClone(pub.especialidades ?? []));
      setTimelineTitle(pub.timelineTitle    ?? '');
      setTimeline(structuredClone(pub.timeline ?? []));
      discardDraft('sobre');
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

  const addProduct    = () => {
    const newId = Date.now();
    setProducts((prev) => [...prev, { id: newId, icon: '⭐', title: 'Novo Produto', description: 'Descrição...', categoryIds: [], images: [], active: true }]);
    setEditingProductId(newId);
  };
  const updateProduct = (id: number, field: keyof Product, value: string) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  const updateProductCategories = (id: number, categoryIds: number[]) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, categoryIds } : p));
  const updateProductGallery    = (id: number, images: string[])       => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, images } : p));
  const updateProductSpecs      = (id: number, specifications: ProductAccordionItem[]) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, specifications } : p));
  const updateProductInfo       = (id: number, info: ProductAccordionItem[])           => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, info } : p));
  const updateProductDemoImages = (id: number, demoImages: DemoImage[])                => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, demoImages } : p));
  const toggleProductActive     = (id: number)                         => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: p.active === false ? true : false } : p));
  const removeProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const showPublishBtn = activeTab !== 'categorias';

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'home',       label: 'Home',       icon: '🏠' },
    { key: 'sobre',      label: 'Sobre',      icon: '📋' },
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
                if (key === 'home') {
                  const pub = content.published.home;
                  return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages)
                    || homeText         !== pub.companyDescription
                    || carouselTagline  !== (pub.carouselTagline  ?? '')
                    || carouselTitle    !== (pub.carouselTitle    ?? '')
                    || carouselSubtitle !== (pub.carouselSubtitle ?? '')
                    || sobreTitle       !== (pub.sobreTitle       ?? '')
                    || JSON.stringify(stats)    !== JSON.stringify(pub.stats    ?? [])
                    || featuresTitle    !== (pub.featuresTitle    ?? '')
                    || JSON.stringify(features) !== JSON.stringify(pub.features ?? []);
                }
                if (key === 'sobre') {
                  const pub = (content.published.sobre ?? {}) as any;
                  return sobreHeroTitle    !== (pub.heroTitle       ?? '')
                    || sobreHeroSubtitle   !== (pub.heroSubtitle    ?? '')
                    || JSON.stringify(especialidades) !== JSON.stringify(pub.especialidades ?? [])
                    || timelineTitle       !== (pub.timelineTitle   ?? '')
                    || JSON.stringify(timeline) !== JSON.stringify(pub.timeline ?? []);
                }
                if (key === 'produtos') {
                  const pub = content.published.products;
                  return JSON.stringify(products) !== JSON.stringify(pub.products)
                    || prodHeadline !== pub.headline
                    || prodSubline  !== pub.subheadline;
                }
                return false;
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

          <div className={`admin__dirty-bar ${isDirty ? 'admin__dirty-bar--visible' : ''}`}>
            ✏️ Alterações não publicadas — clique em <strong>Publicar</strong> para torná-las visíveis.
          </div>

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

                {/* Texto do carrossel */}
                <div className="admin__section">
                  <h2 className="admin__section-title">✍ Texto do Carrossel</h2>
                  <p className="admin__section-desc" style={{ marginBottom: '1.25rem' }}>
                    Deixe em branco para exibir somente as imagens, sem escurecê-las.
                  </p>
                  <div className="admin__field">
                    <label className="form-label">Tagline (linha pequena acima do título)</label>
                    <input className="form-input" placeholder="Ex: Excelência em Aviação" value={carouselTagline} onChange={(e) => setCarouselTagline(e.target.value)} />
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Título principal</label>
                    <input className="form-input" placeholder="Ex: Precisão que eleva seus resultados" value={carouselTitle} onChange={(e) => setCarouselTitle(e.target.value)} />
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Subtítulo</label>
                    <input className="form-input" placeholder="Ex: Soluções aeronáuticas de alta performance..." value={carouselSubtitle} onChange={(e) => setCarouselSubtitle(e.target.value)} />
                  </div>
                </div>

                {/* Seção Sobre — título + descrição juntos */}
                <div className="admin__section">
                  <h2 className="admin__section-title">🏷 Seção "Sobre"</h2>
                  <div className="admin__field">
                    <label className="form-label">Título da Seção</label>
                    <input className="form-input" value={sobreTitle} onChange={(e) => setSobreTitle(e.target.value)} placeholder="Sobre a AeroTech Brasil" />
                  </div>
                  <div className="admin__field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label className="form-label" style={{ margin: 0 }}>Descrição da Empresa</label>
                      <span className="admin__count">{homeText.length} chars</span>
                    </div>
                    <p className="admin__section-desc" style={{ marginBottom: 8 }}>Texto da seção "Sobre" na Home.</p>
                    <textarea className="form-textarea" value={homeText} onChange={(e) => setHomeText(e.target.value)} rows={10} placeholder="Digite a descrição..." />
                  </div>

                  <label className="form-label" style={{ marginTop: '1rem', display: 'block' }}>Cards de Estatísticas</label>
                  <div className="admin-stats-grid">
                    {stats.map((s, i) => (
                      <div key={i} className="admin-stat-row">
                        <input className="form-input admin-stat-row__value" placeholder="18+" value={s.value}
                          onChange={(e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                        <input className="form-input admin-stat-row__label" placeholder="Anos de Experiência" value={s.label}
                          onChange={(e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                        <button className="btn btn-danger" style={{ padding: '8px 12px' }}
                          onClick={() => setStats(prev => prev.filter((_, j) => j !== i))}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '10px', fontSize: '13px' }}
                    onClick={() => setStats(prev => [...prev, { value: '', label: '' }])}>
                    + Adicionar Card
                  </button>
                </div>

                {/* Seção Diferenciais */}
                <div className="admin__section">
                  <h2 className="admin__section-title">⚡ Seção "Diferenciais"</h2>
                  <div className="admin__field">
                    <label className="form-label">Título da Seção</label>
                    <input className="form-input" value={featuresTitle} onChange={(e) => setFeaturesTitle(e.target.value)} placeholder="Diferenciais que fazem a diferença" />
                  </div>

                  <label className="form-label" style={{ marginTop: '1rem', display: 'block' }}>Cards de Diferenciais</label>
                  <div className="admin-features-list">
                    {features.map((f, i) => (
                      <div key={i} className="admin-feature-row">
                        <div className="admin-feature-row__top">
                          <input className="form-input admin-feature-row__icon" placeholder="🛡️" value={f.icon} maxLength={4}
                            onChange={(e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} />
                          <input className="form-input admin-feature-row__title" placeholder="Título..." value={f.title}
                            onChange={(e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                          <button className="btn btn-danger" style={{ padding: '8px 12px' }}
                            onClick={() => setFeatures(prev => prev.filter((_, j) => j !== i))}>✕</button>
                        </div>
                        <textarea className="form-textarea" rows={2} placeholder="Descrição..." value={f.desc}
                          onChange={(e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '10px', fontSize: '13px' }}
                    onClick={() => setFeatures(prev => [...prev, { icon: '⭐', title: '', desc: '' }])}>
                    + Adicionar Diferencial
                  </button>
                </div>
              </>
            )}

            {/* ═══ SOBRE ═══ */}
            {activeTab === 'sobre' && (
              <>
                {/* Hero */}
                <div className="admin__section">
                  <h2 className="admin__section-title">🏔 Hero da Página Sobre</h2>
                  <div className="admin__field">
                    <label className="form-label">Título principal</label>
                    <input className="form-input" value={sobreHeroTitle} onChange={(e) => setSobreHeroTitle(e.target.value)} placeholder="Sobre a AeroTech Brasil" />
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Subtítulo</label>
                    <input className="form-input" value={sobreHeroSubtitle} onChange={(e) => setSobreHeroSubtitle(e.target.value)} placeholder="Quase duas décadas de excelência..." />
                  </div>
                </div>

                {/* Especialidades */}
                <div className="admin__section">
                  <h2 className="admin__section-title">⭐ Nossas Especialidades</h2>
                  <p className="admin__section-desc" style={{ marginBottom: '1rem' }}>Lista exibida no painel lateral da página Sobre.</p>
                  <div className="admin-features-list">
                    {especialidades.map((e, i) => (
                      <div key={i} className="admin-stat-row">
                        <input
                          className="form-input"
                          style={{ gridColumn: '1 / 3' }}
                          value={e}
                          placeholder="Aviação Agrícola de Precisão"
                          onChange={(ev) => setEspecialidades(prev => prev.map((x, j) => j === i ? ev.target.value : x))}
                        />
                        <button className="btn btn-danger" style={{ padding: '8px 12px' }}
                          onClick={() => setEspecialidades(prev => prev.filter((_, j) => j !== i))}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '10px', fontSize: '13px' }}
                    onClick={() => setEspecialidades(prev => [...prev, ''])}>
                    + Adicionar Especialidade
                  </button>
                </div>

                {/* Timeline */}
                <div className="admin__section">
                  <div className="admin__section-header">
                    <div>
                      <h2 className="admin__section-title">🕐 Linha do Tempo</h2>
                      <p className="admin__section-desc">Seção "Nossa Jornada" na página Sobre.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setTimeline(prev => [...prev, { year: String(new Date().getFullYear()), title: '', desc: '' }])}>
                      + Adicionar
                    </button>
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Título da Seção</label>
                    <input className="form-input" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} placeholder="Uma história de crescimento" />
                  </div>
                  <div className="admin-features-list">
                    {timeline.map((t, i) => (
                      <div key={i} className="admin-feature-row">
                        <div className="admin-feature-row__top">
                          <input className="form-input" style={{ width: '100px', flexShrink: 0 }} placeholder="2005" value={t.year}
                            onChange={(e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))} />
                          <input className="form-input" placeholder="Título (ex: Fundação)" value={t.title}
                            onChange={(e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                          <button className="btn btn-danger" style={{ padding: '8px 12px' }}
                            onClick={() => setTimeline(prev => prev.filter((_, j) => j !== i))}>✕</button>
                        </div>
                        <textarea className="form-textarea" rows={2} placeholder="Descrição..." value={t.desc}
                          onChange={(e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ═══ PRODUTOS ═══ */}
            {activeTab === 'produtos' && (
              <>
                {/* Cabeçalho da página */}
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

                {/* Grid de produtos */}
                <div className="admin__section">
                  <div className="admin__section-header">
                    <div>
                      <h2 className="admin__section-title">📦 Produtos</h2>
                      <p className="admin__section-desc">
                        {products.filter(p => p.active !== false).length} ativos · {products.filter(p => p.active === false).length} inativos
                      </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { addProduct(); setEditingProductId(Date.now()); }}>
                      + Novo Produto
                    </button>
                  </div>

                  {/* Filtro por nome */}
                  <div className="admin-prod-filter">
                    <input
                      className="form-input"
                      placeholder="🔍 Buscar por nome..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                    />
                    {prodSearch && (
                      <button className="admin-prod-filter__clear" onClick={() => setProdSearch('')}>✕</button>
                    )}
                  </div>

                  {/* Grid visual */}
                  {products.length > 0 ? (
                    <div className="admin-prod-grid">
                      {products
                        .filter(p => p.title.toLowerCase().includes(prodSearch.toLowerCase()))
                        .map((p) => {
                          const isActive = p.active !== false;
                          return (
                            <div key={p.id} className={`admin-prod-card ${!isActive ? 'admin-prod-card--inactive' : ''}`}>
                              {/* Imagem */}
                              <div className="admin-prod-card__img">
                                {p.image
                                  ? <img src={p.image} alt={p.title} />
                                  : <span>{p.icon || '📦'}</span>
                                }
                                {!isActive && <div className="admin-prod-card__inactive-badge">Inativo</div>}
                                {p.tag && <div className="admin-prod-card__tag">{p.tag}</div>}
                              </div>

                              {/* Info */}
                              <div className="admin-prod-card__info">
                                <p className="admin-prod-card__title">{p.title}</p>
                                <p className="admin-prod-card__desc">
                                  {p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}
                                </p>
                              </div>

                              {/* Ações */}
                              <div className="admin-prod-card__actions">
                                <button
                                  className="btn admin-prod-card__btn-edit"
                                  onClick={() => setEditingProductId(p.id)}
                                  title="Editar"
                                >
                                  ✏ Editar
                                </button>
                                <button
                                  className={`btn admin-prod-card__btn-toggle ${isActive ? '' : 'admin-prod-card__btn-activate'}`}
                                  onClick={() => toggleProductActive(p.id)}
                                  title={isActive ? 'Inativar' : 'Ativar'}
                                >
                                  {isActive ? '⊘ Inativar' : '✓ Ativar'}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div className="admin__empty"><span>📦</span><p>Nenhum produto. Clique em "+ Novo Produto".</p></div>
                  )}
                </div>

                {/* Modal de edição */}
                {editingProductId !== null && (() => {
                  const p = products.find(pr => pr.id === editingProductId);
                  if (!p) return null;
                  return (
                    <div className="admin-prod-modal__overlay" onClick={() => setEditingProductId(null)}>
                      <div className="admin-prod-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-prod-modal__header">
                          <h2>✏ Editar Produto</h2>
                          <button className="produto-modal__close" onClick={() => setEditingProductId(null)}>✕</button>
                        </div>
                        <div className="admin-prod-modal__body">
                          <ProductRow
                            product={p}
                            categories={content.categories}
                            onChange={updateProduct}
                            onCategoriesChange={updateProductCategories}
                            onGalleryChange={updateProductGallery}
                            onSpecsChange={updateProductSpecs}
                            onInfoChange={updateProductInfo}
                            onDemoImagesChange={updateProductDemoImages}
                            onRemove={(id) => { removeProduct(id); setEditingProductId(null); }}
                          />
                        </div>
                        <div className="admin-prod-modal__footer">
                          <button className="btn btn-outline" onClick={() => setEditingProductId(null)}>Fechar</button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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