import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AdminDataProvider } from './state/AdminDataContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminDataProvider>
        <App />
      </AdminDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
