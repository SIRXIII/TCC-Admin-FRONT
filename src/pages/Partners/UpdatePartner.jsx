import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiChevronDown } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import API from "../../services/api";
import Breadcrumb from "../../components/Breadcrumb";
import CustomTimePicker from "../../components/CustomTimePicker";
import backward from "../../assets/SVG/backward.svg";
import par_profile from "../../assets/Images/par_profile.png";
import Upload from "../../assets/SVG/upload.svg";

const UpdatePartner = () => {
    const { id } = useParams(); // Get partner ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        phone: "",
        ownerName: "",
        days: [],
        store_start_time: "",
        store_end_time: "",
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
    const [loading, setLoading] = useState(true);

    const daysOrder = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const formatTime = (timeStr) => {
        if (!timeStr) return "";

        // Handle 24-hour format like "19:00:00"
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr || "00";
        const period = hour >= 12 ? "PM" : "AM";

        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;

        return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")} ${period}`;
    };


    // Fetch partner data on component mount
    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await API.get(`/partners/${id}`);
                const data = res.data.data;
                console.log("response", res.data.data);
                setFormData({
                    businessName: data.business_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    ownerName: data.name || "",
                    days: Array.isArray(data.store_available_days)
                        ? data.store_available_days
                        : (typeof data.store_available_days === "string"
                            ? data.store_available_days
                                .replace(/\s*-\s*/g, ",")
                                .split(",")
                                .map(d => d.trim())
                            : []),

                    store_start_time: formatTime(data.store_available_start_time) || "",

                    store_end_time: formatTime(data.store_available_end_time) || "",

                    address: data.address || "",
                    location: data.location || "",
                    businesstype: data.businesstype || "",
                    tax_id: data.tax_id || "",
                    owner_name: data.owner_name || "",
                    licenseImage: null,
                    ownerIdImage: null,
                });

                setProfileImage(data.profile_photo || par_profile);
                setLicenseImages({
                    front: data.documents.license[0].file_path || null,
                    back: data.documents.license[1].file_path || null,
                });
                setOwnerIdImages({
                    front: data.documents.owner_id_card[0].file_path || null,
                    back: data.documents.owner_id_card[1].file_path || null,
                });
                setLoading(false);
            } catch (err) {
                toast.error("Failed to fetch partner data!");
                setLoading(false);
            }
        };
        fetchPartner();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDaySelect = (day) => {
        setFormData((prev) => {
            let updatedDays = [...prev.days];
            if (updatedDays.includes(day)) {
                updatedDays = updatedDays.filter((d) => d !== day);
            } else if (updatedDays.length < 2) {
                updatedDays.push(day);
            }
            return { ...prev, days: updatedDays };
        });
    };

    const handleTimeChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const selectedDaysDisplay =
        formData.days.length > 0 ? formData.days.join(" - ") : "";

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

    const handleDelete = (type, side) => {
        if (type === "profile") {
            setProfileImage(par_profile);
        } else if (type === "license") {
            setLicenseImages((prev) => ({ ...prev, [side]: null }));
        } else if (type === "ownerId") {
            setOwnerIdImages((prev) => ({ ...prev, [side]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "days") {
                    payload.append(key, JSON.stringify(formData[key]));
                } else {
                    payload.append(key, formData[key]);
                }
            });

            if (profileImage && profileImage !== par_profile) {
                const profileInput = document.getElementById("profileImage");
                if (profileInput?.files[0]) {
                    payload.append("profileImage", profileInput.files[0]);
                }
            }

            if (licenseImages.front && licenseImages.front instanceof File) {
                payload.append("license_front", licenseImages.front);
            }
            if (licenseImages.back && licenseImages.back instanceof File) {
                payload.append("license_back", licenseImages.back);
            }

            if (ownerIdImages.front && ownerIdImages.front instanceof File) {
                payload.append("ownerId_front", ownerIdImages.front);
            }
            if (ownerIdImages.back && ownerIdImages.back instanceof File) {
                payload.append("ownerId_back", ownerIdImages.back);
            }

            const res = await API.post(`/partner/update/${id}`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Partner updated successfully!");
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col p-4 top-[120px] left-[281px] gap-6"
        >
            <div className="flex flex-col p-4 top-[120px] left-[281px] gap-6">
                <div className="flex flex-col gap-4">
                    <Breadcrumb
                        items={[
                            { label: "Dashboard", path: "/" },
                            { label: "Partners", path: "/partners" },
                            { label: "Update Partner" },
                        ]}
                    />
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
                                    Update Partner
                                </span>
                            </div>
                            <p className="text-sm fw4 text-[#232323]">
                                Update partner details in the platform.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to="/partners"
                                className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00]"
                            >
                                Cancel
                            </Link>
                            <button className="border border-[#F77F00] rounded-lg px-4 py-3 text-xs bg-orange text-[#FEF2E6]">
                                Save Changes
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
                            <h2 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
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
                            {errors.profileImage && (
                                <p className="text-red-500 text-xs mt-1">{errors.profileImage[0]}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-[100%] tracking-[-5%]">
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                    <div className="block p-3 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9]">
                                        <CustomTimePicker
                                            onChange={(value) => handleTimeChange("store_start_time", value)}
                                            value={formData.store_start_time}
                                            format="hh:mm a"
                                        />
                                    </div>
                                    <label
                                        htmlFor="store_start_time"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Store Start Time
                                    </label>
                                </div>
                                {errors.store_start_time && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.store_start_time[0]}
                                    </p>
                                )}
                            </div>
                            <div>
                                <div className="relative">
                                    <div className="block p-3 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9]">
                                        <CustomTimePicker
                                            onChange={(value) => handleTimeChange("store_end_time", value)}
                                            value={formData.store_end_time}
                                            format="hh:mm a"
                                        />
                                    </div>
                                    <label
                                        htmlFor="store_end_time"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Store End Time
                                    </label>
                                </div>
                                {errors.store_end_time && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.store_end_time[0]}
                                    </p>
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Address
                                    </label>
                                </div>
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address[0]}</p>
                                )}
                            </div>
                            <div>
                                <div className="relative md:col-span-1">
                                    <div className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9]">
                                        <div className="flex flex-wrap gap-2">
                                            {daysOrder.map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => handleDaySelect(day)}
                                                    className={`px-3 py-1 rounded-full text-sm border ${formData.days.includes(day)
                                                        ? "bg-[#F77F00] text-white border-[#F77F00]"
                                                        : "border-gray-300 text-[#232323]"
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <label
                                        htmlFor="days"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Store Availability Days
                                    </label>
                                </div>
                                {selectedDaysDisplay && (
                                    <p className="text-sm text-[#232323] mt-2">
                                        Selected: <span className="font-medium">{selectedDaysDisplay}</span>
                                    </p>
                                )}
                                {errors.days && (
                                    <p className="text-red-500 text-xs mt-1">{errors.days[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="p-6 flex flex-col gap-6 rounded-lg bg-white"
                        style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                    >
                        <h1 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
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
                                            src={
                                                licenseImages.front instanceof File
                                                    ? URL.createObjectURL(licenseImages.front)
                                                    : licenseImages.front
                                            }
                                            alt="License Front"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete("license", "front");
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
                                            src={
                                                licenseImages.back instanceof File
                                                    ? URL.createObjectURL(licenseImages.back)
                                                    : licenseImages.back
                                            }
                                            alt="License Back"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete("license", "back");
                                            }}
                                        >
                                            <FaTimes className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fw4 leading-[100%] tracking-[-5%]">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="tax_id"
                                        name="tax_id"
                                        value={formData.tax_id}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleChange(e);
                                            }
                                        }}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                        placeholder="e.g: 08796"
                                    />
                                    <label
                                        htmlFor="tax_id"
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
                                            src={
                                                ownerIdImages.front instanceof File
                                                    ? URL.createObjectURL(ownerIdImages.front)
                                                    : ownerIdImages.front
                                            }
                                            alt="Owner ID Front"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete("ownerId", "front");
                                            }}
                                        >
                                            <FaTimes className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
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
                                            src={
                                                ownerIdImages.back instanceof File
                                                    ? URL.createObjectURL(ownerIdImages.back)
                                                    : ownerIdImages.back
                                            }
                                            alt="Owner ID Back"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete("ownerId", "back");
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

export default UpdatePartner;