import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import { categoryLabels, getProjectBySlug, projects, type ProjectCategory } from "./projectsData";

const modalTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1]
} as const;

const featuredProjectSlugs = ["intelligent-browser-agents", "knw", "updated-personal-portfolio"];
const categoryOrder: ProjectCategory[] = ["professional", "personal", "academic"];

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const selectedSlug = searchParams.get("project");
  const selectedProject = selectedSlug ? getProjectBySlug(selectedSlug) : undefined;

  const selectedGallery = useMemo(
    () => selectedProject?.gallery ?? [],
    [selectedProject]
  );

  const featuredProjects = useMemo(
    () =>
      featuredProjectSlugs
        .map((slug) => getProjectBySlug(slug))
        .filter((project): project is NonNullable<typeof project> => Boolean(project)),
    []
  );

  const groupedProjects = useMemo(
    () =>
      categoryOrder.map((category) => ({
        category,
        label: categoryLabels[category],
        projects: projects.filter((project) => project.category === category)
      })),
    []
  );

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [selectedSlug]);

  useEffect(() => {
    if (!selectedSlug || selectedProject) {
      return;
    }

    setSearchParams({});
  }, [selectedProject, selectedSlug, setSearchParams]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchParams({});
      }

      if (selectedGallery.length > 1 && event.key === "ArrowRight") {
        setActiveMediaIndex((current) => (current + 1) % selectedGallery.length);
      }

      if (selectedGallery.length > 1 && event.key === "ArrowLeft") {
        setActiveMediaIndex((current) => (current - 1 + selectedGallery.length) % selectedGallery.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGallery.length, selectedProject, setSearchParams]);

  const openProject = (slug: string) => {
    setSearchParams({ project: slug });
  };

  const closeProject = () => {
    setSearchParams({});
  };

  const showPreviousMedia = () => {
    if (selectedGallery.length <= 1) {
      return;
    }

    setActiveMediaIndex((current) => (current - 1 + selectedGallery.length) % selectedGallery.length);
  };

  const showNextMedia = () => {
    if (selectedGallery.length <= 1) {
      return;
    }

    setActiveMediaIndex((current) => (current + 1) % selectedGallery.length);
  };

  const activeMedia = selectedGallery[activeMediaIndex];

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage projectsCataloguePage projectsDashboardPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="wiiSportsFrame">
          <section className="wiiSportsFrameBody projectsDashboardBody">
            <section className="dashboardHeroBand projectsDashboardHero">
              <article className="dashboardHeroMain projectsDashboardHeroMain">
                <p className="wiiEyebrow">Project Dashboard</p>
                <h1>Projects</h1>
                <p className="projectsDashboardLead">
                  Browse selected work by category and open any project for more detail.
                </p>
                <div className="dashboardHeroActions">
                  <button type="button" onClick={() => openProject(featuredProjects[0]?.slug ?? projects[0].slug)}>
                    Open project
                  </button>
                  <button type="button" onClick={() => navigate("/")}>
                    Back to home
                  </button>
                </div>
              </article>

              <aside className="dashboardHeroAside projectsDashboardHeroAside">
                <div className="projectsDashboardStatCard">
                  <span className="projectsDashboardStatLabel">Total projects</span>
                  <strong>{projects.length}</strong>
                  <p>Professional, personal, and academic work.</p>
                </div>
                <div className="projectsDashboardStatGrid">
                  {groupedProjects.map((group) => (
                    <article key={group.category} className="projectsDashboardMiniStat">
                      <span>{group.label}</span>
                      <strong>{group.projects.length}</strong>
                    </article>
                  ))}
                </div>
              </aside>
            </section>

            <section className="dashboardSection projectsDashboardSection" aria-label="Featured projects">
              <div className="dashboardSectionHeaderRow">
                <div className="dashboardSectionIntro">
                  <h2>Featured projects</h2>
                  <p>Selected work.</p>
                </div>
              </div>

              <div className="dashboardProjectRow projectsDashboardGrid projectsDashboardGridFeatured">
                {featuredProjects.map((project) => {
                  const coverMedia = project.gallery?.[0];

                  return (
                    <motion.button
                      key={project.slug}
                      type="button"
                      className="dashboardProjectCard projectsDashboardCard"
                      style={{ "--project-accent": project.accent } as React.CSSProperties}
                      onClick={() => openProject(project.slug)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <div className="projectsDashboardCardMedia">
                        {coverMedia ? (
                          <img src={coverMedia.src} alt={coverMedia.alt} className="catalogueCardImage" />
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
                      <div className="projectsDashboardCardContent">
                        <div className="projectsDashboardCardMeta">
                          <p>{project.type}</p>
                          <span>{project.timeline}</span>
                        </div>
                        <h3>{project.name}</h3>
                        <span>{project.description}</span>
                        <div className="catalogueCardTags" aria-label="Project stack">
                          {project.stack.slice(0, 4).map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                        <div className="projectsDashboardCardFooter">
                          <span className="projectsDashboardCategoryPill">
                            {categoryLabels[project.category]}
                          </span>
                          <span className="catalogueCardAction" aria-hidden="true">
                            Open details
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {groupedProjects.map((group) => (
              <section
                key={group.category}
                className="dashboardSection projectsDashboardSection"
                aria-label={`${group.label} projects`}
              >
                <div className="dashboardSectionHeaderRow">
                  <div className="dashboardSectionIntro">
                    <h2>{group.label} projects</h2>
                    <p>
                      {group.category === "professional"
                        ? "Product, platform, and internal tool work."
                        : group.category === "personal"
                          ? "Independent builds and experiments."
                          : "Coursework and capstone projects."}
                    </p>
                  </div>
                  <div className="projectsDashboardSectionCount">
                    <strong>{group.projects.length}</strong>
                    <span>Entries</span>
                  </div>
                </div>

                <div className="dashboardProjectRow projectsDashboardGrid" aria-label={`${group.label} project cards`}>
                  {group.projects.map((project) => {
                    const coverMedia = project.gallery?.[0];

                    return (
                      <motion.button
                        key={project.slug}
                        type="button"
                        className="dashboardProjectCard projectsDashboardCard"
                        style={{ "--project-accent": project.accent } as React.CSSProperties}
                        onClick={() => openProject(project.slug)}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <div className="projectsDashboardCardMedia">
                          {coverMedia ? (
                            <img src={coverMedia.src} alt={coverMedia.alt} className="catalogueCardImage" />
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
                        <div className="projectsDashboardCardContent">
                          <div className="projectsDashboardCardMeta">
                            <p>{project.type}</p>
                            <span>{project.timeline}</span>
                            {project.role ? <span>{project.role}</span> : null}
                          </div>
                          <h3>{project.name}</h3>
                          <span>{project.description}</span>
                          <div className="catalogueCardTags" aria-label="Project stack">
                            {project.stack.slice(0, 4).map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                          <div className="projectsDashboardCardFooter">
                            <span className="projectsDashboardCategoryPill">
                              {project.visualLabel}
                            </span>
                            <span className="catalogueCardAction" aria-hidden="true">
                              Open details
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>
        </section>

        <AnimatePresence>
          {selectedProject ? (
            <>
              <motion.button
                type="button"
                className="projectModalBackdrop"
                aria-label="Close project details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={modalTransition}
                onClick={closeProject}
              />

              <motion.section
                className="projectModalShell"
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.985 }}
                transition={modalTransition}
              >
                <div
                  className="projectModal"
                  style={{ "--project-accent": selectedProject.accent } as React.CSSProperties}
                >
                  <header className="projectModalHeader">
                    <div className="projectModalTitleGroup">
                      <p className="wiiEyebrow">{categoryLabels[selectedProject.category]}</p>
                      <h2 id="project-modal-title">{selectedProject.name}</h2>
                    </div>
                    <button type="button" className="projectModalCloseButton" onClick={closeProject}>
                      Close
                    </button>
                  </header>

                  <div className="projectModalBody">
                    <section className="projectModalGalleryPanel">
                      <div className="projectModalMediaFrame">
                        {activeMedia ? (
                          <img
                            src={activeMedia.src}
                            alt={activeMedia.alt}
                            className="projectModalImage"
                          />
                        ) : (
                          <div className="projectAbstractArt projectModalAbstractArt" aria-hidden="true">
                            <span className="projectAbstractGrid" />
                            <span className="projectAbstractPulse projectAbstractPulseOne" />
                            <span className="projectAbstractPulse projectAbstractPulseTwo" />
                            <span className="projectAbstractArc projectAbstractArcOne" />
                            <span className="projectAbstractArc projectAbstractArcTwo" />
                            <span className="projectAbstractLabel">{selectedProject.visualLabel}</span>
                          </div>
                        )}
                      </div>

                      {selectedGallery.length > 1 ? (
                        <div className="projectModalGalleryControls">
                          <button type="button" onClick={showPreviousMedia}>
                            Left
                          </button>
                          <span>
                            {activeMediaIndex + 1} / {selectedGallery.length}
                          </span>
                          <button type="button" onClick={showNextMedia}>
                            Right
                          </button>
                        </div>
                      ) : null}
                    </section>

                    <section className="projectModalContent">
                      <div className="projectModalMeta">
                        <span>{selectedProject.type}</span>
                        <span>{selectedProject.timeline}</span>
                        {selectedProject.role ? <span>{selectedProject.role}</span> : null}
                      </div>

                      <article className="projectModalPanel">
                        <p className="projectDetailLabel">Description</p>
                        <div className="projectModalDescription">{selectedProject.description}</div>
                      </article>

                      {selectedProject.responsibilities?.length ? (
                        <article className="projectModalPanel">
                          <p className="projectDetailLabel">Responsibilities</p>
                          <div className="catalogueCardTags">
                            {selectedProject.responsibilities.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </article>
                      ) : null}

                      <article className="projectModalPanel">
                        <p className="projectDetailLabel">Tech Stack</p>
                        <div className="catalogueCardTags">
                          {selectedProject.stack.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                      </article>

                      {selectedProject.projectLinks?.length ? (
                        <div className="projectModalLinks">
                          {selectedProject.projectLinks.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="catalogueCardLink projectModalLink"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </section>
                  </div>
                </div>
              </motion.section>
            </>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Projects;
