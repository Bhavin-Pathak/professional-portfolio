import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DigitalWarp from "../components/DigitalWarp.js";
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
// Animations and Cursor Effect (Lazy Load)
const SplashCursor = lazy(() => import("../components/SplashCursor.js"));
const FollowCursor = lazy(() => import("../components/FollowCursor.js"));

export default function App() {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const { isDark, toggleTheme } = useTheme();

  // If not root, skip the intro sequence for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // If we land on a subpage directly, skip the splash/intro
    if (!isRoot) {
      setIsLoading(false);
      setShowIntro(false);
      setIsTransitioning(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isRoot]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (isRoot) {
      setShowIntro(true);
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIsTransitioning(true);
  };

  const handleWarpComplete = () => {
    setIsTransitioning(false);
  };

  // Show theme toggle after loading and intro are done
  const showThemeToggle = !isLoading && !showIntro && !isTransitioning;

  return (
    <>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden flex flex-col">
        {/* Global Background Layer — adapts to theme */}
        <div className="fixed inset-0 bg-slate-50 dark:bg-black -z-50 transition-colors duration-300" />

        {/* Interactive Cursor Effects - Disabled on Mobile/Tablet for performance */}
        {!isMobile && (
          <Suspense fallback={null}>
            {showIntro ? <SplashCursor /> : !isLoading && <FollowCursor />}
          </Suspense>
        )}

        {/* Global Theme Toggle Button — appears after loading/intro/warp */}
        <AnimatePresence>
          {showThemeToggle && (
            <motion.button
              key="theme-toggle"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="fixed top-3 right-4 md:top-3.5 md:right-8 z-50
                p-2 md:p-3
                backdrop-blur-3xl saturate-150
                bg-black/5 dark:bg-black/30
                border border-black/10 dark:border-white/10
                rounded-full
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
                text-gray-700 dark:text-white/90
                hover:text-black dark:hover:text-white
                hover:bg-black/10 dark:hover:bg-white/10
                transition-colors duration-300
                cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Global Background Elements (Animated Orbs) - Hidden on Loading, Intro Page and Transition */}
        {!isLoading && !showIntro && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          >
            {/* Purple Orb: Moves from Top-Left to Bottom-Right */}
            <motion.div
              animate={{
                x: ["0vw", "20vw"],
                y: ["0vh", "30vh"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-purple-500/15 dark:bg-purple-500/40 rounded-full blur-[100px] transition-colors duration-300"
            />
            {/* Cyan Orb: Moves from Bottom-Right to Top-Left */}
            <motion.div
              animate={{
                x: ["0vw", "-20vw"],
                y: ["0vh", "-30vh"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-cyan-500/15 dark:bg-cyan-500/40 rounded-full blur-[100px] transition-colors duration-300"
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
              <DigitalWarp key="warp" onComplete={handleWarpComplete} />
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
