import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CategoryPage from './pages/CategoryPage.jsx'; // make sure this file exists
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/category/:name" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
AOS.init({
  duration: 800,   // animation duration in ms
  once: false,      // animate only once per scroll
});
