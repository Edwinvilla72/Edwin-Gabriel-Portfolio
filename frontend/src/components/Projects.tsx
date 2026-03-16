import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import fitgame_dashboard from "../../assets/images/Projects/Fitgame_Dashboard.png";


type ProjectCategory = "personal" | "professional";

const projects = [
  {
    name: "SHADE",
    category: "professional" as ProjectCategory,
    image: fitgame_dashboard,
    imageAlt: "SHADE project background",
    type: "AI / Security",
    timeline: "2025 - 2026",
    summary:
      "A project centered on realistic, human-like network traffic generation for more useful testing and simulation.",
    details:
      "Built multi-agent workflows to emulate adversarial network activity for cybersecurity testing and defense validation."
  },
  {
    name: "knw.",
    category: "professional" as ProjectCategory,
    image: fitgame_dashboard,
    imageAlt: "knw platform background",
    type: "Analytics / Full Stack",
    timeline: "2026 - Present",
    summary:
      "An AI-supported audience analytics platform for live events with real-time engagement and sentiment insights.",
    details:
      "Implemented dashboard features and AWS-backed data processing to surface attention and emotion signals for event operators."
  },
  {
    name: "FitGame",
    category: "personal" as ProjectCategory,
    image: fitgame_dashboard,
    imageAlt: "FitGame project concept background",
    type: "Product / Mobile-style concept",
    timeline: "2024",
    summary:
      "A gamified fitness tracker with quests, XP, and leaderboards designed to make consistency more engaging.",
    details:
      "Focused on retention loops, challenge systems, and progression mechanics to make daily exercise feel like leveling up in a game."
  },
  {
    name: "Wii Portfolio",
    category: "personal" as ProjectCategory,
    image: fitgame_dashboard,
    imageAlt: "Wii-inspired portfolio interface",
    type: "Frontend / Personal",
    timeline: "2025 - Present",
    summary:
      "An experimental portfolio combining a stylized Wii-inspired 3D layer with a stronger 2D dashboard foundation.",
    details:
      "Designed and iterated on interaction patterns, transitions, and visual systems to balance playful UI with practical navigation."
  }
];

const projectTabs: Array<{ id: ProjectCategory; label: string }> = [
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" }
];

const underlineTransition = {
  duration: 0.24,
  ease: [0.33, 1, 0.68, 1]
} as const;

