/**
 * contentService.ts
 *
 * Centraliza leitura e escrita do conteúdo do site.
 * - Se Supabase estiver configurado: usa Supabase (todos os dispositivos veem)
 * - Se não estiver configurado: usa localStorage (comportamento atual)
 *
 * Chaves no Supabase (tabela site_content):
 *   'published'  → conteúdo publicado
 *   'draft'      → rascunho
 *   'categories' → categorias de produtos
 *   'sobre'      → conteúdo da página Sobre (published)
 *   'sobre_dft'  → rascunho da página Sobre
 */

import { supabase } from './supabase';

// ── Chaves localStorage (fallback) ──────────────────────────────────────────
const LS_PUBLISHED  = 'aerotech_v1_published';
const LS_DRAFT      = 'aerotech_v1_draft';
const LS_CATEGORIES = 'aerotech_v1_categories';

// ── Helpers localStorage ─────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* localStorage cheio — ignora */ }
}

// ── Helpers Supabase ──────────────────────────────────────────────────────────

async function sbGet<T>(key: string, fallback: T): Promise<T> {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .single();
    if (error || !data) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

async function sbSet(key: string, value: unknown): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() });
  } catch (e) {
    console.error('[Supabase] Erro ao salvar:', key, e);
  }
}

// ── API pública ───────────────────────────────────────────────────────────────

export const isSupabaseEnabled = !!supabase;

/**
 * Lê um valor pelo nome da chave.
 * Tenta Supabase primeiro; se não configurado usa localStorage.
 */
export async function getContent<T>(key: string, fallback: T): Promise<T> {
  if (supabase) {
    const value = await sbGet<T>(key, fallback);
    // Também atualiza o localStorage como cache offline
    lsSet(key, value);
    return value;
  }
  return lsGet<T>(key, fallback);
}

/**
 * Salva um valor pelo nome da chave.
 * Salva em ambos (Supabase + localStorage) para cache offline.
 */
export async function setContent(key: string, value: unknown): Promise<void> {
  lsSet(key, value); // sempre salva local como cache
  if (supabase) {
    await sbSet(key, value);
  }
}

// ── Chaves nomeadas (evita typos) ─────────────────────────────────────────────
export const KEYS = {
  PUBLISHED:  LS_PUBLISHED,
  DRAFT:      LS_DRAFT,
  CATEGORIES: LS_CATEGORIES,
  SOBRE_PUB:  'aerotech_v1_sobre_pub',
  SOBRE_DFT:  'aerotech_v1_sobre_dft',
} as const;