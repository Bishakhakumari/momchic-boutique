import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRzxK2v6S7Nuv5ANm4czSpdHhpyWNzTvpzIear47a5fH0lZSGu5psAXig2xCwegSJZuVdrH9N9PGgK/pub?output=csv";
      const response = await axios.get(sheetURL);
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((item) => {
            const price = parseInt(item.Price?.replace(/\D/g, ""), 10);
            const original = parseInt(item["Original Price"]?.replace(/\D/g, ""), 10);
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
        },
      });
    };
    fetchData();
  }, [name]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Showing: {name}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} onAddToCart={() => {}} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No items found for "{name}"</p>
      )}
    </div>
  );
}
