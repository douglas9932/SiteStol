import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  getHomePublished, getHomeDraft, saveHomePublished, saveHomeDraft,
  getSobrePublished, getSobreDraft, saveSobrePublished, saveSobreDraft,
  getProductsPublished, getProductsDraft, saveProductsPublished, saveProductsDraft,
  getCategories, saveCategories,
} from '@/lib/contentService';

/* ─── TYPES ─────────────────────────────────────────────────────────────────── */

export interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface ProductAccordionItem {
  label: string;
  content: string;
}

export interface DemoImage {
  url: string;
  caption?: string; // descrição opcional — só exibida se informada
}

export interface Product {
  id: number;
  icon: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  demoImages?: DemoImage[]; // galeria demonstrativa com legenda opcional
  tag?: string;
  categoryIds: number[];
  active?: boolean;
  specifications?: ProductAccordionItem[];
  info?: ProductAccordionItem[];
}

export interface HomeStat {
  value: string;
  label: string;
}

export interface HomeFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface SobreTimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface SobreContent {
  heroTitle: string;
  heroSubtitle: string;
  especialidades: string[];
  timelineTitle: string;
  timeline: SobreTimelineItem[];
}

export interface HomeContent {
  carouselImages: CarouselImage[];
  companyDescription: string;
  carouselTagline: string;
  carouselTitle: string;
  carouselSubtitle: string;
  sobreTitle: string;
  stats: HomeStat[];
  featuresTitle: string;
  features: HomeFeature[];
}

export interface ProductsContent {
  headline: string;
  subheadline: string;
  products: Product[];
}

export interface ContentState {
  published: { home: HomeContent; products: ProductsContent; sobre: SobreContent; };
  draft:     { home: HomeContent; products: ProductsContent; sobre: SobreContent; };
  categories: Category[];
}

export interface ContentContextType {
  content: ContentState;
  updateDraft:    (page: 'home' | 'products' | 'sobre', data: Partial<HomeContent> | Partial<ProductsContent> | Partial<SobreContent>) => void;
  publishDirect:  (page: 'home' | 'products' | 'sobre', data: Partial<HomeContent> | Partial<ProductsContent> | Partial<SobreContent>) => void;
  publish:        (page: 'home' | 'products' | 'sobre') => void;
  discardDraft:   (page: 'home' | 'products' | 'sobre') => void;
  addCategory:    (name: string, color: string) => void;
  updateCategory: (id: number, name: string, color: string) => void;
  removeCategory: (id: number) => void;
}

/* ─── DEFAULTS (vazios — o conteúdo real vem do Supabase) ───────────────────── */

const defaultCategories: Category[] = [];

const defaultHomeContent: HomeContent = {
  carouselImages:   [],
  companyDescription: '',
  carouselTagline:  '',
  carouselTitle:    '',
  carouselSubtitle: '',
  sobreTitle:       '',
  stats:            [],
  featuresTitle:    '',
  features:         [],
};

const defaultProductsContent: ProductsContent = {
  headline:    '',
  subheadline: '',
  products:    [],
};

const defaultSobreContent: SobreContent = {
  heroTitle:      '',
  heroSubtitle:   '',
  especialidades: [],
  timelineTitle:  '',
  timeline:       [],
};

const defaultPublished: ContentState['published'] = {
  home: defaultHomeContent, products: defaultProductsContent, sobre: defaultSobreContent,
};
const defaultDraft: ContentState['draft'] = {
  home: structuredClone(defaultHomeContent), products: structuredClone(defaultProductsContent), sobre: structuredClone(defaultSobreContent),
};

/* ─── CONTEXT ────────────────────────────────────────────────────────────────── */

export const ContentContext = createContext<ContentContextType>({} as ContentContextType);

