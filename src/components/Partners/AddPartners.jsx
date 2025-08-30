import React, { useState } from "react";
import backward from "../../assets/SVG/backward.svg";
import par_profile from "../../assets/Images/par_profile.png";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import axios from "axios";

const AddPartners = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    ownerName: "",
    days: "",
    storetime: "",
    address: "",
    businesstype: "",
    tax_id: "",
    owner_name: "",
    licenseImage: null,
    ownerIdImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      const res = await axios.post("/partner/store", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Partner Added:", res.data);
      alert("Partner added successfully!");
    } catch (err) {
      console.error("Error adding partner:", err);
      alert("Error adding partner!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-4 top-[120px] left-[281px] gap-6"
    >
      <div className="flex flex-col p-4 top-[120px] left-[281px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
            <p>Dashboard</p>
            <span className="mx-1 text-[#9A9A9A]">/</span>
            <p>Partners </p>
            <span className="mx-1 text-[#9A9A9A]">/</span>
            <p className="text-[#F77F00]">Add Partner</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex gap-3 items-center">
                <img src={backward} alt="backward" className="w-6 h-6" />
                <span className="text-2xl fw6 font-roboto text-[#232323]">
                  Add Partner
                </span>
              </div>

              <p className="text-sm fw4 text-[#232323]">
                Add new partner into the platform.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white">
                Cancle
              </button>
              <button className="border border-[#F77F00] rounded-lg px-4 py-3 text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white">
                Save
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1">
          <div
            className="p-6 flex flex-col gap-6 rounded-lg bg-white"
            style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
          >
            <div>
              <h2 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%] ">
                Personal Information
              </h2>

              <div className="flex gap-4 md:mt-4">
                <img
                  src={par_profile}
                  alt="Par_Profile"
                  className="w-18 h-18 rounded-[10px]"
                />
                <div className="flex py-4 gap-2">
                  <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white">
                    Upload new picture
                  </button>
                  <button className="border border-[#F77F00] rounded-lg p-3 text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white">
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4   leading-[100%] tracking-[-5%]">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="Businessname"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Business Name
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="number"
                  name="phonenumber"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="phonenumber"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Phone Number
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="Owner Name"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Owner Name
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="days"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Store Availability Days
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="storetime"
                  name="storetime"
                  value={formData.storetime}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="storetime"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Store Timing
                </label>
              </div>
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="Address"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Address
                </label>
              </div>
            </div>
          </div>
          <div
            className="p-6 flex flex-col gap-6 rounded-lg bg-[#FFFFFF]"
            style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
          >
            <h2 className="text-lg text-[#232323]  fw6 leading-[150%] tracking-[-3%]">
              Business Type
            </h2>
            <div className="relative fw4  leading-[100%] tracking-[-5%]">
              <select
                id="businesstype"
                name="businesstype"
                value={formData.businesstype}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer appearance-none"
                defaultValue=""
              >
                <option disabled hidden></option>
                <option>Luxury Fashion Rentals</option>
                <option>Art Gallery</option>
              </select>
              <label
                htmlFor="businesstype"
                className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
              peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#232323]"
              >
                Business Type
              </label>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C6C6C] pointer-events-none w-5 h-5 " />
            </div>
          </div>

          <div
            className="p-6 flex flex-col gap-6 rounded-lg bg-white"
            style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
          >
            <h1 className="text-lg text-[#232323]  fw6 leading-[150%] tracking-[-3%]">
              Business Verification
            </h1>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center">
              <input
                type="file"
                name="licenseImage"
                onChange={handleFileChange}
                className="hidden"
                id="licenseImage"
              />
              <label
                htmlFor="licenseImage"
                className="cursor-pointer flex flex-col items-center"
              >
                <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                <p className="text-base fw6 text-[#6C6C6C]">
                  Upload license image.
                </p>
                <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  fw4 leading-[100%] tracking-[-5%]">
              <div className="relative">
                <input
                  type="id"
                  id="id"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="tax_id"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Tax ID
                </label>
              </div>

              <div className="relative">
                <input
                  type="name"
                  id="name"
                  name="name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                  placeholder=" "
                />
                <label
                  htmlFor="Owner Name"
                  className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                >
                  Owner Name
                </label>
              </div>
            </div>

            <div className="border-2 border-dashed border-[#D9D9D9] rounded-lg p-8 flex flex-col items-center">
              <input
                type="file"
                name="ownerIdImage"
                onChange={handleFileChange}
                className="hidden"
                id="ownerIdImage"
              />
              <label htmlFor="ownerIdImage" className="cursor-pointer flex flex-col items-center">
                <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                <p className="text-base fw6 text-[#6C6C6C]">
                  Upload owner ID image.
                </p>
                <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPartners;
