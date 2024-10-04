// frontend/src/components/CartList.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartList.css";

const CartList = ({ products, cart, setCart }) => {
  const navigate = useNavigate();

  // Add to Cart
  const addToCart = (product) => {
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

  // Remove from Cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  // Update Quantity
  const updateQuantity = (productId, quantity) => {
    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(quantity, 1) } // Ensure quantity is at least 1
          : item
      )
    );
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      if (response.ok) {
        alert("Order processed successfully!");
        setCart([]); // Clear the cart after successful checkout
        navigate("/checkout");
      } else {
        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error("Failed to parse error response as JSON:", err);
          alert("An unexpected error occurred.");
          return;
        }
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
    }
  };

  return (
    <div className="cart-list">
      <h2>Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-item">
            <h3>{product.name}</h3>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.product_id}>
                <span>{item.name}</span>
                <div className="cart-controls">
                  <button onClick={() => removeFromCart(item.product_id)}>
                    Remove
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
                  />
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <>
            <p className="cart-total">
              Total: $
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
            <button onClick={handleCheckout}>Checkout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartList;
