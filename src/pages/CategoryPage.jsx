import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Elegant Category Header */}
      <div className="bg-pink-50 border-b border-pink-100 py-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop {name} at{" "}
          <span className="text-pink-600">MOMCHIC Boutique</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Discover our curated selection of {name.toLowerCase()} available
          exclusively in-store.
        </p>
      </div>

      {/* Subtle Info Bar */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white text-sm text-gray-600 max-w-6xl mx-auto">
        <p className="font-medium">
          {loading
            ? "Loading items..."
            : `Showing ${products.length} item${
                products.length !== 1 ? "s" : ""
              }`}
        </p>
        <button className="hover:text-pink-600 transition">Sort by: Latest</button>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {loading ? (
          <p className="text-gray-400 text-center col-span-full">
            Loading products...
          </p>
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No items found for “{name}”
          </p>
        )}
      </div>

      {/* Back Button */}
      <div className="text-center mt-6 pb-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 border border-pink-500 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50 transition"
        >
          ← Back to All Collections
        </button>
      </div>
    </div>
  );
}
