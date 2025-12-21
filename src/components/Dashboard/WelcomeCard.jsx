import React from "react";
import Image from "../../assets/Images/bg_dash1.jpg";
import calendar from "../../assets/SVG/calendar.svg";

const WelcomeCard = () => {
  const today = new Date();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  return (
    <div
       className="w-full lg:min-w-[1135px] h-[221px] rounded-lg border border-[#D5D7DA] mx-auto relative"
      style={{
        background: `
         radial-gradient(
           99.4% 309.38% at 98.09% 0%, 
           rgba(192, 74, 63, 0.3) 0%, 
           rgba(85, 107, 47, 0.3) 50%, 
           rgba(216, 168, 93, 0.3) 100%
         ),
         url(${Image})
       `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxShadow: "0px 0px 1px 0px #171A1F21",
      }}
    >
      <div className="absolute inset-4 sm:inset-5 rounded-lg p-4 sm:p-8 bg-white/5 backdrop-blur-sm border border-white/20 text-white flex flex-col justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-200 mb-2">
          <img src={calendar} alt="" />
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-[32px] fw6 font-roboto mb-1 sm:mb-2 leading-[120%] text-[#FFFFFF] tracking-[-3%]">
          Welcome Back, Admin!
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
          Here’s your real-time overview of platform activity, partner
          performance, and traveler engagement.
        </p>
      </div>
    </div>
  );
};

export default WelcomeCard;
