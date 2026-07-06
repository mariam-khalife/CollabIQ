import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Form submitted");

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/auth/login",
      form
    );

    alert(response.data.message);
  } catch (error) {
    alert(error.response?.data?.detail || "Login failed");
  }
};

  return (
  <div className="auth-container">
    <div className="logo-section">
      <div className="logo-box">🚀</div>
      <h1>CollabIQ</h1>
      <p>Academic Excellence Through AI Collaboration</p>
    </div>

    <div className="auth-card">
      <h2>Login to your account</h2>
      <p className="subtitle">Welcome back!</p>

      <form onSubmit={handleSubmit}>
        <label>Email Address</label>
        <div className="input-group">
  <FaEnvelope className="input-icon" />

  <input
  type="email"
  name="email"
  placeholder="name@university.edu"
  value={form.email}
  onChange={handleChange}
  required
/>
</div>

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    marginBottom: "8px",
  }}
>
  <label style={{ margin: 0 }}>Password</label>

  <Link
    to="/forgot-password"
    style={{
      color: "#4338ca",
      fontSize: "13px",
      textDecoration: "none",
    }}
  >
    Forgot password?
  </Link>
</div>

        <div className="input-group">
  <FaLock className="input-icon" />

  <input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="••••••••"
  value={form.password}
  onChange={handleChange}
  required
/>
 <span
    className="eye-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
  
</div>

        <div style={{ marginTop: "15px", marginBottom: "10px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "normal",
            }}
          >
            <input type="checkbox" style={{ width: "16px" }} />
            Remember me
          </label>
        </div>

        <button type="submit">Login</button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "25px 0",
        }}
      >
        <hr style={{ flex: 1 }} />
        <span
          style={{
            margin: "0 10px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          Or continue with
        </span>
        <hr style={{ flex: 1 }} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          style={{
            background: "white",
            color: "#111",
            border: "1px solid #ddd",
          }}
        >
          Google
        </button>

        <button
          type="button"
          style={{
            background: "white",
            color: "#111",
            border: "1px solid #ddd",
          }}
        >
          EduID
        </button>
      </div>

      <p className="switch-text">
        Don't have an account?{" "}
        <Link to="/register">Create an account</Link>
      </p>
    </div>
  </div>
);
}

export default Login;