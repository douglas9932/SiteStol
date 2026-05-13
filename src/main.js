import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import CompanyHead from './components/CompanyHead';
import ApresentacaoBanner from './components/ApresentacaoBanner';
import AppRouter from './router/AppRouter';
import './styles/index.css';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error) {
            return (_jsxs("div", { style: {
                    padding: '2rem', fontFamily: 'monospace', background: '#1a1a2e',
                    color: '#ff6b6b', minHeight: '100vh',
                }, children: [_jsx("h2", { style: { color: '#ffd700', marginBottom: '1rem' }, children: "\u274C Erro capturado:" }), _jsxs("pre", { style: {
                            background: '#0d0d1a', padding: '1rem', borderRadius: 8,
                            color: '#ff9999', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        }, children: [this.state.error.message, '\n\n', this.state.error.stack] })] }));
        }
        return this.props.children;
    }
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(ErrorBoundary, { children: _jsx(BrowserRouter, { children: _jsxs(ContentProvider, { children: [_jsx(ApresentacaoBanner, {}), _jsx(CompanyHead, {}), _jsx(AppRouter, {})] }) }) }));
