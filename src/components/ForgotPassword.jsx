import React, { useState } from "react";
import { Link } from "react-router-dom";
import TCCImage from "../assets/Images/TCC_bg.jpg";
import logo from "../assets/SVG/logo.svg";
import API from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setFieldErrors({});

    try {
      const response = await API.post("/forgot-password", { email });
      setMessage(response.data.message || "Password reset link sent to your email");
      setEmail("");
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || "Failed to send reset link");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex bg-contain relative"
      style={{ backgroundImage: `url(${TCCImage})` }}
    >
      <div className="w-1/2 relative flex flex-col justify-between text-white p-5">
        <div className="font-bold text-2xl top-[40px] left-[40.28px]">
          <img src={logo} alt="" />
        </div>
        <div className="bg-gradient-to-b from-[#F77F00]/40 to-[#666666]/40 p-8 rounded-lg">
          <h2 className="text-7xl font-semibold font-roboto">
            <span className="text-orange-400">Reset</span> your password
          </h2>
          <p className="mt-3 text-lg text-gray-200 font-inter">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-[480px]">
          <h2 className="text-[42px] font-medium font-roboto text-[#232323] mb-2 flex items-center justify-center leading-[130%]">
            Forgot Password?
          </h2>
          <p className="text-[#6C6C6C] text-base mb-10 flex items-center justify-center pt-3">
            Don't worry, we'll help you reset it
          </p>

          {message && (
            <div className="p-4 mb-4 text-sm rounded-lg bg-green-500/60 text-white" role="alert">
              <span className="font-medium">{message}</span>
            </div>
          )}

          {error && Object.keys(fieldErrors).length === 0 && (
            <div className="p-4 mb-4 text-sm rounded-lg bg-red-500/60 text-white" role="alert">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Email Address
                </label>
              </div>
              {fieldErrors.email && fieldErrors.email.map((msg, i) => (
                <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange text-white text-base fw6 py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-[#F77F00] hover:underline fw5"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
