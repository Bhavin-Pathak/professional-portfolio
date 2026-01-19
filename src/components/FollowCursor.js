'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const FollowCursor = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isPointer, setIsPointer] = useState(false);
    const [clicks, setClicks] = useState([]);

    // Theme Colors
    const primary = "#2563EB"; // Blue
    const primaryGlow = "rgba(37, 99, 235, 0.3)";

    // Ultra-snappier spring configuration for the "follower"
    const followerConfig = { damping: 30, stiffness: 600 };

    const followerX = useSpring(mouseX, followerConfig);
    const followerY = useSpring(mouseY, followerConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target;
            const isClickable = target.closest('button, a, [role="button"], input, textarea, .cursor-pointer');
            setIsPointer(!!isClickable);
        };

        const handleClick = (e) => {
            const id = Date.now();
            setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setClicks(prev => prev.filter(click => click.id !== id));
            }, 800);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleClick);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Click Ripples */}
            <AnimatePresence>
                {clicks.map(click => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 0.6, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        exit={{ opacity: 0 }}
                        style={{
                            left: click.x,
                            top: click.y,
                            translateX: '-50%',
                            translateY: '-50%',
                            borderColor: primary,
                        }}
                        className="absolute w-8 h-8 border-2 rounded-full z-0"
                    />
                ))}
            </AnimatePresence>

            {/* Follower Dot (Larger, Smooth) */}
            <motion.div
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: primaryGlow,
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    width: isPointer ? 40 : 24,
                    height: isPointer ? 40 : 24,
                }}
                className="absolute rounded-full blur-[2px]"
            />

            {/* Precision Dot (Small, Fast) */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 0.8 : 1,
                    backgroundColor: primary,
                }}
                className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_#2563EB]"
            />

            {/* Hover Ring (Only on interactive elements) */}
            <motion.div
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 2.5 : 0,
                    opacity: isPointer ? 1 : 0,
                    borderColor: primary,
                }}
                className="absolute w-6 h-6 border rounded-full blur-[1px]"
            />
        </div>
    );
};

export default FollowCursor;
