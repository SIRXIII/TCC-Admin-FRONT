import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import TCCImage from "../assets/Images/TCC_bg.jpg";
import logo from "../assets/SVG/logo.svg";
import EyeOff from "../assets/SVG/password-hidden.svg";
import API from "../services/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || "",
    token: searchParams.get('token') || "",
    password: "",
    password_confirmation: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Check if token and email are present
    if (!formData.token || !formData.email) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [formData.token, formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setFieldErrors({});

    try {
      const response = await API.post("/reset-password", formData);
      setMessage(response.data.message || "Password reset successfully");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || "Failed to reset password");
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
            <span className="text-orange-400">Create</span> new password
          </h2>
          <p className="mt-3 text-lg text-gray-200 font-inter">
            Enter your new password below to complete the reset process
          </p>
        </div>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-[480px]">
          <h2 className="text-[42px] font-medium font-roboto text-[#232323] mb-2 flex items-center justify-center leading-[130%]">
            Reset Password
          </h2>
          <p className="text-[#6C6C6C] text-base mb-10 flex items-center justify-center pt-3">
            Enter your new password
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#202020] bg-gray-100 rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                  readOnly
                />
                <label
                  htmlFor="email"
                  className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Email Address
                </label>
              </div>
            </div>

            <div className="mb-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="ms-3 absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {fieldErrors.password && fieldErrors.password.map((msg, i) => (
                <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
              ))}
            </div>

            <div className="mb-2">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password_confirmation"
                  className="ms-3 absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {fieldErrors.password_confirmation && fieldErrors.password_confirmation.map((msg, i) => (
                <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !formData.token || !formData.email}
              className="w-full bg-orange text-white text-base fw6 py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
