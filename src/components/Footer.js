import { motion } from "framer-motion";
import VisitorCounter from "./VisitorCounter.js";

export default function Footer() {
    return (
        <footer className="w-full bg-transparent py-6 mt-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6"
            >
                <div className="flex items-center gap-2">
                    <VisitorCounter />
                </div>
                <div className="text-gray-400 text-[10px] md:text-sm text-center font-medium opacity-60">
                    © {new Date().getFullYear()} Bhavin Pathak • All rights reserved.
                </div>
            </motion.div>
        </footer>
    );
}
