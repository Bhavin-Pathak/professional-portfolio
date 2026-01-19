import { motion } from "framer-motion";
import experienceData from "../static/work-experience.json";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { pageVariants } from "../utils/animations.js";
import { getTotalExperience } from "../utils/experience-calculate.js";
import SEO from "../components/SEO.js";

export default function ExperienceView() {
    const expText = getTotalExperience();

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title="Experience"
                description="Professional journey and work experience of Bhavin Pathak as a Full Stack Developer and Technical Consultant."
                url="/experience"
            />
            <Header title={experienceData.pageTitle} subtitle={`${expText} • ${experienceData.pageSubtitle}`} />
            <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12 w-full flex-grow flex flex-col justify-center">
                <div className="space-y-8">
                    {experienceData.jobs.map((job, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                            <LiquidContainer delay={idx * 0.1} className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                                    {/* Companies Logo */}
                                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-white/5 shadow-lg mx-auto md:mx-0">
                                        <img
                                            src={job.image}
                                            alt={job.company}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Content */}
                                    <div className="flex-grow w-full text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{job.company}</h3>
                                                <div className="text-base md:text-lg text-gray-300 font-medium mt-1">{job.position}</div>
                                            </div>
                                            <span className="mt-2 md:mt-0 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5 w-fit mx-auto md:mx-0 whitespace-nowrap">
                                                {job.period}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6 italic border-l-2 border-white/20 pl-4 leading-relaxed">{job.description}</p>
                                <div className="bg-black/20 rounded-xl p-6 mb-6">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Responsibilities</h4>
                                    <ul className="space-y-2">
                                        {job.responsibilities.map((resp, rIdx) => (
                                            <li key={rIdx} className="flex gap-3 text-gray-300">
                                                <span className="text-blue-500 mt-1.5">•</span>
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {job.technologies.map((tech, tIdx) => (
                                        <span key={tIdx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm border border-blue-500/30">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </LiquidContainer>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
