import { useState, useEffect } from 'react';
/**
 * Igual ao useState, mas persiste o valor no localStorage.
 * - Lê o valor salvo na inicialização (se existir e for válido JSON)
 * - Grava automaticamente sempre que o valor muda
 * - Se a leitura falhar (JSON corrompido etc.) usa o defaultValue
 */
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored === null)
                return defaultValue;
            return JSON.parse(stored);
        }
        catch {
            return defaultValue;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch {
            // localStorage cheio ou bloqueado — ignora silenciosamente
        }
    }, [key, value]);
    return [value, setValue];
}
