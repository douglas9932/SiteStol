/**
 * contentService.ts
 *
 * Leitura e escrita do conteúdo do site.
 *
 * Tabelas no Supabase (uma por seção):
 *   home_content       → key: 'published' | 'draft'
 *   sobre_content      → key: 'published' | 'draft'
 *   products_content   → key: 'published' | 'draft'
 *   categories_content → key: 'data'
 *
 * Fallback: localStorage (quando Supabase não está configurado)
 */
import { supabase } from './supabase';
// ── Chaves localStorage (fallback) ──────────────────────────────────────────
const LS = {
    HOME_PUB: 'aerotech_v1_published',
    HOME_DFT: 'aerotech_v1_draft',
    SOBRE_PUB: 'aerotech_v1_sobre_pub',
    SOBRE_DFT: 'aerotech_v1_sobre_dft',
    PROD_PUB: 'aerotech_v1_prod_pub',
    PROD_DFT: 'aerotech_v1_prod_dft',
    CATEGORIES: 'aerotech_v1_categories',
};
// ── Helpers localStorage ─────────────────────────────────────────────────────
function lsGet(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    }
    catch {
        return fallback;
    }
}
function lsSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch { /* ignora */ }
}
// ── Helper Supabase genérico ──────────────────────────────────────────────────
async function sbGet(table, key, fallback) {
    if (!supabase)
        return fallback;
    try {
        const { data, error } = await supabase
            .from(table)
            .select('value')
            .eq('key', key)
            .single();
        if (error || !data)
            return fallback;
        return data.value;
    }
    catch {
        return fallback;
    }
}
async function sbSet(table, key, value) {
    if (!supabase)
        return;
    try {
        await supabase
            .from(table)
            .upsert({ key, value, updated_at: new Date().toISOString() });
    }
    catch (e) {
        console.error(`[Supabase] Erro ao salvar ${table}/${key}:`, e);
    }
}
// ── Funções públicas por seção ────────────────────────────────────────────────
export const isSupabaseEnabled = !!supabase;
// ── HOME ──
export async function getHomePublished(fallback) {
    const v = await sbGet('home_content', 'published', lsGet(LS.HOME_PUB, fallback));
    lsSet(LS.HOME_PUB, v);
    return v;
}
export async function getHomeDraft(fallback) {
    const v = await sbGet('home_content', 'draft', lsGet(LS.HOME_DFT, fallback));
    lsSet(LS.HOME_DFT, v);
    return v;
}
export async function saveHomePublished(value) {
    lsSet(LS.HOME_PUB, value);
    await sbSet('home_content', 'published', value);
}
export async function saveHomeDraft(value) {
    lsSet(LS.HOME_DFT, value);
    await sbSet('home_content', 'draft', value);
}
// ── SOBRE ──
export async function getSobrePublished(fallback) {
    const v = await sbGet('sobre_content', 'published', lsGet(LS.SOBRE_PUB, fallback));
    lsSet(LS.SOBRE_PUB, v);
    return v;
}
export async function getSobreDraft(fallback) {
    const v = await sbGet('sobre_content', 'draft', lsGet(LS.SOBRE_DFT, fallback));
    lsSet(LS.SOBRE_DFT, v);
    return v;
}
export async function saveSobrePublished(value) {
    lsSet(LS.SOBRE_PUB, value);
    await sbSet('sobre_content', 'published', value);
}
export async function saveSobreDraft(value) {
    lsSet(LS.SOBRE_DFT, value);
    await sbSet('sobre_content', 'draft', value);
}
// ── PRODUTOS ──
export async function getProductsPublished(fallback) {
    // Compatibilidade: tenta nova tabela, cai no LS antigo se vazio
    const lsFallback = lsGet(LS.HOME_PUB, fallback); // published antigo tinha products embutido
    const v = await sbGet('products_content', 'published', lsFallback);
    lsSet(LS.PROD_PUB, v);
    return v;
}
export async function getProductsDraft(fallback) {
    const lsFallback = lsGet(LS.HOME_DFT, fallback);
    const v = await sbGet('products_content', 'draft', lsFallback);
    lsSet(LS.PROD_DFT, v);
    return v;
}
export async function saveProductsPublished(value) {
    lsSet(LS.PROD_PUB, value);
    await sbSet('products_content', 'published', value);
}
export async function saveProductsDraft(value) {
    lsSet(LS.PROD_DFT, value);
    await sbSet('products_content', 'draft', value);
}
// ── CATEGORIES ──
export async function getCategories(fallback) {
    const v = await sbGet('categories_content', 'data', lsGet(LS.CATEGORIES, fallback));
    lsSet(LS.CATEGORIES, v);
    return v;
}
export async function saveCategories(value) {
    lsSet(LS.CATEGORIES, value);
    await sbSet('categories_content', 'data', value);
}
// ── Mantém getContent/setContent genérico para compatibilidade ───────────────
export async function getContent(key, fallback) {
    return lsGet(key, fallback);
}
export async function setContent(key, value) {
    lsSet(key, value);
}
export const KEYS = LS;
