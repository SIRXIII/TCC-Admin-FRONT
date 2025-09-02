import React, { useState } from "react";
import backward from "../../assets/SVG/backward.svg";
import Rid_image from "../../assets/Images/Rid_image.jpg";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import axios from "axios";

const Dropdown = ({
  label,
  options = [],
  triggerClass,
  dropdownClass,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`flex items-center border border-[#afaaaa89] rounded-lg px-4 py-4  cursor-pointer bg-white ${triggerClass}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className=" text-[#121212] text-sm flex-1">{selected}</span>
        <FiChevronDown
          className={`transform transition-transform duration-300 w-5 h-5 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {open && (
        <div
          className={`absolute top-full left-0 bg-[#FFFFFF] border border-[#D9D9D9] rounded-lg shadow-md z-10  ${dropdownClass}`}
        >
          {options.length > 0
            ? options.map((opt, index) => (
                <span
                  key={index}
                  onClick={() => handleSelect(opt)}
                  className="block hover:bg-[#F77F00] hover:text-[#FFFFFF] p-1 rounded cursor-pointer  text-[#121212] py-4 px-4"
                >
                  {opt}
                </span>
              ))
            : children}
        </div>
      )}
    </div>
  );
};

const AddRiders = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    assignedregion: [],
    vehicletype: "",
    licenseplate: "",
    licenseImage: null,
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

      const res = await axios.post("/Rider/store", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Rider Added:", res.data);
      alert("Rider added successfully!");
    } catch (err) {
      console.error("Error adding Rider:", err);
      alert("Error adding Rider!");
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
            <h2 className="text-lg text-[#232323] fw6">Personal Information</h2>
            <div className="flex gap-4 md:mt-4">
              <img
                src={Rid_image}
                alt="Rid_image"
                className="w-18 h-18 rounded-[10px] object-cover object-center"
              />
              <div className="flex py-4 gap-2">
                <button
                  type="button"
                  className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
                >
                  Upload new picture
                </button>
                <button
                  type="button"
                  className="border border-[#F77F00] rounded-lg p-3 text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
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
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="firstName"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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

            <div className="relative md:col-span-2">
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
                id="assignedregion"
                name="assignedregion"
                value={formData.assignedregion}
                // onChange={handleChange}
                
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer appearance-none focus:outline-none"
                dropdownClass="w-full gap-4"
                options={["Brooklyn", "Queens", "Manhattan"]}
              />

              <label
                htmlFor="assignedregion"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Assigned Region
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="vehicletype"
                name="vehicletype"
                value={formData.vehicletype}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="vehicletype"
                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Vehicle Type
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="licenseplate"
                name="licenseplate"
                value={formData.licenseplate}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor="licenseplate"
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
        </div>
      </div>
    </form>
  );
};

export default AddRiders;
