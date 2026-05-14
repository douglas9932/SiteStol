import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getCompanySettings, saveCompanySettings, applyCompanyColors, getContacts, saveContact, updateContact, deleteContact, getNews, saveNews, updateNews, deleteNews, uploadNewsImage, getCalibrationTables, saveCalibrationTable, updateCalibrationTable, deleteCalibrationTable } from '@/lib/contentService';
import { useContent } from '@/hooks/useContent';
import './AdminHome.css';
/* ─── Toast ── */
function Toast({ msg }) {
    return _jsx("div", { className: "toast", children: msg });
}
/* ─── Modal de confirmação ── */
function PublishModal({ page, onConfirm, onCancel }) {
    const PAGE_LABEL = {
        home: 'Home (carrossel + descrição)',
        produtos: 'Produtos (cards + cabeçalho)',
    };
    return (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal", children: [_jsx("div", { className: "modal__icon", children: "\uD83D\uDE80" }), _jsx("h2", { className: "modal__title", children: "Publicar altera\u00E7\u00F5es?" }), _jsxs("p", { className: "modal__desc", children: ["O conte\u00FAdo de ", _jsx("strong", { children: PAGE_LABEL[page] ?? page }), " ser\u00E1 imediatamente vis\u00EDvel para todos os visitantes."] }), _jsx("p", { className: "modal__desc modal__desc--sub", children: "Esta a\u00E7\u00E3o substitui o conte\u00FAdo publicado atual." }), _jsxs("div", { className: "modal__actions", children: [_jsx("button", { className: "btn btn-outline", onClick: onCancel, children: "Cancelar" }), _jsx("button", { className: "btn btn-primary", onClick: onConfirm, children: "\u2705 Confirmar Publica\u00E7\u00E3o" })] })] }) }));
}
/* ─── Image Card ── */
function ImageCard({ img, onRemove, onAltChange }) {
    return (_jsxs("div", { className: "admin-img-card", children: [_jsxs("div", { className: "admin-img-card__thumb", children: [_jsx("img", { src: img.url, alt: img.alt }), _jsx("button", { className: "admin-img-card__remove", onClick: () => onRemove(img.id), children: "\u2715" })] }), _jsx("input", { className: "form-input admin-img-card__alt", placeholder: "Texto alternativo...", value: img.alt, onChange: (e) => onAltChange(img.id, e.target.value) })] }));
}
/* ─── Multi-Category Selector (chips) ── */
function CategorySelector({ selected, categories, onChange }) {
    if (categories.length === 0) {
        return _jsxs("p", { className: "cat-selector__empty", children: ["Nenhuma categoria cadastrada. Crie na aba ", _jsx("strong", { style: { color: 'var(--gold)' }, children: "Categorias" }), "."] });
    }
    const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    return (_jsx("div", { className: "cat-selector", children: categories.map((cat) => {
            const active = selected.includes(cat.id);
            return (_jsxs("button", { type: "button", className: `cat-selector__chip ${active ? 'cat-selector__chip--active' : ''}`, style: active ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.color, color: cat.color }, onClick: () => toggle(cat.id), children: [active ? '✓ ' : '', cat.name] }, cat.id));
        }) }));
}
/* ─── Product Row ── */
function ProductRow({ product, categories, onChange, onCategoriesChange, onRemove, onGalleryChange, onSpecsChange, onInfoChange, onDemoImagesChange }) {
    const fileRef = useRef(null);
    const galleryRef = useRef(null);
    const handleImageFile = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (ev) => onChange(product.id, 'image', ev.target?.result);
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    const handleGalleryFiles = (e) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length)
            return;
        const current = product.images ?? [];
        let loaded = 0;
        const results = [];
        files.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                results[i] = ev.target?.result;
                loaded++;
                if (loaded === files.length)
                    onGalleryChange(product.id, [...current, ...results]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };
    const removeGalleryImg = (idx) => {
        onGalleryChange(product.id, (product.images ?? []).filter((_, i) => i !== idx));
    };
    const [galleryUrl, setGalleryUrl] = useState('');
    const addGalleryUrl = (url) => {
        if (!url.trim())
            return;
        onGalleryChange(product.id, [...(product.images ?? []), url.trim()]);
    };
    const demoRef = useRef(null);
    const handleDemoFiles = (e) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length)
            return;
        const current = product.demoImages ?? [];
        let loaded = 0;
        const results = new Array(files.length);
        files.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                results[i] = { url: ev.target?.result, caption: '' };
                loaded++;
                if (loaded === files.length)
                    onDemoImagesChange(product.id, [...current, ...results]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };
    const demoImages = product.demoImages ?? [];
    const updateDemoCaption = (idx, caption) => onDemoImagesChange(product.id, demoImages.map((d, i) => i === idx ? { ...d, caption } : d));
    const removeDemoImg = (idx) => onDemoImagesChange(product.id, demoImages.filter((_, i) => i !== idx));
    // Helpers para accordion items
    const updateAccordion = (list, idx, field, value) => list.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    const specs = product.specifications ?? [];
    const info = product.info ?? [];
    const [activeInnerTab, setActiveInnerTab] = useState('descricao');
    return (_jsxs("div", { className: "admin-product-row", children: [_jsxs("div", { className: "admin-prod-row__head", children: [_jsx("input", { className: "form-input", placeholder: "T\u00EDtulo do produto...", value: product.title, onChange: (e) => onChange(product.id, 'title', e.target.value) }), _jsx("input", { className: "form-input admin-product-row__tag", placeholder: "Tag (ex: Principal)", value: product.tag ?? '', onChange: (e) => onChange(product.id, 'tag', e.target.value) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => onRemove(product.id), children: "\u2715" })] }), _jsxs("div", { className: "admin-prod-row__cols", children: [_jsxs("div", { className: "admin-prod-row__left", children: [_jsx("span", { className: "admin-product-row__cats-label", style: { alignSelf: 'flex-start' }, children: "Foto Principal" }), _jsx("div", { className: "admin-product-row__img-preview", children: product.image
                                    ? _jsx("img", { src: product.image, alt: product.title })
                                    : _jsx("span", { children: "\uD83D\uDCE6" }) }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", style: { display: 'none' }, onChange: handleImageFile }), _jsx("button", { className: "btn admin__upload-btn", style: { fontSize: '11px', padding: '6px 10px', width: '100%' }, onClick: () => fileRef.current?.click(), children: "\uD83D\uDCC1 Carregar foto" }), product.image && (_jsx("button", { className: "btn btn-danger", style: { fontSize: '11px', padding: '5px 10px', width: '100%' }, onClick: () => onChange(product.id, 'image', ''), children: "\uD83D\uDDD1 Remover foto" })), _jsx("input", { className: "form-input", style: { fontSize: '11px' }, placeholder: "Ou cole URL...", value: product.image?.startsWith('data:') ? '' : (product.image ?? ''), onChange: (e) => onChange(product.id, 'image', e.target.value) }), _jsxs("div", { style: { width: '100%', borderTop: '1px solid var(--border-gray)', paddingTop: 12 }, children: [_jsx("span", { className: "admin-product-row__cats-label", children: "Categorias" }), _jsx("div", { style: { marginTop: 8 }, children: _jsx(CategorySelector, { selected: product.categoryIds ?? [], categories: categories, onChange: (ids) => onCategoriesChange(product.id, ids) }) })] })] }), _jsxs("div", { className: "admin-prod-row__right", children: [_jsx("div", { className: "admin-prod-tabs", children: [
                                    { key: 'descricao', label: '📝 Descrição' },
                                    { key: 'galeria', label: '🖼 Galeria' },
                                    { key: 'specs', label: '📋 Espec./Info.' },
                                    { key: 'demo', label: '📸 Demonstrativo' },
                                ].map(({ key, label }) => (_jsx("button", { className: `admin-prod-tab ${activeInnerTab === key ? 'admin-prod-tab--active' : ''}`, onClick: () => setActiveInnerTab(key), children: label }, key))) }), _jsxs("div", { className: "admin-prod-tab-body", children: [activeInnerTab === 'descricao' && (_jsx("textarea", { className: "form-textarea", rows: 12, placeholder: "Descri\u00E7\u00E3o completa do produto...", value: product.description, onChange: (e) => onChange(product.id, 'description', e.target.value) })), activeInnerTab === 'galeria' && (_jsxs(_Fragment, { children: [(product.images ?? []).length > 0 && (_jsx("div", { className: "admin__img-grid", children: (product.images ?? []).map((img, idx) => (_jsx("div", { className: "admin-img-card", children: _jsxs("div", { className: "admin-img-card__thumb", children: [_jsx("img", { src: img, alt: `galeria ${idx + 1}` }), _jsx("button", { className: "admin-img-card__remove", onClick: () => onGalleryChange(product.id, (product.images ?? []).filter((_, i) => i !== idx)), children: "\u2715" })] }) }, idx))) })), _jsxs("div", { className: "admin__add-url", children: [_jsx("input", { ref: galleryRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleGalleryFiles }), _jsx("button", { className: "btn admin__upload-btn", onClick: () => galleryRef.current?.click(), children: "\uD83D\uDCC1 Carregar imagens" }), _jsx("input", { className: "form-input", style: { fontSize: '12px', flex: 1 }, placeholder: "Ou cole URL e Enter...", value: galleryUrl, onChange: (e) => setGalleryUrl(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                                                            addGalleryUrl(galleryUrl);
                                                            setGalleryUrl('');
                                                        } } }), _jsx("button", { className: "btn btn-primary", style: { fontSize: '12px', padding: '8px 14px' }, onClick: () => { addGalleryUrl(galleryUrl); setGalleryUrl(''); }, children: "+ Add" })] })] })), activeInnerTab === 'specs' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("div", { className: "admin-product-row__accordion-header", children: [_jsx("span", { className: "admin-product-row__cats-label", children: "\uD83D\uDCCB Especifica\u00E7\u00F5es" }), _jsx("button", { className: "btn btn-primary", style: { fontSize: '11px', padding: '5px 12px' }, onClick: () => onSpecsChange(product.id, [...specs, { label: '', content: '' }]), children: "+ Adicionar" })] }), specs.map((item, idx) => (_jsxs("div", { className: "admin-accordion-row", children: [_jsx("input", { className: "form-input", placeholder: "R\u00F3tulo (ex: Material)", value: item.label, onChange: (e) => onSpecsChange(product.id, updateAccordion(specs, idx, 'label', e.target.value)) }), _jsx("textarea", { className: "form-textarea", rows: 1, style: { minHeight: 38, maxHeight: 80, resize: 'vertical' }, placeholder: "Conte\u00FAdo...", value: item.content, onChange: (e) => onSpecsChange(product.id, updateAccordion(specs, idx, 'content', e.target.value)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '6px 10px', alignSelf: 'flex-start' }, onClick: () => onSpecsChange(product.id, specs.filter((_, i) => i !== idx)), children: "\u2715" })] }, idx)))] }), _jsxs("div", { style: { borderTop: '1px solid var(--border-gray)', paddingTop: 14 }, children: [_jsxs("div", { className: "admin-product-row__accordion-header", children: [_jsx("span", { className: "admin-product-row__cats-label", children: "\u2139\uFE0F Informa\u00E7\u00F5es" }), _jsx("button", { className: "btn btn-primary", style: { fontSize: '11px', padding: '5px 12px' }, onClick: () => onInfoChange(product.id, [...info, { label: '', content: '' }]), children: "+ Adicionar" })] }), info.map((item, idx) => (_jsxs("div", { className: "admin-accordion-row", children: [_jsx("input", { className: "form-input", placeholder: "R\u00F3tulo (ex: Compatibilidade)", value: item.label, onChange: (e) => onInfoChange(product.id, updateAccordion(info, idx, 'label', e.target.value)) }), _jsx("textarea", { className: "form-textarea", rows: 1, style: { minHeight: 38, maxHeight: 80, resize: 'vertical' }, placeholder: "Conte\u00FAdo...", value: item.content, onChange: (e) => onInfoChange(product.id, updateAccordion(info, idx, 'content', e.target.value)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '6px 10px', alignSelf: 'flex-start' }, onClick: () => onInfoChange(product.id, info.filter((_, i) => i !== idx)), children: "\u2715" })] }, idx)))] })] })), activeInnerTab === 'demo' && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx("p", { className: "admin__hint", style: { margin: 0 }, children: "Descri\u00E7\u00E3o \u00E9 opcional \u2014 aparece no site s\u00F3 se preenchida." }), _jsx("input", { ref: demoRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleDemoFiles }), _jsx("button", { className: "btn admin__upload-btn", style: { fontSize: '12px', padding: '7px 14px', flexShrink: 0 }, onClick: () => demoRef.current?.click(), children: "\uD83D\uDCC1 Adicionar Imagens" })] }), demoImages.length > 0 ? (_jsx("div", { className: "admin-demo-grid", children: demoImages.map((d, idx) => (_jsxs("div", { className: "admin-demo-item", children: [_jsxs("div", { className: "admin-demo-item__img", children: [_jsx("img", { src: d.url, alt: `demo ${idx + 1}` }), _jsx("button", { className: "admin-img-card__remove", onClick: () => removeDemoImg(idx), children: "\u2715" })] }), _jsx("input", { className: "form-input", style: { fontSize: '12px', marginTop: 6 }, placeholder: "Descri\u00E7\u00E3o (opcional)...", value: d.caption ?? '', onChange: (e) => updateDemoCaption(idx, e.target.value) })] }, idx))) })) : (_jsx("p", { style: { fontSize: '13px', color: 'var(--gray-400)' }, children: "Nenhuma imagem demonstrativa. Clique em \"Adicionar Imagens\"." }))] }))] })] })] })] }));
}
/* ─── Category Manager ── */
const PRESET_COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#dc2626', '#0891b2', '#ca8a04', '#be185d', '#475569', '#0a1628'];
function CategoryManager({ categories, onAdd, onUpdate, onRemove, showToast }) {
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');
    const handleAdd = () => {
        if (!newName.trim())
            return;
        onAdd(newName, newColor);
        setNewName('');
        setNewColor(PRESET_COLORS[0]);
        showToast('✅ Categoria criada!');
    };
    const startEdit = (cat) => { setEditingId(cat.id); setEditName(cat.name); setEditColor(cat.color); };
    const saveEdit = () => {
        if (!editName.trim() || editingId === null)
            return;
        onUpdate(editingId, editName, editColor);
        setEditingId(null);
        showToast('✅ Categoria atualizada!');
    };
    return (_jsxs("div", { className: "cat-manager", children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u2795 Nova Categoria" }), _jsxs("div", { className: "cat-manager__add-row", children: [_jsx("input", { className: "form-input", placeholder: "Nome da categoria (ex: Avia\u00E7\u00E3o Agr\u00EDcola)...", value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleAdd() }), _jsxs("div", { className: "cat-manager__color-pick", children: [_jsx("span", { className: "form-label", style: { marginBottom: 0 }, children: "Cor:" }), _jsx("div", { className: "cat-manager__presets", children: PRESET_COLORS.map((c) => (_jsx("button", { type: "button", className: `cat-manager__preset-dot ${newColor === c ? 'cat-manager__preset-dot--active' : ''}`, style: { background: c }, onClick: () => setNewColor(c) }, c))) }), _jsx("input", { type: "color", className: "cat-manager__color-input", value: newColor, onChange: (e) => setNewColor(e.target.value), title: "Cor personalizada" })] }), _jsx("div", { className: "cat-manager__preview-chip", style: { background: newColor }, children: newName || 'Prévia' }), _jsx("button", { className: "btn btn-primary", onClick: handleAdd, disabled: !newName.trim(), children: "+ Criar" })] })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFF7 Categorias Cadastradas" }), _jsx("p", { className: "admin__section-desc", children: "Edite nome e cor, ou remova. Ao remover, produtos s\u00E3o desvinculados automaticamente." })] }), _jsxs("span", { className: "admin__count", children: [categories.length, " categoria", categories.length !== 1 ? 's' : ''] })] }), categories.length === 0 ? (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83C\uDFF7" }), _jsx("p", { children: "Nenhuma categoria. Crie a primeira acima!" })] })) : (_jsx("div", { className: "cat-manager__list", children: categories.map((cat) => (_jsx("div", { className: "cat-manager__row", children: editingId === cat.id ? (_jsxs("div", { className: "cat-manager__edit", children: [_jsx("input", { className: "form-input cat-manager__edit-name", value: editName, onChange: (e) => setEditName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && saveEdit(), autoFocus: true }), _jsx("div", { className: "cat-manager__presets", children: PRESET_COLORS.map((c) => (_jsx("button", { type: "button", className: `cat-manager__preset-dot ${editColor === c ? 'cat-manager__preset-dot--active' : ''}`, style: { background: c }, onClick: () => setEditColor(c) }, c))) }), _jsx("input", { type: "color", className: "cat-manager__color-input", value: editColor, onChange: (e) => setEditColor(e.target.value) }), _jsx("button", { className: "btn btn-primary", onClick: saveEdit, children: "\u2713 Salvar" }), _jsx("button", { className: "btn btn-outline", onClick: () => setEditingId(null), children: "Cancelar" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "cat-manager__chip", style: { background: cat.color }, children: cat.name }), _jsxs("div", { className: "cat-manager__row-actions", children: [_jsx("button", { className: "btn cat-manager__btn-edit", onClick: () => startEdit(cat), children: "\u270F Editar" }), _jsx("button", { className: "btn btn-danger", onClick: () => { onRemove(cat.id); showToast('🗑 Categoria removida.'); }, children: "\uD83D\uDDD1 Remover" })] })] })) }, cat.id))) }))] })] }));
}
/* ─── MAIN ─────────────────────────────────────────────────────────────────── */
export default function AdminHome() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { content, updateDraft, publishDirect, discardDraft, addCategory, updateCategory, removeCategory } = useContent();
    const [homeImages, setHomeImages] = useState(structuredClone(content.draft.home?.carouselImages ?? []));
    const [homeText, setHomeText] = useState(content.draft.home?.companyDescription ?? '');
    const [carouselTagline, setCarouselTagline] = useState(content.draft.home?.carouselTagline ?? '');
    const [carouselTitle, setCarouselTitle] = useState(content.draft.home?.carouselTitle ?? '');
    const [carouselSubtitle, setCarouselSubtitle] = useState(content.draft.home?.carouselSubtitle ?? '');
    const [sobreTitle, setSobreTitle] = useState(content.draft.home?.sobreTitle ?? '');
    const [stats, setStats] = useState(structuredClone(content.draft.home?.stats ?? []));
    const [featuresTitle, setFeaturesTitle] = useState(content.draft.home?.featuresTitle ?? '');
    const [features, setFeatures] = useState(structuredClone(content.draft.home?.features ?? []));
    const [products, setProducts] = useState(Array.isArray(content.draft.products?.products) ? structuredClone(content.draft.products.products) : []);
    const [prodHeadline, setProdHeadline] = useState(content.draft.products?.headline ?? '');
    const [prodSubline, setProdSubline] = useState(content.draft.products?.subheadline ?? '');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [toast, setToast] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [prodSearch, setProdSearch] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [showAcessoModal, setShowAcessoModal] = useState(false);
    // ── Empresa ──
    const [company, setCompany] = useState({ name: '', icon_url: '', color_primary: '#0a1628', color_secondary: '#c8972a', description: '', cnpj: '' });
    const [companyDraft, setCompanyDraft] = useState({ name: '', icon_url: '', color_primary: '#0a1628', color_secondary: '#c8972a', description: '', cnpj: '' });
    const [companyHasDraft, setCompanyHasDraft] = useState(false);
    const [companySaving, setCompanySaving] = useState(false);
    const [companyMsg, setCompanyMsg] = useState(null);
    const companyIconRef = useRef(null);
    // ── Contatos ──
    const [contacts, setContacts] = useState([]);
    const [contactsDraft, setContactsDraft] = useState([]);
    const [contactsHasDraft, setContactsHasDraft] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '', role: '', email: '', phone: '', mobile: '', address: '', active: true, sort_order: 0,
    });
    const [contactSaving, setContactSaving] = useState(false);
    const [contactMsg, setContactMsg] = useState(null);
    useEffect(() => {
        getContacts().then(data => { setContacts(data); setContactsDraft(data); });
    }, []);
    // ── Notícias ──
    const defaultNewsForm = () => ({
        title: '', summary: '', content: '', image_url: '', extra_images: [], author: '',
        category: '', active: true, sort_order: 0,
        published_at: new Date().toISOString().split('T')[0],
    });
    const [news, setNews] = useState([]);
    const [newsDraft, setNewsDraft] = useState([]); // rascunho local
    const [newsHasDraft, setNewsHasDraft] = useState(false); // dirty flag
    const [editingNews, setEditingNews] = useState(null);
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [newsForm, setNewsForm] = useState(defaultNewsForm());
    const [newsPublishing, setNewsPublishing] = useState(false);
    const [newsMsg, setNewsMsg] = useState(null);
    const [newsImgUploading, setNewsImgUploading] = useState(false);
    const newsMainImgRef = useRef(null);
    const newsExtraImgRef = useRef(null);
    useEffect(() => {
        getNews().then(data => { setNews(data); setNewsDraft(data); });
    }, []);
    // ── Calibração ──
    const defaultCalibForm = () => ({
        title: '', description: '', columns: ['Coluna 1', 'Coluna 2', 'Coluna 3'],
        row_headers: [''],
        rows: [['', '', '']], active: true, sort_order: 0,
    });
    const [calibTables, setCalibTables] = useState([]);
    const [calibDraft, setCalibDraft] = useState([]);
    const [calibHasDraft, setCalibHasDraft] = useState(false);
    const [editingCalib, setEditingCalib] = useState(null);
    const [showCalibModal, setShowCalibModal] = useState(false);
    const [calibForm, setCalibForm] = useState(defaultCalibForm());
    const [calibSaving, setCalibSaving] = useState(false);
    const [calibMsg, setCalibMsg] = useState(null);
    useEffect(() => {
        getCalibrationTables().then(data => { setCalibTables(data); setCalibDraft(data); });
    }, []);
    useEffect(() => {
        getCompanySettings().then(s => { setCompany(s); setCompanyDraft(s); applyCompanyColors(s); });
    }, []);
    const authData = JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}');
    const [acessoName, setAcessoName] = useState(authData.name ?? '');
    const [acessoEmail, setAcessoEmail] = useState(authData.email ?? '');
    const [acessoPassword, setAcessoPassword] = useState('');
    const [acessoConfirm, setAcessoConfirm] = useState('');
    const [acessoLoading, setAcessoLoading] = useState(false);
    const [acessoMsg, setAcessoMsg] = useState(null);
    // ── Sobre state ──
    const [sobreHeroTitle, setSobreHeroTitle] = useState(content.draft.sobre?.heroTitle ?? 'Sobre a AeroTech Brasil');
    const [sobreHeroSubtitle, setSobreHeroSubtitle] = useState(content.draft.sobre?.heroSubtitle ?? '');
    const [especialidades, setEspecialidades] = useState(structuredClone(content.draft.sobre?.especialidades ?? []));
    const [timelineTitle, setTimelineTitle] = useState(content.draft.sobre?.timelineTitle ?? 'Uma história de crescimento');
    const [timeline, setTimeline] = useState(structuredClone(content.draft.sobre?.timeline ?? []));
    const [activeTab, setActiveTab] = useState(() => {
        const t = searchParams.get('tab');
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
        setCarouselTagline(content.draft.home.carouselTagline ?? '');
        setCarouselTitle(content.draft.home.carouselTitle ?? '');
        setCarouselSubtitle(content.draft.home.carouselSubtitle ?? '');
        setSobreTitle(content.draft.home.sobreTitle ?? '');
        setStats(structuredClone(content.draft.home.stats ?? []));
        setFeaturesTitle(content.draft.home.featuresTitle ?? '');
        setFeatures(structuredClone(content.draft.home.features ?? []));
        setProducts(Array.isArray(content.draft.products?.products) ? structuredClone(content.draft.products.products) : []);
        setProdHeadline(content.draft.products.headline);
        setProdSubline(content.draft.products.subheadline);
        setSobreHeroTitle(content.draft.sobre?.heroTitle ?? '');
        setSobreHeroSubtitle(content.draft.sobre?.heroSubtitle ?? '');
        setEspecialidades(structuredClone(content.draft.sobre?.especialidades ?? []));
        setTimelineTitle(content.draft.sobre?.timelineTitle ?? '');
        setTimeline(structuredClone(content.draft.sobre?.timeline ?? []));
        // Depende do objeto draft inteiro — dispara quando o Supabase atualiza
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content.draft]);
    useEffect(() => {
        const t = searchParams.get('tab');
        if (t === 'home' || t === 'produtos' || t === 'categorias')
            setActiveTab(t);
    }, [searchParams]);
    const showToast = useCallback((msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    }, []);
    const isDirty = (() => {
        if (activeTab === 'home') {
            const pub = content.published.home;
            return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages)
                || homeText !== pub.companyDescription
                || carouselTagline !== (pub.carouselTagline ?? '')
                || carouselTitle !== (pub.carouselTitle ?? '')
                || carouselSubtitle !== (pub.carouselSubtitle ?? '')
                || sobreTitle !== (pub.sobreTitle ?? '')
                || JSON.stringify(stats) !== JSON.stringify(pub.stats ?? [])
                || featuresTitle !== (pub.featuresTitle ?? '')
                || JSON.stringify(features) !== JSON.stringify(pub.features ?? []);
        }
        if (activeTab === 'sobre') {
            const pub = content.published.sobre ?? {};
            return sobreHeroTitle !== (pub.heroTitle ?? '')
                || sobreHeroSubtitle !== (pub.heroSubtitle ?? '')
                || JSON.stringify(especialidades) !== JSON.stringify(pub.especialidades ?? [])
                || timelineTitle !== (pub.timelineTitle ?? '')
                || JSON.stringify(timeline) !== JSON.stringify(pub.timeline ?? []);
        }
        if (activeTab === 'produtos') {
            const pub = content.published.products;
            return JSON.stringify(products) !== JSON.stringify(pub.products) || prodHeadline !== pub.headline || prodSubline !== pub.subheadline;
        }
        if (activeTab === 'noticias')
            return newsHasDraft;
        if (activeTab === 'calibracao')
            return calibHasDraft;
        if (activeTab === 'contatos')
            return contactsHasDraft;
        if (activeTab === 'empresa')
            return companyHasDraft;
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
        }
        else if (activeTab === 'sobre') {
            sessionStorage.setItem('sobre_preview_draft', JSON.stringify(sobrePayload()));
            window.open('/preview?page=sobre', '_blank');
        }
        else if (activeTab === 'produtos') {
            sessionStorage.setItem('produtos_preview_draft', JSON.stringify({ products, headline: prodHeadline, subheadline: prodSubline }));
            window.open('/preview?page=produtos', '_blank');
        }
        else if (activeTab === 'calibracao') {
            sessionStorage.setItem('calib_preview_draft', JSON.stringify(calibDraft));
            window.open('/preview?page=calibracao', '_blank');
        }
        else if (activeTab === 'noticias') {
            sessionStorage.setItem('news_preview_draft', JSON.stringify(newsDraft));
            window.open('/preview?page=noticias', '_blank');
        }
        else if (activeTab === 'contatos') {
            sessionStorage.setItem('contacts_preview_draft', JSON.stringify(contactsDraft));
            window.open('/preview?page=contatos', '_blank');
        }
        else if (activeTab === 'empresa') {
            sessionStorage.setItem('empresa_preview_draft', JSON.stringify(companyDraft));
            window.open('/preview?page=empresa', '_blank');
        }
    };
    const confirmPublish = async () => {
        setShowModal(false);
        if (activeTab === 'home')
            publishDirect('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
        else if (activeTab === 'sobre')
            publishDirect('sobre', sobrePayload());
        else if (activeTab === 'produtos')
            publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
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
                const inserted = await Promise.all(toInsert.map(d => {
                    const { id: _id, ...form } = d;
                    return saveNews(form);
                }));
                // Reconstrói o draft com IDs reais
                const finalDraft = [
                    ...toUpdate,
                    ...inserted.filter(Boolean),
                ].sort((a, b) => a.sort_order - b.sort_order);
                setNews(finalDraft);
                setNewsDraft(finalDraft);
                setNewsHasDraft(false);
                showToast('✅ Notícias publicadas!');
            }
            catch {
                showToast('❌ Erro ao publicar notícias.');
            }
            finally {
                setNewsPublishing(false);
            }
            return;
        }
        else if (activeTab === 'calibracao') {
            try {
                const toDelete = calibTables.filter(t => !calibDraft.find(d => d.id === t.id));
                const toInsert = calibDraft.filter(d => d.id.startsWith('temp_'));
                const toUpdate = calibDraft.filter(d => !d.id.startsWith('temp_'));
                await Promise.all([
                    ...toDelete.map(t => deleteCalibrationTable(t.id)),
                    ...toUpdate.map(t => updateCalibrationTable(t.id, t)),
                ]);
                const inserted = await Promise.all(toInsert.map(d => { const { id: _id, ...form } = d; return saveCalibrationTable(form); }));
                const final = [...toUpdate, ...inserted.filter(Boolean)].sort((a, b) => a.sort_order - b.sort_order);
                setCalibTables(final);
                setCalibDraft(final);
                setCalibHasDraft(false);
                showToast('✅ Tabelas de calibração publicadas!');
            }
            catch {
                showToast('❌ Erro ao publicar.');
            }
            return;
        }
        else if (activeTab === 'contatos') {
            try {
                const toDelete = contacts.filter(c => !contactsDraft.find(d => d.id === c.id));
                const toInsert = contactsDraft.filter(d => d.id.startsWith('temp_'));
                const toUpdate = contactsDraft.filter(d => !d.id.startsWith('temp_'));
                await Promise.all([
                    ...toDelete.map(c => deleteContact(c.id)),
                    ...toUpdate.map(c => updateContact(c.id, c)),
                ]);
                const inserted = await Promise.all(toInsert.map(d => { const { id: _id, ...form } = d; return saveContact(form); }));
                const final = [...toUpdate, ...inserted.filter(Boolean)].sort((a, b) => a.sort_order - b.sort_order);
                setContacts(final);
                setContactsDraft(final);
                setContactsHasDraft(false);
                showToast('✅ Contatos publicados!');
            }
            catch {
                showToast('❌ Erro ao publicar contatos.');
            }
            return;
        }
        else if (activeTab === 'empresa') {
            try {
                await saveCompanySettings(companyDraft);
                setCompany(companyDraft);
                setCompanyHasDraft(false);
                applyCompanyColors(companyDraft);
                document.title = companyDraft.name;
                showToast('✅ Configurações da empresa publicadas!');
                setTimeout(() => window.location.reload(), 800);
            }
            catch {
                showToast('❌ Erro ao publicar.');
            }
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
            setCarouselTagline(pub.carouselTagline ?? '');
            setCarouselTitle(pub.carouselTitle ?? '');
            setCarouselSubtitle(pub.carouselSubtitle ?? '');
            setSobreTitle(pub.sobreTitle ?? '');
            setStats(structuredClone(pub.stats ?? []));
            setFeaturesTitle(pub.featuresTitle ?? '');
            setFeatures(structuredClone(pub.features ?? []));
            discardDraft('home');
        }
        else if (activeTab === 'sobre') {
            const pub = content.published.sobre ?? {};
            setSobreHeroTitle(pub.heroTitle ?? '');
            setSobreHeroSubtitle(pub.heroSubtitle ?? '');
            setEspecialidades(structuredClone(pub.especialidades ?? []));
            setTimelineTitle(pub.timelineTitle ?? '');
            setTimeline(structuredClone(pub.timeline ?? []));
            discardDraft('sobre');
        }
        else if (activeTab === 'produtos') {
            const pub = content.published.products;
            setProducts(Array.isArray(pub.products) ? structuredClone(pub.products) : []);
            setProdHeadline(pub.headline);
            setProdSubline(pub.subheadline);
            discardDraft('products');
        }
        showToast('↩ Alterações descartadas.');
    };
    const fileInputRef = useRef(null);
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length)
            return;
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target?.result;
                setHomeImages((prev) => [...prev, { id: Date.now() + Math.random(), url, alt: file.name.replace(/\.[^.]+$/, '') }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = ''; // reset input
        showToast(`🖼 ${files.length} imagem${files.length > 1 ? 'ns' : ''} adicionada${files.length > 1 ? 's' : ''}!`);
    };
    const addImage = () => {
        const url = newImageUrl.trim();
        if (!url)
            return;
        setHomeImages((prev) => [...prev, { id: Date.now(), url, alt: 'Imagem do carrossel' }]);
        setNewImageUrl('');
        showToast('🖼 Imagem adicionada.');
    };
    const removeImage = (id) => setHomeImages((prev) => prev.filter((img) => img.id !== id));
    const updateAlt = (id, alt) => setHomeImages((prev) => prev.map((img) => img.id === id ? { ...img, alt } : img));
    const addProduct = () => {
        const newId = Date.now();
        setProducts((prev) => [...prev, { id: newId, icon: '⭐', title: 'Novo Produto', description: 'Descrição...', categoryIds: [], images: [], active: true }]);
        setEditingProductId(newId);
    };
    const updateProduct = (id, field, value) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    const updateProductCategories = (id, categoryIds) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, categoryIds } : p));
    const updateProductGallery = (id, images) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, images } : p));
    const updateProductSpecs = (id, specifications) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, specifications } : p));
    const updateProductInfo = (id, info) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, info } : p));
    const updateProductDemoImages = (id, demoImages) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, demoImages } : p));
    const toggleProductActive = (id) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: p.active === false ? true : false } : p));
    const removeProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
    const showPublishBtn = activeTab !== 'categorias';
    const TABS = [
        { key: 'home', label: 'Home', icon: '🏠' },
        { key: 'sobre', label: 'Sobre', icon: '📋' },
        { key: 'categorias', label: 'Categorias', icon: '🏷' },
        { key: 'produtos', label: 'Produtos', icon: '📦' },
        { key: 'noticias', label: 'Notícias', icon: '📰' },
        { key: 'calibracao', label: 'Calibração', icon: '📊' },
        { key: 'contatos', label: 'Contatos', icon: '📞' },
        { key: 'empresa', label: 'Empresa', icon: '🏢' },
    ];
    return (_jsxs("div", { className: "admin", children: [showModal && _jsx(PublishModal, { page: activeTab, onConfirm: confirmPublish, onCancel: () => setShowModal(false) }), _jsxs("div", { className: "admin__layout", children: [_jsxs("button", { className: "admin__mobile-toggle", onClick: () => setShowSidebar(v => !v), children: [_jsxs("span", { children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {})] }), showSidebar ? 'Fechar' : 'Menu'] }), showSidebar && (_jsx("div", { className: "admin__mobile-overlay", onClick: () => setShowSidebar(false) })), _jsxs("aside", { className: `admin__sidebar ${showSidebar ? 'admin__sidebar--open' : ''}`, children: [_jsxs("div", { className: "admin__sidebar-brand", children: [company.icon_url
                                        ? _jsx("img", { src: company.icon_url, alt: company.name, className: "admin__logo-img" })
                                        : _jsx("div", { className: "admin__logo", children: (company.name || 'AT').slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "admin__title", children: company.name || 'Minha Empresa' }), _jsx("p", { className: "admin__subtitle", children: "Painel de Administra\u00E7\u00E3o" })] })] }), _jsxs("nav", { className: "admin__sidebar-nav", children: [_jsx("p", { className: "admin__sidebar-section-label", children: "Conte\u00FAdo" }), TABS.map(({ key, label, icon }) => {
                                        const hasDot = key !== 'categorias' && key !== activeTab && (() => {
                                            if (key === 'home') {
                                                const pub = content.published.home;
                                                return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages)
                                                    || homeText !== pub.companyDescription
                                                    || carouselTagline !== (pub.carouselTagline ?? '')
                                                    || carouselTitle !== (pub.carouselTitle ?? '')
                                                    || carouselSubtitle !== (pub.carouselSubtitle ?? '')
                                                    || sobreTitle !== (pub.sobreTitle ?? '')
                                                    || JSON.stringify(stats) !== JSON.stringify(pub.stats ?? [])
                                                    || featuresTitle !== (pub.featuresTitle ?? '')
                                                    || JSON.stringify(features) !== JSON.stringify(pub.features ?? []);
                                            }
                                            if (key === 'sobre') {
                                                const pub = (content.published.sobre ?? {});
                                                return sobreHeroTitle !== (pub.heroTitle ?? '')
                                                    || sobreHeroSubtitle !== (pub.heroSubtitle ?? '')
                                                    || JSON.stringify(especialidades) !== JSON.stringify(pub.especialidades ?? [])
                                                    || timelineTitle !== (pub.timelineTitle ?? '')
                                                    || JSON.stringify(timeline) !== JSON.stringify(pub.timeline ?? []);
                                            }
                                            if (key === 'produtos') {
                                                const pub = content.published.products;
                                                return JSON.stringify(products) !== JSON.stringify(pub.products)
                                                    || prodHeadline !== pub.headline
                                                    || prodSubline !== pub.subheadline;
                                            }
                                            return false;
                                        })();
                                        return (_jsxs("button", { className: `admin__sidebar-item ${activeTab === key ? 'admin__sidebar-item--active' : ''}`, onClick: () => { setActiveTab(key); setShowSidebar(false); }, children: [_jsx("span", { className: "admin__sidebar-item-icon", children: icon }), _jsx("span", { className: "admin__sidebar-item-label", children: label }), hasDot && _jsx("span", { className: "admin__sidebar-dot" })] }, key));
                                    })] }), _jsxs("div", { className: "admin__sidebar-footer", children: [_jsxs("button", { className: "admin__sidebar-acesso-btn", onClick: () => setShowAcessoModal(true), children: [_jsx("span", { className: "admin__sidebar-acesso-avatar", children: (JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}').name ?? 'A')[0].toUpperCase() }), _jsxs("div", { className: "admin__sidebar-acesso-info", children: [_jsx("span", { className: "admin__sidebar-acesso-name", children: JSON.parse(sessionStorage.getItem('admin_auth') ?? '{}').name ?? 'Administrador' }), _jsx("span", { className: "admin__sidebar-acesso-label", children: "Meu Acesso" })] }), _jsx("span", { className: "admin__sidebar-acesso-icon", children: "\u2699" })] }), _jsx("a", { href: "/", className: "admin__sidebar-site-link", target: "_blank", rel: "noreferrer", children: "\uD83C\uDF10 Ver site publicado" })] })] }), _jsxs("div", { className: "admin__content", children: [_jsxs("div", { className: "admin__actionbar", children: [_jsx("button", { className: "btn btn-ghost", style: { marginRight: 'auto', color: 'var(--gray-400)', fontSize: '12px' }, onClick: () => {
                                            sessionStorage.removeItem('admin_auth');
                                            navigate('/login', { replace: true });
                                        }, children: "\u238B Sair" }), activeTab === 'categorias' ? (_jsx("span", { className: "admin__cat-notice", children: "\u2713 Categorias salvas automaticamente" })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "btn btn-ghost", onClick: handleDiscard, disabled: !isDirty, children: "\u21A9 Descartar" }), _jsx("button", { className: "btn btn-outline-gold", onClick: handlePreview, children: "\uD83D\uDC41 Preview" }), _jsx("button", { className: `btn btn-primary ${isDirty ? 'btn-primary--pulse' : ''}`, onClick: () => setShowModal(true), children: "\uD83D\uDE80 Publicar" })] }))] }), _jsxs("div", { className: `admin__dirty-bar ${isDirty ? 'admin__dirty-bar--visible' : ''}`, children: ["\u270F\uFE0F Altera\u00E7\u00F5es n\u00E3o publicadas \u2014 clique em ", _jsx("strong", { children: "Publicar" }), " para torn\u00E1-las vis\u00EDveis."] }), _jsx("div", { className: "admin__scroll", children: _jsxs("main", { className: "admin__body", children: [activeTab === 'home' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDDBC Imagens do Carrossel" }), _jsx("p", { className: "admin__section-desc", children: "Adicione imagens pela URL. Recomendado: 1400\u00D7800px." })] }), _jsxs("span", { className: "admin__count", children: [homeImages.length, " imagem", homeImages.length !== 1 ? 'ns' : ''] })] }), homeImages.length > 0 ? (_jsx("div", { className: "admin__img-grid", children: homeImages.map((img) => _jsx(ImageCard, { img: img, onRemove: removeImage, onAltChange: updateAlt }, img.id)) })) : (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83D\uDCF7" }), _jsx("p", { children: "Nenhuma imagem adicionada." })] })), _jsxs("div", { className: "admin__add-url", children: [_jsx("input", { className: "form-input", type: "url", placeholder: "Cole a URL da imagem aqui...", value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addImage() }), _jsx("button", { className: "btn btn-primary", onClick: addImage, children: "+ URL" })] }), _jsx("div", { className: "admin__upload-divider", children: _jsx("span", { children: "ou" }) }), _jsxs("div", { className: "admin__upload-file", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleFileUpload }), _jsx("button", { className: "btn admin__upload-btn", onClick: () => fileInputRef.current?.click(), children: "\uD83D\uDCC1 Escolher do computador / celular" }), _jsx("p", { className: "admin__hint", style: { margin: 0 }, children: "Aceita JPG, PNG, WebP. M\u00FAltiplos arquivos permitidos." })] }), _jsxs("p", { className: "admin__hint", children: ["\uD83D\uDCA1 Use ", _jsx("strong", { children: "unsplash.com" }), " para imagens gratuitas por URL."] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u270D Texto do Carrossel" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1.25rem' }, children: "Deixe em branco para exibir somente as imagens, sem escurec\u00EA-las." }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Tagline (linha pequena acima do t\u00EDtulo)" }), _jsx("input", { className: "form-input", placeholder: "Ex: Excel\u00EAncia em Avia\u00E7\u00E3o", value: carouselTagline, onChange: (e) => setCarouselTagline(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", placeholder: "Ex: Precis\u00E3o que eleva seus resultados", value: carouselTitle, onChange: (e) => setCarouselTitle(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", placeholder: "Ex: Solu\u00E7\u00F5es aeron\u00E1uticas de alta performance...", value: carouselSubtitle, onChange: (e) => setCarouselSubtitle(e.target.value) })] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFF7 Se\u00E7\u00E3o \"Sobre\"" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: sobreTitle, onChange: (e) => setSobreTitle(e.target.value), placeholder: "Sobre a AeroTech Brasil" })] }), _jsxs("div", { className: "admin__field", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [_jsx("label", { className: "form-label", style: { margin: 0 }, children: "Descri\u00E7\u00E3o da Empresa" }), _jsxs("span", { className: "admin__count", children: [homeText.length, " chars"] })] }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: 8 }, children: "Texto da se\u00E7\u00E3o \"Sobre\" na Home." }), _jsx("textarea", { className: "form-textarea", value: homeText, onChange: (e) => setHomeText(e.target.value), rows: 10, placeholder: "Digite a descri\u00E7\u00E3o..." })] }), _jsx("label", { className: "form-label", style: { marginTop: '1rem', display: 'block' }, children: "Cards de Estat\u00EDsticas" }), _jsx("div", { className: "admin-stats-grid", children: stats.map((s, i) => (_jsxs("div", { className: "admin-stat-row", children: [_jsx("input", { className: "form-input admin-stat-row__value", placeholder: "18+", value: s.value, onChange: (e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x)) }), _jsx("input", { className: "form-input admin-stat-row__label", placeholder: "Anos de Experi\u00EAncia", value: s.label, onChange: (e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setStats(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setStats(prev => [...prev, { value: '', label: '' }]), children: "+ Adicionar Card" })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u26A1 Se\u00E7\u00E3o \"Diferenciais\"" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: featuresTitle, onChange: (e) => setFeaturesTitle(e.target.value), placeholder: "Diferenciais que fazem a diferen\u00E7a" })] }), _jsx("label", { className: "form-label", style: { marginTop: '1rem', display: 'block' }, children: "Cards de Diferenciais" }), _jsx("div", { className: "admin-features-list", children: features.map((f, i) => (_jsxs("div", { className: "admin-feature-row", children: [_jsxs("div", { className: "admin-feature-row__top", children: [_jsx("input", { className: "form-input admin-feature-row__icon", placeholder: "\uD83D\uDEE1\uFE0F", value: f.icon, maxLength: 4, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x)) }), _jsx("input", { className: "form-input admin-feature-row__title", placeholder: "T\u00EDtulo...", value: f.title, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setFeatures(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }), _jsx("textarea", { className: "form-textarea", rows: 2, placeholder: "Descri\u00E7\u00E3o...", value: f.desc, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x)) })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setFeatures(prev => [...prev, { icon: '⭐', title: '', desc: '' }]), children: "+ Adicionar Diferencial" })] })] })), activeTab === 'sobre' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFD4 Hero da P\u00E1gina Sobre" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", value: sobreHeroTitle, onChange: (e) => setSobreHeroTitle(e.target.value), placeholder: "Sobre a AeroTech Brasil" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", value: sobreHeroSubtitle, onChange: (e) => setSobreHeroSubtitle(e.target.value), placeholder: "Quase duas d\u00E9cadas de excel\u00EAncia..." })] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u2B50 Nossas Especialidades" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1rem' }, children: "Lista exibida no painel lateral da p\u00E1gina Sobre." }), _jsx("div", { className: "admin-features-list", children: especialidades.map((e, i) => (_jsxs("div", { className: "admin-stat-row", children: [_jsx("input", { className: "form-input", style: { gridColumn: '1 / 3' }, value: e, placeholder: "Avia\u00E7\u00E3o Agr\u00EDcola de Precis\u00E3o", onChange: (ev) => setEspecialidades(prev => prev.map((x, j) => j === i ? ev.target.value : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setEspecialidades(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setEspecialidades(prev => [...prev, '']), children: "+ Adicionar Especialidade" })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDD50 Linha do Tempo" }), _jsx("p", { className: "admin__section-desc", children: "Se\u00E7\u00E3o \"Nossa Jornada\" na p\u00E1gina Sobre." })] }), _jsx("button", { className: "btn btn-primary", onClick: () => setTimeline(prev => [...prev, { year: String(new Date().getFullYear()), title: '', desc: '' }]), children: "+ Adicionar" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: timelineTitle, onChange: (e) => setTimelineTitle(e.target.value), placeholder: "Uma hist\u00F3ria de crescimento" })] }), _jsx("div", { className: "admin-features-list", children: timeline.map((t, i) => (_jsxs("div", { className: "admin-feature-row", children: [_jsxs("div", { className: "admin-feature-row__top", children: [_jsx("input", { className: "form-input", style: { width: '100px', flexShrink: 0 }, placeholder: "2005", value: t.year, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x)) }), _jsx("input", { className: "form-input", placeholder: "T\u00EDtulo (ex: Funda\u00E7\u00E3o)", value: t.title, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setTimeline(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }), _jsx("textarea", { className: "form-textarea", rows: 2, placeholder: "Descri\u00E7\u00E3o...", value: t.desc, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x)) })] }, i))) })] })] })), activeTab === 'produtos' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCCC Cabe\u00E7alho da P\u00E1gina" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", value: prodHeadline, onChange: (e) => setProdHeadline(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", value: prodSubline, onChange: (e) => setProdSubline(e.target.value) })] })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCE6 Produtos" }), _jsxs("p", { className: "admin__section-desc", children: [(products ?? []).filter(p => p.active !== false).length, " ativos \u00B7 ", (products ?? []).filter(p => p.active === false).length, " inativos"] })] }), _jsx("button", { className: "btn btn-primary", onClick: () => { addProduct(); setEditingProductId(Date.now()); }, children: "+ Novo Produto" })] }), _jsxs("div", { className: "admin-prod-filter", children: [_jsx("input", { className: "form-input", placeholder: "\uD83D\uDD0D Buscar por nome...", value: prodSearch, onChange: (e) => setProdSearch(e.target.value) }), prodSearch && (_jsx("button", { className: "admin-prod-filter__clear", onClick: () => setProdSearch(''), children: "\u2715" }))] }), Array.isArray(products) && products.length > 0 ? (_jsx("div", { className: "admin-prod-grid", children: products
                                                                .filter(p => p.title.toLowerCase().includes(prodSearch.toLowerCase()))
                                                                .map((p) => {
                                                                const isActive = p.active !== false;
                                                                return (_jsxs("div", { className: `admin-prod-card ${!isActive ? 'admin-prod-card--inactive' : ''}`, children: [_jsxs("div", { className: "admin-prod-card__img", children: [p.image
                                                                                    ? _jsx("img", { src: p.image, alt: p.title })
                                                                                    : _jsx("span", { children: p.icon || '📦' }), !isActive && _jsx("div", { className: "admin-prod-card__inactive-badge", children: "Inativo" }), p.tag && _jsx("div", { className: "admin-prod-card__tag", children: p.tag })] }), _jsxs("div", { className: "admin-prod-card__info", children: [_jsx("p", { className: "admin-prod-card__title", children: p.title }), _jsxs("p", { className: "admin-prod-card__desc", children: [p.description.slice(0, 60), p.description.length > 60 ? '…' : ''] })] }), _jsxs("div", { className: "admin-prod-card__actions", children: [_jsx("button", { className: "btn admin-prod-card__btn-edit", onClick: () => setEditingProductId(p.id), title: "Editar", children: "\u270F Editar" }), _jsx("button", { className: `btn admin-prod-card__btn-toggle ${isActive ? '' : 'admin-prod-card__btn-activate'}`, onClick: () => toggleProductActive(p.id), title: isActive ? 'Inativar' : 'Ativar', children: isActive ? '⊘ Inativar' : '✓ Ativar' })] })] }, p.id));
                                                            }) })) : (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83D\uDCE6" }), _jsx("p", { children: "Nenhum produto. Clique em \"+ Novo Produto\"." })] }))] }), editingProductId !== null && (() => {
                                                    const p = products.find(pr => pr.id === editingProductId);
                                                    if (!p)
                                                        return null;
                                                    return (_jsx("div", { className: "admin-prod-modal__overlay", onClick: () => setEditingProductId(null), children: _jsxs("div", { className: "admin-prod-modal", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "admin-prod-modal__header", children: [_jsx("h2", { children: "\u270F Editar Produto" }), _jsx("button", { className: "produto-modal__close", onClick: () => setEditingProductId(null), children: "\u2715" })] }), _jsx("div", { className: "admin-prod-modal__body", children: _jsx(ProductRow, { product: p, categories: content.categories, onChange: updateProduct, onCategoriesChange: updateProductCategories, onGalleryChange: updateProductGallery, onSpecsChange: updateProductSpecs, onInfoChange: updateProductInfo, onDemoImagesChange: updateProductDemoImages, onRemove: (id) => { removeProduct(id); setEditingProductId(null); } }) }), _jsx("div", { className: "admin-prod-modal__footer", children: _jsx("button", { className: "btn btn-outline", onClick: () => setEditingProductId(null), children: "Fechar" }) })] }) }));
                                                })()] })), activeTab === 'categorias' && (_jsx(CategoryManager, { categories: content.categories, onAdd: addCategory, onUpdate: updateCategory, onRemove: removeCategory, showToast: showToast })), activeTab === 'noticias' && (_jsxs("div", { className: "admin__section", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCF0 Not\u00EDcias" }), _jsxs("p", { className: "admin__section-desc", children: ["Edite as not\u00EDcias e clique em ", _jsx("strong", { children: "Publicar" }), " para atualizar o site."] })] }), _jsx("button", { className: "btn btn-primary", onClick: () => {
                                                                setEditingNews(null);
                                                                setNewsForm(defaultNewsForm());
                                                                setNewsMsg(null);
                                                                setShowNewsModal(true);
                                                            }, children: "+ Nova Not\u00EDcia" })] }), newsHasDraft && (_jsxs("div", { style: {
                                                        background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)',
                                                        borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 12,
                                                        fontSize: 13, color: '#ea580c', fontWeight: 600,
                                                    }, children: ["\u26A0 H\u00E1 altera\u00E7\u00F5es n\u00E3o publicadas. Clique em ", _jsx("strong", { children: "Publicar" }), " para salvar no site."] })), newsDraft.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "\uD83D\uDCF0" }), _jsx("p", { children: "Nenhuma not\u00EDcia cadastrada ainda." })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: newsDraft.map((n) => (_jsxs("div", { style: {
                                                            background: n.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                                                            border: '1px solid var(--border-gray)',
                                                            borderLeft: `4px solid ${n.active ? 'var(--gold)' : 'var(--border-gray)'}`,
                                                            borderRadius: 'var(--radius-md)', padding: '16px 20px',
                                                            display: 'flex', alignItems: 'flex-start', gap: 16,
                                                            opacity: n.active ? 1 : 0.6,
                                                        }, children: [n.image_url ? (_jsx("img", { src: n.image_url, alt: n.title, style: { width: 72, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0 } })) : (_jsx("div", { style: { width: 72, height: 52, background: 'var(--bg-light)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }, children: "\uD83D\uDCF0" })), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }, children: [n.category && _jsx("span", { style: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '2px 8px', borderRadius: 20 }, children: n.category }), _jsx("span", { style: { fontSize: 10, color: 'var(--gray-400)', fontWeight: 600 }, children: new Date(n.published_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }), _jsx("span", { style: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                                                                                    background: n.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                                                                                    color: n.active ? 'var(--success)' : 'var(--gray-400)',
                                                                                }, children: n.active ? 'Ativa' : 'Inativa' })] }), _jsx("p", { style: { fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginBottom: 2 }, children: n.title }), n.summary && _jsx("p", { style: { fontSize: 12, color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: n.summary }), n.author && _jsxs("p", { style: { fontSize: 11, color: 'var(--gray-400)', marginTop: 2, fontStyle: 'italic' }, children: ["Por ", n.author] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }, children: [_jsx("button", { className: "btn btn-outline", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            setEditingNews(n);
                                                                            setNewsForm({ title: n.title, summary: n.summary, content: n.content, image_url: n.image_url, extra_images: Array.isArray(n.extra_images) ? n.extra_images : [], author: n.author, category: n.category, active: n.active, sort_order: n.sort_order, published_at: n.published_at.split('T')[0] });
                                                                            setNewsMsg(null);
                                                                            setShowNewsModal(true);
                                                                        }, children: "\u270F Editar" }), _jsx("button", { className: "btn", style: { fontSize: 12, padding: '6px 12px', background: n.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: n.active ? 'var(--danger)' : 'var(--success)', border: 'none' }, onClick: () => {
                                                                            setNewsDraft(prev => prev.map(x => x.id === n.id ? { ...x, active: !n.active } : x));
                                                                            setNewsHasDraft(true);
                                                                        }, children: n.active ? '🚫 Inativar' : '✓ Ativar' }), _jsx("button", { className: "btn btn-danger", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            if (!confirm(`Excluir "${n.title}"?`))
                                                                                return;
                                                                            setNewsDraft(prev => prev.filter(x => x.id !== n.id));
                                                                            setNewsHasDraft(true);
                                                                        }, children: "\uD83D\uDDD1" })] })] }, n.id))) }))] })), activeTab === 'calibracao' && (_jsxs("div", { className: "admin__section", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCCA Tabelas de Calibra\u00E7\u00E3o" }), _jsxs("p", { className: "admin__section-desc", children: ["Edite as tabelas e clique em ", _jsx("strong", { children: "Publicar" }), " para atualizar o site."] })] }), _jsx("button", { className: "btn btn-primary", onClick: () => {
                                                                setEditingCalib(null);
                                                                setCalibForm(defaultCalibForm());
                                                                setCalibMsg(null);
                                                                setShowCalibModal(true);
                                                            }, children: "+ Nova Tabela" })] }), calibHasDraft && (_jsxs("div", { style: {
                                                        background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)',
                                                        borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 12,
                                                        fontSize: 13, color: '#ea580c', fontWeight: 600,
                                                    }, children: ["\u26A0 H\u00E1 altera\u00E7\u00F5es n\u00E3o publicadas. Clique em ", _jsx("strong", { children: "Publicar" }), " para salvar no site."] })), calibDraft.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "\uD83D\uDCCA" }), _jsx("p", { children: "Nenhuma tabela cadastrada ainda." })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: calibDraft.map((t) => (_jsxs("div", { style: {
                                                            background: t.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                                                            border: '1px solid var(--border-gray)',
                                                            borderLeft: `4px solid ${t.active ? 'var(--gold)' : 'var(--border-gray)'}`,
                                                            borderRadius: 'var(--radius-md)', padding: '16px 20px',
                                                            display: 'flex', alignItems: 'center', gap: 16,
                                                            opacity: t.active ? 1 : 0.6,
                                                        }, children: [_jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }, children: [_jsx("span", { style: { fontWeight: 700, color: 'var(--navy)', fontSize: 14 }, children: t.title }), _jsx("span", { style: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                                                                                    background: t.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                                                                                    color: t.active ? 'var(--success)' : 'var(--gray-400)',
                                                                                }, children: t.active ? 'Ativa' : 'Inativa' })] }), t.description && _jsx("p", { style: { fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }, children: t.description }), _jsxs("p", { style: { fontSize: 11, color: 'var(--gray-400)' }, children: [t.columns.length, " colunas \u00B7 ", t.rows.length, " linhas"] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, flexShrink: 0 }, children: [_jsx("button", { className: "btn btn-outline", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            setEditingCalib(t);
                                                                            setCalibForm({ title: t.title, description: t.description, columns: [...t.columns], row_headers: [...(t.row_headers ?? [])], rows: t.rows.map(r => [...r]), active: t.active, sort_order: t.sort_order });
                                                                            setCalibMsg(null);
                                                                            setShowCalibModal(true);
                                                                        }, children: "\u270F Editar" }), _jsx("button", { className: "btn", style: { fontSize: 12, padding: '6px 12px', background: t.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: t.active ? 'var(--danger)' : 'var(--success)', border: 'none' }, onClick: () => {
                                                                            setCalibDraft(prev => prev.map(x => x.id === t.id ? { ...x, active: !t.active } : x));
                                                                            setCalibHasDraft(true);
                                                                        }, children: t.active ? '🚫 Inativar' : '✓ Ativar' }), _jsx("button", { className: "btn btn-danger", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            if (!confirm(`Excluir "${t.title}"?`))
                                                                                return;
                                                                            setCalibDraft(prev => prev.filter(x => x.id !== t.id));
                                                                            setCalibHasDraft(true);
                                                                        }, children: "\uD83D\uDDD1" })] })] }, t.id))) }))] })), activeTab === 'contatos' && (_jsxs("div", { className: "admin__section", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCDE Contatos" }), _jsxs("p", { className: "admin__section-desc", children: ["Edite os contatos e clique em ", _jsx("strong", { children: "Publicar" }), " para atualizar o site."] })] }), _jsx("button", { className: "btn btn-primary", onClick: () => {
                                                                setEditingContact(null);
                                                                setContactForm({ name: '', role: '', email: '', phone: '', mobile: '', address: '', active: true, sort_order: contactsDraft.length });
                                                                setContactMsg(null);
                                                                setShowContactModal(true);
                                                            }, children: "+ Novo Contato" })] }), contactsHasDraft && (_jsxs("div", { style: {
                                                        background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)',
                                                        borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 12,
                                                        fontSize: 13, color: '#ea580c', fontWeight: 600,
                                                    }, children: ["\u26A0 H\u00E1 altera\u00E7\u00F5es n\u00E3o publicadas. Clique em ", _jsx("strong", { children: "Publicar" }), " para salvar no site."] })), contactsDraft.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }, children: [_jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "\uD83D\uDCDE" }), _jsx("p", { children: "Nenhum contato cadastrado ainda." }), _jsx("p", { style: { fontSize: 13 }, children: "Clique em \"+ Novo Contato\" para adicionar." })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: contactsDraft.map((c) => (_jsxs("div", { style: {
                                                            background: c.active ? 'var(--white)' : 'rgba(0,0,0,0.03)',
                                                            border: '1px solid var(--border-gray)',
                                                            borderRadius: 'var(--radius-md)', padding: '16px 20px',
                                                            display: 'flex', alignItems: 'center', gap: 16,
                                                            opacity: c.active ? 1 : 0.6,
                                                        }, children: [_jsx("div", { style: {
                                                                    width: 48, height: 48, borderRadius: '50%',
                                                                    background: 'var(--navy)', color: 'white',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    fontWeight: 800, fontSize: 16, flexShrink: 0,
                                                                }, children: c.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, children: [_jsx("span", { style: { fontWeight: 700, color: 'var(--navy)', fontSize: 14 }, children: c.name }), c.role && _jsx("span", { style: { fontSize: 12, color: 'var(--gray-400)' }, children: c.role }), _jsx("span", { style: {
                                                                                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                                                                                    background: c.active ? 'var(--success-bg)' : 'rgba(0,0,0,0.06)',
                                                                                    color: c.active ? 'var(--success)' : 'var(--gray-400)',
                                                                                }, children: c.active ? 'Ativo' : 'Inativo' })] }), _jsxs("div", { style: { display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }, children: [c.email && _jsxs("span", { style: { fontSize: 12, color: 'var(--gray-400)' }, children: ["\u2709 ", c.email] }), c.phone && _jsxs("span", { style: { fontSize: 12, color: 'var(--gray-400)' }, children: ["\u260E ", c.phone] }), c.mobile && _jsxs("span", { style: { fontSize: 12, color: 'var(--gray-400)' }, children: ["\uD83D\uDCF1 ", c.mobile] }), c.address && _jsxs("span", { style: { fontSize: 12, color: 'var(--gray-400)' }, children: ["\uD83D\uDCCD ", c.address] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, flexShrink: 0 }, children: [_jsx("button", { className: "btn btn-outline", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            setEditingContact(c);
                                                                            setContactForm({ name: c.name, role: c.role, email: c.email, phone: c.phone, mobile: c.mobile, address: c.address, active: c.active, sort_order: c.sort_order });
                                                                            setContactMsg(null);
                                                                            setShowContactModal(true);
                                                                        }, children: "\u270F Editar" }), _jsx("button", { className: "btn", style: { fontSize: 12, padding: '6px 12px', background: c.active ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: c.active ? 'var(--danger)' : 'var(--success)', border: 'none' }, onClick: () => {
                                                                            setContactsDraft(prev => prev.map(x => x.id === c.id ? { ...x, active: !c.active } : x));
                                                                            setContactsHasDraft(true);
                                                                        }, children: c.active ? '🚫 Inativar' : '✓ Ativar' }), _jsx("button", { className: "btn btn-danger", style: { fontSize: 12, padding: '6px 12px' }, onClick: () => {
                                                                            if (!confirm(`Excluir "${c.name}"?`))
                                                                                return;
                                                                            setContactsDraft(prev => prev.filter(x => x.id !== c.id));
                                                                            setContactsHasDraft(true);
                                                                        }, children: "\uD83D\uDDD1" })] })] }, c.id))) }))] })), activeTab === 'empresa' && (_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFE2 Configura\u00E7\u00F5es da Empresa" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1rem' }, children: "Essas informa\u00E7\u00F5es s\u00E3o exibidas na aba do navegador, no navbar e em todo o site." }), companyHasDraft && (_jsxs("div", { style: {
                                                        background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)',
                                                        borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '1rem',
                                                        fontSize: 13, color: '#ea580c', fontWeight: 600,
                                                    }, children: ["\u26A0 H\u00E1 altera\u00E7\u00F5es n\u00E3o publicadas. Clique em ", _jsx("strong", { children: "Publicar" }), " para salvar no site."] })), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Nome da Empresa" }), _jsx("input", { className: "form-input", placeholder: "Ex: AeroTech Brasil", value: companyDraft.name, onChange: e => { setCompanyDraft(prev => ({ ...prev, name: e.target.value })); setCompanyHasDraft(true); } }), _jsx("p", { className: "admin__hint", children: "Aparece na aba do navegador, navbar e rodap\u00E9." })] }), _jsxs("div", { className: "admin__field", style: { marginTop: '1rem' }, children: [_jsx("label", { className: "form-label", children: "Descri\u00E7\u00E3o (Rodap\u00E9)" }), _jsx("textarea", { className: "form-input", rows: 3, placeholder: "Ex: Refer\u00EAncia nacional em avia\u00E7\u00E3o agr\u00EDcola desde 2005...", value: companyDraft.description ?? '', onChange: e => { setCompanyDraft(prev => ({ ...prev, description: e.target.value })); setCompanyHasDraft(true); }, style: { resize: 'vertical' } }), _jsx("p", { className: "admin__hint", children: "Texto exibido abaixo do logo no rodap\u00E9 do site." })] }), _jsxs("div", { className: "admin__field", style: { marginTop: '1rem' }, children: [_jsx("label", { className: "form-label", children: "CNPJ" }), _jsx("input", { className: "form-input", placeholder: "Ex: CNPJ: 12.345.678/0001-90 \u00B7 Palotina, Paran\u00E1 \u2014 Brasil", value: companyDraft.cnpj ?? '', onChange: e => { setCompanyDraft(prev => ({ ...prev, cnpj: e.target.value })); setCompanyHasDraft(true); } }), _jsx("p", { className: "admin__hint", children: "Exibido no rodap\u00E9 inferior do site. Deixe em branco para ocultar." })] }), _jsxs("div", { className: "admin__field", style: { marginTop: '1.25rem' }, children: [_jsx("label", { className: "form-label", children: "\u00CDcone / Logo" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }, children: [_jsx("div", { style: {
                                                                        width: 64, height: 64, borderRadius: 12,
                                                                        background: companyDraft.icon_url ? '#f5f5f5' : 'var(--gold)',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        border: '1px solid var(--border-gray)', overflow: 'hidden', flexShrink: 0,
                                                                    }, children: companyDraft.icon_url
                                                                        ? _jsx("img", { src: companyDraft.icon_url, alt: "\u00EDcone", style: { width: '100%', height: '100%', objectFit: 'contain', padding: 6 } })
                                                                        : _jsx("span", { style: { fontSize: 22, fontWeight: 900, color: 'var(--navy)' }, children: (companyDraft.name || 'AT').slice(0, 2).toUpperCase() }) }), _jsxs("div", { children: [_jsx("input", { ref: companyIconRef, type: "file", accept: "image/*", style: { display: 'none' }, onChange: e => {
                                                                                const file = e.target.files?.[0];
                                                                                if (!file)
                                                                                    return;
                                                                                const reader = new FileReader();
                                                                                reader.onload = ev => { setCompanyDraft(prev => ({ ...prev, icon_url: ev.target?.result })); setCompanyHasDraft(true); };
                                                                                reader.readAsDataURL(file);
                                                                                e.target.value = '';
                                                                            } }), _jsx("button", { className: "btn admin__upload-btn", onClick: () => companyIconRef.current?.click(), children: "\uD83D\uDCC1 Carregar imagem" }), companyDraft.icon_url && (_jsx("button", { className: "btn btn-danger", style: { fontSize: '12px', padding: '6px 12px', marginLeft: 8 }, onClick: () => { setCompanyDraft(prev => ({ ...prev, icon_url: '' })); setCompanyHasDraft(true); }, children: "\uD83D\uDDD1 Remover" }))] })] }), _jsx("input", { className: "form-input", placeholder: "Ou cole a URL do \u00EDcone...", value: companyDraft.icon_url?.startsWith('data:') ? '' : (companyDraft.icon_url ?? ''), onChange: e => { setCompanyDraft(prev => ({ ...prev, icon_url: e.target.value })); setCompanyHasDraft(true); } }), _jsx("p", { className: "admin__hint", children: "Recomendado: PNG ou SVG quadrado (ex: 512\u00D7512px). Aparece na aba do navegador e no navbar." })] }), _jsxs("div", { className: "admin__field", style: { marginTop: '1.5rem' }, children: [_jsx("label", { className: "form-label", children: "\uD83C\uDFA8 Cores da Empresa" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1rem' }, children: "Aplicadas em todo o site: navbar, footer, bot\u00F5es, destaques e painel administrativo." }), _jsxs("div", { className: "admin-color-grid", children: [_jsxs("div", { className: "admin-color-item", children: [_jsx("div", { className: "admin-color-preview", style: { background: companyDraft.color_primary || '#0a1628' } }), _jsxs("div", { className: "admin-color-info", children: [_jsx("span", { className: "admin-color-label", children: "Cor Principal" }), _jsx("span", { className: "admin-color-desc", children: "Navbar, footer, fundos escuros" })] }), _jsx("input", { type: "color", className: "admin-color-picker", value: companyDraft.color_primary || '#0a1628', onChange: e => {
                                                                                const updated = { ...company, color_primary: e.target.value };
                                                                                setCompanyDraft(updated);
                                                                                applyCompanyColors(updated);
                                                                                setCompanyHasDraft(true);
                                                                            } })] }), _jsxs("div", { className: "admin-color-item", children: [_jsx("div", { className: "admin-color-preview", style: { background: companyDraft.color_secondary || '#c8972a' } }), _jsxs("div", { className: "admin-color-info", children: [_jsx("span", { className: "admin-color-label", children: "Cor de Destaque" }), _jsx("span", { className: "admin-color-desc", children: "Bot\u00F5es, bordas ativas, textos em evid\u00EAncia" })] }), _jsx("input", { type: "color", className: "admin-color-picker", value: companyDraft.color_secondary || '#c8972a', onChange: e => {
                                                                                const updated = { ...company, color_secondary: e.target.value };
                                                                                setCompanyDraft(updated);
                                                                                applyCompanyColors(updated);
                                                                                setCompanyHasDraft(true);
                                                                            } })] })] }), _jsxs("div", { className: "admin-color-preview-bar", style: { marginTop: 16 }, children: [_jsxs("div", { style: {
                                                                        background: companyDraft.color_primary || '#0a1628',
                                                                        padding: '14px 20px',
                                                                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                    }, children: [_jsx("span", { style: { color: 'white', fontWeight: 700, fontSize: 13 }, children: "Preview do Navbar" }), _jsx("div", { style: { display: 'flex', gap: 8 }, children: ['Sobre', 'Produtos', 'Contatos'].map(t => (_jsx("span", { style: { color: 'rgba(255,255,255,0.6)', fontSize: 12 }, children: t }, t))) })] }), _jsxs("div", { style: {
                                                                        background: '#f5f5f5', padding: '12px 20px',
                                                                        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                                                                        display: 'flex', gap: 10, alignItems: 'center',
                                                                    }, children: [_jsx("div", { style: {
                                                                                background: companyDraft.color_secondary || '#c8972a',
                                                                                color: companyDraft.color_primary || '#0a1628',
                                                                                padding: '6px 16px', borderRadius: 20,
                                                                                fontSize: 12, fontWeight: 800,
                                                                            }, children: "Bot\u00E3o" }), _jsx("span", { style: { color: companyDraft.color_secondary || '#c8972a', fontSize: 13, fontWeight: 700 }, children: "Texto em destaque" })] })] }), _jsx("button", { className: "btn btn-outline", style: { marginTop: 12, fontSize: 12 }, onClick: () => {
                                                                const reset = { ...company, color_primary: '#0a1628', color_secondary: '#c8972a' };
                                                                setCompanyDraft(reset);
                                                                applyCompanyColors(reset);
                                                                setCompanyHasDraft(false);
                                                            }, children: "\u21BA Restaurar cores padr\u00E3o" })] }), companyMsg && (_jsxs("div", { style: {
                                                        padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 16,
                                                        background: companyMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                                        color: companyMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                                        border: `1px solid ${companyMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                                                    }, children: [companyMsg.type === 'success' ? '✓ ' : '✕ ', companyMsg.text] })), _jsxs("p", { className: "admin__hint", style: { marginTop: '1rem', color: 'var(--gray-400)' }, children: ["As altera\u00E7\u00F5es s\u00F3 ser\u00E3o aplicadas no site ap\u00F3s clicar em ", _jsx("strong", { children: "Publicar" }), "."] })] }))] }) })] })] }), showCalibModal && (() => {
                const cols = calibForm.columns;
                const rows = calibForm.rows;
                const rowHeaders = calibForm.row_headers ?? [];
                const setCol = (ci, val) => setCalibForm(p => { const c = [...p.columns]; c[ci] = val; return { ...p, columns: c }; });
                const addCol = () => setCalibForm(p => ({
                    ...p,
                    columns: [...p.columns, `Coluna ${p.columns.length + 1}`],
                    rows: p.rows.map(r => [...r, '']),
                }));
                const removeCol = (ci) => setCalibForm(p => ({
                    ...p,
                    columns: p.columns.filter((_, i) => i !== ci),
                    rows: p.rows.map(r => r.filter((_, i) => i !== ci)),
                }));
                const addRow = () => setCalibForm(p => ({
                    ...p,
                    row_headers: [...(p.row_headers ?? []), ''],
                    rows: [...p.rows, Array(p.columns.length).fill('')],
                }));
                const removeRow = (ri) => setCalibForm(p => ({
                    ...p,
                    row_headers: (p.row_headers ?? []).filter((_, i) => i !== ri),
                    rows: p.rows.filter((_, i) => i !== ri),
                }));
                const setCell = (ri, ci, val) => setCalibForm(p => {
                    const r = p.rows.map(row => [...row]);
                    r[ri][ci] = val;
                    return { ...p, rows: r };
                });
                const setRowHeader = (ri, val) => setCalibForm(p => {
                    const h = [...(p.row_headers ?? [])];
                    h[ri] = val;
                    return { ...p, row_headers: h };
                });
                return (_jsx("div", { className: "admin-prod-modal__overlay", onClick: () => setShowCalibModal(false), children: _jsxs("div", { className: "admin-prod-modal", style: { maxWidth: 820, width: '95vw' }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "admin-prod-modal__header", children: [_jsx("h2", { children: editingCalib ? '✏ Editar Tabela' : '+ Nova Tabela de Calibração' }), _jsx("button", { className: "produto-modal__close", style: { color: 'white', background: 'rgba(255,255,255,0.1)' }, onClick: () => setShowCalibModal(false), children: "\u2715" })] }), _jsxs("div", { className: "admin-prod-modal__body", style: { maxHeight: '70vh', overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 20 }, children: [_jsxs("div", { className: "admin__field", children: [_jsxs("label", { className: "form-label", children: ["T\u00EDtulo ", _jsx("span", { style: { color: 'var(--danger)' }, children: "*" })] }), _jsx("input", { className: "form-input", placeholder: "Ex: Tabela de Calibra\u00E7\u00E3o de Alt\u00EDmetros", value: calibForm.title, onChange: e => setCalibForm(p => ({ ...p, title: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { className: "form-input", rows: 2, placeholder: "Descri\u00E7\u00E3o opcional...", value: calibForm.description, onChange: e => setCalibForm(p => ({ ...p, description: e.target.value })), style: { resize: 'vertical' } })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("input", { type: "checkbox", id: "calib-active", checked: calibForm.active, onChange: e => setCalibForm(p => ({ ...p, active: e.target.checked })), style: { width: 18, height: 18, cursor: 'pointer' } }), _jsx("label", { htmlFor: "calib-active", style: { fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--navy)' }, children: "Tabela ativa (vis\u00EDvel no site)" }), _jsx("input", { className: "form-input", type: "number", min: 0, value: calibForm.sort_order, onChange: e => setCalibForm(p => ({ ...p, sort_order: Number(e.target.value) })), style: { width: 80, marginLeft: 'auto' }, title: "Ordem de exibi\u00E7\u00E3o" }), _jsx("span", { style: { fontSize: 12, color: 'var(--gray-400)', whiteSpace: 'nowrap' }, children: "Ordem" })] })] }), _jsxs("div", { style: { marginBottom: 12 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }, children: [_jsxs("label", { className: "form-label", style: { marginBottom: 0 }, children: ["Colunas de Dados (", cols.length, ")"] }), _jsx("button", { className: "btn btn-outline", style: { fontSize: 11, padding: '4px 10px' }, onClick: addCol, children: "+ Coluna" })] }), _jsx("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap' }, children: cols.map((col, ci) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-light)', borderRadius: 6, padding: '4px 6px', border: '1px solid var(--border-gray)' }, children: [_jsx("input", { style: { border: 'none', background: 'transparent', fontSize: 12, fontWeight: 700, color: 'var(--navy)', width: Math.max(60, col.length * 8), outline: 'none', fontFamily: 'inherit' }, value: col, onChange: e => setCol(ci, e.target.value) }), cols.length > 1 && (_jsx("button", { onClick: () => removeCol(ci), style: { background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0 }, children: "\u2715" }))] }, ci))) })] }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }, children: [_jsxs("label", { className: "form-label", style: { marginBottom: 0 }, children: ["Linhas (", rows.length, ")"] }), _jsx("button", { className: "btn btn-outline", style: { fontSize: 11, padding: '4px 10px' }, onClick: addRow, children: "+ Linha" })] }), _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', minWidth: (cols.length + 1) * 120 }, children: [_jsx("thead", { children: _jsxs("tr", { style: { background: 'var(--navy)' }, children: [_jsx("th", { style: { padding: '8px 10px', color: 'var(--gold)', fontSize: 11, fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap', minWidth: 120, borderRight: '2px solid rgba(200,151,42,0.4)' }, children: "T\u00EDtulo da Linha" }), cols.map((col, ci) => (_jsx("th", { style: { padding: '8px 10px', color: 'white', fontSize: 11, fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }, children: col }, ci))), _jsx("th", { style: { width: 32 } })] }) }), _jsx("tbody", { children: rows.map((row, ri) => (_jsxs("tr", { style: { background: ri % 2 === 0 ? 'white' : 'var(--bg-light)' }, children: [_jsx("td", { style: { padding: '4px 6px', borderBottom: '1px solid var(--border-gray)', borderRight: '2px solid var(--border-gray)' }, children: _jsx("input", { className: "form-input", style: { padding: '6px 8px', fontSize: 12, fontWeight: 600, minWidth: 100, background: 'rgba(200,151,42,0.06)' }, value: rowHeaders[ri] ?? '', onChange: e => setRowHeader(ri, e.target.value), placeholder: "T\u00EDtulo..." }) }), cols.map((_, ci) => (_jsx("td", { style: { padding: '4px 6px', borderBottom: '1px solid var(--border-gray)' }, children: _jsx("input", { className: "form-input", style: { padding: '6px 8px', fontSize: 12, minWidth: 80 }, value: row[ci] ?? '', onChange: e => setCell(ri, ci, e.target.value), placeholder: "\u2014" }) }, ci))), _jsx("td", { style: { padding: '4px 6px', textAlign: 'center' }, children: rows.length > 1 && (_jsx("button", { onClick: () => removeRow(ri), style: { background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 14 }, children: "\uD83D\uDDD1" })) })] }, ri))) })] }) })] }), calibMsg && (_jsxs("div", { style: {
                                            padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12,
                                            background: calibMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                            color: calibMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                            border: `1px solid ${calibMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                                        }, children: [calibMsg.type === 'success' ? '✓ ' : '✕ ', calibMsg.text] }))] }), _jsxs("div", { className: "admin-prod-modal__footer", style: { gap: 10 }, children: [_jsx("button", { className: "btn btn-outline", onClick: () => setShowCalibModal(false), children: "Cancelar" }), _jsx("button", { className: "btn btn-primary", disabled: calibSaving, onClick: () => {
                                            if (!calibForm.title.trim()) {
                                                setCalibMsg({ type: 'error', text: 'O título é obrigatório.' });
                                                return;
                                            }
                                            if (calibForm.columns.length === 0) {
                                                setCalibMsg({ type: 'error', text: 'Adicione ao menos uma coluna.' });
                                                return;
                                            }
                                            if (editingCalib) {
                                                setCalibDraft(prev => prev.map(x => x.id === editingCalib.id ? { ...x, ...calibForm } : x));
                                            }
                                            else {
                                                const tempId = `temp_${Date.now()}`;
                                                setCalibDraft(prev => [...prev, { id: tempId, ...calibForm }]);
                                            }
                                            setCalibHasDraft(true);
                                            setCalibMsg({ type: 'success', text: editingCalib ? 'Tabela editada! Clique em Publicar para salvar.' : 'Tabela adicionada! Clique em Publicar para salvar.' });
                                            setTimeout(() => setShowCalibModal(false), 800);
                                        }, children: "\uD83D\uDCBE Salvar Rascunho" })] })] }) }));
            })(), showNewsModal && (_jsx("div", { className: "admin-prod-modal__overlay", onClick: () => setShowNewsModal(false), children: _jsxs("div", { className: "admin-prod-modal", style: { maxWidth: 580 }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "admin-prod-modal__header", children: [_jsx("h2", { children: editingNews ? '✏ Editar Notícia' : '+ Nova Notícia' }), _jsx("button", { className: "produto-modal__close", style: { color: 'white', background: 'rgba(255,255,255,0.1)' }, onClick: () => setShowNewsModal(false), children: "\u2715" })] }), _jsxs("div", { className: "admin-prod-modal__body", children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsxs("label", { className: "form-label", children: ["T\u00EDtulo ", _jsx("span", { style: { color: 'var(--danger)' }, children: "*" })] }), _jsx("input", { className: "form-input", placeholder: "T\u00EDtulo da not\u00EDcia", value: newsForm.title, onChange: e => setNewsForm(p => ({ ...p, title: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Categoria" }), _jsx("input", { className: "form-input", placeholder: "Ex: Evento, Certifica\u00E7\u00E3o", value: newsForm.category, onChange: e => setNewsForm(p => ({ ...p, category: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Autor" }), _jsx("input", { className: "form-input", placeholder: "Ex: Reda\u00E7\u00E3o", value: newsForm.author, onChange: e => setNewsForm(p => ({ ...p, author: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Data de Publica\u00E7\u00E3o" }), _jsx("input", { className: "form-input", type: "date", value: newsForm.published_at?.split('T')[0] ?? '', onChange: e => setNewsForm(p => ({ ...p, published_at: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Ordem de Exibi\u00E7\u00E3o" }), _jsx("input", { className: "form-input", type: "number", min: 0, value: newsForm.sort_order, onChange: e => setNewsForm(p => ({ ...p, sort_order: Number(e.target.value) })) })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Imagem de Capa" }), newsForm.image_url && (_jsxs("div", { style: { position: 'relative', marginBottom: 8 }, children: [_jsx("img", { src: newsForm.image_url, alt: "capa", style: { width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, display: 'block' } }), _jsx("button", { onClick: () => setNewsForm(p => ({ ...p, image_url: '' })), style: { position: 'absolute', top: 6, right: 6, background: 'rgba(220,38,38,0.85)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 14, lineHeight: '24px', textAlign: 'center' }, children: "\u2715" })] })), _jsxs("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap' }, children: [_jsx("input", { ref: newsMainImgRef, type: "file", accept: "image/*", style: { display: 'none' }, onChange: async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file)
                                                                    return;
                                                                setNewsImgUploading(true);
                                                                const url = await uploadNewsImage(file);
                                                                if (url)
                                                                    setNewsForm(p => ({ ...p, image_url: url }));
                                                                else
                                                                    setNewsMsg({ type: 'error', text: 'Erro ao fazer upload da imagem.' });
                                                                setNewsImgUploading(false);
                                                                e.target.value = '';
                                                            } }), _jsx("button", { className: "btn admin__upload-btn", disabled: newsImgUploading, onClick: () => newsMainImgRef.current?.click(), children: newsImgUploading ? '⏳ Enviando...' : '📁 Carregar do dispositivo' })] }), _jsx("input", { className: "form-input", style: { marginTop: 8 }, placeholder: "Ou cole a URL da imagem...", value: newsForm.image_url?.startsWith('http') ? newsForm.image_url : '', onChange: e => setNewsForm(p => ({ ...p, image_url: e.target.value })) })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Imagens Extras" }), _jsx("p", { className: "admin__hint", style: { marginBottom: 8 }, children: "Galeria adicional exibida na not\u00EDcia." }), (newsForm.extra_images ?? []).length > 0 && (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 8, marginBottom: 8 }, children: (newsForm.extra_images ?? []).map((url, idx) => (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("img", { src: url, alt: "", style: { width: '100%', height: 64, objectFit: 'cover', borderRadius: 6, display: 'block' } }), _jsx("button", { onClick: () => setNewsForm(p => ({ ...p, extra_images: (p.extra_images ?? []).filter((_, i) => i !== idx) })), style: { position: 'absolute', top: 2, right: 2, background: 'rgba(220,38,38,0.85)', color: 'white', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 11, lineHeight: '18px', textAlign: 'center' }, children: "\u2715" })] }, idx))) })), _jsx("input", { ref: newsExtraImgRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: async (e) => {
                                                        const files = Array.from(e.target.files ?? []);
                                                        if (!files.length)
                                                            return;
                                                        setNewsImgUploading(true);
                                                        const urls = await Promise.all(files.map(f => uploadNewsImage(f)));
                                                        const valid = urls.filter(Boolean);
                                                        setNewsForm(p => ({ ...p, extra_images: [...(p.extra_images ?? []), ...valid] }));
                                                        if (valid.length < files.length)
                                                            setNewsMsg({ type: 'error', text: 'Alguns uploads falharam.' });
                                                        setNewsImgUploading(false);
                                                        e.target.value = '';
                                                    } }), _jsx("button", { className: "btn admin__upload-btn", disabled: newsImgUploading, onClick: () => newsExtraImgRef.current?.click(), children: newsImgUploading ? '⏳ Enviando...' : '📁 Adicionar imagens extras' })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Resumo" }), _jsx("textarea", { className: "form-input", rows: 2, placeholder: "Breve resumo da not\u00EDcia...", value: newsForm.summary, onChange: e => setNewsForm(p => ({ ...p, summary: e.target.value })), style: { resize: 'vertical' } })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Conte\u00FAdo Completo" }), _jsx("textarea", { className: "form-input", rows: 6, placeholder: "Conte\u00FAdo completo da not\u00EDcia...", value: newsForm.content, onChange: e => setNewsForm(p => ({ ...p, content: e.target.value })), style: { resize: 'vertical' } }), _jsx("p", { className: "admin__hint", children: "Exibido ao clicar em \"Leia mais\"." })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("input", { type: "checkbox", id: "news-active", checked: newsForm.active, onChange: e => setNewsForm(p => ({ ...p, active: e.target.checked })), style: { width: 18, height: 18, cursor: 'pointer' } }), _jsx("label", { htmlFor: "news-active", style: { fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--navy)' }, children: "Not\u00EDcia ativa (vis\u00EDvel no site)" })] })] }), newsMsg && (_jsxs("div", { style: {
                                        padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12,
                                        background: newsMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                        color: newsMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                        border: `1px solid ${newsMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                                    }, children: [newsMsg.type === 'success' ? '✓ ' : '✕ ', newsMsg.text] }))] }), _jsxs("div", { className: "admin-prod-modal__footer", style: { gap: 10 }, children: [_jsx("button", { className: "btn btn-outline", onClick: () => setShowNewsModal(false), children: "Cancelar" }), _jsx("button", { className: "btn btn-primary", onClick: () => {
                                        if (!newsForm.title.trim()) {
                                            setNewsMsg({ type: 'error', text: 'O título é obrigatório.' });
                                            return;
                                        }
                                        if (editingNews) {
                                            // Atualiza no draft local
                                            setNewsDraft(prev => prev.map(x => x.id === editingNews.id ? { ...x, ...newsForm } : x));
                                        }
                                        else {
                                            // Adiciona com ID temporário no draft local
                                            const tempId = `temp_${Date.now()}`;
                                            setNewsDraft(prev => [...prev, { id: tempId, ...newsForm }]);
                                        }
                                        setNewsHasDraft(true);
                                        setNewsMsg({ type: 'success', text: editingNews ? 'Notícia editada! Clique em Publicar para salvar.' : 'Notícia adicionada! Clique em Publicar para salvar.' });
                                        setTimeout(() => setShowNewsModal(false), 800);
                                    }, children: "\uD83D\uDCBE Salvar Rascunho" })] })] }) })), showContactModal && (_jsx("div", { className: "admin-prod-modal__overlay", onClick: () => setShowContactModal(false), children: _jsxs("div", { className: "admin-prod-modal", style: { maxWidth: 520 }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "admin-prod-modal__header", children: [_jsx("h2", { children: editingContact ? '✏ Editar Contato' : '+ Novo Contato' }), _jsx("button", { className: "produto-modal__close", style: { color: 'white', background: 'rgba(255,255,255,0.1)' }, onClick: () => setShowContactModal(false), children: "\u2715" })] }), _jsxs("div", { className: "admin-prod-modal__body", children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsxs("label", { className: "form-label", children: ["Nome ", _jsx("span", { style: { color: 'var(--danger)' }, children: "*" })] }), _jsx("input", { className: "form-input", placeholder: "Nome completo", value: contactForm.name, onChange: e => setContactForm(p => ({ ...p, name: e.target.value })) })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Cargo / Fun\u00E7\u00E3o" }), _jsx("input", { className: "form-input", placeholder: "Ex: Diretor Operacional", value: contactForm.role, onChange: e => setContactForm(p => ({ ...p, role: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "E-mail" }), _jsx("input", { className: "form-input", type: "email", placeholder: "email@empresa.com", value: contactForm.email, onChange: e => setContactForm(p => ({ ...p, email: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Telefone" }), _jsx("input", { className: "form-input", placeholder: "(00) 0000-0000", value: contactForm.phone, onChange: e => setContactForm(p => ({ ...p, phone: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Celular" }), _jsx("input", { className: "form-input", placeholder: "(00) 00000-0000", value: contactForm.mobile, onChange: e => setContactForm(p => ({ ...p, mobile: e.target.value })) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Ordem de exibi\u00E7\u00E3o" }), _jsx("input", { className: "form-input", type: "number", min: 0, value: contactForm.sort_order, onChange: e => setContactForm(p => ({ ...p, sort_order: Number(e.target.value) })) })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1' }, children: [_jsx("label", { className: "form-label", children: "Endere\u00E7o" }), _jsx("input", { className: "form-input", placeholder: "Rua, n\u00FAmero \u2014 Cidade, UF", value: contactForm.address, onChange: e => setContactForm(p => ({ ...p, address: e.target.value })) })] }), _jsxs("div", { className: "admin__field", style: { gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("input", { type: "checkbox", id: "contact-active", checked: contactForm.active, onChange: e => setContactForm(p => ({ ...p, active: e.target.checked })), style: { width: 18, height: 18, cursor: 'pointer' } }), _jsx("label", { htmlFor: "contact-active", style: { fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--navy)' }, children: "Contato ativo (vis\u00EDvel no site)" })] })] }), contactMsg && (_jsxs("div", { style: {
                                        padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: 12,
                                        background: contactMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                        color: contactMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                        border: `1px solid ${contactMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                                    }, children: [contactMsg.type === 'success' ? '✓ ' : '✕ ', contactMsg.text] }))] }), _jsxs("div", { className: "admin-prod-modal__footer", style: { gap: 10 }, children: [_jsx("button", { className: "btn btn-outline", onClick: () => setShowContactModal(false), children: "Cancelar" }), _jsx("button", { className: "btn btn-primary", onClick: () => {
                                        if (!contactForm.name.trim()) {
                                            setContactMsg({ type: 'error', text: 'O nome é obrigatório.' });
                                            return;
                                        }
                                        if (editingContact) {
                                            setContactsDraft(prev => prev.map(x => x.id === editingContact.id ? { ...x, ...contactForm } : x));
                                        }
                                        else {
                                            const tempId = `temp_${Date.now()}`;
                                            setContactsDraft(prev => [...prev, { id: tempId, ...contactForm }]);
                                        }
                                        setContactsHasDraft(true);
                                        setContactMsg({ type: 'success', text: editingContact ? 'Contato editado! Clique em Publicar para salvar.' : 'Contato adicionado! Clique em Publicar para salvar.' });
                                        setTimeout(() => setShowContactModal(false), 800);
                                    }, children: "\uD83D\uDCBE Salvar Rascunho" })] })] }) })), showAcessoModal && (_jsx("div", { className: "admin-prod-modal__overlay", onClick: () => { setShowAcessoModal(false); setAcessoMsg(null); }, children: _jsxs("div", { className: "admin-prod-modal", style: { maxWidth: 480 }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "admin-prod-modal__header", children: [_jsx("h2", { children: "\u2699 Meu Acesso" }), _jsx("button", { className: "produto-modal__close", style: { color: 'white', background: 'rgba(255,255,255,0.1)' }, onClick: () => { setShowAcessoModal(false); setAcessoMsg(null); }, children: "\u2715" })] }), _jsxs("div", { className: "admin-prod-modal__body", children: [_jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Nome" }), _jsx("input", { className: "form-input", value: acessoName, onChange: e => setAcessoName(e.target.value), placeholder: "Seu nome" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "E-mail" }), _jsx("input", { className: "form-input", type: "email", value: acessoEmail, onChange: e => setAcessoEmail(e.target.value), placeholder: "seu@email.com" })] }), _jsxs("div", { className: "admin__field", children: [_jsxs("label", { className: "form-label", children: ["Nova Senha ", _jsx("span", { style: { fontWeight: 400, color: 'var(--gray-400)', fontSize: 11 }, children: "(deixe em branco para manter a atual)" })] }), _jsx("input", { className: "form-input", type: "password", value: acessoPassword, onChange: e => setAcessoPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Confirmar Nova Senha" }), _jsx("input", { className: "form-input", type: "password", value: acessoConfirm, onChange: e => setAcessoConfirm(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), acessoMsg && (_jsxs("div", { style: {
                                        padding: '10px 14px', borderRadius: 8, fontSize: 13,
                                        background: acessoMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                                        color: acessoMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                        border: `1px solid ${acessoMsg.type === 'success' ? '#86efac' : '#fca5a5'}`,
                                    }, children: [acessoMsg.type === 'success' ? '✓ ' : '✕ ', acessoMsg.text] }))] }), _jsxs("div", { className: "admin-prod-modal__footer", style: { gap: 10 }, children: [_jsx("button", { className: "btn btn-outline", onClick: () => { setShowAcessoModal(false); setAcessoMsg(null); }, children: "Cancelar" }), _jsx("button", { className: "btn btn-primary", disabled: acessoLoading, onClick: async () => {
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
                                            const updateData = {
                                                name: acessoName.trim(),
                                                email: acessoEmail.trim().toLowerCase(),
                                                updated_at: new Date().toISOString(),
                                            };
                                            if (acessoPassword)
                                                updateData.password = acessoPassword;
                                            const { error } = await supabase
                                                .from('admin_users')
                                                .update(updateData)
                                                .eq('id', authData.id);
                                            if (error)
                                                throw error;
                                            // Atualiza sessionStorage
                                            sessionStorage.setItem('admin_auth', JSON.stringify({
                                                ...authData,
                                                name: acessoName.trim(),
                                                email: acessoEmail.trim().toLowerCase(),
                                            }));
                                            setAcessoPassword('');
                                            setAcessoConfirm('');
                                            setAcessoMsg({ type: 'success', text: 'Dados atualizados com sucesso!' });
                                        }
                                        catch {
                                            setAcessoMsg({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
                                        }
                                        finally {
                                            setAcessoLoading(false);
                                        }
                                    }, children: acessoLoading ? 'Salvando...' : '💾 Salvar alterações' })] })] }) })), toast && _jsx(Toast, { msg: toast })] }));
}
