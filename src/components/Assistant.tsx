import React, { useState, useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";

function Assistant({ context }: any) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string }>
  >([]);
  const [loading, setLoading] = useState(false); // Track AI response loading state
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
    }
  }, [query]);

  useEffect(() => {
    if (chatRef.current) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.sender === "user") {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim() || loading) return; // Prevent multiple clicks while loading

    setLoading(true); // Start loading

    // Add user message to state
    const newMessages = [...messages, { sender: "user" as const, text: query }];
    setMessages(newMessages);
    setQuery("");

    try {
      const response = await fetch(
        "https://summa-pdf-backend.onrender.com/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, context }),
        }
      );

      const data = await response.json();

      if (response.ok && data.response) {
        setMessages([
          ...newMessages,
          { sender: "ai" as const, text: data.response },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            sender: "ai" as const,
            text: "I couldn't process your request. Try again!",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        {
          sender: "ai" as const,
          text: "Something went wrong. Please try again later!",
        },
      ]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-4 mb-4 bg-white shadow-md rounded-lg transition-all flex flex-col">
      <h3 className="text-2xl font-[700] text-primary mb-2">Assistant</h3>
      <p>Let's discuss the uploaded file</p>

      {/* Chat Box */}
      <div
        ref={chatRef}
        className="mt-2 h-64 overflow-y-auto bg-gray-100 p-3 rounded-lg flex flex-col space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "bg-primary text-white self-end text-start"
                : "bg-gray-200 text-gray-800 self-start text-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Show loading message when waiting for AI response */}
        {loading && (
          <div className="p-2 rounded-lg bg-gray-200 text-gray-800 self-start">
            Assistant is thinking...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-end border mt-2 rounded-md p-2 w-full">
        <textarea
          ref={textareaRef}
          placeholder="Ask me anything about this topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 outline-none resize-none overflow-hidden bg-transparent"
          style={{ minHeight: "40px" }}
          disabled={loading} // Disable input while AI is responding
        />
        <button
          title="send"
          onClick={handleAsk}
          disabled={loading} // Disable button while AI is processing
          className={`p-2 rounded-lg flex items-center justify-center transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          <LuSend size={20} />
        </button>
      </div>
    </div>
  );
}

export default Assistant;
