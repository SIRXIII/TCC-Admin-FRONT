import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/SVG/img.svg";
import bell from "../assets/SVG/bell.svg";
import { useAuth } from "../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const { user, logout } = useAuth();
    
  const notifications = 4;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#FFFFFF] shadow-sm p-6 flex items-center justify-between w-full z-10 relative">
      <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className="relative text-[#9A9A9A]  ">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search something here"
          className="pl-8 pr-2  px-4 py-3 border border-gray-300 rounded-xl  text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative text-[#9A9A9A] w-6 h-6 ">
          <img src={bell} alt="bell" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-orange rounded-full">
              {notifications}
            </span>
          )}
        </button>

        <div className="relative gap-3" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <img
              src={user?.profile_photo}
              alt="Profile"
              className="w-12 h-12 rounded-[10px]"
            />
            
            <span className="text-base font-medium text-left text-[#232323] hidden md:inline leading-[150%]">
              {user?.name} <br />
              <span className="text-xs font-medium text-[#9A9A9A] hidden md:inline leading-[150%]">
                {user?.email}
              </span>
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} strokeWidth={2.5} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors"
              >
                <span>Settings</span>
              </button>
              <button
                onClick={() => { 
                  logout(); 
                  setShowDropdown(false); 
                }}  
                className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors border-t border-gray-100"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
