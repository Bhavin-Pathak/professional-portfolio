import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LiquidContainer } from "../components/LiquidContainer.js";
import TiltCard from "../components/TiltCard.js";
import { User, Code, Briefcase, Cpu, Mail, Newspaper, GitBranch } from "lucide-react";
import homeData from "../static/initial-home.json";
import { useTheme } from "../theme/theme-provider.js";

export default function HomeView() {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const menuItems = [
        { 
            label: "Identity", 
            path: "/about", 
            icon: User, 
            color: "from-blue-500 to-cyan-500", 
            iconColorLight: "text-blue-600", 
            borderLight: "border-blue-200",
            description: "Who I am, my professional background, core programming values, and structural goals.",
            detail: "SDE-1 @ NuvoAI",
            gridClass: "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 min-h-[9rem] sm:min-h-[13rem] md:min-h-[14rem]" 
        },
        { 
            label: "The Stack", 
            path: "/skills", 
            icon: Cpu, 
            color: "from-purple-500 to-pink-500", 
            iconColorLight: "text-purple-600", 
            borderLight: "border-purple-200",
            description: "A summary of core backend frameworks, frontend engines, and mobile architectures.",
            detail: "React • Node • Swift • SQL",
            gridClass: "col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-3 min-h-[9rem] sm:min-h-[13rem] md:min-h-[14rem]" 
        },
        { 
            label: "Works", 
            path: "/projects", 
            icon: Code, 
            color: "from-green-500 to-emerald-500", 
            iconColorLight: "text-green-600", 
            borderLight: "border-green-200",
            description: "A deep dive into built solutions: production applications, AI agents, and open-source packages.",
            detail: "15+ Projects Showcase",
            gridClass: "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-4 min-h-[9rem] sm:min-h-[13rem] md:min-h-[14rem]" 
        },
        { 
            label: "Experience", 
            path: "/experience", 
            icon: Briefcase, 
            color: "from-orange-500 to-red-500", 
            iconColorLight: "text-orange-600", 
            borderLight: "border-orange-200",
            description: "Professional journey and roles engineered at Meril NuvoAI, UB Softec, and RnD Technosoft.",
            detail: "3+ Years Professional",
            gridClass: "col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-h-[9rem] sm:min-h-[13rem] md:min-h-[14rem]" 
        },
        { 
            label: "Timeline", 
            path: "/timeline", 
            icon: GitBranch, 
            color: "from-indigo-500 to-violet-500", 
            iconColorLight: "text-indigo-600", 
            borderLight: "border-indigo-200",
            description: "Live real-time feed loading active GitHub repository commits and LeetCode problem solving.",
            detail: "Real-Time Dev Metrics",
            gridClass: "col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-h-[9rem] sm:min-h-[12rem] md:min-h-[13rem]" 
        },
        { 
            label: "Insights", 
            path: "/blog", 
            icon: Newspaper, 
            color: "from-yellow-500 to-orange-500", 
            iconColorLight: "text-yellow-600", 
            borderLight: "border-yellow-200",
            description: "Writing and sharing guides about full stack technologies, Postgres scaling, and AI architectures.",
            detail: "Engineering Blogs",
            gridClass: "col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2 min-h-[9rem] sm:min-h-[12rem] md:min-h-[13rem]" 
        },
        { 
            label: "Connect", 
            path: "/contact", 
            icon: Mail, 
            color: "from-gray-500 to-slate-500", 
            iconColorLight: "text-slate-600", 
            borderLight: "border-slate-200",
            description: "Let's collaborate! Reach out for job proposals, general networking, or system discussions.",
            detail: "Get In Touch",
            gridClass: "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 min-h-[9rem] sm:min-h-[12rem] md:min-h-[13rem]" 
        },
    ];

    return (
        <div className="flex-grow h-full flex items-center justify-center p-4">
            <Helmet>
                <title>Bhavin Pathak | Full Stack Developer &amp; AI Engineer</title>
                <meta name="description" content="Bhavin Pathak — Full Stack Developer specializing in AI-driven solutions, React, Node.js, Flutter, and scalable enterprise software. SDE-1 at Meril Life Sciences." />
                <link rel="canonical" href="https://bhaviinpathak.online/" />
                <meta property="og:title" content="Bhavin Pathak | Full Stack Developer &amp; AI Engineer" />
                <meta property="og:description" content="Bhavin Pathak — Full Stack Developer specializing in AI-driven solutions, React, Node.js, Flutter, and scalable enterprise software. SDE-1 at Meril Life Sciences." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bhaviinpathak.online/" />
                <meta property="og:image" content="https://bhaviinpathak.online/images/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Bhavin Pathak",
                        "url": "https://bhaviinpathak.online/",
                        "image": "https://bhaviinpathak.online/images/og-image.png",
                        "jobTitle": "Full Stack Developer & AI Engineer",
                        "worksFor": {
                            "@type": "Organization",
                            "name": "Meril Life Sciences"
                        },
                        "sameAs": [
                            "https://github.com/Bhavin-Pathak",
                            "https://linkedin.com/in/bhavin-pathak"
                        ]
                    })}
                </script>
            </Helmet>
            <LiquidContainer className="w-full md:max-w-6xl p-6 md:p-12 z-10">
                <h1 className="text-2xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400">
                    {homeData.homeTitle}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 w-full">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className={`${item.gridClass}`}
                        >
                            <TiltCard
                                onClick={() => navigate(item.path)}
                                aria-label={`Go to ${item.label} page`}
                                className="relative group w-full h-full rounded-[2rem] overflow-hidden
                                    border border-gray-200/80 dark:border-white/10
                                    bg-white/40 dark:bg-white/5
                                    hover:bg-gray-50 dark:hover:bg-white/10
                                    transition-all duration-200 flex flex-col justify-between p-6 cursor-pointer"
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 bg-gradient-to-br ${item.color} transition-opacity duration-300 pointer-events-none`} />

                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex items-center gap-3">
                                        {/* Icon — with translateZ for 3D depth */}
                                        <div 
                                            className="transform-gpu transition-all duration-300 shrink-0"
                                            style={{ transform: "translateZ(40px)" }}
                                        >
                                            {isDark ? (
                                                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                                    <item.icon className="w-5 h-5 text-white" />
                                                </div>
                                            ) : (
                                                <div className={`p-2.5 rounded-xl border-2 ${item.borderLight} bg-white group-hover:scale-110 transition-transform duration-200`}>
                                                    <item.icon className={`w-5 h-5 ${item.iconColorLight}`} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Label — with translateZ for 3D depth */}
                                        <span 
                                            className="text-base md:text-lg font-bold text-gray-800 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white tracking-wide transform-gpu transition-colors duration-200"
                                            style={{ transform: "translateZ(25px)" }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Bottom Pill Detail / Arrow row */}
                                <div className="flex items-center justify-between mt-4 w-full">
                                    {item.detail && (
                                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200/50 dark:bg-white/5 border border-gray-300/30 dark:border-white/5 text-gray-600 dark:text-gray-400 tracking-wider">
                                            {item.detail}
                                        </div>
                                    )}
                                    <div className="text-gray-400 dark:text-white/40 group-hover:translate-x-1 transition-transform duration-250">→</div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </LiquidContainer>
        </div>
    );
}
