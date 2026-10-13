# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It allows customers to browse products, search and filter the catalog, manage a shopping cart and wishlist, make test payments using Razorpay, and view their orders.

## Features

- Customer registration and login
- Password hashing using bcrypt
- JWT-based authentication with HttpOnly cookies
- Protected customer and order routes
- Dynamic product catalog with search and category filtering
- Individual product details pages
- Add and remove wishlist items
- Shopping cart management and quantity updates
- Checkout with Razorpay test-mode integration
- Payment signature verification on the backend
- Order creation and order history
- MongoDB database integration
- Loading, error, and empty states in the frontend


## Technology Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- cookie-parser
- CORS
- Razorpay SDK

**Database and Payments**
- MongoDB Atlas or a local MongoDB instance
- Razorpay Test Mode

## Project Structure

```text
shopkart-project/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── index.html
├── index.js
├── package.json
├── seed.js
├── .env.example
├── .gitignore
└── README.md
```

The exact structure may vary slightly depending on the final repository contents.

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB server
- Razorpay account for test-mode payments
- Git (optional, for cloning the repository)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sharanya1533/shopkart.git
cd shopkart
```

### 2. Install backend dependencies

From the project root:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Add the following variables using your own credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Use the variable names expected by the application. Never commit your actual `.env` file or expose your database password, JWT secret, or Razorpay Key Secret.

For MongoDB Atlas, ensure your database user and network access settings permit the application to connect.

### 4. Install frontend dependencies

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend

From the project root:

```bash
npm run dev
```

If the development script is unavailable, use:

```bash
node index.js
```

The backend is expected to run at:

`https://shopkart-ce9s.onrender.com`

### Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Vite typically serves the frontend at:

`http://localhost:5173`

Open the URL printed by Vite in your browser.

## Database Setup

ShopKart uses MongoDB to store customer, product, wishlist, cart, and order information.

Configure `MONGO_URI` with a valid database connection string before starting the backend.

The optional `seed.js` script can be used to insert sample products if the database needs initial catalog data. Run it from the project root only after configuring the environment variables:

```bash
node seed.js
```

**Note:** The seed script uses `insertMany()`. Running it repeatedly may create duplicate products. Check the database before rerunning it.

## Payment Testing

ShopKart integrates Razorpay for test-mode payments.

- Configure the Razorpay test credentials in the backend `.env` file.
- Use Razorpay's official test-mode instructions and test credentials.
- Never use live payment credentials in a public repository.
- A successful checkout should be confirmed by backend payment verification before the order is marked as paid.

Actual payment behavior depends on the configured Razorpay account and environment.

## Security Notes

- Passwords are hashed before being stored.
- Authentication uses JWTs stored in HttpOnly cookies.
- Protected backend routes verify the authenticated customer.
- The backend validates product prices, quantities, stock, and order details.
- Payment signatures are verified on the backend.
- Environment files and credentials must not be committed to GitHub.

## Troubleshooting

**MongoDB connection fails**
- Verify `MONGO_URI`.
- Check MongoDB Atlas network access and database credentials.
- Confirm that the database service is available.

**Frontend cannot access the backend**
- Ensure the backend is running on port 5000.
- Confirm that CORS allows the frontend origin.
- Check that Axios sends credentials for protected requests when required.

**Login or protected routes fail**
- Verify that the JWT cookie is configured correctly.
- Check the backend authentication middleware.
- Ensure frontend requests use `withCredentials: true` where required.

**Razorpay payment fails**
- Verify the test Key ID and Key Secret.
- Check the backend terminal for errors.
- Confirm that payment verification is configured correctly.

## Future Improvements

- Deploy the frontend and backend
- Add automated tests
- Improve product administration
- Add pagination and additional product filters

## Author

Developed as a full-stack engineering lab project.