// frontend/src/components/UserOrderPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserOrderPage.css";
import { API } from "../config/api";

const UserOrderPage = ({ cart, setCart }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Decode JWT token to get logged-in user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT token (without verification - just for display)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        setLoggedInUser(decoded);
      } catch (error) {
        // Token decode failed - user will need to login again
        // Silently fail to avoid disrupting user experience
      }
    }
  }, []);

  // Fetch customers and products when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await API.getCustomers();
        setCustomers(data);
      } catch (error) {
        // Error handling - customers require auth
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await API.getProducts();
        setProducts(data);
      } catch (error) {
        // Error handling
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  // Add product to cart
  const addProductToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.product_id === product.product_id
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  // Update product quantity in the cart
  const updateQuantity = (productId, quantity) => {
    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      )
    );
  };

  // Handle submitting the order
  const handleOrderSubmit = () => {
    if (!selectedCustomer) {
      setError("Please select a customer for this order.");
      return;
    }

    if (!cart || cart.length === 0) {
      setError("Please add products to the cart before submitting.");
      return;
    }

    // Store selected customer in localStorage for checkout
    localStorage.setItem("selected_customer_id", selectedCustomer);

    // Clear any previous errors and set success message
    setError("");
    setSuccess("Order created successfully! Redirecting to checkout...");

    // Navigate to the checkout page after a short delay
    setTimeout(() => {
      setSuccess(""); // Clear success message before navigating
      navigate("/checkout");
    }, 500);
  };

  return (
    <div className="user-order-page">
      <h2>New Order</h2>

      {/* Logged-in User Display */}
      {loggedInUser && (
        <div className="logged-in-user-info">
          <span className="user-label">Logged in as:</span>
          <span className="user-name">{loggedInUser.username}</span>
          <span className="user-role">({loggedInUser.role})</span>
        </div>
      )}

      {/* Customer Selection */}
      <div className="customer-selection">
        <label htmlFor="customer-select">Select Customer:</label>
        <select
          id="customer-select"
          value={selectedCustomer || ""}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="" disabled>
            Choose a customer
          </option>
          {customers.map((customer) => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.first_name} {customer.last_name}{" "}
              {customer.email ? `(${customer.email})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Main Content: Products and Cart Side by Side */}
      <div className="order-layout">
        {/* Products Section */}
        <div className="products-section">
          <h3>Products</h3>
          <div className="product-list">
            {products.length === 0 ? (
              <p>No products available.</p>
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="product-item">
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    {product.description && (
                      <p className="product-description">
                        {product.description}
                      </p>
                    )}
                    {product.category && (
                      <span className="product-category">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="product-price-section">
                    <span className="product-price">
                      $
                      {!isNaN(product.price)
                        ? Number(product.price).toFixed(2)
                        : "N/A"}
                    </span>
                    <button
                      onClick={() => addProductToCart(product)}
                      className="btn-add-to-cart"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Section - Sticky Sidebar */}
        <div className="cart-section">
          <div className="order-summary">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <p className="empty-cart-hint">Add products from the list</p>
              </div>
            ) : (
              <>
                <ul className="cart-items">
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="cart-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                          className="btn-quantity"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product_id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="quantity-input"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="btn-quantity"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">
                      $
                      {cart
                        .reduce(
                          (total, item) =>
                            total + Number(item.price) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleOrderSubmit}
                    className="btn-submit-order"
                    disabled={!selectedCustomer || cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderPage;
