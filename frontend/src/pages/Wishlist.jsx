import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wishlist() {
const [wishlist, setWishlist] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const getWishlist = async () => {
try {
setLoading(true);
setError("");

  const response = await axios.get(
    "http://localhost:5000/wishlist",
    {
      withCredentials: true,
    }
  );

  setWishlist(response.data.wishlist);
} catch (error) {
  setError("Failed to load wishlist");
} finally {
  setLoading(false);
}

};

useEffect(() => {
getWishlist();
}, []);

const handleRemove = async (productId) => {
try {
await axios.delete(
`http://localhost:5000/wishlist/${productId}`,
{
withCredentials: true,
}
);

  setWishlist((currentWishlist) =>
    currentWishlist.filter(
      (product) => product._id !== productId
    )
  );
} catch (error) {
  setError("Failed to remove product");
}

};

return (
<> <Navbar />

```
  <main className="wishlist-page">
    <div className="wishlist-header">
      <div>
        <p className="wishlist-eyebrow">YOUR SAVED ITEMS</p>

        <h1>My Wishlist</h1>

        <p className="wishlist-subtitle">
          Products you've saved for later.
        </p>
      </div>

      {!loading && !error && wishlist.length > 0 && (
        <div className="wishlist-count">
          {wishlist.length}{" "}
          {wishlist.length === 1 ? "item" : "items"}
        </div>
      )}
    </div>

    {loading && (
      <div className="wishlist-state">
        <h2>Loading your wishlist...</h2>
        <p>Please wait a moment.</p>
      </div>
    )}

    {error && (
      <div className="wishlist-state wishlist-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>

        <button
          className="wishlist-retry-btn"
          onClick={getWishlist}
        >
          Try Again
        </button>
      </div>
    )}

    {!loading && !error && wishlist.length === 0 && (
      <div className="wishlist-empty">
        <div className="wishlist-empty-icon">♡</div>

        <h2>Your wishlist is empty</h2>

        <p>
          Save products you love and come back to them later.
        </p>

        <Link
          to="/products"
          className="browse-products-btn"
        >
          Browse Products
        </Link>
      </div>
    )}

    {!loading && !error && wishlist.length > 0 && (
      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <article
            className="wishlist-card"
            key={product._id}
          >
            <div className="wishlist-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="wishlist-image"
              />

              <span className="wishlist-heart">
                ♥
              </span>
            </div>

            <div className="wishlist-card-content">
              <p className="wishlist-card-category">
                {product.category}
              </p>

              <h2>{product.name}</h2>

              <p className="wishlist-description">
                {product.description}
              </p>

              <div className="wishlist-card-info">
                <span className="wishlist-price">
                  ₹{product.price}
                </span>

                <span
                  className={
                    product.stock > 0
                      ? "wishlist-stock available"
                      : "wishlist-stock unavailable"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </span>
              </div>

              <div className="wishlist-actions">
                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-view-btn"
                >
                  View Product
                </Link>

                <button
                  className="wishlist-remove-btn"
                  onClick={() =>
                    handleRemove(product._id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </main>
</>

);
}

export default Wishlist;
