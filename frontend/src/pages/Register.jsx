import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  <input
    type="text"
    name="full_name"
    placeholder="Enter your full name"
    value={form.full_name}
    onChange={handleChange}
  />

  <div className="row">
    <div className="input-group">
      <label>University</label>
      <input
        type="text"
        name="university"
        placeholder="University"
        value={form.university}
        onChange={handleChange}
      />
    </div>

    <div className="input-group">
      <label>Major</label>
      <input
        type="text"
        name="major"
        placeholder="Major"
        value={form.major}
        onChange={handleChange}
      />
    </div>
  </div>

  <label>Institutional Email</label>
  <input
    type="email"
    name="email"
    placeholder="name@university.edu"
    value={form.email}
    onChange={handleChange}
  />

  <label>Password</label>
  <input
    type="password"
    name="password"
    placeholder="••••••••"
    value={form.password}
    onChange={handleChange}
  />

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

  <button type="submit">Create Account</button>
</form>

        <p className="switch-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;