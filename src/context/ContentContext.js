import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getContent, setContent, KEYS } from '@/lib/contentService';
/* ─── STORAGE KEYS ───────────────────────────────────────────────────────────── */
const STORAGE_KEY_PUBLISHED = 'aerotech_v1_published';
const STORAGE_KEY_DRAFT = 'aerotech_v1_draft';
const STORAGE_KEY_CATEGORIES = 'aerotech_v1_categories';
/* ─── DEFAULTS ───────────────────────────────────────────────────────────────── */
const defaultCategories = [
    { id: 1, name: 'Aviação Agrícola', color: '#16a34a' },
    { id: 2, name: 'Manutenção', color: '#2563eb' },
    { id: 3, name: 'Certificação', color: '#9333ea' },
    { id: 4, name: 'Consultoria', color: '#ea580c' },
];
const defaultHomeContent = {
    carouselImages: [
        { id: 1, url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80', alt: 'Aeronave em voo sobre plantação' },
        { id: 2, url: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=1400&q=80', alt: 'Aeronave na pista ao amanhecer' },
        { id: 3, url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1400&q=80', alt: 'Interior de hangar com técnicos' },
    ],
    companyDescription: `Fundada em 2005, a AeroTech Brasil é referência nacional em aviação agrícola e serviços aeronáuticos. Com mais de 18 anos de experiência, atendemos produtores rurais, indústrias e órgãos governamentais com excelência técnica e comprometimento total com a segurança.

Nossa equipe é formada por pilotos certificados, engenheiros aeronáuticos e técnicos especializados, garantindo operações de altíssima precisão. Somos homologados pela ANAC e operamos com frotas modernas, constantemente atualizadas para oferecer o melhor em tecnologia aeronáutica.

Especialidades: Aviação Agrícola, Calibração de Instrumentos, Testes STOL, Inspeções Técnicas e Consultoria Aeronáutica.`,
    carouselTagline: 'Excelência em Aviação',
    carouselTitle: 'Precisão que eleva seus resultados',
    carouselSubtitle: 'Soluções aeronáuticas de alta performance para o agronegócio e além',
    sobreTitle: 'Sobre a AeroTech Brasil',
    stats: [
        { value: '18+', label: 'Anos de Experiência' },
        { value: '500+', label: 'Clientes Atendidos' },
        { value: '98%', label: 'Satisfação' },
        { value: 'ANAC', label: 'Homologado' },
    ],
    featuresTitle: 'Diferenciais que fazem a diferença',
    features: [
        { icon: '🛡️', title: 'Segurança Certificada', desc: 'Operações homologadas pela ANAC com os mais rígidos padrões de segurança aeronáutica.' },
        { icon: '🎯', title: 'Precisão GPS', desc: 'Tecnologia de posicionamento de última geração para aplicações com erro inferior a 30 cm.' },
        { icon: '⚡', title: 'Alta Produtividade', desc: 'Cobertura de até 3.000 hectares por dia com nossa frota de aeronaves modernas.' },
        { icon: '🌱', title: 'Sustentabilidade', desc: 'Redução de até 40% no consumo de defensivos com aplicação aérea de precisão.' },
    ],
};
const defaultProductsContent = {
    headline: 'Produtos & Soluções',
    subheadline: 'Soluções aeronáuticas completas para cada necessidade do seu negócio.',
    products: [
        { id: 1, icon: '✈️', title: 'Aviação Agrícola', description: 'Aplicação aérea de defensivos, fertilizantes e sementes com máxima precisão. Cobertura eficiente para grandes áreas com tecnologia GPS de ponta.', tag: 'Principal', categoryIds: [1] },
        { id: 2, icon: '🔧', title: 'Manutenção Aeronáutica', description: 'Revisões periódicas, inspeções de célula e motor, manutenção preventiva e corretiva realizadas por técnicos certificados ANAC.', categoryIds: [2] },
        { id: 3, icon: '📡', title: 'Calibração de Instrumentos', description: 'Calibração de altímetros, velocímetros, transponders e demais instrumentos aeronáuticos conforme normas RBAC e RTCA.', categoryIds: [3] },
        { id: 4, icon: '🛬', title: 'Testes STOL', description: 'Testes operacionais de decolagem e pouso em curta distância, com emissão de relatórios técnicos e certificados de conformidade.', categoryIds: [3] },
        { id: 5, icon: '🔍', title: 'Inspeções Técnicas', description: 'Inspeções de aeronavegabilidade, verificações pré-voo e relatórios detalhados para compra e venda de aeronaves.', categoryIds: [2, 3] },
        { id: 6, icon: '🎓', title: 'Consultoria e Treinamento', description: 'Treinamento de pilotos agrícolas, elaboração de manuais de operação e análise de viabilidade de projetos aeronáuticos.', categoryIds: [4] },
    ],
};
const defaultSobreContent = {
    heroTitle: 'Sobre a AeroTech Brasil',
    heroSubtitle: 'Quase duas décadas de excelência em serviços aeronáuticos e aviação agrícola.',
    especialidades: [
        'Aviação Agrícola de Precisão',
        'Calibração de Instrumentos Aeronáuticos',
        'Testes STOL Certificados',
        'Inspeções Técnicas Completas',
        'Consultoria Aeronáutica',
        'Operações de Pulverização Aérea',
        'Monitoramento Aéreo por Drones',
        'Transporte Aéreo Executivo',
    ],
    timelineTitle: 'Uma história de crescimento',
    timeline: [
        { year: '2005', title: 'Fundação', desc: 'Criada por pilotos e engenheiros apaixonados por aviação no Paraná.' },
        { year: '2009', title: 'Homologação ANAC', desc: 'Obtemos as primeiras certificações junto à Agência Nacional de Aviação Civil.' },
        { year: '2014', title: 'Expansão Regional', desc: 'Ampliamos operações para MS, MT e GO, atendendo grandes produtores rurais.' },
        { year: '2019', title: 'Modernização da Frota', desc: 'Investimento de R$ 15M em aeronaves de última geração com GPS de alta precisão.' },
        { year: '2023', title: 'Drones Agrícolas', desc: 'Incorporamos drones de alta capacidade à nossa frota operacional.' },
    ],
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
    const [published, setPublished] = useLocalStorage(STORAGE_KEY_PUBLISHED, defaultPublished);
    const [draft, setDraft] = useLocalStorage(STORAGE_KEY_DRAFT, defaultDraft);
    const [categories, setCategories] = useLocalStorage(STORAGE_KEY_CATEGORIES, defaultCategories);
    // ── Carrega do Supabase ao iniciar ────────────────────────────────────────
    // Roda uma vez. Se Supabase estiver configurado, sobrescreve o localStorage
    // com os dados mais recentes da nuvem.
    useEffect(() => {
        async function loadFromSupabase() {
            const [pub, dft, cats] = await Promise.all([
                getContent(KEYS.PUBLISHED, defaultPublished),
                getContent(KEYS.DRAFT, defaultDraft),
                getContent(KEYS.CATEGORIES, defaultCategories),
            ]);
            setPublished(pub);
            setDraft(dft);
            setCategories(cats);
        }
        loadFromSupabase();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // roda só uma vez na montagem
    const content = { published, draft, categories };
    // ── Salva no Supabase sempre que published, draft ou categories mudam ────
    // useLocalStorage já persiste no localStorage automaticamente.
    // Aqui garantimos que o Supabase também seja atualizado.
    useEffect(() => {
        setContent(KEYS.PUBLISHED, published);
    }, [published]);
    useEffect(() => {
        setContent(KEYS.DRAFT, draft);
    }, [draft]);
    useEffect(() => {
        setContent(KEYS.CATEGORIES, categories);
    }, [categories]);
    const updateDraft = useCallback((page, data) => {
        setDraft((prev) => ({ ...prev, [page]: { ...prev[page], ...data } }));
    }, [setDraft]);
    const publishDirect = useCallback((page, data) => {
        setDraft((prevDraft) => {
            const snapshot = structuredClone({ ...prevDraft[page], ...data });
            setPublished((prev) => ({ ...prev, [page]: snapshot }));
            return { ...prevDraft, [page]: snapshot };
        });
    }, [setDraft, setPublished]);
    const publish = useCallback((page) => {
        setDraft((prevDraft) => {
            const snapshot = structuredClone(prevDraft[page]);
            setPublished((prev) => ({ ...prev, [page]: snapshot }));
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
        setCategories((prev) => [...prev, { id: Date.now(), name: name.trim(), color }]);
    }, [setCategories]);
    const updateCategory = useCallback((id, name, color) => {
        setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name: name.trim(), color } : c));
    }, [setCategories]);
    const removeCategory = useCallback((id) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        const strip = (products) => products.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((cid) => cid !== id) }));
        setDraft((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
        setPublished((prev) => ({ ...prev, products: { ...prev.products, products: strip(prev.products.products) } }));
    }, [setCategories, setDraft, setPublished]);
    return (_jsx(ContentContext.Provider, { value: {
            content,
            updateDraft, publishDirect, publish, discardDraft,
            addCategory, updateCategory, removeCategory,
        }, children: children }));
}
