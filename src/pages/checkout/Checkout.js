"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {toast} from 'react-hot-toast'
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { AlertCircle, CheckCircle2, ShoppingCart } from "lucide-react"
import { useLocation } from "react-router-dom"

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51MA4mcIyO4WKZxxFhHb522uxoxPhVIu2jlcq6N9otLQLopPNUWVG6YFIPSZRc8ys9O8f5fM5kxKpA3wwm4K8ZIKe000RNSmrpp",
)

const CheckoutForm = () => {
  const {state} = useLocation();
  const totalAmount = state.total;
  console.log(totalAmount,'location')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  })

  const stripe = useStripe()
  const elements = useElements()

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }

      const data = await response.json()
      setCartItems(data?.items || [])
      
      // Calculate cart total
      const total = calculateTotal(data?.items || [])
      setCartTotal(total)
      
      setIsLoading(false)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = item?.book?.price?.base || item?.price || 0
      const itemQuantity = item?.quantity || 0
      return total + (itemPrice * itemQuantity)
    }, 0).toFixed(2)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.firstName) errors.firstName = "Please fill in this field."
    if (!formData.lastName) errors.lastName = "Please fill in this field."
    if (!formData.email) errors.email = "Please fill in this field."
    if (!formData.address) errors.address = "Please fill in this field."
    if (!formData.city) errors.city = "Please fill in this field."
    if (!formData.zipCode) errors.zipCode = "Please fill in this field."
    if (!formData.country) errors.country = "Please fill in this field."

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: "", // You might want to add state field to your form
            zipCode: formData.zipCode,
            country: formData.country
          },
          paymentMethod: "card"
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        toast.success("Order placed successfully!")
        return true
      } else {
        console.error("❌ Order failed:", data)
        return false
      }
    } catch (error) {
      console.error("❌ Error placing order:", error)
      return false
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  
    if (!validateForm()) {
      return
    }
  
    if (!stripe || !elements) {
      console.error("❌ Stripe.js has not loaded yet.")
      return
    }
  
    setIsProcessing(true)
  
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      console.error("❌ Card element not found.")
      setIsProcessing(false)
      return
    }
  
    try {
      // Create Payment Method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: {
            city: formData.city,
            country: formData.country,
            line1: formData.address,
            postal_code: formData.zipCode,
          },
        },
      })
  
      if (error) {
        console.error("❌ Payment Method Error:", error.message)
        setIsProcessing(false)
        return
      }
  
      console.log("✅ PaymentMethod Created:", paymentMethod)
      
      // Place the order with our API
      const orderPlaced = await placeOrder()
      
      if (orderPlaced) {
        setIsProcessing(false)
        setPaymentSuccess(true)
      } else {
        console.error("❌ Order placement failed")
        setIsProcessing(false)
      }
    } catch (err) {
      console.error("❌ Unexpected Error:", err)
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 flex items-center justify-center p-4">
        <div className="bg-red-600/20 p-6 rounded-lg border border-red-600">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.href = "/cart"}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium"
          >
            Return to Cart
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-2xl border border-purple-900/30">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-purple-600/20 p-4 rounded-full mb-6">
                <ShoppingCart className="w-16 h-16 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
              <p className="text-gray-400 mb-8">
                Add some items to your cart before proceeding to checkout.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-left mb-4 flex items-center">
            <h1 className="text-purple-400 text-3xl font-bold">Checkout</h1>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-2xl border border-purple-900/30">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="bg-purple-600/20 p-4 rounded-full mb-6">
                <CheckCircle2 className="w-16 h-16 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Payment Successful!</h2>
              <p className="text-gray-400 mb-8">
                Thank you for your purchase. A confirmation email has been sent to your inbox.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate shipping, tax, and total
  const subtotal = parseFloat(cartTotal)
  const shipping = 4.99
  const taxRate = 0.10 // 10% tax
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mt-20">
        <div className="text-left mb-4 flex items-center">
          <h1 className="text-purple-400 text-3xl font-bold">Checkout</h1>
        </div>
        <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-2xl border border-purple-900/30">
          <div className="mb-6">
            <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-3">
              Your Items ({cartItems.length})
            </h3>
            <div className="max-h-40 overflow-y-auto">
              {cartItems.map((item, index) => {
                const itemPrice = item?.book?.price?.base || item?.price || 0
                return (
                  <div key={index} className="flex justify-between items-center mb-2 text-sm text-gray-300">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{item.book?.title || "Item"}</span>
                      <span className="text-gray-500">x{item.quantity || 1}</span>
                    </div>
                    <span>₹{(itemPrice * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.firstName ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                  {formErrors.firstName && (
                    <div className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.firstName}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.lastName ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                  {formErrors.lastName && (
                    <div className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.email ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
              />
              {formErrors.email && (
                <div className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.email}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-3">Shipping Address</h3>
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.address ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 mb-4`}
              />
              {formErrors.address && (
                <div className="text-red-400 text-sm -mt-3 mb-3 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.address}
                </div>
              )}

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.city ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                  {formErrors.city && (
                    <div className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.city}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.zipCode ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                  {formErrors.zipCode && (
                    <div className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.zipCode}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg border ${formErrors.country ? "border-red-500" : "border-purple-900/30"} focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                  {formErrors.country && (
                    <div className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.country}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 mt-8 border-t border-purple-900/30 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₹{totalAmount}</span>
              </div>
             
              <div className="flex justify-between items-center pt-2 border-t border-purple-900/30 mt-2">
                <span className="text-white font-medium">Total</span>
                <span className="text-xl text-purple-400 font-bold">₹{totalAmount}</span>
              </div>
            </div>

            <div>
              <h3 className="text-purple-400 text-sm font-medium uppercase tracking-wider mb-3">Payment Details</h3>
              <div className="bg-[#252525] p-4 rounded-lg border border-purple-900/30 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all duration-200">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#ffffff",
                        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                        "::placeholder": {
                          color: "#9ca3af",
                        },
                        iconColor: "#a855f7",
                      },
                      invalid: {
                        color: "#ef4444",
                        iconColor: "#ef4444",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isProcessing
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-purple-600/20"
                }`}
              >
                {isProcessing ? "Processing Payment..." : "Complete Payment"}
              </button>

              <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 11H5V21H19V11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Secure Checkout
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const StripeCheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default StripeCheckoutPage