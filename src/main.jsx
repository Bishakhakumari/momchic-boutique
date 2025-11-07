import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import FloatingWhatsapp from './components/FloatingWhatsapp.jsx'; // ✅ import
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Create a Layout wrapper here itself
function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {children}
      <FloatingWhatsapp /> {/* ✅ Always visible on every page */}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/category/:name" element={<CategoryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);

AOS.init({
  duration: 800, // animation duration in ms
  once: true,    // animate only once per scroll
});
