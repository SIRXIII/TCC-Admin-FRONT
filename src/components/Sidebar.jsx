import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/SVG/logo-black.svg";
import dash from "../assets/SVG/dash.svg";
import dashwhite from "../assets/SVG/dashwhite.svg";
import product from "../assets/SVG/product.svg";
import productwhite from "../assets/SVG/productwhite.svg";
import order from "../assets/SVG/order.svg";
import orderwhite from "../assets/SVG/orderwhite.svg";
import returns from "../assets/SVG/returns.svg";
import returnswhite from "../assets/SVG/returnswhite.svg";
import review from "../assets/SVG/review.svg";
import reviewwhite from "../assets/SVG/reviewwhite.svg";
import payout from "../assets/SVG/payout.svg";
import payoutwhite from "../assets/SVG/payoutwhite.svg";
import report from "../assets/SVG/report.svg";
import reportwhite from "../assets/SVG/reportwhite.svg";
import help from "../assets/SVG/help.svg";
import helpwhite from "../assets/SVG/helpwhite.svg";
import setting from "../assets/SVG/setting.svg";
import settingwhite from "../assets/SVG/settingwhite.svg";
import logout from "../assets/SVG/logout.svg";
import logoutwhite from "../assets/SVG/logoutwhite.svg";

const navLinks = [
  {
    title: "MENU",
    links: [
      { icon: dash, iconActive: dashwhite, label: "Dashboard", link: "/" },
      {
        icon: product,
        iconActive: productwhite,
        label: "Products",
        link: "/products",
      },
      { icon: order, iconActive: orderwhite, label: "Orders", link: "/orders" },
      {
        icon: returns,
        iconActive: returnswhite,
        label: "Returns",
        link: "/returns",
      },
      {
        icon: review,
        iconActive: reviewwhite,
        label: "Reviews",
        link: "/reviews",
      },
      {
        icon: payout,
        iconActive: payoutwhite,
        label: "Payouts",
        link: "/payouts",
      },
      {
        icon: report,
        iconActive: reportwhite,
        label: "Reports",
        link: "/reports",
      },
    ],
  },
  {
    title: "OTHER",
    links: [
      { icon: help, iconActive: helpwhite, label: "Help", link: "/help" },
      {
        icon: setting,
        iconActive: settingwhite,
        label: "Settings",
        link: "/settings",
      },
      {
        icon: logout,
        iconActive: logoutwhite,
        label: "Logout",
        link: "/logout",
      },
    ],
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");

    setIsOpen(false);

    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 z-40 pt-4 px-8 pb-8 bg-white text-[#4F4F4F] shadow-md
          h-screen w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static flex flex-col`}
      >
        <div className="mb-8 text-center">
          <img src={logo} alt="Logo" className="mx-auto w-14.5 h-16" />
        </div>
        <div className="space-y-6   overflow-y-auto custom-scrollbar">
          {navLinks.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs fw5 text-[#9A9A9A] mb-4 leading-[150%] tracking-[0.17em]">
                {section.title}
              </p>
              <nav className="flex flex-col gap-2">
                {section.links.map(({ icon, iconActive, label, link }) => {
                  const isActive =
                    location.pathname === link ||
                    location.pathname.startsWith(link + "/");

                  const commonClasses = `flex items-center gap-3 px-4 py-4 rounded-lg text-base fw5 leading-[150%] tracking-[-0.03em] transition-colors ${
                    isActive
                      ? "bg-[#F77F00] text-white fw6"
                      : "text-[#4F4F4F] hover:bg-[#F77F00] hover:text-white"
                  }`;

                  if (label === "Logout") {
                    return (
                      <button
                        key={label}
                        onClick={handleLogout}
                        className={commonClasses}
                      >
                        <img
                          src={isActive && iconActive ? iconActive : icon}
                          alt={label}
                          className="w-5 h-5"
                        />
                        {label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link}
                      to={link}
                      className={commonClasses}
                     
                      onClick={() => setIsOpen(false)}
                    >
                      <img
                        src={isActive && iconActive ? iconActive : icon}
                        alt={label}
                        className="w-5 h-5"
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
