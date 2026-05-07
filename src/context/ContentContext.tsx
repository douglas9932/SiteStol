import React, {
  createContext,
  useCallback,
  ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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

export interface Product {
  id: number;
  icon: string;
  title: string;
  description: string;
  image?: string;   // URL ou base64 da foto principal
  tag?: string;
  categoryIds: number[];
}

export interface HomeContent {
  carouselImages: CarouselImage[];
  companyDescription: string;
}

export interface ProductsContent {
  headline: string;
  subheadline: string;
  products: Product[];
}

export interface ContentState {
  published: { home: HomeContent; products: ProductsContent; };
  draft:     { home: HomeContent; products: ProductsContent; };
  categories: Category[];
}

export interface ContentContextType {
  content: ContentState;
  updateDraft:    (page: 'home' | 'products', data: Partial<HomeContent> | Partial<ProductsContent>) => void;
  publishDirect:  (page: 'home' | 'products', data: Partial<HomeContent> | Partial<ProductsContent>) => void;
  publish:        (page: 'home' | 'products') => void;
  discardDraft:   (page: 'home' | 'products') => void;
  addCategory:    (name: string, color: string) => void;
  updateCategory: (id: number, name: string, color: string) => void;
  removeCategory: (id: number) => void;
}

/* ─── STORAGE KEYS ───────────────────────────────────────────────────────────── */
const STORAGE_KEY_PUBLISHED  = 'aerotech_v1_published';
const STORAGE_KEY_DRAFT      = 'aerotech_v1_draft';
const STORAGE_KEY_CATEGORIES = 'aerotech_v1_categories';

/* ─── DEFAULTS ───────────────────────────────────────────────────────────────── */

const defaultCategories: Category[] = [
  { id: 1, name: 'Aviação Agrícola', color: '#16a34a' },
  { id: 2, name: 'Manutenção',       color: '#2563eb' },
  { id: 3, name: 'Certificação',     color: '#9333ea' },
  { id: 4, name: 'Consultoria',      color: '#ea580c' },
];

const defaultHomeContent: HomeContent = {
  carouselImages: [
    { id: 1, url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80', alt: 'Aeronave em voo sobre plantação' },
    { id: 2, url: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=1400&q=80', alt: 'Aeronave na pista ao amanhecer'   },
    { id: 3, url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1400&q=80', alt: 'Interior de hangar com técnicos'  },
  ],
  companyDescription: `Fundada em 2005, a AeroTech Brasil é referência nacional em aviação agrícola e serviços aeronáuticos. Com mais de 18 anos de experiência, atendemos produtores rurais, indústrias e órgãos governamentais com excelência técnica e comprometimento total com a segurança.

Nossa equipe é formada por pilotos certificados, engenheiros aeronáuticos e técnicos especializados, garantindo operações de altíssima precisão. Somos homologados pela ANAC e operamos com frotas modernas, constantemente atualizadas para oferecer o melhor em tecnologia aeronáutica.

Especialidades: Aviação Agrícola, Calibração de Instrumentos, Testes STOL, Inspeções Técnicas e Consultoria Aeronáutica.`,
};

const defaultProductsContent: ProductsContent = {
  headline: 'Produtos & Soluções',
  subheadline: 'Soluções aeronáuticas completas para cada necessidade do seu negócio.',
  products: [
    { id: 1, icon: '✈️', title: 'Aviação Agrícola',          description: 'Aplicação aérea de defensivos, fertilizantes e sementes com máxima precisão. Cobertura eficiente para grandes áreas com tecnologia GPS de ponta.',               tag: 'Principal', categoryIds: [1] },
    { id: 2, icon: '🔧', title: 'Manutenção Aeronáutica',    description: 'Revisões periódicas, inspeções de célula e motor, manutenção preventiva e corretiva realizadas por técnicos certificados ANAC.',                                        categoryIds: [2] },
    { id: 3, icon: '📡', title: 'Calibração de Instrumentos',description: 'Calibração de altímetros, velocímetros, transponders e demais instrumentos aeronáuticos conforme normas RBAC e RTCA.',                                                   categoryIds: [3] },
    { id: 4, icon: '🛬', title: 'Testes STOL',                description: 'Testes operacionais de decolagem e pouso em curta distância, com emissão de relatórios técnicos e certificados de conformidade.',                                        categoryIds: [3] },
    { id: 5, icon: '🔍', title: 'Inspeções Técnicas',         description: 'Inspeções de aeronavegabilidade, verificações pré-voo e relatórios detalhados para compra e venda de aeronaves.',                                                        categoryIds: [2, 3] },
    { id: 6, icon: '🎓', title: 'Consultoria e Treinamento',  description: 'Treinamento de pilotos agrícolas, elaboração de manuais de operação e análise de viabilidade de projetos aeronáuticos.',                                                 categoryIds: [4] },
  ],
};

const defaultPublished: ContentState['published'] = {
  home: defaultHomeContent, products: defaultProductsContent,
};
const defaultDraft: ContentState['draft'] = {
  home: structuredClone(defaultHomeContent), products: structuredClone(defaultProductsContent),
};

/* ─── CONTEXT ────────────────────────────────────────────────────────────────── */

export const ContentContext = createContext<ContentContextType>({} as ContentContextType);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [published,  setPublished]  = useLocalStorage<ContentState['published']>(STORAGE_KEY_PUBLISHED,  defaultPublished);
  const [draft,      setDraft]      = useLocalStorage<ContentState['draft']>(STORAGE_KEY_DRAFT,           defaultDraft);
  const [categories, setCategories] = useLocalStorage<Category[]>(STORAGE_KEY_CATEGORIES,                defaultCategories);

  const content: ContentState = { published, draft, categories };

  const updateDraft = useCallback(
    (page: 'home' | 'products', data: Partial<HomeContent> | Partial<ProductsContent>) => {
      setDraft((prev) => ({ ...prev, [page]: { ...prev[page], ...data } }));
    }, [setDraft]
  );

  const publishDirect = useCallback(
    (page: 'home' | 'products', data: Partial<HomeContent> | Partial<ProductsContent>) => {
      setDraft((prevDraft) => {
        const snapshot = structuredClone({ ...prevDraft[page], ...data });
        setPublished((prev) => ({ ...prev, [page]: snapshot }));
        return { ...prevDraft, [page]: snapshot };
      });
    }, [setDraft, setPublished]
  );

  const publish = useCallback(
    (page: 'home' | 'products') => {
      setDraft((prevDraft) => {
        const snapshot = structuredClone(prevDraft[page]);
        setPublished((prev) => ({ ...prev, [page]: snapshot }));
        return prevDraft;
      });
    }, [setDraft, setPublished]
  );

  const discardDraft = useCallback(
    (page: 'home' | 'products') => {
      setPublished((prevPublished) => {
        const snapshot = structuredClone(prevPublished[page]);
        setDraft((prev) => ({ ...prev, [page]: snapshot }));
        return prevPublished;
      });
    }, [setDraft, setPublished]
  );

  const addCategory = useCallback((name: string, color: string) => {
    setCategories((prev) => [...prev, { id: Date.now(), name: name.trim(), color }]);
  }, [setCategories]);

  const updateCategory = useCallback((id: number, name: string, color: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name: name.trim(), color } : c));
  }, [setCategories]);

  const removeCategory = useCallback((id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const strip = (products: Product[]) =>
      products.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((cid) => cid !== id) }));
    setDraft((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
    setPublished((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
  }, [setCategories, setDraft, setPublished]);

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