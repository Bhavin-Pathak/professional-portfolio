import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import skillsData from "../static/technical-skills.json";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { Globe, Database, Code, Server, Layers, Smartphone, GitBranch, Cloud, Cpu } from "lucide-react";
import PropTypes from "prop-types";
import { pageVariants } from "../utils/animations.js";
import SEO from "../components/SEO.js";

// Icon mapping (JSON can't store components data)
const iconMap = { Globe, Database, Code, Server, Layers, Smartphone, GitBranch, Cloud, Cpu };

// Custom Animated Skill Bar Component
const SkillBar = ({ name, proficiency }) => {
    const [width, setWidth] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let startTime;
            const duration = 2000;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing for bar width
                const ease = 1 - Math.pow(1 - progress, 4);
                setWidth(ease * proficiency);

                // Random numbers while loading
                if (progress < 1) {
                    setCount(Math.floor(Math.random() * 100));
                    requestAnimationFrame(animate);
                } else {
                    setCount(proficiency);
                }
            };
            requestAnimationFrame(animate);
        }, Math.random() * 200);

        return () => clearTimeout(timeout);
    }, [proficiency]);

    return (
        <div>
            <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span>{name}</span>
                <span className="font-mono text-blue-300">{count}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    style={{ width: `${width}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
            </div>
        </div>
    );
};

export default function SkillsView() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title="The Stack"
                description="Explore the technical stack and expertise of Bhavin Pathak, ranging from frontend technologies like React to backend architecture and AI."
                url="/skills"
            />
            <Header title={skillsData.pageTitle} subtitle={skillsData.pageSubtitle} />
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12 w-full flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {skillsData.categories.map((category, idx) => {
                        const Icon = iconMap[category.icon] || Code;
                        return (
                            <LiquidContainer key={idx} delay={idx * 0.1} className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Icon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white">{category.name}</h3>
                                </div>
                                <div className="space-y-6">
                                    {category.skills.map((skill, sIdx) => (
                                        <SkillBar key={sIdx} name={skill.name} proficiency={skill.proficiency} />
                                    ))}
                                </div>
                            </LiquidContainer>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

SkillBar.propTypes = {
    name: PropTypes.string.isRequired,
    proficiency: PropTypes.number.isRequired,
};
