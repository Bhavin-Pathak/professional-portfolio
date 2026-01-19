import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackButton } from "./BackButton.js";
import PropTypes from "prop-types";

export default function Header({ title, subtitle, backTo, tag: Tag = "h1" }) {
    // state to track if the user has scrolled
    const [isScrolled, setIsScrolled] = useState(false);
    // useEffect to update the state when the user scrolls
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"}`}>
            <div className="w-full h-16 flex items-center justify-center relative px-4 md:px-8">
                {/* Back Button */}
                <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50">
                    <BackButton to={backTo} />
                </div>
                {/* Title & Subtitle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "backOut", delay: 0.2 }}
                    className="text-center pt-1 px-4 max-w-[85%] flex flex-col items-center justify-center gap-0.5"
                >
                    <Tag className="text-sm md:text-xl font-black text-white tracking-tight leading-tight line-clamp-1">
                        {title}
                    </Tag>
                    {subtitle && (
                        <p className="text-[7px] md:text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] opacity-80 truncate w-full">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}


Header.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    backTo: PropTypes.string,
    tag: PropTypes.string,
};
