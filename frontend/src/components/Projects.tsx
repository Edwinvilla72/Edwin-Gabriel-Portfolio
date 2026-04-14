import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { projectTabs, projects, type ProjectCategory } from "./projectsData";

const underlineTransition = {
  duration: 0.24,
  ease: [0.33, 1, 0.68, 1]
} as const;

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectCategory>("personal");
  const [bouncingTab, setBouncingTab] = useState<ProjectCategory | null>(null);

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.category === activeTab),
    [activeTab]
  );

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage projectsCataloguePage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="wiiSportsFrame">
          <section className="wiiSportsFrameBody">
            <section className="projectsCatalogueHero">
              <div className="projectsHeadline">
                <h1>Projects</h1>
                <p className="projectsCatalogueLead">
                  Browse the work like a library shelf. Each project now has its own highlight
                  page with a clearer summary instead of being folded into one rotating screen.
                </p>
              </div>

              <nav className="projectsCategoryNav" aria-label="Project categories">
                {projectTabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    type="button"
                    className={`projectsCategoryButton ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setBouncingTab(tab.id);
                    }}
                    animate={
                      bouncingTab === tab.id
                        ? { scale: [1, 0.94, 1.07, 1] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 0.28,
                      times: [0, 0.35, 0.68, 1],
                      ease: "easeOut"
                    }}
                    onAnimationComplete={() => {
                      if (bouncingTab === tab.id) {
                        setBouncingTab(null);
                      }
                    }}
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
                  </motion.button>
                ))}
              </nav>
            </section>

            <section className="projectsCatalogueGrid" aria-label={`${activeTab} projects`}>
              {filteredProjects.map((project) => (
                <article
                  key={project.slug}
                  className="catalogueCard"
                  style={{ "--project-accent": project.accent } as React.CSSProperties}
                >
                  <div className="catalogueCardMedia">
                    {project.visual === "image" && project.image ? (
                      <img src={project.image} alt={project.imageAlt} className="catalogueCardImage" />
                    ) : (
                      <div className="projectAbstractArt catalogueAbstractArt" aria-hidden="true">
                        <span className="projectAbstractGrid" />
                        <span className="projectAbstractPulse projectAbstractPulseOne" />
                        <span className="projectAbstractPulse projectAbstractPulseTwo" />
                        <span className="projectAbstractArc projectAbstractArcOne" />
                        <span className="projectAbstractArc projectAbstractArcTwo" />
                        <span className="projectAbstractLabel">{project.visualLabel}</span>
                      </div>
                    )}
                  </div>

                  <div className="catalogueCardBody">
                    <div className="catalogueCardMeta">
                      <span>{project.type}</span>
                      <span>{project.timeline}</span>
                    </div>
                    <h2>{project.name}</h2>
                    <p>{project.summary}</p>
                    <div className="catalogueCardTags" aria-label="Project stack">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <Link to={`/projects/${project.slug}`} className="catalogueCardLink">
                      Open project
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Projects;
