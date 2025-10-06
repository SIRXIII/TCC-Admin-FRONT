import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";
import echo from "../../../echo";
import DefaultProfile from "../../assets/Images/rid_profile.jpg";
import backward from "../../assets/SVG/backward.svg";
import notics from "../../assets/SVG/notics.svg";
import Breadcrumb from "../../components/Breadcrumb";

const ChatSupport = () => {
  const { id } = useParams();
  const ticketId = id;
  const currentUser = JSON.parse(localStorage.getItem("auth_user"));
  const userType = localStorage.getItem("type");

  const [messages, setMessages] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);


  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("In Progress");

  const options = ["In Progress", "Rejected", "Pending"];

  const handleSelect = async (option) => {
    setStatus(option);
    setOpen(false);

    try {
      await API.post(`/support-tickets/${ticketId}/status`, { status: option });

     
      setTicket((prev) => ({ ...prev, status: option }));
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(ticket?.status || "In Progress");
    }

  };

  useEffect(() => {
    if (ticket?.status) {
      setStatus(ticket.status);
    }
  }, [ticket]);


  // console.log("tickets", ticket);
  const safeDate = (val) => {
    if (!val) return new Date(0);
    return new Date(val.replace(" ", "T"));
  };

  const formatDate = (val) => {
    if (!val) return "Unknown";
    const d = safeDate(val);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const groupMessagesByDate = (msgs) => {
    return msgs.reduce((groups, msg) => {
      if (!msg.created_at) return groups;
      const key = formatDate(msg.created_at);
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
      return groups;
    }, {});
  };


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await API.get(`/support-tickets/${ticketId}/messages`);
        const ticket = res.data.data || [];
        setTicket(ticket);
        const sorted = (res.data.data.messages || [])

          .filter((msg) => msg.message)
          .sort((a, b) => safeDate(a.created_at) - safeDate(b.created_at));
        setMessages(sorted);
      } catch (error) {
        console.error(error);
      }
    };
    loadMessages();
  }, [ticketId]);


  useEffect(() => {
    const channel = echo.channel(`support.ticket.${ticketId}`);
    channel.listen(".SupportMessageSent", (msg) => {
      setMessages((prev) => {
        const updated = prev.filter((m) => !(m.temp && m.tempId === msg.tempId));
        if (!updated.find((m) => m.id === msg.id)) updated.push(msg);
        return updated.sort((a, b) => safeDate(a.created_at) - safeDate(b.created_at));
      });
    });
    return () => channel.stopListening(".SupportMessageSent");
  }, [ticketId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      tempId: `temp-${Date.now()}`,
      message: newMessage,
      sender_id: currentUser?.id,
      sender_type: userType,
      created_at: new Date().toISOString(),
      temp: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const res = await API.post("/support-tickets/messages", {
        ticket_id: ticketId,
        message: newMessage,
      });
      const realMessage = { ...res.data.message, sender_type: userType };
      setMessages((prev) =>
        prev.map((msgItem) =>
          msgItem.tempId === tempMessage.tempId ? realMessage : msgItem
        )
      );
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.filter((msgItem) => msgItem.tempId !== tempMessage.tempId)
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3">

      <Breadcrumb
                  items={[
                    { label: "Dashboard", path: "/" },
                    { label: "Support Ticket", path: "/support" },
      
                    { label: "Details" },
                  ]}
                />


      <div className="flex gap-2 items-center">
       
        <Link to="/support" className="group">
              <img
                src={backward}
                alt="backward"
                className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
        <h2 className="text-xl fw6 font-roboto text-[#232323]">{ticket?.ticket_id}</h2>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border border-[#00000033] p-4 flex flex-col gap-3">

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
              <p className="text-sm fw6 text-[#232323]">{currentUser?.name}</p>
              <p className="text-xs text-[#9A9A9A] fw5">Online</p>
            </div>
          </div>
         {!(ticket?.order_id && userType === "User") && (
          <div className="relative inline-block">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-md px-3 py-1 text-sm text-[#B2A23F] bg-[#FEFCDD]"
            >
              {status}
              <FiChevronDown size={16} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-md border border-gray-200 z-50">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
         )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 leading-[150%] tracking-[-3%]">
            <img src={notics} alt="notics" className="w-6 h-6" />
            <h3 className="text-[#232323] fw5 text-[16px]">{ticket?.subject}</h3>
          </div>
          <p className="text-sm fw5 text-[#AAAAAA] leading-[150%] tracking-[-3%]">
            {ticket?.message}
          </p>
          <div className="flex items-center">
            <div className="flex-grow border-t border-[#DBDBDB]"></div>
            <span className="px-[9px] py-[7px] text-xs text-[#4B5563] bg-[#F4F3F3] rounded-[19px]">
              Request Details
            </span>
            <div className="flex-grow border-t border-[#DBDBDB]"></div>
          </div>
        </div>


        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400">No messages yet</p>
          )}

          {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
            <div key={date} className="flex flex-col gap-3">

              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-xs text-gray-500">{date}</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {msgs.map((msg) => {
                if (!msg.message) return null;

                const isCurrentUser =
                  msg.temp ||
                  (Number(msg.sender_id) === Number(currentUser?.id) &&
                    String(msg.sender_type).toLowerCase() ===
                    String(userType).toLowerCase());

                const timeText = msg.temp
                  ? "Just now"
                  : msg.created_at
                    ? new Date(msg.created_at.replace(" ", "T")).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                    : "";

                let tick = "";
                if (msg.temp) tick = "⏳";
                else if (msg.status === "sent") tick = "✓";
                else if (msg.status === "failed") tick = "❌";

                return (
                  <div
                    key={msg.id ?? msg.tempId}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg max-w-[70%] break-words text-xs
                        ${isCurrentUser ? "bg-[#FEF2E6]" : "bg-[#F5F5F5]"}`}
                    >
                      <p className="m-0">{msg.message}</p>
                      <span className="text-[10px] text-[#9A9A9A] flex-shrink-0 whitespace-nowrap">
                        {timeText} {isCurrentUser && tick}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>


      {!(ticket?.order_id && userType === "User") && (
  <div className="flex items-center gap-3 p-4">
    <input
      type="text"
      placeholder="Type something here"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      className="flex-1 bg-[#F4F4F4] text-[#9A9A9A] rounded-lg px-4 py-3 text-sm focus:outline-none"
    />
    <button
      onClick={handleSend}
      className="bg-[#F77F00] text-[#FFFFFF] p-3 gap-2 text-xs rounded-xl h-[42px] w-[80px] transition hover:bg-[#e66f00]"
    >
      Send
    </button>
  </div>
)}

      </div>
    </div>
  );
};

export default ChatSupport;
