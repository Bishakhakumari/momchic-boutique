import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";


export default function CategoryPage() {
  const { name, tag } = useParams();
  const navigate = useNavigate();
    const location = useLocation();

  // ⭐ Professional history cleanup
  useEffect(() => {
    return () => {
      if (location.pathname.startsWith("/category")) {
        navigate("/", { replace: true });
      }
    };
  }, []);


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  


  const allCategories = useMemo(
    () => [
      "Lehengas & Gowns",
      "Sarees",
      "Suits & Kurtis",
      "Tops & Dresses",
      "Handbags",
      "Footwear",
      "Beauty & Skincare",
      "Rental Wear",
    ],
    []
  );

  const selectedCategory = useMemo(() => {
    if (!name) return "";
    const lower = name.toLowerCase();

    return (
      allCategories.find(
        (cat) =>
          cat.toLowerCase() === lower ||
          cat.toLowerCase().includes(lower) ||
          lower.includes(cat.toLowerCase())
      ) || name
    );
  }, [name, allCategories]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const sheetURL =
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7ZAmIk7wbGaqjix0PiStR8SiUWD7iTPglZtIcsbM1PIXno0Ry_KTPZI-0Bzvb-8L-yxzHVJ91auA6/pub?output=csv";

        const response = await axios.get(sheetURL);

        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => {
            if (!isMounted) return;

            // ⭐ Parse sheet to objects
            const parsed = data
              .map((item) => {
                if (!item["Item Name"]) return null;

                const imgArr = item["Image URL"]
                  ?.split(",")
                  .map((u) => u.trim())
                  .filter((u) => u);

                if (!imgArr || imgArr.length === 0) return null;

                return {
                  id: item["Item Name"],
                  name: item["Item Name"],
                  category: item["Category"]?.trim(),
                  price: parseInt(item.Price?.replace(/\D/g, ""), 10),
                  originalPrice: parseInt(
                    item["Original Price"]?.replace(/\D/g, ""),
                    10
                  ),
                  image: imgArr,
                  tag: item["Tag"]?.toLowerCase().trim() || "",
                  inStock:
                    item["Stock Status"]?.toLowerCase().includes("in") ?? true,
                };
              })
              .filter(Boolean);

            let filtered;

            // ⭐ CASE 1: FILTER BY TAG
          if (tag) {
  const urlTag = tag.toLowerCase(); // "flat50", "combo"

  const matchesFlat50 = [
    "flat 50% off",
    "flat 50 off",
    "50% off",
    "flat50",
    "flat_50",
    "50off"
  ];

  const matchesCombo = [
    "festive combos",
    "festive combo",
    "combo",
    "combo offer",
    "combos"
  ];

  filtered = parsed.filter((p) => {
    const rowTag = p.tag?.toLowerCase().trim();

    if (!rowTag) return false;

    if (urlTag === "flat50") {
      return matchesFlat50.includes(rowTag);
    }

    if (urlTag === "combo") {
      return matchesCombo.includes(rowTag);
    }

    return false;
  });
}


else {
  const lowerSel = selectedCategory.toLowerCase();

  // ⭐ SPECIAL LOGIC FOR RENTAL WEAR SUB-CATEGORIES
  if (lowerSel === "bridal lehengas") {
    filtered = parsed.filter((p) =>
      p.category?.toLowerCase() === "rental wear" &&
      p.name?.toLowerCase().includes("bridal")
    );
  }
  else if (lowerSel === "dandiya dresses") {
    filtered = parsed.filter((p) =>
      p.category?.toLowerCase() === "rental wear" &&
      (
        p.name?.toLowerCase().includes("dandiya") ||
        p.name?.toLowerCase().includes("navratri")
      )
    );
  }
  else if (lowerSel === "rental wear") {
    // ⭐ Show ALL rental wear items
    filtered = parsed.filter((p) =>
      p.category?.toLowerCase() === "rental wear"
    );
  }
  else {
    // ⭐ Normal category logic
    filtered = parsed.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      return cat.includes(lowerSel) || lowerSel.includes(cat);
    });
  }
}


            

            setProducts(filtered);
            setLoading(false);
          },
        });
      } catch (err) {
        console.log("❌ Error loading:", err);
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, tag]);

const handleCategoryClick = (cat) => {
    setProducts([]);   // ⭐ CLEAR previous category products here
    navigate(`/category/${encodeURIComponent(cat)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-pink-50 border-b border-pink-100 py-5 md:py-8 text-center sticky top-0 z-20 shadow-sm"
      >
<h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">

  {tag ? (
    <>Shop Offers at</>
  ) : (
    <>
      Shop <span className="font-bold">{selectedCategory}</span> at
    </>
  )}

  {/* Line break only on mobile */}
  <span className="md:hidden block"></span>

  <span
    className="text-pink-600 hover:text-pink-700 cursor-pointer transition md:ml-2"
    onClick={() => navigate("/")}
  >
    MOMCHIC Boutique
  </span>
</h1>



<p className="text-gray-600 text-xs md:text-base mt-2 max-w-xl mx-auto px-3">
  {tag ? (
    "Exclusive limited-time offers — grab them before they're gone!"
  ) : (
    <>
      Explore best <span className="font-semibold">{selectedCategory.toLowerCase()}</span> —
      elegant, affordable, and exclusively available in-store{" "}
    </>
  )}
</p>

      </motion.div>

      {/* DISCOUNT BANNER */}
      <div className="w-full flex justify-center mt-3 mb-4 px-4 animate-fadeInUp">
        <div className="bg-pink-50 border border-pink-200 text-pink-700 
          text-sm md:text-base py-2 px-4 rounded-lg shadow-sm 
          text-center max-w-3xl w-full">
          🎀 Wedding Season Offer: <span className="font-semibold">
            Up to 20% Off on Bridal Lehengas, Partywear & more
          </span> — Hurry Up!
        </div>
      </div>

      {/* CATEGORY NAV */}
      {!tag && (
        <div className="flex flex-wrap justify-center gap-3 py-4 border-b border-pink-100">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                cat === selectedCategory
                  ? "bg-pink-600 text-white border-pink-600"
                  : "text-pink-600 border-pink-300 hover:bg-pink-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* INFO BAR */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white text-sm text-gray-600 max-w-6xl mx-auto">
        <p className="font-medium">
          {loading
            ? "Loading items..."
            : `Showing ${products.length} item${products.length !== 1 ? "s" : ""}`}
        </p>
        <span className="text-gray-500">Sort by: <span className="font-medium text-pink-600">Latest</span></span>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center">Loading...</p>
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No items found.
          </p>
        )}
      </div>
       {/* 🏬 Boutique Note */}
<p className="text-center text-sm text-gray-500 mt-8">
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

  className="text-pink-600 hover:underline font-medium transition-colors"
>
  📍 Visit our boutique in Daltonganj
</a>{" "}
  for bridal rentals and exclusive in-store collections.
</p>


      {/* 💖 Footer Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-6 pb-10"
      >
        <button
  onClick={() => navigate("/", { replace: true })}

          className="px-6 py-2 border border-pink-500 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-50 transition"
        >
          ← Return to Home
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Designed with love & elegance –{" "}
          <span className="text-pink-500">MOMCHIC Boutique</span>
        </p>
      </motion.div>

    </div>
  );
}
