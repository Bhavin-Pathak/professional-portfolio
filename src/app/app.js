import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme/theme-provider.js";

// Screens With Lazy Load 
import HomeView from "../views/HomeView.js";
import Footer from "../components/Footer.js";
const LoadingView = lazy(() => import("../views/LoadingView.js"));
const IntroView = lazy(() => import("../views/IntroView.js"));
const AboutView = lazy(() => import("../views/AboutView.js"));
const SkillsView = lazy(() => import("../views/SkillsView.js"));
const ExperienceView = lazy(() => import("../views/ExperienceView.js"));
const ProjectsView = lazy(() => import("../views/ProjectsView.js"));
const ContactView = lazy(() => import("../views/ContactView.js"));
const BlogView = lazy(() => import("../views/BlogView.js"));
const BlogDetailView = lazy(() => import("../views/BlogDetailView.js"));
const NotFoundView = lazy(() => import("../views/NotFoundView.js"));
const SplashCursor = lazy(() => import("../components/SplashCursor.js"));
const FollowCursor = lazy(() => import("../components/FollowCursor.js"));
const DigitalWarp = lazy(() => import("../components/DigitalWarp.js"));

export default function App() {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const { isDark, cycleMode } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isRoot) {
      setIsLoading(false);
      setShowIntro(false);
      setIsTransitioning(false);
    }
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 1024 ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isRoot]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (isRoot) setShowIntro(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIsTransitioning(true);
  };

  const handleWarpComplete = () => setIsTransitioning(false);

  const showThemeToggle = !isLoading && !showIntro && !isTransitioning;
  const ModeIcon = isDark ? Sun : Moon;
  const modeLabel = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";

  return (
    <>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden flex flex-col">
        {/* Global Background — adapts to theme */}
        <div className="fixed inset-0 bg-slate-50 dark:bg-black -z-50 transition-colors duration-300" />

        {/* Cursor Effects — Desktop only */}
        {!isMobile && (
          <Suspense fallback={null}>
            {showIntro ? <SplashCursor /> : !isLoading && <FollowCursor />}
          </Suspense>
        )}

        {/* ── Global Theme Toggle (3-way: dark / light / system) ── */}
        <AnimatePresence>
          {showThemeToggle && (
            <motion.button
              key="theme-toggle"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={cycleMode}
              aria-label={modeLabel}
              title={modeLabel}
              className="fixed top-3 right-4 md:top-3.5 md:right-8 z-50
                p-2 md:p-3 cursor-pointer
                backdrop-blur-3xl saturate-150
                bg-gray-100/80 dark:bg-black/30
                border border-gray-300/60 dark:border-white/10
                rounded-full
                text-gray-600 dark:text-white/90
                hover:text-gray-900 dark:hover:text-white
                hover:bg-gray-200/80 dark:hover:bg-white/10
                transition-colors duration-200"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ModeIcon className="w-5 h-5" />
                </motion.div>
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Animated Background Orbs — DARK MODE ONLY ── */}
        {isDark && !isLoading && !showIntro && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              animate={{ x: ["0vw", "20vw"], y: ["0vh", "30vh"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-purple-500/40 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ x: ["0vw", "-20vw"], y: ["0vh", "-30vh"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-cyan-500/40 rounded-full blur-[100px]"
            />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingView key="loading" onComplete={handleLoadingComplete} />
          ) : showIntro ? (
            <IntroView key="intro" onEnter={handleIntroComplete} />
          ) : isTransitioning ? (
            <div className="min-h-screen bg-black">
              <Suspense fallback={<div className="min-h-screen bg-black" />}>
                <DigitalWarp key="warp" onComplete={handleWarpComplete} />
              </Suspense>
            </div>
          ) : (
            <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-black" />}>
              <motion.div
                key="main-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="flex-grow flex flex-col min-h-screen"
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/about" element={<AboutView />} />
                  <Route path="/skills" element={<SkillsView />} />
                  <Route path="/experience" element={<ExperienceView />} />
                  <Route path="/projects" element={<ProjectsView />} />
                  <Route path="/contact" element={<ContactView />} />
                  <Route path="/blog" element={<BlogView />} />
                  <Route path="/blog/:id" element={<BlogDetailView />} />
                  <Route path="*" element={<NotFoundView />} />
                </Routes>
                <Footer />
              </motion.div>
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
