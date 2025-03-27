import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from "react-router";
import { getAuth } from "../services/localstorage-service";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { BooksContext } from "../contexts/BooksProvider";

const AddToCartButton = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCartHandler, buttonDisabled, setButtonDisable } =
    useContext(BooksContext);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const checkForAuth = () => {
    if (getAuth() === null) {
      toast.error("Log in to continue.");
      navigate("/login", { state: { from: location } });
      return true;
    }
  };

  const { addedToCart, _id } = product;

  const handleClick = async () => {
    if (loading || added) return;
    
    setLoading(true);
    try {
      if (checkForAuth()) return;
      if (product.addedToCart) {
        navigate("/cart");
        return;
      }
      setButtonDisable(product._id);
      await addToCartHandler(product);
      setAdded(true);
      // Reset added state after 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || buttonDisabled === _id}
      id={_id}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2.5
        bg-purple-600 text-white rounded-xl
        transition-all duration-300
        hover:bg-purple-700
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0B0F1A]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${added ? 'bg-green-600 hover:bg-green-700' : ''}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : added ? (
        <>
          <Check className="h-5 w-5" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
