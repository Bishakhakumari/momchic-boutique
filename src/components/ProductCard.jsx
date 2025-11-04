import React from "react";

export default function ProductCard({ product }) {
  const { name, category, image, price, originalPrice } = product;

  // Validate and compute discount
  const validPrice = parseInt(price);
  const validOriginal = parseInt(originalPrice);
  const hasDiscount = !isNaN(validOriginal) && validOriginal > validPrice;
  const discountPercent = hasDiscount
    ? Math.round(((validOriginal - validPrice) / validOriginal) * 100)
    : 0;

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/300x400?text=No+Image"}
          alt={name}
          className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">
          {category}
        </p>

        {/* Price and Discount */}
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

        {/* ✅ In-store Availability Tag */}
        <p className="text-xs text-green-600 font-medium mt-1">
          Available in-store at{" "}
          <span className="font-semibold">MOMCHIC Boutique</span>
        </p>
      </div>
    </div>
  );
}
