import { useContext } from 'react';
import { ContentContext } from '@/context/ContentContext';
export function useContent() {
    const ctx = useContext(ContentContext);
    if (!ctx)
        throw new Error('useContent must be used inside <ContentProvider>');
    return ctx;
}
