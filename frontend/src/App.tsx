import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import WiiMenuPage from './pages/WiiMenuPage'
import AboutMePage from './pages/AboutMePage';
import BlogPage from './pages/BlogPage'
import PersonalBlog from "./components/blog/PersonalBlog";
import PersonalBlogPage from "./pages/PersonalBlog";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WiiMenuPage/>}/>
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/personal" element={<PersonalBlogPage/>} />

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
