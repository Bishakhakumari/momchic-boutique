import React, { useState } from "react";

export default function ProductCard({ product }) {
  const { name, category, image, price, originalPrice } = product;
  const [showModal, setShowModal] = useState(false);

  // Validate and compute discount
  const validPrice = parseInt(price);
  const validOriginal = parseInt(originalPrice);
  const hasDiscount = !isNaN(validOriginal) && validOriginal > validPrice;
  const discountPercent = hasDiscount
    ? Math.round(((validOriginal - validPrice) / validOriginal) * 100)
    : 0;

  return (
    <>
      {/* Product Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="overflow-hidden">
          <img
            src={image || "https://via.placeholder.com/300x400?text=No+Image"}
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
                <span className="line-through mr-2 text-gray-400">
                  ₹{validOriginal}
                </span>
                <span className="text-pink-600 font-bold">₹{validPrice}</span>
                <span className="text-green-700 text-xs ml-1 font-medium">
                  ({discountPercent}% OFF)
                </span>
              </>
            ) : (
              <span className="text-pink-600 font-bold">₹{validPrice}</span>
            )}
          </div>

          <p className="text-xs text-green-600 font-medium mt-1">
            Available in-store at{" "}
            <span className="font-semibold">MOMCHIC Boutique</span>
          </p>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-80 p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <img
              src={image || "https://via.placeholder.com/300x400?text=No+Image"}
              alt={name}
              className="w-full h-56 object-cover rounded-md"
            />

            <h3 className="text-base font-semibold text-gray-800 mt-3">
              {name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{category}</p>

            <div className="mt-2 text-sm text-gray-700">
              {hasDiscount ? (
                <>
                  <span className="line-through mr-2 text-gray-400">
                    ₹{validOriginal}
                  </span>
                  <span className="text-pink-600 font-bold">₹{validPrice}</span>
                  <span className="text-green-700 text-xs ml-1 font-medium">
                    ({discountPercent}% OFF)
                  </span>
                </>
              ) : (
                <span className="text-pink-600 font-bold">₹{validPrice}</span>
              )}
            </div>

            <p className="text-xs text-green-600 mt-3">
              ✅ Available in-store
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
