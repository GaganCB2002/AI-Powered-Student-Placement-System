import { useState, useEffect, useRef } from 'react'
// Removed framer-motion to fix build error
// Using standard CSS/React for display

export default function AiChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Career Assistant. Ask me anything about your resume, jobs, or interview prep! 🤖", sender: 'ai' }
    ])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg = { id: Date.now(), text: input, sender: 'user' }
        setMessages(prev => [...prev, userMsg])
        setInput('')

        // Simulate AI Response
        setTimeout(() => {
            let replyText = "That's a great question! As a demo AI, I recommend focusing on your core skills."
            const lowerInput = userMsg.text.toLowerCase()

            if (lowerInput.includes('resume')) replyText = "To improve your resume, focus on quantifying your impact (e.g., 'Improved efficiency by 20%'). Would you like me to review your uploaded resume?"
            else if (lowerInput.includes('job')) replyText = "We have several new openings in Frontend and Data Science. Check the 'Find Jobs' section!"
            else if (lowerInput.includes('interview')) replyText = "For interviews, practice the STAR method (Situation, Task, Action, Result). I can run a mock interview if you like!"
            else if (lowerInput.includes('salary')) replyText = "Based on market trends, freshers in your domain typically earn between ₹6-12 LPA."

            const aiMsg = { id: Date.now() + 1, text: replyText, sender: 'ai' }
            setMessages(prev => [...prev, aiMsg])
        }, 1000)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div
                    className="glass-card w-[350px] h-[500px] mb-4 rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/20 animate-fade-in-up"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-secondary to-purple-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <h3 className="font-bold text-white">AI Assistant</h3>
                                <span className="text-xs text-green-200 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white pb-1 text-2xl">×</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-secondary text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-black/60 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                        />
                        <button type="submit" className="bg-secondary p-2 rounded-xl text-white hover:bg-pink-600 transition-colors">
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,0,80,0.4)] transition-all duration-300 ${isOpen ? 'bg-gray-700 rotate-45' : 'bg-gradient-to-br from-secondary to-purple-600 hover:scale-110 animate-bounce hover:animate-none'
                    }`}
            >
                {isOpen ? '＋' : '💬'}
            </button>
        </div>
    )
}
