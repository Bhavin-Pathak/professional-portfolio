export const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 1.05,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};
