"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from "lucide-react"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Hi! I'm SAAZ AI. I can help you analyze trends, find events, or answer questions about the platform. How can I help you today?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (msg?: string) => {
    const userMessage = msg || input
    if (!userMessage.trim()) return

    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      let botResponse = "I'm still learning, but I can tell you that SAAZ is the best place to find talent!"

      const lowerInput = userMessage.toLowerCase()

      // Trends & Analysis
      if (lowerInput.includes("trend") || lowerInput.includes("popular")) {
        botResponse = "Based on our deep analysis, live jazz bands and stand-up comedy are currently trending in Mumbai and Delhi. Venues booking these acts have seen a 40% increase in footfall."
      }
      // Pricing & Cost
      else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("charge")) {
        botResponse = "Artist pricing varies by category. On average: \n• Solo Singers: ₹5k - ₹15k\n• Bands: ₹20k+\n• DJs: ₹10k - ₹50k\n• Stand-up: ₹15k+\nPrices depend on experience and event duration."
      }
      // Events & Discovery
      else if (lowerInput.includes("event") || lowerInput.includes("find") || lowerInput.includes("near")) {
        botResponse = "You can find the latest events on our Explore page. We have over 50 events happening this weekend! Check the 'Find Events' tab to filter by your city."
      }
      // Booking & Contact
      else if (lowerInput.includes("book") || lowerInput.includes("venue") || lowerInput.includes("hire") || lowerInput.includes("contact")) {
        botResponse = "To book a venue or artist, simply visit their profile and click the 'Book Now' or 'Contact' button. You can search for specific venues in the Explore section."
      }
      // Safety & Trust
      else if (lowerInput.includes("safe") || lowerInput.includes("trust") || lowerInput.includes("verify")) {
        botResponse = "Safety is our priority. All artists and venues on SAAZ are verified. We also use secure payment gateways to ensure your transactions are protected."
      }
      // Specific Categories
      else if (lowerInput.includes("singer") || lowerInput.includes("music")) {
        botResponse = "Looking for music? We have thousands of talented singers and musicians. Use the 'Find Talent' filter on the Explore page to listen to their demos!"
      }
      else if (lowerInput.includes("comedy") || lowerInput.includes("stand up")) {
        botResponse = "Laughter is the best medicine! Check out our top-rated stand-up comedians in the 'Find Talent' section."
      }
      // General Greetings
      else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
        botResponse = "Hello! I'm SAAZ AI. I can help you find artists, check trends, or answer questions about the platform. What's on your mind?"
      }
      // Help
      else if (lowerInput.includes("help") || lowerInput.includes("support")) {
        botResponse = "I'm here to help! You can ask me about finding talent, booking events, pricing, or account issues. If you need human assistance, click the 'Help Us' button above."
      }

      setMessages(prev => [...prev, { role: "bot", content: botResponse }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-background/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-primary/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SAAZ AI Analyst</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open("mailto:support@saaz.com")}
                  className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors"
                >
                  Help Us
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Suggested Prompts */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {[
                    "Find events near me",
                    "Trending artists",
                    "How to book a venue?",
                    "Pricing guide"
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(prompt)
                        // Small timeout to allow state update before sending
                        setTimeout(() => handleSend(prompt), 0)
                      }}
                      className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors border border-primary/10"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-background/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about trends, events..."
                  className="flex-1 bg-muted/50 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg flex items-center justify-center z-50 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white group-hover:hidden" />
          )}
        </AnimatePresence>
        {!isOpen && (
          <Sparkles className="w-6 h-6 text-white hidden group-hover:block animate-pulse" />
        )}
      </motion.button>
    </>
  )
}
