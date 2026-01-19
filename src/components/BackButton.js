import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export function BackButton({ to, className = "" }) {
    // Props
    const navigate = useNavigate();
    const location = useLocation();
    // Function For Handling Back Button Click
    const handleBack = () => {
        if (to) {
            navigate(to, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    // That doesn't show back button on Home
    if (location.pathname === "/") return null;

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1, x: -5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className={`p-2 md:p-3 
        backdrop-blur-3xl saturate-150 bg-black/5 dark:bg-black/30 
        border border-black/10 dark:border-white/10 rounded-full 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] 
        text-gray-800 dark:text-white/90 hover:text-black dark:hover:text-white transition-all duration-300 ${className}`}
            aria-label="Go Back"
        >
            <ArrowLeft className="w-5 h-5" />
        </motion.button>
    );
}

BackButton.propTypes = { to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), className: PropTypes.string };
