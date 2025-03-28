import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, Search, LogIn, UserPlus } from 'lucide-react';
import { getAuth } from '../../services/localstorage-service';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const isAuthenticated = getAuth() !== null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + 
            (isScrolled ? 'bg-[#0B0F1A]/95 backdrop-blur-lg shadow-lg' : 'bg-transparent')}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                            WormFood
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                    
                        
                        <div className="flex items-center space-x-4">
                            <button onClick={() => window.location.replace("/products")} className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg">
                                <Search className="h-5 w-5" />
                            </button>
                            
                            <Link 
                                to="/wishlist"
                                className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg relative group"
                            >
                                <Heart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                            <Link 
                                to="/cart"
                                className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg relative group"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {!isAuthenticated && (
                                <>
                                    <Link 
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-300"
                                    >
                                        <LogIn className="h-5 w-5" />
                                    </Link>
                                    <Link 
                                        to="/register"
                                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0B0F1A]/95 backdrop-blur-lg border-t border-white/10">
                    <div className="px-4 py-6 space-y-6">
                        <Link 
                            to="/products"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300"
                        >
                            Explore Books
                        </Link>
                        
                        <div className="grid grid-cols-4 gap-3">
                            <button className="p-3 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors duration-300">
                                <Search className="h-5 w-5" />
                            </button>
                            
                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="p-3 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors duration-300 relative"
                            >
                                <Heart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                            <Link
                                to="/cart"
                                onClick={() => setIsMenuOpen(false)}
                                className="p-3 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors duration-300 relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {!isAuthenticated && (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-3 text-white/90 hover:text-white bg-white/5 rounded-lg transition-colors duration-300"
                                    >
                                        <LogIn className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
