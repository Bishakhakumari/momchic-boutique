import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ProductPage from "./ProductPage";
import { FaWhatsapp } from "react-icons/fa";

function App() {
  return (
    <Router>
      {/* SEO Meta Tags */}
      <head>
        <meta name="title" content="MOMCHIC Boutique - Ethnic & Western Fashion for Women" />
        <meta
          name="description"
          content="Shop exclusive Lehengas, Sarees, Kurtis, Footwear, and Beauty products at MOMCHIC Boutique. Visit our Daltonganj store or shop online."
        />
        <meta
          name="keywords"
          content="Momchic, Boutique, Ethnic wear, Saree, Lehenga, Western wear, Beauty, Daltonganj fashion store"
        />
      </head>

      {/* Offer Strip */}
      <div className="bg-pink-100 text-center text-pink-700 py-2 text-sm font-semibold shadow">
        🎉 Festive Offer: Flat 10% Off on New Arrivals – Limited Time Only!
      </div>

      {/* Navbar */}
      <header className="flex justify-between items-center p-4 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img src="/logo192.png" alt="MOMCHIC Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-pink-700">MOMCHIC</h1>
        </div>
        <nav className="flex space-x-6 font-medium">
          <Link to="/" className="hover:text-pink-600">WOMEN</Link>
          <Link to="/" className="hover:text-pink-600">BEAUTY</Link>
          <Link to="/" className="hover:text-pink-600">NEW ARRIVALS</Link>
          <Link to="/" className="hover:text-pink-600">OFFERS</Link>
        </nav>
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full px-4 py-1 text-sm focus:outline-pink-400"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-pink-100 text-center py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Trendy Ethnic & Western Wear for Every Occasion
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Explore our premium collection of Lehengas, Sarees, Kurtis, Footwear & Beauty Products.
        </p>
        <Link
          to="/"
          className="bg-pink-600 text-white px-6 py-2 rounded-full text-lg hover:bg-pink-700 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Shop by Category */}
      <section className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Ethnic Wear", img: "/images/ethnic.jpg" },
            { name: "Western Wear", img: "/images/western.jpg" },
            { name: "Beauty", img: "/images/beauty.jpg" },
            { name: "Handbags", img: "/images/handbags.jpg" },
            { name: "Footwear", img: "/images/footwear.jpg" },
          ].map((cat) => (
            <div key={cat.name} className="hover:scale-105 transition transform cursor-pointer">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-xl shadow"
              />
              <p className="mt-2 font-semibold text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="p-6 bg-white">
        <Home />
      </section>

      {/* Contact / Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <h4 className="text-xl font-semibold mb-2">MOMCHIC Boutique</h4>
        <p className="text-gray-300 mb-2">
          Mohan Cinema Road, Daltonganj, Jharkhand
        </p>
        <p className="text-gray-300 mb-2">📞 +91-XXXXXXXXXX | ✉️ momchicboutique@gmail.com</p>
        <p className="text-gray-400 text-sm mt-2">© {new Date().getFullYear()} MOMCHIC Boutique. All rights reserved.</p>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/91XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg text-2xl"
        >
          <FaWhatsapp />
        </a>
      </footer>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
