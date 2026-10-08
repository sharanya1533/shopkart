import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Checkout() {
    const navigate = useNavigate();
    const {
  cartItems,
  cartLoading,
  clearCart,
} = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentOrder, setPaymentOrder] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      if (!value.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (
      formData.phone.trim() &&
      !/^\d{10}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (
      formData.pincode.trim() &&
      !/^\d{6}$/.test(formData.pincode.trim())
    ) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        "http://localhost:5000/orders/create-payment-order",
        formData,
        {
          withCredentials: true,
        }
      );

      setPaymentOrder(response.data);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Failed to create payment order"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = () => {
    if (!paymentOrder) {
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay is still loading. Please try again.");
      return;
    }

    const options = {
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: "ShopKart",
      description: "ShopKart Order",
      order_id: paymentOrder.razorpayOrderId,

      handler: async function (response) {
  try {
    const verifyResponse = await axios.post(
      "http://localhost:5000/orders/verify-payment",
      {
        orderId: paymentOrder.orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      },
      {
        withCredentials: true,
      }
    );
if (verifyResponse.data.success) {
  clearCart();

  navigate("/order-success", {
    state: {
      orderId: verifyResponse.data.orderId,
    },
  });
}
} catch (error) {
    alert(
      error.response?.data?.message ||
        "Payment verification failed"
    );
  }
},

      prefill: {
        name: formData.fullName,
        contact: formData.phone,
      },

      theme: {
        color: "#e47722",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  if (cartLoading) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <div className="checkout-state">
            <h2>Loading checkout...</h2>
            <p>Please wait a moment.</p>
          </div>
        </main>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <div className="checkout-state">
            <h1>Your cart is empty</h1>

            <p>
              Add some products before proceeding to
              checkout.
            </p>

            <Link
              to="/products"
              className="browse-products-btn"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-header">
          <p className="checkout-eyebrow">
            SECURE CHECKOUT
          </p>

          <h1>Checkout</h1>

          <p className="checkout-subtitle">
            Enter your shipping details to continue.
          </p>
        </div>

        {paymentOrder ? (
          <div className="checkout-review-card">
            <h2>Review Your Order</h2>

            <p>
              Shipping details saved successfully.
            </p>

            <div className="checkout-review-address">
              <h3>Shipping Address</h3>

              <p>{formData.fullName}</p>

              <p>{formData.phone}</p>

              <p>{formData.addressLine1}</p>

              <p>
                {formData.city}, {formData.state} -{" "}
                {formData.pincode}
              </p>
            </div>

            <div className="checkout-review-total">
              <span>Total Amount</span>

              <strong>
                ₹{paymentOrder.totalAmount}
              </strong>
            </div>

            <button
              className="checkout-continue-btn"
              onClick={handlePayment}
            >
              Pay ₹{paymentOrder.amount / 100}
            </button>
          </div>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-form-card">
              <h2>Shipping Information</h2>

              {submitError && (
                <div className="checkout-submit-error">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="checkout-form-grid">
                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="fullName">
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                    {errors.fullName && (
                      <p className="checkout-field-error">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                    />

                    {errors.phone && (
                      <p className="checkout-field-error">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="pincode">
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                    />

                    {errors.pincode && (
                      <p className="checkout-field-error">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  <div className="checkout-field checkout-field-full">
                    <label htmlFor="addressLine1">
                      Address
                    </label>

                    <input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="House number, street, area"
                    />

                    {errors.addressLine1 && (
                      <p className="checkout-field-error">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />

                    {errors.city && (
                      <p className="checkout-field-error">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="state">
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />

                    {errors.state && (
                      <p className="checkout-field-error">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="checkout-continue-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Creating Payment..."
                    : "Continue to Payment"}
                </button>
              </form>
            </section>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="checkout-summary-divider"></div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="checkout-summary-items">
                {cartItems.map((item) => (
                  <div
                    className="checkout-summary-item"
                    key={item.product._id}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                    />

                    <div>
                      <p>{item.product.name}</p>

                      <span>
                        {item.quantity} × ₹
                        {item.product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Checkout;