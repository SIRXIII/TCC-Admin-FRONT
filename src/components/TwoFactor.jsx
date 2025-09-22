import React, { useState, useEffect } from "react";
import TCCImage from "../assets/Images/TCC_bg.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/SVG/logo.svg";

const TwoFactor = () => {
  const [code, setCode] = useState("");
  const [method, setMethod] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { pending2FA, verify2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pending2FA) {
      navigate("/login");
    } else {
    
      // if (Array.isArray(pending2FA.method)) {
      //   setMethod(pending2FA.methods[0]);
      // } else if (pending2FA.method) {
        setMethod(pending2FA.methods);
      
    }
  }, [pending2FA, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const ok = await verify2FA(method, code);
      if (!ok) {
        setError("Invalid code. Please try again.");
      }
     
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div
      className="min-h-screen flex bg-contain relative"
      style={{ backgroundImage: `url(${TCCImage})` }}
    >
      {/* Left side with background + title */}
      <div className="w-1/2 relative flex flex-col justify-between text-white p-5">
        <div className="font-bold text-2xl top-[40px] left-[40.28px]">
          <img src={logo} alt="Logo" />
        </div>
        <div className="bg-gradient-to-b from-[#F77F00]/40 to-[#666666]/40 p-8 rounded-lg">
          <h2 className="text-5xl font-semibold font-roboto">
            Secure your account
          </h2>
          <p className="mt-3 text-lg text-gray-200 font-inter">
            Enter the code from your{" "}
            {method === "totp" ? "Authenticator app" : "email"} to continue.
          </p>
        </div>
      </div>
     

      {/* Right side form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-[480px]">
          <h2 className="text-[42px] font-medium font-roboto text-[#232323] mb-2 text-center leading-[130%]">
            Two-Factor Verification
          </h2>
          <p className="text-[#6C6C6C] text-base mb-10 text-center">
            Protecting your account with extra security  
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 mb-4 text-sm rounded-lg bg-red-500/60 text-white">
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Method selection (supports both single + multiple methods) */}
            {Array.isArray(pending2FA?.methods) ? (
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Choose verification method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="block w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
                >
                  {pending2FA.methods.map((m) => (
                    <option key={m} value={m}>
                      {m === "totp" ? "Authenticator App" : "Email OTP"}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              pending2FA?.method && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Verification method
                  </label>
                  <input
                    type="text"
                    value={
                      pending2FA.method === "totp"
                        ? "Authenticator App"
                        : "Email OTP"
                    }
                    disabled
                    className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
                  />
                </div>
              )
            )}

        

            {/* Code input */}
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your 6-digit code"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange text-white text-base fw6 py-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;
