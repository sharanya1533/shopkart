import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://shopkart-ce9s.onrender.com/orders/${id}`,
        {
          withCredentials: true,
        }
      );

      setOrder(response.data.order);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="order-details-page">
          <div className="order-details-state">
            <h2>Loading order...</h2>
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

        <main className="order-details-page">
          <div className="order-details-state order-details-error">
            <h2>Unable to load order</h2>
            <p>{error}</p>

            <button
              className="orders-retry-btn"
              onClick={fetchOrder}
            >
              Try Again
            </button>

            <Link
              to="/orders"
              className="back-to-orders-btn"
            >
              Back to My Orders
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="order-details-page">
        <div className="order-details-header">
          <Link
            to="/orders"
            className="back-to-orders-link"
          >
            ← Back to My Orders
          </Link>

          <p className="order-details-eyebrow">
            ORDER DETAILS
          </p>

          <h1>Your Order</h1>

          <p className="order-details-id">
            Order ID: <strong>{order._id}</strong>
          </p>
        </div>

        <div className="order-details-layout">
          <section className="order-details-card">
            <div className="order-details-card-header">
              <h2>Items</h2>

              <span className="order-detail-status">
                {order.status}
              </span>
            </div>

            <div className="order-detail-items">
              {(order.items || []).map((item) => (
                <div
                  className="order-detail-item"
                  key={item._id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="order-detail-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-detail-total">
              <span>Total Amount</span>

              <strong>
                ₹{order.totalAmount}
              </strong>
            </div>
          </section>

          <aside className="order-details-sidebar">
            <div className="order-details-card">
              <h2>Payment</h2>

              <div className="order-info-row">
                <span>Status</span>
                <strong>
                  {order.paymentStatus}
                </strong>
              </div>

              {order.razorpayPaymentId && (
                <div className="order-info-row">
                  <span>Payment ID</span>
                  <strong>
                    {order.razorpayPaymentId}
                  </strong>
                </div>
              )}
            </div>

            <div className="order-details-card">
              <h2>Shipping Address</h2>

              <div className="shipping-address">
                <p>
                  <strong>
                    {order.shippingAddress.fullName}
                  </strong>
                </p>

                <p>
                  {order.shippingAddress.phone}
                </p>

                <p>
                  {order.shippingAddress.addressLine1}
                </p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default OrderDetails;