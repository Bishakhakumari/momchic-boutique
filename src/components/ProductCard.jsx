import React, { useState, memo, useCallback } from "react";

function ProductCard({ product }) {
  const { name, category, image, price, originalPrice, inStock } = product;
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Prepare images once
  const images = Array.isArray(image)
    ? image
    : image
    ? [image]
    : ["https://via.placeholder.com/300x400?text=No+Image"];

  // ✅ Use Math for discount calculation only when needed
  const validPrice = +price || 0;
  const validOriginal = +originalPrice || 0;
  const hasDiscount = validOriginal > validPrice;
  const discountPercent = hasDiscount
    ? Math.round(((validOriginal - validPrice) / validOriginal) * 100)
    : 0;

  // ✅ Memoized Handlers (prevents unnecessary re-renders)
  const handleImageClick = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const handleModalToggle = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  return (
    <>
      {/* 🩷 Product Card */}
      <div
        onClick={handleModalToggle}
        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="overflow-hidden">
          <img
            loading="lazy"
            src={`${images[0]}?auto=format&fit=crop&w=600&q=60`}
            alt={name}
            className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">
            {category}
          </p>

          <div className="text-sm text-gray-600 mt-1">
            {hasDiscount ? (
              <>
                <span className="text-pink-600 font-bold">₹{validPrice}</span>
                <span className="line-through ml-2 text-gray-400">
                  ₹{validOriginal}
                </span>
                <span className="text-green-700 text-xs ml-1 font-medium">
                  ({discountPercent}% OFF)
                </span>
              </>
            ) : (
              <span className="text-pink-600 font-bold">₹{validPrice}</span>
            )}
          </div>

          <p
            className={`text-xs font-medium mt-1 ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock
              ? "✅ Available in-store at MOMCHIC"
              : "❌ Currently out of stock"}
          </p>
        </div>
      </div>

      {/* 💎 Modal Popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleModalToggle}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-80 p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleModalToggle}
              aria-label="Close modal"
              className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-pink-700 transition"
            >
              ✕
            </button>

            {/* 🖼️ Clickable Image Area */}
            <div
              className="relative cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                loading="lazy"
                src={`${images[currentIndex]}?auto=format&fit=crop&w=900&q=70`}
                alt={`${name} ${currentIndex + 1}`}
                className="w-full h-64 object-cover rounded-md"
              />

              {/* 🔘 Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex ? "bg-pink-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <h3 className="text-base font-semibold text-gray-800 mt-3">
              {name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{category}</p>

            <div className="mt-2 text-sm text-gray-700">
              {hasDiscount ? (
                <>
                  <span className="text-pink-600 font-bold">₹{validPrice}</span>
                  <span className="line-through ml-2 text-gray-400">
                    ₹{validOriginal}
                  </span>
                  <span className="text-green-700 text-xs ml-1 font-medium">
                    ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span className="text-pink-600 font-bold">₹{validPrice}</span>
              )}
            </div>

            <p
              className={`text-xs font-medium mt-3 ${
                inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {inStock
                ? "✅ Available in-store"
                : "❌ Currently out of stock"}
            </p>

            <a
              href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm font-medium text-pink-600 border border-pink-500 rounded-full py-2 hover:bg-pink-50 transition"
            >
              📍 Get In-Store Directions
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ memo() prevents re-rendering unless props change
export default memo(ProductCard);
