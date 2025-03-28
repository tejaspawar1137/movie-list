import { Route, Routes } from "react-router-dom";
import "./App.css";

// layouts
import RootLayout from "./layouts/RootLayout";


// auth
import CanActivate from "./components/routegurad/CanActivate";

// pages
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import Login from "./pages/login/Login";
import SignUp from "./pages/sign-up/SignUp";
import User from "./pages/user/User";
import Cart from "./pages/cart/Cart";
import Wishlist from "./pages/wishlist/Wishlist";
import AddressForm from "./pages/addressForm/AddressForm";
import Checkout from "./pages/checkout/Checkout";
import ThankYou from "./pages/thank-you/ThankYou";
import ProductOverview from "./pages/productOverview/ProductsOverview";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import ProductDetails from "./pages/product-overview/ProductDetails";
import Categories from "./pages/categories/Categories";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="product-overview/:id" element={<ProductDetails />} />
          <Route
            path="cart"
            element={
              
                <Cart />
              
            }
          />
          <Route
            path="checkout"
            element={
           
                <Checkout />
          
            }
          />
          <Route
            path="thank-you"
            element={
              <CanActivate>
                <ThankYou />
              </CanActivate>
            }
          />
          <Route
            path="wishlist"
            element={
              
                <Wishlist />
            
            }
          />
          <Route path="user">
            <Route
              index
              element={
                <CanActivate>
                  <User />
                </CanActivate>
              }
            />
            <Route
              path=":tab"
              element={
                <CanActivate>
                  <User />
                </CanActivate>
              }
            />
          </Route>
          <Route path="address">
            <Route
              index
              element={
                <CanActivate>
                  <AddressForm />
                </CanActivate>
              }
            />
            <Route
              path=":id"
              element={
                <CanActivate>
                  <AddressForm />
                </CanActivate>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
