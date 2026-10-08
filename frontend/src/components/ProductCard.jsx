import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const [wishlistStatus, setWishlistStatus] = useState("default");
  const [cartStatus, setCartStatus] = useState("default");

  const { addToCart, cartActionLoading } = useCart();

  const handleWishlist = async () => {
    try {
      setWishlistStatus("saving");

      await axios.post(
        `http://localhost:5000/wishlist/${product._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setWishlistStatus("success");
    } catch (error) {
      setWishlistStatus("error");
    }
  };

  const handleAddToCart = async () => {
  setCartStatus("adding");

  const result = await addToCart(product._id);

  if (result.success) {
    setCartStatus("success");
  } else {
    setCartStatus("error");
    alert(result.message);
  }
};

  const isCartLoading = cartActionLoading[product._id];

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-card-content">
        <h2>{product.name}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <p className="product-price">
          ₹{product.price}
        </p>

        <p className="product-category">
          {product.category}
        </p>

        <p className="product-stock">
          {product.stock > 0
            ? `${product.stock} available`
            : "Out of stock"}
        </p>

        <Link
          to={`/products/${product._id}`}
          className="view-product-btn"
        >
          View Product
        </Link>

        <button
  className="cart-btn"
  onClick={handleAddToCart}
  disabled={isCartLoading || product.stock === 0}
>
  {cartStatus === "adding" && "Adding..."}
  {cartStatus === "success" && "✓ Added — Add Another"}
  {cartStatus === "error" && "Try Again"}
  {cartStatus === "default" && "🛒 Add to Cart"}
</button>

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          disabled={
            wishlistStatus === "saving" ||
            wishlistStatus === "success"
          }
        >
          {wishlistStatus === "default" && "♡ Add to Wishlist"}
          {wishlistStatus === "saving" && "Saving..."}
          {wishlistStatus === "success" && "♥ Added to Wishlist"}
          {wishlistStatus === "error" && "♡ Try Again"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;