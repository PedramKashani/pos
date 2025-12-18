// Navigation Component
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="nav-header">
      <h1>POS System</h1>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/new-order">New Order</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/customers">Customers</Link>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
