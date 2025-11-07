import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define all standard categories for cross-match
  const allCategories = [
    "Lehengas & Gowns",
    "Sarees",
    "Suits & Kurtis",
    "Tops & Dresses",
    "Handbags",
    "Footwear",
    "Beauty & Skincare",
  ];

  // Find the best matching category (even if partially)
  const getClosestCategory = (input) => {
    const lower = input.toLowerCase();
    return (
      allCategories.find(
        (cat) =>
          cat.toLowerCase() === lower ||
          cat.toLowerCase().includes(lower) ||
          lower.includes(cat.toLowerCase())
      ) || input
    );
  };

  const selectedCategory = getClosestCategory(name);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetURL =
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7ZAmIk7wbGaqjix0PiStR8SiUWD7iTPglZtIcsbM1PIXno0Ry_KTPZI-0Bzvb-8L-yxzHVJ91auA6/pub?output=csv";

        const response = await axios.get(sheetURL);
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data
              .map((item) => {
                const price = parseInt(item.Price?.replace(/\D/g, ""), 10);
                const original = parseInt(
                  item["Original Price"]?.replace(/\D/g, ""),
                  10
                );

                // 🩷 Multi-image support (comma-separated URLs)
                const imageLinks = item["Image Link"]
                  ? item["Image Link"]
                      .split(",")
                      .map((url) => url.trim())
                      .filter((url) => url && url !== "undefined")
                  : [];

                return {
  id: item["Item Name"] + Math.random(),
  name: item["Item Name"]?.trim(),
  category: item["Category"]?.trim(),
  image: imageLinks,
  price: isNaN(price) ? 0 : price,
  originalPrice: isNaN(original) ? null : original,
  inStock:
    item["Stock Status"]?.toLowerCase().includes("in") ?? true, // ✅ New line
};

              })
              // ✅ Filter out items without any valid image
              .filter((item) => item.image && item.image.length > 0);

            // Smart filtering – even partial matches
            const filtered = data.filter((p) => {
              const categoryName = p.category?.toLowerCase() || "";
              const selected = selectedCategory.toLowerCase();
              return (
                categoryName.includes(selected) ||
                selected.includes(categoryName)
              );
            });

            setProducts(filtered);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [name]);

  // 🩷 Quick Category Navigation Bar
  const handleCategoryClick = (cat) => {
    navigate(`/category/${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🌸 Boutique Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-pink-50 border-b border-pink-100 py-5 md:py-8 text-center sticky top-0 z-20 shadow-sm"
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">
          Shop {selectedCategory} at{" "}
          <span className="text-pink-600">MOMCHIC Boutique</span>
        </h1>
        <p className="text-gray-600 text-xs md:text-base mt-2 max-w-xl mx-auto px-3">
          Explore best {selectedCategory.toLowerCase()} – elegant, affordable,
          and exclusively available in-store at MOMCHIC Boutique.
        </p>
      </motion.div>

      {/* 🧁 Centered Category Navigation */}
      <div className="flex flex-wrap justify-center gap-3 py-4 bg-white border-b border-pink-100">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
              cat === selectedCategory
                ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                : "text-pink-600 border-pink-300 hover:bg-pink-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍 Info Bar */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white text-sm text-gray-600 max-w-6xl mx-auto">
        <p className="font-medium">
          {loading
            ? "Loading items..."
            : `Showing ${products.length} item${
                products.length !== 1 ? "s" : ""
              }`}
        </p>
<span className="text-gray-500 cursor-default select-none">
  Sort by: <span className="font-medium text-pink-600">Latest</span>
</span>
      </div>

      {/* 🧴 Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <p className="text-gray-400 text-center col-span-full">
            Loading products...
          </p>
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No items found for “{selectedCategory}”
          </p>
        )}
      </div>

      {/* 💖 Footer Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 pb-10"
      >
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 border border-pink-500 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50 transition"
        >
          ← Back to All Collections
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Designed with love & elegance –{" "}
          <span className="text-pink-500">MOMCHIC Boutique</span>
        </p>
      </motion.div>
    </div>
  );
}
