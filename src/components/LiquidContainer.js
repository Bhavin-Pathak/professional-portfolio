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
            className={`relative transform-gpu md:backdrop-blur-xl backdrop-blur-md saturate-150 bg-black/5 dark:bg-black/40 
        border border-black/10 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] 
        rounded-[2rem] overflow-hidden ${className}`}
            style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
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
