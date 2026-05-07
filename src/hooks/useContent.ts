import { useContext } from 'react';
import { ContentContext, ContentContextType } from '@/context/ContentContext';

export function useContent(): ContentContextType {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}
