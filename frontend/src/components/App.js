// /frontend/src/components/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Checkout from "./Checkout";
import LandingPage from "./LandingPage";
import UserOrderPage from "./UserOrderPage";
import OrdersList from "./OrdersList";
import CustomerPage from "./CustomerPage";
import Navigation from "./Navigation";
import { API } from "../config/api";
import "../index.css";

function App() {
  // Load cart from localStorage on mount
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("pos_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });
  const [products, setProducts] = useState([]); // State for fetched products

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  // Function to clear the cart (useful for checkout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("pos_cart");
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await API.getProducts();
        setProducts(data);
      } catch (error) {
        // Error handling - products can be fetched without auth
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run once on component mount

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} onClearCart={clearCart} />}
          />
          <Route
            path="/new-order"
            element={<UserOrderPage cart={cart} setCart={setCart} />}
          />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/customers" element={<CustomerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
