import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import EyeOff from "../../assets/SVG/password-hidden.svg";

const Password = () => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex-1 bg-white p-6 gap-6 rounded-lg border border-[#00000033]">
      <div className="flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <h3 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
          Password
        </h3>

        <div className="flex flex-col gap-3 leading-[150%] tracking-[-3%]">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                {showNew ? (
                  <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>

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
                {showConfirm ? (
                  <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gp-2 fw6 text-xs justify-center text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Discard
          </button>
          <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gp-2 fw6 text-xs justify-center text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Password;
