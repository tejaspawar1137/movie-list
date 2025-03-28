import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/books/getAllBooks');
                const data = await response.json();
                
                if (data.data) {
                    // Create a map to store category info including image
                    const categoryMap = new Map();
                    
                    data.data.forEach(book => {
                        if (!categoryMap.has(book.category)) {
                            categoryMap.set(book.category, {
                                name: book.category,
                                image: book.coverImage,
                                description: `Explore our collection of ${book.category} books`
                            });
                        }
                    });
                    
                    // Convert map to array
                    const categoriesArray = Array.from(categoryMap.values());
                    setCategories(categoriesArray);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F1A] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Browse by <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Category</span>
                    </h1>
                    <p className="text-lg text-white/70">
                        Discover books from your favorite genres
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="relative h-48 rounded-2xl overflow-hidden bg-white/5 animate-pulse">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="h-6 w-32 bg-white/10 rounded-lg mb-2" />
                                    <div className="h-4 w-24 bg-white/10 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="group relative h-48 rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${category.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                        {category.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories; 