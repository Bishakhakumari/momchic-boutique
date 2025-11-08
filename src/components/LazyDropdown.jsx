import { motion, AnimatePresence } from "framer-motion";

export default function LazyDropdown({
  menuItems,
  activeCategory,
  setActiveCategory,
  hoverTimeout,
  handleSubcategoryClick,
}) {
  return (
    <>
      {Object.keys(menuItems).map((category) => (
        <div
          key={category}
          className="relative group pointer-events-auto"
          onMouseEnter={() => {
            clearTimeout(hoverTimeout.current);
            setActiveCategory(category);
          }}
          onMouseLeave={() => {
            hoverTimeout.current = setTimeout(
              () => setActiveCategory(null),
              200
            );
          }}
        >
          {/* Top-level Category Name */}
          <div
            className={`cursor-pointer uppercase tracking-wide transition-colors duration-200 px-1 ${
              activeCategory === category
                ? "text-pink-700 font-semibold"
                : "hover:text-pink-600"
            }`}
          >
            {category}
          </div>

          {/* Dropdown Animation */}
          <AnimatePresence>
            {activeCategory === category && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-64 bg-white shadow-lg border mt-1 z-50 pt-2 pb-2 rounded-md pointer-events-auto"
              >
                <ul className="p-4 flex flex-col gap-2 text-sm text-gray-700">
                  {menuItems[category].map((group, i) => (
                    <div key={i}>
                      {group.title && (
                        <li className="text-pink-500 font-bold uppercase text-xs tracking-wide mt-3 mb-1">
                          {group.title}
                        </li>
                      )}
                      {group.items.map((item, idx) => {
                        const label = item
                          .toLowerCase()
                          .split(" ")
                          .map(
                            (w) => w.charAt(0).toUpperCase() + w.slice(1)
                          )
                          .join(" ");
                        return (
                          <li
                            key={idx}
                            className="text-gray-600 cursor-pointer pl-2 transition-all duration-200 hover:font-semibold hover:text-gray-800"
                            onClick={() => handleSubcategoryClick(item)}
                          >
                            {label}
                          </li>
                        );
                      })}
                    </div>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