const projectRowTransition = {
  initial: (direction: number) => ({ opacity: 0, y: direction > 0 ? 36 : -36 }),
  animate: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: direction > 0 ? -36 : 36 }),
  transition: { duration: 0.3, ease: "easeOut" }
} as const;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectCategory>("personal");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [projectDirection, setProjectDirection] = useState(1);
  const [projectIsTransitioning, setProjectIsTransitioning] = useState(false);
  const projectWheelLockRef = useRef(false);
  const projectWheelDeltaRef = useRef(0);
  const projectWheelResetTimeoutRef = useRef<number | null>(null);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === activeTab),
    [activeTab]
  );
  const activeProject = filteredProjects[activeProjectIndex] ?? filteredProjects[0];

  useEffect(() => {
    setActiveProjectIndex(0);
    setProjectDirection(1);
    setProjectIsTransitioning(false);
    projectWheelDeltaRef.current = 0;
    projectWheelLockRef.current = false;
  }, [activeTab]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 10 || filteredProjects.length < 2) {
        return;
      }

      event.preventDefault();

      if (projectWheelLockRef.current || projectIsTransitioning) {
        return;
      }

      projectWheelDeltaRef.current += event.deltaY;
      const threshold = 220;
      if (Math.abs(projectWheelDeltaRef.current) < threshold) {
        if (projectWheelResetTimeoutRef.current) {
          window.clearTimeout(projectWheelResetTimeoutRef.current);
        }
        projectWheelResetTimeoutRef.current = window.setTimeout(() => {
          projectWheelDeltaRef.current = 0;
          projectWheelResetTimeoutRef.current = null;
        }, 220);
        return;
      }

      const direction = projectWheelDeltaRef.current > 0 ? 1 : -1;
      projectWheelDeltaRef.current = 0;
      if (projectWheelResetTimeoutRef.current) {
        window.clearTimeout(projectWheelResetTimeoutRef.current);
        projectWheelResetTimeoutRef.current = null;
      }

      const next = Math.min(
        filteredProjects.length - 1,
        Math.max(0, activeProjectIndex + direction)
      );

      if (next === activeProjectIndex) {
        return;
      }

      projectWheelLockRef.current = true;
      setProjectIsTransitioning(true);
      setProjectDirection(direction);
      setActiveProjectIndex(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (projectWheelResetTimeoutRef.current) {
        window.clearTimeout(projectWheelResetTimeoutRef.current);
      }
      projectWheelResetTimeoutRef.current = null;
      projectWheelDeltaRef.current = 0;
      projectWheelLockRef.current = false;
    };
  }, [activeProjectIndex, filteredProjects.length, projectIsTransitioning]);

  const jumpToProject = (index: number) => {
    if (index === activeProjectIndex || projectIsTransitioning) {
      return;
    }
    setProjectDirection(index > activeProjectIndex ? 1 : -1);
    projectWheelDeltaRef.current = 0;
    if (projectWheelResetTimeoutRef.current) {
      window.clearTimeout(projectWheelResetTimeoutRef.current);
      projectWheelResetTimeoutRef.current = null;
    }
    projectWheelLockRef.current = true;
    setProjectIsTransitioning(true);
    setActiveProjectIndex(index);
  };

  const handleTabChange = (tab: ProjectCategory) => {
    if (tab === activeTab) {
      return;
    }
    setProjectDirection(1);
    setProjectIsTransitioning(false);
    projectWheelLockRef.current = false;
    projectWheelDeltaRef.current = 0;
    if (projectWheelResetTimeoutRef.current) {
      window.clearTimeout(projectWheelResetTimeoutRef.current);
      projectWheelResetTimeoutRef.current = null;
    }
    setActiveProjectIndex(0);
    setActiveTab(tab);
  };

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage projectsPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>


        <section className="aboutTopNavWrap" aria-label="Project categories">
          <nav className="aboutTopNav">
            {projectTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`aboutTopNavItem ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span>{tab.label}</span>
                <AnimatePresence initial={false}>
                  {activeTab === tab.id ? (
                    <motion.span
                      className="aboutTopNavUnderline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={underlineTransition}
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            ))}
          </nav>
        </section>

        {filteredProjects.length > 1 ? (
          <aside className="aboutRowNav" aria-label="Project row navigation">
            {filteredProjects.map((project, index) => (
              <button
                key={project.name}
                type="button"
                className={`aboutRowNavButton ${index === activeProjectIndex ? "active" : ""}`}
                onClick={() => jumpToProject(index)}
                aria-label={`Go to ${project.name}`}
              >
                <span className="aboutRowNavIndex">{index + 1}</span>
              </button>
            ))}
          </aside>
        ) : null}

        <section className="aboutSectionStack aboutSectionViewport projectViewport">
          <div className="projectRowStage">
          <AnimatePresence initial={false} mode="wait" custom={projectDirection}>
            {activeProject ? (
              <motion.section
                key={`${activeTab}-${activeProject.name}`}
                className="aboutSplitSection projectSplitSection"
                variants={projectRowTransition}
                custom={projectDirection}
                initial="initial"
                animate="animate"
                exit="exit"
                onAnimationStart={() => setProjectIsTransitioning(true)}
                onAnimationComplete={() => {
                  setProjectIsTransitioning(false);
                  projectWheelLockRef.current = false;
                }}
              >
                <div className="aboutSplitImage projectSplitImage">
                  <img src={activeProject.image} alt={activeProject.imageAlt} />
                </div>
                <div className="aboutSplitText">
                  <p className="wiiEyebrow">{activeProject.type}</p>
                  <h2>{activeProject.name}</h2>
                  <p>{activeProject.timeline}</p>
                  <br />
                  <p>{activeProject.summary}</p>
                  <br />
                  <p>{activeProject.details}</p>
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Projects;
