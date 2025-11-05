import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage"; // 👈 make sure path is correct

export default function App() {
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Boutique Navigation Menu
  const menuItems = {
    COLLECTIONS: [
      { title: "Ethnic Wear", items: ["Lehengas", "Sarees", "Suits & Kurtis"] },
      { title: "Western Wear", items: ["Tops & Dresses", "Palazzos", "Gowns"] },
      { title: "Accessories", items: ["Handbags", "Footwear"] },
    ],
    BEAUTY: [
      { title: "Makeup", items: ["Lipsticks", "Eyeliner & Mascara", "Nail Paints"] },
      { title: "Fragrance & Care", items: ["Perfumes", "Body Mist", "Skincare Essentials"] },
    ],
    "RENTAL WEAR": [
      { title: "Occasion Wear", items: ["Bridal Lehengas", "Dandiya Dresses", "Party Gowns", "Designer Sarees"] },
    ],
    OFFERS: [
      { title: "", items: ["Flat 50% Off", "Buy 1 Get 1", "Festive Combos"] },
    ],
  };

  // ✅ Handle Subcategory Click — navigate to category page
  const handleSubcategoryClick = (subcategory) => {
    navigate(`/category/${encodeURIComponent(subcategory)}`);
    setActiveCategory(null);
    setShowBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Handle outside clicks for mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth < 768;
      if (!e.target.closest(".mobile-category") && isMobile) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Fetch products from Google Sheet
  useEffect(() => {
    const fetchData = async () => {
      const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRzxK2v6S7Nuv5ANm4czSpdHhpyWNzTvpzIear47a5fH0lZSGu5psAXig2xCwegSJZuVdrH9N9PGgK/pub?output=csv";
      const response = await axios.get(sheetURL);
      Papa.parse(response.data, {
        header: true,
        complete: (results) => {
          const cleanedData = results.data
            .filter((item) => item["Item Name"] && item.Price)
            .map((item) => {
              const price = parseInt(item.Price?.replace(/\D/g, ""), 10);
              const originalPrice = parseInt(
                item["Original Price"]?.replace(/\D/g, ""),
                10
              );

              return {
                id: item["Item Name"] + Math.random(),
                name: item["Item Name"],
                category: item["Category"],
                price: isNaN(price) ? 0 : price,
                originalPrice: isNaN(originalPrice) ? null : originalPrice,
                image: item["Image Link"],
              };
            });

          setProducts(cleanedData);
          setFilteredProducts(cleanedData);
          localStorage.setItem("momchic-products", JSON.stringify(cleanedData));
        },
      });
    };
    fetchData();
  }, []);

  const resetToHome = () => {
    setFilteredProducts(products);
    setSelectedSubcategory(null);
    setActiveCategory(null);
    setShowBanner(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Home Page Layout
  const HomePage = () => (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col bg-white font-sans">

        {/* HEADER */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-center">
            {/* Logo */}
            <Link
              to="/"
              onClick={resetToHome}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <img
                src="src/public/logo.png"
                alt="MOMCHIC Logo"
                className="h-10 w-auto md:h-12 object-contain"
              />
              <span className="text-2xl font-extrabold text-pink-600">MOMCHIC</span>
            </Link>

            {/* Search & Nav */}
            <div className="w-full md:flex md:flex-row-reverse md:items-center md:gap-6">
              {/* Search */}
              <div className="w-full md:w-auto flex items-center justify-center">
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-md w-64 shadow-sm hover:shadow-md transition">
                  <Search size={16} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for lehengas, suits, handbags..."
                    className="bg-transparent outline-none text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => {
                      const query = e.target.value;
                      setSearchQuery(query);
                      const filtered = products.filter((product) =>
                        (product.name + product.category)
                          .toLowerCase()
                          .includes(query.toLowerCase())
                      );
                      setFilteredProducts(filtered);
                      setShowBanner(query === "");
                    }}
                  />
                </div>
              </div>

              {/* Dropdown Navigation */}
              <nav className="relative hidden md:flex gap-6 text-sm font-medium text-gray-700 pointer-events-none">
                {Object.keys(menuItems).map((category) => (
                  <div
                    key={category}
                    className="relative group pointer-events-auto"
                    onMouseEnter={() => {
                      clearTimeout(hoverTimeout.current);
                      setActiveCategory(category);
                    }}
                    onMouseLeave={() => {
                      hoverTimeout.current = setTimeout(() => {
                        setActiveCategory(null);
                      }, 200);
                    }}
                  >
                    <div
                      className={`cursor-pointer uppercase tracking-wide transition-colors duration-200 px-1 ${
                        activeCategory === category
                          ? "text-pink-700 font-semibold"
                          : "hover:text-pink-600"
                      }`}
                    >
                      {category}
                    </div>

                    <AnimatePresence>
                      {activeCategory === category && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-64 bg-white shadow-lg border mt-1 z-50 pt-2 pb-2 rounded-md pointer-events-auto"
                        >
                          <ul className="p-4 flex flex-col gap-2 text-sm text-gray-700">
                            {menuItems[category].map((group, i) => (
                              <div key={i}>
                                {group.title && (
                                  <li className="text-pink-500 font-bold uppercase text-xs tracking-wide mt-3 mb-1">
                                    {group.title}
                                  </li>
                                )}
                                {group.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-gray-600 cursor-pointer pl-2 transition-all duration-200 hover:font-semibold hover:text-gray-800"
                                    onClick={() => handleSubcategoryClick(item)}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </div>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* Banner */}
        {showBanner && (
          <section
            className="relative w-full h-[35vh] md:h-[50vh] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1612423284934-0b2f67ed8c6e?auto=format&fit=crop&w=1500&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
              <p className="text-xs md:text-sm uppercase tracking-[3px] text-gray-200 mb-2">
                Your Local Fashion Destination
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-1">
                Discover the World of Style at <span className="text-pink-300">MOMCHIC</span>
              </h1>
              <p className="text-sm md:text-base max-w-xl mt-2">
                Shop our hand-picked collection of lehengas, sarees, suits, handbags, footwear, and more —
                at <b>MOMCHIC Boutique</b>. Premium fashion made affordable, right here in Daltonganj.
              </p>
              <a
                href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block px-6 py-2 text-sm font-semibold bg-white text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-300"
              >
                🛍️ Visit Our Store
              </a>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        <section className="p-6 max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedSubcategory ? `Showing: ${selectedSubcategory}` : "New Arrivals"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No matching products found.</p>
              </div>
            ) : (
              filteredProducts.map((product, i) => (
                <ProductCard key={i} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 pt-8 pb-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-pink-600 font-semibold mb-3">Shop Categories</h4>
              <ul className="space-y-1 text-sm">
                {["Suits & Kurtis", "Lehengas & Sarees", "Handbags & Clutches", "Footwear Collection", "Beauty & Skincare"].map(
                  (cat, i) => (
                    <li
                      key={i}
                      className="hover:text-pink-600 cursor-pointer"
                      onClick={() => handleSubcategoryClick(cat)}
                    >
                      {cat}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-pink-600 mb-3">Visit Our Store</h4>
              <p className="text-sm">MOMCHIC Boutique</p>
              <p className="text-sm">1st Floor, Mohan Cinema, near Bus Stand<br />Daltonganj, Jharkhand</p>
              <p className="text-sm mt-2">📞 +91 9204613635</p>
              <p className="text-sm">🕒 Open Daily: 10:30 AM – 9 PM</p>
            </div>
            <div>
              <h4 className="font-semibold text-pink-600 mb-3">Connect With Us</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://wa.me/919204613635" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} <b className="text-pink-600">MOMCHIC Boutique</b> — All Rights Reserved.
          </div>
        </footer>
      </div>
    </>
  );

  // ✅ Main Routes
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
    </Routes>
  );
}
