import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import { Github, Code, Briefcase, Award, Calendar, ExternalLink, RefreshCw, Layers, AlertCircle } from "lucide-react";
import { pageVariants } from "../utils/animations.js";

export default function TimelineView() {
    const [filter, setFilter] = useState("github");
    const [loading, setLoading] = useState(true);
    const [githubEvents, setGithubEvents] = useState([]);
    const [leetcodeData, setLeetcodeData] = useState(null);
    const [error, setError] = useState(false);

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
            // Fetch GitHub public events
            const ghPromise = fetch("https://api.github.com/users/Bhavin-Pathak/events/public")
                .then(res => (res.ok ? res.json() : []))
                .catch(() => []);

            // Fetch LeetCode status
            const lcPromise = fetch("https://leetcode-api-faisalshohag.vercel.app/bhavinpathak8729/")
                .then(res => (res.ok ? res.json() : null))
                .catch(() => null);

            const [ghData, lcData] = await Promise.all([ghPromise, lcPromise]);

            // Format GitHub Events into Timeline Items
            const parsedGH = Array.isArray(ghData) ? ghData.slice(0, 15).map(event => {
                let title = "GitHub Activity";
                let description = "";
                let link = `https://github.com/${event.repo?.name}`;

                if (event.type === "PushEvent") {
                    const commitCount = event.payload?.commits?.length || 0;
                    const commitMsg = event.payload?.commits?.[0]?.message || "Working on code updates";
                    title = `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to ${event.repo?.name.split("/")[1]}`;
                    description = `"${commitMsg}"`;
                } else if (event.type === "CreateEvent") {
                    title = `Created ${event.payload?.ref_type || "repository"} in ${event.repo?.name.split("/")[1]}`;
                    description = `Initialized branch or repository references.`;
                } else if (event.type === "PullRequestEvent") {
                    title = `${event.payload?.action === "opened" ? "Opened" : "Closed"} Pull Request in ${event.repo?.name.split("/")[1]}`;
                    description = event.payload?.pull_request?.title || "";
                    link = event.payload?.pull_request?.html_url || link;
                } else if (event.type === "IssuesEvent") {
                    title = `${event.payload?.action === "opened" ? "Opened" : "Closed"} issue in ${event.repo?.name.split("/")[1]}`;
                    description = event.payload?.issue?.title || "";
                    link = event.payload?.issue?.html_url || link;
                } else {
                    title = `Interacted with ${event.repo?.name.split("/")[1]}`;
                    description = `Event Type: ${event.type}`;
                }

                return {
                    id: event.id,
                    type: "github",
                    title,
                    description,
                    date: event.created_at,
                    icon: Github,
                    color: "from-blue-600 to-indigo-600",
                    link,
                    category: "GitHub Commits"
                };
            }) : [];

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

    // Combine LeetCode submissions with timeline if present
    const getLeetcodeSubmissions = () => {
        if (!leetcodeData || !leetcodeData.recentSubmissions) return [];
        return leetcodeData.recentSubmissions.slice(0, 10).map((sub, idx) => {
            const dateStr = sub.timestamp ? new Date(parseInt(sub.timestamp) * 1000).toISOString() : new Date().toISOString();
            return {
                id: `lc-${idx}-${sub.timestamp}`,
                type: "leetcode",
                title: `Solved LeetCode: ${sub.title}`,
                description: `Language: ${sub.lang.toUpperCase()} | Status: ${sub.statusDisplay}`,
                date: dateStr,
                icon: Code,
                color: "from-yellow-500 to-amber-500",
                link: `https://leetcode.com/problems/${sub.titleSlug}/`,
                category: "LeetCode Solved"
            };
        });
    };

    // Merge and sort all items chronologically
    const allTimelineItems = [
        ...milestones,
        ...githubEvents,
        ...getLeetcodeSubmissions()
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter items
    const filteredItems = allTimelineItems.filter(item => {
        if (filter === "all") return true;
        if (filter === "github") return item.type === "github";
        if (filter === "leetcode") return item.type === "leetcode";
        if (filter === "milestones") return item.type === "milestone";
        return true;
    });

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

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

                {/* LeetCode Stats Row — always visible with fallback numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                    {[
                        { label: "LeetCode Solved", value: leetcodeData?.totalSolved ?? 49, color: "text-blue-500 dark:text-blue-400", size: "text-3xl md:text-4xl font-black" },
                        { label: "Easy", value: leetcodeData?.easySolved ?? 14, color: "text-green-500 dark:text-green-400", size: "text-xl md:text-2xl font-extrabold" },
                        { label: "Medium", value: leetcodeData?.mediumSolved ?? 29, color: "text-yellow-500 dark:text-yellow-400", size: "text-xl md:text-2xl font-extrabold" },
                        { label: "Hard", value: leetcodeData?.hardSolved ?? 6, color: "text-red-500 dark:text-red-400", size: "text-xl md:text-2xl font-extrabold" }
                    ].map(stat => (
                        <LiquidContainer key={stat.label} className="p-4 flex flex-row items-center justify-start gap-3">
                            <span className={`${stat.size} ${stat.color} leading-none tabular-nums`}>{stat.value}</span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{stat.label}</span>
                        </LiquidContainer>
                    ))}
                </div>

                {/* Filter & Refresh Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                    <div className="flex gap-2">
                        {["github", "leetcode", "milestones"].map(t => (
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
                                        <LiquidContainer className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-200/80 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                                            <div className="flex flex-col gap-1.5 max-w-[80%]">
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
                                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold self-start md:self-center bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 transition-all cursor-pointer"
                                                >
                                                    View Live <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
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
