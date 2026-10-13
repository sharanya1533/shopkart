
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
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
        "https://shopkart-ce9s.onrender.com/customers/login",
        formData,
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);
      window.location.href = "/home";
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
<div className="login-page">
          <h1>ShopKart Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
        <p>
  Don't have an account? <Link to="/register">Register</Link>
</p>
      </form>
    </div>
  );
}

export default Login;

