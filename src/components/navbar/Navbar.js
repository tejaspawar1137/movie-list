import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  Search,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import { BooksContext } from "../../contexts/BooksProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [likedBooks, setLikedBooks] = useState([]);
  const [cartCount, setCartCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get cart and wishlist from context
  const { booksState } = useContext(BooksContext);
  const { cart, wishlist } = booksState;

  const isAuthenticated = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userDetail"));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update local state when context changes
  useEffect(() => {
    console.log("Wishlist context changed:", wishlist);
    if (wishlist && Array.isArray(wishlist)) {
      setLikedBooks(wishlist);
      setLoading(false);
    }
  }, [wishlist]);

  useEffect(() => {
    console.log("Cart context changed:", cart);
    if (cart) {
      setCartCount(cart);
      setLoading(false);
    }
  }, [cart]);

  // Fallback to API calls if context is not available
  useEffect(() => {
    const fetchLikedBooks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLikedBooks([]);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/api/likes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("API response for likes:", data);

        // Make sure we're setting an array to the state
        if (data && Array.isArray(data)) {
          setLikedBooks(data);
        } else if (data && data.wishlist && Array.isArray(data.wishlist)) {
          // Some APIs return { wishlist: [...] }
          setLikedBooks(data.wishlist);
        } else {
          console.error("Unexpected likes data format:", data);
          setLikedBooks([]);
        }
      } catch (error) {
        console.error("Error fetching liked books:", error);
        toast.error("An error occurred while fetching wishlist");
        setLikedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (
      isAuthenticated &&
      (!wishlist || (Array.isArray(wishlist) && wishlist.length === 0))
    ) {
      fetchLikedBooks();
    } else if (isAuthenticated && wishlist) {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, wishlist]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount([]);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/api/cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("API response for cart:", data);

        // Make sure we're setting the correct data to the state
        if (data) {
          setCartCount(data);
        } else {
          console.error("Unexpected cart data format:", data);
          setCartCount([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("An error occurred while fetching cart");
        setCartCount([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !cart) {
      fetchCartItems();
    } else if (isAuthenticated && cart) {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, cart]);

  const handleLogout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload()
  };

  const ProfileMenu = ({ isMobile = false }) => (
    <div
      className={`absolute ${
        isMobile ? "static w-full" : "right-0 top-full mt-2"
      } bg-[#1A2231] rounded-lg shadow-lg border border-white/10 z-50`}
    >
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Helper function to get the likes count
  const getLikesCount = () => {
    console.log("Wishlist from context:", wishlist);
    console.log("LikedBooks from API:", likedBooks);

    if (loading) return "0";

    // Check if wishlist is an array
    if (wishlist && Array.isArray(wishlist) && wishlist.length > 0) {
      return wishlist.length;
    }

    // Check if wishlist is an object with a wishlist property
    if (
      wishlist &&
      wishlist.wishlist &&
      Array.isArray(wishlist.wishlist) &&
      wishlist.wishlist.length > 0
    ) {
      return wishlist.wishlist.length;
    }

    // Check if likedBooks is an array
    if (likedBooks && Array.isArray(likedBooks) && likedBooks.length > 0) {
      return likedBooks.length;
    }

    // Check if likedBooks is an object with a wishlist property
    if (
      likedBooks &&
      likedBooks.wishlist &&
      Array.isArray(likedBooks.wishlist) &&
      likedBooks.wishlist.length > 0
    ) {
      return likedBooks.wishlist.length;
    }

    return "0";
  };

  // Helper function to get the cart count
  const getCartCount = () => {
    console.log("Cart from context:", cart);
    console.log("CartCount from API:", cartCount);

    if (
      cart &&
      cart.items &&
      Array.isArray(cart.items) &&
      cart.items.length > 0
    ) {
      return cart.items.length;
    }

    if (
      cartCount &&
      cartCount.items &&
      Array.isArray(cartCount.items) &&
      cartCount.items.length > 0
    ) {
      return cartCount.items.length;
    }

    return "0";
  };

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (isScrolled
          ? "bg-[#0B0F1A]/95 backdrop-blur-lg shadow-lg"
          : "bg-transparent")
      }
    >
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
              <button
                onClick={() => window.location.replace("/products")}
                className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/wishlist"
                className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg relative group"
              >
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {getLikesCount()}
                </span>
              </Link>
              <Link
                to="/cart"
                className="p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg relative group"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Link>

              {!isAuthenticated ? (
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
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setIsProfileMenuOpen(true)}
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-purple-700 transition-colors duration-300"
                    title={`${user?.firstname} ${user?.lastname}`}
                  >
                    {`${user?.firstname?.slice(0, 1)} ${user?.lastname?.slice(
                      0,
                      1
                    )}`}
                  </div>
                  {isProfileMenuOpen && <ProfileMenu />}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
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
                  {getLikesCount()}
                </span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="p-3 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors duration-300 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Link>

              {!isAuthenticated ? (
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
              ) : (
                <div
                  className="relative w-full"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-purple-700 transition-colors duration-300"
                    title={`${user?.firstname} ${user?.lastname}`}
                  >
                    {`${user?.firstname?.slice(0, 1)} ${user?.lastname?.slice(
                      0,
                      1
                    )}`}
                  </div>
                  {isProfileMenuOpen && <ProfileMenu isMobile={true} />}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
