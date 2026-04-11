import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

type ChannelLink = {
  label: string;
  path: string;
  match: (pathname: string) => boolean;
};

const channelLinks: ChannelLink[] = [
  {
    label: "Home",
    path: "/",
    match: (pathname) => pathname === "/"
  },
  {
    label: "About",
    path: "/about",
    match: (pathname) => pathname === "/about"
  },
  {
    label: "Projects",
    path: "/projects",
    match: (pathname) => pathname === "/projects" || Boolean(matchPath("/projects/:slug", pathname))
  },
  {
    label: "Internship",
    path: "/internship-portfolio",
    match: (pathname) => pathname === "/internship-portfolio"
  },
  {
    label: "Blog",
    path: "/blog",
    match: (pathname) => pathname.startsWith("/blog")
  },
  {
    label: "Contact",
    path: "/contact",
    match: (pathname) => pathname === "/contact"
  }
];

const tabTransition = {
  initial: { x: -44, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -44, opacity: 0 },
  transition: { duration: 0.24, ease: [0.33, 1, 0.68, 1] }
} as const;

const getChannelTitle = (pathname: string) => {
  if (pathname === "/") {
    return "Home Menu";
  }

  if (pathname === "/about") {
    return "About Me";
  }

  if (pathname === "/projects" || matchPath("/projects/:slug", pathname)) {
    return "Projects";
  }

  if (pathname === "/internship-portfolio") {
    return "Internship";
  }

  if (pathname.startsWith("/blog")) {
    return "Blog";
  }

  if (pathname === "/contact") {
    return "Contact";
  }

  return "Channel";
};

const ChannelNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const channelTitle = getChannelTitle(location.pathname);

  const goToChannel = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
  };

  return (
    <header className="landingNav">
      <div className="landingNavBrandWrap">
        <div className="landingNavTab" aria-live="polite">
          <div className="landingNavTabViewport">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={channelTitle}
                className="landingNavTabLabel"
                initial={tabTransition.initial}
                animate={tabTransition.animate}
                exit={tabTransition.exit}
                transition={tabTransition.transition}
              >
                {channelTitle}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="landingNavBrand">
          <span className="landingNavBrandPrimary">Edwin_</span>
          <span className="landingNavBrandAccent"> Gabriel</span>
        </div>
      </div>

      <nav className="landingNavLinks" aria-label="Portfolio channels">
        {channelLinks.map((link) => (
          <button
            key={link.path}
            type="button"
            className={link.match(location.pathname) ? "active" : ""}
            onClick={() => goToChannel(link.path)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default ChannelNavbar;
