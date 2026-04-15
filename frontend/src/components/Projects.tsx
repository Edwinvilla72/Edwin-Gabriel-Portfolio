import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/styles.css";
import { categoryLabels, getProjectBySlug, projects } from "./projectsData";

const modalTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1]
} as const;

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
      <main className="portfolioPage projectsCataloguePage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/")}>
          Back to dashboard
        </button>

        <section className="wiiSportsFrame">
          <section className="wiiSportsFrameBody">
            <section className="projectsCatalogueHero">
              <div className="projectsHeadline">
                <p className="wiiEyebrow">Project Grid</p>
                <h1>Projects</h1>
                <p className="projectsCatalogueLead">Select any card to open project details.</p>
              </div>
              <div className="projectsCatalogueCount" aria-label={`${projects.length} projects`}>
                <strong>{projects.length}</strong>
                <span>Projects</span>
              </div>
            </section>

            <section className="projectsCatalogueGrid" aria-label="Project grid">
              {projects.map((project) => {
                const coverMedia = project.gallery?.[0];

                return (
                  <motion.button
                    key={project.slug}
                    type="button"
                    className="catalogueCard catalogueCardButton"
                    style={{ "--project-accent": project.accent } as React.CSSProperties}
                    onClick={() => openProject(project.slug)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <div className="catalogueCardMedia">
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

                    <div className="catalogueCardBody">
                      <div className="catalogueCardMeta">
                        <span className="catalogueCardCategory">
                          {categoryLabels[project.category]}
                        </span>
                        <span>{project.timeline}</span>
                      </div>
                      <div className="catalogueCardHeader">
                        <h2>{project.name}</h2>
                        <p>{project.type}</p>
                      </div>
                      <div className="catalogueCardTags" aria-label="Project stack">
                        {project.stack.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                      <div className="catalogueCardAction" aria-hidden="true">
                        Open details
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </section>
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
