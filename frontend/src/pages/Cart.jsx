import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartLoading,
    cartError,
    fetchCart,
    updateQuantity,
    removeFromCart,
    cartActionLoading,
  } = useCart();

  if (cartLoading) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
          <div className="cart-state">
            <h2>Loading your cart...</h2>
            <p>Please wait a moment.</p>
          </div>
        </main>
      </>
    );
  }

  if (cartError) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
          <div className="cart-state cart-error">
            <h2>Something went wrong</h2>
            <p>{cartError}</p>

            <button
              className="cart-retry-btn"
              onClick={fetchCart}
            >
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>

            <h1>Your cart is empty</h1>

            <p>
              Add some products to your cart and they will
              appear here.
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

      <main className="cart-page">
        <div className="cart-header">
          <div>
            <p className="cart-eyebrow">YOUR SHOPPING CART</p>

            <h1>My Cart</h1>

            <p className="cart-subtitle">
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product;
              const isLoading =
                cartActionLoading[product._id];

              return (
                <article
                  className="cart-card"
                  key={product._id}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-image"
                  />

                  <div className="cart-card-content">
                    <p className="cart-category">
                      {product.category}
                    </p>

                    <h2>{product.name}</h2>

                    <p className="cart-description">
                      {product.description}
                    </p>

                    <p className="cart-price">
                      ₹{product.price}
                    </p>
                    <p className="cart-stock">
  {product.stock > 0
    ? `${product.stock} available`
    : "Out of stock"}
</p>

                    <div className="cart-controls">
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            isLoading || item.quantity === 1
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            isLoading ||
                            item.quantity >= product.stock
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() =>
                          removeFromCart(product._id)
                        }
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </div>

                    <p className="cart-item-total">
                      ₹{product.price * item.quantity}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <Link
  to="/checkout"
  className="checkout-btn"
>
  Proceed to Checkout
</Link>
          </aside>
        </div>
      </main>
    </>
  );
}

export default Cart;