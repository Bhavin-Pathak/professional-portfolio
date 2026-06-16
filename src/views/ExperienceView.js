import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import experienceData from "../static/work-experience.json";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { pageVariants } from "../utils/animations.js";
import { getTotalExperience } from "../utils/experience-calculate.js";

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
            <Helmet>
                <title>Experience | Bhavin Pathak — Work History</title>
                <meta name="description" content="Bhavin Pathak's professional journey: SDE-1 at Meril, Mobile Developer at UB Softec, iOS Developer at RnD Technosoft, and Technical Specialist at Earth Infotech." />
                <link rel="canonical" href="https://bhavinpathak.dev/experience" />
                <meta property="og:title" content="Experience | Bhavin Pathak — Work History" />
                <meta property="og:description" content="Bhavin Pathak's professional journey: SDE-1 at Meril, Mobile Developer at UB Softec, iOS Developer at RnD Technosoft, and Technical Specialist at Earth Infotech." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bhavinpathak.dev/experience" />
                <meta property="og:image" content="https://bhavinpathak.dev/images/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <Header title={experienceData.pageTitle} subtitle={`${expText} • ${experienceData.pageSubtitle}`} />
            <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12 w-full flex-grow flex flex-col justify-center">
                <div className="space-y-8">
                    {experienceData.jobs.map((job, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                            <LiquidContainer delay={idx * 0.1} className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                                    {/* Companies Logo */}
                                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/20 bg-gray-100 dark:bg-white/5 shadow-lg mx-auto md:mx-0">
                                        <img
                                            src={job.image}
                                            alt={`${job.company} logo`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    {/* Content */}
                                    <div className="flex-grow w-full text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">{job.company}</h3>
                                                <div className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-medium mt-1">{job.position}</div>
                                            </div>
                                            <span className="mt-2 md:mt-0 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 w-fit mx-auto md:mx-0 whitespace-nowrap">
                                                {job.period}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic border-l-2 border-gray-300 dark:border-white/20 pl-4 leading-relaxed">{job.description}</p>
                                <div className="bg-gray-100/80 dark:bg-black/20 rounded-xl p-6 mb-6">
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Key Responsibilities</h4>
                                    <ul className="space-y-2">
                                        {job.responsibilities.map((resp, rIdx) => (
                                            <li key={rIdx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                                                <span className="text-blue-500 mt-1.5">•</span>
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {job.technologies.map((tech, tIdx) => (
                                        <span key={tIdx} className="px-3 py-1 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md text-sm border border-blue-200 dark:border-blue-500/30">
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
