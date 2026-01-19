import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LiquidContainer } from "../components/LiquidContainer.js";
import Header from "../components/Header.js";
import blogData from "../static/blog-posts.json";
import { Tag, Quote, Share2 } from "lucide-react";
import { pageVariants } from "../utils/animations.js";
import SEO from "../components/SEO.js";

export default function BlogDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const foundPost = blogData.posts.find(p => p.id === id);
        if (!foundPost) {
            navigate("/blog", { replace: true });
        } else {
            setPost(foundPost);
        }
    }, [id, navigate]);

    if (!post) return null;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-transparent overflow-x-hidden flex flex-col"
        >
            <SEO
                title={post.title}
                description={post.excerpt}
                url={`/blog/${post.id}`}
                type="article"
            />
            {/* Global Header with Post Metadata */}
            <Header
                title={post.title}
                subtitle={`${post.date} • ${post.readTime} • ${post.author}`}
                backTo="/blog"
                tag="h2"
            />

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-20 w-full flex-grow">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Hero Section / Lead Paragraph */}
                    <div className="mb-12 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-8"
                        >
                            {post.category}
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                            {post.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto italic">
                            &ldquo;{post.excerpt}&rdquo;
                        </p>
                    </div>

                    {/* Article Content */}
                    <LiquidContainer className="p-8 md:p-16 mb-12 shadow-2xl relative overflow-hidden">
                        {/* Decorative Background Icon */}
                        <Quote className="absolute top-10 right-10 w-32 h-32 text-white/5 pointer-events-none" />

                        <article className="prose prose-invert prose-lg max-w-none relative z-10">
                            {post.content.split('\n\n').map((paragraph, i) => {
                                if (paragraph.startsWith('###')) {
                                    return (
                                        <h2 key={i} className="text-xl md:text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                                            <span className="w-1 h-6 bg-blue-500 rounded-full" />
                                            {paragraph.replace('### ', '')}
                                        </h2>
                                    );
                                }
                                if (paragraph.match(/^\d\./)) {
                                    return (
                                        <div key={i} className="my-8 p-6 rounded-2xl bg-white/5 border-l-4 border-blue-500/50 text-gray-200 leading-relaxed text-base md:text-lg font-semibold space-y-4 shadow-inner">
                                            {paragraph.split('\n').map((line, li) => (
                                                <div key={li} className="flex gap-3">
                                                    <span className="text-blue-400 font-black">{line.split('.')[0]}.</span>
                                                    <span>{line.split('.').slice(1).join('.')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return (
                                    <p key={i} className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 font-medium opacity-90 first-letter:text-3xl first-letter:font-bold first-letter:text-blue-400 first-letter:mr-1">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </article>
                    </LiquidContainer>

                    {/* Footer / Interaction */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16 pt-8 border-t border-white/10">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {post.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 uppercase tracking-widest hover:text-white hover:border-blue-500/50 transition-all cursor-default">
                                    <Tag className="w-3 h-3 text-blue-500" /> {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: post.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Article link copied to clipboard!");
                                }
                            }}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all group"
                        >
                            <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share Story
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
