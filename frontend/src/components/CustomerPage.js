// /frontend/src/components/CustomerPage.js
import React, { useState } from "react";
import CustomerList from "./CustomerList";
import CustomerForm from "./CustomerForm";
import "./CustomerPage.css";

const CustomerPage = () => {
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (customer) => {
    setCustomerToEdit(customer);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    setRefresh(!refresh); // Trigger a refresh in CustomerList
    setCustomerToEdit(null); // Clear the form
  };

  return (
    <div className="customer-page">
      <div className="page-container">
        <h1>Customer Management</h1>
        <CustomerForm customerToEdit={customerToEdit} onSave={handleSave} />
        <CustomerList onEdit={handleEdit} key={refresh} />
      </div>
    </div>
  );
};

export default CustomerPage;
