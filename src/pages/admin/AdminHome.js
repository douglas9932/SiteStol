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
function ProductRow({ product, categories, onChange, onCategoriesChange, onRemove }) {
    const fileRef = useRef(null);
    const handleImageFile = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (ev) => onChange(product.id, 'image', ev.target?.result);
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    return (_jsxs("div", { className: "admin-product-row", children: [_jsxs("div", { className: "admin-product-row__top", children: [_jsx("input", { className: "form-input admin-product-row__icon", placeholder: "\uD83D\uDD27", value: product.icon, onChange: (e) => onChange(product.id, 'icon', e.target.value), maxLength: 4 }), _jsx("input", { className: "form-input admin-product-row__title", placeholder: "T\u00EDtulo...", value: product.title, onChange: (e) => onChange(product.id, 'title', e.target.value) }), _jsx("input", { className: "form-input admin-product-row__tag", placeholder: "Tag (ex: Principal)", value: product.tag ?? '', onChange: (e) => onChange(product.id, 'tag', e.target.value) }), _jsx("button", { className: "btn btn-danger admin-product-row__del", onClick: () => onRemove(product.id), children: "\u2715" })] }), _jsxs("div", { className: "admin-product-row__body", children: [_jsxs("div", { className: "admin-product-row__img-col", children: [_jsx("span", { className: "admin-product-row__cats-label", children: "Foto do Produto" }), _jsx("div", { className: "admin-product-row__img-preview", children: product.image
                                    ? _jsx("img", { src: product.image, alt: product.title })
                                    : _jsx("span", { children: product.icon || '📦' }) }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", style: { display: 'none' }, onChange: handleImageFile }), _jsx("button", { className: "btn admin__upload-btn", style: { fontSize: '11px', padding: '6px 10px' }, onClick: () => fileRef.current?.click(), children: "\uD83D\uDCC1 Carregar foto" }), product.image && (_jsx("button", { className: "btn btn-danger", style: { fontSize: '11px', padding: '5px 10px', marginTop: 4 }, onClick: () => onChange(product.id, 'image', ''), children: "\uD83D\uDDD1 Remover" })), _jsx("input", { className: "form-input", style: { fontSize: '11px', marginTop: 6 }, placeholder: "Ou cole URL da imagem...", value: product.image?.startsWith('data:') ? '' : (product.image ?? ''), onChange: (e) => onChange(product.id, 'image', e.target.value) })] }), _jsxs("div", { className: "admin-product-row__desc-col", children: [_jsx("span", { className: "admin-product-row__cats-label", children: "Descri\u00E7\u00E3o" }), _jsx("textarea", { className: "form-textarea admin-product-row__desc", placeholder: "Descri\u00E7\u00E3o do produto...", value: product.description, onChange: (e) => onChange(product.id, 'description', e.target.value), rows: 5 }), _jsxs("div", { className: "admin-product-row__cats", style: { marginTop: 12 }, children: [_jsx("span", { className: "admin-product-row__cats-label", children: "Categorias:" }), _jsx(CategorySelector, { selected: product.categoryIds ?? [], categories: categories, onChange: (ids) => onCategoriesChange(product.id, ids) })] })] })] })] }));
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
    const [homeImages, setHomeImages] = useState(structuredClone(content.draft.home.carouselImages));
    const [homeText, setHomeText] = useState(content.draft.home.companyDescription);
    const [products, setProducts] = useState(structuredClone(content.draft.products.products));
    const [prodHeadline, setProdHeadline] = useState(content.draft.products.headline);
    const [prodSubline, setProdSubline] = useState(content.draft.products.subheadline);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [toast, setToast] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(() => {
        const t = searchParams.get('tab');
        return (t === 'produtos' || t === 'categorias') ? t : 'home';
    });
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
            return JSON.stringify(homeImages) !== JSON.stringify(pub.carouselImages) || homeText !== pub.companyDescription;
        }
        if (activeTab === 'produtos') {
            const pub = content.published.products;
            return JSON.stringify(products) !== JSON.stringify(pub.products) || prodHeadline !== pub.headline || prodSubline !== pub.subheadline;
        }
        return false;
    })();
    const handlePreview = () => {
        if (activeTab === 'home')
            updateDraft('home', { carouselImages: homeImages, companyDescription: homeText });
        else if (activeTab === 'produtos')
            updateDraft('products', { products, headline: prodHeadline, subheadline: prodSubline });
        const page = activeTab === 'categorias' ? 'produtos' : activeTab;
        window.open(`/preview?page=${page}`, '_blank');
    };
    const confirmPublish = () => {
        setShowModal(false);
        if (activeTab === 'home')
            publishDirect('home', { carouselImages: homeImages, companyDescription: homeText });
        else if (activeTab === 'produtos')
            publishDirect('products', { products, headline: prodHeadline, subheadline: prodSubline });
        showToast('✅ Publicado! O site já exibe o novo conteúdo.');
    };
    const handleDiscard = () => {
        if (activeTab === 'home') {
            const pub = content.published.home;
            setHomeImages(structuredClone(pub.carouselImages));
            setHomeText(pub.companyDescription);
            discardDraft('home');
        }
        else if (activeTab === 'produtos') {
            const pub = content.published.products;
            setProducts(structuredClone(pub.products));
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
    const addProduct = () => setProducts((prev) => [...prev, { id: Date.now(), icon: '⭐', title: 'Novo Produto', description: 'Descrição...', categoryIds: [] }]);
    const updateProduct = (id, field, value) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    const updateProductCategories = (id, categoryIds) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, categoryIds } : p));
    const removeProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
    const showPublishBtn = activeTab !== 'categorias';
    const TABS = [
        { key: 'home', label: 'Home', icon: '🏠' },
        { key: 'categorias', label: 'Categorias', icon: '🏷' },
        { key: 'produtos', label: 'Produtos', icon: '📦' },
    ];
    return (_jsxs("div", { className: "admin", children: [showModal && _jsx(PublishModal, { page: activeTab, onConfirm: confirmPublish, onCancel: () => setShowModal(false) }), _jsxs("div", { className: "admin__layout", children: [_jsxs("aside", { className: "admin__sidebar", children: [_jsxs("div", { className: "admin__sidebar-brand", children: [_jsx("div", { className: "admin__logo", children: "AT" }), _jsxs("div", { children: [_jsx("p", { className: "admin__title", children: "AeroTech Brasil" }), _jsx("p", { className: "admin__subtitle", children: "Painel de Administra\u00E7\u00E3o" })] })] }), _jsxs("nav", { className: "admin__sidebar-nav", children: [_jsx("p", { className: "admin__sidebar-section-label", children: "Conte\u00FAdo" }), TABS.map(({ key, label, icon }) => {
                                        const hasDot = key !== 'categorias' && key !== activeTab && (() => {
                                            const pub = key === 'home' ? content.published.home : content.published.products;
                                            const local = key === 'home'
                                                ? { carouselImages: homeImages, companyDescription: homeText }
                                                : { products, headline: prodHeadline, subheadline: prodSubline };
                                            return JSON.stringify(local) !== JSON.stringify(pub);
                                        })();
                                        return (_jsxs("button", { className: `admin__sidebar-item ${activeTab === key ? 'admin__sidebar-item--active' : ''}`, onClick: () => setActiveTab(key), children: [_jsx("span", { className: "admin__sidebar-item-icon", children: icon }), _jsx("span", { className: "admin__sidebar-item-label", children: label }), hasDot && _jsx("span", { className: "admin__sidebar-dot" })] }, key));
                                    })] }), _jsx("div", { className: "admin__sidebar-footer", children: _jsx("a", { href: "/", className: "admin__sidebar-site-link", target: "_blank", rel: "noreferrer", children: "\uD83C\uDF10 Ver site publicado" }) })] }), _jsxs("div", { className: "admin__content", children: [_jsx("div", { className: "admin__actionbar", children: activeTab === 'categorias' ? (_jsx("span", { className: "admin__cat-notice", children: "\u2713 Categorias salvas automaticamente" })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "btn btn-ghost", onClick: handleDiscard, disabled: !isDirty, children: "\u21A9 Descartar" }), _jsx("button", { className: "btn btn-outline-gold", onClick: handlePreview, children: "\uD83D\uDC41 Preview" }), _jsx("button", { className: `btn btn-primary ${isDirty ? 'btn-primary--pulse' : ''}`, onClick: () => setShowModal(true), children: "\uD83D\uDE80 Publicar" })] })) }), isDirty && (_jsxs("div", { className: "admin__dirty-bar", children: ["\u270F\uFE0F Altera\u00E7\u00F5es n\u00E3o publicadas \u2014 clique em ", _jsx("strong", { children: "Publicar" }), " para torn\u00E1-las vis\u00EDveis."] })), _jsx("div", { className: "admin__scroll", children: _jsxs("main", { className: "admin__body", children: [activeTab === 'home' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDDBC Imagens do Carrossel" }), _jsx("p", { className: "admin__section-desc", children: "Adicione imagens pela URL. Recomendado: 1400\u00D7800px." })] }), _jsxs("span", { className: "admin__count", children: [homeImages.length, " imagem", homeImages.length !== 1 ? 'ns' : ''] })] }), homeImages.length > 0 ? (_jsx("div", { className: "admin__img-grid", children: homeImages.map((img) => _jsx(ImageCard, { img: img, onRemove: removeImage, onAltChange: updateAlt }, img.id)) })) : (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83D\uDCF7" }), _jsx("p", { children: "Nenhuma imagem adicionada." })] })), _jsxs("div", { className: "admin__add-url", children: [_jsx("input", { className: "form-input", type: "url", placeholder: "Cole a URL da imagem aqui...", value: newImageUrl, onChange: (e) => setNewImageUrl(e.target.value), onKeyDown: (e) => e.key === 'Enter' && addImage() }), _jsx("button", { className: "btn btn-primary", onClick: addImage, children: "+ URL" })] }), _jsx("div", { className: "admin__upload-divider", children: _jsx("span", { children: "ou" }) }), _jsxs("div", { className: "admin__upload-file", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, style: { display: 'none' }, onChange: handleFileUpload }), _jsx("button", { className: "btn admin__upload-btn", onClick: () => fileInputRef.current?.click(), children: "\uD83D\uDCC1 Escolher do computador / celular" }), _jsx("p", { className: "admin__hint", style: { margin: 0 }, children: "Aceita JPG, PNG, WebP. M\u00FAltiplos arquivos permitidos." })] }), _jsxs("p", { className: "admin__hint", children: ["\uD83D\uDCA1 Use ", _jsx("strong", { children: "unsplash.com" }), " para imagens gratuitas por URL."] })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCDD Descri\u00E7\u00E3o da Empresa" }), _jsx("p", { className: "admin__section-desc", children: "Texto da se\u00E7\u00E3o \"Sobre\" na Home." })] }), _jsxs("span", { className: "admin__count", children: [homeText.length, " chars"] })] }), _jsx("textarea", { className: "form-textarea", value: homeText, onChange: (e) => setHomeText(e.target.value), rows: 10, placeholder: "Digite a descri\u00E7\u00E3o..." })] })] })), activeTab === 'produtos' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin__section", children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCCC Cabe\u00E7alho da P\u00E1gina" }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "T\u00EDtulo principal" }), _jsx("input", { className: "form-input", value: prodHeadline, onChange: (e) => setProdHeadline(e.target.value) })] }), _jsxs("div", { className: "admin__field", children: [_jsx("label", { className: "form-label", children: "Subt\u00EDtulo" }), _jsx("input", { className: "form-input", value: prodSubline, onChange: (e) => setProdSubline(e.target.value) })] })] }), _jsxs("div", { className: "admin__section", children: [_jsxs("div", { className: "admin__section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "admin__section-title", children: "\uD83D\uDCE6 Lista de Produtos / Servi\u00E7os" }), _jsx("p", { className: "admin__section-desc", children: "Vincule categorias clicando nos chips coloridos." })] }), _jsx("button", { className: "btn btn-primary", onClick: addProduct, children: "+ Novo Produto" })] }), products.length > 0 ? (_jsx("div", { className: "admin__products-list", children: products.map((p) => (_jsx(ProductRow, { product: p, categories: content.categories, onChange: updateProduct, onCategoriesChange: updateProductCategories, onRemove: removeProduct }, p.id))) })) : (_jsxs("div", { className: "admin__empty", children: [_jsx("span", { children: "\uD83D\uDCE6" }), _jsx("p", { children: "Nenhum produto. Clique em \"+ Novo Produto\"." })] }))] })] })), activeTab === 'categorias' && (_jsx(CategoryManager, { categories: content.categories, onAdd: addCategory, onUpdate: updateCategory, onRemove: removeCategory, showToast: showToast }))] }) })] })] }), toast && _jsx(Toast, { msg: toast })] }));
}
