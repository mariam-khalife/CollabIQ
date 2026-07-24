import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Rocket,
  User,
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    university: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!form.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!form.agreeToTerms) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    const registrationData = {
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      university: form.university.trim() || null,
      major: form.major.trim() || null,
    };

    try {
      setIsLoading(true);

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
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (!error.response) {
        setErrorMessage(
          "Unable to connect to the backend server. Please make sure it is running."
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
          .join(" | ");

        setErrorMessage(validationMessages);
        return;
      }

      if (typeof detail === "string") {
        setErrorMessage(detail);
        return;
      }

      setErrorMessage("Registration failed. Please verify your information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Initiating ${provider} registration...`);
    // API Integration Point: window.location.href = `/api/auth/${provider}`
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-6 relative font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {/* Top Branding Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-1">
          <Rocket className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-indigo-950 tracking-tight">
          CollabIQ
        </h1>
        <p className="text-xs font-bold text-slate-400 tracking-wide max-w-xs mx-auto leading-relaxed">
          Join the academic excellence network and build your future team.
        </p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-800">
            Create your account
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Start your collaborative journey today.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* University & Major Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* University */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                University
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="university"
                  placeholder="Your University"
                  value={form.university}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Major */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Major
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="major"
                  placeholder="e.g. Computer Science"
                  value={form.major}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Institutional Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="student@university.edu"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <RotateCcw className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <span className="text-[11px] font-semibold text-slate-600">
                I agree to the{" "}
                <a
                  href="#terms"
                  className="text-indigo-600 font-extrabold hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#privacy"
                  className="text-indigo-600 font-extrabold hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white px-3 text-slate-400">
              or register with
            </span>
          </div>
        </div>

        {/* Social Register Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialRegister("google")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-extrabold text-slate-700 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialRegister("eduid")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-extrabold text-slate-700 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-slate-800" />
            EduID
          </button>
        </div>
      </div>

      {/* Bottom Login Link */}
      <div className="mt-8 text-center text-xs font-semibold text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Help Circle Floating Button */}
      <button className="fixed bottom-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-white/80 border border-transparent hover:border-slate-200 cursor-pointer">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Register;