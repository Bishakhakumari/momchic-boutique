import { useEffect, useState, useRef } from "react";

export default function HeroBanner() {
  // 🖼 Cloudinary banner images
  const bannerImages = [
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762614252/a1_s2xapg.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762607877/22_voww88.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762607878/20_bpqdul.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762607877/28_sv9rko.jpg",
    "https://res.cloudinary.com/dm5ksdp5o/image/upload/v1762607879/25_u0qglo.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ⏳ Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 📱 Swipe detection for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50)
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    if (touchEndX.current - touchStartX.current > 50)
      setCurrentImage((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <section
      className="relative w-full h-[35vh] md:h-[50vh] bg-cover bg-center transition-all duration-[1200ms] ease-in-out"
      style={{
        backgroundImage: `url(${bannerImages[currentImage]})`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Overlay content (static text) */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4 select-none">
        <p className="text-xs md:text-sm uppercase tracking-[3px] text-gray-200 mb-2">
          Your Local Fashion Destination
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-1">
          Discover the World of Style at{" "}
          <span className="text-pink-300">MOMCHIC</span>
        </h1>

        <p className="text-sm md:text-base max-w-xl mt-2">
          Shop our hand-picked collection of lehengas, sarees, suits,
          handbags, footwear, and more – at <b>MOMCHIC Boutique</b>. Premium
          fashion made affordable, right here in your town Daltonganj.
        </p>

        <a
          href="https://maps.app.goo.gl/izfeBfpvB65rtzjy7"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-6 py-2 text-sm font-semibold bg-white text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-300"
        >
          🛍️ Visit Our Store
        </a>
      </div>
    </section>
  );
}
