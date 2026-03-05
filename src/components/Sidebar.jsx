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
import payout from "../assets/SVG/payout.svg";
import payoutwhite from "../assets/SVG/payoutwhite.svg";
import support from "../assets/SVG/support.svg";
import supportwhite from "../assets/SVG/supportwhite.svg";
import setting from "../assets/SVG/setting.svg";
import settingwhite from "../assets/SVG/settingwhite.svg";
import logoutSvg from "../assets/SVG/logout.svg";
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
      {
        icon: payout,
        iconActive: payoutwhite,
        label: "Card payments",
        link: "/card-payments",
      },
      {
        icon: payout,
        iconActive: payoutwhite,
        label: "Payout Holds",
        link: "/payout-holds",
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
        icon: logoutSvg,
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

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsOpen(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-40 pt-4 px-7 pb-8 bg-white text-[#4F4F4F] shadow-md
          h-screen w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static flex flex-col`}
      >
        <div className="mb-8 text-center">
          <img src={logo} alt="Logo" className="mx-auto w-14.5 h-16" />
        </div>

        <div className="space-y-6 overflow-y-auto custom-scrollbar">
          {navLinks.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs fw5 text-[#9A9A9A] mb-4 leading-[150%] tracking-[0.17em]">
                {section.title}
              </p>
              <nav className="flex flex-col gap-2">
                {section.links.map(({ icon, iconActive, label, link }) => {
                  const isActive = location.pathname === link || location.pathname.startsWith(link + "/");

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
                        onClick={handleLogoutClick}
                        className={commonClasses}
                      >
                        <img
                          src={isActive && iconActive ? iconActive : icon}
                          alt={label}
                          className="w-5 h-5"
                        />

                        <span className="relative z-10">{label}</span>

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
                      <span className="relative z-10">{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>


      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg w-[456px] p-6 flex flex-col">


            <h2 className="text-lg font-semibold mb-4 flex  gap-2">
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#F77F00]"
                >
                  <path
                    d="M13.08 10.965L15 9.045L13.08 7.125"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.32001 9.04492H14.9475"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.82001 15C5.50501 15 2.82001 12.75 2.82001 9C2.82001 5.25 5.50501 3 8.82001 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              <span >Logout?</span>
            </h2>


            <p className="text-gray-600 mb-6">
              You are attempting to log out of Dashboard.
              <br />
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-4 w-full">
              <button
                onClick={cancelLogout}
                className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-3 bg-[#F77F00] text-white rounded-lg flex items-center gap-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#fff]"
                >
                  <path
                    d="M13.08 10.965L15 9.045L13.08 7.125"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.32001 9.04492H14.9475"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.82001 15C5.50501 15 2.82001 12.75 2.82001 9C2.82001 5.25 5.50501 3 8.82001 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>


                Logout
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default Sidebar;
