import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_KEY não encontradas.\n' +
        'Crie um arquivo .env na raiz do projeto com essas variáveis.\n' +
        'O site continuará funcionando com localStorage como fallback.');
}
export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
