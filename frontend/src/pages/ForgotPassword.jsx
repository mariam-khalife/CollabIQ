import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("This will connect to the backend when the API is ready.");
  };

  return (
    <div className="auth-container">
      <div className="logo-section">
        <div className="logo-box">🚀</div>
        <h1>CollabIQ</h1>
        <p>Academic Excellence Through AI Collaboration</p>
      </div>

      <div className="auth-card">
        <h2>Forgot Password?</h2>

        <p className="subtitle">
          Enter your institutional email and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>

          <input
            type="email"
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Send Reset Link
          </button>
        </form>

        <p className="switch-text">
          <Link to="/">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;