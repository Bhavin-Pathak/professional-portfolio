import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { Github, Code, Briefcase, Award, Calendar, ExternalLink, RefreshCw, Layers, AlertCircle } from "lucide-react";
import { pageVariants } from "../utils/animations.js";
import { formatDate, formatLeetcodeSubmissions, formatGithubRepositories } from "../utils/timelineUtils.js";
import { logAnalyticsEvent } from "../utils/chatbotUtils.js";

const GITHUB_REPOS_URL = process.env.REACT_APP_GITHUB_REPOS_URL || "https://api.github.com/users/Bhavin-Pathak/repos";
const GITHUB_PROFILE_URL = process.env.REACT_APP_GITHUB_PROFILE_URL || "https://api.github.com/users/Bhavin-Pathak";
const LEETCODE_API_URL = process.env.REACT_APP_LEETCODE_API_URL || "https://leetcode-api-faisalshohag.vercel.app/bhavinpathak8729/";

export default function TimelineView() {
    const [filter, setFilter] = useState("milestones");
    const [loading, setLoading] = useState(true);
    const [githubEvents, setGithubEvents] = useState([]);
    const [imgError, setImgError] = useState(false);
    const [githubStats, setGithubStats] = useState({
        avatarUrl: "https://avatars.githubusercontent.com/u/105209903?v=4",
        publicRepos: "--",
        followers: "--"
    });
    const [leetcodeData, setLeetcodeData] = useState(null);
    const [error, setError] = useState(false);

    // Compute LeetCode visual variables
    const leetcodeStats = (() => {
        const totalSolved = leetcodeData?.totalSolved || 0;
        const easySolved = leetcodeData?.easySolved || 0;
        const mediumSolved = leetcodeData?.mediumSolved || 0;
        const hardSolved = leetcodeData?.hardSolved || 0;

        const totalQuestions = leetcodeData?.totalQuestions || 3300;
        const totalEasy = leetcodeData?.totalEasy || 820;
        const totalMedium = leetcodeData?.totalMedium || 1720;
        const totalHard = leetcodeData?.totalHard || 760;

        const totalPercent = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
        const easyPercent = totalEasy > 0 ? Math.round((easySolved / totalEasy) * 100) : 0;
        const mediumPercent = totalMedium > 0 ? Math.round((mediumSolved / totalMedium) * 100) : 0;
        const hardPercent = totalHard > 0 ? Math.round((hardSolved / totalHard) * 100) : 0;

        const r = 36;
        const circumference = 2 * Math.PI * r;
        const strokeDashoffset = circumference - (totalPercent / 100) * circumference;

        return {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            totalQuestions,
            totalEasy,
            totalMedium,
            totalHard,
            totalPercent,
            easyPercent,
            mediumPercent,
            hardPercent,
            circumference,
            strokeDashoffset
        };
    })();

    // Static Professional Milestones
    const milestones = [
        {
            id: "m1",
            type: "milestone",
            title: "Started SDE-1 Role at Meril Life Sciences",
            description: "Joined the NuvoAI department. Building enterprise healthcare products, managing LLM integrations, microservices, and React/Node setups.",
            date: "2024-12-01T09:00:00Z",
            icon: Briefcase,
            color: "from-blue-500 to-purple-500",
            category: "Milestones"
        },
        {
            id: "m2",
            type: "milestone",
            title: "Joined UB Softec as Mobile Developer",
            description: "Built mobile applications using Flutter and Dart. Engineered NodeJS/Firebase backends and MongoDB structures.",
            date: "2024-04-01T09:00:00Z",
            icon: Code,
            color: "from-orange-500 to-red-500",
            category: "Milestones"
        },
        {
            id: "m3",
            type: "milestone",
            title: "Joined RnD Technosoft as iOS Developer",
            description: "Developed native iOS applications with Swift, SwiftUI, and UIKit. Managed deployment pipelines to App Store Connect.",
            date: "2022-06-01T09:00:00Z",
            icon: Award,
            color: "from-green-500 to-emerald-500",
            category: "Milestones"
        },
        {
            id: "m4",
            type: "milestone",
            title: "Technical Specialist at Earth Infotech",
            description: "Managed network infrastructure, system hardware engineering, and Linux servers.",
            date: "2020-04-01T09:00:00Z",
            icon: Layers,
            color: "from-gray-500 to-slate-500",
            category: "Milestones"
        }
    ];

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            // Fetch GitHub public repositories from environment variable
            const ghPromise = fetch(GITHUB_REPOS_URL)
                .then(res => (res.ok ? res.json() : []))
                .catch(() => []);

            // Fetch GitHub public profile details from environment variable
            const ghProfilePromise = fetch(GITHUB_PROFILE_URL)
                .then(res => (res.ok ? res.json() : null))
                .catch(() => null);

            // Fetch LeetCode status from environment variable
            const lcPromise = fetch(LEETCODE_API_URL)
                .then(res => (res.ok ? res.json() : null))
                .catch(() => null);

            const [ghData, ghProfileData, lcData] = await Promise.all([ghPromise, ghProfilePromise, lcPromise]);

            setGithubStats({
                avatarUrl: ghProfileData?.avatar_url ?? "https://avatars.githubusercontent.com/u/105209903?v=4",
                publicRepos: ghProfileData?.public_repos ?? "--",
                followers: ghProfileData?.followers ?? "--"
            });

            // Format GitHub Repositories using utility function
            const parsedGH = formatGithubRepositories(ghData);

            setGithubEvents(parsedGH);
            setLeetcodeData(lcData);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Merge and sort all items chronologically
    const allTimelineItems = [
        ...milestones,
        ...githubEvents,
        ...formatLeetcodeSubmissions(leetcodeData)
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter items
    const filteredItems = allTimelineItems.filter(item => {
        if (filter === "all") return true;
        if (filter === "github") return item.type === "github";
        if (filter === "leetcode") return item.type === "leetcode";
        if (filter === "milestones") return item.type === "milestone";
        return true;
    });

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <Helmet>
                <title>Timeline | Bhavin Pathak — Dev Activity Feed</title>
                <meta name="description" content="Explore Bhavin Pathak's dynamic developer activity timeline, showcasing real-time GitHub events and LeetCode problem-solving status." />
                <link rel="canonical" href="https://bhaviinpathak.online/timeline" />
            </Helmet>
            
            <Header title="Dev Timeline" subtitle="Live feed of my GitHub activity, LeetCode progress, and major milestones" />

            <div className="max-w-4xl mx-auto w-full p-4 md:p-8 pt-28 md:pt-36 flex-grow flex flex-col gap-8">
                
                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Live dynamic feeds could not be loaded. Showing career milestones.
                    </div>
                )}

                {/* Dynamic Stats Row based on active filter */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {filter === "leetcode" && (
                            <motion.div
                                key="leetcode-stats"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="w-full font-bold"
                            >
                                <LiquidContainer className="p-6 md:p-8 border border-gray-200/80 dark:border-white/10 w-full min-h-[180px]">
                                    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                                        {/* Circular Progress Ring */}
                                        <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                                            <div className="relative w-28 h-28 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    {/* Background circle */}
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="36"
                                                        className="stroke-gray-100 dark:stroke-white/5 fill-transparent"
                                                        strokeWidth="8"
                                                    />
                                                    {/* Progress circle */}
                                                    <motion.circle
                                                        cx="56"
                                                        cy="56"
                                                        r="36"
                                                        className="stroke-amber-500 fill-transparent"
                                                        strokeWidth="8"
                                                        strokeDasharray={226.2}
                                                        initial={{ strokeDashoffset: 226.2 }}
                                                        animate={{ strokeDashoffset: leetcodeStats.strokeDashoffset }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                {/* Text Overlay */}
                                                <div className="absolute flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">
                                                        {leetcodeData ? leetcodeStats.totalSolved : "--"}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 leading-none">
                                                        Solved
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                                {leetcodeData ? `${leetcodeStats.totalPercent}% Progress` : "Loading..."}
                                            </span>
                                        </div>

                                        {/* Difficulty Breakdown Bars */}
                                        <div className="flex-grow w-full flex flex-col gap-4">
                                            {/* Easy */}
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex justify-between items-end text-xs font-bold">
                                                    <span className="text-green-600 dark:text-green-400 uppercase tracking-wider">Easy</span>
                                                    <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                                                        {leetcodeData ? leetcodeStats.easySolved : "--"} <span className="text-[10px] opacity-60">/ {leetcodeStats.totalEasy}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: leetcodeData ? `${leetcodeStats.easyPercent}%` : 0 }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Medium */}
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex justify-between items-end text-xs font-bold">
                                                    <span className="text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Medium</span>
                                                    <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                                                        {leetcodeData ? leetcodeStats.mediumSolved : "--"} <span className="text-[10px] opacity-60">/ {leetcodeStats.totalMedium}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-yellow-500 dark:bg-yellow-400 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: leetcodeData ? `${leetcodeStats.mediumPercent}%` : 0 }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Hard */}
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="flex justify-between items-end text-xs font-bold">
                                                    <span className="text-red-600 dark:text-red-400 uppercase tracking-wider">Hard</span>
                                                    <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                                                        {leetcodeData ? leetcodeStats.hardSolved : "--"} <span className="text-[10px] opacity-60">/ {leetcodeStats.totalHard}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-red-500 dark:bg-red-400 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: leetcodeData ? `${leetcodeStats.hardPercent}%` : 0 }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </LiquidContainer>
                            </motion.div>
                        )}

                        {filter === "github" && (
                            <motion.div
                                key="github-stats"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full"
                            >
                                {/* Card 1: Avatar Profile */}
                                <LiquidContainer
                                    key={`avatar-${githubStats ? "loaded" : "loading"}`}
                                    className="p-4 border border-gray-200/80 dark:border-white/10 min-h-[105px]"
                                >
                                    <div className="flex flex-col items-center justify-center text-center gap-1 h-full w-full">
                                        {!imgError ? (
                                            <img
                                                src={githubStats.avatarUrl}
                                                alt="Bhavin Pathak"
                                                referrerPolicy="no-referrer"
                                                className="w-11 h-11 rounded-full border-2 border-indigo-500 shadow-sm object-cover"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full border-2 border-indigo-500 shadow-sm bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                BP
                                            </div>
                                        )}
                                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none mt-1">
                                            Bhavin-Pathak
                                        </span>
                                    </div>
                                </LiquidContainer>

                                {/* Card 2: Public Repos */}
                                <LiquidContainer
                                    key={`repos-${githubStats ? "loaded" : "loading"}`}
                                    className="p-5 border border-gray-200/80 dark:border-white/10 min-h-[105px]"
                                >
                                    <div className="flex flex-col items-center justify-center text-center gap-1.5 h-full w-full">
                                        <span className="text-3xl md:text-4xl font-black text-indigo-500 dark:text-indigo-400 leading-none tabular-nums">
                                            {githubStats.publicRepos}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none">
                                            Public Repos
                                        </span>
                                    </div>
                                </LiquidContainer>

                                {/* Card 3: Followers */}
                                <LiquidContainer
                                    key={`followers-${githubStats ? "loaded" : "loading"}`}
                                    className="p-5 border border-gray-200/80 dark:border-white/10 min-h-[105px]"
                                >
                                    <div className="flex flex-col items-center justify-center text-center gap-1.5 h-full w-full">
                                        <span className="text-3xl md:text-4xl font-black text-violet-500 dark:text-violet-400 leading-none tabular-nums">
                                            {githubStats.followers}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none">
                                            Followers
                                        </span>
                                    </div>
                                </LiquidContainer>

                                {/* Card 4: Follow Button */}
                                <LiquidContainer
                                    key="follow-button"
                                    className="p-4 border border-gray-200/80 dark:border-white/10 min-h-[105px]"
                                >
                                    <div className="flex flex-col items-center justify-center text-center h-full w-full">
                                        <a
                                            href="https://github.com/Bhavin-Pathak"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs md:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <Github className="w-3.5 h-3.5" />
                                            Follow
                                        </a>
                                    </div>
                                </LiquidContainer>
                            </motion.div>
                        )}

                        {filter === "milestones" && (
                            <motion.div
                                key="milestones-stats"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full"
                            >
                                {[
                                    { label: "Experience", value: "3+ Yrs", color: "text-amber-500 dark:text-amber-400" },
                                    { label: "Tech Roles", value: "4 Roles", color: "text-emerald-500 dark:text-emerald-400" },
                                    { label: "Featured Projects", value: "15+", color: "text-orange-500 dark:text-orange-400" },
                                    { label: "Key Milestones", value: "4 Major", color: "text-rose-500 dark:text-rose-400" }
                                ].map(stat => (
                                    <LiquidContainer
                                        key={stat.label}
                                        className="p-5 border border-gray-200/80 dark:border-white/10 min-h-[105px]"
                                    >
                                        <div className="flex flex-col items-center justify-center text-center gap-1.5 h-full w-full">
                                            <span className={`text-2xl md:text-3xl font-black ${stat.color} leading-none`}>
                                                {stat.value}
                                            </span>
                                            <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider leading-none">
                                                {stat.label}
                                            </span>
                                        </div>
                                    </LiquidContainer>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filter & Refresh Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                    <div className="flex gap-2">
                        {["milestones", "leetcode", "github"].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold capitalize border transition-all cursor-pointer ${
                                    filter === t
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-300/60 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                            >
                                {t === "github" ? "GitHub" : t === "leetcode" ? "LeetCode" : "Milestones"}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        aria-label="Refresh timeline activity"
                        className="p-2 rounded-full border border-gray-300/60 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {/* Timeline Grid list */}
                <div className="relative w-full border-l-2 border-gray-300/60 dark:border-white/10 pl-6 md:pl-8 ml-3 md:ml-4 py-2 flex flex-col gap-8">
                    
                    {loading && filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 w-full text-gray-400">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                            <p className="text-sm font-medium">Fetching real-time dev metrics...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-sm">No activity found matching the selected filter.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => {
                                const ItemIcon = item.icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                                        className="relative w-full"
                                    >
                                        {/* Icon Indicator Dot */}
                                        <div className={`absolute -left-[39px] md:-left-[47px] top-1.5 p-2 rounded-full bg-gradient-to-br ${item.color} text-white shadow-md border-4 border-slate-50 dark:border-black transition-colors duration-300 z-10`}>
                                            <ItemIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        </div>

                                        {/* Timeline Glassmorphic Card */}
                                        <LiquidContainer className="border border-gray-200/80 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full w-full">
                                                <div className="flex flex-col gap-1.5 md:max-w-[80%]">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${item.color} uppercase tracking-wider`}>
                                                            {item.category}
                                                        </span>
                                                        <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(item.date)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mt-1 leading-snug">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => {
                                                            logAnalyticsEvent("timeline_click", {
                                                                itemTitle: item.title,
                                                                itemLink: item.link,
                                                                category: item.category
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold self-start md:self-center bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                                                    >
                                                        View Live <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </LiquidContainer>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

            </div>
        </motion.div>
    );
}
