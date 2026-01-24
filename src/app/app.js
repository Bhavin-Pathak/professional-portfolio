import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DigitalWarp from "../components/DigitalWarp.js";



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

  return (
    <>
      <div className="min-h-screen text-gray-100 overflow-x-hidden flex flex-col">
        {/* Global Background Layer */}
        <div className="fixed inset-0 bg-black -z-50" />
        {/* Interactive Cursor Effects - Disabled on Mobile/Tablet for performance */}
        {!isMobile && (
          <Suspense fallback={null}>
            {showIntro ? <SplashCursor /> : !isLoading && <FollowCursor />}
          </Suspense>
        )}
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
              className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-purple-500/40 rounded-full blur-[100px]"
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
              <DigitalWarp key="warp" onComplete={handleWarpComplete} />
            </div>
          ) : (
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
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
