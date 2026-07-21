import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUniversity,
  FaGraduationCap,
} from "react-icons/fa";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    university: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.full_name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!form.password) {
      alert("Please enter your password.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      alert("You must agree to the Terms of Service.");
      return;
    }

    const registrationData = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      password: form.password,
      university: form.university.trim() || null,
    };

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);

      alert("Account created successfully.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

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

      if (typeof detail === "string") {
        alert(detail);
        return;
      }

      alert("Registration failed. Please verify your information.");
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
        <h2>Create your account</h2>

        <p className="subtitle">
          Join the academic excellence network and build your future team.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="full_name">Full Name</label>

          <div className="input-group">
            <FaUser className="input-icon" />

            <input
              id="full_name"
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="form-field">
              <label htmlFor="university">University</label>

              <div className="input-group">
                <FaUniversity className="input-icon" />

                <input
                  id="university"
                  type="text"
                  name="university"
                  placeholder="University"
                  value={form.university}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="major">Major</label>

              <div className="input-group">
                <FaGraduationCap className="input-icon" />

                <input
                  id="major"
                  type="text"
                  name="major"
                  placeholder="Major"
                  value={form.major}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <label htmlFor="email">Institutional Email</label>

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
            />
          </div>

          <label htmlFor="password">Password</label>

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
              minLength={8}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword((previousValue) => !previousValue)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="eye-icon" />
              ) : (
                <FaEye className="eye-icon" />
              )}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm Password</label>

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />

            <button
              type="button"
              className="eye-button"
              onClick={() =>
                setShowConfirmPassword((previousValue) => !previousValue)
              }
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="eye-icon" />
              ) : (
                <FaEye className="eye-icon" />
              )}
            </button>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />

            <span>
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

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
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

