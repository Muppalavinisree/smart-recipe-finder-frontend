import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // ✅ Added for formatted responses
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef(null);

  //  Dynamic API base URL (works for both local + deployed)
  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://smart-recipe-finder-backend-ok6c.onrender.com";

  //  Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Send message to backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const lowerInput = input.toLowerCase().trim();

    //  Custom greeting replies
    if (["hi", "hii", "hello", "hey"].includes(lowerInput)) {
      const botMsg = {
        sender: "bot",
        text: "👋 Hey hii! What kind of dish would you like to prepare today?",
      };
      setMessages((prev) => [...prev, botMsg]);
      return;
    }

    try {
      //  Send prompt to Gemini + MealDB backend
      const res = await axios.post(
        `${API_BASE}/api/chat`,
        { prompt: input },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      const botMsg = {
        sender: "bot",
        text: data.reply || "Sorry, I don’t know that.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Server error. Please try again later.",
        },
      ]);
    }
  };

  return (
    <div className="chatbot-wrapper" ref={chatbotRef}>
      {/* 🤖 Floating button */}
      {!open && (
        <motion.button
          className="chatbot-icon"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🤖
        </motion.button>
      )}

      {/* 💬 Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <span>AI Meal Assistant 🍽️</span>
              <button className="close-btn" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {/* ✅ Render formatted Markdown */}
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>

            {/* Input field */}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Chatbot;
