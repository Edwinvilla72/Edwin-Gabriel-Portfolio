import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const emailAddress = "edwin.villa2@icloud.com";
const githubUrl = "https://github.com/Edwinvilla72";
const linkedinUrl = "https://www.linkedin.com/in/edwin-villanueva/";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="siteFooterInner">
        <div className="siteFooterBrand">
          <p className="siteFooterEyebrow">Portfolio</p>
          <h2>Edwin Gabriel Villanueva</h2>
          <p>
            Full-stack developer building thoughtful frontend experiences, product-focused
            interfaces, and practical software systems.
          </p>
        </div>

        <nav className="siteFooterColumn" aria-label="Footer navigation">
          <p className="siteFooterHeading">Explore</p>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="siteFooterColumn">
          <p className="siteFooterHeading">Connect</p>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${emailAddress}`}>Email</a>
        </div>

        <div className="siteFooterColumn">
          <p className="siteFooterHeading">Elsewhere</p>
          <Link to="/projects">Featured Work</Link>
          <Link to="/contact">Work Together</Link>
        </div>
      </div>

      <div className="siteFooterBottom">
        <p>© {currentYear} Edwin Gabriel Villanueva. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
