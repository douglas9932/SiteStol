import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import CompanyHead from './components/CompanyHead';
import ApresentacaoBanner from './components/ApresentacaoBanner';
import AppRouter from './router/AppRouter';
import './styles/index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem', fontFamily: 'monospace', background: '#1a1a2e',
          color: '#ff6b6b', minHeight: '100vh',
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>❌ Erro capturado:</h2>
          <pre style={{
            background: '#0d0d1a', padding: '1rem', borderRadius: 8,
            color: '#ff9999', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <ContentProvider>
        <ApresentacaoBanner />
        <CompanyHead />
        <AppRouter />
      </ContentProvider>
    </BrowserRouter>
  </ErrorBoundary>
);