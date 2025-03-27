import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';

const ProductLayout = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        priceRange: [0, 5000],
        rating: 0,
        searchQuery: ''
    });

    // Fetch books when component mounts
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/books/getAllBooks');
                const data = await response.json();
                setBooks(data.data);
                setFilteredBooks(data.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Apply filters whenever filter values change
    useEffect(() => {
        let result = books;

        // Category filter
        if (filters.category !== 'All') {
            result = result.filter(book => book.category === filters.category);
        }

        // Price range filter
        result = result.filter(book => {
            const price = book.price.current;
            return price >= filters.priceRange[0] && price <= filters.priceRange[1];
        });

        // Rating filter
        if (filters.rating > 0) {
            result = result.filter(book => book.rating >= filters.rating);
        }

        // Search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
        }

        setFilteredBooks(result);
    }, [books, filters]);

    // Handle filter changes
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleAddToCart = (e, bookId) => {
        e.preventDefault(); // Prevent navigation
        // Add your cart logic here
        console.log('Adding to cart:', bookId);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden animate-pulse">
                        <div className="h-[400px] bg-white/10" />
                        <div className="p-4">
                            <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-white/10 rounded w-full mb-2" />
                            <div className="h-4 bg-white/10 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex pt-10 min-h-screen bg-[#0B0F1A]">
            {/* Sidebar with padding */}
            <div className="w-64 flex-shrink-0 p-6">
                <Sidebar
                    onCategoryChange={(category) => handleFilterChange('category', category)}
                    onPriceRangeChange={(range) => handleFilterChange('priceRange', range)}
                    onRatingChange={(rating) => handleFilterChange('rating', rating)}
                    selectedCategory={filters.category}
                    priceRange={filters.priceRange}
                    selectedRating={filters.rating}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-[#0B0F1A] text-white p-6">
                {/* Search Section */}
                <div className="sticky top-0 z-10 bg-[#0B0F1A]/95 backdrop-blur-lg border-b border-white/10 -mx-6 px-6 py-4 mb-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={filters.searchQuery}
                                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="max-w-7xl mx-auto">
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <div key={book._id} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50">
                                    <NavLink to={`/product-overview/${book._id}`}>
                                        <div className="relative aspect-[3/4]">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-70" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                                                        {book.category}
                                                    </span>
                                                    <span className="px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                                                        ★ {book.rating}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm text-gray-300 line-clamp-2 mb-2 group-hover:text-white/90">
                                                    {book.description}
                                                </p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-white">₹{book.price.current}</span>
                                                    <span className="text-sm text-gray-400 line-through">₹{book.price.original}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={(e) => handleAddToCart(e, book._id)}
                                        className="absolute bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A] group-hover:translate-y-0 translate-y-16"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-[50vh]">
                            <p className="text-2xl text-center text-gray-400">No books found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductLayout; 