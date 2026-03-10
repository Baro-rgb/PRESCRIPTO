import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Chatbox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Effect 1: Kiểm tra user authentication
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("🔍 Token check:", token ? "Found" : "Not found");
        
        if (!token) {
          console.log("❌ No token, user not logged in");
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/user/get-profile`, {
          method: 'GET',
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success && data.userData) {
          const userInfo = {
            id: data.userData._id,
            name: data.userData.name,
            email: data.userData.email,
            phone: data.userData.phone || "",
            image: data.userData.image || ""
          };
          console.log("✅ Setting user:", userInfo);
          setUser(userInfo);
          
          localStorage.setItem('user', JSON.stringify(data.userData));
        } else {
          console.log("❌ API failed or invalid response");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          toast.error("Phiên đăng nhập đã hết hạn");
        }
      } catch (error) {
        console.error("🔥 Fetch error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.error("Lỗi kết nối");
      }
      
      setIsLoading(false);
    };

    const handleAuthUpdate = () => {
      console.log("🔄 Auth update detected, refetching user...");
      setIsLoading(true);
      fetchUserProfile();
    };

    fetchUserProfile();
    window.addEventListener('authUpdate', handleAuthUpdate);

    return () => {
      window.removeEventListener('authUpdate', handleAuthUpdate);
    };
  }, []);

  // Effect 2: Setup socket và load chat history khi có user
  useEffect(() => {
    if (!user) {
      if (socket) {
        console.log("🧹 Cleaning up socket due to user logout");
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setChat([]);
      }
      return;
    }

    console.log("🔌 Setting up socket for user:", user.name);
    
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token'),
        userType: 'user'
      }
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      
      // JOIN SUPPORT ROOM KHI CONNECT
      newSocket.emit("join_support", {
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      });
      
      // Load chat history khi connect
      loadChatHistory();
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // 🔥 FIX: LẮNG NGHE TIN NHẮN TỪ ADMIN
    newSocket.on("receive_message", (data) => {
      console.log("📨 User received message:", data);
      
      // 🔥 FIX: CHỈ THÊM TIN NHẮN TỪ ADMIN (không phải từ chính user)
      if (data.senderType === 'admin' || data.senderId === 'admin') {
        setChat((prevChat) => {
          // Tránh duplicate message
          const exists = prevChat.some(msg => 
            msg.timestamp && data.timestamp && 
            new Date(msg.timestamp).getTime() === new Date(data.timestamp).getTime() &&
            msg.text === data.text &&
            msg.senderId === data.senderId
          );
          
          if (!exists) {
            console.log("📝 Adding admin message to chat");
            return [...prevChat, data];
          }
          console.log("⚠️ Message already exists, skipping");
          return prevChat;
        });
      }
    });

    // 🔥 FIX: LẮNG NGHE XÁC NHẬN TIN NHẮN ĐÃ GỬI
    newSocket.on("message_sent", (data) => {
      console.log("✅ Message sent confirmation:", data);
      // Không cần làm gì vì tin nhắn user đã được thêm vào UI ngay lập tức
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
      toast.error("Không thể kết nối chat");
    });

    return () => {
      console.log("🧹 Cleaning up socket");
      newSocket.disconnect();
    };
  }, [user]);

  // Function để load chat history từ API
  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BACKEND_URL}/api/user/chat-history`, {
        method: 'GET',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.messages) {
        console.log("📚 Loaded chat history:", data.messages);
        setChat(data.messages);
        
        // Đánh dấu tin nhắn admin đã đọc
        markAdminMessagesAsRead();
      }
    } catch (error) {
      console.error("❌ Error loading chat history:", error);
    }
  };

  // Function để đánh dấu tin nhắn admin đã đọc
  const markAdminMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${BACKEND_URL}/api/user/mark-admin-messages-read`, {
        method: 'PUT',
        headers: {
          'token': token,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  };

  // 🔥 FIX: Cải thiện function gửi tin nhắn
  const sendMessage = async () => {
    if (message.trim() === "" || !user) return;

    if (!socket || !isConnected) {
      toast.warn("Đang kết nối lại...");
      return;
    }

    const messageText = message.trim();

    // 🔥 FIX: Tạo tin nhắn local ngay lập tức cho UI
    const localMessage = {
      text: messageText,
      senderId: user.id,
      senderType: 'user',
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date()
    };

    // 🔥 FIX: Thêm tin nhắn vào chat ngay lập tức cho UX tốt hơn
    setChat(prevChat => [...prevChat, localMessage]);
    setMessage(""); // Clear input ngay lập tức

    try {
      // 🔥 FIX: Data chuẩn cho socket
      const messageData = {
        text: messageText,
        senderId: user.id,
        senderType: 'user'
      };

      console.log("📤 User sending message via socket:", messageData);
      
      // 🔥 GỬI QUA SOCKET TRƯỚC
      socket.emit("send_message", messageData);

      // 🔥 ĐỒNG THỜI GỬI QUA API ĐỂ LƯU VÀO DATABASE
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/user/send-message`, {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        // Nếu API thất bại, remove tin nhắn local
        setChat(prevChat => prevChat.filter(msg => 
          !(msg.text === messageText && msg.senderId === user.id && msg.senderType === 'user')
        ));
        setMessage(messageText); // Restore input
        toast.error(data.message || "Không thể gửi tin nhắn");
        return;
      }

      console.log("✅ Message sent successfully via API");

    } catch (error) {
      console.error("❌ Error sending message:", error);
      // Nếu có lỗi, remove tin nhắn local và restore input
      setChat(prevChat => prevChat.filter(msg => 
        !(msg.text === messageText && msg.senderId === user.id && msg.senderType === 'user')
      ));
      setMessage(messageText);
      toast.error("Lỗi khi gửi tin nhắn");
    }
  };

  const handleChatOpen = () => {
    if (!user) {
      toast.warn("Bạn cần đăng nhập để sử dụng chat!");
      navigate('/login');
      return;
    }
    setIsOpen(true);
    
    // Load chat history khi mở chat
    if (chat.length === 0) {
      loadChatHistory();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-200 text-gray-600 px-4 py-3 rounded-full shadow-lg animate-pulse">
          💬 Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && user ? (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-lg flex flex-col border">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <div>
              <h2 className="font-bold">Chat Hỗ trợ</h2>
              <div className="text-xs">
                Xin chào, {user.name}!
                <br />
                {isConnected ? (
                  <span className="text-green-300">🟢 Đã kết nối</span>
                ) : (
                  <span className="text-red-300">🔴 Đang kết nối...</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded px-2 py-1"
            >
              ✖
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {chat.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-4">
                {isConnected ? (
                  <>
                    <p>Xin chào {user.name}!</p>
                    <p>Chúng tôi có thể hỗ trợ gì cho bạn?</p>
                  </>
                ) : (
                  <p>Đang kết nối...</p>
                )}
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={`${msg.timestamp}-${i}`} className="mb-3">
                  <div className={`${
                    msg.senderId === user.id || msg.senderType === 'user' 
                      ? 'flex justify-end' 
                      : 'flex justify-start'
                  }`}>
                    <div className={`max-w-xs p-3 rounded-lg text-sm ${
                      msg.senderId === user.id || msg.senderType === 'user'
                        ? 'bg-blue-600 text-white' 
                        : msg.type === 'system'
                        ? 'bg-yellow-100 text-yellow-800 border'
                        : 'bg-white text-gray-800 border shadow-sm'
                    }`}>
                      {(msg.senderId !== user.id && msg.senderType !== 'user') && (
                        <div className="font-medium text-xs opacity-75 mb-1">
                          {msg.senderType === 'admin' ? 'Hỗ trợ viên' : 'Hệ thống'}
                        </div>
                      )}
                      <div>{msg.text}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="flex p-3 border-t bg-white rounded-b-lg">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || message.trim() === ""}
              className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleChatOpen}
          className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <span>💬</span>
          <span className="hidden sm:inline">
            {user ? "Chat hỗ trợ" : "Đăng nhập để chat"}
          </span>
        </button>
      )}
    </div>
  );
};

export default Chatbox;