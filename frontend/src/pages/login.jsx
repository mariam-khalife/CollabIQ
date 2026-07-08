import logo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        form
      );

      alert(response.data.message);
    } catch (error) {
      setErrorMessage(
  error.response?.data?.detail || "Login failed. Please try again."
);
      setLoading(false);
    }

    finally {
  setLoading(false);
}
  };

  return (
  <div className="auth-container">
    <div className="logo-section">
      <div className="logo-box">
  <img src={logo} alt="CollabIQ Logo" />
</div>
      <h1>CollabIQ</h1>
      <p>Academic Excellence Through AI Collaboration</p>
    </div>

    <div className="auth-card">
      <h2>Login to your account</h2>
      <p className="subtitle">Welcome back!</p>

      <form onSubmit={handleSubmit}>
        {errorMessage && (
  <p
    style={{
      color: "#dc2626",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: "14px",
    }}
  >
    {errorMessage}
  </p>
)}
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

        <div className="password-row">
  <label>Password</label>

  <Link to="/forgot-password" className="forgot-link">
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

        <div className="remember-row">
  <label>
    <input type="checkbox" />
    Remember me
  </label>
</div>

        <button
  type="submit"
  className="primary-button"
  disabled={loading}
>
  {loading ? "Logging in..." : "Login"}
</button>
      </form>

      <div className="divider">
  <hr />
  <span>Or continue with</span>
  <hr />
</div>

      <div className="social-buttons">
        <button type="button" className="social-button">
  <FcGoogle />
  Google
</button>

<button type="button" className="social-button">
  <FaGraduationCap />
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