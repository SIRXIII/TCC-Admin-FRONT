import React, { useState } from "react";
import Rid_image from "../../assets/Images/rid_profile.jpg"; 

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-lg border border-[#00000033] ">
      <div className=" flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <div>
          <h2 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%] align-middle">
            Personal Information
          </h2>
        </div>
        <div className="flex gap-4">
          <img
            src={Rid_image}
            alt="profile"
            className="w-18 h-18 rounded-[10px] object-cover object-center"
          />
          <div className="flex py-4 gap-2 leading-[150%] tracking-[-3%] justify-center">
            <button
              type="button"
              className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 text-xs fw6 text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF] "
            >
              Upload new picture
            </button>
            <button
              type="button"
              className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="firstName"
              className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              First Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="lastName"
              className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Last Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Phone Number
            </label>
          </div>

          <div className="relative md:col-span-2">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="address"
              className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Address
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2  leading-[150%] tracking-[-3%] ">
          <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs justify-center text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
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

export default PersonalInfo;
