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
import StoreAvailabilityCard from "../../components/StoreAvailabilityCard";
import axios from "axios";


const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;


console.log("GEOAPIFY_KEY update ", GEOAPIFY_KEY)
const UpdatePartner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        phone: "",
        ownerName: "",

        address: "",
        latitude: "",
        longitude: "",
        businesstype: "",
        tax_id: "",
        owner_name: "",
        licenseImage: null,
        ownerIdImage: null,
    });

    const [suggestions, setSuggestions] = useState([]);

    const [profileImage, setProfileImage] = useState(par_profile);
    const [licenseImages, setLicenseImages] = useState({ front: null, back: null });
    const [ownerIdImages, setOwnerIdImages] = useState({ front: null, back: null });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const [availability, setAvailability] = useState(
        Object.fromEntries(daysOfWeek.map(day => [day, { checked: false, start_time: "", end_time: "" }]))
    );

    const handleCheckboxChange = (day) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                checked: !prev[day].checked,
                ...(prev[day].checked ? { start_time: "", end_time: "" } : {})
            }
        }));
    };

    const handleTimeChange = (day, key, value) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [key]: value
            }
        }));
    };


    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await API.get(`/partners/${id}`);
                const data = res.data.data;

                // Parse backend availability safely
                let parsedAvailability = {};
                if (data.availability) {
                    try {
                        parsedAvailability = typeof data.availability === "string"
                            ? JSON.parse(data.availability)
                            : data.availability;
                    } catch (err) {
                        console.error("Invalid availability JSON:", err);
                    }
                }

                // Merge with default state
                const updatedAvailability = { ...availability };
                Object.keys(parsedAvailability).forEach(day => {
                    updatedAvailability[day] = parsedAvailability[day];
                });
                setAvailability(updatedAvailability);

                // Set other form data
                setFormData(prev => ({
                    ...prev,
                    businessName: data.business_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    ownerName: data.name || "",
                    address: data.address || "",
                    latitude: data.latitude || "",
                    longitude: data.longitude || "",
                    businesstype: data.category || "",
                    tax_id: data.tax_id || "",
                    owner_name: data.owner_name || "",
                }));

                setProfileImage(data.profile_photo || par_profile);

                setLicenseImages({
                    front: data.documents.license[0]?.file_path || null,
                    back: data.documents.license[1]?.file_path || null,
                });
                setOwnerIdImages({
                    front: data.documents.owner_id_card[0]?.file_path || null,
                    back: data.documents.owner_id_card[1]?.file_path || null,
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

            if (availability && typeof availability === "object") {
                payload.append("availability", JSON.stringify(availability));
            }

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


    const handleAddressChange = async (e) => {
        const value = e.target.value;
        handleChange(e);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        try {

            const res = await axios.get(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    value
                )}&apiKey=${GEOAPIFY_KEY}`
            );
            setSuggestions(res.data.features);
        } catch (err) {
            console.error("Geoapify error:", err);
        }
    };

    const handleSelectAddress = (place) => {
        const formatted = place.properties.formatted;
        const lat = place.geometry.coordinates[1];
        const lon = place.geometry.coordinates[0];

        setFormData({ ...formData, address: formatted, latitude: lat, longitude: lon });
        setSuggestions([]);

        // // Optional: Open in Google Maps
        // window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col p-4 gap-6 md:p-6 lg:p-8 max-w-[1200px] mx-auto"
        >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <Breadcrumb
                        items={[
                            { label: "Dashboard", path: "/" },
                            { label: "Partners", path: "/partners" },
                            { label: "Update Partner" },
                        ]}
                    />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <div className="flex items-center gap-3">
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
                        <div className="flex gap-2 flex-wrap md:flex-nowrap justify-end self-end">
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
                    {/* Personal Information */}
                    <div
                        className="p-6 flex flex-col gap-6 rounded-lg bg-white shadow-sm"
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
                                <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-2 w-full">
                                    <input
                                        type="file"
                                        name="profileImage"
                                        id="profileImage"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "profile")}
                                    />

                                    <label
                                        htmlFor="profileImage"
                                        className="border border-[#F77F00] bg-[#F77F00] rounded-lg p-3 text-xs text-[#FEF2E6] cursor-pointer hover:bg-orange hover:text-white text-center w-full sm:w-auto"
                                    >
                                        Upload new picture
                                    </label>

                                    <button
                                        type="button"
                                        className="border border-[#F77F00] rounded-lg p-3 text-xs bg-[#FEF2E6] text-[#F77F00] w-full sm:w-auto"
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="businessName"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="block p-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="businessName"
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                                        className="block p-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                                        className="block p-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                        placeholder="Phone (e.g. 212-456-7890)"
                                    />
                                    <label
                                        htmlFor="phonenumber"
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
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
                                        className="block p-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="ownerName"
                                        className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                    >
                                        Owner Name
                                    </label>
                                </div>
                                {errors.ownerName && (
                                    <p className="text-red-500 text-xs ">{errors.ownerName[0]}</p>
                                )}
                            </div>

                            <div className="col-span-1 sm:col-span-2 relative">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleAddressChange}
                                    className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="Address"
                                    className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Address
                                </label>
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                                        {suggestions.map((s, i) => (
                                            <li
                                                key={i}
                                                onClick={() => handleSelectAddress(s)}
                                                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
                                            >
                                                {s.properties.formatted}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address[0]}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={formData.latitude}
                                        disabled
                                        placeholder="Address latitude"
                                        className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9]"
                                    />
                                    <label
                                        htmlFor="latitude"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Latitude
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={formData.longitude}
                                        disabled
                                        placeholder="Address longitude"
                                        className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9]"
                                    />
                                    <label
                                        htmlFor="longitude"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Longitude
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* StoreAvailabilityCard */}
                    <StoreAvailabilityCard
                        availability={availability}
                        handleCheckboxChange={handleCheckboxChange}
                        handleTimeChange={handleTimeChange}
                    />

                    {/* Business Verification */}
                    <div
                        className="p-6 flex flex-col gap-6 rounded-lg bg-white shadow-sm"
                    >
                        <h1 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%]">
                            Business Verification
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="tax_id"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) handleChange(e);
                                    }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                                    }}
                                    className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
                                    placeholder="e.g: 08796"
                                />
                                <label
                                    htmlFor="tax_id"
                                    className="absolute text-sm ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-focus:px-2 peer-focus:text-[#232323] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Tax ID
                                </label>
                                {errors.tax_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tax_id[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* License & Owner ID Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* License Front & Back */}
                            {[["licenseFront", "front"], ["licenseBack", "back"]].map(([id, side]) => (
                                <div
                                    key={id}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                                    onClick={() => document.getElementById(id).click()}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={id}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "license", side)}
                                    />
                                    {licenseImages[side] ? (
                                        <div className="relative w-full">
                                            <img
                                                src={
                                                    licenseImages[side] instanceof File
                                                        ? URL.createObjectURL(licenseImages[side])
                                                        : licenseImages[side]
                                                }
                                                alt={`License ${side}`}
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete("license", side);
                                                }}
                                            >
                                                <FaTimes className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="cursor-pointer flex flex-col items-center">
                                            <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                                            <p className="text-base fw6 text-[#6C6C6C]">
                                                Upload license {side} image.
                                            </p>
                                            <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Owner ID Front & Back */}
                            {[["ownerIdFront", "front"], ["ownerIdBack", "back"]].map(([id, side]) => (
                                <div
                                    key={id}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                                    onClick={() => document.getElementById(id).click()}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={id}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "ownerId", side)}
                                    />
                                    {ownerIdImages[side] ? (
                                        <div className="relative w-full">
                                            <img
                                                src={
                                                    ownerIdImages[side] instanceof File
                                                        ? URL.createObjectURL(ownerIdImages[side])
                                                        : ownerIdImages[side]
                                                }
                                                alt={`Owner ID ${side}`}
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete("ownerId", side);
                                                }}
                                            >
                                                <FaTimes className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="cursor-pointer flex flex-col items-center">
                                            <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                                            <p className="text-base fw6 text-[#6C6C6C]">
                                                Upload Owner ID {side} image.
                                            </p>
                                            <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
};

export default UpdatePartner;