import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useLocation, useNavigate } from "react-router";
import { getAuth } from "../services/localstorage-service";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { BooksContext } from "../contexts/BooksProvider";

const WishlistButton = ({ bookId, isWishlisted = false, onToggleWishlist, className = '' }) => {
    const [loading, setLoading] = useState(false);
    const [wishlisted, setWishlisted] = useState(isWishlisted);

    const {handleWishlistToggle}=useContext(BooksContext)
    const navigate=useNavigate()
    const location=useLocation();

    const handleClick = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            await onToggleWishlist(bookId);
            setWishlisted(!wishlisted);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkForAuth = () => {
        if (getAuth() === null) {
            toast.error("Log in to continue.");
            navigate("/login", { state: { from: location } });
            return true;
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`
                p-2.5 rounded-full
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${wishlisted 
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}
                ${className}
            `}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
            <Heart 
                className={`h-5 w-5 transform transition-transform ${loading ? 'animate-pulse' : ''}`}
                fill={wishlisted ? 'currentColor' : 'none'}
            />
        </button>
    );
};

export default WishlistButton;