import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LiquidContainer } from "../components/LiquidContainer.js";
import { User, Code, Briefcase, Cpu, Mail, Newspaper } from "lucide-react";
import homeData from "../static/initial-home.json";

export default function HomeView() {
    // Navigation hook
    const navigate = useNavigate();
    // Menu items data
    const menuItems = [
        { label: "Identity", path: "/about", icon: User, color: "from-blue-500 to-cyan-500" },
        { label: "The Stack", path: "/skills", icon: Cpu, color: "from-purple-500 to-pink-500" },
        { label: "Experience", path: "/experience", icon: Briefcase, color: "from-orange-500 to-red-500" },
        { label: "Works", path: "/projects", icon: Code, color: "from-green-500 to-emerald-500" },
        { label: "Insights", path: "/blog", icon: Newspaper, color: "from-yellow-500 to-orange-500" },
        { label: "Connect", path: "/contact", icon: Mail, color: "from-gray-500 to-slate-500" },
    ];
    return (
        <div className="flex-grow h-full flex items-center justify-center p-4">
            {/* Desktop: Max width increased for horizontal layout Mobile: Standard width */}
            <LiquidContainer className="w-full md:max-w-6xl p-6 md:p-12">
                <h1 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {homeData.homeTitle}
                </h1>
                {/* Responsive Grid Layout: 1 col (mobile), 2 cols (tablet), 3 cols (laptop), 6 cols (large desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 w-full">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(item.path)}
                            aria-label={`Go to ${item.label} page`}
                            className="relative group w-full h-full min-h-[5rem] sm:min-h-[12rem] md:min-h-[14rem] xl:min-h-[16rem] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 flex flex-row sm:flex-col items-center justify-start sm:justify-center p-4 gap-4 cursor-pointer"
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${item.color} transition-opacity duration-300`} />
                            {/* Icon */}
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 dark:text-white" />
                            </div>
                            {/* Label */}
                            <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-white/90 group-hover:text-black dark:group-hover:text-white tracking-wide">
                                {item.label}
                            </span>
                            {/* Mobile Arrow (Hidden on Tablet+) */}
                            <div className="sm:hidden ml-auto text-gray-500 dark:text-white/40">
                                →
                            </div>
                        </motion.button>
                    ))}
                </div>
            </LiquidContainer>
        </div>
    );
}
