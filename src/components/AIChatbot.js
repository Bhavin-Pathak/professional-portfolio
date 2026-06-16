import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Settings, Key, RefreshCw } from "lucide-react";
import { LiquidContainer } from "./LiquidContainer.js";

// Inline markdown parser to render clean structured outputs without heavy npm packages
const parseInlineMarkdown = (text) => {
    if (!text) return "";
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const tokens = text.split(regex);

    return tokens.map((token, idx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
            return <strong key={idx} className="font-bold text-gray-900 dark:text-white">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith("`") && token.endsWith("`")) {
            return <code key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded font-mono text-xs text-red-500 dark:text-pink-400">{token.slice(1, -1)}</code>;
        }
        if (token.startsWith("[") && token.includes("](")) {
            const label = token.slice(1, token.indexOf("]"));
            const url = token.slice(token.indexOf("](") + 2, token.length - 1);
            return (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 underline font-semibold hover:opacity-80">
                    {label}
                </a>
            );
        }
        return token;
    });
};

const formatResponseText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
            return <h4 key={i} className="text-xs md:text-sm font-bold text-blue-500 mt-3 mb-1 uppercase tracking-wider">{parseInlineMarkdown(trimmed.slice(4))}</h4>;
        }
        if (trimmed.startsWith("## ")) {
            return <h3 key={i} className="text-sm md:text-base font-bold text-indigo-500 mt-4 mb-1">{parseInlineMarkdown(trimmed.slice(3))}</h3>;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
                <li key={i} className="ml-4 list-disc text-xs md:text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
                    {parseInlineMarkdown(trimmed.slice(2))}
                </li>
            );
        }
        if (trimmed === "") {
            return <div key={i} className="h-2" />;
        }
        return (
            <p key={i} className="text-xs md:text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
                {parseInlineMarkdown(line)}
            </p>
        );
    });
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! I am **Bhavin's AI Twin**. Ask me anything about Bhavin's skills, projects, experience, or availability!"
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [apiKey, setApiKey] = useState(() => {
        return process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem("GEMINI_API_KEY") || "";
    });
    const [showSettings, setShowSettings] = useState(false);
    const [tempKey, setTempKey] = useState("");

    const chatEndRef = useRef(null);

    // Auto-scroll to bottom of chat window
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const staticResponses = {
        "show me your ai projects": "Here are Bhavin's top **AI & Machine Learning** projects:\n- **YT AI Q&A**: A Python intelligence tool using LLMs to interactively answer questions based on YouTube video content.\n- **Clario**: An AI-powered writing assistant and editor.\n- **NuvoAI Integrations**: In his current SDE-1 role at Meril Life Sciences, Bhavin is responsible for deploying and integrating custom LLMs into medical diagnostic and administrative pipelines.",
        "what is your current role?": "Bhavin is currently working as a **Software Development Engineer (SDE-1)** at **Meril Life Sciences Pvt. Ltd.** in Vapi, Gujarat (NuvoAI Department) since December 2024.\n\nHis primary stack there includes Node.js, React.js, AI/LLMs, Express.js, and PostgreSQL.",
        "how can i contact you?": "You can connect with Bhavin Pathak via:\n- **Email**: [bhavinpathak29@gmail.com](mailto:bhavinpathak29@gmail.com)\n- **LinkedIn**: [bhavin-pathak](https://www.linkedin.com/in/bhavin-pathak/)\n- **GitHub**: [Bhavin-Pathak](https://github.com/Bhavin-Pathak)\n- **Phone**: +91 9428455515\n\nOr click on the **Connect** page in the main navigation grid!"
    };

    const systemPrompt = `You are "Bhavin's AI Twin", a professional, polite, and highly capable AI assistant designed to represent Bhavin Pathak (a Full Stack Developer & AI Engineer).
Your goal is to answer questions about Bhavin's background, skills, experiences, and project portfolio.

Bhavin's profile details:
- Name: Bhavin Pathak
- Current Role: SDE-1 at Meril Life Sciences Pvt. Ltd (NuvoAI Department) since Dec 2024. Main technologies: Node.js, React.js, AI/LLMs, Express.js, PostgreSQL.
- Location: Vapi, Gujarat, India. Originally from Sagwara, Rajasthan.
- Domain: bhaviinpathak.online
- Stack: Frontend (React.js, TailwindCSS), Mobile (Swift, SwiftUI, Flutter, Dart, React Native), Backend (Node.js, Express.js, Python), Database (PostgreSQL, MongoDB, Supabase, Firebase, Cassandra), DevOps (Docker, CI/CD, GitHub Actions, Jenkins).
- Projects: YT AI Q&A, Clario, BMIwise, Split-Digits, Evernotes, etc.
- LeetCode Username: bhavinpathak8729 (solved 49+ problems, focus on Medium complexity).

STRICT INSTRUCTIONS:
1. ONLY answer questions directly related to Bhavin Pathak, his career, technical capabilities, projects, or professional availability.
2. If the user asks general coding questions NOT related to Bhavin, or asks about completely unrelated topics (e.g. recipes, weather, geography, trivia, riddles, history, sports, writing random scripts, mathematical calculations), you MUST politely refuse. Respond with: "I am Bhavin's AI Twin, designed only to answer questions about Bhavin Pathak's professional profile, skills, and projects. Please ask me something related to him."
3. Keep responses structured, concise, and professional.
4. Do not make up facts. If you don't know the answer, say that you don't have that detail and suggest reaching out to Bhavin directly at bhavinpathak29@gmail.com.`;

    const handleSend = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query) return;

        if (!textToSend) setInput("");
        setMessages(prev => [...prev, { role: "user", text: query }]);
        setIsTyping(true);

        const lowerQuery = query.toLowerCase().replace(/[?.]/g, "");

        // Check if query is in predefined static responses for zero latency & offline mode
        if (staticResponses[lowerQuery]) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "bot", text: staticResponses[lowerQuery] }]);
                setIsTyping(false);
            }, 750);
            return;
        }

        // If no API key configured, prompt the user or reply with mock warning
        if (!apiKey) {
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        role: "bot",
                        text: "I am currently running in demo mode because a **Gemini API Key** is not set. You can click the **Settings Gear icon** at the top right to paste a free Gemini API key and chat with me live, or try one of the suggested prompts below!"
                    }
                ]);
                setIsTyping(false);
            }, 800);
            return;
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: query }] }],
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 350
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error("API Request Failed");
            }

            const data = await response.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I could not formulate a response. Please try again.";

            setMessages(prev => [...prev, { role: "bot", text: replyText }]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: "Sorry, I ran into a connectivity error. Please verify your API Key configuration or network connection and try again."
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSaveKey = () => {
        const trimmed = tempKey.trim();
        localStorage.setItem("GEMINI_API_KEY", trimmed);
        setApiKey(trimmed);
        setShowSettings(false);
        setTempKey("");
        setMessages(prev => [
            ...prev,
            { role: "bot", text: trimmed ? "🚀 **Gemini API Key configured successfully!** Ask me any question now." : "API Key cleared. Running in static mode." }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Slide-Up Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-[90vw] sm:w-[380px] h-[500px] mb-4 overflow-hidden relative"
                    >
                        <LiquidContainer className="w-full h-full p-4 flex flex-col border border-gray-200/80 dark:border-white/10 shadow-2xl relative">

                            {/* Chat Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 animate-pulse">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white">{"Bhavin's AI Twin"}</h3>
                                        <span className="text-[9px] text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                            Online & ready
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSettings(!showSettings)}
                                        aria-label="API Settings"
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close chatbot"
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Settings Panel Drawer */}
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-gray-50/90 dark:bg-slate-900/90 border-b border-gray-200/60 dark:border-white/10 overflow-hidden flex flex-col p-3 rounded-lg mt-2 gap-2 text-xs"
                                    >
                                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                                            <Key className="w-3.5 h-3.5 text-blue-500" />
                                            Configure Gemini API Key
                                        </div>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                            Keys are saved locally in your browser. If not set, the assistant handles specific static prompt categories.
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="password"
                                                placeholder={apiKey ? "••••••••••••••••" : "Paste Gemini API Key..."}
                                                value={tempKey}
                                                onChange={(e) => setTempKey(e.target.value)}
                                                className="flex-grow px-2 py-1 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded text-xs text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSaveKey}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs cursor-pointer transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                        {apiKey && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    localStorage.removeItem("GEMINI_API_KEY");
                                                    setApiKey("");
                                                    setMessages(prev => [...prev, { role: "bot", text: "API Key cleared." }]);
                                                    setShowSettings(false);
                                                }}
                                                className="text-[10px] text-red-500 hover:underline self-start font-medium cursor-pointer"
                                            >
                                                Clear Saved Key
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Chat Messages Log */}
                            <div className="flex-grow overflow-y-auto py-3 pr-1 flex flex-col gap-3 scrollbar-thin">
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

                                {isTyping && (
                                    <div className="self-start flex flex-col items-start gap-1 max-w-[85%]">
                                        <div className="p-3 bg-slate-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-gray-500 dark:text-gray-400 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                            <span className="text-[10px] font-medium italic">Twin is formulating reply...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Prompt Suggestions */}
                            {messages.length < 5 && (
                                <div className="flex flex-col gap-1.5 pb-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Suggested prompts:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.keys(staticResponses).map((p, idx) => (
                                            <button
                                                type="button"
                                                key={idx}
                                                onClick={() => handleSend(p)}
                                                className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/5 cursor-pointer font-medium transition-colors"
                                            >
                                                {p.replace(/\b\w/g, c => c.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Input Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2 pt-2 border-t border-gray-200/60 dark:border-white/10"
                            >
                                <input
                                    type="text"
                                    placeholder="Ask about Bhavin..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-grow bg-slate-100 dark:bg-black/40 border border-gray-200 dark:border-white/15 px-3 py-2 rounded-xl text-xs md:text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    aria-label="Send message"
                                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-md"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>

                        </LiquidContainer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button with pulsing notification halo */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle chat widget"
                className={`p-4 rounded-full text-white cursor-pointer relative shadow-2xl transition-all duration-300 flex items-center justify-center ${isOpen
                        ? "bg-red-500 border-red-600 rotate-90"
                        : "bg-blue-600 hover:bg-blue-700 border-blue-700 hover:shadow-blue-500/20"
                    }`}
            >
                {/* Pulsing ring indicator */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                )}
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

        </div>
    );
}