export function ContentProvider({ children }: { children: ReactNode }) {
  // Usando useState simples — o Supabase é a fonte de verdade.
  // Não lemos o localStorage antigo para evitar crashes com dados desatualizados.
  const [published,  setPublished]  = useState<ContentState['published']>(defaultPublished);
  const [draft,      setDraft]      = useState<ContentState['draft']>(defaultDraft);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [ready,      setReady]      = useState(false);

  const isLoaded = useRef(false);

  // ── Carrega de cada tabela Supabase ao iniciar ────────────────────────────
  useEffect(() => {
    async function load() {
      const [
        homePub, homeDft,
        sobrePub, sobreDft,
        prodPub, prodDft,
        cats,
      ] = await Promise.all([
        getHomePublished(defaultPublished.home),
        getHomeDraft(defaultDraft.home),
        getSobrePublished(defaultPublished.sobre),
        getSobreDraft(defaultDraft.sobre),
        getProductsPublished(defaultPublished.products),
        getProductsDraft(defaultDraft.products),
        getCategories(defaultCategories),
      ]);

      setPublished({ home: homePub, sobre: sobrePub, products: prodPub });
      setDraft({     home: homeDft, sobre: sobreDft, products: prodDft });
      setCategories(cats);

      isLoaded.current = true;
      setReady(true);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content: ContentState = { published, draft, categories };

  // ── Sincroniza com Supabase apenas após o carregamento inicial ────────────
  // Removido save automático por useEffect — dados só são salvos
  // explicitamente via publishDirect() e addCategory/updateCategory/removeCategory

  const updateDraft = useCallback(
    (page: 'home' | 'products' | 'sobre', data: any) => {
      setDraft((prev) => ({ ...prev, [page]: { ...prev[page], ...data } }));
    }, [setDraft]
  );

  const publishDirect = useCallback(
    (page: 'home' | 'products' | 'sobre', data: any) => {
      setDraft((prevDraft) => {
        const snapshot = structuredClone({ ...prevDraft[page], ...data });
        setPublished((prev) => {
          const next = { ...prev, [page]: snapshot };
          // Salva explicitamente no Supabase
          if (page === 'home')     { saveHomePublished(snapshot);     saveHomeDraft(snapshot); }
          if (page === 'sobre')    { saveSobrePublished(snapshot);    saveSobreDraft(snapshot); }
          if (page === 'products') { saveProductsPublished(snapshot); saveProductsDraft(snapshot); }
          return next;
        });
        return { ...prevDraft, [page]: snapshot };
      });
    }, [setDraft, setPublished]
  );

  const publish = useCallback(
    (page: 'home' | 'products' | 'sobre') => {
      setDraft((prevDraft) => {
        const snapshot = structuredClone(prevDraft[page]);
        setPublished((prev) => {
          const next = { ...prev, [page]: snapshot };
          if (page === 'home')     saveHomePublished(snapshot);
          if (page === 'sobre')    saveSobrePublished(snapshot);
          if (page === 'products') saveProductsPublished(snapshot);
          return next;
        });
        return prevDraft;
      });
    }, [setDraft, setPublished]
  );

  const discardDraft = useCallback(
    (page: 'home' | 'products' | 'sobre') => {
      setPublished((prevPublished) => {
        const snapshot = structuredClone(prevPublished[page]);
        setDraft((prev) => ({ ...prev, [page]: snapshot }));
        return prevPublished;
      });
    }, [setDraft, setPublished]
  );

  const addCategory = useCallback((name: string, color: string) => {
    setCategories((prev) => {
      const next = [...prev, { id: Date.now(), name: name.trim(), color }];
      saveCategories(next);
      return next;
    });
  }, [setCategories]);

  const updateCategory = useCallback((id: number, name: string, color: string) => {
    setCategories((prev) => {
      const next = prev.map((c) => c.id === id ? { ...c, name: name.trim(), color } : c);
      saveCategories(next);
      return next;
    });
  }, [setCategories]);

  const removeCategory = useCallback((id: number) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCategories(next);
      return next;
    });
    const strip = (products: Product[]) =>
      products.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((cid) => cid !== id) }));
    setDraft((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
    setPublished((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
  }, [setCategories, setDraft, setPublished]);

  // Enquanto o Supabase não respondeu, mostra spinner
  if (!ready) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#ffffff', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #1f2937',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#9ca3af', fontSize: 13, fontFamily: 'sans-serif' }}>
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <ContentContext.Provider value={{
      content,
      updateDraft, publishDirect, publish, discardDraft,
      addCategory, updateCategory, removeCategory,
    }}>
      {children}
    </ContentContext.Provider>
  );
}