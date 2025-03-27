import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BooksContext } from "../../contexts/BooksProvider";
import AddToCartButton from "../AddToCartButton";
import WishlistButton from "../WishlistButton";

const ProductCard = ({ product, fromWishlist }) => {
  const navigate = useNavigate();
  const { removeWishlistHandler } = useContext(BooksContext);

  const { imgUrl, price, rating, title, _id, discount } = product;

  const removeFromWishList = (e, product) => {
    e.stopPropagation();
    removeWishlistHandler(product._id);
  };

  const productOverview = (id) => {
    navigate(`/product-overview/${id}`);
  };

  return (
    <div
      onClick={(e) => productOverview(_id)}
      className="group relative flex flex-col items-center self-start overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:border-gray-600 hover:bg-gray-800/70 hover:-translate-y-1"
    >
      <div className="relative w-full">
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            className="h-full w-full object-cover p-4 transition-transform duration-300 group-hover:scale-105"
            src={imgUrl}
            alt={title}
          />
        </div>
        {!fromWishlist && <WishlistButton product={product} />}
        {fromWishlist && (
          <button
            type="button"
            onClick={(e) => removeFromWishList(e, product)}
            className="absolute right-2 top-2 w-10 h-10 text-pink-500 rounded-full bg-pink-100/20 backdrop-blur-sm transition-all duration-200 hover:bg-pink-100/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex w-full flex-col space-y-3 p-4">
        <h5
          title={title}
          className="line-clamp-2 text-base font-semibold text-gray-100 transition-colors group-hover:text-white"
        >
          {title}
        </h5>
        <div className="flex flex-col space-y-2">
          <div className="relative flex items-baseline justify-between">
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-gray-100">
                ₹{price - discount}
              </span>
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{price}
              </span>
            </div>
            <span className="rounded-full bg-cyan-900/50 px-2.5 py-0.5 text-xs font-semibold text-cyan-100 backdrop-blur-sm">
              {rating} ★
            </span>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
