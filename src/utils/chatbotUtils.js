import chatbotData from "../static/ai-chatbot-data.json";
import projectsData from "../static/my-projects.json";
import blogData from "../static/blog-posts.json";
import workData from "../static/work-experience.json";
import skillsData from "../static/technical-skills.json";

// ── Inline Markdown → JSX ─────────────────────────────────────────────────────
export const parseInlineMarkdown = (text) => {
    if (!text) return "";
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const tokens = text.split(regex);

    return tokens.map((token, idx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
            return (
                <strong key={idx} className="font-bold text-gray-900 dark:text-white">
                    {token.slice(2, -2)}
                </strong>
            );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
            return (
                <code key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded font-mono text-xs text-red-500 dark:text-pink-400">
                    {token.slice(1, -1)}
                </code>
            );
        }
        if (token.startsWith("[") && token.includes("](")) {
            const label = token.slice(1, token.indexOf("]"));
            const url = token.slice(token.indexOf("](") + 2, token.length - 1);
            return (
                <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400 underline font-semibold hover:opacity-80"
                >
                    {label}
                </a>
            );
        }
        return token;
    });
};

// ── Full Response Text Renderer ───────────────────────────────────────────────
export const formatResponseText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
            return (
                <h4 key={i} className="text-xs md:text-sm font-bold text-blue-500 mt-3 mb-1 uppercase tracking-wider">
                    {parseInlineMarkdown(trimmed.slice(4))}
                </h4>
            );
        }
        if (trimmed.startsWith("## ")) {
            return (
                <h3 key={i} className="text-sm md:text-base font-bold text-indigo-500 mt-4 mb-1">
                    {parseInlineMarkdown(trimmed.slice(3))}
                </h3>
            );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
                <li key={i} className="ml-4 list-disc text-xs md:text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
                    {parseInlineMarkdown(trimmed.slice(2))}
                </li>
            );
        }
        if (trimmed === "") {
            return <div key={i} className="h-2" />;
        }
        return (
            <p key={i} className="text-xs md:text-sm text-gray-700 dark:text-gray-300 my-1 leading-relaxed">
                {parseInlineMarkdown(line)}
            </p>
        );
    });
};

