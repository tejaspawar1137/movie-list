import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const WishlistPage = () => {
    const [likedBooks, setLikedBooks] = useState([]);
    console.log(likedBooks,'likedBook')
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedBooks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error('Please login to view your wishlist');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/likes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                console.log(data,'data')
                setLikedBooks(data);
                if (response.ok) {
                   
                } else {
                    toast.error(data.message || 'Failed to fetch wishlist');
                }
            } catch (error) {
                console.error('Error fetching liked books:', error);
                toast.error('An error occurred while fetching wishlist');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedBooks();
    }, [navigate]);

    const handleRemoveFromWishlist = async (bookId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8000/api/likes/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Remove the book from the local state
                setLikedBooks(prevBooks => 
                    prevBooks.filter(book => book._id !== bookId)
                );
                toast.success('Book removed from wishlist');
            } else {
                toast.error(data.message || 'Failed to remove book from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('An error occurred while removing from wishlist');
        }
    };

    const handleAddToCart = async (bookId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch('http://localhost:8000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookId: bookId,
                    quantity: 1
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Book added to cart successfully');
            } else {
                toast.error(data.message || 'Failed to add book to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('An error occurred while adding to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 bg-[#0B0F1A] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl pt-6 mx-auto px-4">
                    <h1 className="text-3xl font-bold text-white mb-8 px-4">My Wishlist</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse px-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white/5 rounded-xl p-6">
                                <div className="h-64 bg-white/10 rounded-lg mb-4"></div>
                                <div className="space-y-2 p-2">
                                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-[#0B0F1A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-white mb-8 px-4">My Wishlist</h1>
                
                {likedBooks?.length  ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                        {likedBooks?.map((book) => (
                            <div 
                                key={book._id} 
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 p-2"
                            >
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
                                                <span className="px-3 py-1 text-sm font-semibold bg-purple-500/30 text-purple-200 rounded-full border border-purple-500/50 shadow-lg shadow-purple-500/20">
                                                    {book.category}
                                                </span>
                                                <span className="px-3 py-1 text-sm font-semibold bg-yellow-500/30 text-yellow-200 rounded-full border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
                                                    ★ {book.rating}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors drop-shadow-lg">
                                                {book.title}
                                            </h3>
                                            <p className="text-base text-gray-200 line-clamp-2 mb-3 group-hover:text-white/90 font-medium">
                                                {book.description}
                                            </p>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-2xl font-bold text-white drop-shadow-lg">₹{book.price.current}</span>
                                                <span className="text-base text-gray-300 line-through">₹{book.price.original}</span>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>

                                {/* Remove from Wishlist Button */}
                                <button
                                    onClick={() => handleRemoveFromWishlist(book._id)}
                                    className="absolute bottom-4 right-16 p-3 bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A] group-hover:translate-y-0 translate-y-16"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(book._id)}
                                    className="absolute bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A] group-hover:translate-y-0 translate-y-16"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-6 py-16 px-4">
                        <Heart className="h-16 w-16 text-gray-500" />
                        <h2 className="text-2xl font-semibold text-white">Your Wishlist is Empty</h2>
                        <p className="text-gray-400 max-w-md px-4">
                            Explore our collection and add some books to your wishlist!
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                        >
                            Browse Books
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;