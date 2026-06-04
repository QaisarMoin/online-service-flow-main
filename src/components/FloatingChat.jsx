import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bell, User, Cpu } from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const messagesContainerRef = useRef(null);
  const { language } = useTranslation();
  const pollIntervalRef = useRef(null);
  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          // Only update if state differs to avoid re-renders
          if (JSON.stringify(user) !== JSON.stringify(parsed)) {
            console.log("FloatingChat detected user:", parsed);
            setUser(parsed);
          }
        } else {
          if (user !== null) {
            console.log("FloatingChat detected logout");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("FloatingChat localStorage parse error:", err);
        if (user !== null) setUser(null);
      }
    };

    checkUser();
    
    // Poll localStorage for changes every 1.5 seconds since storage event only fires on other tabs
    const interval = setInterval(checkUser, 1500);
    window.addEventListener("storage", checkUser);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkUser);
    };
  }, [user]);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const data = await api.get("/messages");
      
      setMessages((prevMessages) => {
        const hasChanges = prevMessages.length !== data.length || 
          prevMessages.some((msg, index) => msg._id !== data[index]?._id || msg.message !== data[index]?.message);

        if (!hasChanges) return prevMessages;

        // If we got new messages and window was closed, indicate update
        if (data.length > prevMessages.length && !isOpen && prevMessages.length > 0) {
          const lastMsg = data[data.length - 1];
          if (lastMsg.senderRole !== "customer") {
            setHasNewUpdate(true);
          }
        }

        return data;
      });
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  // Start polling when user is logged in
  useEffect(() => {
    const isRegularUser = user && user.role !== "admin" && user.role !== "super_admin";
    if (isRegularUser) {
      fetchMessages();
      
      // Poll every 5 seconds
      pollIntervalRef.current = setInterval(fetchMessages, 5000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      setMessages([]);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, messages.length, isOpen]);

  // Smart auto-scroll to bottom when messages list updates or when chat opens
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    // Check if chat window was newly opened
    const justOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    // Check if the last message was sent by the customer
    const lastMessage = messages[messages.length - 1];
    const sentByMe = lastMessage && lastMessage.senderRole === "customer";

    // Check if the user is already near the bottom (within 20px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 20;

    // Scroll if chat was newly opened, user sent the message, or they are already at the bottom
    if (justOpened || sentByMe || isNearBottom) {
      setTimeout(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [messages.length, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const text = newMessage;
      setNewMessage(""); // clear input early for snappy UI
      
      const sentMsg = await api.post("/messages", { message: text });
      setMessages((prev) => [...prev, sentMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewUpdate(false);
    }
  };

  // Don't show floating chat if user is not logged in or is an admin (admin has their dashboard tab)
  const isRegularUser = user && user.role !== "admin" && user.role !== "super_admin";
  if (!isRegularUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-card/95 border border-border/80 rounded-2xl w-[360px] sm:w-[400px] h-[500px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  {language === "hi" ? "सहायता एवं अपडेट्स" : "Support & Updates"}
                </h3>
                <span className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === "hi" ? "एडमिन ऑनलाइन" : "Admin Online"}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-white/15 h-8 w-8 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </Button>
          </div>

          {/* Chat Messages Body */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/10"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-1">
                    {language === "hi" ? "कोई संदेश नहीं" : "No Messages Yet"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                    {language === "hi" 
                      ? "आप एडमिन को संदेश भेज सकते हैं। आपके आवेदन के अपडेट यहाँ दिखेंगे।" 
                      : "Send a message to Support. Your application status updates will also appear here."}
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                if (msg.senderRole === "system") {
                  // System/Status Update Message Style
                  return (
                    <div key={msg._id} className="flex justify-center my-2">
                      <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-xl px-3.5 py-2.5 max-w-[90%] text-xs text-blue-900 dark:text-blue-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex gap-2">
                        <span className="text-base select-none mt-0.5">🔔</span>
                        <div className="space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            {language === "hi" ? "सिस्टम अपडेट" : "System Update"}
                          </div>
                          <p className="whitespace-pre-line leading-relaxed font-medium opacity-90 text-[11px]">
                            {msg.message}
                          </p>
                          <span className="block text-[9px] text-muted-foreground/80 mt-1 font-mono">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                const isMe = msg.senderRole === "customer";
                
                return (
                  <div
                    key={msg._id}
                    className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/50 dark:border-indigo-900/40 flex items-center justify-center flex-shrink-0 select-none text-[10px] font-bold text-primary">
                        AD
                      </div>
                    )}
                    
                    <div className="flex flex-col max-w-[72%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs font-medium shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
                          isMe
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-br-none"
                            : "bg-card border border-border/50 text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      
                      <span
                        className={`text-[9px] text-muted-foreground mt-1 font-mono ${
                          isMe ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-border/80 flex items-center gap-2 bg-card"
          >
            <Input
              placeholder={language === "hi" ? "अपना संदेश यहाँ लिखें..." : "Type your message..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-xl border-border/60 focus-visible:ring-primary/20 h-10 text-xs shadow-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl h-10 w-10 flex-shrink-0 shadow-sm shadow-primary/20"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_6px_24px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-105 hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] transition-all duration-200 relative group`}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-200" />
        )}
        
        {/* Unread Alert Indicator */}
        {hasNewUpdate && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white animate-bounce shadow-md">
            <Bell className="w-3.5 h-3.5" />
          </span>
        )}
        
        {/* Support Label Hover Tooltip */}
        {!isOpen && (
          <span className="absolute right-16 bg-card border border-border/70 text-foreground text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {language === "hi" ? "मदद और स्टेटस" : "Help & Status"}
          </span>
        )}
      </button>
    </div>
  );
}
