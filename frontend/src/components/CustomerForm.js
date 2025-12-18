// /frontend/src/components/CustomerForm.js
import React, { useState, useEffect } from "react";
import { API } from "../config/api";

const CustomerForm = ({ customerToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (customerToEdit) {
      setFormData({
        first_name: customerToEdit.first_name || "",
        last_name: customerToEdit.last_name || "",
        email: customerToEdit.email || "",
        phone_number: customerToEdit.phone_number || "",
        address_line_1: customerToEdit.address_line_1 || "",
        address_line_2: customerToEdit.address_line_2 || "",
        city: customerToEdit.city || "",
        state: customerToEdit.state || "",
        postal_code: customerToEdit.postal_code || "",
        country: customerToEdit.country || "",
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
    }
  }, [customerToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (customerToEdit) {
        await API.updateCustomer(customerToEdit.customer_id, formData);
        setSuccess("Customer updated successfully!");
      } else {
        await API.addCustomer(formData);
        setSuccess("Customer added successfully!");
      }
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      
      onSave(); // Refresh the customer list
      
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.message || "Failed to save customer. Please try again.");
    }
  };

  return (
    <div className="customer-form-container">
      <div className="card">
        <h2>{customerToEdit ? "Edit Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="address_line_1">Address Line 1</label>
            <input
              type="text"
              id="address_line_1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="address_line_2">Address Line 2</label>
            <input
              type="text"
              id="address_line_2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div>
              <label htmlFor="postal_code">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="btn-primary">
            {customerToEdit ? "Update Customer" : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
