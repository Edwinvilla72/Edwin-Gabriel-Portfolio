import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/styles.css";
import { getProjectBySlug, projects } from "./projectsData";

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className="portfolioPageShell">
        <div className="portfolioPageBackdrop" />
        <main className="portfolioPage projectDetailPage">
          <button type="button" className="pageBackButton" onClick={() => navigate("/projects")}>
            Back to projects
          </button>
          <section className="projectDetailMissing">
            <p className="wiiEyebrow">Projects</p>
            <h1>Project not found.</h1>
            <Link to="/projects" className="catalogueCardLink">
              Return to catalogue
            </Link>
          </section>
        </main>
      </div>
    );
  }

  const relatedProjects = projects.filter(
    (entry) => entry.category === project.category && entry.slug !== project.slug
  );

  return (
    <div className="portfolioPageShell">
      <div className="portfolioPageBackdrop" />
      <main className="portfolioPage projectDetailPage">
        <button type="button" className="pageBackButton" onClick={() => navigate("/projects")}>
          Back to projects
        </button>

        <section className="wiiSportsFrame">
          <header className="wiiSportsFrameHeader">
            <div className="wiiSportsHeaderTab">Highlight Page</div>
            <div className="wiiSportsHeaderBrand">
              <span className="wiiSportsWordAccent">Projects</span>
            </div>
          </header>

          <section
            className="wiiSportsFrameBody"
            style={{ "--project-accent": project.accent } as React.CSSProperties}
          >
            <section className="projectDetailHero">
              <div className="projectDetailCopy">
                <p className="wiiEyebrow">
                  {project.category === "personal" ? "Personal" : "Professional"}
                </p>
                <h1>{project.name}</h1>
                <p className="projectDetailLead">{project.summary}</p>
                <div className="catalogueCardTags projectDetailTags">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="projectDetailMedia">
                {project.visual === "image" && project.image ? (
                  <img src={project.image} alt={project.imageAlt} className="projectDetailImage" />
                ) : (
                  <div className="projectAbstractArt projectDetailAbstractArt" aria-hidden="true">
                    <span className="projectAbstractGrid" />
                    <span className="projectAbstractPulse projectAbstractPulseOne" />
                    <span className="projectAbstractPulse projectAbstractPulseTwo" />
                    <span className="projectAbstractArc projectAbstractArcOne" />
                    <span className="projectAbstractArc projectAbstractArcTwo" />
                    <span className="projectAbstractLabel">{project.visualLabel}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="projectDetailInfoGrid">
              <article className="projectDetailPanel">
                <p className="projectDetailLabel">Overview</p>
                <h2>What it is</h2>
                <p>{project.overview}</p>
              </article>

              <article className="projectDetailPanel">
                <p className="projectDetailLabel">Challenge</p>
                <h2>What mattered</h2>
                <p>{project.challenge}</p>
              </article>

              <article className="projectDetailPanel">
                <p className="projectDetailLabel">Outcome</p>
                <h2>Where it landed</h2>
                <p>{project.outcome}</p>
              </article>

              <article className="projectDetailPanel projectDetailMetaPanel">
                <p className="projectDetailLabel">Details</p>
                <h2>Quick info</h2>
                <dl className="projectDetailMetaList">
                  <div>
                    <dt>Type</dt>
                    <dd>{project.type}</dd>
                  </div>
                  <div>
                    <dt>Timeline</dt>
                    <dd>{project.timeline}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{project.category}</dd>
                  </div>
                  <div>
                    <dt>Visual</dt>
                    <dd>{project.visualLabel}</dd>
                  </div>
                </dl>
              </article>
            </section>

            {relatedProjects.length > 0 ? (
              <section className="projectRelatedSection">
                <div className="dashboardSectionIntro">
                  <p className="wiiEyebrow">More in this lane</p>
                  <h2>Related projects.</h2>
                </div>
                <div className="projectsCatalogueGrid projectRelatedGrid">
                  {relatedProjects.map((entry) => (
                    <article
                      key={entry.slug}
                      className="catalogueCard"
                      style={{ "--project-accent": entry.accent } as React.CSSProperties}
                    >
                      <div className="catalogueCardBody">
                        <div className="catalogueCardMeta">
                          <span>{entry.type}</span>
                          <span>{entry.timeline}</span>
                        </div>
                        <h2>{entry.name}</h2>
                        <p>{entry.summary}</p>
                        <Link to={`/projects/${entry.slug}`} className="catalogueCardLink">
                          Open project
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </section>

          <footer className="wiiSportsFrameFooter">
            <div className="wiiSportsFooterTile">
              <span className="wiiSportsFooterLabel">Project</span>
              <strong>{project.name}</strong>
            </div>
            <div className="wiiSportsFooterTile">
              <span className="wiiSportsFooterLabel">Timeline</span>
              <strong>{project.timeline}</strong>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail;
