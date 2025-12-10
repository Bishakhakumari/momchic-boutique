import React, { useState, memo, useCallback } from "react";

function ProductCard({ product }) {
const { name, category, image, price, originalPrice, inStock, trending } = product;
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prepare image list
  const images = Array.isArray(image)
    ? image
    : image
    ? [image]
    : ["https://via.placeholder.com/300x400?text=No+Image"];

  // Discount logic (unchanged)
  const validPrice = +price || 0;
  const validOriginal = +originalPrice || 0;
  const hasDiscount = validOriginal > validPrice;

  // Handlers
  const handleImageClick = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const handleModalToggle = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  // ⭐ DRAG FUNCTION FOR VIEWING FULL IMAGE (vertical movement inverted)
  const enableDrag = (img) => {
    let startX = 0;
    let startY = 0;
    let initX = 50;
    let initY = 50;

    const getInitPos = () => {
      const pos = (img.style.objectPosition && img.style.objectPosition.trim()) || "50% 50%";
      const parts = pos.split(" ");
      const xPart = parts[0] || "50%";
      const yPart = parts[1] || "50%";
      initX = parseFloat(xPart);
      initY = parseFloat(yPart);
      if (Number.isNaN(initX)) initX = 50;
      if (Number.isNaN(initY)) initY = 50;
    };

    const startDrag = (e) => {
      const pos = e.touches ? e.touches[0] : e;
      startX = pos.clientX;
      startY = pos.clientY;
      getInitPos();

      window.addEventListener("mousemove", moveDrag, { passive: false });
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", moveDrag, { passive: false });
      window.addEventListener("touchend", stopDrag);
    };

    const moveDrag = (e) => {
  e.preventDefault();
  const pos = e.touches ? e.touches[0] : e;

  const diffX = pos.clientX - startX;  // drag right = positive
  const diffY = pos.clientY - startY;  // drag down = positive

  // ⭐ Correct natural directions
  let newX = initX - diffX * 0.2;  // drag right → image moves right
  let newY = initY - diffY * 0.2;  // drag down → image moves down

  // Limit movement
  newX = Math.max(0, Math.min(100, newX));
  newY = Math.max(0, Math.min(100, newY));

  img.style.objectPosition = `${newX}% ${newY}%`;
};

    const stopDrag = () => {
      window.removeEventListener("mousemove", moveDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", moveDrag);
      window.removeEventListener("touchend", stopDrag);
    };

    // Remove previously attached handlers to avoid duplicates
    img.onmousedown = null;
    img.ontouchstart = null;

    img.onmousedown = startDrag;
    img.ontouchstart = startDrag;
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        onClick={handleModalToggle}
        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer relative"
      >
<div className="overflow-hidden relative isolate">
  
  {/* ✅ TRENDING BADGE */}
  {trending && (
    <div className="trending-badge">
      Trending
    </div>
  )}

  <img
    loading="lazy"
    src={`${images[0]}?auto=format&fit=crop&w=600&q=60`}
    alt={name}
    className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
  />
</div>


        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">{category}</p>

          <p
            className={`text-xs font-medium mt-1 ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? "✅ Available in-store" : "❌ Currently out of stock"}
          </p>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleModalToggle}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-80 p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleModalToggle}
              className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-pink-700 transition"
            >
              ✕
            </button>

            {/* IMAGE (CROPPED LOOK + DRAG ENABLED) */}
            <div className="relative cursor-pointer" onClick={handleImageClick}>
              
  {/* ✅ TRENDING BADGE IN MODAL */}
  {trending && (
    <div className="trending-badge">
      Trending
    </div>
  )}
              <img
                id="modalImage"
                loading="lazy"
                src={`${images[currentIndex]}?auto=format&fit=crop&w=900&q=70`}
                alt={name}
                className="w-full h-64 object-cover rounded-md select-none"
                style={{ objectPosition: "50% 50%", cursor: "grab", touchAction: "none" }}
                ref={(img) => {
                  if (img) enableDrag(img);
                }}
              />

              {/* DOTS */}
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

            {/* TEXT INFO */}
            <h3 className="text-base font-semibold text-gray-800 mt-3">{name}</h3>
            <p className="text-sm text-gray-500 capitalize">{category}</p>

            <p
              className={`text-xs font-medium mt-3 ${
                inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {inStock ? "✅ Available in-store" : "❌ Currently out of stock"}
            </p>

          <a
  href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
  onClick={(e) => {
  e.preventDefault();

  const url = "https://maps.app.goo.gl/izfeBfpvB65rtzjy7";

  // Fire Google Ads conversion
  try {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17695821706/Ev8NCKnpvsUbEIqfg_ZB",
      });
    }
  } catch (err) {}

  // Open map in NEW TAB after delay
  setTimeout(() => {
    window.open(url, "_blank");
  }, 300);
}}

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

export default memo(ProductCard);
