import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId;

  return (
    <>
      <Navbar />

      <main className="order-success-page">
        <div className="order-success-card">
          <div className="order-success-icon">
            ✓
          </div>

          <p className="order-success-eyebrow">
            ORDER CONFIRMED
          </p>

          <h1>Thank You for Your Order!</h1>

          <p className="order-success-message">
            Your payment was successful and your order has
            been placed successfully.
          </p>

          {orderId && (
            <div className="order-success-id">
              <span>Order ID</span>
              <strong>{orderId}</strong>
            </div>
          )}

          <div className="order-success-actions">
            <Link
              to="/orders"
              className="view-orders-btn"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="continue-shopping-btn"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderSuccess;