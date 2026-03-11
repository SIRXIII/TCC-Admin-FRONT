import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/SVG/logo-black.svg";
import dash from "../assets/SVG/dash.svg";
import dashwhite from "../assets/SVG/dashwhite.svg";
import traveler from "../assets/SVG/traveler.svg";
import travelerwhite from "../assets/SVG/travelerwhite.svg";
import partner from "../assets/SVG/partner.svg";
import partnerwhite from "../assets/SVG/partnerwhite.svg";
import rider from "../assets/SVG/rider.svg";
import riderwhite from "../assets/SVG/riderwhite.svg";
import product from "../assets/SVG/product.svg";
import productwhite from "../assets/SVG/productwhite.svg";
import order from "../assets/SVG/order.svg";
import orderwhite from "../assets/SVG/orderwhite.svg";
import refund from "../assets/SVG/refund.svg";
import refundwhite from "../assets/SVG/refundwhite.svg";
import support from "../assets/SVG/support.svg";
import supportwhite from "../assets/SVG/supportwhite.svg";
import setting from "../assets/SVG/setting.svg";
import settingwhite from "../assets/SVG/settingwhite.svg";
import logout from "../assets/SVG/logout.svg";
import logoutwhite from "../assets/SVG/logoutwhite.svg";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  {
    title: "MENU",
    links: [
      { icon: dash, iconActive: dashwhite, label: "Dashboard", link: "/" },
      {
        icon: traveler,
        iconActive: travelerwhite,
        label: "Travelers",
        link: "/travelers",
      },
      {
        icon: partner,
        iconActive: partnerwhite,
        label: "Partners",
        link: "/partners",
      },
      { icon: rider, iconActive: riderwhite, label: "Riders", link: "/riders" },

      {
        icon: product,
        iconActive: productwhite,
        label: "Products",
        link: "/products",
      },
      { icon: order, iconActive: orderwhite, label: "Orders", link: "/orders" },
      {
        icon: refund,
        iconActive: refundwhite,
        label: "Refund",
        link: "/refund",
      },
    ],
  },
  {
    title: "OTHER",
    links: [
      {
        icon: support,
        iconActive: supportwhite,
        label: "Support",
        link: "/support",
      },

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

  const { logout } = useAuth();


  const handleLogout = () => {
    logout();

    setIsOpen(false);

  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? "block" : "hidden"
          }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 z-40 pt-4 px-7 pb-8 bg-white text-[#4F4F4F] shadow-md
          h-screen w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static flex flex-col `}
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



                 const commonClasses = `
                      relative flex items-center gap-3 px-4 py-4 rounded-lg text-base fw5
                      mx-1 leading-[150%] tracking-[-0.03em] overflow-hidden
                      text-[#4F4F4F] transition-all duration-500 ease-out
                      hover:shadow-lg hover:-translate-y-1 origin-center hover:text-white
                      before:absolute before:inset-0 before:bg-[#F77F00]/70 before:scale-x-0 before:origin-left
                      before:transition-transform before:duration-500 before:ease-out before:z-0
                      hover:before:scale-x-100 before:rounded-lg
                      [&>*]:relative [&>*]:z-10
                      ${isActive ? "bg-[#F77F00] text-white fw6 shadow-md scale-[1.02]" : ""}
                    `;

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
                      <span className="relative z-10 ">{label}</span>
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
