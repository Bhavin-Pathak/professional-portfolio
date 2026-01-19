import { motion, AnimatePresence } from "framer-motion";
import contactData from "../static/contact-me.json";
import aboutData from "../static/about-me.json";
import Header from "../components/Header.js";
import { Linkedin, Github, Mail, Phone, ExternalLink, Copy, Check } from "lucide-react";
import { pageVariants } from "../utils/animations.js";
import { useState, useEffect } from "react";
import SEO from "../components/SEO.js";

export default function ContactView() {
    const [copied, setCopied] = useState("");
    const [showBubble, setShowBubble] = useState(false);
    const [displayedText, setDisplayedText] = useState("");

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    // Typing effect logic
    useEffect(() => {
        if (showBubble) {
            let i = 0;
            const fullText = contactData.availability;
            setDisplayedText("");
            const timer = setInterval(() => {
                setDisplayedText(fullText.slice(0, i + 1));
                i++;
                if (i >= fullText.length) clearInterval(timer);
            }, 40);
            return () => clearInterval(timer);
        }
    }, [showBubble]);

    const contactLinks = [
        {
            icon: Linkedin,
            href: aboutData.social.linkedin,
            label: "LinkedIn",
            value: "Connect with me",
            color: "text-blue-400",
            external: true
        },
        {
            icon: Mail,
            href: "mailto:" + aboutData.social.email,
            label: "Email",
            value: aboutData.social.email,
            color: "text-red-400",
            copyable: true
        },
        {
            icon: Github,
            href: aboutData.social.github,
            label: "GitHub",
            value: "Explore repositories",
            color: "text-white",
            external: true
        },
        {
            icon: Phone,
            href: "tel:" + aboutData.social.phone,
            label: "Phone",
            value: aboutData.social.phone,
            color: "text-green-400",
            copyable: true
        },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-screen w-screen bg-[#030303] overflow-hidden flex flex-col relative font-sans"
        >
            <SEO
                title="Connect"
                description="Get in touch with Bhavin Pathak for collaborations, technical consulting, or just to say hi. Available for high-impact software projects."
                url="/contact"
            />
            {/* Background Grain Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header title={contactData.title} subtitle={contactData.subtitle} />

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6">
                <div className="max-w-4xl w-full flex flex-col items-center">

                    {/* Reverted Header Section */}
                    <div className="text-center mb-10 relative">
                        <div className="flex items-center justify-center gap-3 relative inline-flex">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white m-0">
                                Get in touch
                            </h1>

                            {/* Interactive Status Indicator - Small Version */}
                            <div
                                className="relative flex h-2 w-2 cursor-pointer mt-1 md:mt-2"
                                onMouseEnter={() => {
                                    if (window.innerWidth >= 768) setShowBubble(true);
                                }}
                                onMouseLeave={() => setShowBubble(false)}
                            >
                                <motion.span
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                                ></motion.span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>

                                {/* Message Bubble (Chat Style) - Faster Animation - Hidden on Mobile */}
                                <AnimatePresence>
                                    {showBubble && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -40, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-4 z-50 shadow-2xl hidden md:block"
                                        >
                                            <div className="bg-white text-black px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-bold flex items-center gap-2 relative border border-white/20">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                {displayedText}
                                                <motion.span
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                                    className="w-1 h-3 bg-black ml-0.5"
                                                />
                                                {/* Bubble Tail */}
                                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium mt-3 opacity-80">
                            Available for new collaborations and high-impact projects
                        </p>
                    </div>

                    {/* Compact Professional Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                        {contactLinks.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                whileHover={{ y: -2 }}
                                className="group relative"
                            >
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className={`p-2.5 rounded-xl bg-white/5 ${item.color} transition-transform duration-300`}>
                                            <item.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1 opacity-60">
                                                {item.label}
                                            </span>
                                            <span className="text-xs font-semibold text-white tracking-tight">
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {item.copyable && (
                                            <button
                                                onClick={() => handleCopy(item.value, item.label)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
                                            >
                                                {copied === item.label ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                            </button>
                                        )}
                                        <a
                                            href={item.href}
                                            target={item.external ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
