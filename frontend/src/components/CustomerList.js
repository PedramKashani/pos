// /frontend/src/components/CustomerList.js
import React, { useEffect, useState } from "react";
import { API } from "../config/api";

const CustomerList = ({ onEdit }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await API.getCustomers();
      setCustomers(data);
    } catch (error) {
      // Error fetching customers - will show empty state
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching customers:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-list-container">
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="card">
        <h2>Customer List</h2>
        {customers.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            No customers found. Add your first customer above.
          </p>
        ) : (
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone_number || "N/A"}</td>
                    <td>{customer.city || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => onEdit(customer)}
                        className="btn-secondary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
