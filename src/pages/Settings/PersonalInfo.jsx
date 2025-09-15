import React, { useState } from "react";
import API from "../../services/api";
import Rid_image from "../../assets/Images/rid_profile.jpg";
import { toast } from "react-toastify";

const PersonalInfo = () => {
  const currentUser = JSON.parse(localStorage.getItem("auth_user")) || {};

  const [formData, setFormData] = useState({
    first_name: currentUser.first_name || "",
    last_name: currentUser.last_name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
  });

  const [image, setImage] = useState(null); 
  const [preview, setPreview] = useState(
    currentUser.profile_photo ?? Rid_image
  );
  const [loading, setLoading] = useState(false);

  const handleDiscard = () => {
    setFormData({
      first_name: currentUser.first_name || "",
      last_name: currentUser.last_name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    });
    setImage(null);
    setPreview(
      currentUser.profile_photo ??  Rid_image
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("user_id", currentUser.id);
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) {
        data.append("profile_photo", image); 
      }

      const response = await API.post("/profile/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("auth_user", JSON.stringify(response.data.user));
     
      toast.success("Profile updated successfully!")
    } catch (err) {
      console.error(err);
     
      toast.error("Failed to update profile")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-lg border border-[#00000033]">
      <div className="flex flex-col gap-6 rounded-lg bg-[#FFFFFF]">
        <h2 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
          Personal Information
        </h2>

        
        <div className="flex gap-4 items-center">
          <img
            src={preview}
            alt="profile"
            className="w-18 h-18 rounded-[10px] object-cover object-center"
          />
          <div className="flex gap-2">
            <label className="cursor-pointer border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs fw6 text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]">
              Upload new picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(Rid_image);
              }}
              className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs fw6 text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["first_name", "last_name", "email", "phone"].map((field) => (
            <div className="relative" key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                placeholder=" "
              />
              <label
                htmlFor={field}
                className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                {field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            </div>
          ))}
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
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 gap-2 fw6 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-[#FFFFFF]"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
