import { useEffect, useState, useRef } from "react";

export default function HeroBanner() {
  const bannerImages = [
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/f_auto,q_auto,w_1600/v1762614252/a1_s2xapg.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762707346/a3_dk8pbn.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/f_auto,q_auto,w_1600/v1762607877/22_voww88.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/f_auto,q_auto,w_1600/v1762607878/20_bpqdul.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/f_auto,q_auto,w_1600/v1762607877/28_sv9rko.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/f_auto,q_auto,w_1600/v1762607879/25_u0qglo.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762631933/a2_he7qm2.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);

  // ✅ Preload all images
  useEffect(() => {
    bannerImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // ✅ Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // ✅ Swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      setCurrentImage((prev) =>
        diff > 0
          ? (prev + 1) % bannerImages.length
          : (prev - 1 + bannerImages.length) % bannerImages.length
      );
    }
  };

  return (
    <section
      className="relative w-full h-[35vh] md:h-[50vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ✅ Background Images with Smooth Fade & Zoom */}
      {bannerImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 10 }}
        >
          <div
            className="w-full h-full bg-cover bg-center transform scale-100 animate-zoomInSlow"
            style={{
              backgroundImage: `url(${src}?auto=format&fit=crop&w=1600&q=60)`,
            }}
          />
        </div>
      ))}

      {/* ✅ Overlay Text (Always Visible) */}
      <div className="absolute inset-0 z-20 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4 select-none">
        <p className="text-xs md:text-sm uppercase tracking-[3px] text-gray-200 mb-2 animate-fadeIn">
          Your Local Fashion Destination
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-1 animate-fadeIn delay-100">
          Discover the World of Style at{" "}
          <span className="text-pink-300">MOMCHIC</span>
        </h1>

        <p className="text-sm md:text-base max-w-xl mt-2 animate-fadeIn delay-200">
          Shop our hand-picked collection of lehengas, sarees, suits,
          handbags, footwear, and more – at <b>MOMCHIC Boutique</b>.
          Premium fashion made affordable, right here in your town Daltonganj.
        </p>

        <a
          href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-6 py-2 text-sm font-semibold bg-white text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-300 animate-fadeIn delay-300"
        >
          🛍️ Visit Our Store
        </a>
      </div>
    </section>
  );
}
