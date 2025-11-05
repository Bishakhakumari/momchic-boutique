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

  // 🛍️ List of main categories for Quick Navigation
  const categories = [
    "Lehengas",
    "Sarees",
    "Suits & Kurtis",
    "Tops & Dresses",
    "Handbags",
    "Footwear",
    "Lipsticks",
    "Eyeliner & Mascara",
    "Perfumes",
    "Body Mist",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheetURL =
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRzxK2v6S7Nuv5ANm4czSpdHhpyWNzTvpzIear47a5fH0lZSGu5psAXig2xCwegSJZuVdrH9N9PGgK/pub?output=csv";

        const response = await axios.get(sheetURL);
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((item) => {
              const price = parseInt(item.Price?.replace(/\D/g, ""), 10);
              const original = parseInt(
                item["Original Price"]?.replace(/\D/g, ""),
                10
              );
              return {
                id: item["Item Name"] + Math.random(),
                name: item["Item Name"],
                category: item["Category"],
                image: item["Image Link"],
                price: isNaN(price) ? 0 : price,
                originalPrice: isNaN(original) ? null : original,
              };
            });

            const filtered = data.filter((p) =>
              p.category?.toLowerCase().includes(name.toLowerCase())
            );
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

  return (
    <div className="min-h-screen bg-white">
      {/* 🌸 Boutique Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-pink-50 border-b border-pink-100 py-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Shop {name} at{" "}
          <span className="text-pink-600">MOMCHIC Boutique</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-3 max-w-xl mx-auto">
          Discover our handpicked {name.toLowerCase()} — elegant, affordable, and
          exclusively available in-store at MOMCHIC.
        </p>
      </motion.div>

      {/* 🌈 Quick Category Navigation Bar */}
      <div className="flex overflow-x-auto gap-3 py-3 px-4 border-b border-pink-100 bg-white text-sm scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
            className={`px-4 py-1.5 rounded-full border ${
              name === cat
                ? "bg-pink-600 text-white border-pink-600"
                : "border-pink-300 text-pink-700 hover:bg-pink-50"
            } transition`}
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
        <button className="hover:text-pink-600 transition">
          Sort by: Latest
        </button>
      </div>

      {/* 🧴 Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
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
            No items found for “{name}”
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
          Designed with love & elegance at{" "}
          <span className="text-pink-500">MOMCHIC Boutique</span>
        </p>
      </motion.div>
    </div>
  );
}
