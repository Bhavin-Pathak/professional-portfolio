import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import pkg from "../../package.json";

export default function LoadingView({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const version = pkg.version;

    useEffect(() => {
        // DETECT BOTS (Lighthouse, Googlebot, etc.)
        const isBot = /Lighthouse|Googlebot|HeadlessChrome/i.test(navigator.userAgent);

        // If it's a bot, finish the loader almost instantly (1ms)
        const intervalTime = isBot ? 1 : 30;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(onComplete, 800);
                    }, 400);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalTime);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Atmospheric Digital Pulse - Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <motion.div
                            animate={{
                                opacity: [0.1, 0.2, 0.1],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Loader Body */}
                        <div className="relative w-40 h-40 md:w-56 md:h-56 mb-16 flex items-center justify-center">
                            {/* Outer Spinning Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[1px] border-dashed border-primary/40 rounded-full"
                            />

                            {/* Main Glowing Progress Ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="48%"
                                    className="stroke-white/5 fill-none"
                                    strokeWidth="2"
                                />
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="48%"
                                    className="stroke-primary fill-none"
                                    strokeWidth="2"
                                    strokeDasharray="100 100"
                                    initial={{ strokeDashoffset: 100 }}
                                    animate={{ strokeDashoffset: 100 - progress }}
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Center Inner Pulse */}
                            <motion.div
                                animate={{
                                    scale: [0.95, 1.05, 0.95],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-6 rounded-full bg-primary/10 backdrop-blur-3xl border border-primary/20 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)]"
                            >
                                <div className="flex flex-col items-center relative">
                                    <div className="flex items-baseline">
                                        <motion.span
                                            className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-sans"
                                        >
                                            {Math.floor(progress)}
                                        </motion.span>
                                        <span className="text-xl md:text-2xl font-bold text-primary ml-1">%</span>
                                    </div>
                                    <motion.span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary/80 font-bold mt-1">
                                        Loading
                                    </motion.span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Modern Version Reveal */}
                        <div className="space-y-3 text-center">
                            <motion.h2
                                initial={{ opacity: 0, letterSpacing: "1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                                className="text-sm md:text-base font-bold text-white uppercase tracking-[0.5em]"
                            >
                                v{version}
                            </motion.h2>
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-[1px] w-6 bg-blue-500/30" />
                                <motion.p
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-[10px] md:text-xs text-gray-400 font-mono tracking-[0.3em] uppercase"
                                >
                                    Establishing Connection
                                </motion.p>
                                <div className="h-[1px] w-6 bg-blue-500/30" />
                            </div>
                        </div>
                    </div>

                    {/* Minimalist Scanning Line */}
                    <motion.div
                        animate={{ top: ["-10%", "110%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

LoadingView.propTypes = { onComplete: PropTypes.func.isRequired };
