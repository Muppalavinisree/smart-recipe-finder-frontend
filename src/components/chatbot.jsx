import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  try {
    const res = await fetch("https://smart-recipe-finder-backend-19ot.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    const botMsg = { sender: "bot", text: data.reply || "Sorry, I don’t know that." };
    setMessages((prev) => [...prev, botMsg]);
  } catch (error) {
    console.error("Chat error:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Server error. Please try again later." },
    ]);
  }
};



  return (
    <div className="chatbot-wrapper" ref={chatbotRef}>
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

      {/*Chat Window with animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="chatbot-header">
              <span>AI Meal Assistant</span>
              <button className="close-btn" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

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
