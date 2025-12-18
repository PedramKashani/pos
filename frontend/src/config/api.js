// API Configuration
// process.env.REACT_APP_API_URL is injected by webpack DefinePlugin at build time
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make authenticated API requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      if (process.env.NODE_ENV !== "production") {
        console.error("Non-JSON response:", text.substring(0, 200));
      }
      throw new Error(
        "Server returned non-JSON response. Please check the server logs."
      );
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error) {
    // Log errors in development only
    if (process.env.NODE_ENV !== "production") {
      console.error("API request error:", error);
    }
    throw error;
  }
};

// API endpoints
export const API = {
  // Auth endpoints
  login: (credentials) =>
    apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Product endpoints
  getProducts: () => apiRequest("/products"),

  addProduct: (productData) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  updateProduct: (productId, productData) =>
    apiRequest(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (productId) =>
    apiRequest(`/products/${productId}`, {
      method: "DELETE",
    }),

  // Transaction endpoints
  getTransactions: () => apiRequest("/transactions"),

  checkout: (checkoutData) =>
    apiRequest("/transactions/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    }),

  // Customer endpoints
  getCustomers: () => apiRequest("/customers"),

  addCustomer: (customerData) =>
    apiRequest("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    }),

  updateCustomer: (customerId, customerData) =>
    apiRequest(`/customers/${customerId}`, {
      method: "PUT",
      body: JSON.stringify(customerData),
    }),

  // User endpoints
  getUsers: () => apiRequest("/users"),
};

export default API;