// ── Random Suggestions Picker ─────────────────────────────────────────────────
export function getRandomSuggestions(count = 3) {
    const pool = [...chatbotData.suggestionsPool];
    const picked = [];
    while (picked.length < count && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
}

// ── Parse AI-Generated Suggestions from Response ──────────────────────────────
export function parseAISuggestions(accumulatedText) {
    const markers = ["[Suggestions]", "[suggestions]", "Suggestions:", "SUGGESTIONS:"];
    for (const marker of markers) {
        const idx = accumulatedText.indexOf(marker);
        if (idx !== -1) {
            const sugPart = accumulatedText.substring(idx + marker.length).trim();
            const parsed = sugPart
                .split(",")
                .map(s => s.trim().replace(/[[\]"]/g, "").replace(/\?+$/, "?").trim())
                .filter(s => s.length > 5);
            if (parsed.length >= 1) return parsed.slice(0, 3);
            break;
        }
    }
    return getRandomSuggestions(3);
}

// ── Visible Text Stripper (removes [Suggestions] block while streaming) ────────
export function stripSuggestionsBlock(text) {
    const markers = ["[Suggestions]", "[suggestions]", "Suggestions:", "SUGGESTIONS:"];
    for (const marker of markers) {
        const idx = text.indexOf(marker);
        if (idx !== -1) return text.substring(0, idx).trim();
    }
    return text;
}

// ── System Prompt Builder ─────────────────────────────────────────────────────
export function buildSystemPrompt() {
    const { personalInfo, professionalSummary, education } = chatbotData;
    const { jobs } = workData;
    const { projects } = projectsData;
    const { posts } = blogData;

    const personalSection = `PERSONAL INFO:
- Full Name: ${personalInfo.fullName}
- Location: ${personalInfo.location}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Portfolio: ${personalInfo.portfolio}
- LinkedIn: ${personalInfo.linkedin}
- GitHub: ${personalInfo.github}
- LeetCode: ${personalInfo.leetcode} (${personalInfo.leetcodeSolved})`;

    const summarySection = `PROFESSIONAL SUMMARY:\n${professionalSummary}`;

    const skillsSection = `TECHNICAL SKILLS (EXACT — DO NOT ADD ANYTHING ELSE):\n${skillsData.categories
        .map(cat => `- ${cat.name}: ${cat.skills.map(s => s.name).join(", ")}`)
        .join("\n")}`;

    const workSection = `WORK EXPERIENCE:\n\n${jobs.map((job, i) => {
        const tech = job.technologies.join(", ");
        // Limit to top 3 key responsibilities to save tokens
        const resp = job.responsibilities.slice(0, 3).map(r => `   - ${r}`).join("\n");
        return `${i + 1}. ${job.position} — ${job.company} | ${job.period}\n   Tech: ${tech}\n${resp}`;
    }).join("\n\n")}`;

    const educationSection = `EDUCATION:\n- ${education.degree} — ${education.university} | ${education.period}`;

    const projectsSection = `PROJECTS (TOP FEATURED):\n\n${projects.slice(0, 6).map((p, i) => {
        const live = p.homepage ? ` | Live: ${p.homepage}` : "";
        // Cap descriptions to save tokens
        const shortDesc = p.description.length > 80 ? p.description.slice(0, 80) + "..." : p.description;
        return `${i + 1}. ${p.name} | GitHub: ${p.html_url}${live}\n   - Tech: ${p.language}, ${p.topics.slice(0, 3).join(", ")}\n   - ${shortDesc}`;
    }).join("\n\n")}`;

    const blogsSection = `BLOG POSTS BY BHAVIN:\n\n${posts.slice(0, 4).map((post, i) =>
        `${i + 1}. "${post.title}" (${post.category}, ${post.readTime})\n   Summary: ${post.excerpt.length > 60 ? post.excerpt.slice(0, 60) + "..." : post.excerpt}`
    ).join("\n\n")}`;

    return `You are "Bhavin's Neural Twin" — a professional, accurate, and concise AI assistant built exclusively to represent Bhavin Pathak (Full Stack Developer & AI Engineer) to recruiters and visitors on his portfolio website.

=== BHAVIN'S COMPLETE PROFILE (GROUND TRUTH — USE ONLY THIS DATA) ===

${personalSection}

${summarySection}

${skillsSection}

${workSection}

${educationSection}

${projectsSection}

${blogsSection}

=== END OF PROFILE ===

STRICT INSTRUCTIONS:
1. ONLY answer questions about Bhavin Pathak using the data above. Never invent, assume, or add any technology, skill, or detail NOT present above.
2. If asked about something not in the data, say: "That detail isn't in Bhavin's profile. For more info, reach him at bhavinpathak29@gmail.com."
3. If asked anything unrelated to Bhavin (math, weather, recipes, coding help, trivia), refuse politely: "I'm Bhavin's Neural Twin — I only answer questions about Bhavin Pathak's professional profile."
4. Keep responses structured, concise, and professional. Use bullet points. Stay under 3 short paragraphs. Do not cut off mid-sentence.
5. At the very end of your response, you MUST list exactly 2 or 3 relevant follow-up questions. Always use "Bhavin" or "Bhavin's" — NEVER "you" or "your". Format exactly like:
[Suggestions] Question 1?, Question 2?
Do not include suggestions in the main body.`;
}

// ── Search Q&A Fallback (No API Key Required) ────────────────────
export function getLocalAnswer(query) {
    const q = (query || "").toLowerCase();

    // 1. Skills / Tech Stack
    if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("tool") || q.includes("database") || q.includes("react") || q.includes("node") || q.includes("flutter") || q.includes("swift") || q.includes("python") || q.includes("js") || q.includes("javascript") || q.includes("docker")) {
        const categories = skillsData.categories.map(cat => {
            const skillList = cat.skills.map(s => s.name).join(", ");
            return `- **${cat.name}**: ${skillList}`;
        }).join("\n");
        return `### Technical Skills\nHere is a summary of my core technical stack:\n\n${categories}\n\n[Suggestions] What projects has Bhavin built?, Where does Bhavin work?, Tell me about Bhavin.`;
    }

    // 2. Experience / Work
    if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("company") || q.includes("employer") || q.includes("meril") || q.includes("softec") || q.includes("rnd") || q.includes("nuvo")) {
        const jobs = workData.jobs.map(job => {
            return `- **${job.position}** at **${job.company}** (${job.period})\n  *Tech:* ${job.technologies.join(", ")}`;
        }).join("\n\n");
        return `### Work Experience\nI have over 3 years of professional developer experience:\n\n${jobs}\n\n[Suggestions] What projects has Bhavin built?, How to contact Bhavin?, What is Bhavin's tech stack?`;
    }

    // 3. Projects
    if (q.includes("project") || q.includes("works") || q.includes("portfolio") || q.includes("yt") || q.includes("clario") || q.includes("evernotes") || q.includes("split")) {
        const projs = projectsData.projects.slice(0, 5).map(p => {
            return `- **${p.name}** (${p.language}): ${p.description}`;
        }).join("\n");
        return `### Featured Projects\nHere are some of my top software projects:\n\n${projs}\n\n[Suggestions] What is Bhavin's tech stack?, What is Bhavin's experience?, How to contact Bhavin?`;
    }

    // 4. Contact / Hire / Phone / Email / Salary / Availability / Location
    if (q.includes("contact") || q.includes("reach") || q.includes("email") || q.includes("phone") || q.includes("hire") || q.includes("call") || q.includes("linkedin") || q.includes("location") || q.includes("where") || q.includes("address") || q.includes("availability") || q.includes("freelance") || q.includes("salary")) {
        const { personalInfo } = chatbotData;
        return `### Contact & Availability\nYou can connect with me directly:\n\n- **Email:** ${personalInfo.email}\n- **Phone:** ${personalInfo.phone}\n- **LinkedIn:** [LinkedIn](${personalInfo.linkedin})\n- **GitHub:** [GitHub](${personalInfo.github})\n- **Portfolio:** [Website](${personalInfo.portfolio})\n- **Location:** ${personalInfo.location}\n\n[Suggestions] What are Bhavin's skills?, Tell me about Bhavin., Show me Bhavin's experience.`;
    }

    // 5. Education
    if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("qualification") || q.includes("university") || q.includes("bca") || q.includes("study") || q.includes("school")) {
        const { education } = chatbotData;
        return `### Education & Qualifications\nI hold the following degree:\n\n- **Degree:** ${education.degree}\n- **University:** ${education.university}\n- **Period:** ${education.period}\n\n[Suggestions] What is Bhavin's professional role?, What are Bhavin's skills?, How to contact Bhavin?`;
    }

    // 6. Default Fallback
    const { professionalSummary } = chatbotData;
    return `### Hello! I'm Bhavin's Neural Twin\nI'm a local assistant representing Bhavin Pathak. ${professionalSummary}\n\nAsk me about Bhavin's skills, experience, projects, or education!\n\n[Suggestions] What is Bhavin's tech stack?, Show me Bhavin's experience., How to contact Bhavin?`;
}
