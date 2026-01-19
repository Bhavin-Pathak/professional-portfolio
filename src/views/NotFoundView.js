import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LiquidButton } from "../components/LiquidButton.js";
import SEO from "../components/SEO.js";

export default function NotFoundView() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <SEO
                title="404 - Not Found"
                description="The page you are looking for does not exist. Back to Bhavin Pathak's portfolio."
            />
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-9xl font-black text-white/10 absolute -z-10 select-none"
            >
                404
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white">Lost in Space?</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                    The page you&apos;re looking for has drifted off into the digital void.
                </p>
                <LiquidButton onClick={() => navigate("/")} className="px-8 py-3 rounded-full">
                    Gound Control
                </LiquidButton>
            </motion.div>
        </div>
    );
}
