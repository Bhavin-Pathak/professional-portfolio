import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Enhanced iOS-style Liquid Glass Container
export function LiquidContainer({ children, className = "", delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`relative transform-gpu md:backdrop-blur-xl backdrop-blur-md saturate-150 
        bg-white/60 dark:bg-black/40 
        border border-gray-200/70 dark:border-white/10 
        rounded-[2rem] overflow-hidden ${className}`}
            style={{
                boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
            }}
        >
            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />

            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </motion.div>
    );
}

LiquidContainer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delay: PropTypes.number,
};
