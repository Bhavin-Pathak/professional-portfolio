import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Enhanced iOS-style Liquid Glass Button
export function LiquidButton({ children, onClick, className = "", ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className={`relative transform-gpu px-8 py-4 backdrop-blur-xl saturate-150 
        bg-slate-900/5 dark:bg-white/5 
        hover:bg-slate-900/10 dark:hover:bg-white/10
        border border-slate-900/10 dark:border-white/10 
        shadow-[0_4px_16px_0_rgba(31,38,135,0.1)] dark:shadow-[0_4px_16px_0_rgba(31,38,135,0.37)] 
        rounded-2xl text-slate-900 dark:text-white font-semibold tracking-wide
        overflow-hidden group transition-all duration-200 ${className}`}
            {...props}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Inner highlight for 3D feel */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />

            <span className="relative z-10 flex items-center justify-center gap-3">
                {children}
            </span>
        </motion.button>
    );
}

LiquidButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};
