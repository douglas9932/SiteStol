import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import AppRouter from './router/AppRouter';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <AppRouter />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
