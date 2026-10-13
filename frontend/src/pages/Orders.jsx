import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://shopkart-ce9s.onrender.com/orders",
        {
          withCredentials: true,
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-state">
            <h2>Loading your orders...</h2>
            <p>Please wait a moment.</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-state orders-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>

            <button
              className="orders-retry-btn"
              onClick={fetchOrders}
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />

        <main className="orders-page">
          <div className="orders-state">
            <div className="orders-empty-icon">📦</div>

            <h1>No orders yet</h1>

            <p>
              Your placed orders will appear here.
            </p>

            <Link
              to="/products"
              className="browse-products-btn"
            >
              Start Shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-header">
          <p className="orders-eyebrow">
            YOUR SHOPPING HISTORY
          </p>

          <h1>My Orders</h1>

          <p className="orders-subtitle">
            View all your orders and their details.
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <article
              className="order-card"
              key={order._id}
            >
              <div className="order-card-header">
                <div>
                  <p className="order-label">
                    ORDER ID
                  </p>

                  <strong>{order._id}</strong>
                </div>

                <div className="order-status">
                  {order.status}
                </div>
              </div>

              <div className="order-card-content">
                <div className="order-items-preview">
                  {order.items.map((item) => (
                    <div
                      className="order-item-preview"
                      key={item._id}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div>
                        <h3>{item.name}</h3>

                        <p>
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-summary">
                  <div>
                    <span>Items</span>
                    <strong>
                      {order.items.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.paymentStatus}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      ₹{order.totalAmount}
                    </strong>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="view-order-btn"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export default Orders;