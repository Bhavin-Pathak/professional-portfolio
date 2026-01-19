import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LiquidContainer } from "../components/LiquidContainer.js";
import { User, Code, Briefcase, Cpu, Mail, Newspaper } from "lucide-react";
import homeData from "../static/initial-home.json";
import SEO from "../components/SEO.js";

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
            <SEO
                title="Bhavin Pathak | Best Full Stack Developer & Tech Consultant"
                description="Bhavin Pathak: Expert Full Stack Developer & Software Architect. Specialized in building scalable web applications and custom software solutions."
                url="/"
            />
            {/* Desktop: Max width increased for horizontal layout Mobile: Standard width */}
            <LiquidContainer className="w-full md:max-w-6xl p-6 md:p-12">
                <h1 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {homeData.homeTitle}
                </h1>
                {/* Mobile: Vertical Stack (flex-col) Desktop: Horizontal Row (md:flex-row) */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(item.path)}
                            className="relative group flex-1 min-h-[5rem] md:min-h-[16rem] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 flex flex-row md:flex-col items-center justify-start md:justify-center p-4 md:p-6 gap-4 md:gap-6 cursor-pointer"
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${item.color} transition-opacity duration-300`} />
                            {/* Icon */}
                            <div className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-gray-800 dark:text-white" />
                            </div>
                            {/* Label */}
                            <span className="text-base md:text-xl font-medium text-gray-800 dark:text-white/90 group-hover:text-black dark:group-hover:text-white tracking-wide">
                                {item.label}
                            </span>
                            {/* Mobile Arrow (Hidden on Desktop) */}
                            <div className="md:hidden ml-auto text-gray-500 dark:text-white/40">
                                →
                            </div>
                        </motion.button>
                    ))}
                </div>
            </LiquidContainer>
        </div>
    );
}
