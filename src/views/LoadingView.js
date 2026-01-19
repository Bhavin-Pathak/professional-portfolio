import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import pkg from "../../package.json";

const devLines = [
    "> Initializing repository...",
    "> Connecting to gh-pages...",
    "> npm install...",
    "> Starting dev server...",
    "> Loading assets...",
    "> Compiling styles...",
    "> Linking components...",
    "> Applying dark theme...",
    "> Finalizing development build...",
    "> Ready to launch..."
];

export default function LoadingView({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const version = pkg.version;
    // useEffect for Progress Bar
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(onComplete, 1000);
                    }, 1200); // Wait 1.2s at 100%
                    return 100;
                }
                return prev + 1;
            });
        }, 250);
        return () => clearInterval(timer);
    }, [onComplete]);
    // Show the final line slightly earlier and wait longer at 100%
    const lineIndex = Math.min(Math.floor((progress / 100) * devLines.length), devLines.length - 1);
    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* One-by-One Animated Line Preview (Bottom) */}
                    <div className="absolute bottom-[15%] inset-x-0 flex justify-center opacity-40 pointer-events-none select-none">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={lineIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="font-mono font-bold text-white uppercase tracking-[0.5em] text-[1.2vw] md:text-[0.8vw] text-center"
                            >
                                {devLines[lineIndex]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    {/* Ambient Glows */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.15, 0.1]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-full bg-primary/10 rounded-full blur-[120px]"
                        />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Animated Logo/Shape */}
                        <div className="relative w-28 h-28 md:w-36 md:h-36 mb-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-t-primary border-r-transparent border-b-primary-dark border-l-transparent rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-3 border-2 border-t-transparent border-r-primary/60 border-b-transparent border-l-primary/60 rounded-full opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary-dark to-primary drop-shadow-sm"
                                >
                                    {Math.floor(progress)}%
                                </motion.span>
                            </div>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="w-64 md:w-96 space-y-5">
                            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary via-primary-dark to-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            <div className="flex justify-between items-center text-[10px] md:text-xs uppercase tracking-[0.25em] text-white font-bold">
                                <motion.span
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Initializing Portfolio...
                                </motion.span>
                                <span className="text-white/80">v{version}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

LoadingView.propTypes = { onComplete: PropTypes.func.isRequired };
