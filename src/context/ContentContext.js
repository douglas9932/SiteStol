import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useRef, useState, } from 'react';
import { getHomePublished, getHomeDraft, saveHomePublished, saveHomeDraft, getSobrePublished, getSobreDraft, saveSobrePublished, saveSobreDraft, getProductsPublished, getProductsDraft, saveProductsPublished, saveProductsDraft, getCategories, saveCategories, } from '@/lib/contentService';
/* ─── DEFAULTS (vazios — o conteúdo real vem do Supabase) ───────────────────── */
const defaultCategories = [];
const defaultHomeContent = {
    carouselImages: [],
    companyDescription: '',
    carouselTagline: '',
    carouselTitle: '',
    carouselSubtitle: '',
    sobreTitle: '',
    stats: [],
    featuresTitle: '',
    features: [],
};
const defaultProductsContent = {
    headline: '',
    subheadline: '',
    products: [],
};
const defaultSobreContent = {
    heroTitle: '',
    heroSubtitle: '',
    especialidades: [],
    timelineTitle: '',
    timeline: [],
};
const defaultPublished = {
    home: defaultHomeContent, products: defaultProductsContent, sobre: defaultSobreContent,
};
const defaultDraft = {
    home: structuredClone(defaultHomeContent), products: structuredClone(defaultProductsContent), sobre: structuredClone(defaultSobreContent),
};
/* ─── CONTEXT ────────────────────────────────────────────────────────────────── */
export const ContentContext = createContext({});
export function ContentProvider({ children }) {
    // Usando useState simples — o Supabase é a fonte de verdade.
    // Não lemos o localStorage antigo para evitar crashes com dados desatualizados.
    const [published, setPublished] = useState(defaultPublished);
    const [draft, setDraft] = useState(defaultDraft);
    const [categories, setCategories] = useState(defaultCategories);
    const [ready, setReady] = useState(false);
    const isLoaded = useRef(false);
    // ── Carrega de cada tabela Supabase ao iniciar ────────────────────────────
    useEffect(() => {
        async function load() {
            const [homePub, homeDft, sobrePub, sobreDft, prodPub, prodDft, cats,] = await Promise.all([
                getHomePublished(defaultPublished.home),
                getHomeDraft(defaultDraft.home),
                getSobrePublished(defaultPublished.sobre),
                getSobreDraft(defaultDraft.sobre),
                getProductsPublished(defaultPublished.products),
                getProductsDraft(defaultDraft.products),
                getCategories(defaultCategories),
            ]);
            setPublished({ home: homePub, sobre: sobrePub, products: prodPub });
            setDraft({ home: homeDft, sobre: sobreDft, products: prodDft });
            setCategories(cats);
            isLoaded.current = true;
            setReady(true);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const content = { published, draft, categories };
    // ── Sincroniza com Supabase apenas após o carregamento inicial ────────────
    // Removido save automático por useEffect — dados só são salvos
    // explicitamente via publishDirect() e addCategory/updateCategory/removeCategory
    const updateDraft = useCallback((page, data) => {
        setDraft((prev) => ({ ...prev, [page]: { ...prev[page], ...data } }));
    }, [setDraft]);
    const publishDirect = useCallback((page, data) => {
        setDraft((prevDraft) => {
            const snapshot = structuredClone({ ...prevDraft[page], ...data });
            setPublished((prev) => {
                const next = { ...prev, [page]: snapshot };
                // Salva explicitamente no Supabase
                if (page === 'home') {
                    saveHomePublished(snapshot);
                    saveHomeDraft(snapshot);
                }
                if (page === 'sobre') {
                    saveSobrePublished(snapshot);
                    saveSobreDraft(snapshot);
                }
                if (page === 'products') {
                    saveProductsPublished(snapshot);
                    saveProductsDraft(snapshot);
                }
                return next;
            });
            return { ...prevDraft, [page]: snapshot };
        });
    }, [setDraft, setPublished]);
    const publish = useCallback((page) => {
        setDraft((prevDraft) => {
            const snapshot = structuredClone(prevDraft[page]);
            setPublished((prev) => {
                const next = { ...prev, [page]: snapshot };
                if (page === 'home')
                    saveHomePublished(snapshot);
                if (page === 'sobre')
                    saveSobrePublished(snapshot);
                if (page === 'products')
                    saveProductsPublished(snapshot);
                return next;
            });
            return prevDraft;
        });
    }, [setDraft, setPublished]);
    const discardDraft = useCallback((page) => {
        setPublished((prevPublished) => {
            const snapshot = structuredClone(prevPublished[page]);
            setDraft((prev) => ({ ...prev, [page]: snapshot }));
            return prevPublished;
        });
    }, [setDraft, setPublished]);
    const addCategory = useCallback((name, color) => {
        setCategories((prev) => {
            const next = [...prev, { id: Date.now(), name: name.trim(), color }];
            saveCategories(next);
            return next;
        });
    }, [setCategories]);
    const updateCategory = useCallback((id, name, color) => {
        setCategories((prev) => {
            const next = prev.map((c) => c.id === id ? { ...c, name: name.trim(), color } : c);
            saveCategories(next);
            return next;
        });
    }, [setCategories]);
    const removeCategory = useCallback((id) => {
        setCategories((prev) => {
            const next = prev.filter((c) => c.id !== id);
            saveCategories(next);
            return next;
        });
        const strip = (products) => products.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((cid) => cid !== id) }));
        setDraft((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
        setPublished((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
    }, [setCategories, setDraft, setPublished]);
    // Enquanto o Supabase não respondeu, mostra spinner
    if (!ready) {
        return (_jsxs("div", { style: {
                position: 'fixed', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#ffffff', flexDirection: 'column', gap: 16,
            }, children: [_jsx("div", { style: {
                        width: 40, height: 40,
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #1f2937',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    } }), _jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` }), _jsx("p", { style: { color: '#9ca3af', fontSize: 13, fontFamily: 'sans-serif' }, children: "Carregando..." })] }));
    }
    return (_jsx(ContentContext.Provider, { value: {
            content,
            updateDraft, publishDirect, publish, discardDraft,
            addCategory, updateCategory, removeCategory,
        }, children: children }));
}
