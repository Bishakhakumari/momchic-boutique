import React from "react";

export default function ProductCard({ product }) {
  const { name, category, image, price, originalPrice } = product;

  const validPrice = parseInt(price);
  const validOriginal = parseInt(originalPrice);
  const hasDiscount = !isNaN(validOriginal) && validOriginal > validPrice;
  const discountPercent = hasDiscount
    ? Math.round(((validOriginal - validPrice) / validOriginal) * 100)
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
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
        <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">{category}</p>

        <div className="text-sm text-gray-600 mt-1">
          {hasDiscount ? (
            <>
              <span className="line-through mr-2 text-gray-400">₹{validOriginal}</span>
              <span className="text-pink-600 font-bold">₹{validPrice}</span>
              <span className="text-green-700 text-sm ml-1 font-medium">
                ({discountPercent}% OFF)
              </span>
            </>
          ) : (
            <span className="text-pink-600 font-bold">₹{validPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}
