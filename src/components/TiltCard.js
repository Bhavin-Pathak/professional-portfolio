import { useState, useRef } from "react";
import PropTypes from "prop-types";

export default function TiltCard({ children, className, ...props }) {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});
    const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Coordinates relative to card center, normalized to -1 to +1
        const mouseX = (e.clientX - rect.left) / width - 0.5;
        const mouseY = (e.clientY - rect.top) / height - 0.5;
        
        const rX = -mouseY * 12; // Max 12 degrees tilt for subtle premium look
        const rY = mouseX * 12; // Max 12 degrees tilt

        setStyle({
            transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
        });

        // Dynamic glare effect mapping to mouse cursor position
        const glareX = ((e.clientX - rect.left) / width) * 100;
        const glareY = ((e.clientY - rect.top) / height) * 100;
        
        setGlareStyle({
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: 1
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease",
            transformStyle: "preserve-3d"
        });
        
        setGlareStyle({
            opacity: 0,
            transition: "opacity 0.5s ease"
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
            className={`relative transition-all duration-300 transform-gpu select-none ${className}`}
            {...props}
        >
            {/* Dynamic Glare Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none rounded-2xl z-10"
                style={glareStyle}
            />
            {children}
        </div>
    );
}

TiltCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};
