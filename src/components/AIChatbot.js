import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RefreshCw } from "lucide-react";
import {
    formatResponseText,
    getRandomSuggestions,
    stripSuggestionsBlock,
    buildSystemPrompt
} from "../utils/chatbotUtils";

// ── Welcome message streams in character by character ─────────────────────────
const WELCOME_TEXT = "Hi! I'm **Bhavin's Neural Twin** — ask me anything about Bhavin's skills, projects, work experience, or availability!";

function useTypewriter(text, speed = 18, trigger = true) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!trigger) {
            setDisplayed("");
            setDone(false);
            return;
        }
        setDisplayed("");
        setDone(false);
        let i = 0;
        const timer = setInterval(() => {
            i += 1;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(timer);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed, trigger]);

    return { displayed, done };
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [suggestions, setSuggestions] = useState(() => getRandomSuggestions(3));
    const [showPopup, setShowPopup] = useState(true);
    const [status, setStatus] = useState("online"); // online, warning, offline
    const [requestTimes, setRequestTimes] = useState([]);
    const chatLogRef = useRef(null);
    const messagesRef = useRef([]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Clean up any legacy custom API key from local storage
    useEffect(() => {
        localStorage.removeItem("custom_hf_api_key");
    }, []);

    const apiKey = useMemo(() => {
        const raw = process.env.REACT_APP_HF_API_KEY || "";
        if (!raw) return "";
        try {
            // If it starts with hf_, it's a raw un-encoded key
            if (raw.startsWith("hf_")) return raw;
            // Otherwise, decode it from Base64
            return atob(raw).trim();
        } catch (e) {
            return raw;
        }
    }, []);

    // Build system prompt once (memoized)
    const systemPrompt = useMemo(() => buildSystemPrompt(), []);

    // Typewriter for welcome message (only triggers when open)
    const { displayed: welcomeText, done: welcomeDone } = useTypewriter(
        WELCOME_TEXT,
        16,
        isOpen
    );

    // Dismiss welcome speech bubble popup when chatbot opens
    useEffect(() => {
        if (isOpen) {
            setShowPopup(false);
        }
    }, [isOpen]);

    // Mount guard — prevents chat panel flash on initial render
    useEffect(() => {
        const t = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Add initial bot message after typewriter finishes (on first open)
    const hasAddedWelcome = useRef(false);
    useEffect(() => {
        if (welcomeDone && !hasAddedWelcome.current) {
            hasAddedWelcome.current = true;
            setMessages([{ role: "bot", text: WELCOME_TEXT }]);
        }
    }, [welcomeDone]);

    // Auto-scroll as messages update
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isWaiting]);

    const handleSend = useCallback(async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query || isTyping) return;
        if (!textToSend) setInput("");

        const excludeList = [query, ...messagesRef.current.map(m => m.text)];

        setMessages(prev => [...prev, { role: "user", text: query }]);
        setIsTyping(true);
        setIsWaiting(true);

        // Track request rate limits (Your API Key tier is 10 RPM)
        const now = Date.now();
        const recent = [...requestTimes, now].filter(t => now - t < 60000);
        setRequestTimes(recent);

        if (recent.length >= 10) {
            setStatus("offline"); // Rate limit reached
        } else if (recent.length >= 6) {
            setStatus("warning"); // Warning threshold (approaching 10 RPM)
        } else {
            setStatus("online");
        }

        // No API key — demo mode / offline
        if (!apiKey) {
            setStatus("offline");
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        role: "bot",
                        text: "I'm running in **demo mode** — the Hugging Face token isn't configured yet. Please ensure the token is set up correctly in the environment configuration."
                    }
                ]);
                setIsTyping(false);
                setIsWaiting(false);
            }, 700);
            return;
        }

        try {
            const response = await fetch(
                "https://router.huggingface.co/v1/chat/completions",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "meta-llama/Llama-3.3-70B-Instruct",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: query }
                        ],
                        max_tokens: 500,
                        temperature: 0.2
                    })
                }
            );

            if (!response.ok) {
                let errorMsg = "Something went wrong on my end. Please try again in a moment.";
                try {
                    const errData = await response.json();
                    const errMsg = typeof errData?.error === "string" ? errData.error : JSON.stringify(errData?.error || "");
                    if (response.status === 429 || errMsg.includes("rate limit") || errMsg.includes("Too many requests")) {
                        errorMsg = "I've hit my default free-tier Hugging Face limit. The limit resets within **1 minute**. You can connect with me directly at **bhavinpathak29@gmail.com**, or try again shortly!";
                        setStatus("offline");
                    } else if (response.status === 503 || errMsg.includes("loading")) {
                        const estTime = Math.round(errData?.estimated_time || 20);
                        errorMsg = `My AI model is currently initializing on Hugging Face servers (estimated setup time: **${estTime} seconds**). Please wait a moment and try sending your message again!`;
                        setStatus("warning");
                    } else if (response.status === 401 || response.status === 403) {
                        errorMsg = "The Hugging Face token seems to be invalid or expired. Please check the server configurations.";
                        setStatus("offline");
                    }
                } catch (parseErr) { /* use default error message */ }
                setIsWaiting(false);
                setIsTyping(false);
                setMessages(prev => [...prev, { role: "bot", text: errorMsg }]);
                setSuggestions(getRandomSuggestions(3, excludeList));
                return;
            }

            // Successfully connected to API: check status again
            if (recent.length >= 10) {
                setStatus("offline");
            } else if (recent.length >= 6) {
                setStatus("warning");
            } else {
                setStatus("online");
            }

            setIsWaiting(false);

            const data = await response.json();
            const fullText = data.choices?.[0]?.message?.content || "";

            if (!fullText) {
                setMessages(prev => [
                    ...prev,
                    { role: "bot", text: "Sorry, I couldn't generate a response. Please try again." }
                ]);
                setSuggestions(getRandomSuggestions(3, excludeList));
                setIsTyping(false);
                return;
            }

            const visible = stripSuggestionsBlock(fullText);
            setMessages(prev => [...prev, { role: "bot", text: visible }]);
            setSuggestions(getRandomSuggestions(3, excludeList));
            setIsTyping(false);

        } catch (err) {
            console.error("Neural Twin Error:", err);
            setStatus("offline");
            setIsWaiting(false);
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                { role: "bot", text: "I ran into a connectivity issue. Please check your network and try again." }
            ]);
            setSuggestions(getRandomSuggestions(3, excludeList));
        }
    }, [input, isTyping, apiKey, systemPrompt, requestTimes]);

    if (!isMounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* ── Chat Panel ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-panel"
                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.92 }}
                        transition={{ type: "spring", damping: 22, stiffness: 260 }}
                        className="w-[90vw] sm:w-[380px] h-[500px] mb-4 overflow-hidden"
                    >
                        <div className="w-full h-full p-4 flex flex-col md:backdrop-blur-xl backdrop-blur-md saturate-150 bg-white/70 dark:bg-black/50 border border-gray-200/80 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-white/10 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white leading-tight">
                                            Bhavin&apos;s Neural Twin
                                        </h3>
                                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${status === "online" ? "text-green-500" :
                                            status === "warning" ? "text-yellow-500" : "text-red-500"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === "online" ? "bg-green-500 animate-pulse" :
                                                status === "warning" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
                                                }`} />
                                            {status === "online" ? "Online" :
                                                status === "warning" ? "Busy" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close chat"
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div ref={chatLogRef} className="flex-1 overflow-y-auto py-3 pr-1 flex flex-col gap-3 scrollbar-thin min-h-0">

                                {/* Welcome typewriter (streams in on first open, before real messages) */}
                                {messages.length === 0 && (
                                    <div className="self-start max-w-[85%]">
                                        <div className="p-3 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 shadow-sm text-xs md:text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                                            {formatResponseText(welcomeText)}
                                            {!welcomeDone && <span className="inline-block w-0.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse align-middle" />}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                                    >
                                        <div
                                            className={`p-3 rounded-2xl text-xs md:text-sm font-medium leading-relaxed border ${msg.role === "user"
                                                ? "bg-blue-600 text-white border-blue-700 rounded-tr-none"
                                                : "bg-slate-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-gray-200/50 dark:border-white/5 rounded-tl-none shadow-sm"
                                                }`}
                                        >
                                            {msg.role === "bot" ? formatResponseText(msg.text) : msg.text}
                                        </div>
                                    </div>
                                ))}

                                {isWaiting && (
                                    <div className="self-start max-w-[85%]">
                                        <div className="p-3 bg-slate-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                                            <span className="text-[10px] text-gray-400 font-medium italic">Neural Twin is thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Suggestions */}
                            {!isTyping && messages[messages.length - 1]?.role !== "user" && (
                                <div className="flex flex-col gap-1.5 pb-2 shrink-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Ask about Bhavin:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {suggestions.map((s, idx) => (
                                            <button
                                                type="button"
                                                key={idx}
                                                onClick={() => handleSend(s)}
                                                className="text-[10px] text-left bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-white/10 cursor-pointer font-medium transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2 pt-2 border-t border-gray-200/60 dark:border-white/10 shrink-0"
                            >
                                <input
                                    type="text"
                                    placeholder="Ask about Bhavin..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isTyping}
                                    className="flex-grow bg-slate-100 dark:bg-black/40 border border-gray-200 dark:border-white/15 px-3 py-2 rounded-xl text-xs md:text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60"
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping || !input.trim()}
                                    aria-label="Send message"
                                    className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-md"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Welcome Speech Bubble Popup (Above chatbot bubble when closed) ── */}
            <AnimatePresence>
                {!isOpen && showPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 2.0, duration: 0.4 } }}
                        exit={{ opacity: 0, y: 15, scale: 0.8, transition: { duration: 0.15 } }}
                        className="absolute bottom-20 right-0 z-50 w-64 p-3.5 md:backdrop-blur-xl backdrop-blur-md saturate-150 bg-white/70 dark:bg-black/50 border border-gray-200/80 dark:border-white/10 rounded-2xl rounded-br-none shadow-xl cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => setIsOpen(true)}
                    >
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}
                            className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="flex gap-2">
                            <div className="flex-1 text-xs text-gray-700 dark:text-gray-200 font-semibold leading-relaxed pr-3">
                                Hi, I&apos;m Bhavin&apos;s Neural Twin! Ask me anything about Bhavin. 🤖
                            </div>
                        </div>
                        {/* Little triangle pointer at the bottom right */}
                        <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white/70 dark:bg-black/50 border-r border-b border-gray-200/80 dark:border-white/10 transform rotate-45 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Bubble Button ─────────────────────────────────────────────── */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle Bhavin's Neural Twin chat"
                className={`p-4 rounded-full text-white cursor-pointer relative shadow-2xl transition-all duration-300 flex items-center justify-center ${isOpen
                    ? "bg-gray-700 dark:bg-white/10"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
            >
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                )}
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
