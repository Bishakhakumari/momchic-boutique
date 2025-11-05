import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Search } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage"; // ✅ add your CategoryPage path here

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


  const navigate = useNavigate();

const handleSubcategoryClick = (subcategory) => {
  navigate(`/category/${encodeURIComponent(subcategory)}`); // ✅ route to category page
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
  <Routes>
    {/* ✅ Home Page Route */}
    <Route
      path="/"
      element={
        <>
          <Toaster />
          <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Keep ALL your existing code here — header, banner, product grid, footer, etc. */}
          </div>
        </>
      }
    />

    {/* ✅ Category Page Route */}
    <Route path="/category/:name" element={<CategoryPage />} />
  </Routes>
);

}
