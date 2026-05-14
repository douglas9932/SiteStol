import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCompanySettings, saveCompanySettings, CompanySettings, applyCompanyColors, getContacts, saveContact, updateContact, deleteContact, Contact, getNews, saveNews, updateNews, deleteNews, NewsItem, uploadNewsImage, getCalibrationTables, saveCalibrationTable, updateCalibrationTable, deleteCalibrationTable, CalibrationTable } from '@/lib/contentService';
import { useContent } from '@/hooks/useContent';
import { CarouselImage, Product, Category, HomeStat, HomeFeature, SobreTimelineItem, ProductAccordionItem, DemoImage } from '@/context/ContentContext';
import './AdminHome.css';

type Tab = 'home' | 'sobre' | 'produtos' | 'categorias' | 'empresa' | 'contatos' | 'noticias' | 'calibracao';

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
  const navigate = useNavigate();
  const { content, updateDraft, publishDirect, discardDraft, addCategory, updateCategory, removeCategory } = useContent();

  const [homeImages,       setHomeImages]       = useState<CarouselImage[]>(structuredClone(content.draft.home?.carouselImages ?? []));
  const [homeText,         setHomeText]         = useState(content.draft.home?.companyDescription ?? '');
  const [carouselTagline,  setCarouselTagline]  = useState(content.draft.home?.carouselTagline  ?? '');
  const [carouselTitle,    setCarouselTitle]    = useState(content.draft.home?.carouselTitle    ?? '');
  const [carouselSubtitle, setCarouselSubtitle] = useState(content.draft.home?.carouselSubtitle ?? '');
  const [sobreTitle,       setSobreTitle]       = useState(content.draft.home?.sobreTitle       ?? '');
  const [stats,            setStats]            = useState<HomeStat[]>(structuredClone(content.draft.home?.stats ?? []));
  const [featuresTitle,    setFeaturesTitle]    = useState(content.draft.home?.featuresTitle    ?? '');
  const [features,         setFeatures]         = useState<HomeFeature[]>(structuredClone(content.draft.home?.features ?? []));
  const [products,         setProducts]         = useState<Product[]>(Array.isArray(content.draft.products?.products) ? structuredClone(content.draft.products.products) : []);
  const [prodHeadline,     setProdHeadline]     = useState(content.draft.products?.headline    ?? '');
  const [prodSubline,      setProdSubline]      = useState(content.draft.products?.subheadline ?? '');
  const [newImageUrl,  setNewImageUrl]  = useState('');
  const [toast,        setToast]        = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodSearch,       setProdSearch]        = useState('');
  const [showSidebar,      setShowSidebar]      = useState(false);
  const [showAcessoModal,  setShowAcessoModal]  = useState(false);

  // ── Empresa ──
  const [company,         setCompany]         = useState<CompanySettings>({ name: '', icon_url: '', color_primary: '#0a1628', color_secondary: '#c8972a', description: '', cnpj: '' });
  const [companyDraft,    setCompanyDraft]    = useState<CompanySettings>({ name: '', icon_url: '', color_primary: '#0a1628', color_secondary: '#c8972a', description: '', cnpj: '' });
  const [companyHasDraft, setCompanyHasDraft] = useState(false);
  const [companySaving,   setCompanySaving]   = useState(false);
  const [companyMsg,      setCompanyMsg]      = useState<{type:'success'|'error', text:string} | null>(null);
  const companyIconRef = useRef<HTMLInputElement>(null);

  // ── Contatos ──
  const [contacts,         setContacts]         = useState<Contact[]>([]);
  const [contactsDraft,    setContactsDraft]    = useState<Contact[]>([]);
  const [contactsHasDraft, setContactsHasDraft] = useState(false);
  const [editingContact,   setEditingContact]   = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm,      setContactForm]      = useState<Omit<Contact,'id'>>({
    name: '', role: '', email: '', phone: '', mobile: '', address: '', active: true, sort_order: 0,
  });
  const [contactSaving,    setContactSaving]    = useState(false);
  const [contactMsg,       setContactMsg]       = useState<{type:'success'|'error', text:string}|null>(null);

  useEffect(() => {
    getContacts().then(data => { setContacts(data); setContactsDraft(data); });
  }, []);

  // ── Notícias ──
  const defaultNewsForm = (): Omit<NewsItem,'id'> => ({
    title:'', summary:'', content:'', image_url:'', extra_images: [], author:'',
    category:'', active:true, sort_order:0,
    published_at: new Date().toISOString().split('T')[0],
  });
  const [news,             setNews]            = useState<NewsItem[]>([]);
  const [newsDraft,        setNewsDraft]       = useState<NewsItem[]>([]); // rascunho local
  const [newsHasDraft,     setNewsHasDraft]    = useState(false);          // dirty flag
  const [editingNews,      setEditingNews]     = useState<NewsItem | null>(null);
  const [showNewsModal,    setShowNewsModal]   = useState(false);
  const [newsForm,         setNewsForm]        = useState<Omit<NewsItem,'id'>>(defaultNewsForm());
  const [newsPublishing,   setNewsPublishing]  = useState(false);
  const [newsMsg,          setNewsMsg]         = useState<{type:'success'|'error', text:string}|null>(null);
  const [newsImgUploading, setNewsImgUploading] = useState(false);
  const newsMainImgRef  = useRef<HTMLInputElement>(null);
  const newsExtraImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getNews().then(data => { setNews(data); setNewsDraft(data); });
  }, []);

  // ── Calibração ──
  const defaultCalibForm = (): Omit<CalibrationTable,'id'> => ({
    title: '', description: '', columns: ['Coluna 1', 'Coluna 2', 'Coluna 3'],
    row_headers: [''],
    rows: [['', '', '']], active: true, sort_order: 0,
  });
  const [calibTables,       setCalibTables]       = useState<CalibrationTable[]>([]);
  const [calibDraft,        setCalibDraft]        = useState<CalibrationTable[]>([]);
  const [calibHasDraft,     setCalibHasDraft]     = useState(false);
  const [editingCalib,      setEditingCalib]      = useState<CalibrationTable | null>(null);
  const [showCalibModal,    setShowCalibModal]    = useState(false);
  const [calibForm,         setCalibForm]         = useState<Omit<CalibrationTable,'id'>>(defaultCalibForm());
  const [calibSaving,       setCalibSaving]       = useState(false);
  const [calibMsg,          setCalibMsg]          = useState<{type:'success'|'error', text:string}|null>(null);

  useEffect(() => {
    getCalibrationTables().then(data => { setCalibTables(data); setCalibDraft(data); });
  }, []);

  useEffect(() => {
    getCompanySettings().then(s => { setCompany(s); setCompanyDraft(s); applyCompanyColors(s); });
  }, []);

  const authData = JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}');
  const [acessoName,     setAcessoName]     = useState(authData.name  ?? '');
  const [acessoEmail,    setAcessoEmail]    = useState(authData.email ?? '');
  const [acessoPassword, setAcessoPassword] = useState('');
  const [acessoConfirm,  setAcessoConfirm]  = useState('');
  const [acessoLoading,  setAcessoLoading]  = useState(false);
  const [acessoMsg,      setAcessoMsg]      = useState<{type:'success'|'error', text:string} | null>(null);

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

  // ── Ressincroniza os estados locais quando o Supabase termina de carregar ──
  // O useState inicializa com os dados do localStorage (pode estar desatualizado).
  // Quando o ContentContext carrega do Supabase e atualiza o content.draft,
  // este useEffect detecta a mudança e atualiza todos os estados locais do Admin.
  const supabaseLoaded = useRef(false);
  useEffect(() => {
    // Ignora a primeira renderização (ainda é o localStorage)
    if (!supabaseLoaded.current) {
      supabaseLoaded.current = true;
      return;
    }
    // Supabase atualizou o content — ressincroniza tudo
    setHomeImages(structuredClone(content.draft.home.carouselImages));
    setHomeText(content.draft.home.companyDescription);
    setCarouselTagline(content.draft.home.carouselTagline  ?? '');
    setCarouselTitle(content.draft.home.carouselTitle      ?? '');
    setCarouselSubtitle(content.draft.home.carouselSubtitle ?? '');
    setSobreTitle(content.draft.home.sobreTitle            ?? '');
    setStats(structuredClone(content.draft.home.stats      ?? []));
    setFeaturesTitle(content.draft.home.featuresTitle      ?? '');
    setFeatures(structuredClone(content.draft.home.features ?? []));
    setProducts(Array.isArray(content.draft.products?.products) ? structuredClone(content.draft.products.products) : []);
    setProdHeadline(content.draft.products.headline);
    setProdSubline(content.draft.products.subheadline);
    setSobreHeroTitle(content.draft.sobre?.heroTitle       ?? '');
    setSobreHeroSubtitle(content.draft.sobre?.heroSubtitle ?? '');
    setEspecialidades(structuredClone(content.draft.sobre?.especialidades ?? []));
    setTimelineTitle(content.draft.sobre?.timelineTitle    ?? '');
    setTimeline(structuredClone(content.draft.sobre?.timeline ?? []));
  // Depende do objeto draft inteiro — dispara quando o Supabase atualiza
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.draft]);

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
    if (activeTab === 'noticias') return newsHasDraft;
    if (activeTab === 'calibracao') return calibHasDraft;
    if (activeTab === 'contatos') return contactsHasDraft;
    if (activeTab === 'empresa') return companyHasDraft;
    return false;
  })();

  const sobrePayload = () => ({
    heroTitle: sobreHeroTitle, heroSubtitle: sobreHeroSubtitle,
    especialidades, timelineTitle, timeline,
  });

  const handlePreview = () => {
    if (activeTab === 'home') {
      const draft = { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features };
      sessionStorage.setItem('home_preview_draft', JSON.stringify(draft));
      window.open('/preview?page=home', '_blank');
    } else if (activeTab === 'sobre') {
      sessionStorage.setItem('sobre_preview_draft', JSON.stringify(sobrePayload()));
      window.open('/preview?page=sobre', '_blank');
    } else if (activeTab === 'produtos') {
      sessionStorage.setItem('produtos_preview_draft', JSON.stringify({ products, headline: prodHeadline, subheadline: prodSubline }));
      window.open('/preview?page=produtos', '_blank');
    } else if (activeTab === 'calibracao') {
      sessionStorage.setItem('calib_preview_draft', JSON.stringify(calibDraft));
      window.open('/preview?page=calibracao', '_blank');
    } else if (activeTab === 'noticias') {
      sessionStorage.setItem('news_preview_draft', JSON.stringify(newsDraft));
      window.open('/preview?page=noticias', '_blank');
    } else if (activeTab === 'contatos') {
      sessionStorage.setItem('contacts_preview_draft', JSON.stringify(contactsDraft));
      window.open('/preview?page=contatos', '_blank');
    } else if (activeTab === 'empresa') {
      sessionStorage.setItem('empresa_preview_draft', JSON.stringify(companyDraft));
      window.open('/preview?page=empresa', '_blank');
    }
  };

  const confirmPublish = async () => {
    setShowModal(false);
    if (activeTab === 'home') publishDirect('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
    else if (activeTab === 'sobre') publishDirect('sobre', sobrePayload());
    else if (activeTab === 'produtos') publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
    else if (activeTab === 'noticias') {
      setNewsPublishing(true);
      try {
        // Sincroniza o draft com o banco:
        // 1. Itens com ID real → update
        // 2. Itens com ID temporário (temp_) → insert
        // 3. Itens que sumiram do draft → delete
        const toDelete = news.filter(n => !newsDraft.find(d => d.id === n.id));
        const toInsert = newsDraft.filter(d => d.id.startsWith('temp_'));
        const toUpdate = newsDraft.filter(d => !d.id.startsWith('temp_'));

        await Promise.all([
          ...toDelete.map(n => deleteNews(n.id)),
          ...toUpdate.map(n => updateNews(n.id, n)),
        ]);
        const inserted = await Promise.all(
          toInsert.map(d => {
            const { id: _id, ...form } = d;
            return saveNews(form);
          })
        );

        // Reconstrói o draft com IDs reais
        const finalDraft = [
          ...toUpdate,
          ...(inserted.filter(Boolean) as NewsItem[]),
        ].sort((a,b) => a.sort_order - b.sort_order);

        setNews(finalDraft);
        setNewsDraft(finalDraft);
        setNewsHasDraft(false);
        showToast('✅ Notícias publicadas!');
      } catch {
        showToast('❌ Erro ao publicar notícias.');
      } finally {
        setNewsPublishing(false);
      }
      return;
    } else if (activeTab === 'calibracao') {
      try {
        const toDelete = calibTables.filter(t => !calibDraft.find(d => d.id === t.id));
        const toInsert = calibDraft.filter(d => d.id.startsWith('temp_'));
        const toUpdate = calibDraft.filter(d => !d.id.startsWith('temp_'));
        await Promise.all([
          ...toDelete.map(t => deleteCalibrationTable(t.id)),
          ...toUpdate.map(t => updateCalibrationTable(t.id, t)),
        ]);
        const inserted = await Promise.all(
          toInsert.map(d => { const { id: _id, ...form } = d; return saveCalibrationTable(form); })
        );
        const final = [...toUpdate, ...(inserted.filter(Boolean) as CalibrationTable[])].sort((a,b) => a.sort_order - b.sort_order);
        setCalibTables(final);
        setCalibDraft(final);
        setCalibHasDraft(false);
        showToast('✅ Tabelas de calibração publicadas!');
      } catch { showToast('❌ Erro ao publicar.'); }
      return;
    } else if (activeTab === 'contatos') {
      try {
        const toDelete = contacts.filter(c => !contactsDraft.find(d => d.id === c.id));
        const toInsert = contactsDraft.filter(d => d.id.startsWith('temp_'));
        const toUpdate = contactsDraft.filter(d => !d.id.startsWith('temp_'));
        await Promise.all([
          ...toDelete.map(c => deleteContact(c.id)),
          ...toUpdate.map(c => updateContact(c.id, c)),
        ]);
        const inserted = await Promise.all(
          toInsert.map(d => { const { id: _id, ...form } = d; return saveContact(form); })
        );
        const final = [...toUpdate, ...(inserted.filter(Boolean) as Contact[])].sort((a,b) => a.sort_order - b.sort_order);
        setContacts(final);
        setContactsDraft(final);
        setContactsHasDraft(false);
        showToast('✅ Contatos publicados!');
      } catch { showToast('❌ Erro ao publicar contatos.'); }
      return;
    } else if (activeTab === 'empresa') {
      try {
        await saveCompanySettings(companyDraft);
        setCompany(companyDraft);
        setCompanyHasDraft(false);
        applyCompanyColors(companyDraft);
        document.title = companyDraft.name;
        showToast('✅ Configurações da empresa publicadas!');
        setTimeout(() => window.location.reload(), 800);
      } catch { showToast('❌ Erro ao publicar.'); }
      return;
    }
    showToast('✅ Publicado! O site já exibe o novo conteúdo.');
  };

  const handleDiscard = () => {
    if (activeTab === 'noticias') {
      setNewsDraft(structuredClone(news));
      setNewsHasDraft(false);
      showToast('Alterações descartadas.');
      return;
    }
    if (activeTab === 'calibracao') {
      setCalibDraft(structuredClone(calibTables));
      setCalibHasDraft(false);
      showToast('Alterações descartadas.');
      return;
    }
    if (activeTab === 'contatos') {
      setContactsDraft(structuredClone(contacts));
      setContactsHasDraft(false);
      showToast('Alterações descartadas.');
      return;
    }
    if (activeTab === 'empresa') {
      setCompanyDraft(structuredClone(company));
      setCompanyHasDraft(false);
      applyCompanyColors(company);
      showToast('Alterações descartadas.');
      return;
    }
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
      setProducts(Array.isArray(pub.products) ? structuredClone(pub.products) : []);
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
    { key: 'home',       label: 'Home',              icon: '🏠' },
    { key: 'sobre',      label: 'Sobre',             icon: '📋' },
    { key: 'categorias', label: 'Categorias',        icon: '🏷' },
    { key: 'produtos',   label: 'Produtos',          icon: '📦' },
    { key: 'noticias',   label: 'Notícias',          icon: '📰' },
    { key: 'calibracao', label: 'Calibração',        icon: '📊' },
    { key: 'contatos',   label: 'Contatos',          icon: '📞' },
    { key: 'empresa',    label: 'Empresa',           icon: '🏢' },
  ];

  return (
    <div className="admin">
      {showModal && <PublishModal page={activeTab} onConfirm={confirmPublish} onCancel={() => setShowModal(false)} />}

      {/* ── Layout: sidebar + content ── */}
      <div className="admin__layout">

        {/* Botão hambúrguer mobile */}
        <button className="admin__mobile-toggle" onClick={() => setShowSidebar(v => !v)}>
          <span><i /><i /><i /></span>
          {showSidebar ? 'Fechar' : 'Menu'}
        </button>

        {/* Overlay mobile */}
        {showSidebar && (
          <div className="admin__mobile-overlay" onClick={() => setShowSidebar(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`admin__sidebar ${showSidebar ? 'admin__sidebar--open' : ''}`}>

          {/* Logo panel */}
          <div className="admin__sidebar-brand">
            {company.icon_url
              ? <img src={company.icon_url} alt={company.name} className="admin__logo-img" />
              : <div className="admin__logo">{(company.name || 'AT').slice(0, 2).toUpperCase()}</div>
            }
            <div>
              <p className="admin__title">{company.name || 'Minha Empresa'}</p>
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
                  onClick={() => { setActiveTab(key); setShowSidebar(false); }}
                >
                  <span className="admin__sidebar-item-icon">{icon}</span>
                  <span className="admin__sidebar-item-label">{label}</span>
                  {hasDot && <span className="admin__sidebar-dot" />}
                </button>
              );
            })}
          </nav>

          <div className="admin__sidebar-footer">
            <button
              className="admin__sidebar-acesso-btn"
              onClick={() => setShowAcessoModal(true)}
            >
              <span className="admin__sidebar-acesso-avatar">
                {(JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}').name ?? 'A')[0].toUpperCase()}
              </span>
              <div className="admin__sidebar-acesso-info">
                <span className="admin__sidebar-acesso-name">
                  {JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}').name ?? 'Administrador'}
                </span>
                <span className="admin__sidebar-acesso-label">Meu Acesso</span>
              </div>
              <span className="admin__sidebar-acesso-icon">⚙</span>
            </button>
            <a href="/" className="admin__sidebar-site-link" target="_blank" rel="noreferrer">
              🌐 Ver site publicado
            </a>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="admin__content">

          {/* Barra de ações — alinhada à esquerda, no topo da área de conteúdo */}
          <div className="admin__actionbar">
            {/* Logout */}
            <button
              className="btn btn-ghost"
              style={{ marginRight: 'auto', color: 'var(--gray-400)', fontSize: '12px' }}
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                navigate('/login', { replace: true });
              }}
            >
              ⎋ Sair
            </button>

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
                        {(products ?? []).filter(p => p.active !== false).length} ativos · {(products ?? []).filter(p => p.active === false).length} inativos
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
                  {Array.isArray(products) && products.length > 0 ? (
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

            {/* ═══ NOTÍCIAS ═══ */}
            {activeTab === 'noticias' && (
              <div className="admin__section">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div>
                    <h2 className="admin__section-title">📰 Notícias</h2>
                    <p className="admin__section-desc">Edite as notícias e clique em <strong>Publicar</strong> para atualizar o site.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => {
                    setEditingNews(null);
                    setNewsForm(defaultNewsForm());
                    setNewsMsg(null);
                    setShowNewsModal(true);
                  }}>+ Nova Notícia</button>
                </div>

                {newsHasDraft && (
                  <div style={{
                    background:'rgba(234,88,12,0.1)', border:'1px solid rgba(234,88,12,0.3)',
                    borderRadius:'var(--radius-md)', padding:'10px 14px', marginBottom:12,
                    fontSize:13, color:'#ea580c', fontWeight:600,
                  }}>
                    ⚠ Há alterações não publicadas. Clique em <strong>Publicar</strong> para salvar no site.
                  </div>
                )}

                {newsDraft.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📰</div>
                    <p>Nenhuma notícia cadastrada ainda.</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {newsDraft.map((n) => (
                      <div key={n.id} style={{
                        background: n.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                        border:'1px solid var(--border-gray)',
                        borderLeft: `4px solid ${n.active ? 'var(--gold)' : 'var(--border-gray)'}`,
                        borderRadius:'var(--radius-md)', padding:'16px 20px',
                        display:'flex', alignItems:'flex-start', gap:16,
                        opacity: n.active ? 1 : 0.6,
                      }}>
                        {n.image_url ? (
                          <img src={n.image_url} alt={n.title} style={{ width:72, height:52, objectFit:'cover', borderRadius:6, flexShrink:0 }} />
                        ) : (
                          <div style={{ width:72, height:52, background:'var(--bg-light)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>📰</div>
                        )}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                            {n.category && <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:1, color:'var(--gold)', background:'var(--gold-dim)', padding:'2px 8px', borderRadius:20 }}>{n.category}</span>}
                            <span style={{ fontSize:10, color:'var(--gray-400)', fontWeight:600 }}>
                              {new Date(n.published_at).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}
                            </span>
                            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                              background: n.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                              color: n.active ? 'var(--success)' : 'var(--gray-400)',
                            }}>{n.active ? 'Ativa' : 'Inativa'}</span>
                          </div>
                          <p style={{ fontWeight:700, color:'var(--navy)', fontSize:14, marginBottom:2 }}>{n.title}</p>
                          {n.summary && <p style={{ fontSize:12, color:'var(--gray-400)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.summary}</p>}
                          {n.author && <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:2, fontStyle:'italic' }}>Por {n.author}</p>}
                        </div>
                        <div style={{ display:'flex', gap:8, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                          <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              setEditingNews(n);
                              setNewsForm({ title:n.title, summary:n.summary, content:n.content, image_url:n.image_url, extra_images: Array.isArray(n.extra_images) ? n.extra_images : [], author:n.author, category:n.category, active:n.active, sort_order:n.sort_order, published_at:n.published_at.split('T')[0] });
                              setNewsMsg(null);
                              setShowNewsModal(true);
                            }}>✏ Editar</button>
                          <button className="btn" style={{ fontSize:12, padding:'6px 12px', background: n.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: n.active ? 'var(--danger)' : 'var(--success)', border:'none' }}
                            onClick={() => {
                              setNewsDraft(prev => prev.map(x => x.id === n.id ? {...x, active: !n.active} : x));
                              setNewsHasDraft(true);
                            }}>{n.active ? '🚫 Inativar' : '✓ Ativar'}</button>
                          <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              if (!confirm(`Excluir "${n.title}"?`)) return;
                              setNewsDraft(prev => prev.filter(x => x.id !== n.id));
                              setNewsHasDraft(true);
                            }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ CALIBRAÇÃO ═══ */}
            {activeTab === 'calibracao' && (
              <div className="admin__section">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div>
                    <h2 className="admin__section-title">📊 Tabelas de Calibração</h2>
                    <p className="admin__section-desc">Edite as tabelas e clique em <strong>Publicar</strong> para atualizar o site.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => {
                    setEditingCalib(null);
                    setCalibForm(defaultCalibForm());
                    setCalibMsg(null);
                    setShowCalibModal(true);
                  }}>+ Nova Tabela</button>
                </div>

                {calibHasDraft && (
                  <div style={{
                    background:'rgba(234,88,12,0.1)', border:'1px solid rgba(234,88,12,0.3)',
                    borderRadius:'var(--radius-md)', padding:'10px 14px', marginBottom:12,
                    fontSize:13, color:'#ea580c', fontWeight:600,
                  }}>
                    ⚠ Há alterações não publicadas. Clique em <strong>Publicar</strong> para salvar no site.
                  </div>
                )}

                {calibDraft.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
                    <p>Nenhuma tabela cadastrada ainda.</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {calibDraft.map((t) => (
                      <div key={t.id} style={{
                        background: t.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                        border:'1px solid var(--border-gray)',
                        borderLeft:`4px solid ${t.active ? 'var(--gold)' : 'var(--border-gray)'}`,
                        borderRadius:'var(--radius-md)', padding:'16px 20px',
                        display:'flex', alignItems:'center', gap:16,
                        opacity: t.active ? 1 : 0.6,
                      }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            <span style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{t.title}</span>
                            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                              background: t.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                              color: t.active ? 'var(--success)' : 'var(--gray-400)',
                            }}>{t.active ? 'Ativa' : 'Inativa'}</span>
                          </div>
                          {t.description && <p style={{ fontSize:12, color:'var(--gray-400)', marginBottom:4 }}>{t.description}</p>}
                          <p style={{ fontSize:11, color:'var(--gray-400)' }}>
                            {t.columns.length} colunas · {t.rows.length} linhas
                          </p>
                        </div>
                        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                          <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              setEditingCalib(t);
                              setCalibForm({ title:t.title, description:t.description, columns:[...t.columns], row_headers:[...(t.row_headers??[])], rows:t.rows.map(r=>[...r]), active:t.active, sort_order:t.sort_order });
                              setCalibMsg(null);
                              setShowCalibModal(true);
                            }}>✏ Editar</button>
                          <button className="btn" style={{ fontSize:12, padding:'6px 12px', background: t.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: t.active ? 'var(--danger)' : 'var(--success)', border:'none' }}
                            onClick={() => {
                              setCalibDraft(prev => prev.map(x => x.id === t.id ? {...x, active: !t.active} : x));
                              setCalibHasDraft(true);
                            }}>{t.active ? '🚫 Inativar' : '✓ Ativar'}</button>
                          <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              if (!confirm(`Excluir "${t.title}"?`)) return;
                              setCalibDraft(prev => prev.filter(x => x.id !== t.id));
                              setCalibHasDraft(true);
                            }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ CONTATOS ═══ */}
            {activeTab === 'contatos' && (
              <div className="admin__section">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div>
                    <h2 className="admin__section-title">📞 Contatos</h2>
                    <p className="admin__section-desc">Edite os contatos e clique em <strong>Publicar</strong> para atualizar o site.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => {
                    setEditingContact(null);
                    setContactForm({ name:'', role:'', email:'', phone:'', mobile:'', address:'', active:true, sort_order: contactsDraft.length });
                    setContactMsg(null);
                    setShowContactModal(true);
                  }}>+ Novo Contato</button>
                </div>

                {contactsHasDraft && (
                  <div style={{
                    background:'rgba(234,88,12,0.1)', border:'1px solid rgba(234,88,12,0.3)',
                    borderRadius:'var(--radius-md)', padding:'10px 14px', marginBottom:12,
                    fontSize:13, color:'#ea580c', fontWeight:600,
                  }}>
                    ⚠ Há alterações não publicadas. Clique em <strong>Publicar</strong> para salvar no site.
                  </div>
                )}

                {contactsDraft.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'3rem', color:'var(--gray-400)' }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>📞</div>
                    <p>Nenhum contato cadastrado ainda.</p>
                    <p style={{ fontSize:13 }}>Clique em "+ Novo Contato" para adicionar.</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {contactsDraft.map((c) => (
                      <div key={c.id} style={{
                        background: c.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                        border:'1px solid var(--border-gray)',
                        borderRadius: 'var(--radius-md)', padding:'16px 20px',
                        display:'flex', alignItems:'center', gap:16,
                        opacity: c.active ? 1 : 0.6,
                      }}>
                        <div style={{
                          width:48, height:48, borderRadius:'50%',
                          background:'var(--navy)', color:'white',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight:800, fontSize:16, flexShrink:0,
                        }}>
                          {c.name.split(' ').slice(0,2).map((w: string)=>w[0]).join('').toUpperCase()}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                            <span style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{c.name}</span>
                            {c.role && <span style={{ fontSize:12, color:'var(--gray-400)' }}>{c.role}</span>}
                            <span style={{
                              fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                              background: c.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                              color: c.active ? 'var(--success)' : 'var(--gray-400)',
                            }}>{c.active ? 'Ativo' : 'Inativo'}</span>
                          </div>
                          <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:4 }}>
                            {c.email   && <span style={{ fontSize:12, color:'var(--gray-400)' }}>✉ {c.email}</span>}
                            {c.phone   && <span style={{ fontSize:12, color:'var(--gray-400)' }}>☎ {c.phone}</span>}
                            {c.mobile  && <span style={{ fontSize:12, color:'var(--gray-400)' }}>📱 {c.mobile}</span>}
                            {c.address && <span style={{ fontSize:12, color:'var(--gray-400)' }}>📍 {c.address}</span>}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                          <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              setEditingContact(c);
                              setContactForm({ name:c.name, role:c.role, email:c.email, phone:c.phone, mobile:c.mobile, address:c.address, active:c.active, sort_order:c.sort_order });
                              setContactMsg(null);
                              setShowContactModal(true);
                            }}>✏ Editar</button>
                          <button className="btn"
                            style={{ fontSize:12, padding:'6px 12px', background: c.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: c.active ? 'var(--danger)' : 'var(--success)', border:'none' }}
                            onClick={() => {
                              setContactsDraft(prev => prev.map(x => x.id === c.id ? {...x, active: !c.active} : x));
                              setContactsHasDraft(true);
                            }}>{c.active ? '🚫 Inativar' : '✓ Ativar'}</button>
                          <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 12px' }}
                            onClick={() => {
                              if (!confirm(`Excluir "${c.name}"?`)) return;
                              setContactsDraft(prev => prev.filter(x => x.id !== c.id));
                              setContactsHasDraft(true);
                            }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ EMPRESA ═══ */}
            {activeTab === 'empresa' && (
              <div className="admin__section">
                <h2 className="admin__section-title">🏢 Configurações da Empresa</h2>
                <p className="admin__section-desc" style={{ marginBottom: '1rem' }}>
                  Essas informações são exibidas na aba do navegador, no navbar e em todo o site.
                </p>
                {companyHasDraft && (
                  <div style={{
                    background:'rgba(234,88,12,0.1)', border:'1px solid rgba(234,88,12,0.3)',
                    borderRadius:'var(--radius-md)', padding:'10px 14px', marginBottom:'1rem',
                    fontSize:13, color:'#ea580c', fontWeight:600,
                  }}>
                    ⚠ Há alterações não publicadas. Clique em <strong>Publicar</strong> para salvar no site.
                  </div>
                )}

                <div className="admin__field">
                  <label className="form-label">Nome da Empresa</label>
                  <input
                    className="form-input"
                    placeholder="Ex: AeroTech Brasil"
                    value={companyDraft.name}
                    onChange={e => { setCompanyDraft(prev => ({ ...prev, name: e.target.value })); setCompanyHasDraft(true); }}
                  />
                  <p className="admin__hint">Aparece na aba do navegador, navbar e rodapé.</p>
                </div>

                <div className="admin__field" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Descrição (Rodapé)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Ex: Referência nacional em aviação agrícola desde 2005..."
                    value={companyDraft.description ?? ''}
                    onChange={e => { setCompanyDraft(prev => ({ ...prev, description: e.target.value })); setCompanyHasDraft(true); }}
                    style={{ resize: 'vertical' }}
                  />
                  <p className="admin__hint">Texto exibido abaixo do logo no rodapé do site.</p>
                </div>

                <div className="admin__field" style={{ marginTop: '1rem' }}>
                  <label className="form-label">CNPJ</label>
                  <input
                    className="form-input"
                    placeholder="Ex: CNPJ: 12.345.678/0001-90 · Palotina, Paraná — Brasil"
                    value={companyDraft.cnpj ?? ''}
                    onChange={e => { setCompanyDraft(prev => ({ ...prev, cnpj: e.target.value })); setCompanyHasDraft(true); }}
                  />
                  <p className="admin__hint">Exibido no rodapé inferior do site. Deixe em branco para ocultar.</p>
                </div>

                <div className="admin__field" style={{ marginTop: '1.25rem' }}>
                  <label className="form-label">Ícone / Logo</label>
                  {/* Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 12,
                      background: companyDraft.icon_url ? '#f5f5f5' : 'var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border-gray)', overflow: 'hidden', flexShrink: 0,
                    }}>
                      {companyDraft.icon_url
                        ? <img src={companyDraft.icon_url} alt="ícone" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                        : <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--navy)' }}>
                            {(companyDraft.name || 'AT').slice(0, 2).toUpperCase()}
                          </span>
                      }
                    </div>
                    <div>
                      <input
                        ref={companyIconRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => { setCompanyDraft(prev => ({ ...prev, icon_url: ev.target?.result as string })); setCompanyHasDraft(true); };
                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }}
                      />
                      <button className="btn admin__upload-btn" onClick={() => companyIconRef.current?.click()}>
                        📁 Carregar imagem
                      </button>
                      {companyDraft.icon_url && (
                        <button className="btn btn-danger" style={{ fontSize: '12px', padding: '6px 12px', marginLeft: 8 }}
                          onClick={() => { setCompanyDraft(prev => ({ ...prev, icon_url: '' })); setCompanyHasDraft(true); }}>
                          🗑 Remover
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    className="form-input"
                    placeholder="Ou cole a URL do ícone..."
                    value={companyDraft.icon_url?.startsWith('data:') ? '' : (companyDraft.icon_url ?? '')}
                    onChange={e => { setCompanyDraft(prev => ({ ...prev, icon_url: e.target.value })); setCompanyHasDraft(true); }}
                  />
                  <p className="admin__hint">Recomendado: PNG ou SVG quadrado (ex: 512×512px). Aparece na aba do navegador e no navbar.</p>
                </div>

                {/* Cores */}
                <div className="admin__field" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">🎨 Cores da Empresa</label>
                  <p className="admin__section-desc" style={{ marginBottom: '1rem' }}>
                    Aplicadas em todo o site: navbar, footer, botões, destaques e painel administrativo.
                  </p>

                  <div className="admin-color-grid">
                    {/* Cor Principal */}
                    <div className="admin-color-item">
                      <div className="admin-color-preview" style={{ background: companyDraft.color_primary || '#0a1628' }} />
                      <div className="admin-color-info">
                        <span className="admin-color-label">Cor Principal</span>
                        <span className="admin-color-desc">Navbar, footer, fundos escuros</span>
                      </div>
                      <input
                        type="color"
                        className="admin-color-picker"
                        value={companyDraft.color_primary || '#0a1628'}
                        onChange={e => {
                          const updated = { ...company, color_primary: e.target.value };
                          setCompanyDraft(updated);
                          applyCompanyColors(updated);
                          setCompanyHasDraft(true);
                        }}
                      />
                    </div>

                    {/* Cor de Destaque */}
                    <div className="admin-color-item">
                      <div className="admin-color-preview" style={{ background: companyDraft.color_secondary || '#c8972a' }} />
                      <div className="admin-color-info">
                        <span className="admin-color-label">Cor de Destaque</span>
                        <span className="admin-color-desc">Botões, bordas ativas, textos em evidência</span>
                      </div>
                      <input
                        type="color"
                        className="admin-color-picker"
                        value={companyDraft.color_secondary || '#c8972a'}
                        onChange={e => {
                          const updated = { ...company, color_secondary: e.target.value };
                          setCompanyDraft(updated);
                          applyCompanyColors(updated);
                          setCompanyHasDraft(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Preview das cores */}
                  <div className="admin-color-preview-bar" style={{ marginTop: 16 }}>
                    <div style={{
                      background: companyDraft.color_primary || '#0a1628',
                      padding: '14px 20px',
                      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>Preview do Navbar</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['Sobre', 'Produtos', 'Contatos'].map(t => (
                          <span key={t} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{
                      background: '#f5f5f5', padding: '12px 20px',
                      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                      display: 'flex', gap: 10, alignItems: 'center',
                    }}>
                      <div style={{
                        background: companyDraft.color_secondary || '#c8972a',
                        color: companyDraft.color_primary || '#0a1628',
                        padding: '6px 16px', borderRadius: 20,
                        fontSize: 12, fontWeight: 800,
                      }}>Botão</div>
                      <span style={{ color: companyDraft.color_secondary || '#c8972a', fontSize: 13, fontWeight: 700 }}>
                        Texto em destaque
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline"
                    style={{ marginTop: 12, fontSize: 12 }}
                    onClick={() => {
                      const reset = { ...company, color_primary: '#0a1628', color_secondary: '#c8972a' };
                      setCompanyDraft(reset);
                      applyCompanyColors(reset);
                      setCompanyHasDraft(false);
                    }}
                  >
                    ↺ Restaurar cores padrão
                  </button>
                </div>

                {companyMsg && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 16,
                    background: companyMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                    color:      companyMsg.type === 'success' ? 'var(--success)'    : 'var(--danger)',
                    border:     `1px solid ${companyMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                  }}>
                    {companyMsg.type === 'success' ? '✓ ' : '✕ '}{companyMsg.text}
                  </div>
                )}

                <p className="admin__hint" style={{ marginTop:'1rem', color:'var(--gray-400)' }}>
                  As alterações só serão aplicadas no site após clicar em <strong>Publicar</strong>.
                </p>
              </div>
            )}

          </main>
          </div>
        </div>
      </div>

      {/* ── Modal Calibração ── */}
      {showCalibModal && (() => {
        const cols = calibForm.columns;
        const rows = calibForm.rows;
        const rowHeaders = calibForm.row_headers ?? [];

        const setCol = (ci: number, val: string) =>
          setCalibForm(p => { const c=[...p.columns]; c[ci]=val; return {...p,columns:c}; });

        const addCol = () =>
          setCalibForm(p => ({
            ...p,
            columns: [...p.columns, `Coluna ${p.columns.length+1}`],
            rows: p.rows.map(r => [...r, '']),
          }));

        const removeCol = (ci: number) =>
          setCalibForm(p => ({
            ...p,
            columns: p.columns.filter((_,i)=>i!==ci),
            rows: p.rows.map(r => r.filter((_,i)=>i!==ci)),
          }));

        const addRow = () =>
          setCalibForm(p => ({
            ...p,
            row_headers: [...(p.row_headers??[]), ''],
            rows: [...p.rows, Array(p.columns.length).fill('')],
          }));

        const removeRow = (ri: number) =>
          setCalibForm(p => ({
            ...p,
            row_headers: (p.row_headers??[]).filter((_,i)=>i!==ri),
            rows: p.rows.filter((_,i)=>i!==ri),
          }));

        const setCell = (ri: number, ci: number, val: string) =>
          setCalibForm(p => {
            const r = p.rows.map(row=>[...row]);
            r[ri][ci] = val;
            return {...p, rows:r};
          });

        const setRowHeader = (ri: number, val: string) =>
          setCalibForm(p => {
            const h = [...(p.row_headers??[])];
            h[ri] = val;
            return {...p, row_headers:h};
          });

        return (
          <div className="admin-prod-modal__overlay" onClick={() => setShowCalibModal(false)}>
            <div className="admin-prod-modal" style={{ maxWidth:820, width:'95vw' }} onClick={e => e.stopPropagation()}>
              <div className="admin-prod-modal__header">
                <h2>{editingCalib ? '✏ Editar Tabela' : '+ Nova Tabela de Calibração'}</h2>
                <button className="produto-modal__close" style={{ color:'white', background:'rgba(255,255,255,0.1)' }}
                  onClick={() => setShowCalibModal(false)}>✕</button>
              </div>

              <div className="admin-prod-modal__body" style={{ maxHeight:'70vh', overflowY:'auto' }}>
                {/* Título e descrição */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12, marginBottom:20 }}>
                  <div className="admin__field">
                    <label className="form-label">Título <span style={{color:'var(--danger)'}}>*</span></label>
                    <input className="form-input" placeholder="Ex: Tabela de Calibração de Altímetros"
                      value={calibForm.title} onChange={e => setCalibForm(p=>({...p,title:e.target.value}))} />
                  </div>
                  <div className="admin__field">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-input" rows={2} placeholder="Descrição opcional..."
                      value={calibForm.description} onChange={e => setCalibForm(p=>({...p,description:e.target.value}))}
                      style={{ resize:'vertical' }} />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <input type="checkbox" id="calib-active" checked={calibForm.active}
                      onChange={e => setCalibForm(p=>({...p,active:e.target.checked}))}
                      style={{ width:18, height:18, cursor:'pointer' }} />
                    <label htmlFor="calib-active" style={{ fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--navy)' }}>
                      Tabela ativa (visível no site)
                    </label>
                    <input className="form-input" type="number" min={0} value={calibForm.sort_order}
                      onChange={e => setCalibForm(p=>({...p,sort_order:Number(e.target.value)}))}
                      style={{ width:80, marginLeft:'auto' }} title="Ordem de exibição" />
                    <span style={{ fontSize:12, color:'var(--gray-400)', whiteSpace:'nowrap' }}>Ordem</span>
                  </div>
                </div>

                {/* Editor de colunas */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <label className="form-label" style={{ marginBottom:0 }}>Colunas de Dados ({cols.length})</label>
                    <button className="btn btn-outline" style={{ fontSize:11, padding:'4px 10px' }} onClick={addCol}>
                      + Coluna
                    </button>
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {cols.map((col, ci) => (
                      <div key={ci} style={{ display:'flex', alignItems:'center', gap:4, background:'var(--bg-light)', borderRadius:6, padding:'4px 6px', border:'1px solid var(--border-gray)' }}>
                        <input
                          style={{ border:'none', background:'transparent', fontSize:12, fontWeight:700, color:'var(--navy)', width: Math.max(60, col.length * 8), outline:'none', fontFamily:'inherit' }}
                          value={col} onChange={e => setCol(ci, e.target.value)} />
                        {cols.length > 1 && (
                          <button onClick={() => removeCol(ci)}
                            style={{ background:'none', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:12, lineHeight:1, padding:0 }}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editor de linhas com títulos */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <label className="form-label" style={{ marginBottom:0 }}>Linhas ({rows.length})</label>
                    <button className="btn btn-outline" style={{ fontSize:11, padding:'4px 10px' }} onClick={addRow}>
                      + Linha
                    </button>
                  </div>

                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', minWidth: (cols.length + 1) * 120 }}>
                      <thead>
                        <tr style={{ background:'var(--navy)' }}>
                          {/* Coluna de título da linha */}
                          <th style={{ padding:'8px 10px', color:'var(--gold)', fontSize:11, fontWeight:700, textAlign:'left', whiteSpace:'nowrap', minWidth:120, borderRight:'2px solid rgba(200,151,42,0.4)' }}>
                            Título da Linha
                          </th>
                          {cols.map((col, ci) => (
                            <th key={ci} style={{ padding:'8px 10px', color:'white', fontSize:11, fontWeight:700, textAlign:'left', whiteSpace:'nowrap' }}>
                              {col}
                            </th>
                          ))}
                          <th style={{ width:32 }} />
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={ri} style={{ background: ri%2===0 ? 'white' : 'var(--bg-light)' }}>
                            {/* Input título da linha */}
                            <td style={{ padding:'4px 6px', borderBottom:'1px solid var(--border-gray)', borderRight:'2px solid var(--border-gray)' }}>
                              <input
                                className="form-input"
                                style={{ padding:'6px 8px', fontSize:12, fontWeight:600, minWidth:100, background: 'rgba(200,151,42,0.06)' }}
                                value={rowHeaders[ri] ?? ''}
                                onChange={e => setRowHeader(ri, e.target.value)}
                                placeholder="Título..."
                              />
                            </td>
                            {cols.map((_, ci) => (
                              <td key={ci} style={{ padding:'4px 6px', borderBottom:'1px solid var(--border-gray)' }}>
                                <input
                                  className="form-input"
                                  style={{ padding:'6px 8px', fontSize:12, minWidth:80 }}
                                  value={row[ci] ?? ''}
                                  onChange={e => setCell(ri, ci, e.target.value)}
                                  placeholder="—"
                                />
                              </td>
                            ))}
                            <td style={{ padding:'4px 6px', textAlign:'center' }}>
                              {rows.length > 1 && (
                                <button onClick={() => removeRow(ri)}
                                  style={{ background:'none', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:14 }}>🗑</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {calibMsg && (
                  <div style={{
                    padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12,
                    background: calibMsg.type==='success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                    color:      calibMsg.type==='success' ? 'var(--success)'    : 'var(--danger)',
                    border:     `1px solid ${calibMsg.type==='success' ? '#86efac' : '#fca5a5'}`,
                  }}>
                    {calibMsg.type==='success' ? '✓ ' : '✕ '}{calibMsg.text}
                  </div>
                )}
              </div>

              <div className="admin-prod-modal__footer" style={{ gap:10 }}>
                <button className="btn btn-outline" onClick={() => setShowCalibModal(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={calibSaving}
                  onClick={() => {
                    if (!calibForm.title.trim()) { setCalibMsg({ type:'error', text:'O título é obrigatório.' }); return; }
                    if (calibForm.columns.length === 0) { setCalibMsg({ type:'error', text:'Adicione ao menos uma coluna.' }); return; }
                    if (editingCalib) {
                      setCalibDraft(prev => prev.map(x => x.id === editingCalib.id ? {...x,...calibForm} : x));
                    } else {
                      const tempId = `temp_${Date.now()}`;
                      setCalibDraft(prev => [...prev, { id: tempId, ...calibForm }]);
                    }
                    setCalibHasDraft(true);
                    setCalibMsg({ type:'success', text: editingCalib ? 'Tabela editada! Clique em Publicar para salvar.' : 'Tabela adicionada! Clique em Publicar para salvar.' });
                    setTimeout(() => setShowCalibModal(false), 800);
                  }}>
                  💾 Salvar Rascunho
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Modal Notícia ── */}
      {showNewsModal && (
        <div className="admin-prod-modal__overlay" onClick={() => setShowNewsModal(false)}>
          <div className="admin-prod-modal" style={{ maxWidth:580 }} onClick={e => e.stopPropagation()}>
            <div className="admin-prod-modal__header">
              <h2>{editingNews ? '✏ Editar Notícia' : '+ Nova Notícia'}</h2>
              <button className="produto-modal__close" style={{ color:'white', background:'rgba(255,255,255,0.1)' }}
                onClick={() => setShowNewsModal(false)}>✕</button>
            </div>
            <div className="admin-prod-modal__body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Título <span style={{color:'var(--danger)'}}>*</span></label>
                  <input className="form-input" placeholder="Título da notícia" value={newsForm.title}
                    onChange={e => setNewsForm(p=>({...p, title:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Categoria</label>
                  <input className="form-input" placeholder="Ex: Evento, Certificação" value={newsForm.category}
                    onChange={e => setNewsForm(p=>({...p, category:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Autor</label>
                  <input className="form-input" placeholder="Ex: Redação" value={newsForm.author}
                    onChange={e => setNewsForm(p=>({...p, author:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Data de Publicação</label>
                  <input className="form-input" type="date" value={newsForm.published_at?.split('T')[0] ?? ''}
                    onChange={e => setNewsForm(p=>({...p, published_at:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Ordem de Exibição</label>
                  <input className="form-input" type="number" min={0} value={newsForm.sort_order}
                    onChange={e => setNewsForm(p=>({...p, sort_order:Number(e.target.value)}))} />
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Imagem de Capa</label>

                  {/* Preview capa */}
                  {newsForm.image_url && (
                    <div style={{ position:'relative', marginBottom:8 }}>
                      <img src={newsForm.image_url} alt="capa" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8, display:'block' }} />
                      <button onClick={() => setNewsForm(p=>({...p, image_url:''}))}
                        style={{ position:'absolute', top:6, right:6, background:'rgba(220,38,38,0.85)', color:'white', border:'none', borderRadius:'50%', width:24, height:24, cursor:'pointer', fontSize:14, lineHeight:'24px', textAlign:'center' }}>✕</button>
                    </div>
                  )}

                  {/* Botões upload / URL */}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <input ref={newsMainImgRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setNewsImgUploading(true);
                        const url = await uploadNewsImage(file);
                        if (url) setNewsForm(p=>({...p, image_url:url}));
                        else setNewsMsg({ type:'error', text:'Erro ao fazer upload da imagem.' });
                        setNewsImgUploading(false);
                        e.target.value='';
                      }} />
                    <button className="btn admin__upload-btn" disabled={newsImgUploading}
                      onClick={() => newsMainImgRef.current?.click()}>
                      {newsImgUploading ? '⏳ Enviando...' : '📁 Carregar do dispositivo'}
                    </button>
                  </div>
                  <input className="form-input" style={{ marginTop:8 }} placeholder="Ou cole a URL da imagem..."
                    value={newsForm.image_url?.startsWith('http') ? newsForm.image_url : ''}
                    onChange={e => setNewsForm(p=>({...p, image_url:e.target.value}))} />
                </div>

                {/* Imagens extras */}
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Imagens Extras</label>
                  <p className="admin__hint" style={{ marginBottom:8 }}>Galeria adicional exibida na notícia.</p>

                  {/* Grid de extras */}
                  {(newsForm.extra_images ?? []).length > 0 && (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))', gap:8, marginBottom:8 }}>
                      {(newsForm.extra_images ?? []).map((url, idx) => (
                        <div key={idx} style={{ position:'relative' }}>
                          <img src={url} alt="" style={{ width:'100%', height:64, objectFit:'cover', borderRadius:6, display:'block' }} />
                          <button onClick={() => setNewsForm(p=>({...p, extra_images: (p.extra_images??[]).filter((_,i)=>i!==idx)}))}
                            style={{ position:'absolute', top:2, right:2, background:'rgba(220,38,38,0.85)', color:'white', border:'none', borderRadius:'50%', width:18, height:18, cursor:'pointer', fontSize:11, lineHeight:'18px', textAlign:'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input ref={newsExtraImgRef} type="file" accept="image/*" multiple style={{ display:'none' }}
                    onChange={async e => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      setNewsImgUploading(true);
                      const urls = await Promise.all(files.map(f => uploadNewsImage(f)));
                      const valid = urls.filter(Boolean) as string[];
                      setNewsForm(p=>({...p, extra_images:[...(p.extra_images??[]),...valid]}));
                      if (valid.length < files.length) setNewsMsg({ type:'error', text:'Alguns uploads falharam.' });
                      setNewsImgUploading(false);
                      e.target.value='';
                    }} />
                  <button className="btn admin__upload-btn" disabled={newsImgUploading}
                    onClick={() => newsExtraImgRef.current?.click()}>
                    {newsImgUploading ? '⏳ Enviando...' : '📁 Adicionar imagens extras'}
                  </button>
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Resumo</label>
                  <textarea className="form-input" rows={2} placeholder="Breve resumo da notícia..." value={newsForm.summary}
                    onChange={e => setNewsForm(p=>({...p, summary:e.target.value}))} style={{ resize:'vertical' }} />
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Conteúdo Completo</label>
                  <textarea className="form-input" rows={6} placeholder="Conteúdo completo da notícia..." value={newsForm.content}
                    onChange={e => setNewsForm(p=>({...p, content:e.target.value}))} style={{ resize:'vertical' }} />
                  <p className="admin__hint">Exibido ao clicar em "Leia mais".</p>
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10 }}>
                  <input type="checkbox" id="news-active" checked={newsForm.active}
                    onChange={e => setNewsForm(p=>({...p, active:e.target.checked}))}
                    style={{ width:18, height:18, cursor:'pointer' }} />
                  <label htmlFor="news-active" style={{ fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--navy)' }}>
                    Notícia ativa (visível no site)
                  </label>
                </div>
              </div>

              {newsMsg && (
                <div style={{
                  padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12,
                  background: newsMsg.type==='success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color:      newsMsg.type==='success' ? 'var(--success)'    : 'var(--danger)',
                  border:     `1px solid ${newsMsg.type==='success' ? '#86efac' : '#fca5a5'}`,
                }}>
                  {newsMsg.type==='success' ? '✓ ' : '✕ '}{newsMsg.text}
                </div>
              )}
            </div>
            <div className="admin-prod-modal__footer" style={{ gap:10 }}>
              <button className="btn btn-outline" onClick={() => setShowNewsModal(false)}>Cancelar</button>
              <button className="btn btn-primary"
                onClick={() => {
                  if (!newsForm.title.trim()) {
                    setNewsMsg({ type:'error', text:'O título é obrigatório.' });
                    return;
                  }
                  if (editingNews) {
                    // Atualiza no draft local
                    setNewsDraft(prev => prev.map(x => x.id === editingNews.id ? {...x,...newsForm} : x));
                  } else {
                    // Adiciona com ID temporário no draft local
                    const tempId = `temp_${Date.now()}`;
                    setNewsDraft(prev => [...prev, { id: tempId, ...newsForm }]);
                  }
                  setNewsHasDraft(true);
                  setNewsMsg({ type:'success', text: editingNews ? 'Notícia editada! Clique em Publicar para salvar.' : 'Notícia adicionada! Clique em Publicar para salvar.' });
                  setTimeout(() => setShowNewsModal(false), 800);
                }}>
                💾 Salvar Rascunho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Contato ── */}
      {showContactModal && (
        <div className="admin-prod-modal__overlay" onClick={() => setShowContactModal(false)}>
          <div className="admin-prod-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="admin-prod-modal__header">
              <h2>{editingContact ? '✏ Editar Contato' : '+ Novo Contato'}</h2>
              <button className="produto-modal__close" style={{ color:'white', background:'rgba(255,255,255,0.1)' }}
                onClick={() => setShowContactModal(false)}>✕</button>
            </div>
            <div className="admin-prod-modal__body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Nome <span style={{color:'var(--danger)'}}>*</span></label>
                  <input className="form-input" placeholder="Nome completo" value={contactForm.name}
                    onChange={e => setContactForm(p=>({...p, name:e.target.value}))} />
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Cargo / Função</label>
                  <input className="form-input" placeholder="Ex: Diretor Operacional" value={contactForm.role}
                    onChange={e => setContactForm(p=>({...p, role:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" type="email" placeholder="email@empresa.com" value={contactForm.email}
                    onChange={e => setContactForm(p=>({...p, email:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Telefone</label>
                  <input className="form-input" placeholder="(00) 0000-0000" value={contactForm.phone}
                    onChange={e => setContactForm(p=>({...p, phone:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Celular</label>
                  <input className="form-input" placeholder="(00) 00000-0000" value={contactForm.mobile}
                    onChange={e => setContactForm(p=>({...p, mobile:e.target.value}))} />
                </div>
                <div className="admin__field">
                  <label className="form-label">Ordem de exibição</label>
                  <input className="form-input" type="number" min={0} value={contactForm.sort_order}
                    onChange={e => setContactForm(p=>({...p, sort_order:Number(e.target.value)}))} />
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Endereço</label>
                  <input className="form-input" placeholder="Rua, número — Cidade, UF" value={contactForm.address}
                    onChange={e => setContactForm(p=>({...p, address:e.target.value}))} />
                </div>
                <div className="admin__field" style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10 }}>
                  <input type="checkbox" id="contact-active" checked={contactForm.active}
                    onChange={e => setContactForm(p=>({...p, active:e.target.checked}))}
                    style={{ width:18, height:18, cursor:'pointer' }} />
                  <label htmlFor="contact-active" style={{ fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--navy)' }}>
                    Contato ativo (visível no site)
                  </label>
                </div>
              </div>

              {contactMsg && (
                <div style={{
                  padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12,
                  background: contactMsg.type==='success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color:      contactMsg.type==='success' ? 'var(--success)'    : 'var(--danger)',
                  border:     `1px solid ${contactMsg.type==='success' ? '#86efac' : '#fca5a5'}`,
                }}>
                  {contactMsg.type==='success' ? '✓ ' : '✕ '}{contactMsg.text}
                </div>
              )}
            </div>
            <div className="admin-prod-modal__footer" style={{ gap:10 }}>
              <button className="btn btn-outline" onClick={() => setShowContactModal(false)}>Cancelar</button>
              <button className="btn btn-primary"
                onClick={() => {
                  if (!contactForm.name.trim()) {
                    setContactMsg({ type:'error', text:'O nome é obrigatório.' });
                    return;
                  }
                  if (editingContact) {
                    setContactsDraft(prev => prev.map(x => x.id === editingContact.id ? {...x,...contactForm} : x));
                  } else {
                    const tempId = `temp_${Date.now()}`;
                    setContactsDraft(prev => [...prev, { id: tempId, ...contactForm }]);
                  }
                  setContactsHasDraft(true);
                  setContactMsg({ type:'success', text: editingContact ? 'Contato editado! Clique em Publicar para salvar.' : 'Contato adicionado! Clique em Publicar para salvar.' });
                  setTimeout(() => setShowContactModal(false), 800);
                }}>
                💾 Salvar Rascunho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Acesso ── */}
      {showAcessoModal && (
        <div className="admin-prod-modal__overlay" onClick={() => { setShowAcessoModal(false); setAcessoMsg(null); }}>
          <div className="admin-prod-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

            <div className="admin-prod-modal__header">
              <h2>⚙ Meu Acesso</h2>
              <button className="produto-modal__close" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}
                onClick={() => { setShowAcessoModal(false); setAcessoMsg(null); }}>✕</button>
            </div>

            <div className="admin-prod-modal__body">
              <div className="admin__field">
                <label className="form-label">Nome</label>
                <input className="form-input" value={acessoName} onChange={e => setAcessoName(e.target.value)} placeholder="Seu nome" />
              </div>
              <div className="admin__field">
                <label className="form-label">E-mail</label>
                <input className="form-input" type="email" value={acessoEmail} onChange={e => setAcessoEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
              <div className="admin__field">
                <label className="form-label">Nova Senha <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: 11 }}>(deixe em branco para manter a atual)</span></label>
                <input className="form-input" type="password" value={acessoPassword} onChange={e => setAcessoPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="admin__field">
                <label className="form-label">Confirmar Nova Senha</label>
                <input className="form-input" type="password" value={acessoConfirm} onChange={e => setAcessoConfirm(e.target.value)} placeholder="••••••••" />
              </div>

              {acessoMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, fontSize: 13,
                  background: acessoMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color:      acessoMsg.type === 'success' ? 'var(--success)'    : 'var(--danger)',
                  border:     `1px solid ${acessoMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                }}>
                  {acessoMsg.type === 'success' ? '✓ ' : '✕ '}{acessoMsg.text}
                </div>
              )}
            </div>

            <div className="admin-prod-modal__footer" style={{ gap: 10 }}>
              <button className="btn btn-outline" onClick={() => { setShowAcessoModal(false); setAcessoMsg(null); }}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                disabled={acessoLoading}
                onClick={async () => {
                  setAcessoMsg(null);
                  if (!acessoName.trim() || !acessoEmail.trim()) {
                    setAcessoMsg({ type: 'error', text: 'Nome e e-mail são obrigatórios.' });
                    return;
                  }
                  if (acessoPassword && acessoPassword !== acessoConfirm) {
                    setAcessoMsg({ type: 'error', text: 'As senhas não coincidem.' });
                    return;
                  }
                  if (acessoPassword && acessoPassword.length < 3) {
                    setAcessoMsg({ type: 'error', text: 'A senha deve ter ao menos 3 caracteres.' });
                    return;
                  }
                  setAcessoLoading(true);
                  try {
                    const updateData: any = {
                      name:  acessoName.trim(),
                      email: acessoEmail.trim().toLowerCase(),
                      updated_at: new Date().toISOString(),
                    };
                    if (acessoPassword) updateData.password = acessoPassword;

                    const { error } = await supabase!
                      .from('admin_users')
                      .update(updateData)
                      .eq('id', authData.id);

                    if (error) throw error;

                    // Atualiza sessionStorage
                    sessionStorage.setItem('admin_auth', JSON.stringify({
                      ...authData,
                      name:  acessoName.trim(),
                      email: acessoEmail.trim().toLowerCase(),
                    }));

                    setAcessoPassword('');
                    setAcessoConfirm('');
                    setAcessoMsg({ type: 'success', text: 'Dados atualizados com sucesso!' });
                  } catch {
                    setAcessoMsg({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
                  } finally {
                    setAcessoLoading(false);
                  }
                }}
              >
                {acessoLoading ? 'Salvando...' : '💾 Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}