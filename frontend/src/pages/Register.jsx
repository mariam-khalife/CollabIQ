import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaUniversity,
  FaGraduationCap,
} from "react-icons/fa";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
  full_name: "",
  university: "",
  major: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm({
    ...form,
    [name]: type === "checkbox" ? checked : value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        form
      );

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed");
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
  <label>Full Name</label>
  <div className="input-group">
  <FaUser className="input-icon" />

  <input
    type="text"
    name="full_name"
    placeholder="Full Name"
    value={form.full_name}
    onChange={handleChange}
  />
</div>

  <div className="row">
    <div className="input-group">
      <label>University</label>
      <div className="input-group">
  <FaUniversity className="input-icon" />

  <input
    type="text"
    name="university"
    placeholder="University"
    value={form.university}
    onChange={handleChange}
  />
</div>
    </div>

    <div className="input-group">
      <label>Major</label>
      <div className="input-group">
  <FaGraduationCap className="input-icon" />

  <input
    type="text"
    name="major"
    placeholder="Major"
    value={form.major}
    onChange={handleChange}
  />
</div>
    </div>
  </div>

  <label>Institutional Email</label>
  <div className="input-group">
  <FaEnvelope className="input-icon" />

  <input
    type="email"
    name="email"
    placeholder="name@university.edu"
    value={form.email}
    onChange={handleChange}
  />
</div>

  <label>Password</label>
  <div className="input-group">
  <FaLock className="input-icon" />

  <input
    type="password"
    name="password"
    placeholder="••••••••"
    value={form.password}
    onChange={handleChange}
  />

  <FaEye className="eye-icon" />
</div>

  <label>Confirm Password</label>
  <input
    type="password"
    name="confirmPassword"
    placeholder="••••••••"
    value={form.confirmPassword}
    onChange={handleChange}
  />

  <label className="checkbox">
    <input
      type="checkbox"
      name="agree"
      checked={form.agree}
      onChange={handleChange}
    />
    I agree to the Terms of Service and Privacy Policy
  </label>

 <button type="submit">
  Create Account
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
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;