import { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BooksContext } from '../../contexts/BooksProvider'
import CategoryCard from '../../components/CategoryCard'


const links = [
    { name: 'Explore', to: 'products' },
]

const Home = () => {
    const { booksState } = useContext(BooksContext)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = "Home | The Book Shelf"
    }, [])

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/books/getAllBooks')
                const data = await response.json()
                
                // Extract unique categories from books
                const categoryMap = new Map()
                
                data.data.forEach((book) => {
                    if (!categoryMap.has(book.category)) {
                        categoryMap.set(book.category, {
                            name: book.category,
                            image: book.coverImage,
                            description: `Books in the ${book.category} category`,
                            bookCount: 0
                        })
                    }
                    const category = categoryMap.get(book.category)
                    category.bookCount++
                })

                // Convert map to array
                const categoriesArray = Array.from(categoryMap.values())
                setCategories(categoriesArray)
            } catch (error) {
                console.error('Error fetching books:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    return (
        <div className='relative flex flex-col min-h-screen bg-[#0B0F1A]'>
            <div className="relative py-24 mt-16 overflow-hidden lg:mt-0 isolate sm:pt-32 sm:pb-16">
                <img
                    src="https://ik.imagekit.io/pb97gg2as/E-Commerce-Assets/boksbg.png?updatedAt=1684597529803"
                    alt="header-books"
                    className="absolute inset-0 object-cover object-right w-full h-full -z-10 md:object-center opacity-30"
                />
                <div
                    className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div
                    className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-30"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className="px-6 mx-auto max-w-7xl lg:px-8">
                    <div className="max-w-2xl mx-auto lg:mx-0">
                        <h2 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
                            THE <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">BOOK SHELF</span>
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Uncover a World of Literary Delights: Explore and Shop the Vast Library of Our E-Commerce Bookstore
                        </p>
                        <div className="mt-8">
                            <NavLink 
                                to="products" 
                                className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-105"
                            >
                                Explore <span className="ml-2" aria-hidden="true">→</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-20 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                        Book Categories
                    </h2>
                    <p className="mt-4 text-xl leading-8 text-gray-300">
                        Explore our collection of books by category
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden animate-pulse hover:bg-white/10 transition-colors">
                                <div className="h-80 bg-white/10" />
                                <div className="p-6">
                                    <div className="h-8 bg-white/10 rounded w-3/4 mb-4" />
                                    <div className="h-4 bg-white/10 rounded w-full mb-2" />
                                    <div className="h-4 bg-white/10 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <NavLink
                                to={`/products?category=${category.name}`}
                                key={category.name} 
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50"
                            >
                                <div className="relative h-80">
                                    <img
                                        src={category.image || "/placeholder.svg"}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                                        <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-300 text-lg mb-4 line-clamp-2 group-hover:text-white/90">
                                            {category.description}
                                        </p>
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
                                            {category.bookCount} books
                                        </span>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home