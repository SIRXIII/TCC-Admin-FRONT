import React from "react";
import Paypal from "../../assets/SVG/paypal.svg";
import { orderData } from "../../data/OrderData";
import backward from "../../assets/SVG/backward.svg";
import { Link } from "react-router-dom";
const OrdersDetail = () => {
  const {
    orderInfo,
    items,
    transactions,
    customer,
    partner,
    contact,
    shippingAddress,
    billingAddress,
  } = orderData;

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
          <p>Dashboard</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p>Orders </p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Assign Order</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <Link to="/orders" className="group">
                <img
                  src={backward}
                  alt="backward"
                  className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>
              <span className="text-2xl fw6 font-roboto text-[#232323]">
                Order #4668
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Link
              to="/orders/assignrider"
              className="border border-[#F77F00] bg-[#F77F00] rounded-lg px-4 py-3 gap-2 text-xs  text-[#FFFFFF]"
            >
              Add Riders
            </Link>
          </div>
        </div>
        <div className="  min-h-screen gap-6 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm leading-[150%] tracking-[-3%]">
                <h2 className=" text-lg fw6 text-[#232323] ">
                  Order Information
                </h2>
                <div className="flex flex-cols-5 justify-between text-sm text-[#9A9A9A] fw5 gap-2 ">
                  <div>
                    <p className="">Date</p>
                    <p className="text-[#232323]">{orderInfo.date}</p>
                  </div>
                  <div>
                    <p className="">Items</p>
                    <p className="text-[#232323]">{orderInfo.items}</p>
                  </div>
                  <div>
                    <p className="">ETA</p>
                    <p className="text-[#232323]">{orderInfo.eta}</p>
                  </div>
                  <div className=" justify-center">
                    <p className=" ">Status</p>
                    <span className="bg-[#E1FDFD] text-[#3E77B0] text-xs px-3 py-1 rounded-md">
                      {orderInfo.status}
                    </span>
                  </div>
                  <div>
                    <p className="">Total</p>
                    <p className="text-[#232323]">${orderInfo.total}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 rounded-2xl shadow-sm text-[#232323]  leading-[150%] tracking-[-3%]">
                <h2 className="text-lg fw6 ">Items</h2>
                <div className="p-2.5 gap-2.5 ">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-4 text-xs fw5 "
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover "
                        />
                        <p className="">{item.name}</p>
                      </div>
                      <div className=" flex gap-8 ">
                        <span>${item.price}</span>
                        <span>{item.qty}</span>
                        <span className="">${item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className=" p-6 gap-3 text-sm shadow-sm rounded-2xl bg-[#F9F9F9] fw5 text-[#232323] leading-[150%] tracking-[-3%]">
                  <div className="flex justify-between  border-b  border-[#D9D9D9]  ">
                    <p>Subtotal</p>
                    <p className="">$1277.7</p>
                  </div>
                  <div className="flex justify-between  ">
                    <p>Total</p>
                    <p>$1202.7</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-[#FFFFFF] p-6 rounded-2xl shadow-sm gap-6 ">
                <h2 className="text-lg fw6 text-[#232323]">Transactions</h2>
                <div className="flex  justify-between text-sm fw5">
                  <div className="flex flex-cols-3 items-center justify-between gap-3">
                    <img src={Paypal} alt="" className="flex justify-center" />

                    <div className="flex flex-col gap-1 ">
                      <span className="text-[#232323]">
                        Payment via
                        {transactions.method}
                      </span>
                      <p className="text-xs text-[#9A9A9A] fw4">
                        Paypal fees: ${transactions.fees}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9A9A9A]">
                    <p>Date</p>
                    <p className="text-[#232323]">{transactions.date}</p>
                  </div>
                  <div className="text-[#9A9A9A] ">
                    <p>Total</p>
                    <p className="text-[#232323]">${transactions.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6  text-[#232323]">Customer</h2>
                <div className="flex items-center gap-2.5">
                  <img
                    src={customer.img}
                    alt={customer.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm fw6 text-[#232323]">{customer.name}</p>
                    <p className="text-xs fw4 text-[#6C6C6C]">{customer.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-l shadow-sm">
                <h2 className="text-lg fw6  text-[#232323]">Partner</h2>
                <div className="flex items-center gap-2.5">
                  <img
                    src={partner.img}
                    alt={partner.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="fw6 text-sm text-[#232323]">{partner.name}</p>
                    <p className="text-xs text-[#6C6C6C]">{partner.email}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#232323]">{partner.address}</p>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6 text-[#232323]">Contact Person</h2>
                <p className="fw5 text-sm text-[#232323]">{contact.name}</p>
                <p className="text-sm fw4 text-[#232323]">{contact.email}</p>
                <p className="text-sm fw4 text-[#6C6C6C] ">{contact.phone}</p>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6 text-[#232323]">Shipping Address</h2>
                <p className="fw5 text-sm text-[#232323]">{shippingAddress.name}</p>
                <p className="text-sm fw4 text-[#232323]">
                  {shippingAddress.address}
                </p>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6 text-[#232323]">Billing Address</h2>
                <p className="fw5 text-sm text-[#232323]">{billingAddress.name}</p>
                <p className="text-sm fw4 text-[#232323]">
                  {billingAddress.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersDetail;
