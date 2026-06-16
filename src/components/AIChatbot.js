import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, RefreshCw } from "lucide-react";

// ── JSON Data Imports ──────────────────────────────────────────────────────────
import chatbotData from "../static/ai-chatbot-data.json";
import projectsData from "../static/my-projects.json";
import blogData from "../static/blog-posts.json";
import workData from "../static/work-experience.json";
import skillsData from "../static/technical-skills.json";

// ── Inline Markdown Parser ─────────────────────────────────────────────────────
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

// ── System Prompt Builder ──────────────────────────────────────────────────────
// Builds the full system prompt dynamically from all JSON data files.
// Update any JSON file → AI knowledge updates automatically — no code change needed.
function buildSystemPrompt() {
    const { personalInfo, professionalSummary, education } = chatbotData;
    const { jobs } = workData;
    const { projects } = projectsData;
    const { posts } = blogData;

    // Personal Info
    const personalSection = `PERSONAL INFO:
- Full Name: ${personalInfo.fullName}
- Location: ${personalInfo.location}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Portfolio: ${personalInfo.portfolio}
- LinkedIn: ${personalInfo.linkedin}
- GitHub: ${personalInfo.github}
- LeetCode: ${personalInfo.leetcode} (${personalInfo.leetcodeSolved})`;

    // Professional Summary
    const summarySection = `PROFESSIONAL SUMMARY:\n${professionalSummary}`;

    // Technical Skills (from skills JSON)
    const skillsSections = skillsData.categories
        .map(cat => `- ${cat.name}: ${cat.skills.map(s => s.name).join(", ")}`)
        .join("\n");
    const skillsSection = `TECHNICAL SKILLS (EXACT — DO NOT ADD ANYTHING ELSE):\n${skillsSections}`;

    // Work Experience (from work-experience JSON)
    const workSection = `WORK EXPERIENCE:\n\n${jobs.map((job, i) => {
        const tech = job.technologies.join(", ");
        const resp = job.responsibilities.map(r => `   - ${r}`).join("\n");
        return `${i + 1}. ${job.position} — ${job.company} | ${job.period}\n   Tech: ${tech}\n${resp}`;
    }).join("\n\n")}`;

    // Education
    const educationSection = `EDUCATION:\n- ${education.degree} — ${education.university} | ${education.period}`;

    // Projects (from my-projects JSON)
    const projectsSection = `PROJECTS (ALL PROJECTS — EXACT TECH ONLY — DO NOT ADD OR INVENT ANYTHING):\n\n${projects.map((p, i) => {
        const tech = p.topics.join(", ");
        const live = p.homepage ? ` | Live: ${p.homepage}` : "";
        return `${i + 1}. ${p.name} | GitHub: ${p.html_url}${live}\n   - Tech: ${p.language}, ${tech}\n   - ${p.description}`;
    }).join("\n\n")}`;

    // Blog Posts (from blog-posts JSON)
    const blogsSection = `BLOG POSTS / ARTICLES WRITTEN BY BHAVIN:\n\n${posts.map((post, i) => {
        const tags = post.tags.join(", ");
        return `${i + 1}. "${post.title}" (${post.category}, ${post.date}, ${post.readTime})\n   Tags: ${tags}\n   Summary: ${post.excerpt}`;
    }).join("\n\n")}`;

    return `You are "Bhavin's AI Twin" — a professional, accurate, and concise AI assistant built exclusively to represent Bhavin Pathak (Full Stack Developer & AI Engineer) to recruiters and visitors on his portfolio website.

=== BHAVIN'S COMPLETE PROFILE (GROUND TRUTH — USE ONLY THIS DATA) ===

${personalSection}

${summarySection}

${skillsSection}

${workSection}

${educationSection}

${projectsSection}

${blogsSection}

=== END OF PROFILE ===

STRICT INSTRUCTIONS — FOLLOW EXACTLY:
1. ONLY answer questions about Bhavin Pathak using the data above. Never invent, assume, or add any technology, skill, project, or detail NOT present in the data above.
2. If asked about something NOT in the data above, say: "That specific detail isn't in Bhavin's profile. For more info, reach him at bhavinpathak29@gmail.com."
3. If asked general coding questions, trivia, math, recipes, weather, or anything unrelated to Bhavin, refuse politely: "I am Bhavin's AI Twin, designed only to answer questions about Bhavin Pathak's professional profile. Please ask me something related to him."
4. Keep responses structured, concise, and professional. Use bullet points where appropriate. Stay under 3 short paragraphs. Do not cut off mid-sentence.
5. At the very end of your response, you MUST always list exactly 2 or 3 relevant suggested follow-up questions. IMPORTANT: Always write suggestions using "Bhavin" or "Bhavin's" — NEVER use "you" or "your" in suggestions. Examples: "What is Bhavin's primary tech stack?", "What projects did Bhavin work on at Meril?", "What has Bhavin written about on his blog?", "How can I contact Bhavin?". Format exactly like:
[Suggestions] Question 1?, Question 2?
Do not include suggestions inside the main message body.`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! I am **Bhavin's AI Twin**. Ask me anything about Bhavin's skills, projects, experience, blogs, or availability!"
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";

    const chatLogRef = useRef(null);

    // Build system prompt once from all JSON sources
    const systemPrompt = useMemo(() => buildSystemPrompt(), []);

    // Default suggestions from JSON
    const [suggestions, setSuggestions] = useState(chatbotData.defaultSuggestions);

    // Auto-scroll to bottom as text streams
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isTyping, isWaiting]);

    const handleSend = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query) return;
        if (!textToSend) setInput("");
        setMessages(prev => [...prev, { role: "user", text: query }]);
        setIsTyping(true);
        setIsWaiting(true);

        // Demo mode if no API key
        if (!apiKey) {
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        role: "bot",
                        text: "I am currently running in demo mode because the **Gemini API Key** is not configured. Please add the `REACT_APP_GEMINI_API_KEY` environment variable, or try one of the suggested prompts below!"
                    }
                ]);
                setIsTyping(false);
                setIsWaiting(false);
            }, 800);
            return;
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: query }] }],
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: {
                            temperature: 0.1,
                            maxOutputTokens: 800
                        }
                    })
                }
            );

            if (!response.ok) {
                let errorMsg = "Sorry, I ran into a connectivity error. Please try again.";
                try {
                    const errData = await response.json();
                    const errStatus = errData?.error?.status || "";
                    const errCode = response.status;
                    if (errCode === 429 || errStatus === "RESOURCE_EXHAUSTED") {
                        errorMsg = "⚠️ The Gemini API quota has been exceeded for today. Please try again later, or contact Bhavin directly at **bhavinpathak29@gmail.com**.";
                    } else if (errCode === 400) {
                        errorMsg = "⚠️ Invalid API request. Please check the API key configuration.";
                    } else if (errCode === 403) {
                        errorMsg = "⚠️ API Key is invalid or has insufficient permissions. Please verify the key.";
                    }
                } catch (_) { /* use default error message if response body can't be parsed */ }
                setIsWaiting(false);
                setIsTyping(false);
                setMessages(prev => [...prev, { role: "bot", text: errorMsg }]);
                return;
            }

            setIsWaiting(false);

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            let accumulatedText = "";
            let botMessageAdded = false;

            let readingStream = true;
            while (readingStream) {
                const { done, value } = await reader.read();
                if (done) {
                    readingStream = false;
                    break;
                }

                buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const chunk of lines) {
                    const dataLine = chunk.split("\n").find(l => l.startsWith("data: "));
                    if (!dataLine) continue;

                    const jsonStr = dataLine.slice(6).trim();
                    if (!jsonStr || jsonStr === "[DONE]") continue;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const parts = parsed.candidates?.[0]?.content?.parts || [];
                        const chunkText = parts
                            .filter(p => typeof p.text === "string" && p.text.length > 0)
                            .map(p => p.text)
                            .join("");

                        if (!chunkText) continue;

                        accumulatedText += chunkText;

                        // Strip [Suggestions] block from visible text in real-time
                        const sugMarkers = ["[Suggestions]", "[suggestions]", "Suggestions:", "SUGGESTIONS:"];
                        let visibleText = accumulatedText;
                        for (const marker of sugMarkers) {
                            const idx = accumulatedText.indexOf(marker);
                            if (idx !== -1) {
                                visibleText = accumulatedText.substring(0, idx).trim();
                                break;
                            }
                        }

                        if (!botMessageAdded) {
                            botMessageAdded = true;
                            setMessages(prev => [...prev, { role: "bot", text: visibleText }]);
                        } else {
                            setMessages(prev => {
                                const copy = [...prev];
                                copy[copy.length - 1] = { role: "bot", text: visibleText };
                                return copy;
                            });
                        }
                    } catch (e) {
                        // Skip malformed chunks silently
                    }
                }
            }

            if (!botMessageAdded) {
                setMessages(prev => [...prev, { role: "bot", text: "Sorry, I couldn't generate a response. Please try again." }]);
            }

            // Parse final suggestions from AI response
            let finalSuggestions = chatbotData.defaultSuggestions;
            const sugMarkersFinal = ["[Suggestions]", "[suggestions]", "Suggestions:", "SUGGESTIONS:"];
            for (const marker of sugMarkersFinal) {
                const idx = accumulatedText.indexOf(marker);
                if (idx !== -1) {
                    const sugPart = accumulatedText.substring(idx + marker.length).trim();
                    const parsedSugs = sugPart
                        .split(",")
                        .map(s => s.trim().replace(/[[\]"]/g, "").replace(/\?+$/, "?").trim())
                        .filter(s => s.length > 5);
                    if (parsedSugs.length >= 1) {
                        finalSuggestions = parsedSugs.slice(0, 3);
                    }
                    break;
                }
            }
            setSuggestions(finalSuggestions);
            setIsTyping(false);

        } catch (error) {
            console.error("Chatbot Error:", error);
            setIsWaiting(false);
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: "Sorry, I ran into a connectivity error. Please verify your API Key configuration or network connection and try again."
                }
            ]);
        }
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
                        <div className="w-full h-full p-4 flex flex-col md:backdrop-blur-xl backdrop-blur-md saturate-150 bg-white/60 dark:bg-black/40 border border-gray-200/80 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
                            {/* Glossy glass gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
                            <div className="relative z-10 flex-grow flex flex-col h-full overflow-hidden">

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
                                                Online &amp; ready
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
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

                                {/* Chat Messages Log */}
                                <div ref={chatLogRef} className="flex-grow overflow-y-auto py-3 pr-1 flex flex-col gap-3 scrollbar-thin">
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
                                        <div className="self-start flex flex-col items-start gap-1 max-w-[85%]">
                                            <div className="p-3 bg-slate-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-gray-500 dark:text-gray-400 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                                <span className="text-[10px] font-medium italic">Twin is formulating reply...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Prompt Suggestions */}
                                {messages[messages.length - 1]?.role === "bot" && !isTyping && (
                                    <div className="flex flex-col gap-1.5 pb-2">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Suggested prompts:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {suggestions.map((p, idx) => (
                                                <button
                                                    type="button"
                                                    key={idx}
                                                    onClick={() => handleSend(p)}
                                                    className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/5 cursor-pointer font-medium transition-colors"
                                                >
                                                    {p}
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

                            </div>
                        </div>
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
