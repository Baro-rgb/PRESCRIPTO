import React, { useContext, useState, useEffect, useRef } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import axios from 'axios'

const AdminChatbox = () => {
  const { aToken, backendUrl } = useContext(AdminContext)

  // States for patients list and filtering
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // States for chat
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  // Refs
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const selectedPatientRef = useRef(null);

  useEffect(() => {
    selectedPatientRef.current = selectedPatient;
  }, [selectedPatient]);

  // Fetch patients who have had appointments
  const fetchPatients = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `${backendUrl}/api/admin/chat-patients`,
        { headers: { aToken } }
      )

      console.log("📊 Fetched patients:", data);

      if (data.success) {
        setPatients(data.patients)
        setFilteredPatients(data.patients)
      }
    } catch (error) {
      console.log("❌ Fetch patients error:", error)
      toast.error('Không thể tải danh sách bệnh nhân')
    } finally {
      setLoading(false)
    }
  }

  // Lấy lịch sử chat với bệnh nhân
  const getChatHistory = async (patientId) => {
    try {
      console.log("📚 Getting chat history for patient:", patientId);
      const { data } = await axios.get(
        `${backendUrl}/api/admin/chat-history/${patientId}`,
        { headers: { aToken } }
      )

      if (data.success) {
        console.log("✅ Chat history loaded:", data.messages);
        return data.messages || []
      } else {
        throw new Error(data.message || 'Không thể tải lịch sử chat')
      }
    } catch (error) {
      console.error('❌ Error fetching chat history:', error)
      throw error
    }
  }

  // Đánh dấu tin nhắn đã đọc
  const markMessagesAsRead = async (patientId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/mark-messages-read`,
        { patientId },
        { headers: { aToken } }
      )

      if (!data.success) {
        console.warn('Could not mark messages as read:', data.message)
      }
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // 🔥 Setup socket connection with improved event handling
  useEffect(() => {
    if (!aToken) return;

    console.log("🔄 Setting up admin socket connection...");

    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: aToken,
        userType: 'admin'
      }
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Admin socket connected:", newSocket.id);

      // Load patients list when connected
      fetchPatients();
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Admin socket disconnected:", reason);
    });

    // 🔥 FIX: LẮNG NGHE TIN NHẮN TỪ USER
    newSocket.on("admin_receive_message", (data) => {
      console.log("📨 Admin received message from user:", data);

      // 🔥 FIX: CHỈ THÊM TIN NHẮN VÀO CHAT NÚ ĐANG CHAT VỚI USER ĐÓ
      if (selectedPatientRef.current && selectedPatientRef.current._id === data.senderId) {
        setMessages(prev => {
          // Tránh duplicate message
          const exists = prev.some(msg =>
            msg.timestamp && data.timestamp &&
            new Date(msg.timestamp).getTime() === new Date(data.timestamp).getTime() &&
            msg.text === data.text &&
            msg.senderId === data.senderId
          );

          if (!exists) {
            console.log("📝 Adding user message to current chat");
            return [...prev, data];
          }
          console.log("⚠️ Message already exists, skipping");
          return prev;
        });
      } else {
        // Nếu không đang chat với user này, chỉ refresh patients list
        console.log("📝 Refreshing patients list for new message");
        fetchPatients();
      }
    });

    // 🔥 LẮNG NGHE DANH SÁCH USER ONLINE
    newSocket.on('online_users', (users) => {
      console.log("👥 Online users updated:", users);
      setOnlineUsers(users);
    });

    // 🔥 LẮNG NGHE USER ONLINE/OFFLINE
    newSocket.on('user_online', (userId) => {
      console.log("🟢 User came online:", userId);
      setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
    });

    newSocket.on('user_offline', (userId) => {
      console.log("🔴 User went offline:", userId);
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    // 🔥 FIX: Lắng nghe xác nhận tin nhắn đã gửi
    newSocket.on('message_sent', (data) => {
      console.log("✅ Admin message confirmed sent:", data);
      // Không cần làm gì vì tin nhắn admin đã được thêm vào UI ngay lập tức
    });

    newSocket.on("connect_error", (error) => {
      console.log("🚫 Admin connection error:", error);
      toast.error("Không thể kết nối chat");
    });

    return () => {
      console.log("🔄 Disconnecting admin socket");
      newSocket.disconnect();
    };
  }, [aToken]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle patient search
  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  // Load chat history when selecting a patient
  const handleSelectPatient = async (patient) => {
    console.log("🎯 Selecting patient:", patient);
    setSelectedPatient(patient)
    setMessages([])

    try {
      console.log("📂 Loading chat history for patient:", patient._id);
      const messages = await getChatHistory(patient._id)
      console.log("📨 Loaded messages:", messages);
      setMessages(messages)

      // Mark messages as read
      console.log("✅ Marking messages as read");
      await markMessagesAsRead(patient._id)

    } catch (error) {
      console.log("❌ Error loading chat:", error)
      toast.error('Không thể tải lịch sử chat')
    }

    // Join room for real-time chat
    if (socket) {
      console.log("🏠 Admin joining room:", patient._id);
      socket.emit('admin_join_room', patient._id);
    } else {
      console.log("⚠️ Socket not available when trying to join room");
    }
  }

  // 🔥 FIX: Cải thiện function gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient || !socket) {
      console.log("⚠️ Cannot send message:", {
        hasMessage: !!newMessage.trim(),
        hasPatient: !!selectedPatient,
        hasSocket: !!socket
      });
      return;
    }

    const messageText = newMessage.trim();
    const patientId = selectedPatient._id;

    // 🔥 FIX: Tạo tin nhắn local ngay lập tức để hiển thị cho admin
    const localMessage = {
      senderId: 'admin',
      receiverId: patientId,
      text: messageText,
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date(),
      senderType: 'admin'
    };

    // 🔥 FIX: Thêm tin nhắn vào state ngay lập tức trước khi gửi
    setMessages(prev => [...prev, localMessage]);
    setNewMessage(''); // Clear input ngay lập tức

    try {
      // 1. Gửi qua socket trước
      const socketData = {
        receiverId: patientId,
        text: messageText,
        senderType: 'admin'
      };

      console.log("📤 Admin sending message via socket:", socketData);
      socket.emit("admin_send_message", socketData);

      // 2. Gửi qua API để lưu database
      const apiResponse = await axios.post(
        `${backendUrl}/api/admin/send-message`,
        {
          patientId: patientId,
          message: messageText
        },
        { headers: { aToken } }
      );

      if (!apiResponse.data.success) {
        // Nếu API thất bại, remove tin nhắn local
        setMessages(prev => prev.filter(msg =>
          !(msg.text === messageText && msg.senderId === 'admin' && msg.senderType === 'admin')
        ));
        setNewMessage(messageText); // Restore input
        toast.error(apiResponse.data.message || "Không thể gửi tin nhắn");
      } else {
        console.log("✅ Message sent successfully via API");
      }

    } catch (error) {
      console.error("❌ Error sending message:", error);
      // Nếu có lỗi, remove tin nhắn local và restore input
      setMessages(prev => prev.filter(msg =>
        !(msg.text === messageText && msg.senderId === 'admin' && msg.senderType === 'admin')
      ));
      setNewMessage(messageText);
      toast.error("Lỗi khi gửi tin nhắn");
    }
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 🔥 Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className='w-full max-w-7xl m-5'>
      <div className='flex flex-col lg:flex-row h-[80vh] bg-white border rounded-lg overflow-hidden'>

        {/* Patients List Sidebar */}
        <div className='w-full lg:w-1/3 border-r border-gray-200 flex flex-col'>
          {/* Header */}
          <div className='p-4 border-b bg-gray-50'>
            <h2 className='text-lg font-medium mb-3'>Chat với Bệnh nhân</h2>

            {/* Search */}
            <div className='relative'>
              <input
                type="text"
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <div className='absolute right-3 top-2.5 text-gray-400'>
                🔍
              </div>
            </div>

            {/* Debug Info */}
            <div className='mt-2 text-xs text-gray-500'>
              <div>Socket: {socket?.connected ? '✅ Connected' : '❌ Disconnected'}</div>
              <div>Online users: {onlineUsers.length}</div>
              <div>Patients: {patients.length}</div>
            </div>
          </div>

          {/* Patients List */}
          <div className='flex-1 overflow-y-auto'>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedPatient?._id === patient._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <img
                        className='w-10 h-10 rounded-full object-cover'
                        src={patient.image || '/default-avatar.png'}
                        alt={patient.name}
                      />
                      {onlineUsers.includes(patient._id) && (
                        <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-center'>
                        <p className='font-medium text-sm truncate'>{patient.name}</p>
                        <span className='text-xs text-gray-500'>
                          {onlineUsers.includes(patient._id) ? '🟢 Online' : '⚫ Offline'}
                        </span>
                      </div>

                      <p className='text-xs text-gray-500 truncate'>{patient.email}</p>
                      <p className='text-xs text-gray-500'>{patient.phone}</p>

                      {patient.lastMessage && (
                        <div className='mt-1'>
                          <p className='text-xs text-gray-600 truncate'>{patient.lastMessage}</p>
                          <p className='text-xs text-gray-400'>{formatTime(patient.lastMessageTime)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500 text-center">
                  {searchTerm ? 'Không tìm thấy bệnh nhân nào' : 'Chưa có bệnh nhân nào'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className='flex-1 flex flex-col'>
          {selectedPatient ? (
            <>
              {/* Chat Header */}
              <div className='p-4 border-b bg-gray-50 flex items-center gap-3'>
                <img
                  className='w-10 h-10 rounded-full object-cover'
                  src={selectedPatient.image || '/default-avatar.png'}
                  alt={selectedPatient.name}
                />
                <div className='flex-1'>
                  <p className='font-medium'>{selectedPatient.name}</p>
                  <p className='text-sm text-gray-500'>
                    {onlineUsers.includes(selectedPatient._id) ? (
                      <span className='text-green-600'>🟢 Đang online</span>
                    ) : (
                      <span className='text-gray-500'>⚫ Offline</span>
                    )}
                  </p>
                </div>

                {/* Chat Info */}
                <div className='text-xs text-gray-500 text-right'>
                  <div>Messages: {messages.length}</div>
                  <div>Room: chat_{selectedPatient._id}</div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'
              >
                {messages.length === 0 ? (
                  <div className='text-center text-gray-500 mt-8'>
                    <p>Chưa có tin nhắn nào</p>
                    <p className='text-sm'>Hãy bắt đầu cuộc trò chuyện với {selectedPatient.name}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={`${msg.timestamp}-${index}`}
                      className={`flex ${msg.senderId === 'admin' || msg.senderType === 'admin'
                          ? 'justify-end'
                          : 'justify-start'
                        }`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === 'admin' || msg.senderType === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border shadow-sm'
                        }`}>
                        <p className='text-sm'>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === 'admin' || msg.senderType === 'admin'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                          }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className='p-4 border-t bg-white'>
                <div className='flex gap-2'>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder={`Nhắn tin cho ${selectedPatient.name}...`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                  >
                    Gửi
                  </button>
                </div>

                {/* Socket Status */}
                <div className='mt-2 text-xs text-gray-500'>
                  Socket: {socket?.connected ? '✅ Connected' : '❌ Disconnected'} |
                  Room: chat_{selectedPatient._id}
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center text-gray-500'>
                <div className='text-6xl mb-4'>💬</div>
                <p className='text-lg'>Chọn bệnh nhân để bắt đầu chat</p>
                <p className='text-sm mt-2'>Chọn một bệnh nhân từ danh sách bên trái để trò chuyện</p>

                {/* Status Info */}
                <div className='mt-4 text-xs'>
                  <div>Socket: {socket?.connected ? '✅ Connected' : '❌ Disconnected'}</div>
                  <div>Online Users: {onlineUsers.length}</div>
                  <div>Total Patients: {patients.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminChatbox