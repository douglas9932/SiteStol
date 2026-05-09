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

// ── COMPANY SETTINGS ──
export interface CompanySettings {
  id?:              string;
  name:             string;
  icon_url:         string;
  color_primary:    string; // --navy  ex: #0a1628
  color_secondary:  string; // --gold  ex: #c8972a
}

const defaultCompany: CompanySettings = {
  name: '', icon_url: '',
  color_primary: '#0a1628', color_secondary: '#c8972a',
};

export async function getCompanySettings(): Promise<CompanySettings> {
  if (!supabase) return lsGet<CompanySettings>('aerotech_company', defaultCompany);
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('id, name, icon_url, color_primary, color_secondary')
      .single();
    if (error || !data) return defaultCompany;
    const result: CompanySettings = {
      id:             data.id,
      name:           data.name           ?? '',
      icon_url:       data.icon_url        ?? '',
      color_primary:  data.color_primary   ?? '#0a1628',
      color_secondary: data.color_secondary ?? '#c8972a',
    };
    lsSet('aerotech_company', result);
    return result;
  } catch { return defaultCompany; }
}

export async function saveCompanySettings(settings: CompanySettings): Promise<void> {
  lsSet('aerotech_company', settings);
  if (!supabase) return;
  try {
    if (settings.id) {
      await supabase
        .from('company_settings')
        .update({
          name:             settings.name,
          icon_url:         settings.icon_url,
          color_primary:    settings.color_primary,
          color_secondary:  settings.color_secondary,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);
    } else {
      await supabase
        .from('company_settings')
        .insert({
          name:             settings.name,
          icon_url:         settings.icon_url,
          color_primary:    settings.color_primary,
          color_secondary:  settings.color_secondary,
        });
    }
  } catch (e) { console.error('[Supabase] Erro ao salvar company_settings:', e); }
}

/** Aplica as cores da empresa no :root como CSS variables */
export function applyCompanyColors(settings: CompanySettings): void {
  const root = document.documentElement;
  const p  = settings.color_primary   || '#0a1628';
  const s  = settings.color_secondary || '#c8972a';

  // Converte hex para derivadas (mid, light, hover)
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return { r, g, b };
  };
  const lighten = (hex: string, pct: number) => {
    const { r, g, b } = hexToRgb(hex);
    const l = (v: number) => Math.min(255, Math.round(v + (255 - v) * pct));
    return `#${l(r).toString(16).padStart(2,'0')}${l(g).toString(16).padStart(2,'0')}${l(b).toString(16).padStart(2,'0')}`;
  };
  const darken = (hex: string, pct: number) => {
    const { r, g, b } = hexToRgb(hex);
    const d = (v: number) => Math.max(0, Math.round(v * (1 - pct)));
    return `#${d(r).toString(16).padStart(2,'0')}${d(g).toString(16).padStart(2,'0')}${d(b).toString(16).padStart(2,'0')}`;
  };
  const hexAlpha = (hex: string, a: number) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  };

  // Cor principal (navy)
  root.style.setProperty('--navy',       p);
  root.style.setProperty('--navy-mid',   lighten(p, 0.08));
  root.style.setProperty('--navy-light', lighten(p, 0.18));
  root.style.setProperty('--navy-hover', darken(p, 0.08));

  // Cor de destaque (gold)
  root.style.setProperty('--gold',       s);
  root.style.setProperty('--gold-light', lighten(s, 0.15));
  root.style.setProperty('--gold-pale',  lighten(s, 0.65));
  root.style.setProperty('--gold-dim',   hexAlpha(s, 0.15));

  // Border gold
  root.style.setProperty('--border', hexAlpha(s, 0.2));
}

// ── Mantém getContent/setContent genérico para compatibilidade ───────────────
export async function getContent<T>(key: string, fallback: T): Promise<T> {
  return lsGet<T>(key, fallback);
}
export async function setContent(key: string, value: unknown): Promise<void> {
  lsSet(key, value);
}
export const KEYS = LS;