import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: form.email.trim(),
      password: form.password,
    };

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response.data.access_token;

      if (!accessToken) {
        throw new Error("The backend did not return an access token.");
      }

      if (rememberMe) {
        localStorage.setItem("access_token", accessToken);
        sessionStorage.removeItem("access_token");
      } else {
        sessionStorage.setItem("access_token", accessToken);
        localStorage.removeItem("access_token");
      }

      alert("Login successful.");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (!error.response) {
        alert(
          "Unable to connect to the backend. Make sure the backend server is running."
        );
        return;
      }

      const detail = error.response.data?.detail;

      if (Array.isArray(detail)) {
        const validationMessages = detail
          .map((item) => {
            const field = item.loc?.at(-1) || "field";
            return `${field}: ${item.msg}`;
          })
          .join("\n");

        alert(validationMessages);
        return;
      }

      alert(
        typeof detail === "string"
          ? detail
          : "Login failed. Please check your email and password."
      );
    } finally {
      setIsSubmitting(false);
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
          <label htmlFor="email">Email Address</label>

          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@university.edu"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "15px",
              marginBottom: "8px",
            }}
          >
            <label htmlFor="password" style={{ margin: 0 }}>
              Password
            </label>

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
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <button
              type="button"
              className="eye-button"
              onClick={() =>
                setShowPassword((previousValue) => !previousValue)
              }
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="eye-icon" />
              ) : (
                <FaEye className="eye-icon" />
              )}
            </button>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />

            <span>Remember me</span>
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
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
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;