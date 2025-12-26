import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../services/api";
import echo from "../../../echo";
import { useFirebaseMessages } from "../../hooks/useFirebaseMessages";
import { listenToConversation, listenToUnreadMessages, sendMessage, markMessagesAsRead } from "../../services/firebaseMessaging";
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
  
  // Firebase real-time messages
  const { messages: firebaseMessages, loading: firebaseLoading } = useFirebaseMessages(ticketId);

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
      const dateValue = msg.created_at || msg.timestamp;
      if (!dateValue) return groups;
      
      // Handle timestamp (number) or date string
      const dateStr = typeof dateValue === 'number' 
        ? new Date(dateValue).toISOString() 
        : dateValue;
      
      const key = formatDate(dateStr);
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
      return groups;
    }, {});
  };


  // Load ticket details and initial messages from API
  useEffect(() => {
    const loadTicket = async () => {
      try {
        const res = await API.get(`/support-tickets/${ticketId}/messages`);
        const ticketData = res.data.data || [];
        setTicket(ticketData);
        
        // Mark messages as read when viewing conversation
        if (currentUser?.id) {
          try {
            await markMessagesAsRead(ticketId, currentUser.id.toString());
          } catch (error) {
            console.error("Error marking messages as read:", error);
          }
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
      }
    };
    loadTicket();
  }, [ticketId, currentUser?.id]);

  // Merge Firebase messages with API messages
  useEffect(() => {
    if (firebaseMessages && firebaseMessages.length > 0) {
      // Use Firebase messages as primary source for real-time updates
      const formattedMessages = firebaseMessages.map(msg => {
        // Handle Firestore Timestamp objects - convert to milliseconds
        let timestamp = msg.timestamp;
        if (!timestamp && msg.created_at) {
          // Firestore Timestamp has toMillis() method
          if (msg.created_at.toMillis) {
            timestamp = msg.created_at.toMillis();
          } else if (typeof msg.created_at === 'object' && msg.created_at.seconds) {
            timestamp = msg.created_at.seconds * 1000;
          } else {
            timestamp = new Date(msg.created_at).getTime();
          }
        }
        if (!timestamp) timestamp = Date.now();
        
        // Convert created_at to ISO string
        let created_at = msg.created_at;
        if (created_at && created_at.toMillis) {
          created_at = new Date(created_at.toMillis()).toISOString();
        } else if (created_at && typeof created_at === 'object' && created_at.seconds) {
          created_at = new Date(created_at.seconds * 1000).toISOString();
        } else if (!created_at || typeof created_at !== 'string') {
          created_at = new Date(timestamp).toISOString();
        }
        
        return {
          id: msg.id,
          message: msg.message || msg.text || msg.content,
          sender_id: msg.sender_id || msg.senderId,
          receiver_id: msg.receiver_id || msg.receiverId,
          sender_type: msg.sender_type || msg.senderType,
          type: msg.type || 'text',
          isRead: msg.isRead !== undefined ? msg.isRead : false,
          order_id: msg.order_id,
          created_at: created_at,
          timestamp: timestamp
        };
      }).filter(msg => msg.message); // Filter out messages without content
      
      setMessages(formattedMessages);
    }
  }, [firebaseMessages]);

  // Listen to conversation metadata for unread count and notifications
  useEffect(() => {
    if (!ticketId || !currentUser?.id) return;

    const unsubscribeConversation = listenToConversation(ticketId, (conversation) => {
      if (conversation && conversation.unreadCount > 0) {
        // Show notification if there are unread messages
        if (conversation.lastMessage) {
          const notificationMessage = conversation.lastMessage.length > 50 
            ? conversation.lastMessage.substring(0, 50) + '...' 
            : conversation.lastMessage;
          
          toast.info(`New message: ${notificationMessage}`, {
            position: "top-right",
            autoClose: 5000,
          });

          // Browser notification (if permission granted)
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Message", {
              body: notificationMessage,
              icon: "/favicon.ico",
              tag: `message-${ticketId}`,
            });
          }
        }
      }
    });

    return () => {
      unsubscribeConversation();
    };
  }, [ticketId, currentUser?.id]);

  // Listen to new unread messages for real-time notifications
  useEffect(() => {
    if (!ticketId || !currentUser?.id) return;

    // Get current user ID in different formats (RID-1, PAR-2, etc.)
    const currentUserId = currentUser.id?.toString() || currentUser.rider_id || currentUser.partner_id || '';
    
    const unsubscribeUnread = listenToUnreadMessages(ticketId, currentUserId, (newMessage) => {
      // Only show notification if message is not from current user
      if (newMessage && newMessage.message) {
        const messageText = newMessage.message.length > 50 
          ? newMessage.message.substring(0, 50) + '...' 
          : newMessage.message;
        
        // Get sender name - Parse PAR-2 to "Partner 2", RID-1 to "Rider 1"
        const senderId = newMessage.senderId || newMessage.sender_id || 'Someone';
        let senderName = 'Someone';
        
        if (senderId.startsWith('RID-')) {
          const riderId = senderId.replace('RID-', '');
          senderName = `Rider ${riderId}`;
        } else if (senderId.startsWith('PAR-')) {
          const partnerId = senderId.replace('PAR-', '');
          senderName = `Partner ${partnerId}`;
        } else if (senderId.startsWith('TRA-')) {
          const travelerId = senderId.replace('TRA-', '');
          senderName = `Traveler ${travelerId}`;
        } else {
          senderName = senderId;
        }
        
        toast.info(`${senderName}: ${messageText}`, {
          position: "top-right",
          autoClose: 5000,
        });

        // Browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Message from ${senderName}`, {
            body: messageText,
            icon: "/favicon.ico",
            tag: `message-${ticketId}-${newMessage.id}`,
          });
        }
      }
    });

    return () => {
      unsubscribeUnread();
    };
  }, [ticketId, currentUser?.id]);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Browser notification permission granted");
        }
      });
    }
  }, []);

  // Fallback: Keep Echo/Pusher for backward compatibility (optional)
  useEffect(() => {
    const channel = echo.channel(`support.ticket.${ticketId}`);
    channel.listen(".SupportMessageSent", (msg) => {
      // Only add if not already in Firebase messages
      setMessages((prev) => {
        const updated = prev.filter((m) => !(m.temp && m.tempId === msg.tempId));
        if (!updated.find((m) => m.id === msg.id)) {
          updated.push({
            ...msg,
            timestamp: msg.created_at ? new Date(msg.created_at.replace(" ", "T")).getTime() : Date.now()
          });
        }
        return updated.sort((a, b) => {
          const timeA = a.timestamp || safeDate(a.created_at).getTime() || 0;
          const timeB = b.timestamp || safeDate(b.created_at).getTime() || 0;
          return timeA - timeB;
        });
      });
    });
    return () => channel.stopListening(".SupportMessageSent");
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
    if (!newMessage.trim() || !ticketId) return;

    const tempMessage = {
      tempId: `temp-${Date.now()}`,
      message: newMessage,
      sender_id: currentUser?.id,
      senderId: currentUser?.id?.toString(),
      sender_type: userType,
      created_at: new Date().toISOString(),
      temp: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    const messageText = newMessage;
    setNewMessage("");

    try {
      // Helper function to get Firebase-formatted user ID
      const getFirebaseUserId = (user, userTypeStr) => {
        if (!user) return '';
        
        // Check for specific user type IDs first
        if (user.partner_id) return `PAR-${user.partner_id}`;
        if (user.rider_id) return `RID-${user.rider_id}`;
        if (user.traveler_id) return `TRAV-${user.traveler_id}`;
        
        // Check user type from localStorage or user object
        const type = userTypeStr || user.type || userType || '';
        const userId = user.id || user.user_id;
        
        if (userId) {
          const typeLower = type.toLowerCase();
          if (typeLower === 'partner') return `PAR-${userId}`;
          if (typeLower === 'rider') return `RID-${userId}`;
          if (typeLower === 'traveler') return `TRAV-${userId}`;
          // For admin or unknown types, check if it's numeric (might be admin ID)
          // Admin might not have a prefix, so return as-is
          return userId.toString();
        }
        
        return '';
      };

      // Get current user's Firebase ID
      const senderId = getFirebaseUserId(currentUser, userType);
      
      // Get ticket sender's Firebase ID
      const ticketSenderType = ticket?.sender?.type || '';
      const ticketSenderId = ticket?.sender?.id || ticket?.user_id || '';
      const ticketSenderFirebaseId = ticketSenderId && ticketSenderType 
        ? getFirebaseUserId({ id: ticketSenderId, type: ticketSenderType }, ticketSenderType)
        : '';
      
      // Determine receiver ID
      let receiverId = '';
      
      // If we have existing messages, use them to determine receiver
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        // If last message sender is not current user, receiver is that sender
        if (lastMessage.senderId && lastMessage.senderId !== senderId) {
          receiverId = lastMessage.senderId;
        } 
        // If last message receiver is current user, sender of that message is the receiver
        else if (lastMessage.receiverId && lastMessage.receiverId === senderId) {
          receiverId = lastMessage.senderId;
        }
        // Otherwise use receiverId from last message
        else if (lastMessage.receiverId) {
          receiverId = lastMessage.receiverId;
        }
      }
      
      // If still no receiver, determine from ticket sender
      if (!receiverId) {
        if (senderId === ticketSenderFirebaseId) {
          // Current user is the ticket sender, receiver should be admin
          // For admin, we might use a default or check conversation participants
          receiverId = 'ADMIN-1'; // Default admin ID, adjust based on your system
        } else if (ticketSenderFirebaseId) {
          // Current user is admin or different user, receiver is ticket sender
          receiverId = ticketSenderFirebaseId;
        }
      }
      
      if (!senderId) {
        console.error('Sender ID not found', { currentUser, userType });
        throw new Error(`Sender ID not found. Current user: ${JSON.stringify(currentUser)}, User type: ${userType}`);
      }
      
      if (!receiverId) {
        console.error('Receiver ID not found', {
          senderId,
          ticket,
          messages: messages.length,
          ticketSenderFirebaseId
        });
        throw new Error(`Receiver ID not found. Sender: ${senderId}, Ticket sender: ${ticketSenderFirebaseId}`);
      }

      // Send message via Firebase
      await sendMessage(ticketId, {
        senderId: senderId,
        receiverId: receiverId,
        message: messageText,
        order_id: ticket?.order_id || null
      });

      // Also send via API for backend sync (optional)
      try {
        await API.post("/support-tickets/messages", {
          ticket_id: ticketId,
          message: messageText,
        });
      } catch (apiError) {
        console.warn("API send failed, but Firebase message sent:", apiError);
      }

      // Remove temp message - Firebase listener will add the real one
      setMessages((prev) =>
        prev.filter((msgItem) => msgItem.tempId !== tempMessage.tempId)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });

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

                // Check if message is from current user
                // Handle both numeric IDs and Firebase format (PAR-2, RID-1)
                const msgSenderId = msg.sender_id || msg.senderId || '';
                const currentUserFirebaseId = 
                  currentUser?.partner_id ? `PAR-${currentUser.partner_id}` :
                  currentUser?.rider_id ? `RID-${currentUser.rider_id}` :
                  currentUser?.traveler_id ? `TRA-${currentUser.traveler_id}` :
                  currentUser?.id && currentUser?.type === 'Partner' ? `PAR-${currentUser.id}` :
                  currentUser?.id && currentUser?.type === 'Rider' ? `RID-${currentUser.id}` :
                  currentUser?.id && currentUser?.type === 'Traveler' ? `TRA-${currentUser.id}` :
                  currentUser?.id?.toString() || '';
                
                const isCurrentUser =
                  msg.temp ||
                  (msgSenderId === currentUserFirebaseId) ||
                  (msgSenderId === currentUser?.id?.toString()) ||
                  (Number(msgSenderId) === Number(currentUser?.id)) ||
                  (Number(msgSenderId) === Number(currentUser?.partner_id)) ||
                  (Number(msgSenderId) === Number(currentUser?.rider_id)) ||
                  (Number(msgSenderId) === Number(currentUser?.traveler_id)) ||
                  (Number(msg.sender_id) === Number(currentUser?.id) &&
                    String(msg.sender_type).toLowerCase() ===
                    String(userType).toLowerCase());

                const timeText = msg.temp
                  ? "Just now"
                  : msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
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
