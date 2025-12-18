// frontend/src/components/Checkout.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { API } from "../config/api";

const Checkout = ({ cart, onClearCart }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const redirectTimerRef = useRef(null);
  const checkoutCompletedRef = useRef(false);
  const navigate = useNavigate();

  // Handle input change for payment details
  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Process checkout with backend API
  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate cart is not empty FIRST (before payment validation)
    if (!cart || cart.length === 0) {
      setError("Your cart is empty. Please add items to your cart first.");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
      return;
    }

    // Basic validation for payment fields
    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.cardHolder ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvv
    ) {
      setError("All payment fields are required.");
      return;
    }

    // Get selected customer from localStorage (set in UserOrderPage)
    const selectedCustomerId = localStorage.getItem("selected_customer_id");

    // Prepare items for checkout
    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.price),
    }));

    setLoading(true);

    try {
      const result = await API.checkout({
        items,
        customer_id: selectedCustomerId ? parseInt(selectedCustomerId) : null,
      });

      // Calculate total for success message BEFORE clearing cart
      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price);
        return sum + (isNaN(price) ? 0 : price) * item.quantity;
      }, 0);

      // Store transaction data
      const txData = {
        transaction_id: result.transaction_id,
        total: total.toFixed(2),
      };

      // Set ref immediately to prevent any redirects
      checkoutCompletedRef.current = true;

      // Set state to show success message
      setCheckoutCompleted(true);
      setTransactionData(txData);
      const successMessage = `✅ Payment Processed Successfully!\n\nTransaction ID: ${
        result.transaction_id
      }\nTotal Amount: $${total.toFixed(2)}\n\nThank you for your purchase!`;
      setSuccess(successMessage);

      // Clear cart and selected customer, then redirect AFTER showing message
      redirectTimerRef.current = setTimeout(() => {
        onClearCart();
        localStorage.removeItem("selected_customer_id");
        navigate("/orders"); // Redirect to orders list to see the new order
      }, 5000); // 5 seconds to read the message
    } catch (error) {
      setError(
        error.message || "Failed to process checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cleanup redirect timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  // If cart is empty on mount (and checkout hasn't completed), redirect back to orders page
  useEffect(() => {
    // Only check on initial mount
    // CRITICAL: Don't redirect if checkout was just completed successfully
    if (
      (!cart || cart.length === 0) &&
      !checkoutCompletedRef.current &&
      !checkoutCompleted &&
      !success &&
      !loading
    ) {
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {checkoutCompletedRef.current || checkoutCompleted || success ? (
        // Show success message after checkout completes (even if cart is now empty)
        <div className="checkout-success">
          <div className="success-message">
            {success ? (
              success.split("\n").map((line, index) => (
                <p
                  key={index}
                  className={index === 0 ? "success-title" : "success-detail"}
                >
                  {line}
                </p>
              ))
            ) : transactionData ? (
              <>
                <p className="success-title">
                  ✅ Payment Processed Successfully!
                </p>
                <p className="success-detail">
                  Transaction ID: {transactionData.transaction_id}
                </p>
                <p className="success-detail">
                  Total Amount: ${transactionData.total}
                </p>
                <p className="success-detail">Thank you for your purchase!</p>
              </>
            ) : (
              <p className="success-title">
                ✅ Payment Processed Successfully!
              </p>
            )}
          </div>
          <p className="redirect-message">
            Redirecting to orders page in a few seconds...
          </p>
        </div>
      ) : !cart || cart.length === 0 ? (
        <div>
          <p className="error">
            Your cart is empty. Redirecting to orders page...
          </p>
        </div>
      ) : (
        <div>
          <ul>
            {cart.map((item) => {
              // Ensure item.price is a number
              const price = parseFloat(item.price);
              const validPrice = !isNaN(price) ? price : 0;

              return (
                <li key={item.product_id}>
                  {item.name} - {item.quantity} x ${validPrice.toFixed(2)} = $
                  {(validPrice * item.quantity).toFixed(2)}
                </li>
              );
            })}
          </ul>
          <p>
            Total: $
            {cart
              .reduce((total, item) => {
                const price = parseFloat(item.price);
                const validPrice = !isNaN(price) ? price : 0;
                return total + validPrice * item.quantity;
              }, 0)
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
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Process Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
