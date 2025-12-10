import { useEffect, useState, useRef } from "react";
//import axios from "axios";
//import Papa from "papaparse";
import { Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
//import { motion, AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
const LazyDropdown = lazy(() => import("./components/LazyDropdown"));

import ProductCard from "./components/ProductCard";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import HeroBanner from "./components/Herobanner";
import CategoryPage from "./pages/CategoryPage";

// Google Ads Conversion Tracking for Visit Our Store buttons
export const trackStoreVisitConversion = (url) => {
  const callback = () => {
    if (url) window.location.href = url;
  };

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17695821706/Ev8NCKnpvsUbEIqfg_ZB",
      event_callback: callback,
    });
  } else {
    // fallback
    window.location.href = url;
  }
};

export default function App() {
  const hoverTimeout = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = {
    COLLECTIONS: [
      { title: "Ethnic Wear", items: ["Lehengas", "Sarees", "Suits & Kurtis"] },
      { title: "Western Wear", items: ["Tops & Dresses", "Palazzos", "Gowns"] },
      { title: "Accessories", items: ["Handbags", "Footwear"] },
    ],
    "WINTER WEAR": [
      { title: "", items: ["Cardigans & Sweaters", "Winter Tops", "Jackets & Outerwear", "Shawls & Stoles"] },
    ],
    BEAUTY: [
      { title: "Makeup", items: ["Lipsticks", "Eyeliner & Mascara", "Nail Paints"] },
      { title: "Fragrance & Care", items: ["Perfumes", "Body Mist", "Skincare Essentials"] },
    ],
    "RENTAL WEAR": [
      { title: "Occasion Wear", items: ["Bridal Lehengas", "Dandiya Dresses"] },
    ],
    OFFERS: [
      { title: "", items: ["Flat 50% Off", "Combo deals"] },
    ],
  };


  const navigate = useNavigate();

const handleSubcategoryClick = (subcategory) => {
  // normalize the incoming label (lowercase, trim)
  const raw = (subcategory || "").toString();
  const lower = raw.toLowerCase().trim();

  // compacted key: remove non-alphanum so "Flat 50% Off" -> "flat50off"
  const compact = lower.replace(/[^a-z0-9]/g, "");

  // offer detection (covers many variants you might enter in sheet / UI)
  const isFlat50 =
    /flat\s*50|50%|50percent|flat50|flat50off|50off/.test(lower) ||
    compact.includes("flat50") ||
    compact.includes("50off");

  const isCombo =
    /combo|combos|festive/.test(lower) || compact.includes("combo") || compact.includes("festivecombos");

  if (isFlat50) {
    navigate(`/category/tag/flat50`);
    setActiveCategory(null);
    setShowBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (isCombo) {
    navigate(`/category/tag/combo`);
    setActiveCategory(null);
    setShowBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // 🩷 Existing redirects for subcategories (unchanged)
  const redirectMap = {
    Palazzos: "Tops & Dresses",
    Lipsticks: "Beauty & Skincare",
    "Nail Paints": "Beauty & Skincare",
    "Perfumes": "Beauty & Skincare",
    "Eyeliner & Mascara": "Beauty & Skincare",
    "Skincare": "Beauty & Skincare",
    "Body Mist": "Beauty & Skincare",
    "Skincare Essentials": "Beauty & Skincare",
    "Bridal Lehengas": "Rental wear",
    "Dandiya Dresses": "Rental Wear",
    "Cardigans & Sweaters": "Winter Wear",
    "Winter Tops": "Winter Wear",
    "Jackets & Outerwear": "Winter Wear",
    "Shawls & Stoles": "Winter Wear",

  };

  const finalCategory = redirectMap[subcategory] || subcategory;

  navigate(`/category/${encodeURIComponent(finalCategory)}`);
  setActiveCategory(null);
  setShowBanner(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      const [{ default: axios }, { default: Papa }] = await Promise.all([
        import("axios"),
        import("papaparse"),
      ]);

      const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7IG6buXMwo8VbGRHanhl7QocDXakRPpkBXoD72k4p4wbyYPrCTh8HiIbNmtOUaz1rvraPVZbmob5u/pub?gid=1779491107&single=true&output=csv";

      const response = await axios.get(sheetURL);

      Papa.parse(response.data, {
  header: true,
  complete: (results) => {
    const cleanedData = results.data
      .filter((item) => item["Item Name"] && item.Price)
      .map((item) => {
        const price = parseInt(item.Price?.replace(/\D/g, ""), 10);
        const originalPrice = parseInt(item["Original Price"]?.replace(/\D/g, ""), 10);

        return {
          id: item["Item Name"] + Math.random(),
          name: item["Item Name"],
          category: item["Category"],

          // ✅ SORT
          sortOrder: Number(item["Sort Order"]) || 9999,

          // ✅ HOME CONTROLS
          showInNewArrivals: String(item["Show in New Arrivals"] || "").trim(),
          newArrivalsSort: Number(item["New Arrivals Sort"]) || null,

          showInFavourites: String(item["Show in Favourites"] || "").trim(),
          favouritesSort: Number(item["Favourites Sort"]) || null,

          price: isNaN(price) ? 0 : price,
          originalPrice: isNaN(originalPrice) ? null : originalPrice,

          image: item["Image URL"]
            ? item["Image URL"]
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url && url !== "undefined")
            : [],

          tag: item["Tag"]?.trim()?.toLowerCase() || "",
          inStock: item["Stock Status"]?.trim()?.toLowerCase() === "in stock",

          // ✅✅✅ FINAL TRENDING FIX
          trending: String(item["Trending"] || "")
            .trim()
            .toLowerCase() === "yes",
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // ✅✅✅ NEVER remap trending again after this
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

    // ⭐ Home sections controlled by Google Sheet columns
const newArrivals = products
  .filter(p => (p.showInNewArrivals || "").toLowerCase() === "yes")
  .sort((a, b) => (a.newArrivalsSort || 999) - (b.newArrivalsSort || 999));

const favourites = products
  .filter(p => (p.showInFavourites || "").toLowerCase() === "yes")
  .sort((a, b) => (a.favouritesSort || 999) - (b.favouritesSort || 999));



  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-center">

            {/* 🔗 Logo — Redirects to Homepage */}
            {/* 🔗 Logo — Redirects to Homepage */}
            <Link
              to="/"
              onClick={resetToHome}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <img
                src="https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762553569/mohan-cinema-momchic-boutiuqe-daltonganj-logo-opening-new-shop-mayor-aruna-shankar.png"
                alt="MOMCHIC Boutique Logo"
                className="h-10 w-10 rounded-full border border-pink-100 object-contain"
              />
              <span className="text-2xl font-extrabold text-pink-600 tracking-wide">
                MOMCHIC
              </span>
            </Link>


            {/* 🔍 Search + Navigation (Desktop Layout) */}
            <div className="w-full md:flex md:flex-row-reverse md:items-center md:gap-6">

              {/* Search Bar */}
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

              {/* Navigation Menu */}
              {/* Navigation Menu */}
              <nav className="relative hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">

  <Suspense fallback={null}>
    <LazyDropdown
      menuItems={menuItems}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      hoverTimeout={hoverTimeout}
      handleSubcategoryClick={handleSubcategoryClick}
    />
  </Suspense>

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
        setShowBanner(false);
      }}
      className="inline-block text-sm font-medium text-gray-700 hover:text-pink-600 mx-2"
    >
      {category}
    </button>
  ))}
</div>

{/* Mobile Subcategories */}
{activeCategory && (
  <div className="md:hidden bg-pink-50 border-b border-pink-200 px-4 py-3">

    {menuItems[activeCategory].map((group, idx) => (
      <div key={idx} className="mb-2">

        {/* ⭐ Show section title or fallback to category name */}
        <div className="text-xs font-semibold text-pink-700 uppercase mt-2">
          {group.title || activeCategory}
        </div>

        {/* Subcategory buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {group.items.map((item, subIdx) => (
            <button
              key={subIdx}
              onClick={() => handleSubcategoryClick(item)}
              className="bg-white border text-xs px-3 py-1 rounded shadow-sm text-gray-700 hover:bg-pink-100"
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
  <Routes>

    {/* HOME PAGE */}
    <Route
      path="/"
      element={
        <>
          <div>
            {showBanner && <HeroBanner />}

              {/* ✅ GOOGLE ADS TRUST LINE (STEP 5) */}
  {showBanner && (
    <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 mb-2 px-4">
      📍 Trusted Boutique in Daltonganj • 200+ Happy Customers • Trial & Rental Available
    </p>
  )}

  {/* 🩷 Wedding Season Discount Banner (Fade-in) */}

            {/* 🩷 Wedding Season Discount Banner (Fade-in) */}
            {showBanner && (
              <div className="w-full flex justify-center mt-4 mb-3 px-4 animate-fadeInUp">
                <div className="
                  bg-pink-50 border border-pink-200 text-pink-700 
                  text-sm md:text-base py-2 px-4 rounded-lg shadow-sm 
                  text-center max-w-3xl w-full
                  transition-all duration-500 ease-out
                ">
                  ❄️ Winter Style Offers:{" "}
                  <span className="font-semibold">
                    Special in-store discounts on winter wear, lehengas & more
                  </span>{" "}
                  — Hurry Up!
                </div>
              </div>
            )}

{/* 🆕 New Arrivals Section */}
<section className="p-6 max-w-7xl mx-auto">
  <div className="flex flex-col items-center mb-2">
    <div className="flex items-center justify-center gap-2 mb-1">
      <Gift className="text-pink-500 w-6 h-6" />
      <h2 className="text-2xl font-semibold text-gray-800">
        New Arrivals
      </h2>
    </div>
<p className="text-gray-600 text-sm md:text-base text-center">
      Discover our latest additions — fresh, elegant, and handpicked for every occasion.
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

  {newArrivals.length === 0 ? (
    <div className="col-span-full text-center py-12 text-gray-500">
      <img
        src="https://cdn.dribbble.com/users/2046015/screenshots/15640474/media/883a2553b27ea3394a0db6f1c3acfe6a.png"
        alt="No new arrivals"
        className="w-40 mx-auto mb-4"
      />
      <p className="text-sm">No new arrivals available right now.</p>
    </div>
  ) : (
    newArrivals.slice(0, 10).map((product, i) => (
      <ProductCard key={i} product={product} />
    ))
  )}

</div>

</section>


           {/* 💖 Customer Favourites Section */}
<section className="p-6 max-w-7xl mx-auto mt-8 border-t border-pink-100">
  <div className="text-center mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-pink-600">
      💖 Customer Favourites
    </h2>
<p className="text-gray-600 text-sm md:text-base text-center">
      Timeless picks loved by our customers — elegant, affordable, and always in style.
    </p>
  </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

  {favourites.length === 0 ? (
    <div className="col-span-full text-center py-12 text-gray-500">
      <img
        src="https://cdn.dribbble.com/users/2046015/screenshots/15640474/media/883a2553b27ea3394a0db6f1c3acfe6a.png"
        alt="No favourites"
        className="w-40 mx-auto mb-4"
      />
      <p className="text-sm">No customer favourites yet — check back soon!</p>
    </div>
  ) : (
    favourites.slice(0, 10).map((product, i) => (
      <ProductCard key={i} product={product} />
    ))
  )}

</div>

</section>

          </div>
        </>
      }
    />

    {/* CATEGORY PAGES */}
    <Route path="/category/:name" element={<CategoryPage />} />
    <Route path="/category/tag/:tag" element={<CategoryPage />} />

  </Routes>
</div>


        {/* ✅ Why Visit MOMCHIC Boutique Section */}<section
          className="bg-pink-50 py-12 mt-8 border-t border-pink-100"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="max-w-6xl mx-auto px-6 text-center" data-aos="fade-up" data-aos-delay="100">
            <h2
              className="text-2xl md:text-3xl font-bold text-pink-700 mb-4"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              Why Visit <span className="text-gray-800">MOMCHIC Boutique</span>?
            </h2>

            <p
              className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-sm md:text-base"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              MOMCHIC Boutique is your one-stop destination for elegant{" "}
              <span className="font-semibold">
                wedding lehengas, designer sarees, party wear, festive outfits, elegant suits & kurtis, stylish footwear,
                trendy handbags & beauty products
              </span>
              . Make your wedding truly special with our exclusive <span className="font-semibold text-pink-600">bridal lehenga rental service.</span>
              <br />
              <br />
              From <span className="font-semibold text-pink-600">bridal lehengas</span> and{" "}
              <span className="font-semibold text-pink-600">dandiya dresses</span> available on rent, to premium{" "}
              <span className="font-semibold text-pink-600">
                designer pieces
              </span> for sale{" "}
              – MOMCHIC helps you look stunning without the stress of expensive purchases.
            </p>

            <div
              className="mt-6 flex justify-center"
              data-aos="zoom-in"
              data-aos-delay="500"
            >
    <a
  href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
  onClick={(e) => {
  e.preventDefault();

  const url = "https://maps.app.goo.gl/izfeBfpvB65rtzjy7";

  // Fire Google Ads conversion
  try {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17695821706/Acj4CNi_5MQbEIQfg_ZB",
      });
    }
  } catch (err) {}

  // Open map in NEW TAB after delay
  setTimeout(() => {
    window.open(url, "_blank");
  }, 300);
}}

  className="mt-5 inline-block px-6 py-2 text-sm md:text-base font-semibold border-2 border-pink-500 text-pink-600 rounded-full hover:bg-pink-50 hover:text-pink-700 transition-all duration-300 shadow-sm"
>
  📍 Visit Our Store
</a>


            </div>
          </div>
        </section>

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
                  "Rental Wear",
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
                Daltonganj, Palamu, Jharkhand – 822101
              </p>
      <a
  href="tel:+919204613635"
  onClick={(e) => {
    try {
      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17695821706/Ev8NCKnpvsUbEIqfg_ZB",
        });
      }
    } catch (err) {
      console.log("Call conversion error", err);
    }
  }}
  className="text-pink-600 text-sm mt-2 inline-block hover:underline font-medium"
>
  📞 +91 9204613635
</a>

              <p className="text-sm">🕒 Open Daily: 10:30 AM – 9 PM</p>
           <a
  href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
  onClick={(e) => {
  e.preventDefault();

  const url = "https://maps.app.goo.gl/izfeBfpvB65rtzjy7";

  // Fire Google Ads conversion
  try {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17695821706/Ev8NCKnpvsUbEIqfg_ZB",
      });
    }
  } catch (err) {}

  // Open map in NEW TAB after delay
  setTimeout(() => {
    window.open(url, "_blank");
  }, 300);
}}

  className="text-pink-600 text-sm mt-1 inline-block hover:underline"
>
  📍 Get in-store direction
</a>

            </div>

            {/* 🤝 Connect With Us */}
            <div className="w-full md:w-auto text-center md:text-left">
              <h4 className="font-semibold text-pink-600 mb-3">Connect With Us</h4>

              <div className="flex justify-center md:justify-start items-center space-x-4">

  {/* Instagram */}
  <a
    href="https://www.instagram.com/momchic.daltonganj/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 transition-transform duration-200"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
      alt="Instagram"
      className="w-6 h-6 object-contain"
    />
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 transition-transform duration-200"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
      alt="Facebook"
      className="w-6 h-6 object-contain"
    />
  </a>

  {/* YouTube (Red Square Logo — perfectly matching size) */}
  <a
    href="https://www.youtube.com/@momchic_fashion"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 transition-transform duration-200"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
      alt="YouTube"
      className="w-6 h-6 object-contain"

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
            Designed with love & elegance – <span className="font-semibold">MOMCHIC Boutique 💖</span>
          </div>

          {/* 📜 Copyright Section */}
          <div className="mt-3 border-t border-gray-200 pt-3 text-center text-xs text-gray-400">
            <p className="tracking-wide">
              © {new Date().getFullYear()} <span className="font-semibold text-pink-600">MOMCHIC Boutique</span> — All Rights Reserved.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
