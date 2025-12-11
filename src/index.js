import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// 1. IMPORT BROWSER ROUTER
import { BrowserRouter } from 'react-router-dom'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. BUNGKUS APP DENGAN BROWSER ROUTER DI SINI */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);