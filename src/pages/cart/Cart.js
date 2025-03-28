import React, { useState, useEffect } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data?.items);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/cart/update/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      fetchCartItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      fetchCartItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white px-4 py-3 rounded absolute top-0 left-0 right-0 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-white pt-16 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-500">Your Cart</h1>
          <div className="text-xl font-semibold">
            Total: <span className="text-purple-500">₹{calculateTotal()}</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-xl">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {cartItems.map((item) => (
              <div 
                key={item._id} 
                className="bg-[#1E293B] rounded-xl overflow-hidden flex items-center p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={item.book.coverImage} 
                    alt={item.book.title} 
                    className="w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{item.book.title}</h3>
                  <p className="text-gray-400 mb-3">{item.book.category.displayName}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-700 rounded-full">
                      <button 
                        className="px-3 py-1 text-gray-400 hover:text-white"
                        onClick={() => updateQuantity(item?.book?._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 text-sm">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 text-gray-400 hover:text-white"
                        onClick={() => updateQuantity(item.book?._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-purple-500 font-bold">
                      ₹{item.price.toFixed(2)}
                      {item.book.price.discount > 0 && (
                        <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                          {item.book.price.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item?.book?._id)}
                  className="text-red-500 hover:text-red-400 transition-colors ml-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;