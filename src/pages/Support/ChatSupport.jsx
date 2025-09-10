import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import DefaultProfile from "../../assets/Images/rid_profile.jpg";
import backward from "../../assets/SVG/backward.svg";
import notics from "../../assets/SVG/notics.svg";

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello", time: "13:01" },
    {
      id: 2,
      sender: "user",
      text: "What do you think about this?",
      time: "13:01",
    },
    { id: 3, sender: "admin", text: "Well", time: "13:01" },
    {
      id: 4,
      sender: "admin",
      text: "Basically this looks good",
      time: "13:01",
    },
    {
      id: 5,
      sender: "admin",
      text: "Can you suggest other variants?",
      time: "13:01",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "admin",
        text: newMessage,
        time: "Now",
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex items-center text-xs gap-1 leading-[150%] tracking-[-3%]">
        <p className="text-[#6C6C6C]">Dashboard</p>
        <span className=" text-[#9A9A9A]">/</span>
        <p className="text-[#6C6C6C]">Support Ticket</p>
        <span className=" text-[#9A9A9A]">/</span>
        <p className="text-[#F77F00]">Details</p>
      </div>

      <div className="flex gap-2 items-center">
        <img src={backward} alt="backward" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-[#232323]">TCK-2001</h2>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border  border-[#00000033] p-4 flex flex-col gap-3  leading-[150%] tracking-[-3%]  ">
        <div className="flex justify-between items-center gap-3 border-b-[0.6px] border-[#D9D9D9] p-4">
          <div className="flex gap-3">
            <div className="relative">
              <img
                src={DefaultProfile}
                alt="User"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#088B3A] border-2 border-white rounded-full"></span>
            </div>
            <div className="leading-[150%] tracking-[-3%]">
              <p className="text-sm fw6 text-[#232323] ">Stephen Kim</p>
              <p className="text-xs text-[#9A9A9A] fw5">Online</p>
            </div>
          </div>

          <button className=" flex items-center gap-2  rounded-md px-3 py-1 text-sm text-[#B2A23F] bg-[#FEFCDD]">
            In Progress
            <FiChevronDown size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-5 ">
          <div className="flex  gap-3 leading-[150%] tracking-[-3%]">
            <img src={notics} alt="notics" className="w-6 h-6" />
            <h3 className="text-[#232323] fw5 text-[16px]">
              Refund not received
            </h3>
          </div>

          <p className="text-sm fw5 text-[#AAAAAA] leading-[150%] tracking-[-3%] ">
            Lorem ipsum is a placeholder text commonly used to demonstrate the
            visual form of a document or a typeface without relying on
            meaningful content. Lorem ipsum may be used as a placeholder before
            final copy is available. Lorem ipsum is a placeholder.
          </p>
          <div className="flex items-center ">
            <div className="flex-grow border-t border-[#DBDBDB]"></div>
            <span className="px-[9px]  py-[7px] text-xs text-[#4B5563] bg-[#F4F3F3] rounded-[19px] ">
              Request Details
            </span>
            <div className="flex-grow border-t border-[#DBDBDB]"></div>
          </div>
        </div>

        {messages.map((msg) =>
          msg.sender === "divider" ? (
            <div key={msg.id} className="flex items-center ">
              <div className="flex-grow border-t border-[#DBDBDB]"></div>
              <span className="px-2 text-xs text-[#9A9A9A] bg-[#F9F9F9] rounded-sm p-3 gap-2.5  ">
                {msg.text}
              </span>
              <div className="flex-grow border-t border-[#DBDBDB]"></div>
            </div>
          ) : (
            <div
              key={msg.id}
              className={`flex flex-col gap-2.5 ${
                msg.sender === "admin" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={` px-3 py-2 rounded-lg text-xs  ${
                  msg.sender === "admin"
                    ? "bg-[#FEF2E6] text-[#232323]"
                    : "bg-[#F5F5F5] text-[#232323]"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <span className="text-xs text-[#9A9A9A] ">{msg.time}</span>
            </div>
          )
        )}

        <div className="flex items-center gap-3 p-4">
          <input
            type="text"
            placeholder="Type something here"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1  bg-[#F4F4F4] text-[#9A9A9A] rounded-lg px-4 py-3 text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-[#F77F00] text-[#FFFFFF] p-3 gap-2 align-middle   text-xs rounded-xl h-[42px] w-[80px]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
