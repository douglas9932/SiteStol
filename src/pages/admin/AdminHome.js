import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
        return false;
    })();
    const sobrePayload = () => ({
        heroTitle: sobreHeroTitle, heroSubtitle: sobreHeroSubtitle,
        especialidades, timelineTitle, timeline,
    });
    const handlePreview = () => {
        if (activeTab === 'home')
            updateDraft('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
        else if (activeTab === 'sobre')
            updateDraft('sobre', sobrePayload());
        else if (activeTab === 'produtos')
            updateDraft('products', { products, headline: prodHeadline, subheadline: prodSubline });
        const page = (activeTab === 'categorias' || activeTab === 'sobre') ? activeTab === 'sobre' ? 'sobre' : 'produtos' : activeTab;
        window.open(`/preview?page=${page}`, '_blank');
    };
    const confirmPublish = () => {
        setShowModal(false);
        if (activeTab === 'home')
            publishDirect('home', { carouselImages: homeImages, companyDescription: homeText, carouselTagline, carouselTitle, carouselSubtitle, sobreTitle, stats, featuresTitle, features });
        else if (activeTab === 'sobre')
            publishDirect('sobre', sobrePayload());
        else if (activeTab === 'produtos')
            publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
        showToast('✅ Publicado! O site já exibe o novo conteúdo.');
    };
    const handleDiscard = () => {
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
    ];
    return (_jsxs("div", { className: "admin", children: [showModal && _jsx(PublishModal, { page: activeTab, onConfirm: confirmPublish, onCancel: () => setShowModal(false) }), _jsxs("div", { className: "admin__layout", children: [_jsxs("aside", { className: "admin__sidebar", children: [_jsxs("div", { className: "admin__sidebar-brand", children: [_jsx("div", { className: "admin__logo", children: "AT" }), _jsxs("div", { children: [_jsx("p", { className: "admin__title", children: "AeroTech Brasil" }), _jsx("p", { className: "admin__subtitle", children: "Painel de Administra\u00E7\u00E3o" })] })] }), _jsxs("nav", { className: "admin__sidebar-nav", children: [_jsx("p", { className: "admin__sidebar-section-label", children: "Conte\u00FAdo" }), TABS.map(({ key, label, icon }) => {
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
                                        return (_jsxs("button", { className: `admin__sidebar-item ${activeTab === key ? 'admin__sidebar-item--active' : ''}`, onClick: () => setActiveTab(key), children: [_jsx("span", { className: "admin__sidebar-item-icon", children: icon }), _jsx("span", { className: "admin__sidebar-item-label", children: label }), hasDot && _jsx("span", { className: "admin__sidebar-dot" })] }, key));
                                    })] }), _jsx("div", { className: "admin__sidebar-footer", children: _jsx("a", { href: "/", className: "admin__sidebar-site-link", target: "_blank", rel: "noreferrer", children: "\uD83C\uDF10 Ver site publicado" }) })] }), _jsxs("div", { className: "admin__content", children: [_jsx("div", { className: "admin__actionbar", children: activeTab === 'categorias' ? (_jsx("span", { className: "admin__cat-notice", children: "\u2713 Categorias salvas automaticamente" })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "btn btn-ghost", onClick: handleDiscard, disabled: !isDirty, children: "\u21A9 Descartar" }), _jsx("button", { className: "btn btn-outline-gold", onClick: handlePreview, children: "\uD83D\uDC41 Preview" }), _jsx("button", { className: `btn btn-primary ${isDirty ? 'btn-primary--pulse' : ''}`, onClick: () => setShowModal(true), children: "\uD83D\uDE80 Publicar" })] })) }), _jsxs("div", { className: `admin__dirty-bar ${isDirty ? 'admin__dirty-bar--visible' : ''}`, children: ["\u270F\uFE0F Altera\u00E7\u00F5es n\u00E3o publicadas \u2014 clique em ", _jsx("strong", { children: "Publicar" }), " para torn\u00E1-las vis\u00EDveis."] }), _jsx("div", { className: "admin__scroll", children: _jsxs("main", { className: "admin__body", children: [activeTab === 'home' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDDBC Imagens do Carrossel" }), _jsx("p", { className: "admin__section-desc", children: "Adicione imagens pela URL. Recomendado: 1400\u00D7800px." })] }), _jsxs("span", { className: "admin__count", children: [homeImages.length, " imagem", homeImages.length !== 1 ? 'ns' : ''] })] }), homeImages.length > 0 ? (_jsx("div", { className: "admin__img-grid", children: homeImages.map((img) => _jsx(ImageCard, { img: img, onRemove: removeImage, onAltChange: updateAlt }, img.id)) })) : (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83D\uDCF7" }), _jsx("p", { children: "Nenhuma imagem adicionada." })] })), _jsxs("div", { className: "admin__add-url", children: [_jsx("input", { className: "form-input", type: "url", placeholder: "Cole a URL da imagem aqui...", value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addImage() }), _jsx("button", { className: "btn btn-primary", onClick: addImage, children: "+ URL" })] }), _jsx("div", { className: "admin__upload-divider", children: _jsx("span", { children: "ou" }) }), _jsxs("div", { className: "admin__upload-file", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleFileUpload }), _jsx("button", { className: "btn admin__upload-btn", onClick: () => fileInputRef.current?.click(), children: "\uD83D\uDCC1 Escolher do computador / celular" }), _jsx("p", { className: "admin__hint", style: { margin: 0 }, children: "Aceita JPG, PNG, WebP. M\u00FAltiplos arquivos permitidos." })] }), _jsxs("p", { className: "admin__hint", children: ["\uD83D\uDCA1 Use ", _jsx("strong", { children: "unsplash.com" }), " para imagens gratuitas por URL."] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u270D Texto do Carrossel" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1.25rem' }, children: "Deixe em branco para exibir somente as imagens, sem escurec\u00EA-las." }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Tagline (linha pequena acima do t\u00EDtulo)" }), _jsx("input", { className: "form-input", placeholder: "Ex: Excel\u00EAncia em Avia\u00E7\u00E3o", value: carouselTagline, onChange: (e) => setCarouselTagline(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", placeholder: "Ex: Precis\u00E3o que eleva seus resultados", value: carouselTitle, onChange: (e) => setCarouselTitle(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", placeholder: "Ex: Solu\u00E7\u00F5es aeron\u00E1uticas de alta performance...", value: carouselSubtitle, onChange: (e) => setCarouselSubtitle(e.target.value) })] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFF7 Se\u00E7\u00E3o \"Sobre\"" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: sobreTitle, onChange: (e) => setSobreTitle(e.target.value), placeholder: "Sobre a AeroTech Brasil" })] }), _jsxs("div", { className: "admin__field", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [_jsx("label", { className: "form-label", style: { margin: 0 }, children: "Descri\u00E7\u00E3o da Empresa" }), _jsxs("span", { className: "admin__count", children: [homeText.length, " chars"] })] }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: 8 }, children: "Texto da se\u00E7\u00E3o \"Sobre\" na Home." }), _jsx("textarea", { className: "form-textarea", value: homeText, onChange: (e) => setHomeText(e.target.value), rows: 10, placeholder: "Digite a descri\u00E7\u00E3o..." })] }), _jsx("label", { className: "form-label", style: { marginTop: '1rem', display: 'block' }, children: "Cards de Estat\u00EDsticas" }), _jsx("div", { className: "admin-stats-grid", children: stats.map((s, i) => (_jsxs("div", { className: "admin-stat-row", children: [_jsx("input", { className: "form-input admin-stat-row__value", placeholder: "18+", value: s.value, onChange: (e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x)) }), _jsx("input", { className: "form-input admin-stat-row__label", placeholder: "Anos de Experi\u00EAncia", value: s.label, onChange: (e) => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setStats(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setStats(prev => [...prev, { value: '', label: '' }]), children: "+ Adicionar Card" })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u26A1 Se\u00E7\u00E3o \"Diferenciais\"" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: featuresTitle, onChange: (e) => setFeaturesTitle(e.target.value), placeholder: "Diferenciais que fazem a diferen\u00E7a" })] }), _jsx("label", { className: "form-label", style: { marginTop: '1rem', display: 'block' }, children: "Cards de Diferenciais" }), _jsx("div", { className: "admin-features-list", children: features.map((f, i) => (_jsxs("div", { className: "admin-feature-row", children: [_jsxs("div", { className: "admin-feature-row__top", children: [_jsx("input", { className: "form-input admin-feature-row__icon", placeholder: "\uD83D\uDEE1\uFE0F", value: f.icon, maxLength: 4, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x)) }), _jsx("input", { className: "form-input admin-feature-row__title", placeholder: "T\u00EDtulo...", value: f.title, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setFeatures(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }), _jsx("textarea", { className: "form-textarea", rows: 2, placeholder: "Descri\u00E7\u00E3o...", value: f.desc, onChange: (e) => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x)) })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setFeatures(prev => [...prev, { icon: '⭐', title: '', desc: '' }]), children: "+ Adicionar Diferencial" })] })] })), activeTab === 'sobre' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83C\uDFD4 Hero da P\u00E1gina Sobre" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", value: sobreHeroTitle, onChange: (e) => setSobreHeroTitle(e.target.value), placeholder: "Sobre a AeroTech Brasil" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", value: sobreHeroSubtitle, onChange: (e) => setSobreHeroSubtitle(e.target.value), placeholder: "Quase duas d\u00E9cadas de excel\u00EAncia..." })] })] }), _jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\u2B50 Nossas Especialidades" }), _jsx("p", { className: "admin__section-desc", style: { marginBottom: '1rem' }, children: "Lista exibida no painel lateral da p\u00E1gina Sobre." }), _jsx("div", { className: "admin-features-list", children: especialidades.map((e, i) => (_jsxs("div", { className: "admin-stat-row", children: [_jsx("input", { className: "form-input", style: { gridColumn: '1 / 3' }, value: e, placeholder: "Avia\u00E7\u00E3o Agr\u00EDcola de Precis\u00E3o", onChange: (ev) => setEspecialidades(prev => prev.map((x, j) => j === i ? ev.target.value : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setEspecialidades(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }, i))) }), _jsx("button", { className: "btn btn-primary", style: { marginTop: '10px', fontSize: '13px' }, onClick: () => setEspecialidades(prev => [...prev, '']), children: "+ Adicionar Especialidade" })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDD50 Linha do Tempo" }), _jsx("p", { className: "admin__section-desc", children: "Se\u00E7\u00E3o \"Nossa Jornada\" na p\u00E1gina Sobre." })] }), _jsx("button", { className: "btn btn-primary", onClick: () => setTimeline(prev => [...prev, { year: String(new Date().getFullYear()), title: '', desc: '' }]), children: "+ Adicionar" })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo da Se\u00E7\u00E3o" }), _jsx("input", { className: "form-input", value: timelineTitle, onChange: (e) => setTimelineTitle(e.target.value), placeholder: "Uma hist\u00F3ria de crescimento" })] }), _jsx("div", { className: "admin-features-list", children: timeline.map((t, i) => (_jsxs("div", { className: "admin-feature-row", children: [_jsxs("div", { className: "admin-feature-row__top", children: [_jsx("input", { className: "form-input", style: { width: '100px', flexShrink: 0 }, placeholder: "2005", value: t.year, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x)) }), _jsx("input", { className: "form-input", placeholder: "T\u00EDtulo (ex: Funda\u00E7\u00E3o)", value: t.title, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x)) }), _jsx("button", { className: "btn btn-danger", style: { padding: '8px 12px' }, onClick: () => setTimeline(prev => prev.filter((_, j) => j !== i)), children: "\u2715" })] }), _jsx("textarea", { className: "form-textarea", rows: 2, placeholder: "Descri\u00E7\u00E3o...", value: t.desc, onChange: (e) => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x)) })] }, i))) })] })] })), activeTab === 'produtos' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCCC Cabe\u00E7alho da P\u00E1gina" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", value: prodHeadline, onChange: (e) => setProdHeadline(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", value: prodSubline, onChange: (e) => setProdSubline(e.target.value) })] })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCE6 Produtos" }), _jsxs("p", { className: "admin__section-desc", children: [(products ?? []).filter(p => p.active !== false).length, " ativos \u00B7 ", (products ?? []).filter(p => p.active === false).length, " inativos"] })] }), _jsx("button", { className: "btn btn-primary", onClick: () => { addProduct(); setEditingProductId(Date.now()); }, children: "+ Novo Produto" })] }), _jsxs("div", { className: "admin-prod-filter", children: [_jsx("input", { className: "form-input", placeholder: "\uD83D\uDD0D Buscar por nome...", value: prodSearch, onChange: (e) => setProdSearch(e.target.value) }), prodSearch && (_jsx("button", { className: "admin-prod-filter__clear", onClick: () => setProdSearch(''), children: "\u2715" }))] }), Array.isArray(products) && products.length > 0 ? (_jsx("div", { className: "admin-prod-grid", children: products
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
                                                })()] })), activeTab === 'categorias' && (_jsx(CategoryManager, { categories: content.categories, onAdd: addCategory, onUpdate: updateCategory, onRemove: removeCategory, showToast: showToast }))] }) })] })] }), toast && _jsx(Toast, { msg: toast })] }));
}
