import React, { useEffect, useState } from "react";
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
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -360, opacity: 0 },
  transition: { duration: 0.2, ease: [0.4, 1, 1, 1] }
} as const;
 
const mobileMenuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.06,
      delayChildren: 0.03
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.16,
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.04,
      staggerDirection: -1
    }
  }
} as const;

const mobileMenuItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.33, 1, 0.68, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12, ease: [0.33, 1, 0.68, 1] } }
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompactNav, setIsCompactNav] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const syncCompactNav = (event?: MediaQueryListEvent) => {
      const matches = event?.matches ?? mediaQuery.matches;
      setIsCompactNav(matches);

      if (!matches) {
        setMenuOpen(false);
      }
    };

    syncCompactNav();
    mediaQuery.addEventListener("change", syncCompactNav);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactNav);
    };
  }, []);

  const goToChannel = (path: string) => {
    setMenuOpen(false);

    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
  };

  return (
    <header className={`landingNav ${menuOpen ? "menuOpen" : ""} ${isCompactNav ? "compactNav" : ""}`}>
      <div className="landingNavBrandWrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={channelTitle}
            className="landingNavTab"
            aria-live="polite"
            initial={tabTransition.initial}
            animate={tabTransition.animate}
            exit={tabTransition.exit}
            transition={tabTransition.transition}
          >
            <div className="landingNavTabViewport">
              <span className="landingNavTabLabel">{channelTitle}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="landingNavBrand">
          <span className="landingNavBrandPrimary">Edwin_</span>
          <span className="landingNavBrandAccent"> Gabriel</span>
        </div>

        {isCompactNav ? (
          <button
            type="button"
            className="landingNavMenuToggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="portfolio-channel-nav"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        ) : null}
      </div>

      {isCompactNav ? (
        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              key="mobile-nav"
              id="portfolio-channel-nav"
              className="landingNavMobileMenu"
              aria-label="Portfolio channels"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {channelLinks.map((link) => (
                <motion.button
                  key={link.path}
                  type="button"
                  className={`landingNavMobileMenuItem ${link.match(location.pathname) ? "active" : ""}`}
                  onClick={() => goToChannel(link.path)}
                  variants={mobileMenuItemVariants}
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      ) : (
        <nav
          id="portfolio-channel-nav"
          className="landingNavLinks"
          aria-label="Portfolio channels"
        >
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
      )}
    </header>
  );
};

export default ChannelNavbar;
