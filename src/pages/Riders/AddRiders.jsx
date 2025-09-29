import React, { useState } from "react";
import backward from "../../assets/SVG/backward.svg";
import rid_image from "../../assets/Images/Rid_image.jpg";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dropdown = ({
  label,
  options = [],
  multiple = false,
  value,
  onChange,
  triggerClass,
  dropdownClass,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    if (multiple) {
      const newValue = value.includes(opt)
        ? value.filter((v) => v !== opt)
        : [...value, opt];
      onChange(newValue);
    } else {
      onChange(opt);
      setOpen(false);
    }
  };

  const displayValue = multiple ? value.join(", ") || label : value || label;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`flex items-center border border-[#afaaaa89] rounded-lg px-4 py-4 cursor-pointer bg-white ${triggerClass}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[#121212] text-sm flex-1">{displayValue}</span>
        <FiChevronDown
          className={`transform transition-transform duration-300 w-5 h-5 ${open ? "rotate-180" : "rotate-0"
            }`}
        />
      </div>
      {open && (
        <div
          className={`absolute top-full left-0 bg-[#FFFFFF] border border-[#D9D9D9] rounded-lg shadow-md z-10 ${dropdownClass}`}
        >
          {options.map((opt, index) => (
            <span
              key={index}
              onClick={() => handleSelect(opt)}
              className={`block hover:bg-[#F77F00] hover:text-[#FFFFFF] p-1 rounded cursor-pointer text-[#121212] py-2 px-4 ${multiple && value.includes(opt) ? "bg-[#f6a34b] text-white mb-1" : ""
                }`}
            >
              {opt}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
const AddRiders = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    insurance_expire_date: "",
    assigned_region: [],
    vehicle_type: "",
    vehicle_name:"",
    license_plate: "",
  
  });

  const [profileImage, setProfileImage] = useState(rid_image);
  const [licenseImages, setLicenseImages] = useState({ front: null, back: null });
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
    } else if (type === "profile") {
      const profile = URL.createObjectURL(file);
      setProfileImage(profile);
      setFormData((prev) => ({ ...prev, profile_photo: file }));
    }
  };


  
    const handleDelete = (type, index = null) => {
      if (type === "profile") {
        setProfileImage(rid_image);
      } else if (type === "license") {
        setLicenseImages((prev) => prev.filter((_, i) => i !== index));
      }
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (profileImage && profileImage !== rid_image) {
        const profileInput = document.getElementById("profileImage");
        if (profileInput?.files[0]) {
          payload.append("profileImage", profileInput.files[0]);
        }
      }

      if (licenseImages.front) payload.append("license_front", licenseImages.front);
      if (licenseImages.back) payload.append("license_back", licenseImages.back);



      const res = await API.post("/riders/store", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Rider added successfully!");

      navigate("/riders");
      setErrors({});
    } catch (err) {

      console.log(err)
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
            <p>Dashboard</p>
            <span className="mx-1 text-[#9A9A9A]">/</span>
            <p>Riders</p>
            <span className="mx-1 text-[#9A9A9A]">/</span>
            <p className="text-[#F77F00]">Add Rider</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3 items-center">
                <img src={backward} alt="backward" className="w-6 h-6" />
                <span className="text-2xl fw6 font-roboto text-[#232323]">
                  Add Rider
                </span>
              </div>
              <p className="text-sm fw4 text-[#232323]">
                Add new delivery riders who handle pickup & drop-off.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-[#F77F00] rounded-lg px-4 py-3 text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="first_name"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="last_name"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Phone Number
              </label>
            </div>

            {/* <div className="relative md:col-span-2">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="address"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Address
              </label>
            </div> */}
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label htmlFor="address" className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                Address
              </label>
            </div>

            <div className="relative">
              <input
                type="date"
                id="insurance_expire_date"
                name="insurance_expire_date"
                value={formData.insurance_expire_date}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
              />
              <label
                htmlFor="insurance_expire_date"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Insurance Expire Date
              </label>
            </div>
          </div>
        </div>

        <div
          className="p-6 flex flex-col gap-6 rounded-lg bg-white"
          style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
        >
          <h2 className="text-lg text-[#232323] fw6">Work Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">

              <Dropdown
                label="Select Assigned Region"
                options={["Brooklyn", "Queens", "Manhattan"]}
                multiple={true}
                value={formData.assigned_region}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, assigned_region: val }))
                }
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer appearance-none focus:outline-none"
                dropdownClass="w-full"
              />
              <label
                htmlFor="assigned_region"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Assigned Region
              </label>
            </div>

            <div className="relative">
              <Dropdown
                label="Select Vehicle Type"
                options={["Bike", "Car", "Scooter", "Van"]}
                multiple={false}
                value={formData.vehicle_type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, vehicle_type: val }))
                }
                dropdownClass="w-full"
              />
              <label
                htmlFor="vehicle_type"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Vehicle Type
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="vehicle_name"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label htmlFor="vehicle_name" className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                Vehicle Name
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="license_plate"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="license_plate"
                className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                License Plate
              </label>
            </div>
          </div>
        </div>

        <div
          className="p-6 flex flex-col gap-6 rounded-lg bg-white"
          style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
        >
          <h1 className="text-lg text-[#232323] fw6">License</h1>
          {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center">
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
          </div> */}
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
        </div>
      </div>
    </form>
  );
};

export default AddRiders;
