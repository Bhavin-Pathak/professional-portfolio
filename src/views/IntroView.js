import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { LiquidButton } from "../components/LiquidButton.js";
import homeData from "../static/initial-home.json";

export default function IntroView({ onEnter }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-transparent text-gray-900 dark:text-white z-40 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center px-4"
            >
                {/* Greeting */}
                <p className="text-lg md:text-2xl text-gray-500 dark:text-gray-400 mb-4 font-medium tracking-wide">
                    {homeData.greeting}
                </p>
                {/* Name */}
                <h1 className="text-4xl md:text-8xl font-black mb-6 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient bg-300%">{homeData.name}</span>
                </h1>
                {/* Role */}
                <h2 className="text-xl md:text-4xl text-gray-800 dark:text-white mb-6 font-bold">
                    {homeData.role}
                </h2>
                {/* Tagline */}
                <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    {homeData.tagline}
                </p>
                <LiquidButton onClick={onEnter} className="text-base px-10 py-4 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]">
                    {homeData.enterText}
                </LiquidButton>
            </motion.div>
        </div>
    );
}

IntroView.propTypes = { onEnter: PropTypes.func.isRequired };
