// frontend/src/components/OrdersList.js
import React, { useState, useEffect } from "react";
import "./OrdersList.css";
import { API } from "../config/api";

const OrdersList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await API.getTransactions();
      setTransactions(data);
    } catch (error) {
      setError(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="orders-list-container">
        <div className="card">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-list-container">
        <div className="card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list-container">
      <h2>Order History</h2>
      {transactions.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            No orders found. Create your first order!
          </p>
        </div>
      ) : (
        <div className="orders-grid">
          {transactions.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="order-card"
              onClick={() =>
                setSelectedTransaction(
                  selectedTransaction?.transaction_id === transaction.transaction_id
                    ? null
                    : transaction
                )
              }
            >
              <div className="order-header">
                <div className="order-id">
                  <span className="order-label">Order #</span>
                  <span className="order-number">{transaction.transaction_id}</span>
                </div>
                <div className="order-date">
                  {formatDate(transaction.transaction_date)}
                </div>
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">Total:</span>
                  <span className="info-value total">
                    ${Number(transaction.transaction_total).toFixed(2)}
                  </span>
                </div>
                {transaction.employee_name && (
                  <div className="info-row">
                    <span className="info-label">Employee:</span>
                    <span className="info-value">
                      {transaction.employee_name} ({transaction.employee_username})
                    </span>
                  </div>
                )}
                {transaction.customer_first_name && (
                  <div className="info-row">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">
                      {transaction.customer_first_name} {transaction.customer_last_name}
                    </span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Items:</span>
                  <span className="info-value">{transaction.items?.length || 0}</span>
                </div>
              </div>

              {selectedTransaction?.transaction_id === transaction.transaction_id && (
                <div className="order-details">
                  <h4>Order Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.items?.map((item) => (
                        <tr key={item.transaction_item_id}>
                          <td>
                            <div className="product-cell">
                              <strong>{item.product_name}</strong>
                              {item.product_description && (
                                <span className="product-desc">
                                  {item.product_description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>${Number(item.price).toFixed(2)}</td>
                          <td>
                            <strong>
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;

