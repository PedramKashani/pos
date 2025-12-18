# POS System

A Point of Sale (POS) system built with Node.js/Express backend and React frontend. This system handles user authentication, product management, inventory tracking, customer management, and transaction processing.

## Features

- **User Authentication**: JWT-based authentication with role-based access (cashier, manager, admin)
- **Product Management**: Create, read, update, and delete products with inventory tracking
- **Inventory Management**: Real-time inventory updates with transaction support
- **Customer Management**: Store and manage customer information
- **Transaction Processing**: Secure checkout with inventory validation
- **Responsive UI**: Modern React interface with routing

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcrypt (password hashing)

### Frontend

- React
- React Router
- Webpack
- Babel

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Complete Setup Guide (Step-by-Step)

Follow these steps in order to set up the project from scratch.

### Step 1: Install Dependencies

**Location:** Root folder (`/pos`)

```bash
npm install
```

This installs all required packages for both frontend and backend.

---

### Step 2: Set Up Supabase Database

#### 2.1 Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "pos-system")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be created

#### 2.2 Get Your Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. **Save this connection string** - you'll need it in Step 3

---

### Step 3: Create Environment Variables File

**Location:** Root folder (`/pos`)

1. Create a file named `.env` in the root directory
2. Add the following content:

```env
# Database Configuration (Supabase Connection String)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# JWT Secret Key (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=3000

# Frontend API URL
REACT_APP_API_URL=http://localhost:3000
```

**Important:**

- Replace `YOUR_PASSWORD` and the rest of the connection string with your actual Supabase connection string from Step 2.2
- Generate a secure JWT_SECRET by running:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Copy the output and replace `your_super_secret_jwt_key_change_this_in_production` with it

---

### Step 4: Create Database Tables

**Location:** Supabase Dashboard → SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `setup.sql` from your project root
5. Copy **ALL** the contents of `setup.sql`
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
8. You should see "Success. No rows returned"

**Verify tables were created:**

- In Supabase, go to **Table Editor**
- Look for a schema dropdown (usually shows "public")
- Change it to **`myschema`**
- You should see 6 tables: `users`, `products`, `inventory`, `transactions`, `transaction_items`, `customers`

---

### Step 5: Add Test Data (Optional but Recommended)

**Location:** Supabase Dashboard → SQL Editor

1. Go to **SQL Editor** in Supabase
2. Click **New query**
3. Open the file `seed_data.sql` from your project root
4. Copy **ALL** the contents of `seed_data.sql`
5. Paste into the Supabase SQL Editor
6. Click **Run**
7. You should see "Success" messages

**Test Data Includes:**

- **3 Users**: `admin`, `manager1`, `cashier1` (all passwords: `password123`)
- **10 Products**: Laptop, Mouse, Keyboard, Monitor, etc.
- **Inventory**: Stock quantities for all products
- **5 Customers**: Sample customer records

---

### Step 6: Start the Application

You need **TWO terminal windows** - both in the **root folder** (`/pos`).

#### Terminal 1: Backend Server

**Location:** Root folder (`/pos`)

```bash
npm run dev
```

**Expected output:**

```
Database connected successfully
Server running on port 3000
```

**Keep this terminal open!** The backend must be running.

#### Terminal 2: Frontend Development Server

**Location:** Root folder (`/pos`) - **Same folder as Terminal 1**

```bash
npm start
```

**Expected output:**

```
webpack compiled successfully
```

Your browser should automatically open to **http://localhost:8080**

---

### Step 7: Test the Application

1. **Frontend**: Should open automatically at http://localhost:8080
2. **Login**:
   - Click "Register" to create a new user, OR
   - Use test credentials: `admin` / `password123`
3. **Navigate**: After login, you should see the orders page
4. **Add Products**: Products from seed data should be visible
5. **Test Checkout**: Add items to cart and process a checkout

---

## Quick Reference: Starting the App

**Every time you want to run the project:**

1. **Terminal 1** (Backend):

   ```bash
   cd /path/to/pos
   npm run dev
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd /path/to/pos
   npm start
   ```

**Both commands run from the same root folder!**

---

## Troubleshooting Setup

### "Database connected successfully" not showing

- Check your `.env` file has the correct `DATABASE_URL`
- Verify your Supabase project is active (not paused)
- Make sure you replaced `[YOUR-PASSWORD]` in the connection string

### Tables not showing in Supabase

- Make sure you're looking in the **`myschema`** schema (not `public`)
- Verify `setup.sql` ran successfully (check for errors in SQL Editor)

### Frontend shows "process is not defined" error

- Make sure you restarted `npm start` after creating `.env`
- Check that `webpack.config.js` includes the DefinePlugin (should be there by default)

### Port already in use

- Backend (port 3000): Change `PORT` in `.env` to a different number
- Frontend (port 8080): Webpack will suggest an alternative port automatically

## Running the Application

### Development Mode (Recommended)

**You need TWO terminal windows:**

**Terminal 1 - Backend:**

```bash
npm run dev
```

Starts Express server on port 3000

**Terminal 2 - Frontend:**

```bash
npm start
```

Starts webpack dev server on port 8080 (opens browser automatically)

### Production Mode

Build the frontend:

```bash
npm run build
```

Start the server:

```bash
npm run dev
# or
node server.js
```

The application will be available at:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

---

## API Endpoints

### Authentication

- `POST /users/register` - Register a new user
- `POST /users/login` - Login and receive JWT token
- `GET /users` - Get all users (requires authentication)

### Products

- `GET /products` - Get all products (public)
- `POST /products` - Add a new product (requires authentication)
- `PUT /products/:product_id` - Update a product (requires authentication)
- `DELETE /products/:product_id` - Delete a product (requires authentication)

### Transactions

- `POST /transactions/checkout` - Process a checkout (requires authentication)

### Customers

- `GET /customers` - Get all customers (requires authentication)
- `POST /customers` - Add a new customer (requires authentication)
- `PUT /customers/:id` - Update a customer (requires authentication)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through the login endpoint and stored in localStorage on the frontend.

## Project Structure

```
pos/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Request handlers
│   ├── middlewares/           # Authentication middleware
│   └── routes/                # API routes
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # React components
│       └── config/
│           └── api.js         # API configuration
├── server.js                  # Express server setup
├── setup.sql                  # Database schema (run in Supabase)
├── seed_data.sql              # Test data (run in Supabase)
└── package.json
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- SQL injection prevention with parameterized queries
- CORS configuration
- Input validation

## Development Notes

- The frontend uses webpack-dev-server for development
- Backend uses Express with CORS enabled for development
- Database transactions ensure data integrity
- All protected routes require valid JWT tokens

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists and schema is created

### Authentication Errors

- Verify JWT_SECRET is set in `.env`
- Check token expiration (default: 1 hour)
- Ensure token is included in Authorization header

### Port Conflicts

- Change PORT in `.env` if 3000 is in use
- Update CORS origin in `server.js` if using different frontend port

## License

ISC

## Author

[Pedram KashaniJ]
