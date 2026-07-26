import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Send, MessageSquare } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import messageService from "../services/messageService";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { timeAgo } from "../utils/helpers";

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchInbox = async () => {
    try {
      const data = await messageService.getInbox();
      setConversations(data.conversations);
    } catch (err) {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (targetUserId) {
      userService.getUserProfile(targetUserId).then((data) => setActiveUser(data.user));
    }
  }, [location.state]);

  useEffect(() => {
    if (!activeUser) return;
    messageService.getConversation(activeUser._id).then((data) => setMessages(data.messages));
  }, [activeUser]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (activeUser && msg.sender._id === activeUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchInbox();
    };
    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, activeUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    try {
      const data = await messageService.sendMessage(activeUser._id, text);
      setMessages((prev) => [...prev, data.message]);
      setText("");
      fetchInbox();
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <MainLayout>
      <section className="py-8">
        <div className="section-container">
          <h1 className="font-display text-2xl font-bold text-ink mb-6">Messages</h1>

          <div className="glass-card overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh]">
            <div className="border-r border-mocha/10 overflow-y-auto">
              {conversations.length === 0 && !activeUser ? (
                <div className="p-6">
                  <EmptyState
                    icon={MessageSquare}
                    title="No conversations yet"
                    description="Messages with clients and freelancers will appear here."
                  />
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user._id}
                    onClick={() => setActiveUser(conv.user)}
                    className={`w-full flex items-center gap-3 p-4 text-left border-b border-mocha/5 hover:bg-nude/20 transition-colors ${
                      activeUser?._id === conv.user._id ? "bg-nude/30" : ""
                    }`}
                  >
                    <Avatar
                      src={conv.user.profileImage}
                      name={conv.user.name}
                      size="sm"
                      online={onlineUsers.includes(conv.user._id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-medium text-sm text-ink truncate">
                          {conv.user.name}
                        </p>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-mocha text-cream text-[10px] flex items-center justify-center font-bold shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink/50 truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="md:col-span-2 flex flex-col">
              {activeUser ? (
                <>
                  <div className="p-4 border-b border-mocha/10 flex items-center gap-3">
                    <Avatar
                      src={activeUser.profileImage}
                      name={activeUser.name}
                      size="sm"
                      online={onlineUsers.includes(activeUser._id)}
                    />
                    <div>
                      <p className="font-heading font-semibold text-ink text-sm">{activeUser.name}</p>
                      <p className="text-xs text-ink/50">
                        {onlineUsers.includes(activeUser._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.sender._id === user._id;
                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMe
                                ? "bg-mocha-gradient text-cream rounded-br-sm"
                                : "bg-white/70 text-ink rounded-bl-sm"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? "text-cream/60" : "text-ink/40"}`}>
                              {timeAgo(msg.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSend} className="p-4 border-t border-mocha/10 flex gap-2">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message..."
                      className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary !px-4">
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    icon={MessageSquare}
                    title="Select a conversation"
                    description="Choose a conversation from the list to start chatting."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default MessagesPage;
