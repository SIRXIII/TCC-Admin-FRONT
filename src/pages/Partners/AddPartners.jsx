import React, { useState } from "react";
import backward from "../../assets/SVG/backward.svg";
import par_profile from "../../assets/Images/par_profile.png";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import axios from "axios";
import API from "../../services/api";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPartners = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    ownerName: "",
    days: "",
    storetime: "",
    address: "",
    location: "",
    businesstype: "",
    tax_id: "",
    owner_name: "",
    licenseImage: null,
    ownerIdImage: null,
  });
  const [profileImage, setProfileImage] = useState(par_profile);
  const [licenseImages, setLicenseImages] = useState({ front: null, back: null });
  const [ownerIdImages, setOwnerIdImages] = useState({ front: null, back: null });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type, side) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "license") {
      setLicenseImages((prev) => ({ ...prev, [side]: file }));
    } else if (type === "ownerId") {
      setOwnerIdImages((prev) => ({ ...prev, [side]: file }));
    } else if (type === "profile") {
      const profile = URL.createObjectURL(file);
      setProfileImage(profile);
    }
  };


  const handleDelete = (type, index = null) => {
    if (type === "profile") {
      setProfileImage(par_profile);
    } else if (type === "license") {
      setLicenseImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "ownerId") {
      setOwnerIdImages((prev) => prev.filter((_, i) => i !== index));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (profileImage && profileImage !== par_profile) {
        const profileInput = document.getElementById("profileImage");
        if (profileInput?.files[0]) {
          payload.append("profileImage", profileInput.files[0]);
        }
      }

      if (licenseImages.front) payload.append("license_front", licenseImages.front);
      if (licenseImages.back) payload.append("license_back", licenseImages.back);

      if (ownerIdImages.front) payload.append("ownerId_front", ownerIdImages.front);
      if (ownerIdImages.back) payload.append("ownerId_back", ownerIdImages.back);


      const res = await API.post("/partner/store", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Partner added successfully!");

      navigate("/partners");
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error("Something went wrong!");
      }
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
                <Link to="/partners" className="group">
                  <img
                    src={backward}
                    alt="backward"
                    className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </Link>
                <span className="text-2xl fw6 font-roboto text-[#232323]">
                  Add Partner
                </span>
              </div>


              <p className="text-sm fw4 text-[#232323]">
                Add new partner into the platform.
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/partners" className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00]">
                Cancle
              </Link>
              <button className="border border-[#F77F00] rounded-lg px-4 py-3 text-xs bg-orange text-[#FEF2E6]">
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
                  src={profileImage}
                  alt="Par_Profile"
                  className="w-18 h-18 rounded-[10px]"
                />

                <div className="flex py-4 gap-2">
                  <input
                    type="file"
                    name="profileImage"
                    id="profileImage"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "profile")}
                  />
                  <label
                    htmlFor="profileImage"
                    className="border border-[#F77F00] bg-[#F77F00] rounded-lg p-3 text-xs text-[#FEF2E6] cursor-pointer hover:bg-orange hover:text-white"
                  >
                    Upload new picture
                  </label>
                  <button
                    type="button"
                    className="border border-[#F77F00] rounded-lg p-3 text-xs bg-[#FEF2E6] text-[#F77F00]"
                    onClick={() => handleDelete("profile")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4   leading-[100%] tracking-[-5%]">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="businessName"
                    className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                  >
                    Business Name
                  </label>
                </div>
                {errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">{errors.businessName[0]}</p>
                )}
              </div>

              <div>
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
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="tel"
                    id="phonenumber"
                    name="phone"
                    value={formData.phone}
                    // onChange={handleChange}
                    onChange={(e) => {

                      let digits = e.target.value.replace(/\D/g, "").slice(0, 10);

                      if (digits.length > 3 && digits.length <= 6) {
                        digits = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                      } else if (digits.length > 6) {
                        digits = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
                      }

                      e.target.value = digits;
                      handleChange(e);
                    }}
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder="Phone (e.g. 212-456-7890)"
                  />
                  <label
                    htmlFor="phonenumber"
                    className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                  >
                    Phone Number
                  </label>
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="ownerName"
                    className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                  >
                    Owner Name
                  </label>
                </div>
                {errors.ownerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.ownerName[0]}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="days"
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
                {errors.days && (
                  <p className="text-red-500 text-xs mt-1">{errors.days[0]}</p>
                )}
              </div>

              <div>
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
                {errors.storetime && (
                  <p className="text-red-500 text-xs mt-1">{errors.storetime[0]}</p>
                )}
              </div>

              <div>
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
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address[0]}</p>
                )}
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

              >
                <option value=""></option>
                <option value="Luxury Fashion Rentals">Luxury Fashion Rentals</option>
                <option value="Art Gallery">Art Gallery</option>
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div
            className="p-6 flex flex-col gap-6 rounded-lg bg-white"
            style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
          >
            <h1 className="text-lg text-[#232323]  fw6 leading-[150%] tracking-[-3%]">
              Business Verification
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                onClick={() => document.getElementById("licenseFront").click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="licenseFront"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "license", "front")}
                />
                {licenseImages.front ? (
                  <div className="relative w-full">
                    <img
                      src={URL.createObjectURL(licenseImages.front)}
                      alt="License Front"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLicenseImages((prev) => ({ ...prev, front: null }));
                      }}
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                ) : (

                  <div className="cursor-pointer flex flex-col items-center">
                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                    <p className="text-base fw6 text-[#6C6C6C]">
                      Upload license Front image.
                    </p>
                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                  </div>
                )}
              </div>


              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                onClick={() => document.getElementById("licenseBack").click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="licenseBack"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "license", "back")}
                />
                {licenseImages.back ? (
                  <div className="relative w-full">
                    <img
                      src={URL.createObjectURL(licenseImages.back)}
                      alt="License Back"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLicenseImages((prev) => ({ ...prev, back: null }));
                      }}
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  // <p className="text-sm text-gray-500">Upload License Back</p>
                  <div className="cursor-pointer flex flex-col items-center">
                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                    <p className="text-base fw6 text-[#6C6C6C]">
                      Upload license Back image.
                    </p>
                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                  </div>
                )}
              </div>
            </div>





            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  fw4 leading-[100%] tracking-[-5%]">
              <div>
                <div className="relative">
                  <input
                    type="text"
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
                {errors.tax_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.tax_id[0]}</p>
                )}
              </div>


              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="location"
                    className="absolute text-sm ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
                  >
                    Location
                  </label>
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location[0]}</p>
                )}
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                onClick={() => document.getElementById("ownerIdFront").click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="ownerIdFront"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "ownerId", "front")}
                />
                {ownerIdImages.front ? (
                  <div className="relative w-full">
                    <img
                      src={URL.createObjectURL(ownerIdImages.front)}
                      alt="Owner ID Front"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOwnerIdImages((prev) => ({ ...prev, front: null }));
                      }}
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  // <p className="text-sm text-gray-500">Upload Owner ID Front</p>
                  <div className="cursor-pointer flex flex-col items-center">
                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                    <p className="text-base fw6 text-[#6C6C6C]">
                      Upload Owner ID Front image.
                    </p>
                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                  </div>
                )}
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                onClick={() => document.getElementById("ownerIdBack").click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="ownerIdBack"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "ownerId", "back")}
                />
                {ownerIdImages.back ? (
                  <div className="relative w-full">
                    <img
                      src={URL.createObjectURL(ownerIdImages.back)}
                      alt="Owner ID Back"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOwnerIdImages((prev) => ({ ...prev, back: null }));
                      }}
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="cursor-pointer flex flex-col items-center">
                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                    <p className="text-base fw6 text-[#6C6C6C]">
                      Upload Owner ID Back image.
                    </p>
                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPartners;
