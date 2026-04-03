import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import fitgame_login from "../../assets/images/Projects/Fitgame_Login.png";
import wii_menu from "../../assets/images/Nintendo/wii menu.jpg";


type ProjectCategory = "personal" | "professional";

type ProjectVisual = "abstract" | "image";

const projects = [
  {
    name: "SHADE",
    category: "professional" as ProjectCategory,
    visual: "abstract" as ProjectVisual,
    accent: "#52dbc2",
    visualLabel: "Synthetic traffic",
    type: "AI / Security",
    timeline: "2025 - 2026",
    summary: "Human-like network traffic for sharper cyber testing.",
    stack: ["Python", "Agents", "Simulation"]
  },
  {
    name: "knw.",
    category: "professional" as ProjectCategory,
    visual: "abstract" as ProjectVisual,
    accent: "#ffb087",
    visualLabel: "Audience signals",
    type: "Analytics / Full Stack",
    timeline: "2026 - Present",
    summary: "Live audience analytics built for event operators.",
    stack: ["TypeScript", "AWS", "Dashboards"]
  },
  {
    name: "FitGame",
    category: "personal" as ProjectCategory,
    visual: "image" as ProjectVisual,
    image: fitgame_login,
    imageAlt: "FitGame login screen",
    accent: "#62c3ff",
    visualLabel: "Gamified health",
    type: "Product / Mobile-style concept",
    timeline: "2024",
    summary: "Fitness tracking framed like a progression system.",
    stack: ["Product Design", "UX", "Game Loops"]
  },
  {
    name: "Wii Portfolio",
    category: "personal" as ProjectCategory,
    visual: "image" as ProjectVisual,
    image: wii_menu,
    imageAlt: "Wii-inspired menu interface",
    accent: "#83dbff",
    visualLabel: "Nintendo-inspired UI",
    type: "Frontend / Personal",
    timeline: "2025 - Present",
    summary: "A Nintendo-leaning portfolio with stronger 2D structure.",
    stack: ["React", "Motion", "UI Systems"]
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
  const activeProjectIndexLabel = String(activeProjectIndex + 1).padStart(2, "0");
  const activeTabLabel = activeTab === "personal" ? "Personal" : "Professional";

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


        <section className="projectsTopline">
          <div className="projectsHeadline">
            <p className="wiiEyebrow">Projects</p>
            <h1>{activeTabLabel} work.</h1>
          </div>

          <nav className="projectsCategoryNav" aria-label="Project categories">
            {projectTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`projectsCategoryButton ${activeTab === tab.id ? "active" : ""}`}
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

        <section className="aboutSectionStack aboutSectionViewport projectViewport">
          <div className="projectBackdropWord" aria-hidden="true">
            {activeTabLabel}
          </div>
          <div className="projectRowStage">
          <AnimatePresence initial={false} mode="wait" custom={projectDirection}>
            {activeProject ? (
              <motion.section
                key={`${activeTab}-${activeProject.name}`}
                className="projectShowcase"
                style={{ "--project-accent": activeProject.accent } as React.CSSProperties}
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
                <div className="projectStageMeta">
                  <span className="projectStageLabel">{activeProject.type}</span>
                  <span className="projectStageDivider" aria-hidden="true" />
                  <span>{activeProject.timeline}</span>
                </div>

                <div className="projectVisualCluster">
                  <div className="projectVisualGlow" aria-hidden="true" />
                  <span className="projectBackdropIndex" aria-hidden="true">
                    {activeProjectIndexLabel}
                  </span>
                  <div
                    className={`aboutSplitImage projectSplitImage ${
                      activeProject.visual === "abstract" ? "abstract" : ""
                    }`}
                  >
                    {activeProject.visual === "image" && activeProject.image ? (
                      <img src={activeProject.image} alt={activeProject.imageAlt} />
                    ) : (
                      <div className="projectAbstractArt" aria-hidden="true">
                        <span className="projectAbstractGrid" />
                        <span className="projectAbstractPulse projectAbstractPulseOne" />
                        <span className="projectAbstractPulse projectAbstractPulseTwo" />
                        <span className="projectAbstractArc projectAbstractArcOne" />
                        <span className="projectAbstractArc projectAbstractArcTwo" />
                        <span className="projectAbstractLabel">{activeProject.visualLabel}</span>
                      </div>
                    )}
                    <div className="projectImageCaption">
                      <span>{activeProject.visualLabel}</span>
                      <span>{activeProject.timeline}</span>
                    </div>
                  </div>
                </div>
                <div className="projectTextColumn">
                  <div className="projectHeading">
                    <h2>{activeProject.name}</h2>
                    <div className="projectMetaTrack">
                      <span className="projectMetaItem">
                        <span className="projectMetaDot" aria-hidden="true" />
                        {activeProject.visualLabel}
                      </span>
                      <span className="projectMetaItem">{activeTabLabel}</span>
                    </div>
                  </div>
                  <p className="projectSummary">{activeProject.summary}</p>
                  <div className="projectStackLine" aria-label="Project stack">
                    {activeProject.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  {filteredProjects.length > 1 ? (
                    <div className="projectRail" aria-label="Project navigation">
                      {filteredProjects.map((project, index) => (
                        <button
                          key={project.name}
                          type="button"
                          className={`projectRailButton ${
                            index === activeProjectIndex ? "active" : ""
                          }`}
                          onClick={() => jumpToProject(index)}
                          aria-label={`Go to ${project.name}`}
                        >
                          <span className="projectRailIndex">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="projectRailName">{project.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
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
