import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Register() {
const [formData, setFormData] = useState({
fullName: "",
email: "",
phone: "",
password: "",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

  try {
    const response = await axios.post(
      "https://shopkart-ce9s.onrender.com/customers/register",
      formData
    );

    alert(response.data.message);
    window.location.href = "/login";
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};

return ( <div className="auth-page">


  <div className="auth-brand">

    <div className="brand-logo">
      <h1>Shop<span>Kart</span></h1>
      <p>Everything you need, all in one place.</p>
    </div>

    <div className="brand-content">
      <h2>
        Shop smart.
        <br />
        Live <span>better.</span>
      </h2>

      <p>
        Create your ShopKart account and discover a simple,
        convenient way to manage your shopping experience.
      </p>
    </div>

    <div className="brand-features">
      <div className="brand-feature">
        <span>✓</span>
        Easy shopping
      </div>

      <div className="brand-feature">
        <span>✓</span>
        Secure account
      </div>

      <div className="brand-feature">
        <span>✓</span>
        Trusted service
      </div>
    </div>

  </div>


  <div className="auth-form-section">

    <div className="auth-card">

      <h2>Create your account</h2>

      <p className="auth-subtitle">
        Join ShopKart and get started today.
      </p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>


        <button type="submit" className="primary-btn">
          Create Account
        </button>

      </form>


      <div className="auth-footer">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </div>

    </div>

  </div>

</div>


);
}

export default Register;
