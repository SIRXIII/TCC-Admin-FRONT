import React from "react";
import { FiShield, FiChevronRight } from "react-icons/fi";
import pro from "../../assets/SVG/pro.svg";
import prowhite from "../../assets/SVG/prowhite.svg";
import password from "../../assets/SVG/password.svg";
import passwordwhite from "../../assets/SVG/passwordwhite.svg";
import FA from "../../assets/SVG/FA.svg";
import FAwhite from "../../assets/SVG/FAwhite.svg";



const SettingSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "personal", label: "Personal Information", icon: pro, iconActive: prowhite },
    { id: "password", label: "Password", icon: password, iconActive: passwordwhite },
    { id: "2fa", label: "2FA Verification", icon: FA , iconActive: FAwhite },
  ];

  return (
    <div className="w-[362px] h-[255px] flex flex-col p-6 gap-6 border border-[#00000033] rounded-lg bg-[#FFFFFF]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center justify-between p-4 gap-3 text-sm fw5 transition rounded-[10px]  leading-[150%] tracking-[-3%] align-middle ${
            activeTab === tab.id
              ? "bg-[#F77F00] text-[#FFFFFF]"
              : "text-[#232323] hover:bg-[#F77F00]/70 hover:text-[#FFFFFF]"
          }`}
        >
          <div className="flex items-center gap-3">
            {typeof tab.icon === "string" ? (
              <img
                src={activeTab === tab.id ? tab.iconActive || tab.icon : tab.icon}
                alt={tab.label}
                className="w-4.5 h-4.5"
              />
            ) : (
              tab.icon
            )}
            {tab.label}
          </div>
          <FiChevronRight className="w-4.5 h-4.5" />
        </button>
      ))}
    </div>
  );
};

export default SettingSidebar;
