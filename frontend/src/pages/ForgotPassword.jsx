import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      // API Integration Point:
      // const response = await axios.post(
      //   "http://127.0.0.1:8000/auth/forgot-password",
      //   { email: email.trim() }
      // );

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      setSuccessMessage(
        `A password reset link has been sent to ${email.trim()}. Please check your inbox.`
      );
      setEmail("");

      // You can also auto-redirect after 5 seconds
      // setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrorMessage(
        error.response?.data?.detail ||
        "Unable to send reset link. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 flex flex-col justify-center items-center p-4 sm:p-6 relative font-sans selection:bg-indigo-100 selection:text-indigo-600 transition-colors duration-200">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      {/* Top Branding Header */}
      <div className="text-center mb-8 space-y-3 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30">
          <Rocket className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          CollabIQ
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide max-w-xs mx-auto">
          Academic Excellence Through AI Collaboration
        </p>
      </div>

      {/* Reset Password Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 space-y-6 relative z-10 transition-all">
        {!emailSent ? (
          <>
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Forgot Password?
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your institutional email and we'll send you a password reset link.
              </p>
            </div>

            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  We'll send a password reset link to this email.
                </p>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] text-white text-sm font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          // Success State
          <div className="space-y-6 text-center py-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Check Your Inbox
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                We've sent a password reset link to your email address.
                <br />
                <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
                  Didn't receive it? Check your spam folder.
                </span>
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleResend}
                className="w-full py-3 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl transition-all"
              >
                Resend Email
              </button>

              <Link
                to="/login"
                className="block w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="mt-6 text-center text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">
        Need help?{" "}
        <a
          href="/support"
          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;