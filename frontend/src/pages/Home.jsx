import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Navbar from "../components/Navbar";

function Home() {
const [customer, setCustomer] = useState(null);

useEffect(() => {
const getProfile = async () => {
try {
const response = await axios.get(
"http://localhost:5000/customers/me",
{
withCredentials: true,
}
);

    setCustomer(response.data.customer);
  } catch (error) {
    alert(error.response?.data?.message || "Please login first");
    window.location.href = "/login";
  }
};

getProfile();

}, []);

if (!customer) {
return ( <div className="home-loading"> <div className="loading-spinner"></div> <p>Loading ShopKart...</p> </div>
);
}

return ( <div className="home-page"> <Navbar />

  <main className="home-content">

    {/* Hero Section */}
    <section className="home-hero">
      <div className="hero-content">
        <p className="hero-eyebrow">
          WELCOME TO SHOPKART
        </p>

        <h1>
          Hello, {customer.fullName ? customer.fullName.split(" ")[0] : "Customer"}!
        </h1>

        <p className="hero-description">
          Discover products you'll love, save your favourites,
          and shop everything you need in one place.
        </p>

        <div className="hero-actions">
          <a
            href="/products"
            className="hero-primary-btn"
          >
            Explore Products
          </a>

          <a
            href="/wishlist"
            className="hero-secondary-btn"
          >
            View Wishlist
          </a>
        </div>
      </div>

      <div className="hero-decoration">
        <div className="hero-circle hero-circle-one"></div>
        <div className="hero-circle hero-circle-two"></div>

        <div className="hero-shopping-card">
          <span className="hero-card-icon">🛍</span>
          <span>Shop Smart</span>
        </div>
      </div>
    </section>

    {/* Quick Actions */}
    <section className="quick-actions">
      <div className="section-heading">
        <p>QUICK ACCESS</p>
        <h2>What would you like to do?</h2>
      </div>

      <div className="quick-action-grid">
        <a
          href="/products"
          className="quick-action-card"
        >
          <div className="quick-action-icon products-icon">
            🛒
          </div>

          <div>
            <h3>Browse Products</h3>
            <p>
              Explore our collection and find something you love.
            </p>
          </div>

          <span className="action-arrow">→</span>
        </a>

        <a
          href="/wishlist"
          className="quick-action-card"
        >
          <div className="quick-action-icon wishlist-icon">
            ♡
          </div>

          <div>
            <h3>My Wishlist</h3>
            <p>
              View the products you've saved for later.
            </p>
          </div>

          <span className="action-arrow">→</span>
        </a>
      </div>
    </section>

    {/* Profile Section */}
    <section className="profile-section">
      <div className="section-heading">
        <p>ACCOUNT</p>
        <h2>Your Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar">
            {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h3>{customer.fullName}</h3>
            <p>ShopKart Customer</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-detail-label">
              Full Name
            </span>

            <span className="profile-detail-value">
              {customer.fullName}
            </span>
          </div>

          <div className="profile-detail">
            <span className="profile-detail-label">
              Email
            </span>

            <span className="profile-detail-value">
              {customer.email}
            </span>
          </div>

          <div className="profile-detail">
            <span className="profile-detail-label">
              Phone
            </span>

            <span className="profile-detail-value">
              {customer.phone}
            </span>
          </div>
        </div>
      </div>
    </section>

  </main>
</div>

);
}

export default Home;
