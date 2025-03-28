import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Share2 } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/books/getAllBooks`);
                const data = await response.json();
                const foundBook = data.data.find(b => b._id === id);
                if (foundBook) {
                    setBook(foundBook);
                } else {
                    navigate('/products');
                }
            } catch (error) {
                console.error('Error fetching book:', error);
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, navigate]);

    const handleAddToCart = () => {
        // Add your cart logic here
        console.log('Adding to cart:', book._id, 'Quantity:', quantity);
    };

    const handleAddToWishlist = () => {
        // Add your wishlist logic here
        console.log('Adding to wishlist:', book._id);
    };

    const handleShare = () => {
        // Add your share logic here
        console.log('Sharing book:', book._id);
    };

    // Convert price to USD (assuming 1 USD = 83 INR)
    const convertToUSD = (price) => {
        return (price / 83).toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F1A] pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/2">
                                <div className="aspect-[3/4] bg-white/10 rounded-xl" />
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="h-8 bg-white/10 rounded w-3/4" />
                                <div className="h-4 bg-white/10 rounded w-1/2" />
                                <div className="h-4 bg-white/10 rounded w-full" />
                                <div className="h-4 bg-white/10 rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-[#0B0F1A] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-white/70 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Books
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Book Image */}
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-4">{book.title}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                                    {book.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white/70">{book.rating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-white/70 leading-relaxed">{book.description}</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-white">${convertToUSD(book.price.current)}</span>
                                <span className="text-lg text-white/50 line-through">${convertToUSD(book.price.original)}</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <span className="text-white/70">Quantity:</span>
                            <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => Math.min(book.stock, prev + 1))}
                                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-white/50">({book.stock} available)</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-white rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                            >
                                <Heart className="h-5 w-5" />
                                Add to Wishlist
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                                <Share2 className="h-5 w-5" />
                                Share
                            </button>
                        </div>

                        {/* Additional Details */}
                        <div className="pt-6 border-t border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">Book Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Category</span>
                                    <span className="text-white">{book.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Rating</span>
                                    <span className="text-white">{book.rating} / 5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Stock</span>
                                    <span className="text-white">{book.stock} available</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Likes</span>
                                    <span className="text-white">{book.likes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails; 