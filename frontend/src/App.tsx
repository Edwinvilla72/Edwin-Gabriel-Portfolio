import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import './styles/styles.css';
import WiiMenuPage from './pages/WiiMenuPage'
import AboutMePage from './pages/AboutMePage';
import BlogPage from './pages/BlogPage'
import PersonalBlogPage from "./pages/PersonalBlog";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WiiMenuPage/>}/>
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/personal" element={<PersonalBlogPage/>} />
        <Route path="/contact" element={<ContactPage />} />

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
