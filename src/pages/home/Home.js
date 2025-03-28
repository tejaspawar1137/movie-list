import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Home = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/books/getAllBooks')
                const data = await response.json()
                
                if (data.data) {
                    // Create a map to store category info including image
                    const categoryMap = new Map()
                    
                    data.data.forEach(book => {
                        if (!categoryMap.has(book.category)) {
                            categoryMap.set(book.category, {
                                name: book.category,
                                image: book.coverImage,
                                description: `Explore our collection of ${book.category} books`
                            })
                        }
                    })
                    
                    // Convert map to array
                    const categoriesArray = Array.from(categoryMap.values())
                    setCategories(categoriesArray)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="min-h-screen bg-[#0B0F1A]">
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80)' }}
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Discover Your Next
                        <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Favorite Book</span>
                    </h1>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Explore our curated collection of books across various genres. Find your perfect read today.
                    </p>
                    <Link 
                        to="/products"
                        className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group"
                    >
                        Explore Books
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Browse by <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Category</span>
                    </h2>
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
    )
}

export default Home