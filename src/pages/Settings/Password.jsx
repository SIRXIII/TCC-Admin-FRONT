import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import EyeOff from "../../assets/SVG/password-hidden.svg";
import API from "../../services/api";
import { toast } from "react-toastify";

const Password = () => {
  const currentUser = JSON.parse(localStorage.getItem("auth_user")) || {};
  
  // Check if user has password
  // If user has provider (social login), password will be null
  // If user has no provider, they have password
  const hasPassword = !currentUser.provider || (currentUser.provider === null);

  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    setFormData({
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    });
 
   
  };

  const handleSave = async () => {
    if (formData.newpassword !== formData.confirmpassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (!formData.newpassword || formData.newpassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: currentUser.id,
        newpassword: formData.newpassword,
        confirmpassword: formData.confirmpassword,
      };
      
      // Only include oldpassword if user has password (not social login)
      if (hasPassword) {
        payload.oldpassword = formData.oldpassword;
      }

      const response = await API.post("/user/update-password", payload);

      if (response.status === 200) {
       
        toast.success("Password updated successfully!")
        handleDiscard();
      }
    } catch (err) {
      console.log(err.response?.data || err);
      
      // Extract error message from API response
      let errorMessage = "Something went wrong!";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check if it's a validation error with errors object
        if (errorData.errors && typeof errorData.errors === 'object') {
          // Get all error messages from validation errors
          const errorMessages = [];
          Object.keys(errorData.errors).forEach((field) => {
            if (Array.isArray(errorData.errors[field])) {
              errorMessages.push(...errorData.errors[field]);
            } else {
              errorMessages.push(errorData.errors[field]);
            }
          });
          
          // Show all error messages or fallback to message
          errorMessage = errorMessages.length > 0 
            ? errorMessages.join('. ') 
            : errorData.message || errorMessage;
        } 
        // Check if there's a direct message (could be from status: 'error' format)
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Check for status: 'error' format
        else if (errorData.status === 'error' && errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-6 gap-6 rounded-lg border border-[#00000033]">
      <div className="flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <h3 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
          Password
        </h3>

        <div className="flex flex-col gap-3 leading-[150%] tracking-[-3%]">
          {/* Only show old password field if user has password (not social login) */}
          {hasPassword && (
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                id="oldpassword"
                name="oldpassword"
                value={formData.oldpassword}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="oldpassword"
                className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Old Password
              </label>
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showOld ? <img src={EyeOff} alt="Hide password" className="w-5 h-5" /> : <FiEye size={20} />}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                id="newpassword"
                name="newpassword"
                value={formData.newpassword}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="newpassword"
                className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <img src={EyeOff} alt="Hide password" className="w-5 h-5" /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmpassword"
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="confirmpassword"
                className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <img src={EyeOff} alt="Hide password" className="w-5 h-5" /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Password;
