import React, { useState } from "react";
import SettingSidebar from "./SettingSidebar";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import TwoFA from "./2FA";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="flex flex-col p-2 gap-4">
      <div className="flex items-center gap-1  text-xs leading-[150%] tracking-[-3%]">
        <p className="text-[#6C6C6C]">Dashboard</p>
        <span className=" text-[#9A9A9A]">/</span>
        <p className="text-[#F77F00]">Setting</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Setting
        </h2>

        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          View and manage your profile and account setting.
        </p>
      </div>
      <div className="flex gap-6  ">
        <SettingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "personal" && <PersonalInfo />}
        {activeTab === "password" && <Password />}
        {activeTab === "2fa" && <TwoFA />}
      </div>
    </div>
  );
};

export default Settings;
