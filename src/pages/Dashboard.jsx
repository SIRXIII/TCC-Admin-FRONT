import React from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import Widgets from "../components/Dashboard/Widgets";
import Travel from "../components/Dashboard/Travel";
import PartnersBySale from "../components/Dashboard/PartnersBySale";
import AlertPlane from "../components/Dashboard/AlertPlane";
import ChartsSection from "../components/Dashboard/ChartsSection";
const Dashboard = () => {
  return (
   <div className=" flex flex-col top-[120px] left-[281px] gap-6">

    <WelcomeCard />

      <Widgets />

      <ChartsSection />

      <Travel />
      
      <PartnersBySale />

      <AlertPlane />
   </div>

  );
};

export default Dashboard;
