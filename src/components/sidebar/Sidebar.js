import { useState } from "react";
import { Star } from "lucide-react";

const Sidebar = ({
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  selectedCategory,
  priceRange,
  selectedRating,
  books,
}) => {
  const ratings = [5, 4, 3, 2, 1];
  const [minPrice, maxPrice] = priceRange;
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from books
  const uniqueCategories = books && books.length > 0
    ? [...new Set(books.map((book) => book.category))]
    : [];

  console.log('Books in Sidebar:', books);
  console.log('Unique categories:', uniqueCategories);

  return (
    <div
      className={`bg-[#0B0F1A] border-r border-white/10 transition-all duration-300 ${
        showFilters ? "w-64" : "w-0 sm:w-64"
      }`}
    >
      {/* Mobile Filter Toggle */}
      <button
        className="fixed bottom-4 right-4 z-50 sm:hidden bg-purple-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setShowFilters(!showFilters)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      <div className="p-6 space-y-6 overflow-y-auto h-full">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            {/* Always show "All" category */}
            <button
              onClick={() => onCategoryChange('All')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === 'All'
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              All
            </button>

            {/* Show unique categories from books */}
            {uniqueCategories.length > 0 ? (
              uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {category}
                </button>
              ))
            ) : (
              <div className="text-white/50 px-4 py-2">Loading categories...</div>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={minPrice}
                onChange={(e) =>
                  onPriceRangeChange([Number(e.target.value), maxPrice])
                }
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                placeholder="Min"
                min="0"
              />
              <span className="text-white/50">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  onPriceRangeChange([minPrice, Number(e.target.value)])
                }
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                placeholder="Max"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Rating</h3>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingChange(rating)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedRating === rating
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                {[...Array(rating)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
                <span>& Up</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            onCategoryChange("All");
            onPriceRangeChange([0, 5000]);
            onRatingChange(0);
          }}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
