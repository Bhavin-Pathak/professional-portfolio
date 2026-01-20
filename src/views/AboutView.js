import { motion } from "framer-motion";
import aboutData from "../static/about-me.json";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { Linkedin, Github, Code, DownloadCloud } from "lucide-react";
import { pageVariants } from "../utils/animations.js";
import SEO from "../components/SEO.js";

export default function AboutView() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title="About"
                description="Learn more about Bhavin Pathak, a passionate Full Stack Developer and Technical Architect with a focus on creating impact through technology."
                url="/about"
            />
            <Header title={aboutData.title} subtitle={aboutData.subtitle} />
            <div className="max-w-7xl mx-auto w-full p-4 md:p-8 pt-28 md:pt-36 flex-grow flex items-center justify-center">
                <LiquidContainer className="max-w-5xl w-full p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        {/* Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.3 } }}
                            transition={{ duration: 0.6 }}
                            className="relative group mx-auto md:mx-0 max-w-sm md:max-w-none"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/20 bg-white dark:bg-black/50">
                                <div className="absolute inset-0 bg-blue-500/10" />
                                <img
                                    src={aboutData.image}
                                    alt={aboutData.name}
                                    className="w-full h-auto object-cover relative z-10"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </motion.div>
                        {/* Right: Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 50, transition: { duration: 0.3 } }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
                            className="space-y-6 text-gray-900 dark:text-white"
                        >
                            <p className="text-lg md:text-xl text-blue-700 dark:text-blue-200 border-l-4 border-blue-500 pl-4 bg-black/5 dark:bg-black/20 p-2 rounded-r font-sans">
                                {aboutData.subtitle}
                            </p>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg font-sans mix-blend-normal">
                                <p className="backdrop-blur-none">{aboutData.bio1}</p>
                                <p className="backdrop-blur-none">{aboutData.bio2}</p>
                            </div>
                            {/* Social Links */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: Linkedin, href: aboutData.social.linkedin, label: "LinkedIn" },
                                    { icon: Github, href: aboutData.social.github, label: "GitHub" },
                                    { icon: Code, href: aboutData.social.leetcode, label: "LeetCode" },
                                    { icon: DownloadCloud, href: aboutData.social.resume, label: "Resume" },
                                ].map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-5 py-3 bg-black/5 dark:bg-white/10 rounded-xl hover:bg-black/10 dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/10 hover:scale-105 group"
                                    >
                                        <item.icon className="w-5 h-5 text-gray-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                                        <span className="font-semibold text-gray-800 dark:text-white tracking-wide text-sm">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Technical Focus Section */}
                    {aboutData.expertise && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-16 pt-8 border-t border-black/10 dark:border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white font-sans tracking-tight">Technical Pillars</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {aboutData.expertise.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-blue-500/50 transition-all group"
                                    >
                                        <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:translate-x-1 transition-transform inline-block">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </LiquidContainer>
            </div>
        </motion.div>
    );
}
