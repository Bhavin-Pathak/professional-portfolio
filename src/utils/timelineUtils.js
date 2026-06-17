import { Github, Code } from "lucide-react";

// Format ISO date string to readable user friendly string
export const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

// Format LeetCode submissions list into standardized timeline items
export const formatLeetcodeSubmissions = (leetcodeData) => {
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

// Format GitHub Repositories list into standardized timeline items
export const formatGithubRepositories = (ghData) => {
    if (!Array.isArray(ghData)) return [];
    return ghData.map(repo => {
        const languageStr = repo.language ? ` | ${repo.language}` : "";
        const starsStr = repo.stargazers_count > 0 ? ` ★ ${repo.stargazers_count}` : "";
        return {
            id: `repo-${repo.id}`,
            type: "github",
            title: repo.name,
            description: repo.description || "A public software development repository.",
            date: repo.pushed_at || repo.updated_at || repo.created_at,
            icon: Github,
            color: "from-blue-600 to-indigo-600",
            link: repo.html_url,
            category: `Repository${languageStr}${starsStr}`
        };
    });
};
