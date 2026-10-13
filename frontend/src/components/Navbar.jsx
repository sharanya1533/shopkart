import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();

  const totalItems = (cartItems || []).reduce(
    (total, item) => total + (item && item.product ? item.quantity : 0),
    0
  );

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/customers/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      window.location.href = "/login";
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">
        ShopKart
      </Link>

      <div className="navbar-links">
        <Link to="/home">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/wishlist">Wishlist</Link>

        <Link to="/orders">My Orders</Link>

        <Link to="/cart" className="cart-nav-link">
          🛒 Cart
          {totalItems > 0 && (
            <span className="cart-count">
              {totalItems}
            </span>
          )}
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;