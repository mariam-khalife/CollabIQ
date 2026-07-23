import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Mail, Lock, Eye, EyeOff, HelpCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Logging in with:", formData);

    // API Integration Point:
    // API.post('/auth/login', formData).then(() => navigate('/my-projects'))

    setTimeout(() => {
      setIsLoading(false);
      navigate("/my-projects");
    }, 800);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Initiating ${provider} authentication...`);
    // API Integration Point: window.location.href = `/api/auth/${provider}`
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center p-4 relative font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {/* Top Branding Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-2">
          <Rocket className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-indigo-950 tracking-tight">
          CollabIQ
        </h1>
        <p className="text-xs font-bold text-slate-400 tracking-wide">
          Academic Excellence Through AI Collaboration
        </p>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-slate-800">
            Login to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-bold text-slate-600">
                Remember me
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-70 mt-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white px-3 text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
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
            onClick={() => handleSocialLogin("eduid")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-extrabold text-slate-700 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-slate-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            EduID
          </button>
        </div>
      </div>

      {/* Bottom Registration Switch Link */}
      <div className="mt-8 text-center text-xs font-semibold text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Create an account
        </Link>
      </div>

      {/* Help Circle Floating Button */}
      <button className="fixed bottom-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-white/80 border border-transparent hover:border-slate-200 cursor-pointer">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Login;