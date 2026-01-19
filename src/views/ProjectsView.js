import { motion } from "framer-motion";
import projectsData from "../static/my-projects.json";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { Github, ExternalLink } from "lucide-react";
import React from "react";
import { pageVariants } from "../utils/animations.js";
import SEO from "../components/SEO.js";

export default function ProjectsView() {
    // Scroll logic removed - handled in Header

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title="Works"
                description="Explore the projects and creations of Bhavin Pathak, featuring innovative software solutions, AI applications, and web development."
                url="/projects"
            />
            <Header title={projectsData.pageTitle} subtitle={projectsData.pageSubtitle} />

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12 w-full flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsData.projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            whileHover={{ scale: 1.05, y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="h-full"
                        >
                            <LiquidContainer delay={idx * 0.1} className="p-6 flex flex-col h-full bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                        {project.language}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.topics.slice(0, 4).map((topic, i) => (
                                        <span key={i} className="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10 mt-auto">
                                    <a
                                        href={project.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4" /> Source
                                    </a>
                                    {project.homepage && (
                                        <a
                                            href={project.homepage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors ml-auto"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Demo
                                        </a>
                                    )}
                                </div>
                            </LiquidContainer>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* Footer removed (global) */}
        </motion.div>
    );
}
