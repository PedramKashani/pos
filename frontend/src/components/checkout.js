// frontend/src/components/Checkout.js
import React, { useState } from "react";
import "./Checkout.css";

const Checkout = ({ cart, onClearCart }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change for payment details
  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Mock payment processing
  const handleCheckout = (e) => {
    e.preventDefault();
    setError(""); // Clear any existing errors

    // Basic validation for payment fields (you can expand this as needed)
    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.cardHolder ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvv
    ) {
      setError("All payment fields are required.");
      return;
    }

    // Mocking payment processing
    setTimeout(() => {
      setSuccess("Payment processed successfully!");
      onClearCart(); // Clear the cart after a successful checkout
    }, 1000);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${item.price.toFixed(2)} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>
            Total: $
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>

          <form onSubmit={handleCheckout}>
            <h3>Payment Details</h3>
            <div>
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cardHolder">Card Holder Name:</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={paymentDetails.cardHolder}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit">Process Payment</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
