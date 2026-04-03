import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import './styles/styles.css';
import WiiMenuPage from './pages/WiiMenuPage'
import AboutMePage from './pages/AboutMePage';
import BlogPage from './pages/BlogPage'
import PersonalBlogPage from "./pages/PersonalBlog";
import ProfessionalBlogPage from "./pages/ProfessionalBlog";
import PersonalBlogEntryPage from "./pages/PersonalBlogEntry";
import ProfessionalBlogEntryPage from "./pages/ProfessionalBlogEntry";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import InternshipPortfolioPage from "./pages/InternshipPortfolioPage";

const routeTransition = {
  initial: { opacity: 0, y: 18, scale: 0.992 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -14, scale: 0.996 },
  transition: {
    duration: 0.34,
    ease: [0.22, 1, 0.36, 1]
  }
} as const;

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={routeTransition.initial}
      animate={routeTransition.animate}
      exit={routeTransition.exit}
      transition={routeTransition.transition}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><WiiMenuPage /></PageTransition>}/>
        <Route path="/about" element={<PageTransition><AboutMePage /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route
          path="/internship-portfolio"
          element={<PageTransition><InternshipPortfolioPage /></PageTransition>}
        />
        <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
        <Route
          path="/blog/professional"
          element={<PageTransition><ProfessionalBlogPage /></PageTransition>}
        />
        <Route
          path="/blog/professional/:slug"
          element={<PageTransition><ProfessionalBlogEntryPage /></PageTransition>}
        />
        <Route
          path="/blog/personal"
          element={<PageTransition><PersonalBlogPage /></PageTransition>}
        />
        <Route
          path="/blog/personal/:slug"
          element={<PageTransition><PersonalBlogEntryPage /></PageTransition>}
        />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
