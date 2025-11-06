import React, { useState } from "react";

export default function ProductCard({ product }) {
  const { name, category, image, price, originalPrice } = product;
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle images: support both single string and array
  const images = Array.isArray(image)
    ? image
    : image
    ? [image]
    : ["https://via.placeholder.com/300x400?text=No+Image"];

  // Validate and compute discount
  const validPrice = parseInt(price);
  const validOriginal = parseInt(originalPrice);
  const hasDiscount = !isNaN(validOriginal) && validOriginal > validPrice;
  const discountPercent = hasDiscount
    ? Math.round(((validOriginal - validPrice) / validOriginal) * 100)
    : 0;

  // Next / Previous image logic
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Product Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="overflow-hidden">
          <img
            src={images[0]}
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

          <p
  className={`text-xs font-medium mt-1 ${
    product.inStock ? "text-green-600" : "text-red-500"
  }`}
>
  {product.inStock
    ? "✅ Available in-store at MOMCHIC"
    : "❌ Currently out of stock"}
</p>

        </div>
      </div>

      {/* Modal Popup with Image Slider */}
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
className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-pink-700 transition"
            >
              ✕
            </button>

            {/* Image Slider */}
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt={`${name} ${currentIndex + 1}`}
                className="w-full h-64 object-cover rounded-md"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white transition"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentIndex
                            ? "bg-pink-600"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

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

            <p
  className={`text-xs font-medium mt-3 ${
    product.inStock ? "text-green-600" : "text-red-500"
  }`}
>
  {product.inStock
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
