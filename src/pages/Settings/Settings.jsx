import React, { useState } from "react";
import SettingSidebar from "./SettingSidebar";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import TwoFA from "./2FA";
import Breadcrumb from "../../components/Breadcrumb";
import backward from "../../assets/SVG/backward.svg";
import { FiChevronRight } from "react-icons/fi";
import pro from "../../assets/SVG/pro.svg";
import password from "../../assets/SVG/password.svg";
import FA from "../../assets/SVG/FA.svg";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);

  const settingsCards = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Manage your personal details and profile information",
      icon: pro,
    },
    {
      id: "password",
      title: "Password",
      description: "Update your password and security settings",
      icon: password,
    },
    {
      id: "2fa",
      title: "2FA Verification",
      description: "Enable two-factor authentication for extra security",
      icon: FA,
    },
  ];

  return (
    <div className="flex flex-col p-2 gap-4">
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Setting" }]}
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Setting
        </h2>

        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          View and manage your profile and account setting.
        </p>
      </div>

      {!activeTab ? (
        // Overview Cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className="bg-white border border-[#00000033] rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-[#F77F00] group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FEF2E6] flex items-center justify-center group-hover:bg-[#F77F00] transition-colors">
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all"
                    />
                  </div>
                  <h3 className="text-lg fw6 text-[#232323] leading-[150%]">
                    {card.title}
                  </h3>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#F77F00] transition-colors" />
              </div>
              <p className="text-sm text-[#6C6C6C] leading-[150%]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        // Detail Page
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="lg:flex w-full lg:w-[330px] lg:gap-6 hidden lg:block">
            <SettingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex-1 w-full">
            <button
              onClick={() => setActiveTab(null)}
              className="mb-4 text-sm fw4 font-inter text-[#F77F00] flex items-center gap-2 hover:underline"
            >
              <img src={backward} alt="backward" className="w-4 h-4" />
              Back to Settings
            </button>

            {activeTab === "personal" && <PersonalInfo />}
            {activeTab === "password" && <Password />}
            {activeTab === "2fa" && <TwoFA />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;