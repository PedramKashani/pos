// /frontend/src/components/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import CartList from "./CartList";
import Checkout from "./checkout";
import LandingPage from "./LandingPage";






function App() {
  // Define cart state and related functions in App.js
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // State for fetched products

  // Function to clear the cart (useful for checkout)
  const clearCart = () => {
    setCart([]);
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run once on component mount

 
  return (
    <Router>
      <div className="App">
        <h1>Welcome to the POS System</h1>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/products"
            element={
              <CartList products={products} cart={cart} setCart={setCart} />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} onClearCart={clearCart} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
