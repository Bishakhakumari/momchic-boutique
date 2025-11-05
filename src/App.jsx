import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import { Link } from "react-router-dom";

export default function App() {
  const hoverTimeout = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = {
    Women: [
      { title: "Apparels", items: ["Suits", "Kurtis", "Western Wear", "Palazzos", "Lehengas"] },
      { title: "Footwear", items: ["Ethnic Sandals", "Heels", "Casual Slippers"] },
      { title: "Purses", items: ["Handbags", "Sling Bags", "Tote Bags", "Clutches", "Potli Bags"] },
    ],
    Beauty: [
      { title: "Makeup", items: ["Lipsticks", "Kajal, Eyeliner & Mascara", "Foundations & BB Creams"] },
      { title: "Skincare", items: ["Face Creams & Moisturizers", "Deodrants & Perfumes"] },
    ],
    "New Arrivals": [
      { title: "", items: ["Trending Now", "Fresh In Stock"] },
    ],
    Offers: [
      { title: "", items: ["Buy 1 Get 1", "Flat 50%", "Bundle Deals"] },
    ],
  };

  const handleSubcategoryClick = (subcategory) => {
    setFilteredProducts([]);
    setTimeout(() => {
      const filtered = products.filter((p) =>
        p.category?.toLowerCase().includes(subcategory.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 0);

    setSelectedSubcategory(subcategory);
    setActiveCategory(null);
    setShowBanner(false);
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    const isMobile = window.innerWidth < 768;
    if (!e.target.closest(".mobile-category") && isMobile) {
      setActiveCategory(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);


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

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col bg-white font-sans">
       <header className="bg-white shadow-sm p-4 sticky top-0 z-30 border-b border-gray-200">
<div className="max-w-7xl mx-auto flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-center">
  {/* Logo - stays left */}
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

  {/* Wrap Search & Nav in reverse row for desktop only */}
  <div className="w-full md:flex md:flex-row-reverse md:items-center md:gap-6">
    {/* Search Bar */}
    <div className="w-full md:w-auto flex items-center justify-center">
      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-md w-64">
        <Search size={16} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
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

    {/* Desktop Navigation */}
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
                className="absolute top-full left-0 w-64 bg-white shadow-lg border mt-1 z-50 pt-2 pb-2 pointer-events-auto"
              >
                <ul className="p-4 flex flex-col gap-2 text-sm text-gray-700">
                  {menuItems[category].map((group, i) => (
                    <div key={i}>
                      {group.title && (
                        <li className="text-pink-500 font-bold uppercase text-xs tracking-wide mt-3 mb-1">
                          {group.title}
                        </li>
                      )}
                      {group.items.map((item, idx) => {
                        const label = item
                          .toLowerCase()
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ");

                        return (
                          <li
                            key={idx}
                            className="text-gray-600 cursor-pointer pl-2 transition-all duration-200 hover:font-semibold hover:text-gray-800"
                            onClick={() => handleSubcategoryClick(item)}
                          >
                            {label}
                          </li>
                        );
                      })}
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


        {/* Mobile Category Bar */}
<div className="md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-b border-gray-200 bg-white sticky top-[64px] z-20 mobile-category text-center">
  {Object.keys(menuItems).map((category, i) => (
    <button
      key={i}
onClick={() => {
  setActiveCategory((prev) => (prev === category ? null : category));
  setShowBanner(false); // Hide the banner on category click
}}

      className="inline-block text-sm font-medium text-gray-700 hover:text-pink-600 mx-2"
    >
      {category}
    </button>
  ))}
</div>

{/* ✅ Mobile Subcategories if a category is active */}
{activeCategory && (
  <div className="md:hidden bg-pink-50 border-b border-pink-200 px-4 py-2">
    {menuItems[activeCategory].map((group, idx) => (
      <div key={idx}>
        {group.title && (
          <div className="text-xs font-semibold text-pink-700 uppercase mt-2">{group.title}</div>
        )}
        <div className="flex flex-wrap gap-2 mt-1">
          {group.items.map((item, subIdx) => (
            <button
              key={subIdx}
              onClick={() => handleSubcategoryClick(item)}
              className="bg-white border text-xs px-2 py-1 rounded shadow-sm text-gray-700 hover:bg-pink-100"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
)}


        <div className="flex-grow">
{showBanner && (
  <section
    className="relative w-full h-[35vh] md:h-[50vh] bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1612423284934-0b2f67ed8c6e?auto=format&fit=crop&w=1500&q=80')",
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
<h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-1">
  Discover the World of Style at <span className="text-pink-300">MOMCHIC</span>
</h1>
<p className="text-sm md:text-base max-w-xl mt-2">
  Explore handpicked lehengas, sarees, suits, handbags, footwear and more exclusively at - <b>MOMCHIC Boutique</b>. Premium fashion made affordable, right here in Daltonganj.
</p>

<a
  href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-5 inline-block px-6 py-2 text-sm font-semibold bg-white text-pink-600 rounded-full hover:bg-pink-50 transition"
>
  🛍️ Visit Our Store
</a>


    </div>
  </section>
)}

          <section className="p-6 max-w-7xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedSubcategory ? `Showing: ${selectedSubcategory}` : "New Arrivals"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <img
                    src="https://cdn.dribbble.com/users/2046015/screenshots/15640474/media/883a2553b27ea3394a0db6f1c3acfe6a.png"
                    alt="No results"
                    className="w-40 mx-auto mb-4"
                  />
                  <p className="text-sm">No matching products found.</p>
                </div>
              ) : (
                filteredProducts.map((product, i) => (
                  <ProductCard key={i} product={product} />
                ))
              )}
            </div>
          </section>
        </div>

{/* ✅ Why Visit MOMCHIC Boutique Section */}
<section className="bg-pink-50 py-12 mt-8 border-t border-pink-100">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4">
      Why Visit <span className="text-gray-800">MOMCHIC Boutique</span>?
    </h2>
    <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-sm md:text-base">
      MOMCHIC Boutique is your one-stop destination for elegant{" "}
      <span className="font-semibold">wedding lehengas, designer sarees, party wear, festive outfits, stylish footwear, trendy handbags & beauty products</span>.
      Rent or purchase designer fashion at affordable prices.
      <br />
      <br />
      From <span className="font-semibold text-pink-600">bridal lehengas</span> and{" "}
      <span className="font-semibold text-pink-600">dandiya dresses</span> to exclusive{" "}
      <span className="font-semibold text-pink-600">designer pieces for special occasions</span> — 
      MOMCHIC helps you look stunning without the stress of expensive purchases.
    </p>

    <div className="mt-6 flex justify-center">
<a
  href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-5 inline-block px-6 py-2 text-sm md:text-base font-semibold border-2 border-pink-500 text-pink-600 rounded-full hover:bg-pink-50 hover:text-pink-700 transition-all duration-300 shadow-sm"
>
  📍 Visit Our Store
</a>

    </div>
  </div>
</section>

<div className="h-[2px] bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200 opacity-70"></div>
<footer className="bg-gray-50 border-t border-gray-200 text-gray-700 pt-8 pb-6">
  <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left justify-items-center md:justify-items-center">
    
    {/* 🛍️ Shop Categories */}
    <div className="w-full md:w-auto">
      <h4 className="text-pink-600 font-semibold mb-3 text-center md:text-left">Shop Categories</h4>
      <ul className="space-y-1 text-sm text-gray-700 text-center md:text-left">
        {[
          "Suits & Kurtis",
          "Lehengas & Sarees",
          "Handbags & Clutches",
          "Footwear Collection",
          "Beauty & Skincare",
        ].map((category, index) => (
          <li
            key={index}
            className="hover:text-pink-600 cursor-pointer transition"
            onClick={() => handleSubcategoryClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>

    {/* 🏬 Visit Our Store */}
    <div className="w-full md:w-auto text-center md:text-left">
      <h4 className="font-semibold text-pink-600 mb-3">Visit Our Store</h4>
      <p className="text-sm font-semibold">MOMCHIC Boutique</p>
      <p className="text-sm leading-relaxed">
        1st Floor, Mohan Cinema, near Bus Stand<br />
        Daltonganj, Jharkhand
      </p>
      <p className="text-sm mt-2">📞 +91 9204613635</p>
      <p className="text-sm">🕒 Open Daily: 10:30 AM – 9 PM</p>
      <a
        href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-600 text-sm mt-1 inline-block hover:underline"
      >
        📍 Get in-store direction
      </a>
    </div>

    {/* 🤝 Connect With Us */}
    <div className="w-full md:w-auto text-center md:text-left">
      <h4 className="font-semibold text-pink-600 mb-3">Connect With Us</h4>
      <div className="flex justify-center md:justify-start space-x-4">
        <a href="https://wa.me/919204613635" target="_blank" rel="noopener noreferrer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            className="w-6 h-6 hover:scale-110 transition-transform"
            alt="WhatsApp"
          />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
            className="w-6 h-6 hover:scale-110 transition-transform"
            alt="Instagram"
          />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            className="w-6 h-6 hover:scale-110 transition-transform"
            alt="Facebook"
          />
        </a>
      </div>
      <p className="text-xs mt-2 text-gray-500 max-w-xs mx-auto md:mx-0 leading-relaxed">
        For latest collections, inquiries, rentals, or personalized styling assistance.
      </p>
    </div>
  </div>

  {/* ✨ Boutique Tagline */}
  <div className="mt-10 text-center text-sm text-pink-600 font-medium tracking-wide">
    Designed with love and elegance at <span className="font-semibold">MOMCHIC Boutique 💖</span>
  </div>

  {/* 📜 Copyright Section */}
  <div className="mt-3 border-t border-gray-200 pt-3 text-center text-xs text-gray-400">
    <p className="tracking-wide">
      © {new Date().getFullYear()} <span className="font-semibold text-pink-600">MOMCHIC Boutique</span> — All Rights Reserved.
    </p>
  </div>
</footer>

{/* ✅ Floating WhatsApp Button */}
<a
  href="https://wa.me/919204613635"  // Replace with your actual number
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg z-50"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    className="w-6 h-6"
/>
</a>
      </div>
    </>
  );
}
