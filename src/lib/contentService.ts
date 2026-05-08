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
  HOME_PUB:   'aerotech_v1_published',
  HOME_DFT:   'aerotech_v1_draft',
  SOBRE_PUB:  'aerotech_v1_sobre_pub',
  SOBRE_DFT:  'aerotech_v1_sobre_dft',
  PROD_PUB:   'aerotech_v1_prod_pub',
  PROD_DFT:   'aerotech_v1_prod_dft',
  CATEGORIES: 'aerotech_v1_categories',
} as const;

// ── Helpers localStorage ─────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}

function lsSet(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignora */ }
}

// ── Helper Supabase genérico ──────────────────────────────────────────────────

async function sbGet<T>(table: string, key: string, fallback: T): Promise<T> {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('value')
      .eq('key', key)
      .single();
    if (error || !data) return fallback;
    return data.value as T;
  } catch { return fallback; }
}

async function sbSet(table: string, key: string, value: unknown): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from(table)
      .upsert({ key, value, updated_at: new Date().toISOString() });
  } catch (e) {
    console.error(`[Supabase] Erro ao salvar ${table}/${key}:`, e);
  }
}

// ── Funções públicas por seção ────────────────────────────────────────────────

export const isSupabaseEnabled = !!supabase;

// ── HOME ──
export async function getHomePublished<T>(fallback: T): Promise<T> {
  const v = await sbGet<T>('home_content', 'published', lsGet(LS.HOME_PUB, fallback));
  lsSet(LS.HOME_PUB, v);
  return v;
}
export async function getHomeDraft<T>(fallback: T): Promise<T> {
  const v = await sbGet<T>('home_content', 'draft', lsGet(LS.HOME_DFT, fallback));
  lsSet(LS.HOME_DFT, v);
  return v;
}
export async function saveHomePublished(value: unknown): Promise<void> {
  lsSet(LS.HOME_PUB, value);
  await sbSet('home_content', 'published', value);
}
export async function saveHomeDraft(value: unknown): Promise<void> {
  lsSet(LS.HOME_DFT, value);
  await sbSet('home_content', 'draft', value);
}

// ── SOBRE ──
export async function getSobrePublished<T>(fallback: T): Promise<T> {
  const v = await sbGet<T>('sobre_content', 'published', lsGet(LS.SOBRE_PUB, fallback));
  lsSet(LS.SOBRE_PUB, v);
  return v;
}
export async function getSobreDraft<T>(fallback: T): Promise<T> {
  const v = await sbGet<T>('sobre_content', 'draft', lsGet(LS.SOBRE_DFT, fallback));
  lsSet(LS.SOBRE_DFT, v);
  return v;
}
export async function saveSobrePublished(value: unknown): Promise<void> {
  lsSet(LS.SOBRE_PUB, value);
  await sbSet('sobre_content', 'published', value);
}
export async function saveSobreDraft(value: unknown): Promise<void> {
  lsSet(LS.SOBRE_DFT, value);
  await sbSet('sobre_content', 'draft', value);
}

// ── PRODUTOS ──
function ensureProductsArray(v: any): any {
  if (v && typeof v === 'object' && !Array.isArray(v.products)) {
    return { ...v, products: [] };
  }
  return v;
}

export async function getProductsPublished<T>(fallback: T): Promise<T> {
  const lsFallback = lsGet<T>(LS.HOME_PUB, fallback);
  const v = await sbGet<T>('products_content', 'published', lsFallback);
  const safe = ensureProductsArray(v) as T;
  lsSet(LS.PROD_PUB, safe);
  return safe;
}
export async function getProductsDraft<T>(fallback: T): Promise<T> {
  const lsFallback = lsGet<T>(LS.HOME_DFT, fallback);
  const v = await sbGet<T>('products_content', 'draft', lsFallback);
  const safe = ensureProductsArray(v) as T;
  lsSet(LS.PROD_DFT, safe);
  return safe;
}
export async function saveProductsPublished(value: unknown): Promise<void> {
  lsSet(LS.PROD_PUB, value);
  await sbSet('products_content', 'published', value);
}
export async function saveProductsDraft(value: unknown): Promise<void> {
  lsSet(LS.PROD_DFT, value);
  await sbSet('products_content', 'draft', value);
}

// ── CATEGORIES ──
export async function getCategories<T>(fallback: T): Promise<T> {
  const v = await sbGet<T>('categories_content', 'data', lsGet(LS.CATEGORIES, fallback));
  lsSet(LS.CATEGORIES, v);
  return v;
}
export async function saveCategories(value: unknown): Promise<void> {
  lsSet(LS.CATEGORIES, value);
  await sbSet('categories_content', 'data', value);
}

// ── Mantém getContent/setContent genérico para compatibilidade ───────────────
export async function getContent<T>(key: string, fallback: T): Promise<T> {
  return lsGet<T>(key, fallback);
}
export async function setContent(key: string, value: unknown): Promise<void> {
  lsSet(key, value);
}
export const KEYS = LS;